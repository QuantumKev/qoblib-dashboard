"""Local API for IBM Quantum connection and QOBLIB result verification.

Credentials are kept in memory only for the server process — never written to disk.
Run: uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import json
import math
import os
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from portfolio_qubo import solve_simulated_annealing
from problem_ids import find_submission
from qubo_parser import load_qs

ROOT = Path(__file__).resolve().parent.parent
QS_ROOT = ROOT / "data" / "qoblib" / "06-portfolio" / "models" / "unconstrained_quadratic_optimization" / "qs_files"
CATALOG_PATH = ROOT / "public" / "data" / "qubo-catalog.json"
BASELINES_PATH = ROOT / "public" / "data" / "baselines.json"

app = FastAPI(title="QOBLIB Quantum Lab API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session (single-user local lab)
_session: dict[str, Any] = {}


class IBMConnectRequest(BaseModel):
    token: str = Field(min_length=8)
    crn: str = Field(min_length=10, description="IBM Quantum instance CRN")
    channel: str = Field(default="ibm_quantum_platform")


class IBMRunRequest(BaseModel):
    token: str
    crn: str
    channel: str = "ibm_quantum_platform"
    backend: str = Field(description="Backend name or 'simulator'")
    shots: int = Field(default=1024, ge=100, le=10000)
    reps: int = Field(default=2, ge=1, le=5)


class VerifyRequest(BaseModel):
    problem_id: str
    objective: float
    reference_objective: float | None = None
    runtime_sec: float | None = None


class QuboSolveRequest(BaseModel):
    qs_path: str = Field(description="Relative path under qs_files/, e.g. a050_t15_s02_b020/uqo_....qs.xz")
    iterations: int = Field(default=6000, ge=500, le=50000)
    seed: int | None = None


def _load_catalog() -> dict:
    if not CATALOG_PATH.is_file():
        raise HTTPException(status_code=404, detail="QUBO catalog missing — run: npm run ingest:qubo")
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def _load_baselines() -> dict:
    if not BASELINES_PATH.is_file():
        return {"submissions": []}
    return json.loads(BASELINES_PATH.read_text(encoding="utf-8"))


def _find_baseline(problem_id: str, *, solver: str | None = None) -> dict | None:
    return find_submission(_load_baselines().get("submissions", []), problem_id, solver=solver)


def _resolve_qs_path(qs_path: str) -> Path:
    rel = qs_path.replace("\\", "/").lstrip("/")
    if ".." in rel.split("/"):
        raise HTTPException(status_code=400, detail="Invalid qs_path")
    full = QS_ROOT / rel
    if not full.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"QUBO file not found locally. Run: python scripts/fetch_qubo_files.py --folder {rel.split('/')[0]}",
        )
    return full


def _get_service(token: str, crn: str, channel: str):
    try:
        from qiskit_ibm_runtime import QiskitRuntimeService
    except ImportError as exc:
        raise HTTPException(status_code=500, detail="Install server deps: pip install -r server/requirements.txt") from exc

    return QiskitRuntimeService(channel=channel, token=token, instance=crn)


def _demo_qaoa_circuit(reps: int = 2):
    """Small 4-node ring MaxCut/QUBO demo (~4 qubits) suitable for real QPU warmup."""
    try:
        from qiskit.circuit.library import QAOAAnsatz
        from qiskit.quantum_info import SparsePauliOp
    except ImportError as exc:
        raise HTTPException(status_code=500, detail="Qiskit not installed") from exc

    # 4-node ring MaxCut: edges (0,1), (1,2), (2,3), (3,0)
    cost = SparsePauliOp.from_list([
        ("ZZII", 0.5),
        ("IZZI", 0.5),
        ("IIZZ", 0.5),
        ("ZIZI", 0.5),
    ])
    ansatz = QAOAAnsatz(cost, reps=reps)
    return ansatz, cost


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "qoblib-quantum-lab"}


@app.post("/api/ibm/connect")
def ibm_connect(body: IBMConnectRequest):
    try:
        service = _get_service(body.token, body.crn, body.channel)
        backends = service.backends()
        operational = [b.name for b in backends if getattr(b, "status", None) and b.status().operational]
        _session["token"] = body.token
        _session["crn"] = body.crn
        _session["channel"] = body.channel
        return {
            "connected": True,
            "instance": body.crn,
            "backendCount": len(backends),
            "operationalBackends": operational[:20],
            "message": f"Connected. {len(operational)} operational backend(s) available.",
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"IBM Quantum connection failed: {exc}") from exc


@app.post("/api/ibm/run-demo")
def ibm_run_demo(body: IBMRunRequest):
    """Run a small QAOA demo (QOBLIB workforce warmup — 4-qubit ring MaxCut)."""
    t0 = time.perf_counter()
    ansatz, cost = _demo_qaoa_circuit(body.reps)

    try:
        if body.backend.lower() in {"simulator", "aer", "local"}:
            from qiskit_aer import AerSimulator
            from qiskit import transpile

            qc = ansatz.assign_parameters([0.6] * ansatz.num_parameters)
            qc.measure_all()
            sim = AerSimulator()
            compiled = transpile(qc, sim)
            result = sim.run(compiled, shots=body.shots).result()
            counts = result.get_counts()
        else:
            from qiskit_ibm_runtime import SamplerV2 as Sampler
            from qiskit import transpile

            service = _get_service(body.token, body.crn, body.channel)
            backend = service.backend(body.backend)
            qc = ansatz.assign_parameters([0.6] * ansatz.num_parameters)
            qc.measure_all()
            compiled = transpile(qc, backend)
            sampler = Sampler(backend)
            job = sampler.run([compiled], shots=body.shots)
            pub_result = job.result()[0]
            counts = pub_result.join_data().get_counts()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Job failed: {exc}") from exc

    elapsed = time.perf_counter() - t0
    best_bitstring = max(counts, key=counts.get)
    best_energy = _estimate_energy(best_bitstring, cost)

    return {
        "jobType": "QAOA demo (4-qubit ring MaxCut)",
        "qubits": ansatz.num_qubits,
        "backend": body.backend,
        "shots": body.shots,
        "reps": body.reps,
        "runtimeSec": round(elapsed, 3),
        "bestBitstring": best_bitstring,
        "bestEnergyEstimate": best_energy,
        "topCounts": dict(sorted(counts.items(), key=lambda x: -x[1])[:8]),
        "note": "Portfolio-scale QOBLIB instances require hybrid/classical workflows. This demo validates IBM connectivity for workforce labs.",
    }


def _estimate_energy(bitstring: str, cost) -> float:
    try:
        from qiskit.quantum_info import Statevector

        n = len(bitstring)
        amp = 1.0
        sv = Statevector.from_label(bitstring[::-1])
        return float(sv.expectation_value(cost).real)
    except Exception:
        return float("nan")


@app.post("/api/verify/compare")
def verify_compare(body: VerifyRequest):
    """Compare a learner's objective value against a QOBLIB reference submission."""
    ref = body.reference_objective
    if ref is None:
        return {
            "problemId": body.problem_id,
            "yourObjective": body.objective,
            "referenceObjective": None,
            "gapPct": None,
            "verdict": "no_reference",
            "message": "Provide a reference objective from the baseline panel to score this run.",
        }

    if ref == 0:
        gap = 0.0 if body.objective == ref else float("inf")
    else:
        gap = abs((body.objective - ref) / ref) * 100

    if gap <= 1:
        verdict = "excellent"
        msg = "Within 1% of the QOBLIB reference — matches published benchmark quality."
    elif gap <= 5:
        verdict = "good"
        msg = "Within 5% of reference — competitive heuristic result."
    elif gap <= 15:
        verdict = "fair"
        msg = "Within 15% — feasible direction but not matching state-of-the-art."
    else:
        verdict = "needs_improvement"
        msg = "Gap exceeds 15% — review formulation, lambda, or hardware shots/reps."

    return {
        "problemId": body.problem_id,
        "yourObjective": body.objective,
        "referenceObjective": ref,
        "gapPct": round(gap, 4) if math.isfinite(gap) else None,
        "verdict": verdict,
        "message": msg,
        "yourRuntimeSec": body.runtime_sec,
    }


@app.get("/api/verify/paper-table6")
def paper_table6():
    """Paper Table 6 — Gurobi vs ABS2 on po_a050_t15_s00 (reference for workforce verification)."""
    return {
        "instance": "po_a050_t15_s00",
        "problemPrefix": "a050_t15_s00_b020",
        "rows": [
            {"lambda": 0, "gurobiObjective": -879572, "gurobiRuntimeSec": 0.4, "gurobiGapPct": 0.0, "abs2Objective": -879572, "abs2RuntimeSec": 90.0, "abs2GapPct": 0.0},
            {"lambda": 0.000001, "gurobiObjective": -872055, "gurobiRuntimeSec": 398.7, "gurobiGapPct": 0.01, "abs2Objective": -872055, "abs2RuntimeSec": 79.1, "abs2GapPct": 0.0},
            {"lambda": 0.00001, "gurobiObjective": -819899, "gurobiRuntimeSec": 3600.1, "gurobiGapPct": 8.21, "abs2Objective": -819899, "abs2RuntimeSec": 30.2, "abs2GapPct": 0.0},
            {"lambda": 0.00005, "gurobiObjective": -680124, "gurobiRuntimeSec": 3600.2, "gurobiGapPct": 1.8, "abs2Objective": -680124, "abs2RuntimeSec": 50.7, "abs2GapPct": 0.0},
            {"lambda": 0.0001, "gurobiObjective": -586823, "gurobiRuntimeSec": 3600.2, "gurobiGapPct": 3.01, "abs2Objective": -586823, "abs2RuntimeSec": 206.7, "abs2GapPct": 0.0},
            {"lambda": 0.0005, "gurobiObjective": -386990, "gurobiRuntimeSec": 3600.1, "gurobiGapPct": 9.8, "abs2Objective": -384862, "abs2RuntimeSec": 1497.6, "abs2GapPct": 0.55},
            {"lambda": 0.001, "gurobiObjective": -314736, "gurobiRuntimeSec": 3600.2, "gurobiGapPct": 16.9, "abs2Objective": -299298, "abs2RuntimeSec": 741.9, "abs2GapPct": 4.91},
            {"lambda": 0.01, "gurobiObjective": -437920, "gurobiRuntimeSec": 3661.8, "gurobiGapPct": 99.35, "abs2Objective": -2825, "abs2RuntimeSec": 1510.8, "abs2GapPct": 99.35},
        ],
    }


@app.get("/api/portfolio/qubo-catalog")
def qubo_catalog():
    catalog = _load_catalog()
    local_count = sum(1 for e in catalog.get("entries", []) if e.get("localAvailable"))
    return {**catalog, "localAvailableCount": local_count}


@app.post("/api/portfolio/solve-qubo")
def solve_qubo(body: QuboSolveRequest):
    """Classical simulated annealing on official QOBLIB .qs.xz files (a010/a050 scale)."""
    full_path = _resolve_qs_path(body.qs_path)
    t0 = time.perf_counter()
    try:
        model = load_qs(full_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse QUBO: {exc}") from exc

    load_sec = time.perf_counter() - t0
    result = solve_simulated_annealing(model, iterations=body.iterations, seed=body.seed)

    catalog_entry = next(
        (e for e in _load_catalog().get("entries", []) if e.get("qsPath") == body.qs_path.replace("\\", "/")),
        {},
    )
    problem_id = catalog_entry.get("problemId", "")
    abs2 = _find_baseline(problem_id, solver="ABS2") if problem_id else None
    gurobi = _find_baseline(problem_id, solver="Gurobi") if problem_id else None
    baseline = abs2 or gurobi

    verification = None
    if baseline and baseline.get("objective") is not None:
        ref = float(baseline["objective"])
        gap = abs((result.objective - ref) / ref) * 100 if ref else None
        verification = {
            "problemId": problem_id,
            "referenceObjective": ref,
            "referenceSolver": baseline.get("solver"),
            "referenceModel": baseline.get("model"),
            "referenceRuntimeSec": baseline.get("totalRuntimeSec"),
            "gapPct": round(gap, 4) if gap is not None and math.isfinite(gap) else None,
            "gurobiObjective": float(gurobi["objective"]) if gurobi and gurobi.get("objective") is not None else None,
            "conventionNote": (
                "QUBO/UQO submissions (ABS2) report positive objectives (offset − energy). "
                "Gurobi MIP/BQP submissions report negative economic objectives."
            ),
        }

    return {
        "qsPath": body.qs_path,
        "problemId": problem_id,
        "numVariables": model.num_vars,
        "numNonZeros": model.num_nnz,
        "objectiveOffset": model.objective_offset,
        "loadSec": round(load_sec, 3),
        "rawEnergy": result.raw_energy,
        "objective": result.objective,
        "runtimeSec": result.runtime_sec,
        "iterations": result.iterations,
        "method": result.method,
        "bitstringPreview": result.bitstring[:64] + ("…" if len(result.bitstring) > 64 else ""),
        "verification": verification,
        "note": (
            f"Official QOBLIB UQO with {model.num_vars:,} binary variables. "
            "Objective uses QOBLIB UQO convention (ObjectiveOffset − QUBO energy). "
            "Compare against ABS2 QUBO submissions; Gurobi MIP values use the opposite sign. "
            "Near-term QPUs cannot execute this scale — use the IBM section for connectivity warmup."
        ),
    }


@app.get("/api/portfolio/large-instances")
def large_instances():
    catalog = _load_catalog()
    baselines = _load_baselines()
    out = []
    for inst in catalog.get("largeInstances", []):
        subs = [
            s
            for s in baselines.get("submissions", [])
            if s.get("instanceKey") == inst["instanceKey"] or inst["instanceKey"] in s.get("problemId", "")
        ]
        abs2 = [s for s in subs if s.get("solver") == "ABS2"][:8]
        out.append({**inst, "baselineCount": len(subs), "abs2Samples": abs2})
    return {"instances": out}

"""Ingest QOBLIB portfolio submission CSVs into dashboard baseline JSON."""

from __future__ import annotations

import csv
import json
import os
import glob
import re

BASE = os.path.join(os.path.dirname(__file__), "..", "data", "qoblib", "06-portfolio", "submissions")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data", "baselines.json")


def parse_float(value: str | None) -> float | None:
    if not value or value.strip() in {"", "N/A"}:
        return None
    try:
        return float(str(value).replace(",", ""))
    except ValueError:
        return None


def parse_problem_id(problem_id: str) -> dict:
    """Parse a050_t15_s02_b020_l0.0005 or a010_t10_orig_b004_l0.0 style ids."""
    m = re.match(
        r"a(?P<assets>\d+)_t(?P<periods>\d+)_(?P<seed>orig|s\d+)_(?P<limit>b\d+)_l(?P<lambda>.+)",
        problem_id,
    )
    if not m:
        return {"raw": problem_id}
    seed = m.group("seed")
    lam = m.group("lambda")
    try:
        lambda_val = float(lam)
    except ValueError:
        lambda_val = lam
    if seed == "orig":
        instance_key = f"po_a{m.group('assets')}_t{m.group('periods')}_orig"
    else:
        instance_key = f"po_a{m.group('assets')}_t{m.group('periods')}_{seed}"
    return {
        "assets": int(m.group("assets")),
        "periods": int(m.group("periods")),
        "seed": seed,
        "assetLimit": int(m.group("limit")[1:]),
        "lambda": lambda_val,
        "instanceKey": instance_key,
    }


def main() -> None:
    rows: list[dict] = []
    for csv_path in glob.glob(os.path.join(BASE, "**", "*_summary.csv"), recursive=True):
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                problem = (row.get("Problem") or "").strip()
                if not problem:
                    continue
                parsed = parse_problem_id(problem)
                submitter = (row.get("Submitter") or "").strip()
                solver = "ABS2" if "abs2" in submitter.lower() or "schicker" in submitter.lower() else submitter
                if "gurobi" in (row.get("Workflow") or "").lower():
                    solver = "Gurobi"
                rows.append(
                    {
                        "problemId": problem,
                        "instanceKey": parsed.get("instanceKey"),
                        "parsed": parsed,
                        "submitter": submitter,
                        "solver": solver,
                        "date": row.get("Date", ""),
                        "objective": parse_float(row.get("Best Objective Value")),
                        "optimalityBound": parse_float(row.get("Optimality Bound")),
                        "model": row.get("Modeling Approach", ""),
                        "algorithm": row.get("Algorithm Type", ""),
                        "totalRuntimeSec": parse_float(row.get("Total Runtime")),
                        "cpuRuntimeSec": parse_float(row.get("CPU Runtime")),
                        "gpuRuntimeSec": parse_float(row.get("GPU Runtime")),
                        "qpuRuntimeSec": parse_float(row.get("QPU Runtime")),
                        "hardware": row.get("Hardware Specifications", ""),
                        "workflow": row.get("Workflow", ""),
                        "feasibleRuns": parse_float(row.get("# Feasible Runs")),
                        "runs": parse_float(row.get("# Runs")),
                    }
                )

    # Paper Table 6 Gurobi rows (reference when not in submissions)
    table6_gurobi = [
        {"lambda": 0, "objective": -879572, "runtimeSec": 0.4, "gapPct": 0.0},
        {"lambda": 0.000001, "objective": -872055, "runtimeSec": 398.7, "gapPct": 0.01},
        {"lambda": 0.00001, "objective": -819899, "runtimeSec": 3600.1, "gapPct": 8.21},
        {"lambda": 0.00005, "objective": -680124, "runtimeSec": 3600.2, "gapPct": 1.8},
        {"lambda": 0.0001, "objective": -586823, "runtimeSec": 3600.2, "gapPct": 3.01},
        {"lambda": 0.0005, "objective": -386990, "runtimeSec": 3600.1, "gapPct": 9.8},
        {"lambda": 0.001, "objective": -314736, "runtimeSec": 3600.2, "gapPct": 16.9},
        {"lambda": 0.01, "objective": -437920, "runtimeSec": 3661.8, "gapPct": 99.35},
    ]

    payload = {
        "source": "QOBLIB 06-portfolio submissions + paper Table 6",
        "referenceInstance": "a050_t15_s00_b020",
        "paperTable6": {
            "instance": "po_a050_t15_s00",
            "problemPrefix": "a050_t15_s00_b020",
            "gurobi": table6_gurobi,
            "abs2Note": "See submissions filtered by solver ABS2 for matching lambda values",
        },
        "submissions": rows,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as out:
        json.dump(payload, out, indent=2)

    print(f"Wrote {len(rows)} submission records to {OUT}")


if __name__ == "__main__":
    main()

"""Classical heuristics for QOBLIB portfolio QUBO instances."""

from __future__ import annotations

import random
import time
from dataclasses import dataclass

from qubo_parser import QuboModel


@dataclass
class QuboSolveResult:
    raw_energy: float
    objective: float
    runtime_sec: float
    iterations: int
    method: str
    num_vars: int
    bitstring: str


def _random_bits(n: int) -> list[int]:
    return [random.randint(0, 1) for _ in range(n)]


def _flip_bits(bits: list[int], k: int = 1) -> list[int]:
    out = bits[:]
    for idx in random.sample(range(len(out)), k):
        out[idx] ^= 1
    return out


def _local_search(model: QuboModel, bits: list[int], *, max_passes: int = 2) -> tuple[list[int], float]:
    current = bits[:]
    current_e = model.evaluate(current)
    for _ in range(max_passes):
        improved = False
        for i in range(len(current)):
            candidate = current[:]
            candidate[i] ^= 1
            ce = model.evaluate(candidate)
            if ce < current_e:
                current, current_e = candidate, ce
                improved = True
        if not improved:
            break
    return current, current_e


def solve_simulated_annealing(
    model: QuboModel,
    *,
    iterations: int = 8000,
    seed: int | None = None,
) -> QuboSolveResult:
    if seed is not None:
        random.seed(seed)

    t0 = time.perf_counter()
    current = _random_bits(model.num_vars)
    current_e = model.evaluate(current)
    best = current[:]
    best_e = current_e

    temperature = max(abs(best_e) * 0.05, 1.0)

    for step in range(iterations):
        temperature *= 0.9995
        candidate = _flip_bits(current, k=1 if model.num_vars < 2000 else 2)
        cand_e = model.evaluate(candidate)
        delta = cand_e - current_e
        if delta <= 0 or random.random() < pow(2.718281828, -delta / max(temperature, 1e-9)):
            current, current_e = candidate, cand_e
            if cand_e < best_e:
                best, best_e = candidate[:], cand_e

    best, best_e = _local_search(model, best)

    elapsed = time.perf_counter() - t0
    raw = best_e
    return QuboSolveResult(
        raw_energy=raw,
        objective=model.reported_objective(best),
        runtime_sec=round(elapsed, 3),
        iterations=iterations,
        method="simulated_annealing",
        num_vars=model.num_vars,
        bitstring="".join(str(b) for b in best),
    )


def solve_random_restarts(
    model: QuboModel,
    *,
    restarts: int = 200,
    seed: int | None = None,
) -> QuboSolveResult:
    if seed is not None:
        random.seed(seed)

    t0 = time.perf_counter()
    best_e = float("inf")
    best: list[int] = []

    for _ in range(restarts):
        bits = _random_bits(model.num_vars)
        e = model.evaluate(bits)
        if e < best_e:
            best_e = e
            best = bits

    elapsed = time.perf_counter() - t0
    raw = model.evaluate(best)
    return QuboSolveResult(
        raw_energy=raw,
        objective=model.reported_objective(best),
        runtime_sec=round(elapsed, 3),
        iterations=restarts,
        method="random_restarts",
        num_vars=model.num_vars,
        bitstring="".join(str(b) for b in best),
    )

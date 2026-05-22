"""Parse QOBLIB .qs / .qs.xz unconstrained quadratic optimization files."""

from __future__ import annotations

import lzma
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class QuboModel:
    num_vars: int
    num_nnz: int
    objective_offset: float
    linear: dict[int, float]
    quadratic: dict[tuple[int, int], float]
    source_path: str
    metadata: dict[str, str]

    def evaluate(self, bits: list[int]) -> float:
        if len(bits) != self.num_vars:
            raise ValueError(f"Expected {self.num_vars} bits, got {len(bits)}")
        energy = self.objective_offset
        for i, c in self.linear.items():
            if bits[i - 1]:
                energy += c
        for (i, j), c in self.quadratic.items():
            if bits[i - 1] and bits[j - 1]:
                energy += c
        return energy

    def reported_objective(self, bits: list[int]) -> float:
        """QOBLIB UQO submission convention: offset minus minimized QUBO energy."""
        return self.objective_offset - self.evaluate(bits)


def _parse_header(lines: list[str]) -> tuple[int, int, float, dict[str, str]]:
    meta: dict[str, str] = {}
    objective_offset = 0.0
    num_vars = 0
    num_nnz = 0

    for line in lines:
        if line.startswith("# param "):
            m = re.match(r"# param (\w+)\s*:=\s*(.+);", line)
            if m:
                meta[m.group(1)] = m.group(2).strip()
        elif line.startswith("# ObjectiveOffset"):
            objective_offset = float(line.split()[-1])
        elif not line.startswith("#") and line.strip():
            parts = line.split()
            if len(parts) == 2 and num_vars == 0:
                num_vars, num_nnz = int(parts[0]), int(parts[1])
                break

    return num_vars, num_nnz, objective_offset, meta


def load_qs(path: str | Path) -> QuboModel:
    path = Path(path)
    if path.suffix == ".xz":
        with lzma.open(path, "rt", encoding="utf-8") as f:
            content = f.read()
    else:
        content = path.read_text(encoding="utf-8")

    lines = content.splitlines()
    num_vars, num_nnz, objective_offset, meta = _parse_header(lines)

    linear: dict[int, float] = {}
    quadratic: dict[tuple[int, int], float] = {}

    started = False
    for line in lines:
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) == 2 and not started:
            started = True
            continue
        if len(parts) != 3:
            continue
        i, j, coeff = int(parts[0]), int(parts[1]), float(parts[2])
        if i == j:
            linear[i] = linear.get(i, 0.0) + coeff
        else:
            key = (min(i, j), max(i, j))
            quadratic[key] = quadratic.get(key, 0.0) + coeff

    return QuboModel(
        num_vars=num_vars,
        num_nnz=num_nnz,
        objective_offset=objective_offset,
        linear=linear,
        quadratic=quadratic,
        source_path=str(path),
        metadata=meta,
    )

"""Parse and match QOBLIB portfolio problem instance IDs."""

from __future__ import annotations

import re
from dataclasses import dataclass

PROBLEM_RE = re.compile(
    r"^a(?P<assets>\d+)_t(?P<periods>\d+)_(?P<seed>orig|s\d+)_(?P<limit>b\d+)_l(?P<lambda>.+)$"
)


@dataclass(frozen=True)
class ProblemId:
    assets: int
    periods: int
    seed: str
    asset_limit: str
    lambda_raw: str
    lambda_value: float
    instance_key: str
    raw: str

    @property
    def is_qubo_family(self) -> bool:
        return True


def parse_problem_id(problem_id: str) -> ProblemId | None:
    m = PROBLEM_RE.match(problem_id.strip())
    if not m:
        return None
    seed = m.group("seed")
    if seed == "orig":
        instance_key = f"po_a{m.group('assets')}_t{m.group('periods')}_orig"
    else:
        instance_key = f"po_a{m.group('assets')}_t{m.group('periods')}_{seed}"
    lam_raw = m.group("lambda")
    try:
        lam_val = float(lam_raw)
    except ValueError:
        lam_val = float("nan")
    return ProblemId(
        assets=int(m.group("assets")),
        periods=int(m.group("periods")),
        seed=seed,
        asset_limit=m.group("limit"),
        lambda_raw=lam_raw,
        lambda_value=lam_val,
        instance_key=instance_key,
        raw=problem_id,
    )


def same_problem(a: str, b: str) -> bool:
    pa, pb = parse_problem_id(a), parse_problem_id(b)
    if not pa or not pb:
        return a == b
    return (
        pa.assets == pb.assets
        and pa.periods == pb.periods
        and pa.seed == pb.seed
        and pa.asset_limit == pb.asset_limit
        and pa.lambda_value == pb.lambda_value
    )


def find_submission(submissions: list[dict], problem_id: str, *, solver: str | None = None) -> dict | None:
    for row in submissions:
        if not same_problem(row.get("problemId", ""), problem_id):
            continue
        if solver and row.get("solver") != solver:
            continue
        return row
    return None

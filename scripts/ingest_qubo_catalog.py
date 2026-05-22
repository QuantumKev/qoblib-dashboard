"""Build catalog of QOBLIB UQO (.qs) portfolio instances from metrics.csv."""

from __future__ import annotations

import csv
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), "..")
METRICS = os.path.join(
    ROOT,
    "data",
    "qoblib",
    "06-portfolio",
    "models",
    "unconstrained_quadratic_optimization",
    "qs_files",
    "metrics.csv",
)
OUT = os.path.join(ROOT, "public", "data", "qubo-catalog.json")
QS_ROOT = os.path.join(
    ROOT,
    "data",
    "qoblib",
    "06-portfolio",
    "models",
    "unconstrained_quadratic_optimization",
    "qs_files",
)

# Paper Table 5 — full price instances without pre-built .qs in QOBLIB repo
LARGE_INSTANCES = [
    {"instanceKey": "po_a200_t10_orig", "assets": 200, "periods": 10, "variables": 12110, "assetLimit": 50, "mode": "verify_only"},
    {"instanceKey": "po_a200_t15_orig", "assets": 200, "periods": 15, "variables": 18165, "assetLimit": 50, "mode": "verify_only"},
    {"instanceKey": "po_a400_t10_orig", "assets": 400, "periods": 10, "variables": 24110, "assetLimit": 100, "mode": "verify_only"},
    {"instanceKey": "po_a400_t15_orig", "assets": 400, "periods": 15, "variables": 36165, "assetLimit": 100, "mode": "verify_only"},
]

FILENAME_RE = re.compile(
    r"^uqo_a(\d+)_t(\d+)_(orig|s\d+)_b(\d+)_l([\d.e+-]+)\.qs$"
)


def parse_qs_name(filename: str) -> dict:
    m = FILENAME_RE.match(filename)
    if not m:
        return {"filename": filename}

    assets, periods, seed, b_limit, lam_raw = m.groups()
    lam = 0.0 if lam_raw == "0" else float(lam_raw)
    seed_key = "orig" if seed == "orig" else f"s{seed[1:].zfill(2)}"
    instance_key = f"po_a{assets}_t{periods}_{seed_key}"
    folder = filename.replace("uqo_", "").replace(".qs", "")
    problem_id = f"a{assets}_t{periods}_{seed}_b{int(b_limit):03d}_l{lam_raw if lam_raw != '0' else '0.0'}"

    return {
        "filename": filename,
        "assets": int(assets),
        "periods": int(periods),
        "seed": seed,
        "assetLimit": int(b_limit),
        "lambda": lam,
        "instanceKey": instance_key,
        "problemId": problem_id,
        "folder": folder.rsplit("_l", 1)[0],
        "qsPath": f"{folder.rsplit('_l', 1)[0]}/{filename}.xz",
    }


def main() -> None:
    entries = []
    with open(METRICS, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fname = row["file"]
            parsed = parse_qs_name(fname)
            local_path = os.path.join(QS_ROOT, parsed.get("qsPath", ""))
            entries.append(
                {
                    **parsed,
                    "numVariables": int(float(row["num_variables"])),
                    "density": float(row["density"]),
                    "minCoeff": float(row["min_coeff"]),
                    "maxCoeff": float(row["max_coeff"]),
                    "localAvailable": os.path.isfile(local_path),
                    "mode": "qubo_solve",
                }
            )

    entries.sort(key=lambda e: (-e["numVariables"], e.get("instanceKey", ""), e.get("lambda", 0)))

    payload = {
        "source": "QOBLIB UQO metrics.csv + paper Table 5",
        "solveableCount": len(entries),
        "entries": entries,
        "largeInstances": LARGE_INSTANCES,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as out:
        json.dump(payload, out, indent=2)

    print(f"Wrote {len(entries)} QUBO catalog entries + {len(LARGE_INSTANCES)} large verify-only instances")


if __name__ == "__main__":
    main()

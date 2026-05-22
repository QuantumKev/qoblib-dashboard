"""Parse QOBLIB portfolio .txt.gz instances into dashboard JSON."""

from __future__ import annotations

import gzip
import json
import os
import glob
from collections import defaultdict

BASE = os.path.join(os.path.dirname(__file__), "..", "data", "qoblib", "06-portfolio", "instances")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data", "portfolio")


def parse_instance(inst_path: str) -> dict:
    name = os.path.basename(inst_path)
    prices_file = os.path.join(inst_path, "stock_prices.txt.gz")
    cov_file = os.path.join(inst_path, "covariance_matrices.txt.gz")

    by_symbol: dict[str, list[dict]] = defaultdict(list)
    days: set[int] = set()

    with gzip.open(prices_file, "rt", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 3:
                continue
            day, sym, price = int(parts[0]), parts[1], float(parts[2])
            days.add(day)
            by_symbol[sym].append({"day": day, "price": price})

    symbols = sorted(by_symbol.keys())
    for sym in symbols:
        by_symbol[sym].sort(key=lambda x: x["day"])

    heatmap_day = max(days) if days else 0
    matrix = {s: {t: 0.0 for t in symbols} for s in symbols}

    if os.path.exists(cov_file):
        with gzip.open(cov_file, "rt", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split()
                if len(parts) < 4:
                    continue
                day, s1, s2, cov = int(parts[0]), parts[1], parts[2], float(parts[3])
                if day == heatmap_day and s1 in matrix and s2 in matrix[s1]:
                    matrix[s1][s2] = cov
                    matrix[s2][s1] = cov

    series = []
    for sym in symbols[:12]:
        pts = by_symbol[sym]
        if not pts:
            continue
        base_p = pts[0]["price"]
        series.append(
            {
                "symbol": sym,
                "points": [
                    {"day": p["day"], "normalized": round(100 * p["price"] / base_p, 4)} for p in pts
                ],
            }
        )

    heat_syms = symbols[:10]
    heat_values = [[round(matrix[a][b], 6) for b in heat_syms] for a in heat_syms]

    return {
        "id": name,
        "assets": len(symbols),
        "periods": len(days),
        "symbols": symbols,
        "priceSeries": series,
        "covarianceHeatmap": {
            "day": heatmap_day,
            "symbols": heat_syms,
            "values": heat_values,
        },
    }


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    manifest = []

    for inst_path in sorted(glob.glob(os.path.join(BASE, "po_*"))):
        if not os.path.exists(os.path.join(inst_path, "stock_prices.txt.gz")):
            continue
        payload = parse_instance(inst_path)
        name = payload["id"]
        with open(os.path.join(OUT, f"{name}.json"), "w", encoding="utf-8") as out:
            json.dump(payload, out)
        manifest.append(
            {
                "id": name,
                "assets": payload["assets"],
                "periods": payload["periods"],
                "label": name.replace("po_", "").replace("_", " "),
            }
        )

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as out:
        json.dump(manifest, out, indent=2)

    print(f"Wrote {len(manifest)} instances to {OUT}")


if __name__ == "__main__":
    main()

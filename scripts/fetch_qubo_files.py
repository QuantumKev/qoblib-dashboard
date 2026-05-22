"""Download QOBLIB .qs.xz portfolio QUBO files on demand (sparse git checkout)."""

from __future__ import annotations

import argparse
import csv
import os
import subprocess
import sys

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
QS_ROOT = os.path.join(
    ROOT,
    "data",
    "qoblib",
    "06-portfolio",
    "models",
    "unconstrained_quadratic_optimization",
    "qs_files",
)
QOBLIB_REPO = "https://github.com/ZIB-AOPT/QOBLIB.git"
SPARSE_PREFIX = "06-portfolio/models/unconstrained_quadratic_optimization/qs_files"


def _folder_from_filename(fname: str) -> str:
    base = fname.replace("uqo_", "").replace(".qs", "")
    return base.rsplit("_l", 1)[0]


def folders_for_filter(*, assets: int | None, folder: str | None, all_files: bool) -> set[str]:
    folders: set[str] = set()
    with open(METRICS, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fname = row["file"]
            fldr = _folder_from_filename(fname)
            if not all_files:
                if folder and fldr != folder:
                    continue
                if assets is not None and f"uqo_a{assets:03d}_" not in fname and f"uqo_a{assets}_" not in fname:
                    continue
            folders.add(fldr)
    return folders


def ensure_sparse_repo() -> str:
    git_dir = os.path.join(ROOT, "data", "qoblib", ".git")
    if not os.path.isdir(git_dir):
        os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
        subprocess.run(
            ["git", "clone", "--filter=blob:none", "--sparse", QOBLIB_REPO, os.path.join(ROOT, "data", "qoblib")],
            check=True,
        )
    return os.path.join(ROOT, "data", "qoblib")


def fetch_folders(folders: set[str]) -> None:
    repo = ensure_sparse_repo()
    for fldr in sorted(folders):
        path = f"{SPARSE_PREFIX}/{fldr}"
        print(f"Fetching {path} …")
        subprocess.run(["git", "-C", repo, "sparse-checkout", "add", path], check=True)
        subprocess.run(["git", "-C", repo, "pull", "--ff-only"], check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch QOBLIB portfolio .qs.xz files")
    parser.add_argument("--assets", type=int, help="Only fetch instances for this asset count (10 or 50)")
    parser.add_argument("--folder", type=str, help="Exact folder e.g. a050_t15_s02_b020")
    parser.add_argument("--all", action="store_true", help="Fetch all catalog folders (large download)")
    args = parser.parse_args()

    if not os.path.isfile(METRICS):
        print("Run sparse checkout of 06-portfolio first (metrics.csv missing)", file=sys.stderr)
        sys.exit(1)

    folders = folders_for_filter(assets=args.assets, folder=args.folder, all_files=args.all)
    if not folders:
        print("No matching folders", file=sys.stderr)
        sys.exit(1)

    fetch_folders(folders)
    available = sum(
        1
        for fldr in folders
        if os.path.isdir(os.path.join(QS_ROOT, fldr))
    )
    print(f"Done — {available}/{len(folders)} folders present under qs_files/")


if __name__ == "__main__":
    main()

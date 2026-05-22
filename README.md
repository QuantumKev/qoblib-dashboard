# QOBLIB Dashboard

Interactive presentation dashboard for the paper **Quantum Optimization Benchmarking Library — The Intractable Decathlon** ([arXiv:2504.03832](https://arxiv.org/abs/2504.03832)).

Visualizes all 10 benchmark problem classes with a deep dive on **Portfolio Optimization (#06)**, aligned with the [official QOBLIB 06-portfolio README](https://github.com/ZIB-AOPT/QOBLIB/tree/main/06-portfolio).

**Live site:** https://quantumkev.github.io/qoblib-dashboard/

## Portfolio problem (#06)

Multi-period Markowitz portfolio optimization with:

- Transaction costs (δ) on buys, sells, and liquidation  
- Short selling with borrowing cost (ρₛ)  
- Capital limit **C** and position limit **B** (binary slack encodings)  
- Real S&P 500 price and covariance data (top 10 / 50 / 200 / 400 stocks by market cap)

### Instance naming (QOBLIB convention)

| Pattern | Example | Meaning |
|---------|---------|---------|
| Price instance | `po_a050_t15_s00` | 50 assets, 15 periods, seed s00 |
| QUBO problem | `a050_t15_s00_b020_l0.0005` | Same instance + max 20 positions + risk λ |

- **orig** — original S&P data; **s00–s02** — perturbed seeds for robustness testing  
- **bXXX** — max assets per day (B)  
- **lX** — risk aversion λ (higher = more risk-averse, harder to solve)

### Objective sign conventions

| Solver | Model | Reported objective |
|--------|-------|-------------------|
| Gurobi | MIP/BQP | Negative (minimize economic cost) |
| ABS2 | QUBO/UQO | Positive (`ObjectiveOffset − QUBO energy`) |

The **Quantum Lab** compares QUBO runs against **ABS2** references and Table 6 **Gurobi** MIP values separately.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Overview and why QOBLIB exists |
| `/decathlon` | All 10 problem classes + size chart |
| `/portfolio` | Formulation, naming, live price/covariance data, paper charts |
| `/lab` | IBM Quantum + QUBO solve + QOBLIB verification (local API) |
| `/learn` | Beginner-friendly explanations |
| `/present` | Fullscreen presentation mode |

## Local development

```powershell
cd c:\Users\Dev\qoblib-dashboard
npm install
npm run dev
```

### Quantum Lab (two terminals)

**Terminal 1 — API server:**
```powershell
pip install -r server/requirements.txt
npm run server
```

**Terminal 2 — Dashboard:**
```powershell
npm run dev
```

Open http://localhost:5173/lab

IBM credentials stay in session storage and hit the local API only — never GitHub Pages.

### Student parameter lab

The top panel on `/lab` lets learners **change variables and compare outcomes**:

| Knob | Where | What students learn |
|------|--------|---------------------|
| **Qubits** (slider) | Section 2 | Search space grows as 2ⁿ; runtime/noise increase on hardware |
| **QAOA reps / shots** | Section 2 | Circuit depth vs solution quality |
| **Asset scale** (a010 → a050) | Section 3 | QUBO size 710 → 4,665 variables |
| **Risk λ** | Section 3 | Paper Figure 11 — harder problems as λ changes |
| **SA iterations** | Section 3 | Classical effort vs objective gap |

**One-click sweeps:**
- **QAOA qubit sweep** — runs 4, 6, 8, 10, 12, 14 qubits on the simulator and plots runtime
- **λ sweep** — runs every downloaded λ for the selected instance and plots objective/runtime

Each manual run is **recorded automatically** in the comparison log.

## Ingest & fetch QOBLIB data

```powershell
# Portfolio price/covariance JSON (32 instances: a010–a400)
npm run ingest

# Submission CSVs → baselines.json (258 records)
npm run ingest:baselines

# UQO catalog from metrics.csv (128 a010/a050 QUBO files)
npm run ingest:qubo

# Download .qs.xz QUBO files for local solving (git sparse checkout)
npm run fetch:qubo
python scripts/fetch_qubo_files.py --folder a050_t15_s00_b020
```

Clone QOBLIB (sparse checkout of 06-portfolio):

```powershell
git clone --filter=blob:none --sparse https://github.com/ZIB-AOPT/QOBLIB.git data/qoblib
cd data/qoblib
git sparse-checkout set 06-portfolio
```

## Deploy to GitHub Pages

Push to `main` — `.github/workflows/deploy-pages.yml` builds and deploys automatically.

```powershell
git push origin main
```

## Data sources

- Paper: [2504.03832](https://arxiv.org/abs/2504.03832)  
- Repository: [ZIB-AOPT/QOBLIB](https://github.com/ZIB-AOPT/QOBLIB)  
- Portfolio: [06-portfolio](https://github.com/ZIB-AOPT/QOBLIB/tree/main/06-portfolio)

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, React Router, FastAPI, Qiskit IBM Runtime.

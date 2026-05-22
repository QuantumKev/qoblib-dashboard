# QOBLIB Dashboard

Interactive presentation dashboard for the paper **Quantum Optimization Benchmarking Library — The Intractable Decathlon** ([arXiv:2504.03832](https://arxiv.org/abs/2504.03832)).

Visualizes the 10 benchmark problem classes with a deep dive on **Portfolio Optimization** (#06), including charts derived from the paper's Tables 5–6 and Figures 11–12.

### Local development

```powershell
cd c:\Users\Dev\qoblib-dashboard
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Deploy to GitHub Pages ([QuantumKev](https://github.com/QuantumKev))

Live site (after first deploy): **https://quantumkev.github.io/qoblib-dashboard/**

### One-time setup

1. Log in to GitHub CLI (if you haven't already):

```powershell
gh auth login
```

2. Create the repo and push:

```powershell
cd c:\Users\Dev\qoblib-dashboard
git branch -M main
git commit -m "Add QOBLIB presentation dashboard with GitHub Pages deploy."
git remote add origin https://github.com/QuantumKev/qoblib-dashboard.git
git push -u origin main
```

If the repo doesn't exist yet, create it first:

```powershell
gh repo create QuantumKev/qoblib-dashboard --public --source=. --remote=origin --push
```

3. Enable GitHub Pages in the repo:
   - Go to **Settings → Pages**
   - **Build and deployment → Source:** GitHub Actions
   - The workflow in `.github/workflows/deploy-pages.yml` runs automatically on every push to `main`

### Local preview (production base path)

```powershell
$env:GITHUB_ACTIONS = "true"
npm run build
npm run preview
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | High-level overview and why QOBLIB exists |
| `/decathlon` | All 10 problem classes + size comparison chart |
| `/portfolio` | Portfolio benchmark instances, live QOBLIB data, solver runtimes |
| `/learn` | Beginner-friendly explanations for presentations |
| `/present` | Fullscreen presentation mode with speaker notes |

## Refresh portfolio data from QOBLIB

```powershell
# Clone/update QOBLIB (sparse checkout of 06-portfolio only)
git clone --depth 1 --filter=blob:none --sparse https://github.com/ZIB-AOPT/QOBLIB.git data/qoblib
cd data/qoblib
git sparse-checkout set 06-portfolio

# Parse .txt.gz instances into public/data/portfolio/*.json
npm run ingest
```

## Data sources

- Paper: [2504.03832v2](https://arxiv.org/pdf/2504.03832)
- Repository: [ZIB-AOPT/QOBLIB](https://github.com/ZIB-AOPT/QOBLIB)
- Portfolio instances: [06-portfolio](https://git.zib.de/qopt/qoblib-quantum-optimization-benchmarking-library/-/tree/main/06-portfolio)

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, React Router.

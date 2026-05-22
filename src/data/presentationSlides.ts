export type Slide = {
  id: string
  title: string
  bullets: string[]
  notes: string
  accent?: string
}

export const SLIDES: Slide[] = [
  {
    id: 'intro',
    title: 'Quantum Optimization Benchmarking Library',
    bullets: [
      'Paper: “The Intractable Decathlon” (arXiv:2504.03832)',
      'IBM Quantum, ZIB Berlin, Purdue, and 20+ collaborators',
      'Goal: fair, reproducible tests for quantum vs classical optimization',
    ],
    notes:
      'Open with the problem: lots of quantum advantage claims, few shared benchmarks. This paper is infrastructure — a standardized exam for solvers.',
  },
  {
    id: 'why',
    title: 'Why benchmarks matter',
    bullets: [
      'Optimization powers finance, logistics, chip design, scheduling',
      'Many problems are NP-hard — no fast perfect algorithm exists',
      'Quantum and classical heuristics need the same test problems',
      'Without benchmarks, progress cannot be measured honestly',
    ],
    notes:
      'Explain NP-hard simply: combinations explode. Heuristics find good answers but need standardized tests to compare.',
  },
  {
    id: 'decathlon',
    title: 'The Intractable Decathlon — 10 problems',
    bullets: [
      'Market Split, LABS, Birkhoff, Steiner, Sports Scheduling',
      'Portfolio Optimization, Independent Set, Network Design',
      'Vehicle Routing, Topology Design',
      '100 to 100,000 variables — sized for near-term quantum hardware',
    ],
    notes:
      'Emphasize diversity: finance, telecom, logistics, graphs. All intentionally hard at moderate sizes.',
    accent: 'Ten problem classes, one open library (QOBLIB)',
  },
  {
    id: 'method',
    title: 'How the benchmark works',
    bullets: [
      'Download instances + models from GitHub / GitLab',
      'Run your solver (Gurobi, QAOA, annealing, custom heuristics)',
      'Verify feasibility with included check scripts',
      'Submit results in the standard format to track progress',
    ],
    notes:
      'Model-independent: you can use MIP, QUBO, or other formulations. Compare mapped-back objective values, not raw QUBO penalties.',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Optimization (#06)',
    bullets: [
      'Multi-period Markowitz with transaction costs & short selling',
      'Binary hold/skip decisions across 10–15 trading days',
      'Real S&P 500 prices & covariances (Jan–May 2024)',
      '32 instances: 10 / 50 / 200 / 400 assets',
    ],
    notes:
      'This is the finance hook. λ controls risk vs return. Higher λ makes classical solvers struggle — good stress test.',
    accent: '$1M capital, realistic fees, NP-hard at scale',
  },
  {
    id: 'live-data',
    title: 'Live instance data in this dashboard',
    bullets: [
      'Cloned from ZIB-AOPT/QOBLIB → 06-portfolio/instances',
      'Price paths normalized to 100 at day 0',
      'Covariance heatmap for final trading day',
      'Switch instances in the Portfolio Deep Dive page',
    ],
    notes:
      'Demo the instance selector live. Show po_a010_t10_orig then po_a050_t15_s00 to contrast size.',
  },
  {
    id: 'results',
    title: 'Key results (so far)',
    bullets: [
      'Classical Gurobi: best final solution quality on portfolio instances',
      'ABS2 (QUBO/GPU): reaches good solutions faster on some settings',
      'No quantum advantage claimed — this sets up the race',
      'Higher risk aversion λ → harder & slower for all solvers',
    ],
    notes:
      'Be honest: classical still wins on quality. Speed vs quality tradeoff is the interesting story for presentations.',
  },
  {
    id: 'close',
    title: 'Takeaways',
    bullets: [
      'QOBLIB = shared scoreboard for optimization research',
      'Portfolio #06 connects quantum benchmarking to finance',
      'Try it: github.com/ZIB-AOPT/QOBLIB',
      'Questions?',
    ],
    notes:
      'Point audience to the dashboard repo and original paper. Offer to walk through the Beginner Guide page.',
  },
]

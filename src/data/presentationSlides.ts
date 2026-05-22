export type Slide = {
  id: string
  title: string
  bullets: string[]
  notes: string
  accent?: string
  showPartners?: boolean
}

export const SLIDES: Slide[] = [
  {
    id: 'intro',
    title: 'QOBLIB Workforce Quantum Optimization Lab',
    showPartners: true,
    bullets: [
      'Open benchmark dashboard — arXiv:2504.03832 “Intractable Decathlon”',
      'IBM-HBCU Quantum Center stack: Qiskit Runtime + IBM Quantum Platform',
      'Quantum Global Group playbook: define → pilot → benchmark → enable',
      'Students duplicate industry workflow with visuals they can defend',
    ],
    notes:
      'Title slide: name both partners. IBM = access + Qiskit + HBCU mission. QGG = workforce playbook + portfolio optimization research. This is capability building on IBM infrastructure.',
    accent: 'IBM Quantum × Quantum Global Group × QOBLIB',
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
    id: 'workforce-qgg',
    title: 'Quantum Global Group — industry playbook in software',
    bullets: [
      'Define outcome → fit check → pilot → benchmark → report → enable team',
      'Same six steps mapped to routes: /workforce, /lab, /portfolio, /present',
      'Students produce deliverables they can explain to executives',
      'Portfolio optimization aligns with QGG hybrid quantum finance research',
    ],
    notes:
      'Open /workforce first. Walk the playbook cards. Emphasize capability building is the product — not a one-off demo.',
    accent: 'quantumglobalgroup.io · workforce development',
  },
  {
    id: 'workforce-hbcu',
    title: 'IBM-HBCU Quantum Center alignment',
    bullets: [
      '13 HBCUs: cloud access, Qiskit education, research opportunities',
      'This lab uses IBM Quantum Platform + Qiskit Runtime (same stack)',
      'Students connect token + CRN → simulator → real QPU — no mock APIs',
      'QOBLIB verification = research-community language (submission IDs, gap %)',
    ],
    notes:
      'Reference the 2020 center announcement. Tie to Educators Program and learning.quantum.ibm.com. Diversity & belonging: students showcase results visually even without HPC.',
    accent: 'Built for cohorts IBM already invests in',
  },
  {
    id: 'lab-demo',
    title: 'Live lab demo (5 minutes)',
    bullets: [
      'Parameter panel: qubit sweep shows exponential scaling',
      'IBM connect → run on ibm_torino (or simulator if queue long)',
      'QUBO λ sweep on po_a050_t15_s00 vs ABS2 baselines',
      'Recorded run log — students duplicate for weekly reports',
    ],
    notes:
      'Have server running locally: npm run server + npm run dev. GitHub Pages shows static content only — IBM demo needs local API.',
    accent: 'Show honest fit check: full portfolio ≠ NISQ qubits today',
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
    title: 'Takeaways for IBM & partners',
    bullets: [
      'QOBLIB + this dashboard = reproducible workforce lab on IBM stack',
      'IBM-HBCU Center goals met: access, Qiskit, research, diverse talent pipeline',
      'Quantum Global Group playbook operationalized for colleges & cohorts',
      'Fork: github.com/QuantumKev/qoblib-dashboard · Live: /workforce · Demo: /lab',
      'Questions?',
    ],
    notes:
      'Close with offer: pilot cohort at an HBCU partner or IBM Educators site. Kevin Robinson / Quantum Global Group workforce track.',
  },
]

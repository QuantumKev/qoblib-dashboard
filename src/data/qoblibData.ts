export type ProblemClass = {
  id: number
  slug: string
  name: string
  description: string
  domain: string
  mipVars: number | null
  quboVars: number | null
  difficulty: 'small' | 'medium' | 'large'
}

export const PAPER = {
  title: 'Quantum Optimization Benchmarking Library — The Intractable Decathlon',
  arxiv: '2504.03832',
  url: 'https://arxiv.org/abs/2504.03832',
  repo: 'https://github.com/ZIB-AOPT/QOBLIB',
  gitlab: 'https://git.zib.de/qopt/qoblib-quantum-optimization-benchmarking-library',
}

export const PROBLEM_CLASSES: ProblemClass[] = [
  { id: 1, slug: 'marketsplit', name: 'Market Split', description: 'Multi-dimensional subset-sum', domain: 'Energy / pricing', mipVars: 78, quboVars: 70, difficulty: 'small' },
  { id: 2, slug: 'labs', name: 'LABS', description: 'Low autocorrelation binary sequences', domain: 'Radar / communications', mipVars: 81, quboVars: 820, difficulty: 'small' },
  { id: 3, slug: 'birkhoff', name: 'Birkhoff Decomposition', description: 'Doubly stochastic matrix decomposition', domain: 'Scheduling', mipVars: 240, quboVars: 3480, difficulty: 'medium' },
  { id: 4, slug: 'steiner', name: 'Steiner Tree Packing', description: 'Wire routing in VLSI design', domain: 'Chip design', mipVars: 423360, quboVars: null, difficulty: 'large' },
  { id: 5, slug: 'sports', name: 'Sports Scheduling', description: 'Tournament constraint satisfaction', domain: 'Sports leagues', mipVars: 8608, quboVars: 11791, difficulty: 'large' },
  { id: 6, slug: 'portfolio', name: 'Portfolio Optimization', description: 'Multi-period with transaction costs & short selling', domain: 'Finance', mipVars: 690, quboVars: 690, difficulty: 'medium' },
  { id: 7, slug: 'independentset', name: 'Maximum Independent Set', description: 'Largest non-adjacent vertex set in a graph', domain: 'Graph theory / planning', mipVars: 500, quboVars: 500, difficulty: 'medium' },
  { id: 8, slug: 'network', name: 'Network Design', description: 'Telecommunications network planning', domain: 'Telecom', mipVars: 1211, quboVars: 46330, difficulty: 'large' },
  { id: 9, slug: 'routing', name: 'Vehicle Routing', description: 'TSP + time windows + knapsack', domain: 'Logistics', mipVars: null, quboVars: null, difficulty: 'medium' },
  { id: 10, slug: 'topology', name: 'Topology Design', description: 'Graph golf / node-degree-diameter', domain: 'Network topology', mipVars: 2176, quboVars: null, difficulty: 'large' },
]

export const PORTFOLIO_PARAMS = {
  riskFreeRate: { daily: '0.01%', annual: '2.55%' },
  transactionCost: { daily: '0.1%', note: 'Applied on buy/sell and liquidation' },
  shortLoanRate: { daily: '0.0025%', annual: '0.92%' },
  capitalUnits: 10,
  cashTotal: '$1,000,000',
  maxSharesPerAsset: 3,
  dataSource: 'S&P 500 (Jan–May 2024)',
}

export type PortfolioInstance = {
  assets: number
  periods: number
  assetLimit: number
  variables: number
  label: string
}

export const PORTFOLIO_INSTANCES: PortfolioInstance[] = [
  { assets: 10, periods: 10, assetLimit: 4, variables: 710, label: 'a010_t10' },
  { assets: 10, periods: 15, assetLimit: 4, variables: 1065, label: 'a010_t15' },
  { assets: 50, periods: 10, assetLimit: 20, variables: 3110, label: 'a050_t10' },
  { assets: 50, periods: 15, assetLimit: 20, variables: 4665, label: 'a050_t15' },
  { assets: 200, periods: 10, assetLimit: 50, variables: 12110, label: 'a200_t10' },
  { assets: 200, periods: 15, assetLimit: 50, variables: 18165, label: 'a200_t15' },
  { assets: 400, periods: 10, assetLimit: 100, variables: 24110, label: 'a400_t10' },
  { assets: 400, periods: 15, assetLimit: 100, variables: 36165, label: 'a400_t15' },
]

/** Table 6 from paper — Gurobi vs ABS2 on po_a050_t15_s00 */
export const LAMBDA_BENCHMARK = [
  { lambda: 0, gurobiGap: 0, gurobiTime: 0.4, abs2Gap: 0, abs2Time: 90 },
  { lambda: 0.000001, gurobiGap: 0.01, gurobiTime: 398.7, abs2Gap: 0, abs2Time: 79.1 },
  { lambda: 0.00001, gurobiGap: 8.21, gurobiTime: 3600.1, abs2Gap: 0, abs2Time: 30.2 },
  { lambda: 0.00005, gurobiGap: 1.8, gurobiTime: 3600.2, abs2Gap: 0, abs2Time: 50.7 },
  { lambda: 0.0001, gurobiGap: 3.01, gurobiTime: 3600.2, abs2Gap: 0, abs2Time: 206.7 },
  { lambda: 0.0005, gurobiGap: 9.8, gurobiTime: 3600.1, abs2Gap: 0.55, abs2Time: 1497.6 },
  { lambda: 0.001, gurobiGap: 16.9, gurobiTime: 3600.2, abs2Gap: 4.91, abs2Time: 741.9 },
  { lambda: 0.01, gurobiGap: 99.35, gurobiTime: 3661.8, abs2Gap: 99.35, abs2Time: 1510.8 },
]

/** Approximate runtime vs risk aversion from Figure 11 (seconds, log scale friendly) */
export const RUNTIME_BY_LAMBDA = [
  { lambda: '0', a10t10: 0.5, a10t15: 0.6, a50t10: 2, a50t15: 3 },
  { lambda: '1e-6', a10t10: 5, a10t15: 8, a50t10: 120, a50t15: 200 },
  { lambda: '1e-5', a10t10: 15, a10t15: 25, a50t10: 600, a50t15: 900 },
  { lambda: '1e-4', a10t10: 40, a10t15: 60, a50t10: 1800, a50t15: 2400 },
  { lambda: '5e-4', a10t10: 80, a10t15: 120, a50t10: 3600, a50t15: 3600 },
  { lambda: '1e-3', a10t10: 150, a10t15: 200, a50t10: 3600, a50t15: 3600 },
  { lambda: '1e-2', a10t10: 300, a10t15: 400, a50t10: 3600, a50t15: 3600 },
]

export const OBJECTIVE_CONVERGENCE = [
  { time: 0, gurobi: 4.0e5, abs2: 4.0e5 },
  { time: 10, gurobi: 3.8e5, abs2: 3.2e5 },
  { time: 25, gurobi: 3.5e5, abs2: 2.8e5 },
  { time: 50, gurobi: 3.2e5, abs2: 2.5e5 },
  { time: 75, gurobi: 3.0e5, abs2: 2.3e5 },
  { time: 100, gurobi: 2.8e5, abs2: 2.1e5 },
  { time: 150, gurobi: 2.5e5, abs2: 2.0e5 },
  { time: 200, gurobi: 2.3e5, abs2: 1.95e5 },
  { time: 250, gurobi: 2.1e5, abs2: 1.92e5 },
]

export const BEGINNER_CONCEPTS = [
  {
    term: 'Optimization',
    plain: 'Finding the best choice out of many possibilities — like picking the cheapest route, best stock mix, or optimal schedule.',
  },
  {
    term: 'Combinatorial optimization',
    plain: 'Problems where you choose from discrete yes/no options. The number of combinations explodes as size grows (NP-hard).',
  },
  {
    term: 'Quantum advantage',
    plain: 'When a quantum computer solves a real problem faster or better than the best classical computer. Not proven yet for these benchmarks.',
  },
  {
    term: 'QUBO',
    plain: 'Quadratic Unconstrained Binary Optimization — a math format with only 0/1 variables and pairwise interactions. Many quantum solvers expect this form.',
  },
  {
    term: 'MIP / BQP',
    plain: 'Mixed Integer Programming and Binary Quadratic Programming — classical formats with explicit constraints. Gurobi and CPLEX excel here.',
  },
  {
    term: 'Benchmark',
    plain: 'A standardized test so everyone compares algorithms fairly on the same problems, like a standardized exam for solvers.',
  },
  {
    term: 'Markowitz portfolio',
    plain: 'Classic finance model balancing expected return vs. risk (variance). QOBLIB adds realistic frictions: fees, multi-period rebalancing, short selling.',
  },
  {
    term: 'Risk parameter λ (lambda)',
    plain: 'How much you penalize risk vs. chase profit. λ = 0 means “maximize profit only”; higher λ means “play it safer.”',
  },
]

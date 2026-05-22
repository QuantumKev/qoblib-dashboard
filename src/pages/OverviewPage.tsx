import { PAPER } from '../data/qoblibData'

type StatProps = { label: string; value: string; hint?: string }

function Stat({ label, value, hint }: StatProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#161d27] p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  )
}

export function OverviewPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-cyan-400">Presentation dashboard</p>
        <h2 className="mt-1 max-w-3xl text-3xl font-semibold text-white">{PAPER.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          A team from IBM Quantum, ZIB Berlin, Purdue, and others created a shared test suite to answer one question:
          <span className="text-white"> can quantum computers actually beat classical computers on hard optimization problems?</span>
          {' '}Instead of vague claims, they published 10 problem types, real datasets, and baseline scores everyone can reproduce.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Problem classes" value="10" hint="The “Intractable Decathlon”" />
        <Stat label="Variable range" value="100 – 100k" hint="Small enough for near-term quantum hardware" />
        <Stat label="Open library" value="QOBLIB" hint="Instances, models, solutions, checkers" />
        <Stat label="Your focus" value="Portfolio" hint="Problem #06 — finance benchmark" />
      </div>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">The big idea in one minute</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-cyan-300">1. Pick hard problems</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Ten combinatorial problems from finance, logistics, chip design, and more — each hard for classical solvers at modest sizes.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-300">2. Publish fair benchmarks</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Same instances, same verification tools, standardized reporting. Classical MIP solvers and quantum QUBO solvers can both compete.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-300">3. Track progress over time</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              As quantum hardware improves, researchers rerun the same tests. Improvements become measurable instead of anecdotal.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Why this matters for portfolio optimization</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Portfolio optimization sounds simple — pick stocks to maximize return and minimize risk. Real portfolios add transaction fees,
          multi-day rebalancing, borrowing costs for short positions, and capital limits. That makes the problem NP-hard. Quantum researchers
          have studied simplified versions; QOBLIB provides a rigorous, reproducible benchmark using real S&P 500 data so comparisons are honest.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {['Multi-period', 'Transaction costs', 'Short selling', 'Real market data', 'Binary decisions'].map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6">
        <h3 className="text-lg font-semibold text-amber-200">Important nuance</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-amber-100/80">
          This paper does <em>not</em> claim quantum computers already win. It sets up the race. Classical solvers like Gurobi still find better
          final solutions on portfolio instances — but quantum-oriented QUBO solvers like ABS2 sometimes reach good answers much faster.
          That tradeoff is exactly what the dashboard visualizes.
        </p>
      </section>
    </div>
  )
}

import { BEGINNER_CONCEPTS } from '../data/qoblibData'

export function LearnPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-semibold text-white">Beginner&apos;s guide to the paper</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Everything below is written in plain language. Use this page when presenting to people who are not optimization or quantum experts.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Story arc of the paper</h3>
        <ol className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="font-medium text-cyan-300">Problem:</span> Quantum computing companies claim their machines will revolutionize optimization,
            but without shared tests, nobody can verify progress or compare fairly against classical supercomputers.
          </li>
          <li>
            <span className="font-medium text-cyan-300">Solution:</span> Build QOBLIB — an open “exam” with 10 hard problem types, downloadable datasets,
            known best solutions, and scripts to check if your answer is valid.
          </li>
          <li>
            <span className="font-medium text-cyan-300">Method:</span> Run state-of-the-art classical solvers (Gurobi, CPLEX, etc.) and sample quantum/heuristic
            solvers on the same instances. Report solution quality, runtime, and hardware details in a standard format.
          </li>
          <li>
            <span className="font-medium text-cyan-300">Result so far:</span> Classical solvers still win on solution quality for most instances, but some QUBO solvers
            reach decent answers faster — a promising sign for time-sensitive use cases, not yet quantum advantage.
          </li>
        </ol>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {BEGINNER_CONCEPTS.map((item) => (
          <div key={item.term} className="rounded-xl border border-slate-800 bg-[#161d27] p-4">
            <h3 className="font-semibold text-white">{item.term}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.plain}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Portfolio problem — explained like a story</h3>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
          <p>
            Imagine you manage <strong className="text-white">$1 million</strong> and can choose from the largest S&P 500 companies.
            Every day for 10–15 trading days, you decide which stocks to hold (yes/no), whether to go long or short,
            and how much cash to keep earning a tiny risk-free rate.
          </p>
          <p>
            You want <strong className="text-white">more profit</strong> but also want to avoid wild swings (risk).
            The dial <strong className="text-white">λ (lambda)</strong> controls that tradeoff. Every time you change your holdings,
            you pay a <strong className="text-white">transaction fee</strong>. Short positions cost borrowing fees.
          </p>
          <p>
            The computer must find the best pattern of daily decisions. With 50 stocks and 15 days, that is thousands of binary
            yes/no variables — and the math couples them through covariances (how stocks move together). Classical solvers like Gurobi
            use clever branch-and-bound search; quantum-inspired solvers reformulate the problem as QUBO and search differently.
          </p>
          <p>
            The paper&apos;s key portfolio finding: when λ is small (profit-focused), Gurobi solves quickly. When λ grows (risk-focused),
            runtime explodes and gaps widen — making these instances a meaningful stress test for any new solver.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">The other 9 problems (one sentence each)</h3>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ['Market Split', 'Split products across markets so each hits an exact sales target — like a multidimensional knapsack puzzle.'],
            ['LABS', 'Find a binary sequence whose autocorrelation is as flat as possible — used in radar signal design.'],
            ['Birkhoff', 'Decompose a doubly-stochastic matrix into few permutation matrices — scheduling and assignment.'],
            ['Steiner Tree Packing', 'Pack many Steiner trees into a graph — models VLSI chip wire routing.'],
            ['Sports Scheduling', 'Schedule a tournament so every team plays fairly — a constraint satisfaction nightmare at scale.'],
            ['Maximum Independent Set', 'Pick the most vertices in a graph with no edges between them — classic graph theory.'],
            ['Network Design', 'Build a telecom network meeting capacity and redundancy rules at minimum cost.'],
            ['Vehicle Routing', 'Route delivery trucks with time windows and capacity — logistics optimization.'],
            ['Topology Design', 'Design a network graph with minimum diameter for given node degrees — “graph golf”.'],
          ].map(([name, desc]) => (
            <div key={name}>
              <dt className="font-medium text-cyan-300">{name}</dt>
              <dd className="mt-1 text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

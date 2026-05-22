import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PROBLEM_CLASSES } from '../data/qoblibData'

const chartData = PROBLEM_CLASSES.map((p) => ({
  name: `#${p.id}`,
  mip: p.mipVars ?? 0,
  qubo: p.quboVars ?? 0,
  fullName: p.name,
}))

export function DecathlonPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-semibold text-white">The Intractable Decathlon</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Ten problem classes chosen for diversity: different industries, constraint types, and matrix densities.
          Each becomes challenging for classical solvers between roughly 100 and 100,000 decision variables.
        </p>
      </header>

      <div className="grid gap-3">
        {PROBLEM_CLASSES.map((problem) => (
          <div
            key={problem.id}
            className={`grid gap-4 rounded-xl border border-slate-800 bg-[#161d27] p-4 md:grid-cols-[4rem_1fr_auto] md:items-center ${
              problem.slug === 'portfolio' ? 'ring-1 ring-cyan-700/60' : ''
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-lg font-bold text-cyan-300">
              {String(problem.id).padStart(2, '0')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-white">{problem.name}</h3>
                {problem.slug === 'portfolio' ? (
                  <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-300">Your focus</span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-400">{problem.description}</p>
              <p className="mt-1 text-xs text-slate-500">Domain: {problem.domain}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>MIP vars: {problem.mipVars?.toLocaleString() ?? '—'}</p>
              <p>QUBO vars: {problem.quboVars?.toLocaleString() ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Problem size at difficulty threshold</h3>
        <p className="mt-1 text-xs text-slate-500">Approximate decision variables when classical solvers start to struggle (from Table 2)</p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis scale="log" domain={[10, 500000]} tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'Variables (log scale)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
              />
              <Bar dataKey="mip" name="MIP formulation" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qubo" name="QUBO formulation" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

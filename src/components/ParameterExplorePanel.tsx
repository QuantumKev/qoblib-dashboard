import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import type { ExploreRunRecord, IBMRunResponse, LambdaSweepRow } from '../types/lab'
import { PORTFOLIO_INSTANCES } from '../data/qoblibData'

type Props = {
  runs: ExploreRunRecord[]
  onClear: () => void
  qubitSweep: IBMRunResponse[] | null
  lambdaSweep: LambdaSweepRow[] | null
  sweepingQubits: boolean
  sweepingLambda: boolean
  onSweepQubits: () => void
  onSweepLambda: () => void
  canSweepLambda: boolean
  instanceKey: string
}

const PARAM_GUIDE = [
  {
    knob: 'Qubits (QAOA)',
    increases: 'Search space grows as 2ⁿ — each extra qubit doubles possibilities.',
    studentTry: 'Run qubit sweep on simulator; compare runtime at 4 vs 12 qubits.',
  },
  {
    knob: 'QAOA reps',
    increases: 'Circuit depth and parameter count — better solutions possible, more noise on hardware.',
    studentTry: 'Fix qubits=6, try reps 1 vs 5 on simulator then hardware.',
  },
  {
    knob: 'Assets / periods (QUBO)',
    increases: 'QOBLIB binary variables scale from 710 (a010_t10) to 36,165 (a400_t15).',
    studentTry: 'Compare a010 vs a050 at the same λ; watch runtime and gap vs ABS2.',
  },
  {
    knob: 'Risk λ',
    increases: 'Higher λ emphasizes covariance risk — solver runtime and landscape change (paper Figure 11).',
    studentTry: 'Lambda sweep on one instance; plot objective vs λ.',
  },
  {
    knob: 'SA iterations',
    increases: 'More classical search steps — often better objective, longer runtime.',
    studentTry: 'Run 2,000 vs 10,000 iterations on the same QUBO file.',
  },
]

export function ParameterExplorePanel({
  runs,
  onClear,
  qubitSweep,
  lambdaSweep,
  sweepingQubits,
  sweepingLambda,
  onSweepQubits,
  onSweepLambda,
  canSweepLambda,
  instanceKey,
}: Props) {
  const qubitChart =
    qubitSweep?.filter((r) => !r.error).map((r) => ({
      qubits: r.qubits,
      runtime: r.runtimeSec,
      energy: r.bestEnergyEstimate,
      searchSpace: r.searchSpaceSize ?? 2 ** r.qubits,
      params: r.parameterCount,
    })) ?? []

  const lambdaChart =
    lambdaSweep?.filter((r) => !r.error && r.lambda != null).map((r) => ({
      lambda: r.lambda as number,
      objective: r.objective,
      runtime: r.runtimeSec,
      gap: r.gapPct,
      variables: r.numVariables,
    })) ?? []

  const scaleChart = PORTFOLIO_INSTANCES.map((row) => ({
    label: row.label,
    variables: row.variables,
    assets: row.assets,
  }))

  const runChart = runs.map((r) => ({
    name: r.label,
    variables: r.variables,
    runtime: r.runtimeSec,
    gap: r.gapPct ?? 0,
  }))

  return (
    <section className="rounded-xl border border-emerald-900/40 bg-[#161d27] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-emerald-400">Student parameter lab</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Explore how changing variables affects results</h3>
          <p className="mt-2 max-w-3xl text-xs text-slate-500">
            Increase qubits for quantum demos (section 2) or assets/λ for QOBLIB QUBOs (section 3). Record runs and use
            sweeps to build comparison charts. Full portfolio instances need thousands of qubits — use QAOA to learn
            scaling laws, QUBO sweeps for real finance benchmarks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={sweepingQubits}
            onClick={onSweepQubits}
            className="rounded-lg bg-cyan-700 px-3 py-2 text-xs font-medium hover:bg-cyan-600 disabled:opacity-40"
          >
            {sweepingQubits ? 'Sweeping qubits…' : 'QAOA qubit sweep (sim)'}
          </button>
          <button
            type="button"
            disabled={sweepingLambda || !canSweepLambda}
            onClick={onSweepLambda}
            className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-medium hover:bg-indigo-600 disabled:opacity-40"
          >
            {sweepingLambda ? 'Sweeping λ…' : `λ sweep (${instanceKey})`}
          </button>
          {runs.length > 0 ? (
            <button type="button" onClick={onClear} className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-400">
              Clear log
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {PARAM_GUIDE.map((g) => (
          <div key={g.knob} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs">
            <p className="font-medium text-white">{g.knob}</p>
            <p className="mt-1 text-slate-400">{g.increases}</p>
            <p className="mt-2 text-emerald-400/90">Try: {g.studentTry}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-white">QOBLIB problem size (Table 5)</p>
          <p className="text-xs text-slate-500">Binary variables vs benchmark instance — why a400 is “intractable”</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scaleChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} scale="log" domain={[500, 50000]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Line type="monotone" dataKey="variables" name="QUBO variables" stroke="#34d399" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {qubitChart.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-white">QAOA qubit sweep — runtime vs size</p>
            <p className="text-xs text-slate-500">Combinatorial search space 2ⁿ grows exponentially</p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="qubits" name="Qubits" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis type="number" dataKey="runtime" name="Runtime (s)" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <ZAxis type="number" dataKey="searchSpace" range={[60, 400]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Scatter name="QAOA runs" data={qubitChart} fill="#22d3ee" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {lambdaChart.length > 0 ? (
          <div className="xl:col-span-2">
            <p className="text-sm font-medium text-white">λ sweep — objective & runtime</p>
            <p className="text-xs text-slate-500">Same instance, varying risk aversion (classical SA)</p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lambdaChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="lambda"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    scale="log"
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => String(v)}
                  />
                  <YAxis yAxisId="obj" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis yAxisId="rt" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Legend />
                  <Line yAxisId="obj" type="monotone" dataKey="objective" name="SA objective" stroke="#818cf8" dot />
                  <Line yAxisId="rt" type="monotone" dataKey="runtime" name="Runtime (s)" stroke="#fbbf24" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {runChart.length > 0 ? (
          <div className="xl:col-span-2">
            <p className="text-sm font-medium text-white">Your recorded runs</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-500">
                    <th className="py-2 pr-3">Label</th>
                    <th className="py-2 pr-3">Variables</th>
                    <th className="py-2 pr-3">Runtime</th>
                    <th className="py-2 pr-3">Objective</th>
                    <th className="py-2">Gap %</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id} className="border-b border-slate-800 text-slate-300">
                      <td className="py-2 pr-3">{r.label}</td>
                      <td className="py-2 pr-3 font-mono">{r.variables.toLocaleString()}</td>
                      <td className="py-2 pr-3">{r.runtimeSec}s</td>
                      <td className="py-2 pr-3 font-mono">{r.objective?.toLocaleString() ?? '—'}</td>
                      <td className="py-2">{r.gapPct != null ? `${r.gapPct}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

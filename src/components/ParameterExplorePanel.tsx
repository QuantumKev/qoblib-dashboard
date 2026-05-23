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
import { QGG_CHART } from '../chartTheme'
import { QggPanel } from './ui/QggPanel'
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
    <QggPanel num="EXPLORE" title="Parameter exploration">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-3xl text-xs text-qgg-muted">
          Increase qubits for quantum demos or assets/λ for QOBLIB QUBOs. Record runs and use sweeps to build comparison
          charts.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={sweepingQubits} onClick={onSweepQubits} className="qgg-btn qgg-btn-accent disabled:opacity-40">
            {sweepingQubits ? 'SWEEPING…' : 'QAOA QUBIT SWEEP'}
          </button>
          <button
            type="button"
            disabled={sweepingLambda || !canSweepLambda}
            onClick={onSweepLambda}
            className="qgg-btn disabled:opacity-40"
          >
            {sweepingLambda ? 'SWEEPING…' : `λ SWEEP (${instanceKey})`}
          </button>
          {runs.length > 0 ? (
            <button type="button" onClick={onClear} className="qgg-btn">
              CLEAR LOG
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-0 border border-qgg md:grid-cols-2 lg:grid-cols-3">
        {PARAM_GUIDE.map((g) => (
          <div key={g.knob} className="border-b border-qgg bg-qgg-paper p-3 text-xs md:border-r">
            <p className="font-semibold">{g.knob}</p>
            <p className="mt-1 text-qgg-muted">{g.increases}</p>
            <p className="mt-2">Try: {g.studentTry}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <p className="qgg-section-title text-xs">QOBLIB problem size (Table 5)</p>
          <div className="qgg-chart mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scaleChart}>
                <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                <XAxis dataKey="label" tick={{ fill: QGG_CHART.tick, fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                <YAxis tick={{ fill: QGG_CHART.tick, fontSize: 11 }} scale="log" domain={[500, 50000]} />
                <Tooltip contentStyle={QGG_CHART.tooltip} />
                <Line type="monotone" dataKey="variables" name="QUBO variables" stroke={QGG_CHART.line[0]} strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {qubitChart.length > 0 ? (
          <div>
            <p className="qgg-section-title text-xs">QAOA qubit sweep</p>
            <div className="qgg-chart mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                  <XAxis type="number" dataKey="qubits" name="Qubits" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                  <YAxis type="number" dataKey="runtime" name="Runtime (s)" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                  <ZAxis type="number" dataKey="searchSpace" range={[60, 400]} />
                  <Tooltip contentStyle={QGG_CHART.tooltip} />
                  <Scatter name="QAOA runs" data={qubitChart} fill={QGG_CHART.line[0]} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {lambdaChart.length > 0 ? (
          <div className="xl:col-span-2">
            <p className="qgg-section-title text-xs">λ sweep — objective & runtime</p>
            <div className="qgg-chart mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lambdaChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                  <XAxis dataKey="lambda" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} scale="log" domain={['auto', 'auto']} tickFormatter={(v) => String(v)} />
                  <YAxis yAxisId="obj" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                  <YAxis yAxisId="rt" orientation="right" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                  <Tooltip contentStyle={QGG_CHART.tooltip} />
                  <Legend />
                  <Line yAxisId="obj" type="monotone" dataKey="objective" name="SA objective" stroke={QGG_CHART.line[1]} dot />
                  <Line yAxisId="rt" type="monotone" dataKey="runtime" name="Runtime (s)" stroke={QGG_CHART.line[2]} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {runChart.length > 0 ? (
          <div className="xl:col-span-2">
            <p className="qgg-section-title text-xs">Your recorded runs</p>
            <div className="mt-3 overflow-x-auto">
              <table className="qgg-table min-w-[640px] text-xs">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Variables</th>
                    <th>Runtime</th>
                    <th>Objective</th>
                    <th>Gap %</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id}>
                      <td>{r.label}</td>
                      <td className="font-mono">{r.variables.toLocaleString()}</td>
                      <td>{r.runtimeSec}s</td>
                      <td className="font-mono">{r.objective?.toLocaleString() ?? '—'}</td>
                      <td>{r.gapPct != null ? `${r.gapPct}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </QggPanel>
  )
}

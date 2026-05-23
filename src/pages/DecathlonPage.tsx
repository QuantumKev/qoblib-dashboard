import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { QGG_CHART } from '../chartTheme'
import { PageHeader } from '../components/ui/PageHeader'
import { QggPanel } from '../components/ui/QggPanel'
import { PROBLEM_CLASSES } from '../data/qoblibData'

const chartData = PROBLEM_CLASSES.map((p) => ({
  name: `#${p.id}`,
  mip: p.mipVars ?? 0,
  qubo: p.quboVars ?? 0,
  fullName: p.name,
}))

export function DecathlonPage() {
  return (
    <div>
      <PageHeader
        num="02"
        title="Featured Projects"
        subtitle="Ten problem classes chosen for diversity: different industries, constraint types, and matrix densities. Each becomes challenging for classical solvers between roughly 100 and 100,000 decision variables."
      />

      <div className="qgg-page-inner space-y-6">
        <div className="grid gap-0 border border-qgg">
          {PROBLEM_CLASSES.map((problem) => (
            <div
              key={problem.id}
              className={`grid gap-4 border-b border-qgg bg-qgg-paper p-4 last:border-b-0 md:grid-cols-[4rem_1fr_auto] md:items-center ${
                problem.slug === 'portfolio' ? 'bg-qgg-accent/30' : ''
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-qgg bg-qgg-paper font-mono text-lg font-bold">
                {String(problem.id).padStart(2, '0')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{problem.name}</h3>
                  {problem.slug === 'portfolio' ? (
                    <span className="qgg-tag bg-qgg-accent">Your focus</span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-qgg-muted">{problem.description}</p>
                <p className="mt-1 font-mono text-xs text-qgg-muted">Domain: {problem.domain}</p>
              </div>
              <div className="text-right font-mono text-xs text-qgg-muted">
                <p>MIP: {problem.mipVars?.toLocaleString() ?? '—'}</p>
                <p>QUBO: {problem.quboVars?.toLocaleString() ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>

        <QggPanel num="CHART" title="Problem size at difficulty threshold">
          <p className="text-xs text-qgg-muted">
            Approximate decision variables when classical solvers start to struggle (from Table 2)
          </p>
          <div className="qgg-chart mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                <XAxis dataKey="name" tick={{ fill: QGG_CHART.tick, fontSize: 12 }} />
                <YAxis
                  scale="log"
                  domain={[10, 500000]}
                  tick={{ fill: QGG_CHART.tick, fontSize: 12 }}
                  label={{
                    value: 'Variables (log scale)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: QGG_CHART.tick,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={QGG_CHART.tooltip}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                />
                <Bar dataKey="mip" name="MIP formulation" fill={QGG_CHART.line[0]} />
                <Bar dataKey="qubo" name="QUBO formulation" fill={QGG_CHART.line[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </QggPanel>
      </div>
    </div>
  )
}

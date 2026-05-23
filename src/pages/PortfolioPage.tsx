import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PortfolioLiveCharts } from '../components/PortfolioLiveCharts'
import { PageHeader } from '../components/ui/PageHeader'
import { QggPanel } from '../components/ui/QggPanel'
import { QGG_CHART } from '../chartTheme'
import {
  LAMBDA_BENCHMARK,
  OBJECTIVE_CONVERGENCE,
  PORTFOLIO_DATA_FORMAT,
  PORTFOLIO_FEATURES,
  PORTFOLIO_INSTANCES,
  PORTFOLIO_NAMING,
  PORTFOLIO_PARAMS,
  PORTFOLIO_REPO_LAYOUT,
  RUNTIME_BY_LAMBDA,
} from '../data/qoblibData'

export function PortfolioPage() {
  return (
    <div>
      <PageHeader
        num="05"
        title="QOBLIB Benchmark — Portfolio #06"
        subtitle="Multi-period Markowitz portfolio selection with binary buy/hold decisions, transaction costs, short-selling fees, and capital constraints — built from real S&P 500 prices and covariances."
      />

      <div className="qgg-page-inner space-y-6">
        <QggPanel title="Problem features (official README)">
          <ul className="grid gap-2 md:grid-cols-2">
            {PORTFOLIO_FEATURES.map((f) => (
              <li key={f} className="text-sm text-qgg-muted">
                • {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="border border-qgg bg-qgg-paper p-4 text-sm text-qgg-muted">
              <p className="font-semibold text-qgg-fg">Objective (minimize)</p>
              <p className="mt-2 leading-relaxed">
                Per period: λ-weighted covariance risk minus expected profit, plus transaction costs δ, minus cash
                interest ρ<sub>c</sub>, plus short-selling cost ρ<sub>s</sub>, plus final liquidation cost.
              </p>
              <p className="mt-3 font-semibold text-qgg-fg">Constraints (each day t)</p>
              <p className="mt-1 font-mono text-xs">Σᵢ τᵢ xᵢₜ + Σc 2ᶜ y_cₜ = C</p>
              <p className="text-xs">Capital limit — total units held plus cash encoding equals C</p>
              <p className="mt-2 font-mono text-xs">Σᵢ xᵢₜ + Σb 2ᵇ s_bₜ = B</p>
              <p className="text-xs">Position limit — at most B assets per day</p>
            </div>
            <div className="border border-qgg bg-qgg-accent/20 p-4 text-sm text-qgg-muted">
              <p className="font-semibold text-qgg-fg">Instance naming</p>
              <p className="mt-2 font-mono text-xs">Price data: {PORTFOLIO_NAMING.priceInstance}</p>
              <p className="mt-1 font-mono text-xs">QUBO file: {PORTFOLIO_NAMING.quboProblem}</p>
              <ul className="mt-3 space-y-2 text-xs">
                {PORTFOLIO_NAMING.fields.map((row) => (
                  <li key={row.code}>
                    <span className="font-mono">{row.code}</span> — {row.meaning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </QggPanel>

        <section className="grid gap-0 border border-qgg md:grid-cols-3">
          {Object.entries(PORTFOLIO_DATA_FORMAT).map(([k, v]) => (
            <div key={k} className="border-b border-qgg bg-qgg-paper p-4 md:border-r">
              <p className="font-mono text-xs uppercase text-qgg-muted">{k}</p>
              <p className="mt-1 text-sm">{v}</p>
            </div>
          ))}
        </section>

        <QggPanel title="QOBLIB repository layout">
          <div className="grid gap-2 sm:grid-cols-2">
            {PORTFOLIO_REPO_LAYOUT.map((row) => (
              <div key={row.dir} className="flex gap-2 text-sm">
                <code className="shrink-0 font-mono">{row.dir}</code>
                <span className="text-qgg-muted">{row.desc}</span>
              </div>
            ))}
          </div>
        </QggPanel>

        <section className="grid gap-0 border border-qgg md:grid-cols-2 xl:grid-cols-4">
          {Object.entries({
            'Risk-free rate': PORTFOLIO_PARAMS.riskFreeRate.annual,
            'Transaction cost': PORTFOLIO_PARAMS.transactionCost.daily,
            'Short loan rate': PORTFOLIO_PARAMS.shortLoanRate.annual,
            'Total capital': PORTFOLIO_PARAMS.cashTotal,
          }).map(([k, v]) => (
            <div key={k} className="border-b border-qgg bg-qgg-paper p-4 md:border-r">
              <p className="font-mono text-xs uppercase text-qgg-muted">{k}</p>
              <p className="qgg-stat-value mt-1">{v}</p>
            </div>
          ))}
        </section>

        <QggPanel title="What the optimizer decides">
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="space-y-2 text-sm text-qgg-muted">
              <li>
                <strong>Hold or skip</strong> each stock each day (binary x<sub>it</sub>)
              </li>
              <li>
                <strong>Long vs short</strong> positions (τ = +1 or −1)
              </li>
              <li>
                <strong>Up to 3 units</strong> per asset via unary encoding
              </li>
              <li>
                <strong>Cash allocation</strong> with risk-free interest on unused capital
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-qgg-muted">
              <li>
                <strong>Minimize</strong> risk (λ-weighted covariance) minus expected profit
              </li>
              <li>
                <strong>Pay</strong> transaction fees when holdings change
              </li>
              <li>
                <strong>Respect</strong> capital limit C and max positions B
              </li>
              <li>
                <strong>Liquidate</strong> at final period with closing costs
              </li>
            </ul>
          </div>
        </QggPanel>

        <PortfolioLiveCharts />

        <QggPanel title="Benchmark instances (Table 5)">
          <p className="text-xs text-qgg-muted">
            4 instances per row (1 original S&P data + 3 perturbed). Price ID: po_a{'{assets}'}_t{'{periods}'}_
            {'{orig|sXX}'} · QUBO ID adds b{'{BBB}'} and l{'{λ}'}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="qgg-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Assets (n)</th>
                  <th>Periods (m)</th>
                  <th>Max positions (B)</th>
                  <th>Binary variables</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                {PORTFOLIO_INSTANCES.map((row) => (
                  <tr key={row.label}>
                    <td>{row.assets}</td>
                    <td>{row.periods}</td>
                    <td>{row.assetLimit}</td>
                    <td className="font-mono">{row.variables.toLocaleString()}</td>
                    <td className="font-mono text-xs">{row.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QggPanel>

        <QggPanel title="Solver runtime vs risk aversion (λ)">
          <p className="text-xs text-qgg-muted">Figure 11 — Gurobi MIP, 3600s timeout.</p>
          <div className="qgg-chart mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RUNTIME_BY_LAMBDA}>
                <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                <XAxis dataKey="lambda" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                <YAxis scale="log" domain={[0.1, 5000]} tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                <Tooltip contentStyle={QGG_CHART.tooltip} />
                <Legend />
                <Line type="monotone" dataKey="a10t10" name="10 assets, 10 days" stroke={QGG_CHART.line[0]} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="a10t15" name="10 assets, 15 days" stroke={QGG_CHART.line[1]} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="a50t10" name="50 assets, 10 days" stroke={QGG_CHART.line[2]} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="a50t15" name="50 assets, 15 days" stroke={QGG_CHART.line[3]} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </QggPanel>

        <div className="grid gap-6 xl:grid-cols-2">
          <QggPanel title="Classical vs quantum-ready solver">
            <p className="text-xs text-qgg-muted">Table 6 — instance po_a050_t15_s00.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="qgg-table text-xs">
                <thead>
                  <tr>
                    <th>λ</th>
                    <th>Gurobi gap %</th>
                    <th>Gurobi time (s)</th>
                    <th>ABS2 gap %</th>
                    <th>ABS2 time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {LAMBDA_BENCHMARK.map((row) => (
                    <tr key={row.lambda}>
                      <td className="font-mono">{row.lambda}</td>
                      <td>{row.gurobiGap}</td>
                      <td>{row.gurobiTime}</td>
                      <td>{row.abs2Gap}</td>
                      <td>{row.abs2Time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </QggPanel>

          <QggPanel title="Solution quality over time">
            <p className="text-xs text-qgg-muted">Figure 12 — λ = 0.0005, 50 assets.</p>
            <div className="qgg-chart mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={OBJECTIVE_CONVERGENCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
                  <XAxis dataKey="time" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
                  <YAxis tick={{ fill: QGG_CHART.tick, fontSize: 11 }} tickFormatter={(v) => `${(v / 1e5).toFixed(1)}×10⁵`} />
                  <Tooltip contentStyle={QGG_CHART.tooltip} formatter={(v) => Number(v).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="abs2" name="ABS2 (QUBO)" stroke={QGG_CHART.line[1]} dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="gurobi" name="Gurobi (MIP/BQP)" stroke={QGG_CHART.line[0]} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </QggPanel>
        </div>
      </div>
    </div>
  )
}

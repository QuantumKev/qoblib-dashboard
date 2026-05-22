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
import {
  LAMBDA_BENCHMARK,
  OBJECTIVE_CONVERGENCE,
  PORTFOLIO_INSTANCES,
  PORTFOLIO_PARAMS,
  RUNTIME_BY_LAMBDA,
} from '../data/qoblibData'

export function PortfolioPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-semibold text-white">Portfolio Optimization (#06)</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Multi-period Markowitz-style portfolio selection with binary buy/hold decisions, transaction costs,
          short-selling fees, and capital constraints — built from real S&P 500 prices and covariances.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries({
          'Risk-free rate': PORTFOLIO_PARAMS.riskFreeRate.annual,
          'Transaction cost': PORTFOLIO_PARAMS.transactionCost.daily,
          'Short loan rate': PORTFOLIO_PARAMS.shortLoanRate.annual,
          'Total capital': PORTFOLIO_PARAMS.cashTotal,
        }).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-800 bg-[#161d27] p-4">
            <p className="text-xs uppercase text-slate-500">{k}</p>
            <p className="mt-1 text-xl font-semibold text-white">{v}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">What the optimizer decides</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-sm text-slate-400">
            <li><span className="text-cyan-300">Hold or skip</span> each stock each day (binary x<sub>it</sub>)</li>
            <li><span className="text-cyan-300">Long vs short</span> positions (τ = +1 or −1)</li>
            <li><span className="text-cyan-300">Up to 3 units</span> per asset via unary encoding</li>
            <li><span className="text-cyan-300">Cash allocation</span> with risk-free interest on unused capital</li>
          </ul>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><span className="text-amber-300">Minimize</span> risk (λ-weighted covariance) minus expected profit</li>
            <li><span className="text-amber-300">Pay</span> transaction fees when holdings change</li>
            <li><span className="text-amber-300">Respect</span> capital limit C and max positions B</li>
            <li><span className="text-amber-300">Liquidate</span> at final period with closing costs</li>
          </ul>
        </div>
      </section>

      <PortfolioLiveCharts />

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Benchmark instances (Table 5)</h3>
        <p className="mt-1 text-xs text-slate-500">4 instances per row (1 original S&P data + 3 perturbed). Naming: po_a{'{assets}'}_t{'{periods}'}_s{'{seed}'}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Assets (n)</th>
                <th className="py-2 pr-4">Periods (m)</th>
                <th className="py-2 pr-4">Max positions (B)</th>
                <th className="py-2 pr-4">Binary variables</th>
                <th className="py-2">Label</th>
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO_INSTANCES.map((row) => (
                <tr key={row.label} className="border-b border-slate-800 text-slate-300">
                  <td className="py-2 pr-4">{row.assets}</td>
                  <td className="py-2 pr-4">{row.periods}</td>
                  <td className="py-2 pr-4">{row.assetLimit}</td>
                  <td className="py-2 pr-4 font-mono text-cyan-300">{row.variables.toLocaleString()}</td>
                  <td className="py-2 font-mono text-xs">{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Solver runtime vs risk aversion (λ)</h3>
        <p className="mt-1 text-xs text-slate-500">Figure 11 — Gurobi MIP, 3600s timeout. Higher λ = more risk-averse = harder to solve.</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RUNTIME_BY_LAMBDA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="lambda" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Risk aversion λ', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
              <YAxis scale="log" domain={[0.1, 5000]} tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Runtime (seconds, log)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="a10t10" name="10 assets, 10 days" stroke="#22d3ee" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="a10t15" name="10 assets, 15 days" stroke="#34d399" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="a50t10" name="50 assets, 10 days" stroke="#fbbf24" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="a50t15" name="50 assets, 15 days" stroke="#f87171" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
          <h3 className="text-lg font-semibold text-white">Classical vs quantum-ready solver</h3>
          <p className="mt-1 text-xs text-slate-500">Table 6 — instance po_a050_t15_s00. Gurobi (BQP/MIP) vs ABS2 (QUBO, 4× A40 GPUs)</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-500">
                  <th className="py-2 pr-2">λ</th>
                  <th className="py-2 pr-2">Gurobi gap %</th>
                  <th className="py-2 pr-2">Gurobi time (s)</th>
                  <th className="py-2 pr-2">ABS2 gap %</th>
                  <th className="py-2">ABS2 time (s)</th>
                </tr>
              </thead>
              <tbody>
                {LAMBDA_BENCHMARK.map((row) => (
                  <tr key={row.lambda} className="border-b border-slate-800 text-slate-300">
                    <td className="py-2 pr-2 font-mono">{row.lambda}</td>
                    <td className="py-2 pr-2">{row.gurobiGap}</td>
                    <td className="py-2 pr-2">{row.gurobiTime}</td>
                    <td className="py-2 pr-2">{row.abs2Gap}</td>
                    <td className="py-2">{row.abs2Time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
          <h3 className="text-lg font-semibold text-white">Solution quality over time</h3>
          <p className="mt-1 text-xs text-slate-500">Figure 12 — λ = 0.0005, 50 assets. ABS2 finds good solutions faster; Gurobi wins eventually.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={OBJECTIVE_CONVERGENCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v / 1e5).toFixed(1)}×10⁵`} label={{ value: 'Best objective (lower is better)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={(v) => Number(v).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="abs2" name="ABS2 (QUBO)" stroke="#6366f1" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="gurobi" name="Gurobi (MIP/BQP)" stroke="#22d3ee" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
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
import { usePortfolioInstance, usePortfolioManifest } from '../hooks/usePortfolioData'

const COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185', '#4ade80', '#60a5fa']

function CovarianceHeatmap({
  symbols,
  values,
  day,
}: {
  symbols: string[]
  values: number[][]
  day: number
}) {
  const flat = values.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const span = max - min || 1

  return (
    <div>
      <p className="mb-3 text-xs text-slate-500">Return covariance on day {day} (top 10 symbols)</p>
      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-px bg-slate-800"
          style={{ gridTemplateColumns: `4rem repeat(${symbols.length}, minmax(2.5rem, 1fr))` }}
        >
          <div />
          {symbols.map((s) => (
            <div key={s} className="truncate px-1 py-1 text-center text-[10px] text-slate-400">
              {s}
            </div>
          ))}
          {symbols.map((rowSym, i) => (
            <div key={rowSym} className="contents">
              <div className="truncate px-1 py-2 text-[10px] text-slate-400">{rowSym}</div>
              {values[i].map((v, j) => {
                const t = (v - min) / span
                const r = Math.round(30 + t * 120)
                const b = Math.round(180 - t * 100)
                return (
                  <div
                    key={`${rowSym}-${symbols[j]}`}
                    className="flex items-center justify-center text-[9px] text-slate-200"
                    style={{ background: `rgb(20,${r},${b})`, minHeight: 28 }}
                    title={`${rowSym}/${symbols[j]}: ${v}`}
                  >
                    {v.toExponential(1)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PortfolioLiveCharts() {
  const { manifest, loading: manifestLoading } = usePortfolioManifest()
  const [selectedId, setSelectedId] = useState<string | null>('po_a010_t10_orig')
  const { data, loading } = usePortfolioInstance(selectedId)

  const chartRows = useMemo(() => {
    if (!data) return []
    const daySet = new Set<number>()
    data.priceSeries.forEach((s) => s.points.forEach((p) => daySet.add(p.day)))
    return [...daySet]
      .sort((a, b) => a - b)
      .map((day) => {
        const row: Record<string, number | string> = { day }
        data.priceSeries.forEach((s) => {
          const pt = s.points.find((p) => p.day === day)
          if (pt) row[s.symbol] = pt.normalized
        })
        return row
      })
  }, [data])

  return (
    <section className="rounded-xl border border-cyan-900/40 bg-[#161d27] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Live QOBLIB instance data</h3>
          <p className="mt-1 text-xs text-slate-500">
            Parsed from cloned repo — stock_prices.txt.gz &amp; covariance_matrices.txt.gz
          </p>
        </div>
        <label className="text-sm text-slate-400">
          Instance{' '}
          <select
            className="ml-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            disabled={manifestLoading}
          >
            {manifest.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} ({m.assets} assets, {m.periods} days)
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading || !data ? (
        <p className="mt-6 text-sm text-slate-500">Loading instance data…</p>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Normalized price paths (base = 100)</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Trading day', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: 'Indexed price', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {data.priceSeries.map((s, i) => (
                    <Line
                      key={s.symbol}
                      type="monotone"
                      dataKey={s.symbol}
                      stroke={COLORS[i % COLORS.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {data.symbols.length} symbols total — chart shows up to 12. Source: {data.id}
            </p>
          </div>
          <CovarianceHeatmap
            symbols={data.covarianceHeatmap.symbols}
            values={data.covarianceHeatmap.values}
            day={data.covarianceHeatmap.day}
          />
        </div>
      )}
    </section>
  )
}

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
import { QggPanel } from './ui/QggPanel'
import { usePortfolioInstance, usePortfolioManifest } from '../hooks/usePortfolioData'

const COLORS = ['#0a0a0a', '#666666', '#e6fb04', '#333333', '#888888', '#444444', '#aaaaaa', '#222222']

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
      <p className="mb-3 text-xs text-qgg-muted">Return covariance on day {day} (top 10 symbols)</p>
      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-px border border-qgg bg-qgg-fg"
          style={{ gridTemplateColumns: `4rem repeat(${symbols.length}, minmax(2.5rem, 1fr))` }}
        >
          <div />
          {symbols.map((s) => (
            <div key={s} className="truncate bg-qgg-paper px-1 py-1 text-center text-[10px] text-qgg-muted">
              {s}
            </div>
          ))}
          {symbols.map((rowSym, i) => (
            <div key={rowSym} className="contents">
              <div className="truncate bg-qgg-paper px-1 py-2 text-[10px] text-qgg-muted">{rowSym}</div>
              {values[i].map((v, j) => {
                const t = (v - min) / span
                const gray = Math.round(240 - t * 180)
                return (
                  <div
                    key={`${rowSym}-${symbols[j]}`}
                    className="flex items-center justify-center bg-qgg-paper text-[9px]"
                    style={{ background: `rgb(${gray},${gray},${Math.round(gray * 0.95)})`, minHeight: 28 }}
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
    <QggPanel dark title="Live QOBLIB instance data">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-xs text-[#888]">Parsed from cloned repo — stock_prices.txt.gz &amp; covariance_matrices.txt.gz</p>
        <label className="font-mono text-xs uppercase text-[#ccc]">
          Instance{' '}
          <select
            className="ml-2 border-2 border-[#f2f2ec] bg-qgg-terminal px-3 py-2 text-sm text-[#f2f2ec]"
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
        <p className="mt-6 text-sm text-[#888]">Loading instance data…</p>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Normalized price paths (base = 100)</p>
            <div className="qgg-chart h-72 rounded border border-[#333] bg-[#111] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #e6fb04', borderRadius: 0, color: '#f2f2ec' }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#ccc' }} />
                  {data.priceSeries.map((s, i) => (
                    <Line
                      key={s.symbol}
                      type="monotone"
                      dataKey={s.symbol}
                      stroke={i === 0 ? '#e6fb04' : COLORS[i % COLORS.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-[#888]">
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
    </QggPanel>
  )
}

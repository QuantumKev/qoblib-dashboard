type Props = {
  backend?: string
  shots?: number
  bitstring?: string
  counts?: Record<string, number>
  className?: string
}

export function QggTerminal({
  backend = 'ibm_torino',
  shots = 8192,
  bitstring,
  counts,
  className = '',
}: Props) {
  const topCounts = counts
    ? Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${v}`)
        .join('  ')
    : '00 11: 4121  10 01: 2048  01 10: 1923'

  return (
    <div className={`qgg-terminal font-mono text-[11px] leading-relaxed ${className}`}>
      <p className="text-qgg-terminal-dim">BACKEND: {backend.toUpperCase()}</p>
      <p className="text-qgg-terminal-dim">SHOTS: {shots}</p>
      <pre className="mt-3 overflow-x-auto text-qgg-terminal-text">{`
        q0: ──H──●──────M──
        q1: ──H──┼──●──M──
        q2: ──H──●──┼──M──
        q3: ──H──────●──M──
      `.trim()}</pre>
      <p className="mt-3 text-qgg-terminal-dim">COUNTS</p>
      <p className="text-qgg-accent">{bitstring ? `${bitstring} (best)` : topCounts}</p>
    </div>
  )
}

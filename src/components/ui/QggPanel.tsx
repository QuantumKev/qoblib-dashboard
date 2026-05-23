import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  dark?: boolean
  id?: string
  num?: string
  title?: string
}

export function QggPanel({ children, className = '', dark = false, id, num, title }: Props) {
  return (
    <section
      id={id}
      className={`qgg-panel border border-qgg p-5 lg:p-6 ${dark ? 'qgg-panel-dark' : 'bg-qgg-paper'} ${className}`}
    >
      {num || title ? (
        <header className="mb-4 flex flex-wrap items-baseline gap-2 border-b border-qgg pb-3">
          {num ? <span className="font-mono text-xs text-qgg-muted">{num} /</span> : null}
          {title ? <h3 className="qgg-section-title text-sm">{title}</h3> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

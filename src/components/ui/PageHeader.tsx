import type { ReactNode } from 'react'

type Props = {
  num?: string
  title: string
  subtitle?: string
  children?: ReactNode
}

export function PageHeader({ num, title, subtitle, children }: Props) {
  return (
    <header className="border-b border-qgg bg-qgg-paper px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
        {num ? <p className="font-mono text-xs uppercase tracking-widest text-qgg-muted">{num} /</p> : null}
        <h1 className="qgg-display mt-2 max-w-4xl text-3xl uppercase leading-tight lg:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-qgg-muted lg:text-base">{subtitle}</p> : null}
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </header>
  )
}

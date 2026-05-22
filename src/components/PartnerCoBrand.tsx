import { PARTNERS } from '../data/workforceData'

type Props = {
  compact?: boolean
}

/** Co-branded partner strip for presentation title slide */
export function PartnerCoBrand({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-md border border-[#052FAD]/40 bg-[#052FAD]/10 px-2.5 py-1 font-semibold text-[#6BA3FF]">
          IBM Quantum
        </span>
        <span className="text-slate-600">×</span>
        <span className="rounded-md border border-violet-500/40 bg-violet-500/10 px-2.5 py-1 font-semibold text-violet-300">
          Quantum Global Group
        </span>
        <span className="text-slate-600">×</span>
        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-medium text-cyan-300">
          QOBLIB Workforce Lab
        </span>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <a
        href={PARTNERS.ibmHbcu.url}
        target="_blank"
        rel="noreferrer"
        className="group rounded-xl border border-[#052FAD]/50 bg-gradient-to-br from-[#052FAD]/20 to-transparent p-4 transition hover:border-[#052FAD]/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#052FAD] text-sm font-bold text-white">
            IBM
          </div>
          <div>
            <p className="text-sm font-semibold text-[#6BA3FF] group-hover:text-white">IBM Quantum</p>
            <p className="text-[10px] leading-tight text-slate-400">HBCU Quantum Center · Qiskit · Cloud access</p>
          </div>
        </div>
      </a>
      <a
        href={PARTNERS.quantumGlobalGroup.url}
        target="_blank"
        rel="noreferrer"
        className="group rounded-xl border border-violet-500/50 bg-gradient-to-br from-violet-500/15 to-transparent p-4 transition hover:border-violet-400/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600 text-[10px] font-bold leading-tight text-white">
            QGG
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-300 group-hover:text-white">Quantum Global Group</p>
            <p className="text-[10px] leading-tight text-slate-400">Workforce development · Industry playbook</p>
          </div>
        </div>
      </a>
      <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-600 text-[9px] font-bold leading-tight text-white">
            QOBLIB
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-300">Intractable Decathlon</p>
            <p className="text-[10px] leading-tight text-slate-400">Portfolio #06 · arXiv:2504.03832</p>
          </div>
        </div>
      </div>
    </div>
  )
}

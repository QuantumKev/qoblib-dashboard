import { QggLogo } from './QggLogo'
import { PARTNERS } from '../data/workforceData'

type Props = {
  compact?: boolean
}

/** Co-branded partner strip for presentation title slide */
export function PartnerCoBrand({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="qgg-tag bg-qgg-accent font-semibold">IBM Quantum</span>
        <span className="text-qgg-muted">×</span>
        <QggLogo size="sm" linkHome={false} />
        <span className="text-qgg-muted">×</span>
        <span className="qgg-tag font-medium">QOBLIB Lab</span>
      </div>
    )
  }

  return (
    <div className="grid gap-0 border-2 border-qgg sm:grid-cols-3">
      <a
        href={PARTNERS.ibmHbcu.url}
        target="_blank"
        rel="noreferrer"
        className="group border-b border-qgg bg-qgg-paper p-4 transition hover:bg-qgg-accent sm:border-b-0 sm:border-r"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-qgg bg-[#052FAD] text-sm font-bold text-white">
            IBM
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:underline">IBM Quantum</p>
            <p className="text-[10px] leading-tight text-qgg-muted">HBCU Quantum Center · Qiskit · Cloud access</p>
          </div>
        </div>
      </a>
      <a
        href={PARTNERS.quantumGlobalGroup.url}
        target="_blank"
        rel="noreferrer"
        className="group border-b border-qgg bg-qgg-paper p-4 transition hover:bg-qgg-accent sm:border-b-0 sm:border-r"
      >
        <div className="flex items-center gap-3">
          <QggLogo size="sm" linkHome={false} />
          <div>
            <p className="text-sm font-semibold group-hover:underline">Quantum Global Group</p>
            <p className="text-[10px] leading-tight text-qgg-muted">Workforce development · Industry playbook</p>
          </div>
        </div>
      </a>
      <div className="bg-qgg-accent/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-qgg bg-qgg-paper text-[9px] font-bold leading-tight">
            QOBLIB
          </div>
          <div>
            <p className="text-sm font-semibold">Intractable Decathlon</p>
            <p className="text-[10px] leading-tight text-qgg-muted">Portfolio #06 · arXiv:2504.03832</p>
          </div>
        </div>
      </div>
    </div>
  )
}

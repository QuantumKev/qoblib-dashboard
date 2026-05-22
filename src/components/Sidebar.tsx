import { NavLink } from 'react-router-dom'

const links: { to: string; label: string; highlight?: boolean }[] = [
  { to: '/', label: 'Overview' },
  { to: '/decathlon', label: '10 Problems' },
  { to: '/portfolio', label: 'Portfolio Deep Dive' },
  { to: '/lab', label: 'Quantum Lab', highlight: true },
  { to: '/learn', label: 'Beginner Guide' },
  { to: '/present', label: 'Presentation', highlight: true },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-[#121820] px-5 py-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">QOBLIB</p>
        <h1 className="mt-1 text-lg font-semibold leading-snug text-white">Intractable Decathlon</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">Interactive dashboard for arXiv:2504.03832</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-cyan-950/60 text-cyan-300'
                  : link.highlight
                    ? 'text-amber-300/90 hover:bg-amber-950/40 hover:text-amber-200'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 pt-8 text-xs text-slate-500">
        <a href="https://arxiv.org/abs/2504.03832" target="_blank" rel="noreferrer" className="block hover:text-cyan-400">
          Paper on arXiv
        </a>
        <a href="https://github.com/ZIB-AOPT/QOBLIB" target="_blank" rel="noreferrer" className="block hover:text-cyan-400">
          GitHub repository
        </a>
        <a
          href="https://git.zib.de/qopt/qoblib-quantum-optimization-benchmarking-library/-/tree/main/06-portfolio"
          target="_blank"
          rel="noreferrer"
          className="block hover:text-cyan-400"
        >
          Portfolio instances
        </a>
      </div>
    </aside>
  )
}

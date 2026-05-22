import {
  HBCU_MEMBERS,
  IBM_HBCU_ALIGNMENT,
  IBM_PITCH_POINTS,
  INDUSTRY_PLAYBOOK,
  PARTNERS,
  STUDENT_MODULES,
} from '../data/workforceData'

/** One-page print handout — hidden on screen, shown when printing or saving as PDF */
export function WorkforceHandoutPrint() {
  const site = 'https://quantumkev.github.io/qoblib-dashboard'
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div
      id="workforce-handout"
      className="hidden print:block print:bg-white print:text-black"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[8.5in] p-[0.45in] font-sans text-[9pt] leading-snug text-gray-900">
        {/* Co-brand header */}
        <div className="flex items-start justify-between border-b-2 border-gray-800 pb-3">
          <div>
            <p className="text-[7pt] font-semibold uppercase tracking-widest text-gray-500">Workforce development handout</p>
            <h1 className="mt-1 text-[16pt] font-bold leading-tight text-gray-900">
              QOBLIB Quantum Optimization Lab
            </h1>
            <p className="mt-1 text-[9pt] text-gray-600">
              Interactive benchmark dashboard · arXiv:2504.03832 · Portfolio problem #06
            </p>
          </div>
          <div className="text-right text-[8pt]">
            <p className="font-bold text-[#052FAD]">IBM Quantum</p>
            <p className="text-[7pt] text-gray-600">HBCU Quantum Center aligned</p>
            <p className="mt-2 font-bold text-[#5B21B6]">Quantum Global Group</p>
            <p className="text-[7pt] text-gray-600">Workforce &amp; delivery playbook</p>
          </div>
        </div>

        <p className="mt-3 text-[8pt] italic text-gray-700">
          Students duplicate the same define → fit check → pilot → benchmark → report → enable workflow that industry
          teams use — with visuals they can present to IBM, faculty, and employers. {today}
        </p>

        {/* Six steps condensed */}
        <h2 className="mt-4 text-[10pt] font-bold uppercase tracking-wide text-gray-800">
          Industry playbook → dashboard (Quantum Global Group)
        </h2>
        <table className="mt-2 w-full border-collapse text-[7.5pt]">
          <thead>
            <tr className="border-b border-gray-400 bg-gray-100">
              <th className="py-1 pr-2 text-left w-8">#</th>
              <th className="py-1 pr-2 text-left w-[18%]">Step</th>
              <th className="py-1 pr-2 text-left">Student action</th>
              <th className="py-1 text-left w-[22%]">Route</th>
            </tr>
          </thead>
          <tbody>
            {INDUSTRY_PLAYBOOK.map((s) => (
              <tr key={s.step} className="border-b border-gray-200">
                <td className="py-1 pr-2 font-bold">{s.step}</td>
                <td className="py-1 pr-2 font-medium">{s.title}</td>
                <td className="py-1 pr-2">{s.studentAction}</td>
                <td className="py-1 font-mono text-[7pt]">{site}{s.route}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* IBM alignment */}
          <div>
            <h2 className="text-[10pt] font-bold uppercase tracking-wide text-gray-800">
              IBM-HBCU Quantum Center alignment
            </h2>
            <ul className="mt-2 space-y-1.5 text-[7.5pt]">
              {IBM_HBCU_ALIGNMENT.slice(0, 4).map((row) => (
                <li key={row.centerGoal}>
                  <span className="font-semibold">{row.centerGoal}:</span>{' '}
                  <span className="text-gray-700">{row.dashboardDelivers}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[7pt] text-gray-500">
              {PARTNERS.ibmHbcu.memberCount} member HBCUs incl. Howard, Morgan State, NC A&amp;T, Xavier LA ·{' '}
              {PARTNERS.ibmHbcu.url}
            </p>
          </div>

          {/* 5-week curriculum */}
          <div>
            <h2 className="text-[10pt] font-bold uppercase tracking-wide text-gray-800">5-week cohort curriculum</h2>
            <ul className="mt-2 space-y-1 text-[7.5pt]">
              {STUDENT_MODULES.map((m) => (
                <li key={m.id}>
                  <span className="font-semibold">{m.week}:</span> {m.title} — {m.deliverable.slice(0, 72)}…
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Live demo + pitch */}
        <div className="mt-4 rounded border border-gray-300 bg-gray-50 p-3">
          <h2 className="text-[10pt] font-bold text-gray-800">10-minute IBM demo path</h2>
          <p className="mt-1 text-[8pt]">
            <strong>1.</strong> {site}/workforce · <strong>2.</strong> /lab (IBM token + CRN, qubit sweep, λ sweep) ·{' '}
            <strong>3.</strong> /portfolio (a010 → a050) · <strong>4.</strong> /present slides 8–11
          </p>
          <p className="mt-2 text-[7.5pt] text-gray-700">
            Local API: <code className="text-[7pt]">npm run server</code> + <code className="text-[7pt]">npm run dev</code>{' '}
            · Educators: {PARTNERS.ibmHbcu.educatorsUrl}
          </p>
        </div>

        <ul className="mt-3 columns-2 gap-4 text-[7pt] text-gray-700">
          {IBM_PITCH_POINTS.map((p) => (
            <li key={p} className="mb-1 break-inside-avoid">✓ {p}</li>
          ))}
        </ul>

        <footer className="mt-4 flex items-end justify-between border-t border-gray-300 pt-2 text-[7pt] text-gray-500">
          <div>
            <p className="font-semibold text-gray-800">Quantum Global Group</p>
            <p>{PARTNERS.quantumGlobalGroup.url} · Kevin Robinson, CEO</p>
            <p className="mt-0.5">GitHub: github.com/QuantumKev/qoblib-dashboard</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-[#052FAD]">IBM-HBCU Quantum Center</p>
            <p className="max-w-[2.5in] text-[6.5pt]">{HBCU_MEMBERS.slice(0, 6).join(' · ')}…</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

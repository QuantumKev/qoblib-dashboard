import { Link } from 'react-router-dom'
import {
  ENTERPRISE_VS_STUDENT,
  HBCU_MEMBERS,
  IBM_HBCU_ALIGNMENT,
  IBM_PITCH_POINTS,
  INDUSTRY_PLAYBOOK,
  PARTNERS,
  STUDENT_MODULES,
} from '../data/workforceData'

function PlaybookCard({
  step,
  title,
  industry,
  dashboard,
  route,
  visual,
  studentAction,
  explainIt,
}: (typeof INDUSTRY_PLAYBOOK)[0]) {
  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#161d27] p-5">
      <div className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
        {step}
      </div>
      <div className="ml-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4 className="text-base font-semibold text-white">{title}</h4>
          <Link to={route} className="text-xs text-cyan-400 hover:underline">
            Open in dashboard →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400/90">Industry (Quantum Global Group)</p>
            <p className="mt-1 text-sm text-slate-400">{industry}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-400/90">This dashboard</p>
            <p className="mt-1 text-sm text-slate-400">{dashboard}</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-900/60 px-3 py-2 text-xs text-slate-500">
          <span className="text-slate-400">Visuals: </span>
          {visual}
        </p>
        <p className="mt-2 text-sm text-emerald-300/90">
          <span className="text-slate-500">Student does: </span>
          {studentAction}
        </p>
        <p className="mt-2 border-l-2 border-indigo-500/50 pl-3 text-xs italic text-indigo-200/80">
          How to explain it: {explainIt}
        </p>
      </div>
    </div>
  )
}

export function WorkforcePage() {
  return (
    <div className="space-y-10">
      <header className="rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-[#161d27] via-[#121820] to-indigo-950/30 p-8">
        <p className="text-sm font-medium text-emerald-400">Workforce development · IBM & industry aligned</p>
        <h2 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight text-white">
          Train students to duplicate the same quantum optimization workflow enterprises use — with visuals they can present
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
          This dashboard connects the{' '}
          <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
            IBM-HBCU Quantum Center
          </a>{' '}
          model (cloud access, Qiskit, research pathways) with{' '}
          <a href={PARTNERS.quantumGlobalGroup.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
            Quantum Global Group
          </a>{' '}
          execution playbooks (define → benchmark → enable teams). Students don’t just watch demos — they produce benchmark
          reports on the same QOBLIB portfolio problem IBM helped publish.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/lab"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            Start the lab
          </Link>
          <Link
            to="/present"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/60"
          >
            Presentation mode
          </Link>
          <a
            href={PARTNERS.ibmHbcu.educatorsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-indigo-700/60 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-950/40"
          >
            IBM Quantum Educators Program
          </a>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-blue-900/40 bg-[#161d27] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Partner alignment</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{PARTNERS.ibmHbcu.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{PARTNERS.ibmHbcu.tagline}</p>
          <ul className="mt-4 space-y-2 text-xs text-slate-500">
            <li>• {PARTNERS.ibmHbcu.memberCount} HBCU member institutions</li>
            <li>• Qiskit + IBM Quantum cloud access for students & faculty</li>
            <li>• Research advisory board incl. IBM Quantum education leadership</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
              Center announcement
            </a>
            <span className="text-slate-700">·</span>
            <a href={PARTNERS.ibmHbcu.learningUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
              IBM Quantum Learning
            </a>
            <span className="text-slate-700">·</span>
            <a href={PARTNERS.ibmHbcu.qiskitUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline">
              Qiskit
            </a>
          </div>
        </div>
        <div className="rounded-xl border border-violet-900/40 bg-[#161d27] p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Partner alignment</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{PARTNERS.quantumGlobalGroup.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{PARTNERS.quantumGlobalGroup.mission}</p>
          <ul className="mt-4 space-y-2 text-xs text-slate-500">
            <li>• Workforce development: project-based training theory → delivery</li>
            <li>• Research incl. quantum portfolio optimization & hybrid QML</li>
            <li>• Real QPU access patterns via open tooling (e.g. HuggingFace spaces)</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={PARTNERS.quantumGlobalGroup.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline"
            >
              quantumglobalgroup.io
            </a>
            <span className="text-slate-700">·</span>
            <a
              href={PARTNERS.quantumGlobalGroup.huggingFaceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline"
            >
              HuggingFace projects
            </a>
            <span className="text-slate-700">·</span>
            <a
              href={PARTNERS.quantumGlobalGroup.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-white">Industry playbook → student lab (same six steps)</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Quantum Global Group’s delivery process, implemented as clickable dashboard modules. Each step includes what to
          show on screen and what the student says out loud.
        </p>
        <div className="mt-6 space-y-4 pl-3">
          {INDUSTRY_PLAYBOOK.map((step) => (
            <PlaybookCard key={step.step} {...step} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">IBM-HBCU Quantum Center goals → dashboard features</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Center goal</th>
                <th className="py-2 pr-4">IBM provides</th>
                <th className="py-2">This dashboard</th>
              </tr>
            </thead>
            <tbody>
              {IBM_HBCU_ALIGNMENT.map((row) => (
                <tr key={row.centerGoal} className="border-b border-slate-800 text-slate-300">
                  <td className="py-3 pr-4 font-medium text-white">{row.centerGoal}</td>
                  <td className="py-3 pr-4 text-slate-400">{row.ibmProvides}</td>
                  <td className="py-3 text-cyan-200/90">{row.dashboardDelivers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Member institutions: {HBCU_MEMBERS.slice(0, 4).join(', ')}, … and {HBCU_MEMBERS.length - 4} more (
          <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
            full list
          </a>
          )
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-white">5-week cohort curriculum (duplicate & explain)</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STUDENT_MODULES.map((mod) => (
            <Link
              key={mod.id}
              to={mod.route}
              className="group rounded-xl border border-slate-800 bg-[#161d27] p-5 transition-colors hover:border-emerald-800/60 hover:bg-emerald-950/10"
            >
              <p className="text-xs font-medium text-emerald-400">{mod.week}</p>
              <h4 className="mt-1 font-semibold text-white group-hover:text-emerald-200">{mod.title}</h4>
              <p className="mt-2 text-xs text-slate-500">
                <span className="text-slate-400">Deliverable: </span>
                {mod.deliverable}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {mod.skills.map((s) => (
                  <span key={s} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#161d27] p-6">
        <h3 className="text-lg font-semibold text-white">Enterprise workflow vs student experience</h3>
        <ul className="mt-4 space-y-3">
          {ENTERPRISE_VS_STUDENT.map((row) => (
            <li key={row.enterprise} className="grid gap-2 border-b border-slate-800 pb-3 text-sm last:border-0 md:grid-cols-2">
              <span className="text-slate-400">{row.enterprise}</span>
              <span className="text-emerald-300/90">{row.student}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-cyan-900/50 bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 p-6">
        <h3 className="text-lg font-semibold text-white">For your IBM presentation</h3>
        <ul className="mt-4 space-y-2">
          {IBM_PITCH_POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-slate-300">
              <span className="text-cyan-400">✓</span>
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-slate-500">
          Live demo path: /workforce (this page) → /lab (IBM connect + qubit sweep) → /portfolio (a050 charts) → /present
          (slide 8–10). Repo:{' '}
          <a href="https://github.com/QuantumKev/qoblib-dashboard" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
            QuantumKev/qoblib-dashboard
          </a>
        </p>
      </section>
    </div>
  )
}

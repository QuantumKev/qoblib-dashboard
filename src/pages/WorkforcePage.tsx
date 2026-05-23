import { Link } from 'react-router-dom'
import { PartnerCoBrand } from '../components/PartnerCoBrand'
import { WorkforceHandoutPrint } from '../components/WorkforceHandoutPrint'
import { PageHeader } from '../components/ui/PageHeader'
import { QggPanel } from '../components/ui/QggPanel'
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
    <div className="relative border border-qgg bg-qgg-paper p-5">
      <div className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center border-2 border-qgg bg-qgg-accent text-sm font-bold">
        {step}
      </div>
      <div className="ml-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h4 className="qgg-section-title text-sm">{title}</h4>
          <Link to={route} className="font-mono text-xs uppercase hover:bg-qgg-accent">
            Open ↗
          </Link>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase text-qgg-muted">Industry (QGG)</p>
            <p className="mt-1 text-sm text-qgg-muted">{industry}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase text-qgg-muted">This dashboard</p>
            <p className="mt-1 text-sm text-qgg-muted">{dashboard}</p>
          </div>
        </div>
        <p className="mt-3 border border-qgg bg-qgg-paper px-3 py-2 text-xs text-qgg-muted">
          <span className="font-semibold text-qgg-fg">Visuals: </span>
          {visual}
        </p>
        <p className="mt-2 text-sm">
          <span className="text-qgg-muted">Student does: </span>
          {studentAction}
        </p>
        <p className="mt-2 border-l-2 border-qgg-accent pl-3 text-xs italic text-qgg-muted">
          How to explain it: {explainIt}
        </p>
      </div>
    </div>
  )
}

export function WorkforcePage() {
  function printHandout() {
    window.print()
  }

  return (
    <>
      <WorkforceHandoutPrint />
      <PageHeader
        num="03"
        title="Services & Workforce"
        subtitle="Train students to duplicate the same quantum optimization workflow enterprises use — with visuals they can present."
      >
        <Link to="/lab" className="qgg-btn qgg-btn-accent">
          START LAB ↗
        </Link>
        <Link to="/present" className="qgg-btn">
          PRESENT
        </Link>
        <button type="button" onClick={printHandout} className="qgg-btn">
          HANDOUT PDF
        </button>
        <a
          href={PARTNERS.ibmHbcu.educatorsUrl}
          target="_blank"
          rel="noreferrer"
          className="qgg-btn"
        >
          IBM EDUCATORS ↗
        </a>
      </PageHeader>

      <div className="no-print qgg-page-inner space-y-8">
        <QggPanel>
          <PartnerCoBrand />
          <p className="mt-6 text-sm leading-relaxed text-qgg-muted">
            This dashboard connects the{' '}
            <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="qgg-link">
              IBM-HBCU Quantum Center
            </a>{' '}
            model (cloud access, Qiskit, research pathways) with{' '}
            <a href={PARTNERS.quantumGlobalGroup.url} target="_blank" rel="noreferrer" className="qgg-link">
              Quantum Global Group
            </a>{' '}
            execution playbooks (define → benchmark → enable teams). Students don&apos;t just watch demos — they produce
            benchmark reports on the same QOBLIB portfolio problem IBM helped publish.
          </p>
        </QggPanel>

        <section className="grid gap-0 border border-qgg lg:grid-cols-2">
          <div className="border-b border-qgg bg-qgg-paper p-6 lg:border-b-0 lg:border-r">
            <p className="font-mono text-xs uppercase text-qgg-muted">Partner alignment</p>
            <h3 className="mt-2 qgg-section-title text-sm">{PARTNERS.ibmHbcu.name}</h3>
            <p className="mt-2 text-sm text-qgg-muted">{PARTNERS.ibmHbcu.tagline}</p>
            <ul className="mt-4 space-y-2 text-xs text-qgg-muted">
              <li>• {PARTNERS.ibmHbcu.memberCount} HBCU member institutions</li>
              <li>• Qiskit + IBM Quantum cloud access for students & faculty</li>
              <li>• Research advisory board incl. IBM Quantum education leadership</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
              <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="qgg-link">
                Center ↗
              </a>
              <span>·</span>
              <a href={PARTNERS.ibmHbcu.learningUrl} target="_blank" rel="noreferrer" className="qgg-link">
                Learning ↗
              </a>
              <span>·</span>
              <a href={PARTNERS.ibmHbcu.qiskitUrl} target="_blank" rel="noreferrer" className="qgg-link">
                Qiskit ↗
              </a>
            </div>
          </div>
          <div className="bg-qgg-accent/20 p-6">
            <p className="font-mono text-xs uppercase text-qgg-muted">Partner alignment</p>
            <h3 className="mt-2 qgg-section-title text-sm">{PARTNERS.quantumGlobalGroup.name}</h3>
            <p className="mt-2 text-sm text-qgg-muted">{PARTNERS.quantumGlobalGroup.mission}</p>
            <ul className="mt-4 space-y-2 text-xs text-qgg-muted">
              <li>• Workforce development: project-based training theory → delivery</li>
              <li>• Research incl. quantum portfolio optimization & hybrid QML</li>
              <li>• Real QPU access patterns via open tooling (e.g. HuggingFace spaces)</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
              <a href={PARTNERS.quantumGlobalGroup.url} target="_blank" rel="noreferrer" className="qgg-link">
                quantumglobalgroup.io ↗
              </a>
              <span>·</span>
              <a href={PARTNERS.quantumGlobalGroup.huggingFaceUrl} target="_blank" rel="noreferrer" className="qgg-link">
                HuggingFace ↗
              </a>
              <span>·</span>
              <a href={PARTNERS.quantumGlobalGroup.githubUrl} target="_blank" rel="noreferrer" className="qgg-link">
                GitHub ↗
              </a>
            </div>
          </div>
        </section>

        <section>
          <h3 className="qgg-section-title text-lg">Industry playbook → student lab</h3>
          <p className="mt-2 max-w-3xl text-sm text-qgg-muted">
            Quantum Global Group&apos;s delivery process, implemented as clickable dashboard modules.
          </p>
          <div className="mt-6 space-y-4 pl-3">
            {INDUSTRY_PLAYBOOK.map((step) => (
              <PlaybookCard key={step.step} {...step} />
            ))}
          </div>
        </section>

        <QggPanel num="04" title="IBM-HBCU goals → dashboard features">
          <div className="overflow-x-auto">
            <table className="qgg-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Center goal</th>
                  <th>IBM provides</th>
                  <th>This dashboard</th>
                </tr>
              </thead>
              <tbody>
                {IBM_HBCU_ALIGNMENT.map((row) => (
                  <tr key={row.centerGoal}>
                    <td className="font-medium">{row.centerGoal}</td>
                    <td className="text-qgg-muted">{row.ibmProvides}</td>
                    <td>{row.dashboardDelivers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-qgg-muted">
            Member institutions: {HBCU_MEMBERS.slice(0, 4).join(', ')}, … and {HBCU_MEMBERS.length - 4} more (
            <a href={PARTNERS.ibmHbcu.url} target="_blank" rel="noreferrer" className="qgg-link">
              full list
            </a>
            )
          </p>
        </QggPanel>

        <section>
          <h3 className="qgg-section-title text-lg">5-week cohort curriculum</h3>
          <div className="mt-4 grid gap-0 border border-qgg md:grid-cols-2 xl:grid-cols-3">
            {STUDENT_MODULES.map((mod) => (
              <Link
                key={mod.id}
                to={mod.route}
                className="group border-b border-qgg bg-qgg-paper p-5 transition hover:bg-qgg-accent md:border-r"
              >
                <p className="font-mono text-xs text-qgg-muted">{mod.week}</p>
                <h4 className="mt-1 font-semibold group-hover:underline">{mod.title}</h4>
                <p className="mt-2 text-xs text-qgg-muted">
                  <span className="font-semibold">Deliverable: </span>
                  {mod.deliverable}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {mod.skills.map((s) => (
                    <span key={s} className="qgg-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <QggPanel title="Enterprise workflow vs student experience">
          <ul className="space-y-3">
            {ENTERPRISE_VS_STUDENT.map((row) => (
              <li key={row.enterprise} className="grid gap-2 border-b border-qgg pb-3 text-sm last:border-0 md:grid-cols-2">
                <span className="text-qgg-muted">{row.enterprise}</span>
                <span className="font-medium">{row.student}</span>
              </li>
            ))}
          </ul>
        </QggPanel>

        <QggPanel dark title="For your IBM presentation">
          <ul className="space-y-2">
            {IBM_PITCH_POINTS.map((point) => (
              <li key={point} className="flex gap-2 text-sm">
                <span className="text-qgg-accent">✓</span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#888] no-print">
            Handout: Click “HANDOUT PDF” — in the print dialog choose Save as PDF.
          </p>
          <p className="mt-2 text-xs text-[#888]">
            Live demo: /workforce → /lab → /portfolio → /present. Repo:{' '}
            <a href="https://github.com/QuantumKev/qoblib-dashboard" target="_blank" rel="noreferrer" className="text-qgg-accent underline">
              QuantumKev/qoblib-dashboard
            </a>
          </p>
        </QggPanel>
      </div>
    </>
  )
}

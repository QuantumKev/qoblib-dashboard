/** Workforce development content — IBM HBCU Quantum Center + Quantum Global Group alignment */

export const PARTNERS = {
  ibmHbcu: {
    name: 'IBM-HBCU Quantum Center',
    url: 'https://www.ibm.com/quantum/blog/ibm-hbcu-quantum-center',
    educatorsUrl: 'https://quantum.cloud.ibm.com/programs/educators',
    learningUrl: 'https://learning.quantum.ibm.com/',
    qiskitUrl: 'https://qiskit.org/',
    tagline: 'Cloud access, Qiskit education, and research pathways for 13 HBCUs',
    memberCount: 13,
  },
  quantumGlobalGroup: {
    name: 'Quantum Global Group',
    url: 'https://www.quantumglobalgroup.io',
    huggingFaceUrl: 'https://huggingface.co/quantumGlobalGroup',
    githubUrl: 'https://github.com/Quantum-Global-Group',
    tagline: 'Strategy, execution, and workforce capability from theory to delivery',
    mission:
      'Lead the global transformation into the quantum era through practical quantum solutions and expanded access via education and partnerships.',
  },
}

export const HBCU_MEMBERS = [
  'Albany State University',
  'Clark Atlanta University',
  'Coppin State University',
  'Hampton University',
  'Howard University',
  'Morehouse College',
  'Morgan State University',
  'North Carolina A&T State University',
  'Southern University',
  'Texas Southern University',
  'University of the Virgin Islands',
  'Virginia Union University',
  'Xavier University of Louisiana',
]

export type PlaybookStep = {
  step: number
  title: string
  industry: string
  dashboard: string
  route: string
  visual: string
  studentAction: string
  explainIt: string
}

/** Quantum Global Group 6-step process mapped to dashboard experiences */
export const INDUSTRY_PLAYBOOK: PlaybookStep[] = [
  {
    step: 1,
    title: 'Define the outcome',
    industry: 'Align on the decision, success metrics, and what “better” means for the business workflow.',
    dashboard: 'Overview + Portfolio pages frame the QOBLIB benchmark question and portfolio #06 economics.',
    route: '/',
    visual: 'Problem statement cards · Table 5 instance sizes · λ risk parameter',
    studentAction: 'Read the one-minute QOBLIB story; pick a portfolio instance and λ to study.',
    explainIt:
      '“We are not guessing — we use the same published benchmark IBM collaborators helped define (arXiv:2504.03832).”',
  },
  {
    step: 2,
    title: 'Fit check',
    industry: 'Decide if the problem is quantum-suitable now, later, or best served classically.',
    dashboard: 'Parameter lab scale chart + qubit slider show when quantum hardware fits vs when QOBLIB needs classical solvers.',
    route: '/lab',
    visual: '2ⁿ search-space growth · 710 → 36,165 variable curve',
    studentAction: 'Run QAOA at 4 vs 12 qubits; compare to a050 QUBO variable count.',
    explainIt:
      '“Portfolio at full scale is intractable on NISQ today — our fit check mirrors how enterprises gate quantum pilots.”',
  },
  {
    step: 3,
    title: 'Pilot design',
    industry: 'Choose datasets, constraints, baselines, and acceptance criteria for a defendable pilot.',
    dashboard: 'Lab instance picker, λ selector, shots/reps — same knobs researchers use in QOBLIB submissions.',
    route: '/lab',
    visual: 'Instance ID · problem prefix · baseline panel',
    studentAction: 'Select po_a050_t15_s00, λ = 0.0005, document shots/reps/iterations before running.',
    explainIt:
      '“Every submission reports problem ID, objective, runtime, hardware — students practice that exact CSV format.”',
  },
  {
    step: 4,
    title: 'Build & benchmark',
    industry: 'Reproducible experiments compared against classical baselines.',
    dashboard: 'IBM Qiskit Runtime jobs + classical SA on official .qs.xz files vs 258 ingested QOBLIB submissions.',
    route: '/lab',
    visual: 'Gurobi vs ABS2 charts · gap % scoring · recorded run log',
    studentAction: 'Connect IBM token + CRN; run simulator then QPU; solve QUBO; compare to ABS2 reference.',
    explainIt:
      '“We duplicate the paper’s Table 6 workflow — Gurobi MIP vs ABS2 QUBO — with live scoring in the UI.”',
  },
  {
    step: 5,
    title: 'Report & roadmap',
    industry: 'Share results, tradeoffs, and next steps for scaling or pivot.',
    dashboard: 'Verification verdicts, parameter sweep charts, presentation mode with speaker notes.',
    route: '/present',
    visual: 'Bar charts · λ sweep lines · slide deck',
    studentAction: 'Export talking points from /present; present gap % and runtime tradeoffs to class.',
    explainIt:
      '“Students leave with defendable numbers and charts — not just ‘quantum is cool.’”',
  },
  {
    step: 6,
    title: 'Enable the team',
    industry: 'Workforce tracks, tooling, and knowledge transfer so the organization can repeat the process.',
    dashboard: 'Beginner guide + this workforce hub + open GitHub repo for colleges to fork and extend.',
    route: '/learn',
    visual: 'Concept glossary · playbook checklist · HBCU pathway',
    studentAction: 'Teach a peer using /learn; mentor another cohort through the same lab checklist.',
    explainIt:
      '“Capability building is the product — the dashboard is the reusable lab manual.”',
  },
]

export type HbcuAlignmentRow = {
  centerGoal: string
  ibmProvides: string
  dashboardDelivers: string
}

/** IBM-HBCU Quantum Center goals → this dashboard */
export const IBM_HBCU_ALIGNMENT: HbcuAlignmentRow[] = [
  {
    centerGoal: 'Cloud access to IBM quantum computers',
    ibmProvides: 'Qiskit Runtime + IBM Quantum Platform instances',
    dashboardDelivers: 'Lab section 1–2: token + CRN connect, simulator → real backend job submission',
  },
  {
    centerGoal: 'Qiskit education & open science',
    ibmProvides: 'Qiskit framework, IBM Quantum Learning, Educators Program',
    dashboardDelivers: 'Open-source FastAPI + Qiskit backend; links to learning.quantum.ibm.com in every module',
  },
  {
    centerGoal: 'Undergraduate & graduate research opportunities',
    ibmProvides: 'Funding, mentorship, research advisory board',
    dashboardDelivers: 'QOBLIB portfolio #06 deep dive — same problem class cited in quantum finance literature',
  },
  {
    centerGoal: 'Diverse quantum-ready workforce',
    ibmProvides: '13 HBCU network, community & belonging focus',
    dashboardDelivers: 'Zero-cost local lab; students explain results with visuals even without owning HPC clusters',
  },
  {
    centerGoal: 'Connect talent to the quantum research community',
    ibmProvides: 'Internships, fellowships, showcase platform',
    dashboardDelivers: 'Standard QOBLIB submission IDs — students speak the language of published benchmarks',
  },
]

export type StudentModule = {
  id: string
  week: string
  title: string
  route: string
  deliverable: string
  skills: string[]
}

export const STUDENT_MODULES: StudentModule[] = [
  {
    id: 'm1',
    week: 'Week 1',
    title: 'Speak the benchmark language',
    route: '/learn',
    deliverable: 'One-page explainer: MIP vs QUBO, what λ means, why QOBLIB exists',
    skills: ['Optimization vocabulary', 'Benchmark literacy', 'Presentation'],
  },
  {
    id: 'm2',
    week: 'Week 2',
    title: 'Explore real market data',
    route: '/portfolio',
    deliverable: 'Screenshot walkthrough of two instances (a010 vs a050) with price & covariance charts',
    skills: ['Financial data', 'Problem sizing', 'Visual storytelling'],
  },
  {
    id: 'm3',
    week: 'Week 3',
    title: 'Connect & run on IBM Quantum',
    route: '/lab',
    deliverable: 'Job log: simulator vs hardware — qubits, shots, reps, runtime, best bitstring',
    skills: ['Qiskit Runtime', 'IBM Cloud credentials', 'Experimental design'],
  },
  {
    id: 'm4',
    week: 'Week 4',
    title: 'Benchmark like industry',
    route: '/lab',
    deliverable: 'QOBLIB verification report: your objective vs ABS2/Gurobi, gap %, λ sweep chart',
    skills: ['Reproducible research', 'Baseline comparison', 'Honest result reporting'],
  },
  {
    id: 'm5',
    week: 'Week 5',
    title: 'Present to stakeholders',
    route: '/present',
    deliverable: '5-minute IBM-style briefing using built-in slides + live demo',
    skills: ['Executive communication', 'Demo discipline', 'Workforce portfolio piece'],
  },
]

export const ENTERPRISE_VS_STUDENT = [
  {
    enterprise: 'Quantum Global Group: quantum readiness & use-case screening',
    student: 'Fit-check exercise: qubit sweep vs portfolio variable scale on /lab',
  },
  {
    enterprise: 'IBM Quantum: cloud QPU access for pilot teams',
    student: 'Same stack — IBM token, CRN, backend picker, Qiskit Runtime Sampler',
  },
  {
    enterprise: 'ZIB/QOBLIB: published baselines & verification checkers',
    student: '258 submissions ingested; gap scoring against Table 6 references',
  },
  {
    enterprise: 'Hybrid quantum-classical production pilots',
    student: 'QAOA warmup on QPU + classical SA on official QUBO files — side by side',
  },
  {
    enterprise: 'Workforce enablement & knowledge transfer',
    student: 'Cohort repeats modules; peers teach peers using /learn + this playbook',
  },
]

export const IBM_PITCH_POINTS = [
  'Built on the same IBM Quantum Platform + Qiskit Runtime stack the HBCU Center provides to member schools.',
  'Turns QOBLIB portfolio #06 — a problem IBM co-authored — into a hands-on workforce lab with visuals students can defend.',
  'Mirrors Quantum Global Group’s industry playbook: define → fit check → pilot → benchmark → report → enable.',
  'Free to fork for any college cohort; runs locally so HBCU students aren’t blocked by HPC queue times for the classical side.',
  'Presentation mode included for demo days, advisory boards, and IBM partner reviews.',
]

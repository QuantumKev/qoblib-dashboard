const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.detail ?? data.message ?? `Request failed (${res.status})`)
  }
  return data as T
}

export function checkLabApiHealth() {
  return api<{ status: string }>('/api/health')
}

export function connectIBM(token: string, crn: string, channel = 'ibm_quantum_platform') {
  return api<import('../types/lab').IBMConnectResponse>('/api/ibm/connect', {
    method: 'POST',
    body: JSON.stringify({ token, crn, channel }),
  })
}

export function runIBMDemo(params: {
  token: string
  crn: string
  backend: string
  shots: number
  reps: number
  channel?: string
}) {
  return api<import('../types/lab').IBMRunResponse>('/api/ibm/run-demo', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function verifyObjective(params: {
  problem_id: string
  objective: number
  reference_objective?: number | null
  runtime_sec?: number | null
}) {
  return api<import('../types/lab').VerifyResponse>('/api/verify/compare', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export function fetchPaperTable6() {
  return api<{ rows: import('../types/lab').PaperTable6Row[]; instance: string }>('/api/verify/paper-table6')
}

export async function fetchBaselines(): Promise<import('../types/lab').BaselinesFile> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/baselines.json`)
  if (!res.ok) throw new Error('Failed to load QOBLIB baselines')
  return res.json()
}

export async function fetchQuboCatalog(): Promise<import('../types/lab').QuboCatalogFile> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/qubo-catalog.json`)
  if (!res.ok) throw new Error('Failed to load QUBO catalog')
  return res.json()
}

export function fetchQuboCatalogLive() {
  return api<import('../types/lab').QuboCatalogFile>('/api/portfolio/qubo-catalog')
}

export function solvePortfolioQubo(params: { qs_path: string; iterations?: number; seed?: number }) {
  return api<import('../types/lab').QuboSolveResponse>('/api/portfolio/solve-qubo', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

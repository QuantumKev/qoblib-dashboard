import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ParameterExplorePanel } from '../components/ParameterExplorePanel'
import { PageHeader } from '../components/ui/PageHeader'
import { QggPanel } from '../components/ui/QggPanel'
import { QGG_CHART } from '../chartTheme'
import {
  checkLabApiHealth,
  connectIBM,
  fetchBaselines,
  fetchPaperTable6,
  fetchQuboCatalog,
  fetchQuboCatalogLive,
  runIBMDemo,
  solvePortfolioQubo,
  sweepQaoaQubits,
  sweepQuboLambda,
  verifyObjective,
} from '../api/labApi'
import type {
  BaselinesFile,
  ExploreRunRecord,
  IBMConnectResponse,
  IBMRunResponse,
  LambdaSweepRow,
  PaperTable6Row,
  QuboCatalogEntry,
  QuboCatalogFile,
  QuboSolveResponse,
  VerifyResponse,
} from '../types/lab'
import { PAPER_TABLE6 } from '../data/qoblibData'

const STORAGE_KEY = 'qoblib-ibm-credentials'

function loadCredentials() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: '', crn: '', channel: 'ibm_quantum_platform' }
  } catch {
    return { token: '', crn: '', channel: 'ibm_quantum_platform' }
  }
}

function saveCredentials(token: string, crn: string, channel: string) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, crn, channel }))
}

export function LabPage() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const [token, setToken] = useState(() => loadCredentials().token)
  const [crn, setCrn] = useState(() => loadCredentials().crn)
  const [channel, setChannel] = useState(() => loadCredentials().channel)
  const [connecting, setConnecting] = useState(false)
  const [connection, setConnection] = useState<IBMConnectResponse | null>(null)
  const [backend, setBackend] = useState('simulator')
  const [qubits, setQubits] = useState(4)
  const [shots, setShots] = useState(1024)
  const [reps, setReps] = useState(2)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<IBMRunResponse | null>(null)
  const [exploreRuns, setExploreRuns] = useState<ExploreRunRecord[]>([])
  const [qubitSweep, setQubitSweep] = useState<IBMRunResponse[] | null>(null)
  const [lambdaSweep, setLambdaSweep] = useState<LambdaSweepRow[] | null>(null)
  const [sweepingQubits, setSweepingQubits] = useState(false)
  const [sweepingLambda, setSweepingLambda] = useState(false)
  const [baselines, setBaselines] = useState<BaselinesFile | null>(null)
  const [table6, setTable6] = useState<PaperTable6Row[]>([])
  const [selectedLambdaIdx, setSelectedLambdaIdx] = useState(5)
  const [yourObjective, setYourObjective] = useState('')
  const [yourRuntime, setYourRuntime] = useState('')
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quboCatalog, setQuboCatalog] = useState<QuboCatalogFile | null>(null)
  const [assetFilter, setAssetFilter] = useState<'50' | '10' | 'all'>('50')
  const [instanceKey, setInstanceKey] = useState('po_a050_t15_s00')
  const [quboEntryIdx, setQuboEntryIdx] = useState(0)
  const [quboIterations, setQuboIterations] = useState(6000)
  const [solvingQubo, setSolvingQubo] = useState(false)
  const [quboResult, setQuboResult] = useState<QuboSolveResponse | null>(null)

  useEffect(() => {
    checkLabApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
    fetchBaselines().then(setBaselines).catch(() => undefined)
    fetchPaperTable6()
      .then((d) => setTable6(d.rows))
      .catch(() => setTable6(PAPER_TABLE6))
    fetchQuboCatalog()
      .then(setQuboCatalog)
      .catch(() => undefined)
    if (apiOnline !== false) {
      fetchQuboCatalogLive()
        .then(setQuboCatalog)
        .catch(() => undefined)
    }
  }, [apiOnline])

  useEffect(() => {
    if (backend !== 'simulator' && qubits > 12) setQubits(12)
  }, [backend, qubits])

  const selectedRow = table6[selectedLambdaIdx]

  const comparisonChart = useMemo(() => {
    if (!selectedRow) return []
    const yours = yourObjective ? Number(yourObjective) : null
    return [
      { solver: 'Gurobi (paper)', objective: selectedRow.gurobiObjective, runtime: selectedRow.gurobiRuntimeSec },
      { solver: 'ABS2 (paper)', objective: selectedRow.abs2Objective, runtime: selectedRow.abs2RuntimeSec },
      ...(yours && Number.isFinite(yours)
        ? [{ solver: 'Your run', objective: yours, runtime: yourRuntime ? Number(yourRuntime) : null }]
        : []),
    ]
  }, [selectedRow, yourObjective, yourRuntime])

  const abs2ForInstance = useMemo(() => {
    if (!baselines) return []
    return baselines.submissions
      .filter((s) => s.solver === 'ABS2' && s.problemId.includes('a050_t15_s00_b020'))
      .slice(0, 12)
  }, [baselines])

  const quboInstances = useMemo(() => {
    if (!quboCatalog) return []
    const keys = new Set<string>()
    quboCatalog.entries.forEach((e) => {
      if (assetFilter === 'all' || String(e.assets) === assetFilter) keys.add(e.instanceKey)
    })
    return [...keys].sort()
  }, [quboCatalog, assetFilter])

  const quboLambdas = useMemo(() => {
    if (!quboCatalog) return []
    return quboCatalog.entries
      .filter((e) => e.instanceKey === instanceKey)
      .sort((a, b) => a.lambda - b.lambda)
  }, [quboCatalog, instanceKey])

  const selectedQubo: QuboCatalogEntry | undefined = quboLambdas[quboEntryIdx]

  const canSweepLambda = useMemo(
    () => quboLambdas.some((e) => e.localAvailable),
    [quboLambdas],
  )

  function recordRun(record: Omit<ExploreRunRecord, 'id'>) {
    setExploreRuns((prev) => [...prev, { ...record, id: `${Date.now()}-${prev.length}` }])
  }

  function recordQaoaRun(res: IBMRunResponse) {
    recordRun({
      kind: 'qaoa',
      label: `QAOA ${res.qubits}q · ${res.reps}p · ${res.backend}`,
      variables: res.searchSpaceSize ?? 2 ** res.qubits,
      runtimeSec: res.runtimeSec,
      objective: res.bestEnergyEstimate,
      qubits: res.qubits,
      reps: res.reps,
      shots: res.shots,
      backend: res.backend,
    })
  }

  function recordQuboRun(res: QuboSolveResponse, entry: QuboCatalogEntry) {
    recordRun({
      kind: 'qubo',
      label: `${entry.instanceKey} λ=${entry.lambda}`,
      variables: res.numVariables,
      runtimeSec: res.runtimeSec,
      objective: res.objective,
      gapPct: res.verification?.gapPct ?? null,
      lambda: entry.lambda,
    })
  }

  useEffect(() => {
    setQuboEntryIdx(0)
  }, [instanceKey])

  useEffect(() => {
    if (quboInstances.length && !quboInstances.includes(instanceKey)) {
      setInstanceKey(quboInstances.includes('po_a050_t15_s00') ? 'po_a050_t15_s00' : quboInstances[0])
    }
  }, [quboInstances, instanceKey])

  const largeInstanceBaselines = useMemo(() => {
    if (!baselines || !quboCatalog) return []
    return quboCatalog.largeInstances.map((inst) => ({
      ...inst,
      abs2: baselines.submissions.filter((s) => s.instanceKey === inst.instanceKey && s.solver === 'ABS2').slice(0, 6),
    }))
  }, [baselines, quboCatalog])

  async function handleConnect() {
    setError(null)
    setConnecting(true)
    try {
      saveCredentials(token, crn, channel)
      const res = await connectIBM(token, crn, channel)
      setConnection(res)
      if (res.operationalBackends.length > 0) {
        setBackend(res.operationalBackends[0])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connection failed')
      setConnection(null)
    } finally {
      setConnecting(false)
    }
  }

  async function handleRun() {
    setError(null)
    setRunning(true)
    setRunResult(null)
    try {
      const res = await runIBMDemo({ token, crn, channel, backend, qubits, shots, reps })
      setRunResult(res)
      recordQaoaRun(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Run failed')
    } finally {
      setRunning(false)
    }
  }

  async function handleSolveQubo() {
    if (!selectedQubo) return
    setError(null)
    setSolvingQubo(true)
    setQuboResult(null)
    try {
      const res = await solvePortfolioQubo({
        qs_path: selectedQubo.qsPath,
        iterations: quboIterations,
      })
      setQuboResult(res)
      setYourObjective(String(Math.round(res.objective)))
      setYourRuntime(String(res.runtimeSec))
      if (selectedQubo) recordQuboRun(res, selectedQubo)
      if (res.verification?.referenceObjective != null) {
        const v = await verifyObjective({
          problem_id: res.problemId,
          objective: res.objective,
          reference_objective: res.verification.referenceObjective,
          runtime_sec: res.runtimeSec,
        })
        setVerifyResult(v)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'QUBO solve failed')
    } finally {
      setSolvingQubo(false)
    }
  }

  async function handleSweepQubits() {
    setError(null)
    setSweepingQubits(true)
    try {
      const res = await sweepQaoaQubits({
        token,
        crn,
        channel,
        backend: 'simulator',
        qubit_sizes: [4, 6, 8, 10, 12, 14],
        shots: 512,
        reps,
      })
      setQubitSweep(res.sweep)
      res.sweep.filter((r) => !r.error).forEach(recordQaoaRun)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Qubit sweep failed')
    } finally {
      setSweepingQubits(false)
    }
  }

  async function handleSweepLambda() {
    setError(null)
    setSweepingLambda(true)
    try {
      const res = await sweepQuboLambda({ instance_key: instanceKey, iterations: 2500, seed: 42 })
      setLambdaSweep(res.sweep)
      res.sweep
        .filter((r) => !r.error && r.objective != null && r.numVariables != null)
        .forEach((r) =>
          recordRun({
            kind: 'qubo',
            label: `${instanceKey} λ=${r.lambda}`,
            variables: r.numVariables!,
            runtimeSec: r.runtimeSec ?? 0,
            objective: r.objective,
            gapPct: r.gapPct ?? null,
            lambda: r.lambda,
          }),
        )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lambda sweep failed')
    } finally {
      setSweepingLambda(false)
    }
  }

  async function handleVerify() {
    if (!selectedRow) return
    setError(null)
    setVerifying(true)
    try {
      const obj = Number(yourObjective)
      if (!Number.isFinite(obj)) throw new Error('Enter a numeric objective value')
      const ref = selectedRow.gurobiObjective
      const res = await verifyObjective({
        problem_id: selectedQubo?.problemId ?? `a050_t15_s00_b020_l${selectedRow.lambda}`,
        objective: obj,
        reference_objective: ref,
        runtime_sec: yourRuntime ? Number(yourRuntime) : null,
      })
      setVerifyResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div>
      <PageHeader
        num="01"
        title="Quantum Playground"
        subtitle="Connect IBM Quantum for a hardware warmup, then run official QOBLIB portfolio QUBOs at a050 scale (3,110–4,665 variables) with classical simulated annealing and compare against published ABS2/Gurobi results."
      >
        <Link to="/workforce" className="qgg-btn">
          CURRICULUM ↗
        </Link>
      </PageHeader>

      <div className="qgg-page-inner space-y-8">
        <div>
          <p className="text-sm text-qgg-muted">
            Aligned with{' '}
            <a href="https://www.ibm.com/quantum/blog/ibm-hbcu-quantum-center" target="_blank" rel="noreferrer" className="qgg-link">
              IBM-HBCU Quantum Center
            </a>{' '}
            &{' '}
            <a href="https://www.quantumglobalgroup.io" target="_blank" rel="noreferrer" className="qgg-link">
              Quantum Global Group
            </a>
          </p>
          {apiOnline === false ? (
            <div className="qgg-alert-error mt-4 text-sm">
              Local API offline. Start:{' '}
              <code className="font-mono text-xs">cd server; pip install -r requirements.txt; uvicorn main:app --reload --port 8000</code>
            </div>
          ) : apiOnline ? (
            <p className="mt-3 font-mono text-xs uppercase text-qgg-fg">● Lab API connected</p>
          ) : null}
        </div>

      {error ? (
        <div className="qgg-alert-error px-4 py-3 text-sm">{error}</div>
      ) : null}

      <ParameterExplorePanel
        runs={exploreRuns}
        onClear={() => setExploreRuns([])}
        qubitSweep={qubitSweep}
        lambdaSweep={lambdaSweep}
        sweepingQubits={sweepingQubits}
        sweepingLambda={sweepingLambda}
        onSweepQubits={handleSweepQubits}
        onSweepLambda={handleSweepLambda}
        canSweepLambda={canSweepLambda && !!apiOnline}
        instanceKey={instanceKey}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <QggPanel num="1" title="IBM Quantum credentials">
          <p className="text-xs text-qgg-muted">
            Token + instance CRN from{' '}
            <a href="https://quantum.cloud.ibm.com/" target="_blank" rel="noreferrer" className="qgg-link">
              IBM Quantum Platform
            </a>
            . Stored in session only — never sent to GitHub Pages.
          </p>
          <div className="mt-4 space-y-3">
            <label className="qgg-label">
              API token
              <input
                type="password"
                className="qgg-input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste IBM Quantum API token"
                autoComplete="off"
              />
            </label>
            <label className="qgg-label">
              Instance CRN
              <input
                type="text"
                className="qgg-input font-mono text-xs"
                value={crn}
                onChange={(e) => setCrn(e.target.value)}
                placeholder="crn:v1:bluemix:public:quantum-computing:..."
              />
            </label>
            <label className="qgg-label">
              Channel
              <select
                className="qgg-input"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                <option value="ibm_quantum_platform">ibm_quantum_platform</option>
                <option value="ibm_cloud">ibm_cloud</option>
                <option value="ibm_quantum">ibm_quantum (legacy)</option>
              </select>
            </label>
            <button
              type="button"
              disabled={connecting || !token || !crn || !apiOnline}
              onClick={handleConnect}
              className="qgg-btn qgg-btn-accent"
            >
              {connecting ? 'Connecting…' : 'Test connection'}
            </button>
            {connection ? (
              <p className="text-sm font-mono uppercase">{connection.message}</p>
            ) : null}
          </div>
        </QggPanel>

        <QggPanel num="2" title="Run QAOA on IBM Quantum">
          <p className="text-xs text-qgg-muted">
            Ring MaxCut QAOA — increase <strong>qubits</strong> to see exponential search-space growth.
            Use <strong>simulator</strong> up to 20 qubits; on real hardware stay at ≤12 qubits.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="qgg-label sm:col-span-2">
              Qubits (problem size)
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={backend === 'simulator' ? 20 : 12}
                  step={1}
                  value={qubits}
                  onChange={(e) => setQubits(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-24 font-mono text-sm">{qubits} → 2^{qubits} = {(2 ** qubits).toLocaleString()}</span>
              </div>
            </label>
            <label className="qgg-label">
              Backend
              <select
                className="qgg-input"
                value={backend}
                onChange={(e) => setBackend(e.target.value)}
              >
                <option value="simulator">simulator (local Aer)</option>
                {connection?.operationalBackends.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="qgg-label">
              Shots
              <input
                type="number"
                className="qgg-input"
                value={shots}
                min={100}
                max={10000}
                onChange={(e) => setShots(Number(e.target.value))}
              />
            </label>
            <label className="qgg-label">
              QAOA reps
              <input
                type="number"
                className="qgg-input"
                value={reps}
                min={1}
                max={5}
                onChange={(e) => setReps(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            type="button"
            disabled={running || !apiOnline || (backend !== 'simulator' && (!token || !crn))}
            onClick={handleRun}
            className="qgg-btn mt-4 disabled:opacity-40"
          >
            {running ? 'Running job…' : 'Run demo job'}
          </button>
          {runResult ? (
            <div className="qgg-terminal mt-4 text-xs">
              <p><span className="text-qgg-terminal-dim">Qubits:</span> {runResult.qubits} · <span className="text-qgg-terminal-dim">Params:</span> {runResult.parameterCount ?? '—'}</p>
              <p><span className="text-qgg-terminal-dim">Backend:</span> {runResult.backend}</p>
              <p><span className="text-qgg-terminal-dim">Runtime:</span> {runResult.runtimeSec}s</p>
              <p><span className="text-qgg-terminal-dim">Best bitstring:</span> <code>{runResult.bestBitstring}</code></p>
              <p><span className="text-qgg-terminal-dim">Energy estimate:</span> {runResult.bestEnergyEstimate}</p>
              <p className="mt-2 text-qgg-terminal-dim">{runResult.note}</p>
            </div>
          ) : null}
        </QggPanel>
      </div>

      <QggPanel num="3" title="Solve official QOBLIB QUBO">
        <p className="text-xs text-qgg-muted">
          Loads compressed <code className="font-mono">.qs.xz</code> UQO files from QOBLIB (710–4,665 variables).
          Reported objectives use QOBLIB UQO convention (ObjectiveOffset − energy) — positive values, comparable to ABS2 QUBO submissions.
          Gurobi MIP objectives in Table 6 are negative (same economic problem, different formulation sign).
          Fetch locally: <code className="font-mono text-xs">python scripts/fetch_qubo_files.py --folder a050_t15_s00_b020</code>
        </p>
        {quboCatalog ? (
          <p className="mt-2 text-xs text-qgg-muted">
            Catalog: {quboCatalog.entries.length} UQO files ·{' '}
            {quboCatalog.localAvailableCount ?? quboCatalog.entries.filter((e) => e.localAvailable).length} downloaded locally
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="qgg-label">
            Asset scale
            <select
              className="qgg-input block"
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value as '50' | '10' | 'all')}
            >
              <option value="50">a050 (50 assets — paper scale)</option>
              <option value="10">a010 (10 assets)</option>
              <option value="all">All</option>
            </select>
          </label>
          <label className="qgg-label">
            Instance
            <select
              className="qgg-input block min-w-[220px]"
              value={instanceKey}
              onChange={(e) => setInstanceKey(e.target.value)}
            >
              {quboInstances.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="qgg-label">
            Risk λ
            <select
              className="qgg-input block"
              value={quboEntryIdx}
              onChange={(e) => setQuboEntryIdx(Number(e.target.value))}
            >
              {quboLambdas.map((e, i) => (
                <option key={e.problemId} value={i}>
                  λ = {e.lambda} · {e.numVariables.toLocaleString()} vars
                  {e.localAvailable ? '' : ' (not downloaded)'}
                </option>
              ))}
            </select>
          </label>
          <label className="qgg-label">
            SA iterations
            <input
              type="number"
              className="qgg-input block w-28"
              value={quboIterations}
              min={500}
              max={50000}
              onChange={(e) => setQuboIterations(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            disabled={solvingQubo || !apiOnline || !selectedQubo?.localAvailable}
            onClick={handleSolveQubo}
            className="qgg-btn qgg-btn-accent disabled:opacity-40"
          >
            {solvingQubo ? 'Solving…' : 'Run SA & record'}
          </button>
          <p className="w-full text-xs text-qgg-muted">
            Tip: start with <strong>a010</strong> (710 vars), then move to <strong>a050</strong> (3,110–4,665 vars). Use the λ sweep button above to compare all risk levels on one instance.
          </p>
        </div>
        {selectedQubo && !selectedQubo.localAvailable ? (
          <p className="mt-3 text-xs">
            QUBO file not on disk. Run{' '}
            <code className="font-mono">python scripts/fetch_qubo_files.py --folder {selectedQubo.folder}</code>
          </p>
        ) : null}
        {quboResult ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="qgg-stat-box">
              <p>Your SA objective</p>
              <p className="font-mono text-lg">{quboResult.objective.toLocaleString()}</p>
              <p className="text-xs text-qgg-muted">
                {quboResult.numVariables.toLocaleString()} vars · {quboResult.runtimeSec}s (+ {quboResult.loadSec}s load)
              </p>
            </div>
            {quboResult.verification ? (
              <div className="qgg-stat-box">
                <p>{quboResult.verification.referenceSolver} reference (QUBO)</p>
                <p className="font-mono text-lg">
                  {quboResult.verification.referenceObjective.toLocaleString()}
                </p>
                <p className="text-xs text-qgg-muted">Gap {quboResult.verification.gapPct}%</p>
                {quboResult.verification.gurobiObjective != null ? (
                  <p className="text-xs text-qgg-muted">
                    Gurobi MIP (same λ): {quboResult.verification.gurobiObjective.toLocaleString()}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="qgg-stat-box text-xs text-qgg-muted">{quboResult.note}</div>
          </div>
        ) : null}
      </QggPanel>

      {largeInstanceBaselines.length > 0 ? (
        <QggPanel num="—" title="a200 / a400 baseline verification">
          <p className="text-xs text-qgg-muted">
            Full QUBO files for these instances are generated via Zimpl in QOBLIB; this dashboard verifies against ingested
            ABS2 submission records and live price/covariance data on the Portfolio page.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {largeInstanceBaselines.map((inst) => (
              <div key={inst.instanceKey} className="border border-qgg bg-qgg-paper p-4">
                <p className="font-mono text-sm">{inst.instanceKey}</p>
                <p className="text-xs text-qgg-muted">
                  {inst.assets} assets · {inst.periods} periods · ~{inst.variables.toLocaleString()} QUBO variables
                </p>
                {inst.abs2.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-xs text-qgg-muted">
                    {inst.abs2.map((s) => (
                      <li key={s.problemId} className="font-mono">
                        {s.problemId}: {s.objective?.toLocaleString() ?? '—'} ({s.totalRuntimeSec}s)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-qgg-muted">No ABS2 submissions ingested for this key yet.</p>
                )}
              </div>
            ))}
          </div>
        </QggPanel>
      ) : null}

      <QggPanel num="4" title="Verify against QOBLIB reference">
        <p className="text-xs text-qgg-muted">
          Instance <code className="font-mono">po_a050_t15_s00</code> — paper Table 6 (Gurobi 12 vs ABS2 on MIP/BQP vs QUBO).
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="qgg-label">
            Risk λ
            <select
              className="qgg-input block"
              value={selectedLambdaIdx}
              onChange={(e) => setSelectedLambdaIdx(Number(e.target.value))}
            >
              {table6.map((row, i) => (
                <option key={row.lambda} value={i}>
                  λ = {row.lambda}
                </option>
              ))}
            </select>
          </label>
          <label className="qgg-label">
            Your objective (minimize)
            <input
              type="text"
              className="qgg-input block w-48 font-mono"
              value={yourObjective}
              onChange={(e) => setYourObjective(e.target.value)}
              placeholder="-386990"
            />
          </label>
          <label className="qgg-label">
            Your runtime (s)
            <input
              type="text"
              className="qgg-input block w-32"
              value={yourRuntime}
              onChange={(e) => setYourRuntime(e.target.value)}
              placeholder="3600"
            />
          </label>
          <button
            type="button"
            disabled={verifying || !apiOnline}
            onClick={handleVerify}
            className="qgg-btn qgg-btn-accent disabled:opacity-40"
          >
            {verifying ? 'Scoring…' : 'Compare to Gurobi reference'}
          </button>
        </div>

        {selectedRow ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="qgg-stat-box">
              <p>Gurobi objective</p>
              <p className="font-mono text-lg">{selectedRow.gurobiObjective.toLocaleString()}</p>
              <p className="text-xs text-qgg-muted">{selectedRow.gurobiRuntimeSec}s · gap {selectedRow.gurobiGapPct}%</p>
            </div>
            <div className="qgg-stat-box">
              <p>ABS2 objective</p>
              <p className="font-mono text-lg">{selectedRow.abs2Objective.toLocaleString()}</p>
              <p className="text-xs text-qgg-muted">{selectedRow.abs2RuntimeSec}s · gap {selectedRow.abs2GapPct}%</p>
            </div>
            {verifyResult ? (
              <div className="qgg-stat-box">
                <p>Your score vs Gurobi</p>
                <p className="text-lg capitalize">{verifyResult.verdict.replace(/_/g, ' ')}</p>
                <p className="text-xs text-qgg-muted">Gap {verifyResult.gapPct}% — {verifyResult.message}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="qgg-chart mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChart}>
              <CartesianGrid strokeDasharray="3 3" stroke={QGG_CHART.grid} />
              <XAxis dataKey="solver" tick={{ fill: QGG_CHART.tick, fontSize: 11 }} />
              <YAxis tick={{ fill: QGG_CHART.tick, fontSize: 11 }} label={{ value: 'Objective value', angle: -90, position: 'insideLeft', fill: QGG_CHART.tick, fontSize: 11 }} />
              <Tooltip contentStyle={QGG_CHART.tooltip} />
              <Legend />
              <Bar dataKey="objective" name="Best objective" fill={QGG_CHART.line[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </QggPanel>

      {abs2ForInstance.length > 0 ? (
        <QggPanel title="QOBLIB submission records (ABS2)">
          <p className="text-xs text-qgg-muted">258 portfolio submissions ingested from QOBLIB — showing ABS2 runs for the paper reference family.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="qgg-table min-w-[720px] text-xs">
              <thead>
                <tr>
                  <th>Problem ID</th>
                  <th>Objective</th>
                  <th>Runtime (s)</th>
                  <th>GPU (s)</th>
                  <th>Hardware</th>
                </tr>
              </thead>
              <tbody>
                {abs2ForInstance.map((row) => (
                  <tr key={row.problemId}>
                    <td className="font-mono">{row.problemId}</td>
                    <td className="font-mono">{row.objective?.toLocaleString() ?? '—'}</td>
                    <td>{row.totalRuntimeSec ?? '—'}</td>
                    <td>{row.gpuRuntimeSec ?? '—'}</td>
                    <td className="max-w-xs truncate">{row.hardware}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QggPanel>
      ) : null}
      </div>
    </div>
  )
}

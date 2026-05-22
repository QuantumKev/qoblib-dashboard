export type BaselineSubmission = {
  problemId: string
  instanceKey?: string
  submitter: string
  solver: string
  date: string
  objective: number | null
  model: string
  algorithm: string
  totalRuntimeSec: number | null
  gpuRuntimeSec: number | null
  qpuRuntimeSec: number | null
  hardware: string
  parsed?: {
    assets?: number
    periods?: number
    seed?: string
    assetLimit?: number
    lambda?: number | string
    instanceKey?: string
  }
}

export type BaselinesFile = {
  source: string
  referenceInstance: string
  paperTable6: {
    instance: string
    gurobi: { lambda: number; objective: number; runtimeSec: number; gapPct: number }[]
  }
  submissions: BaselineSubmission[]
}

export type IBMConnectResponse = {
  connected: boolean
  instance: string
  backendCount: number
  operationalBackends: string[]
  message: string
}

export type IBMRunResponse = {
  jobType: string
  qubits: number
  backend: string
  shots: number
  reps: number
  runtimeSec: number
  bestBitstring: string
  bestEnergyEstimate: number
  topCounts: Record<string, number>
  note: string
}

export type VerifyResponse = {
  problemId: string
  yourObjective: number
  referenceObjective: number | null
  gapPct: number | null
  verdict: string
  message: string
  yourRuntimeSec?: number | null
}

export type PaperTable6Row = {
  lambda: number
  gurobiObjective: number
  gurobiRuntimeSec: number
  gurobiGapPct: number
  abs2Objective: number
  abs2RuntimeSec: number
  abs2GapPct: number
}

export type QuboCatalogEntry = {
  filename: string
  assets: number
  periods: number
  seed: string
  assetLimit: number
  lambda: number
  instanceKey: string
  problemId: string
  folder: string
  qsPath: string
  numVariables: number
  density: number
  localAvailable: boolean
  mode: string
}

export type QuboCatalogFile = {
  source: string
  solveableCount: number
  localAvailableCount?: number
  entries: QuboCatalogEntry[]
  largeInstances: {
    instanceKey: string
    assets: number
    periods: number
    variables: number
    assetLimit: number
    mode: string
  }[]
}

export type QuboSolveResponse = {
  qsPath: string
  problemId: string
  numVariables: number
  numNonZeros: number
  loadSec: number
  objective: number
  runtimeSec: number
  iterations: number
  method: string
  bitstringPreview: string
  verification: {
    problemId: string
    referenceObjective: number
    referenceSolver: string
    referenceModel?: string
    referenceRuntimeSec: number | null
    gapPct: number | null
    gurobiObjective?: number | null
    conventionNote?: string
  } | null
  rawEnergy?: number
  objectiveOffset?: number
  note: string
}

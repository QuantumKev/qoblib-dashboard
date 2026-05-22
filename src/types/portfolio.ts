export type PortfolioManifestEntry = {
  id: string
  assets: number
  periods: number
  label: string
}

export type PortfolioInstanceData = {
  id: string
  assets: number
  periods: number
  symbols: string[]
  priceSeries: {
    symbol: string
    points: { day: number; normalized: number }[]
  }[]
  covarianceHeatmap: {
    day: number
    symbols: string[]
    values: number[][]
  }
}

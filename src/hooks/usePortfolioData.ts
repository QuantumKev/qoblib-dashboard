import { useEffect, useState } from 'react'
import type { PortfolioInstanceData, PortfolioManifestEntry } from '../types/portfolio'

export function usePortfolioManifest() {
  const [manifest, setManifest] = useState<PortfolioManifestEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/portfolio/manifest.json`)
      .then((r) => r.json())
      .then(setManifest)
      .finally(() => setLoading(false))
  }, [])

  return { manifest, loading }
}

export function usePortfolioInstance(id: string | null) {
  const [data, setData] = useState<PortfolioInstanceData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      setData(null)
      return
    }
    setLoading(true)
    fetch(`${import.meta.env.BASE_URL}data/portfolio/${id}.json`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading }
}

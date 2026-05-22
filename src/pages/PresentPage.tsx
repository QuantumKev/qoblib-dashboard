import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SLIDES } from '../data/presentationSlides'

export function PresentPage() {
  const [index, setIndex] = useState(0)
  const [showNotes, setShowNotes] = useState(true)
  const slide = SLIDES[index]

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((v) => !v)
      } else if (e.key === 'Home') {
        setIndex(0)
      } else if (e.key === 'End') {
        setIndex(SLIDES.length - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0e14] text-white">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
        <div className="text-sm text-slate-400">
          Presentation mode · Slide {index + 1} / {SLIDES.length}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>← → navigate · N toggle notes · Esc exit</span>
          <Link to="/" className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800">
            Exit
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 flex-col justify-center px-12 py-10 lg:px-20">
          {slide.accent ? (
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400">{slide.accent}</p>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight lg:text-5xl">{slide.title}</h1>
          <ul className="mt-10 max-w-3xl space-y-5">
            {slide.bullets.map((b) => (
              <li key={b} className="flex gap-4 text-xl leading-relaxed text-slate-200">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                {b}
              </li>
            ))}
          </ul>
        </main>

        {showNotes ? (
          <aside className="border-t border-amber-900/50 bg-amber-950/30 px-12 py-4 lg:px-20">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400/90">Speaker notes</p>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-amber-100/85">{slide.notes}</p>
          </aside>
        ) : null}
      </div>

      <footer className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-30 hover:bg-slate-800"
        >
          Previous
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-cyan-400' : 'bg-slate-600 hover:bg-slate-400'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={index === SLIDES.length - 1}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium hover:bg-cyan-500 disabled:opacity-30"
        >
          Next
        </button>
      </footer>
    </div>
  )
}

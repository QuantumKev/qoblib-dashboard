import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PartnerCoBrand } from '../components/PartnerCoBrand'
import { QggLogo } from '../components/QggLogo'
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
    <div className="present-mode fixed inset-0 z-50 flex flex-col bg-qgg-paper text-qgg-fg">
      <header className="present-chrome flex items-center justify-between border-b-2 border-qgg px-6 py-3">
        <div className="flex items-center gap-4">
          <QggLogo size="sm" />
          <PartnerCoBrand compact />
          <span className="hidden text-sm text-qgg-muted sm:inline">·</span>
          <div className="hidden font-mono text-sm text-qgg-muted sm:block">
            {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </div>
        </div>
        <div className="present-chrome flex items-center gap-3 font-mono text-xs text-qgg-muted">
          <span className="hidden md:inline">← → navigate · N notes</span>
          <Link to="/workforce" className="qgg-btn text-[10px]">
            WORKFORCE
          </Link>
          <Link to="/" className="qgg-btn qgg-btn-accent text-[10px]">
            EXIT ↗
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 flex-col justify-center px-12 py-10 lg:px-20">
          {slide.accent ? (
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-qgg-muted">{slide.accent}</p>
          ) : null}
          {slide.showPartners ? (
            <div className="mb-8 max-w-3xl">
              <PartnerCoBrand />
            </div>
          ) : null}
          <h1 className="qgg-display max-w-4xl text-4xl uppercase leading-tight lg:text-5xl">{slide.title}</h1>
          <ul className="mt-10 max-w-3xl space-y-5">
            {slide.bullets.map((b) => (
              <li key={b} className="flex gap-4 text-xl leading-relaxed">
                <span className="mt-2 h-2 w-2 shrink-0 bg-qgg-accent" />
                {b}
              </li>
            ))}
          </ul>
        </main>

        {showNotes ? (
          <aside className="present-chrome border-t-2 border-qgg bg-qgg-accent/50 px-12 py-4 lg:px-20">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide">Speaker notes</p>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed">{slide.notes}</p>
          </aside>
        ) : null}
      </div>

      <footer className="present-chrome flex items-center justify-between border-t-2 border-qgg px-6 py-4">
        <button type="button" onClick={prev} disabled={index === 0} className="qgg-btn disabled:opacity-30">
          PREVIOUS
        </button>
        <div className="flex gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 border border-qgg ${i === index ? 'bg-qgg-accent' : 'bg-qgg-paper hover:bg-qgg-accent/50'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          disabled={index === SLIDES.length - 1}
          className="qgg-btn qgg-btn-accent disabled:opacity-30"
        >
          NEXT ↗
        </button>
      </footer>
    </div>
  )
}

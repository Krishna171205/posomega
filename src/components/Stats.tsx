'use client'
import { useEffect, useRef, useState } from 'react'

type StatItem = {
  value: number
  display: 'comma' | 'float' | 'int'
  prefix?: string
  unit: string
  label: string
}

const STATS: StatItem[] = [
  { value: 4200,  display: 'comma', unit: '+',   label: 'Outlets running on Omega' },
  { value: 840,   display: 'int',   prefix: '₹', unit: 'Cr',  label: 'Processed every month' },
  { value: 99.99, display: 'float', unit: '%',   label: 'Uptime, including offline' },
  { value: 7,     display: 'int',   unit: 'min', label: 'Average time to go live' },
]

function format(v: number, kind: StatItem['display']) {
  if (kind === 'float') return v.toFixed(2)
  if (kind === 'comma') return Math.round(v).toLocaleString('en-IN')
  return Math.round(v).toString()
}

function CountUp({ to, display, start, duration = 2300 }: { to: number; display: StatItem['display']; start: boolean; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const t0 = performance.now()
    function step(t: number) {
      const e = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - e, 3)
      setVal(to * eased)
      if (e < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, to, duration])
  return <span className="num">{format(val, display)}</span>
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="stats" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div
              className={`stat ${inView ? 'in-view' : ''}`}
              key={i}
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              <div className="stat-value">
                {s.prefix}
                <CountUp to={s.value} display={s.display} start={inView} />
                <span className="unit">{s.unit}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

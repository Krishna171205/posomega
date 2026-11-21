'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { Peek } from './crew/Peek'
import { OutletIcon } from './Outlets'
import { CONSENTED_TESTIMONIALS, TESTIMONIAL_SAMPLES, type OutletFormat, type Testimonial } from '@/content/testimonials'

const ICON_FOR: Record<OutletFormat, string> = {
  'Café': 'cafes', Bakery: 'bakeries', QSR: 'qsr', 'Food court': 'food-courts',
  'Fine dining': 'fine-dining', 'Cloud kitchen': 'cloud-kitchens', Bar: 'bars', Chain: 'chains',
}

/*
 * Real, consented quotes only. While there are none, the live site renders nothing
 * here; `next dev` shows the stamped placeholder tickets so the design can be judged.
 */
const PREVIEW = CONSENTED_TESTIMONIALS.length === 0
const ITEMS: Testimonial[] = PREVIEW ? TESTIMONIAL_SAMPLES : CONSENTED_TESTIMONIALS

/** What the chef over the rail calls out as each new ticket comes round */
const LINES = ['Fresh off the printer.', 'Next ticket!', 'Order up!', 'Read this one.']
/** The rail creeps along on its own like a kitchen conveyor, in px/s */
const DRIFT = 34

/* Physics, in px and seconds */
const SPRING = 190        // pull toward the ticket it settles on
const DAMP = 25           // just under critical, so it lands with the faintest overshoot
const GLIDE = 0.3         // how far a flick carries: velocity × GLIDE
const SWING_K = 52        // pendulum stiffness (about 1.2 swings a second)
const SWING_D = 2.3       // pendulum damping
const SWING_KICK = 0.045  // degrees/s of swing per px/s change in rail speed
const SWING_MAX = 16      // degrees

export function Testimonials() {
  if (ITEMS.length === 0) return null
  return <Rail items={ITEMS} preview={PREVIEW} />
}

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function Source({ s }: { s: Testimonial['source'] }) {
  if (s.kind === 'review') {
    return (
      <a className="tk-src" href={s.url} target="_blank" rel="noopener" draggable={false}>
        {s.stars ? `${'★'.repeat(s.stars)} ` : ''}{s.site} review <Icon.ArrowUpRight size={10} />
      </a>
    )
  }
  const [y, m] = s.date.split('-')
  return <span className="tk-src"><Icon.Check size={10} /> Shared with permission · {MONTH[Number(m) - 1]} {y}</span>
}

const mod = (a: number, b: number) => ((a % b) + b) % b

/**
 * The ticket rail. Quotes are printed on KOT tickets hanging from a kitchen ticket
 * rail, and the rail is a physics carousel:
 *  - drag it with a finger or the mouse (or swipe a trackpad sideways, or use the
 *    arrow keys); let go and it glides on its momentum, then springs onto the
 *    nearest ticket
 *  - with three or more quotes it loops forever; with fewer it stops at the ends
 *    with a rubber-band pull
 *  - every ticket is a damped pendulum hanging from its clip, kicked by changes in
 *    the rail's speed, so a hard fling sets them swinging and they settle on their own
 * On its own it creeps along slowly, like a conveyor, and eases to a stop while the
 * pointer is on a ticket (or focus is inside), so a quote can be read. The ticket
 * arriving at the pass gets its quote printed line by line and its stamp thumped. The chef over the rail calls out each new
 * ticket, and gets a fright when you fling it.
 */
function Rail({ items, preview }: { items: Testimonial[]; preview: boolean }) {
  const n = items.length
  const loop = n >= 3
  const [copies, setCopies] = useState(loop ? 2 : 1)   // enough copies to fill wide screens without gaps
  const N = n * copies
  const [index, setIndex] = useState(0)
  const [line, setLine] = useState(0)
  const [shout, setShout] = useState<string | null>(null)
  const [seen, setSeen] = useState(false)
  const [inView, setInView] = useState(false)
  const [hold, setHold] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [tick, setTick] = useState(0)
  const [calm, setCalm] = useState(false)

  const root = useRef<HTMLElement>(null)
  const port = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLDivElement | null)[]>([])
  const swings = useRef<(HTMLDivElement | null)[]>([])
  /** The simulation lives outside React state: it changes every frame. */
  const sim = useRef({
    x: 0, v: 0, target: null as number | null,
    step: 326, width: 1200, maxX: 0,
    dragging: false, lastVs: 0, idx: 0, vAuto: 0, pass: -1,
    theta: [] as number[], omega: [] as number[],
  })
  const auto = useRef(false)                            // read by the frame loop
  const drag = useRef<{ id: number; sx: number; x0: number; samples: { t: number; x: number }[]; moved: boolean; captured: boolean } | null>(null)
  const suppressClick = useRef(false)

  const band = (o: number) => (1 - 1 / ((o * 0.55) / sim.current.width + 1)) * sim.current.width
  const rubber = (x: number) => {
    const s = sim.current
    if (x < 0) return -band(-x)
    if (x > s.maxX) return s.maxX + band(x - s.maxX)
    return x
  }
  const snap = (x: number) => {
    const s = sim.current
    if (loop) return Math.round(x / s.step) * s.step
    if (x > s.maxX - s.step / 2) return s.maxX
    return Math.min(s.maxX, Math.max(0, Math.round(x / s.step) * s.step))
  }
  function go(d: number) {
    const s = sim.current
    const base = s.target ?? snap(s.x)
    let t = base + d * s.step
    if (!loop) t = d > 0 && base >= s.maxX - 1 ? 0 : Math.min(s.maxX, Math.max(0, t))
    s.target = t
    if (calm) { s.x = t; s.v = 0 }
    setTick(k => k + 1)
  }

  // Reduced motion, visibility, sizes
  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setSeen(true)
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const vp = port.current
    if (!vp) return
    const measure = () => {
      const s = sim.current
      const first = els.current[0]
      if (!first) return
      const cs = getComputedStyle(vp)
      const gap = parseFloat(getComputedStyle(first.parentElement as Element).columnGap) || 22
      const inner = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const old = s.step
      s.step = first.offsetWidth + gap
      s.width = vp.clientWidth
      s.maxX = Math.max(0, n * s.step - gap - inner)
      // keep the same ticket in place when the size changes
      if (old !== s.step) { s.x = (s.x / old) * s.step; if (s.target != null) s.target = (s.target / old) * s.step }
      if (loop) setCopies(Math.max(1, Math.ceil((s.width + 2 * s.step) / (n * s.step))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [n, loop, N])

  // The frame loop: springs, pendulums and positions. Runs only while on screen.
  useEffect(() => {
    if (!inView) return
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const s = sim.current
      const dt = Math.min(0.034, (now - last) / 1000)
      last = now
      // the conveyor: eases up to DRIFT, and back down to a stop when held
      const want = auto.current && !s.dragging && s.target == null ? DRIFT : 0
      s.vAuto += (want - s.vAuto) * Math.min(1, dt * 2.5)
      if (!s.dragging && s.target == null) s.x += s.vAuto * dt
      if (!s.dragging && s.target != null) {
        const h = dt / 2
        for (let k = 0; k < 2; k++) {
          const a = -SPRING * (s.x - s.target) - DAMP * s.v
          s.v += a * h
          s.x += s.v * h
        }
        if (Math.abs(s.x - s.target) < 0.25 && Math.abs(s.v) < 4) { s.x = s.target; s.v = 0; s.target = null }
      }
      // The rail moves opposite to x. A change in its speed kicks every pendulum: when
      // the rail speeds up to the right, the bottom of a ticket lags to the left.
      const vs = -(s.v + s.vAuto)
      const dv = vs - s.lastVs
      s.lastVs = vs
      const P = N * s.step
      let pass = -1, near = Infinity
      for (let j = 0; j < N; j++) {
        const el = els.current[j]
        const sw = swings.current[j]
        if (!el || !sw) continue
        const p = loop ? mod(j * s.step - s.x + s.step, P) - s.step : j * s.step - s.x
        el.style.transform = `translate3d(${(p - j * s.step).toFixed(2)}px,0,0)`
        if (Math.abs(p) < near) { near = Math.abs(p); pass = j }
        let th = s.theta[j] || 0
        let om = s.omega[j] || 0
        om += (SWING_KICK + (j % 2) * 0.01) * dv
        om += (-(SWING_K + (j % 3) * 9) * th - SWING_D * om) * dt
        th += om * dt
        if (th > SWING_MAX) { th = SWING_MAX; om = 0 } else if (th < -SWING_MAX) { th = -SWING_MAX; om = 0 }
        s.theta[j] = th
        s.omega[j] = om
        const idle = calm ? 0 : 0.8 * Math.sin(now * 0.00095 + j * 1.7)
        sw.style.transform = `rotate(${(th + idle).toFixed(2)}deg)`
      }
      // the ticket at the pass (the first slot) gets printed and stamped
      if (pass !== s.pass) {
        els.current[s.pass]?.classList.remove('is-pass')
        els.current[pass]?.classList.add('is-pass')
        s.pass = pass
      }
      const at = Math.round(s.x / s.step)
      const idx = loop ? mod(at, n) : Math.min(n - 1, Math.max(0, at))
      if (idx !== s.idx) { s.idx = idx; setIndex(idx) }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [inView, N, n, loop, calm])

  // A new ticket in front: the chef reads it out
  useEffect(() => { if (seen) setLine(l => (l + 1) % LINES.length) }, [index]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!shout) return
    const t = window.setTimeout(() => setShout(null), 2200)
    return () => window.clearTimeout(t)
  }, [shout])

  // Sideways trackpad swipes move the rail; it settles once they stop
  useEffect(() => {
    const vp = port.current
    if (!vp) return
    let settle = 0
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      const s = sim.current
      s.target = null
      s.x = loop ? s.x + e.deltaX : rubber(s.x + e.deltaX)
      s.v = e.deltaX * 60
      window.clearTimeout(settle)
      settle = window.setTimeout(() => { s.target = snap(s.x + s.v * 0.08); setTick(k => k + 1) }, 140)
    }
    vp.addEventListener('wheel', wheel, { passive: false })
    return () => { vp.removeEventListener('wheel', wheel); window.clearTimeout(settle) }
  }, [loop]) // eslint-disable-line react-hooks/exhaustive-deps

  // Creeps along by itself, unless someone is reading or dragging
  auto.current = seen && inView && !hold && !dragging && !calm && loop

  /* ── Dragging ── */
  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.pointerType === 'mouse') e.preventDefault()   // no text selection or native link drag
    const s = sim.current
    s.dragging = true
    s.target = null
    drag.current = { id: e.pointerId, sx: e.clientX, x0: s.x, samples: [{ t: e.timeStamp, x: s.x }], moved: false, captured: false }
    setDragging(true)
  }
  function move(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.sx
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      // capture only once it is really a drag, so a plain click still reaches links
      if (!d.captured) { e.currentTarget.setPointerCapture(e.pointerId); d.captured = true }
    }
    const s = sim.current
    const raw = d.x0 - dx
    const x = loop ? raw : rubber(raw)
    d.samples.push({ t: e.timeStamp, x })
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift()
    const f = d.samples[0]
    const span = (e.timeStamp - f.t) / 1000
    s.v = span > 0 ? (x - f.x) / span : 0
    s.x = x
  }
  function up(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    const s = sim.current
    s.dragging = false
    const lastSample = d.samples[d.samples.length - 1]
    // a finger that rested before lifting throws nothing
    const v = e.timeStamp - lastSample.t > 80 ? 0 : Math.max(-6000, Math.min(6000, s.v))
    s.v = calm ? 0 : v
    s.target = snap(s.x + s.v * GLIDE)
    if (calm) s.x = s.target
    suppressClick.current = d.moved
    if (Math.abs(v) > 2400) setShout('Whoa, steady!')
    setDragging(false)
    setTick(k => k + 1)
  }

  return (
    <section
      ref={root}
      className="section tk-sec"
      id="customers"
      aria-labelledby="tk-title"
      onFocus={() => setHold(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false) }}
    >
      <div className="container">
        <div className="sec-head center" data-rv>
          <div className="eyebrow"><span className="dot" />{preview ? 'Sample tickets' : 'Customers'}</div>
          <h2 id="tk-title" className="h-section">Straight off <span className="h-muted">the ticket rail.</span></h2>
          <p className="lede">
            {preview
              ? 'Sample tickets showing the kind of service PepperPe is built for. Illustrative only, not quotes from real customers.'
              : 'What restaurant teams running PepperPe tell us, in their own words.'}
          </p>
        </div>
      </div>

      <div className={`tk-rail ${seen ? 'in' : ''}`} role="region" aria-roledescription="carousel" aria-label="Customer quotes">
        <div className="tk-bar" aria-hidden="true">
          <div className="container tk-bar-in has-peek">
            <Peek who="chef" side="right" x="4%" enter="hat" say={shout ?? LINES[line]} mood={shout ? 'wow' : 'happy'} />
          </div>
        </div>
        <div
          ref={port}
          className={`tk-viewport ${dragging ? 'dragging' : ''}`}
          tabIndex={0}
          aria-label="Customer quotes. Drag, swipe or use the arrow keys."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onClickCapture={e => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false } }}
          onDragStart={e => e.preventDefault()}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
          }}
        >
          <div className="tk-track">
            {Array.from({ length: N }, (_, j) => {
              const idx = j % n
              const t = items[idx]
              return (
                <div
                  key={j}
                  ref={el => { els.current[j] = el }}
                  className="tk"
                  style={{ ['--i' as string]: Math.min(j, 6) }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${n}`}
                  aria-hidden={j >= n ? true : undefined}
                >
                  <div className="tk-swing" ref={el => { swings.current[j] = el }}>
                    <span className="tk-clip" aria-hidden="true" />
                    <figure
                      className="tk-paper"
                      onPointerEnter={e => { if (e.pointerType === 'mouse') setHold(true) }}
                      onPointerLeave={e => { if (e.pointerType === 'mouse') setHold(false) }}
                    >
                      <div className="tk-h">
                        <span className="ui-num">KOT #{String(412 + idx).padStart(4, '0')}</span>
                        <span className="tk-fmt"><span className="tk-fmt-ic" aria-hidden="true"><OutletIcon id={ICON_FOR[t.format]} /></span>{t.format}</span>
                      </div>
                      <div className="tk-where">{t.outlet} · {t.city}</div>
                      <span className="tk-rule" aria-hidden="true" />
                      <blockquote className="tk-q">
                        <svg className="tk-mark" viewBox="0 0 26 20" aria-hidden="true">
                          <path fill="currentColor" d="M0 20V12C0 5 3.6 1 10 0l1 3.2C7.6 4.4 6 6.4 6 9.4h4.6V20Zm15 0V12c0-7 3.6-11 10-12l1 3.2C22.6 4.4 21 6.4 21 9.4h4.6V20Z" />
                        </svg>
                        <p>{t.quote}</p>
                      </blockquote>
                      <span className="tk-rule" aria-hidden="true" />
                      <figcaption className="tk-by">
                        <b>{t.name}</b>
                        <span>{t.role}, {t.outlet}</span>
                        {!preview && <Source s={t.source} />}
                      </figcaption>
                      {preview && <span className="tk-stamp" aria-hidden="true">Sample<small>not a customer</small></span>}
                    </figure>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </section>
  )
}

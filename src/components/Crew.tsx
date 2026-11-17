'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { CHARACTERS } from './crew/Characters'

/**
 * "Meet the crew": a scroll story in the spirit of petpooja.com. The stage on the
 * left is sticky. A thin rail runs down the steps on the right and fills with the
 * scroll; as it reaches each step's node that step's title rises in and its person
 * takes the stage: the last one slides out the way the page is going, the next one
 * draws itself in from the other side. The stage's bar fills through each step, the
 * count rolls, and the figure leans a little with the speed of the scroll.
 * Click a character for another tip.
 */
const STEPS = [
  {
    who: 'Captain' as const,
    role: 'Floor captain',
    title: 'Punch the order once.',
    body: 'Take it on the tablet at the table. Omega fires the KOT to the right kitchen station and keeps the bill running for that table.',
    lines: ['Table 7, two masala dosa. Sent!', 'No more running slips to the kitchen.', 'Call waiter? I see it on my screen.'],
  },
  {
    who: 'Chef' as const,
    role: 'Head chef',
    title: 'Cook what was fired first.',
    body: 'Tickets land on the kitchen screen the moment they are punched, split by station and sorted by time, so the line works in order instead of by who shouts loudest.',
    lines: ['Order up! Table 7, done.', 'No more squinting at paper slips.', 'Swiggy or dine-in, same rail.'],
  },
  {
    who: 'Manager' as const,
    role: 'Shift manager',
    title: 'Every channel, one queue.',
    body: 'Dine-in, takeaway, Swiggy and Zomato orders land in the same list. Accept, mark ready, or 86 an item everywhere in one tap.',
    lines: ['Swiggy, Zomato, dine-in. One screen.', 'Paneer is out? Off every menu.', 'Nothing gets lost in a tablet pile.'],
  },
  {
    who: 'Storekeeper' as const,
    role: 'Store in-charge',
    title: 'Stock that counts itself.',
    body: 'Link dishes to recipes and Omega takes the ingredients off as they sell, then flags what is running low before service.',
    lines: ['Milk is low. I knew before the rush.', 'Every plate, costed.', 'Fewer surprises at the morning count.'],
  },
  {
    who: 'Owner' as const,
    role: 'Owner',
    title: 'Close the day in a page.',
    body: 'Sales, payment modes, GST and voids in one day-end report, even if the internet dropped halfway through service.',
    lines: ['Cash, UPI, card. It all adds up.', 'GST, ready for my accountant.', 'Offline at 9pm? Synced by close.'],
  },
]

/** Where on screen the story reads from: a step is "reached" once its node passes this line */
const READ_LINE = 0.58
/** The hand-off on the stage, in ms: how long a person takes to draw in, how long they
    then stay complete before the next may take over, and how long leaving takes */
const DRAW = 950
const HOLD = 1100
const LEAVE = 340
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** A line split into words that stagger in (CSS uses --w); spaces stay between them */
function Words({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="cw" style={{ ['--w' as string]: i }}>{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}

export function Crew() {
  const [active, setActive] = useState(0)
  /** Who is on the stage. It follows `active`, but one person at a time: whoever is on
      finishes drawing and stays complete for a moment, leaves whole, and only then does
      the next one draw in. A fast scroll past several skips straight to the latest. */
  const [shown, setShown] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [tip, setTip] = useState(0)
  const [seen, setSeen] = useState(false)
  const activeRef = useRef(0)
  activeRef.current = active
  const seenRef = useRef(false)
  seenRef.current = seen
  const pumpRef = useRef<() => void>(() => {})
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const nodeRefs = useRef<(HTMLElement | null)[]>([])
  const segRefs = useRef<(HTMLElement | null)[]>([])

  /* Everything here follows the scroll directly, so it runs backwards too. The values
     go out as CSS variables (no re-render per frame); only the active step is state. */
  /* One scroll, one step. Inside the steps a wheel or trackpad gesture is taken over and
     the page eases to the next step (in the gesture's direction) in one motion, so a step
     is never left half in and the motion never stops and restarts. The trackpad's momentum
     tail is swallowed until it dies down, so one flick moves one step. At the first and
     last step the gesture goes through, so the page scrolls on out of the section.
     Desktop stage only (phones have none), never with reduced motion. */
  useEffect(() => {
    const list = listRef.current
    const stage = stageRef.current
    if (!list || !stage) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0, busy = false, quietAt = 0, lastAbs = 0, pending = 0
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

    /** Where the middle of the screen is among the steps, as a fractional step index */
    function where() {
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
      const mid = navH + (window.innerHeight - navH) / 2
      const c = ([...list!.children] as HTMLElement[]).map(el => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 })
      const last = c.length - 1
      const gap = (c[last] - c[0]) / last
      let f: number
      if (mid <= c[0]) f = (mid - c[0]) / gap                          // a little below 0 above the first
      else if (mid >= c[last]) f = last + (mid - c[last]) / gap        // a little above last below the last
      else { const k = c.findIndex(v => v > mid); f = k - 1 + (mid - c[k - 1]) / (c[k] - c[k - 1]) }
      const near = Math.round(f)
      return { mid, c, last, f, near, resting: Math.abs(f - near) < 0.03 }
    }
    function glide(by: number) {
      const from = window.scrollY, t0 = performance.now(), ms = 650
      busy = true
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms)
        // instant: html has scroll-behavior: smooth, which would turn every frame into its own animation
        window.scrollTo({ top: from + by * ease(k), behavior: 'instant' })
        if (k < 1) raf = requestAnimationFrame(step)
        else {
          raf = 0; busy = false
          // A flick that came in mid-glide: carry on to the next step straight away
          if (pending) { const d = pending; pending = 0; move(d) }
        }
      }
      raf = requestAnimationFrame(step)
    }
    function onWheel(e: WheelEvent) {
      if (calm.matches || stage!.getBoundingClientRect().width === 0 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const dir = Math.sign(e.deltaY)
      if (!dir) return
      const { last, f, near, resting } = where()
      if (f < -0.3 || f > last + 0.3) return                             // not in the steps
      // Heading out past either end: let the page scroll on
      if ((dir < 0 && (f < 0 || (resting && near === 0))) || (dir > 0 && (f > last || (resting && near === last)))) return
      e.preventDefault()
      // A new flick, or the momentum tail of the last one? A tail only ever slows down and
      // arrives every frame, so: a pause, a jump in speed, or a mouse-wheel notch (big,
      // even steps a little apart) all count as a new flick.
      const now = performance.now(), abs = Math.abs(e.deltaY), gapMs = now - quietAt
      const fresh = gapMs > 220 || (abs > lastAbs * 1.6 && abs > 8) || (abs >= 50 && gapMs > 40 && abs >= lastAbs)
      quietAt = now
      lastAbs = abs
      if (!fresh) return
      if (busy) { pending = dir; return }
      move(dir)
    }
    function move(dir: number) {
      const { mid, c, last, f, near, resting } = where()
      // Resting: one step on. Caught between: the step ahead, unless barely past the one behind
      const target = resting ? near + dir : dir > 0 ? Math.ceil(f - 0.25) : Math.floor(f + 0.25)
      const i = Math.max(0, Math.min(last, target))
      if (Math.abs(c[i] - mid) < 2) return              // already there (an end step)
      glide(c[i] - mid)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => { window.removeEventListener('wheel', onWheel); if (raf) cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const list = listRef.current
    if (!root || !list) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let cur = -1
    let lastY = window.scrollY
    let lastT = performance.now()
    let settle = 0

    const paint = () => {
      raf = 0
      const vh = window.innerHeight
      const now = performance.now()
      const y = window.scrollY
      const v = (y - lastY) / Math.max(16, now - lastT)    // px per ms
      lastY = y
      lastT = now

      const rr = root.getBoundingClientRect()
      if (rr.bottom < -200 || rr.top > vh + 200) return

      // The first person draws in once the stage is well on screen (phones have no stage)
      const stage = stageRef.current
      const sr = stage?.getBoundingClientRect()
      const hasStage = !!sr && sr.width > 0
      if (hasStage ? sr.top < vh * 0.85 : rr.top < vh * 0.7) setSeen(true)

      const line = vh * READ_LINE
      const tops = nodeRefs.current.map(n => (n ? n.getBoundingClientRect().top + n.offsetHeight / 2 : 0))
      const n = tops.length
      let a = 0
      tops.forEach((t, i) => { if (t < line) a = i })
      if (a !== cur) { cur = a; setActive(a) }

      // The rail runs from the first node to the last, filled down to the reading line
      const lt = list.getBoundingClientRect().top
      list.style.setProperty('--r0', `${(tops[0] - lt).toFixed(1)}px`)
      list.style.setProperty('--r1', `${(tops[n - 1] - lt).toFixed(1)}px`)
      root.style.setProperty('--rp', clamp01((line - tops[0]) / (tops[n - 1] - tops[0] || 1)).toFixed(4))

      // The stage's bar: each segment fills while its step is being read
      const gap = (tops[n - 1] - tops[0]) / (n - 1)
      segRefs.current.forEach((el, i) => {
        if (!el) return
        const a0 = tops[i]
        const a1 = i < n - 1 ? tops[i + 1] : tops[i] + gap
        el.style.setProperty('--f', clamp01((line - a0) / (a1 - a0 || 1)).toFixed(4))
      })

      // The figure leans into a fast scroll and settles once it stops
      if (stage && !calm.matches) {
        const lean = Math.max(-4, Math.min(4, -v * 1.6))
        stage.style.setProperty('--lean', `${lean.toFixed(2)}deg`)
        window.clearTimeout(settle)
        settle = window.setTimeout(() => stage.style.setProperty('--lean', '0deg'), 140)
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }

    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(list)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      window.clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* The stage's hand-off, one person at a time (see `shown`) */
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer = 0
    let on = 0
    let out = false
    let first = true
    let readyAt = 0                                       // when the one on stage is complete
    function pump() {
      timer = 0
      if (!seenRef.current) return
      const want = activeRef.current
      const now = performance.now()
      if (first) {                                        // the first one simply draws in
        first = false
        on = want
        readyAt = now + DRAW
        setShown(want)
        return
      }
      if (want === on && !out) return
      if (calm.matches) { on = want; setShown(want); return }
      if (!out) {
        const wait = readyAt + HOLD - now                 // let them finish, then hold
        if (wait > 0) { timer = window.setTimeout(pump, wait); return }
        out = true
        setLeaving(true)
        timer = window.setTimeout(pump, LEAVE)
        return
      }
      out = false                                         // gone: bring in whoever is wanted now
      on = want
      readyAt = now + DRAW
      setLeaving(false)
      setShown(want)
    }
    pumpRef.current = () => { if (!timer) pump() }
    return () => { window.clearTimeout(timer); pumpRef.current = () => {} }
  }, [])
  useEffect(() => { pumpRef.current() }, [active, seen])

  useEffect(() => { setTip(0) }, [shown])

  const step = STEPS[shown]
  return (
    <section ref={rootRef} className={`section crew ${seen ? 'is-seen' : ''}`} aria-labelledby="crew-title">
      <div className="container">
        <div className="sec-head center" data-rv>
          <span className="eyebrow"><span className="dot" />How it works</span>
          <h2 id="crew-title" className="h-section">Your whole team, <span className="h-muted">on one system.</span></h2>
          <p className="lede">Five people, one service. Here is what each of them does differently with Omega.</p>
        </div>

        <div className="crew-grid">
          <div className="crew-stage-wrap">
            <div className="crew-stage" ref={stageRef} style={{ ['--step' as string]: shown }}>
              {/* Soft backdrop that turns with the scroll */}
              <svg className="crew-blob" viewBox="0 0 200 200" aria-hidden="true">
                <path d="M156 52 C178 76 182 118 162 148 C142 178 98 188 66 170 C34 152 18 112 30 78 C42 44 76 24 108 26 C130 28 144 38 156 52Z" />
              </svg>
              <button
                type="button"
                className="crew-figure"
                onClick={() => setTip(t => (t + 1) % step.lines.length)}
                aria-label={`${step.role}: another tip`}
              >
                {STEPS.map((s, i) => {
                  const C = CHARACTERS[s.who]
                  // On stage, or waiting off to one side: those already passed on the left, the
                  // rest on the right. The one leaving goes the way the page is going.
                  const at = i === shown && seen && !leaving ? 'on'
                    : i === shown ? (active > shown ? 'is-before' : 'is-after')
                    : i < shown ? 'is-before' : 'is-after'
                  return <span key={s.who} className={`crew-char ${at}`}><C /></span>
                })}
              </button>
              {seen && !leaving && (
                <div className={`crew-bubble ${tip ? 'is-tap' : ''}`} key={`${shown}-${tip}`} aria-live="polite">
                  <Words text={step.lines[tip]} />
                </div>
              )}
              <div className="crew-role">
                <span className="crew-count ui-num" aria-hidden="true">
                  <span className="crew-count-col">
                    {STEPS.map((s, i) => <span key={s.who}>{String(i + 1).padStart(2, '0')}</span>)}
                  </span>
                </span>
                <span className="crew-role-name" key={shown}>{step.role}</span>
              </div>
              <div className="crew-bar" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <i key={s.who} ref={el => { segRefs.current[i] = el }} className={i === active ? 'on' : ''}><b /></i>
                ))}
              </div>
              <span className="crew-hint" aria-hidden="true">Tap me</span>
            </div>
          </div>

          <ol className="crew-steps" ref={listRef}>
            {STEPS.map((s, i) => {
              const C = CHARACTERS[s.who]
              return (
                <li key={s.who} className={`crew-step ${i === active ? 'on' : ''} ${i <= active ? 'is-past' : ''}`}>
                  <span className="crew-step-fig crew-char on" aria-hidden="true"><C /></span>
                  <span className="crew-step-role" ref={el => { nodeRefs.current[i] = el }}>{s.role}</span>
                  <h3 className="h3"><Words text={s.title} /></h3>
                  <p>{s.body}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

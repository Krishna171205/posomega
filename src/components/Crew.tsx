'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { CHARACTERS } from './crew/Characters'

/**
 * "Meet the crew", sideways. On wide screens the section pins, and scrolling down moves
 * a row of five people from right to left in one smooth, continuous motion. The row
 * never stops, but it slows right down as each person reaches the middle and speeds up
 * in between, so each one gets a long, calm stretch of scroll to draw in, speak and play
 * their little animation, with a clear gap of travel before the next one starts. Whoever
 * has had their turn stays complete as they slide away to the left. The row trails the
 * scroll a little, so a wheel notch becomes a glide rather than a jump.
 * Phones, short windows and reduced motion get the five as a swipeable row instead: one
 * person per card, the next peeking in, each drawing in the first time it is swiped to
 * the middle, with dots under it (reduced motion: all drawn, nothing moving).
 * Click a person for another line.
 */
const STEPS = [
  {
    who: 'Captain' as const,
    role: 'Floor captain',
    title: 'Punch the order once.',
    body: 'Take it on the tablet at the table. PepperPe fires the KOT to the right kitchen station and keeps the bill running for that table.',
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
    body: 'Link dishes to recipes and PepperPe takes the ingredients off as they sell, then flags what is running low before service.',
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
const N = STEPS.length

/** Scroll given to each person, in svh, and how much the row lingers on them (LINGER 0
    moves at an even pace, 1 would stop dead on each one). EDGE is extra scroll, in
    people, before the first and after the last, where the row rests. */
const PER = 120
const LINGER = 0.82
const EDGE = 0.35
const RUN = (N - 1 + 2 * EDGE) * PER

/**
 * Where the row is, as a fractional person index, `d` svh of scroll into the pin.
 * A sine bump on an even pace: slow (18% speed) at each person, quick (182%) between
 * two, smooth all the way, so the motion is continuous and each person gets their gap.
 */
function rowAt(d: number) {
  const u = d / PER - EDGE
  const f = u - (LINGER * Math.sin(2 * Math.PI * u)) / (2 * Math.PI)
  return Math.min(N - 1, Math.max(0, f))
}
/** How far into the pin (svh) the row sits on person k */
const restAt = (k: number) => (k + EDGE) * PER

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

type View = { arrived: number; active: number; hold: boolean; flat: boolean }

export function Crew() {
  /* arrived: the last person the row has reached (they and everyone before are drawn);
     active: the one nearest the middle; hold: the row is resting on them;
     flat: the swipeable row (phones, short windows, reduced motion). */
  const [view, setView] = useState<View>({ arrived: -1, active: 0, hold: false, flat: false })
  const [tip, setTip] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const panelRefs = useRef<(HTMLLIElement | null)[]>([])
  const geo = useRef({ on: false, pinStart: 0, u: 9 })

  /* The scroll drives the row. The row's place is read from the page and followed with a
     short lag (so wheel notches glide), and runs backwards too. Its position and each
     panel's distance from the middle go out as a transform and CSS variables; only the
     few things that change at a person's boundary are state. */
  useEffect(() => {
    const wrap = wrapRef.current
    const pin = pinRef.current
    const track = trackRef.current
    const row = rowRef.current
    if (!wrap || !pin || !track || !row) return
    const mqWide = window.matchMedia('(min-width: 861px) and (min-height: 560px)')   // the same as characters.css's pinned run
    const mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let centres: number[] = []
    let last = ''
    let shown = 0                                  // the row's drawn place, following the target
    let lastT = 0
    let fresh = true
    let seenMax = -1                               // the swipeable row: the furthest person reached

    function measure() {
      const g = geo.current
      g.on = mqWide.matches && !mqCalm.matches
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
      g.u = window.innerHeight / 100
      g.pinStart = wrap!.getBoundingClientRect().top + window.scrollY - navH
      centres = panelRefs.current.map(p => (p ? p.offsetLeft + p.offsetWidth / 2 : 0))
    }
    function frame(now: number) {
      raf = 0
      const g = geo.current
      let next: View
      if (!g.on) {
        // The swipeable row: whoever is nearest the middle of the row is active; each
        // person draws in the first time they reach it, once the row is on screen
        track!.style.transform = ''
        panelRefs.current.forEach(p => p?.style.removeProperty('--dist'))
        const rr = row!.getBoundingClientRect()
        const mid = rr.left + rr.width / 2
        let best = 0, bd = Infinity
        panelRefs.current.forEach((p, i) => {
          if (!p) return
          const r = p.getBoundingClientRect()
          const dd = Math.abs(r.left + r.width / 2 - mid)
          if (dd < bd) { bd = dd; best = i }
        })
        const onScreen = rr.top < window.innerHeight * 0.8 && rr.bottom > 0
        if (onScreen) seenMax = Math.max(seenMax, best)
        if (mqCalm.matches) seenMax = N - 1
        next = { arrived: seenMax, active: best, hold: onScreen && bd < 24, flat: true }
        fresh = true
      } else {
        const d = (window.scrollY - g.pinStart) / g.u
        const target = rowAt(d)
        const dt = Math.min(0.1, (now - lastT) / 1000)
        lastT = now
        if (fresh) { shown = target; fresh = false }
        else shown += (target - shown) * (1 - Math.exp(-dt * 7))
        if (Math.abs(target - shown) < 0.0005) shown = target
        const f = shown
        const k = Math.min(N - 2, Math.floor(f))
        const cx = centres[k] + (centres[k + 1] - centres[k]) * (f - k)
        track!.style.transform = `translate3d(${(pin!.clientWidth / 2 - cx).toFixed(1)}px, 0, 0)`
        wrap!.style.setProperty('--cf', (f / (N - 1)).toFixed(4))
        panelRefs.current.forEach((p, i) => p?.style.setProperty('--dist', Math.min(1, Math.abs(f - i)).toFixed(3)))
        // A person draws in as they come into the middle (the first as the pinned view comes up)
        const near = Math.round(f)
        const arrived = d < -40 ? -1 : Math.min(N - 1, Math.floor(f + 0.12))
        next = { arrived, active: near, hold: d > -10 && arrived === near && Math.abs(f - near) < 0.12, flat: false }
        if (shown !== target) raf = requestAnimationFrame(frame)
      }
      const key = JSON.stringify(next)
      if (key !== last) { last = key; setView(next) }
    }
    const schedule = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame) } }
    const refresh = () => { measure(); schedule() }

    refresh()
    const ro = new ResizeObserver(refresh)
    ro.observe(track)
    ro.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    row.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', refresh)
    mqWide.addEventListener('change', refresh)
    mqCalm.addEventListener('change', refresh)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      row.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', refresh)
      mqWide.removeEventListener('change', refresh)
      mqCalm.removeEventListener('change', refresh)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => { setTip(0) }, [view.arrived])

  /** The progress labels jump to a person's turn */
  function go(k: number) {
    const g = geo.current
    if (!g.on) {
      // the swipeable row: bring that person to its middle
      const row = rowRef.current, p = panelRefs.current[k]
      if (!row || !p) return
      const rr = row.getBoundingClientRect(), pr = p.getBoundingClientRect()
      row.scrollTo({ left: row.scrollLeft + (pr.left + pr.width / 2) - (rr.left + rr.width / 2), behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: g.pinStart + restAt(k) * g.u, behavior: 'smooth' })
  }

  const { arrived, active, hold, flat } = view
  return (
    <section className={`section crew ${flat ? 'is-flat' : ''}`} aria-labelledby="crew-title">
      <div className="crew-wrap" ref={wrapRef} style={{ ['--crew-run' as string]: `${RUN}svh` }}>
        <div className="crew-pin" ref={pinRef}>
          <div className="container">
            <div className="sec-head center" data-rv>
              <span className="eyebrow"><span className="dot" />How it works</span>
              <h2 id="crew-title" className="h-section">Your whole team, <span className="h-muted">on one system.</span></h2>
              <p className="lede">Five people, one service. Here is what each of them does differently with PepperPe.</p>
            </div>
          </div>

          <div className="crew-row" ref={rowRef}>
            <ol className="crew-track" ref={trackRef}>
              {STEPS.map((s, i) => {
                const C = CHARACTERS[s.who]
                const drawn = i <= arrived
                const isOn = i === active
                const speaking = hold && (flat ? i === active && i <= arrived : i === arrived)
                return (
                  <li
                    key={s.who}
                    ref={el => { panelRefs.current[i] = el }}
                    className={`crew-panel ${isOn ? 'is-on' : ''} ${drawn ? 'is-drawn' : ''}`}
                    aria-current={!flat && i === active ? 'step' : undefined}
                  >
                    <div className="crew-card">
                      <span className="crew-disc" aria-hidden="true" />
                      <button
                        type="button"
                        className="crew-figure"
                        onClick={() => { if (speaking) setTip(t => (t + 1) % s.lines.length) }}
                        tabIndex={isOn ? 0 : -1}
                        aria-label={`${s.role}: another line`}
                      >
                        <span className={`crew-char ${drawn ? 'on' : ''}`}><C /></span>
                      </button>
                      {speaking && (
                        <div className={`crew-bubble ${tip ? 'is-tap' : ''}`} key={`${i}-${tip}`} aria-live="polite">
                          <Words text={s.lines[tip]} />
                        </div>
                      )}
                      <span className="crew-num ui-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="crew-copy">
                      <span className="crew-role">{s.role}</span>
                      <h3 className="h3"><Words text={s.title} /></h3>
                      <p>{s.body}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <nav className="crew-progress" aria-label="The five people">
            {STEPS.map((s, i) => (
              <button
                key={s.who}
                type="button"
                className={`crew-dot ${i === active ? 'on' : ''} ${i <= arrived ? 'is-past' : ''}`}
                onClick={() => go(i)}
                aria-current={i === active ? 'step' : undefined}
              >
                <i aria-hidden="true" />
                <span>{s.role}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

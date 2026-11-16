'use client'
import { useEffect, useRef, useState } from 'react'
import { CHARACTERS } from './crew/Characters'

/**
 * "Meet the crew": a scroll story in the spirit of petpooja.com. The stage on the
 * left is sticky; as each step on the right reaches the middle of the screen its
 * character draws itself in and speaks. Click a character for another tip.
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

export function Crew() {
  const [active, setActive] = useState(0)
  const [tip, setTip] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const rootRef = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    let raf = 0
    const paint = () => {
      raf = 0
      const mid = window.innerHeight * 0.55
      let a = 0
      stepRefs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top < mid) a = i })
      setActive(a)
      const r = rootRef.current?.getBoundingClientRect()
      if (r && r.top < window.innerHeight * 0.8) setSeen(true)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (raf) cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => { setTip(0) }, [active])

  const step = STEPS[active]
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
            <div className="crew-stage" style={{ ['--step' as string]: active }}>
              {/* Soft backdrop that turns a little with every step of the story. */}
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
                  return <span key={s.who} className={`crew-char ${i === active && seen ? 'on' : ''}`}><C /></span>
                })}
              </button>
              <div className="crew-bubble" key={`${active}-${tip}`} aria-live="polite">
                {step.lines[tip]}
              </div>
              <div className="crew-role"><span className="ui-num">{String(active + 1).padStart(2, '0')}</span>{step.role}</div>
              <div className="crew-dots" aria-hidden="true">
                {STEPS.map((s, i) => <span key={s.who} className={i === active ? 'on' : ''} />)}
              </div>
              <span className="crew-hint" aria-hidden="true">Tap me</span>
            </div>
          </div>

          <ol className="crew-steps">
            {STEPS.map((s, i) => {
              const C = CHARACTERS[s.who]
              return (
                <li key={s.who} ref={el => { stepRefs.current[i] = el }} className={`crew-step ${i === active ? 'on' : ''}`}>
                  <span className="crew-step-fig crew-char on" aria-hidden="true"><C /></span>
                  <span className="crew-step-role">{s.role}</span>
                  <h3 className="h3">{s.title}</h3>
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

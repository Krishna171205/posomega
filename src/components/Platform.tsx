'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { BareMocks, BillingMock, ChannelsMock, DayEndMock, FloorMock, KdsMock, StockMock } from './platform/Mocks'
import { Peek, type Enter } from './crew/Peek'
import type { Who } from './crew/parts'

type Feature = {
  id: string
  /** Named the way restaurant-POS buyers search for it */
  name: string
  icon: (p: { size?: number }) => React.ReactNode
  lead: string
  p: string
  link: { href: string; label: string }
  mock: React.ReactNode
  /** The crew member who turns up over the dashboard, each with their own entrance */
  peek: { who: Who; say: string; side: 'left' | 'right'; x: string; enter: Enter }
}

/*
 * The six modules every restaurant-POS comparison lists (billing, tables, kitchen
 * display, inventory, online orders, reports), limited to what Omega actually
 * ships. Copy is condensed from src/content/features.ts, integrations.ts and
 * segments.ts; the lines the characters say match the data in each mock.
 */
const FEATURES: Feature[] = [
  {
    id: 'billing', name: 'Billing & KOT', icon: Icon.Receipt,
    lead: 'Bill in three taps.',
    p: 'GST worked out on every line, KOTs sent to the right station, and one bill paid across UPI, card and cash.',
    link: { href: '/features/billing-and-kot', label: 'Billing & KOT' },
    mock: <BillingMock />,
    peek: { who: 'captain', say: 'Half UPI, half cash? Done.', side: 'right', x: '12%', enter: 'pop' },
  },
  {
    id: 'tables', name: 'Table management', icon: Icon.Table,
    lead: 'Every table, at a glance.',
    p: 'Who is seated, for how long and what they have spent, with reservations in the same view.',
    link: { href: '/for/fine-dining', label: 'Omega for fine dining' },
    mock: <FloorMock />,
    peek: { who: 'server', say: 'Table 3 asked for the bill.', side: 'left', x: '10%', enter: 'walk' },
  },
  {
    id: 'kitchen', name: 'Kitchen display system', icon: Icon.Flame,
    lead: 'Tickets in the order they were fired.',
    p: 'Dine-in, takeaway, QR, Swiggy and Zomato arrive in one list, and each station sees only its own items.',
    link: { href: '/features/kitchen-display', label: 'Kitchen display' },
    mock: <KdsMock />,
    peek: { who: 'chef', say: 'Order up!', side: 'right', x: '18%', enter: 'hat' },
  },
  {
    id: 'inventory', name: 'Inventory & recipe costing', icon: Icon.Box,
    lead: 'Know what runs out before it does.',
    p: 'Every sale removes its actual ingredients, and Omega flags what is running low before service.',
    link: { href: '/features/inventory-and-forecasting', label: 'Inventory' },
    mock: <StockMock />,
    peek: { who: 'store', say: 'Paneer is running low.', side: 'left', x: '14%', enter: 'eyes' },
  },
  {
    id: 'online', name: 'Online order management', icon: Icon.Globe,
    lead: 'Swiggy and Zomato, one queue.',
    p: 'Swiggy and Zomato orders land next to dine-in. Accept with a prep time and the KOT goes straight to the kitchen.',
    link: { href: '/integrations/swiggy-zomato', label: 'Swiggy & Zomato orders' },
    mock: <ChannelsMock />,
    peek: { who: 'manager', say: 'Swiggy just pinged.', side: 'right', x: '10%', enter: 'phone' },
  },
  {
    id: 'reports', name: 'Reports & GST', icon: Icon.Chart,
    lead: 'GST-ready at close.',
    p: 'Payments are recorded against the order, so day-end is a check, and the Tally export is ready for your accountant.',
    link: { href: '/gst-billing-software-for-restaurants', label: 'GST billing' },
    mock: <DayEndMock />,
    peek: { who: 'owner', say: 'It all adds up.', side: 'left', x: '5%', enter: 'lean' },
  },
]
const N = FEATURES.length
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Feature story in the manner of getquoti.ai's tabbed sections: a list of feature
 * names on the left where the current one opens up, a divider that doubles as a
 * progress bar, and a large product view on the right that cross-fades and runs
 * off the edge of the page. Theirs advances
 * on a 5 s timer; here the page scroll drives it. On a wide screen the section
 * pins, the dashboard stays put, and scrolling walks through the six features
 * (the bar under the open one fills as you go). On phones, short windows and with
 * reduced motion it is a plain stacked list, each feature followed by its screen.
 */
export function Platform() {
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)')
    const sync = () => setPinned(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /** Scroll distance the pinned stage travels, and where it starts. */
  function metrics() {
    const track = trackRef.current
    if (!track) return null
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
    return { navH, top: track.getBoundingClientRect().top, range: track.offsetHeight - (window.innerHeight - navH) }
  }

  useEffect(() => {
    if (!pinned) return
    let raf = 0
    let last = -1
    const paint = () => {
      raf = 0
      const m = metrics()
      if (!m) return
      const p = m.range > 0 ? clamp01((m.navH - m.top) / m.range) : 0
      const i = Math.min(N - 1, Math.floor(p * N))
      const fill = Math.min(1, p * N - i)
      if (i !== last) { last = i; setActive(i) }
      // The divider under the open feature fills with progress through its slice.
      barRefs.current.forEach((el, k) => { if (el) el.style.transform = k === i ? `scaleX(${fill.toFixed(4)})` : '' })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pinned])

  /** Scroll to just inside feature i's slice of the pinned track. */
  function go(i: number) {
    const m = metrics()
    if (!m) return
    window.scrollTo({ top: window.scrollY + m.top - m.navH + ((i + 0.06) / N) * m.range, behavior: 'smooth' })
  }

  return (
    <section className={`section platform pf ${pinned ? 'is-pinned' : ''}`} id="platform">
      <div className="pf-track" ref={trackRef}>
        <div className="pf-sticky">
          <div className="container pf-grid">
            <div className="pf-copy">
              <div className="pf-head">
                <div className="eyebrow"><span className="dot" />Platform</div>
                <h2 className="h-section pf-h">One system, first order to day-end close.</h2>
                <p className="lede pf-lede">
                  Billing, tables, the kitchen, stock, online orders and the books, in one product
                  rather than six that sync.
                </p>
              </div>

              <ol className="pf-list">
                {FEATURES.map((f, i) => {
                  const open = !pinned || i === active
                  return (
                    <li key={f.id} className={`pf-item ${pinned && i === active ? 'on' : ''}`}>
                      <h3 className="pf-name">
                        {pinned
                          ? <button type="button" aria-expanded={open} aria-controls={`pf-${f.id}`} onClick={() => go(i)}>{f.name}</button>
                          : <span>{f.name}</span>}
                      </h3>
                      <div className="pf-detail" id={`pf-${f.id}`} inert={!open}>
                        <div className="pf-detail-in">
                          <p className="pf-p"><b>{f.lead}</b> {f.p}</p>
                          <a href={f.link.href} className="text-link pf-link">{f.link.label} <Icon.Arrow size={12} /></a>
                          {!pinned && (
                            <div className="pf-inline has-peek">
                              {f.mock}
                              <Peek {...f.peek} />
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="pf-bar" aria-hidden="true"><i ref={el => { barRefs.current[i] = el }} /></span>
                    </li>
                  )
                })}
              </ol>
            </div>

            {pinned && (
              <div className="pf-vis">
                {/* One app frame that never moves; only the screen inside it changes.
                    The crew sit right on its top edge. */}
                <div className="win pf-win has-peek">
                  <div className="win-bar">
                    <div className="win-dots"><span /><span /><span /></div>
                    <div className="win-title">cafe.posomega.com</div>
                  </div>
                  <div className="win-pane pf-app">
                    <nav className="pf-rail" aria-label="Feature screens">
                      <span className="pf-rail-ind" style={{ ['--i' as string]: active }} aria-hidden="true" />
                      {FEATURES.map((f, i) => (
                        <button key={f.id} type="button" title={f.name} aria-label={f.name} aria-pressed={i === active} onClick={() => go(i)}>
                          <f.icon size={16} />
                        </button>
                      ))}
                      {/* The rest of the portal, so the rail reads like the real app; not screens here */}
                      <span className="pf-rail-sep" aria-hidden="true" />
                      {[Icon.Coffee, Icon.Users, Icon.Clock, Icon.Truck, Icon.Store].map((I, k) => (
                        <span key={k} className="pf-rail-more" aria-hidden="true"><I size={16} /></span>
                      ))}
                    </nav>
                    <div className="pf-screens">
                      <BareMocks value={true}>
                        {FEATURES.map((f, i) => (
                          <div
                            key={f.id}
                            className={`pf-screen ${i === active ? 'on' : i < active ? 'before' : 'after'}`}
                            inert={i !== active}
                          >
                            {f.mock}
                          </div>
                        ))}
                      </BareMocks>
                    </div>
                  </div>
                  {FEATURES.map((f, i) => <Peek key={f.id} {...f.peek} active={i === active} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

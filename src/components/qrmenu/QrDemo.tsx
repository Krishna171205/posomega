'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The hero of /qr-menu: a guest's phone on one side, the kitchen on the other.
 *
 * While it is on screen it plays a loop on its own: the phone scans the table card, the
 * menu opens, dishes are tapped in, the order is placed and a KOT prints in the kitchen,
 * then the bill is paid by UPI. The first touch (or key press) inside the demo stops the
 * loop and hands it to the visitor; "Watch it again" restarts it. Reduced motion: no
 * loop, interactive only. Demo data is made up; every action maps to PepperPe + Grabbit.
 */

type Item = { id: string; n: string; d: string; p: number; veg: boolean }
type Ticket = { id: number; kind: 'kot' | 'waiter' | 'paid'; at: string; lines?: string[]; amount?: number; table: number; fresh: boolean }
type Cart = Record<string, number>

const TABLE = 12
const MENU: Item[] = [
  { id: 'chai', n: 'Masala chai', d: 'Kadak, with ginger', p: 40, veg: true },
  { id: 'coffee', n: 'Filter coffee', d: 'South Indian, in a dabarah', p: 70, veg: true },
  { id: 'sando', n: 'Paneer sandwich', d: 'Grilled, mint chutney', p: 180, veg: true },
  { id: 'pav', n: 'Keema pav', d: 'Spiced mutton mince, two pav', p: 220, veg: false },
]

/** The loop, in ms from its start. `tap` highlights the control being "pressed". */
const SCRIPT: { at: number; tap?: string; act: string }[] = [
  { at: 0, act: 'scan' },
  { at: 1700, act: 'found' },
  { at: 2500, tap: 'pill', act: 'noop' },
  { at: 2950, act: 'menu' },
  { at: 3700, tap: 'add-chai', act: 'cart1' },
  { at: 4500, tap: 'add-sando', act: 'cart2' },
  { at: 5200, tap: 'plus-sando', act: 'cart3' },
  { at: 6100, tap: 'order', act: 'order' },
  { at: 8600, tap: 'pay', act: 'pay' },
  { at: 11000, act: 'end' },
]
const CARTS: Record<string, Cart> = { cart1: { chai: 1 }, cart2: { chai: 1, sando: 1 }, cart3: { chai: 1, sando: 2 } }

const now = () => new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
const rs = (n: number) => `₹${n.toLocaleString('en-IN')}`
const totalOf = (c: Cart) => MENU.reduce((s, i) => s + (c[i.id] ?? 0) * i.p, 0)
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Mark({ veg }: { veg: boolean }) {
  return <span className={`qd-mark ${veg ? 'is-veg' : 'is-nonveg'}`} role="img" aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'} />
}

export function QrDemo() {
  const [phase, setPhase] = useState<'scan' | 'found' | 'menu'>('menu')
  const [cart, setCart] = useState<Cart>({})
  const [placed, setPlaced] = useState<{ total: number; paid: boolean } | null>(null)
  const [flying, setFlying] = useState(false)
  const [tap, setTap] = useState<string | null>(null)
  const [auto, setAuto] = useState(true)
  const [visible, setVisible] = useState(false)
  const [motionOk, setMotionOk] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 411, kind: 'kot', at: '', lines: ['2 × Filter coffee', '1 × Keema pav'], table: 7, fresh: false },
  ])
  const seq = useRef(412)
  const root = useRef<HTMLDivElement>(null)
  const kitchen = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  // The sample ticket reads as printed a few minutes before the visitor arrived.
  useEffect(() => {
    const t = new Date(Date.now() - 4 * 60_000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    setTickets(ts => ts.map(x => (x.id === 411 ? { ...x, at: t } : x)))
    if (reduced()) { setAuto(false); setMotionOk(false) }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function push(t: Omit<Ticket, 'id' | 'at' | 'table' | 'fresh'>) {
    setTickets(ts => [{ ...t, id: seq.current++, at: now(), table: TABLE, fresh: true }, ...ts.map(x => ({ ...x, fresh: false }))].slice(0, 4))
  }

  function placeOrder(c: Cart, scroll: boolean) {
    const lines = MENU.filter(i => c[i.id]).map(i => `${c[i.id]} × ${i.n}`)
    if (!lines.length) return
    setPlaced({ total: totalOf(c), paid: false })
    setCart({})
    // Stacked layout on phones: bring the kitchen into view so the ticket is seen printing.
    if (scroll && window.matchMedia('(max-width: 640px)').matches) kitchen.current?.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' })
    if (reduced()) { push({ kind: 'kot', lines }); return }
    setFlying(true)
    later(() => { setFlying(false); push({ kind: 'kot', lines }) }, 650)
  }

  function pay(total: number) {
    setPlaced({ total, paid: true })
    push({ kind: 'paid', amount: total })
  }

  // The self-playing loop. Restarts from the top every time it ends.
  useEffect(() => {
    if (!auto || !visible) return
    let cancelled = false
    const run = () => {
      for (const s of SCRIPT) {
        later(() => {
          if (cancelled) return
          if (s.tap) { setTap(s.tap); later(() => setTap(null), 380) }
          if (s.act === 'scan') { setPlaced(null); setCart({}); setPhase('scan') }
          else if (s.act === 'found') setPhase('found')
          else if (s.act === 'menu') setPhase('menu')
          else if (CARTS[s.act]) setCart(CARTS[s.act])
          else if (s.act === 'order') placeOrder(CARTS.cart3, false)
          else if (s.act === 'pay') pay(totalOf(CARTS.cart3))
          else if (s.act === 'end') run()
        }, s.at)
      }
    }
    run()
    return () => { cancelled = true; clearTimers() }
  }, [auto, visible]) // eslint-disable-line react-hooks/exhaustive-deps

  /** First real touch or key press inside the demo hands it to the visitor. */
  function takeOver() {
    if (!auto) return
    setAuto(false)
    clearTimers()
    setTap(null)
    setFlying(false)
    setPhase('menu')
    setPlaced(null)
    setCart({})
  }

  function replay() {
    setPlaced(null)
    setCart({})
    setAuto(true)
  }

  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const total = totalOf(cart)
  const t = (k: string) => (tap === k ? ' is-tap' : '')

  return (
    <div className="qd-wrap">
      <div
        className="qd"
        ref={root}
        aria-label="QR ordering demo"
        onPointerDownCapture={e => { if (e.isTrusted) takeOver() }}
        onKeyDownCapture={e => { if (e.isTrusted) takeOver() }}
      >
        {/* Guest side */}
        <div className="qd-phone">
          <div className="qd-phone-screen">
            {phase !== 'menu' ? (
              <div className={`qd-cam ${phase === 'found' ? 'is-found' : ''}`} aria-live="polite">
                {/* A phone camera pointed at the table card standing on a café table. */}
                <div className="qd-cam-scene">
                  <img className="qd-cam-bg" src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=520&h=900&q=70&auto=format&fit=crop" alt="" />
                  <div className="qd-tent">
                    <span className="qd-tent-cafe">Brewbari Café</span>
                    <span className="qd-tent-qr"><img src="/img/qr-menu-try.svg" alt="" width={84} height={84} /></span>
                    <b>Scan to order</b>
                    <span className="qd-tent-table">Table {TABLE}</span>
                  </div>
                </div>
                <span className="qd-cam-mode">{phase === 'scan' ? 'Scanning…' : 'QR code found'}</span>
                {phase === 'found' && (
                  <span className={`qd-cam-pill${t('pill')}`}>
                    <i aria-hidden="true">↗</i>
                    <span><b>Open Brewbari Café menu</b><small>letsgrabbit.com · Table {TABLE}</small></span>
                  </span>
                )}
                <span className="qd-cam-shutter" aria-hidden="true" />
              </div>
            ) : (
              <>
                <div className="qd-cafe">
                  <strong>Brewbari Café</strong>
                  <span className="qd-table">Table {TABLE}</span>
                </div>

                {placed ? (
                  <div className="qd-done" aria-live="polite">
                    <div className="qd-done-tick" aria-hidden="true">✓</div>
                    <strong>{placed.paid ? 'Paid. Thank you!' : 'Order sent to the kitchen'}</strong>
                    <span>{placed.paid ? `${rs(placed.total)} by UPI` : `Table ${TABLE} · ${rs(placed.total)}`}</span>
                    {!placed.paid && (
                      <button type="button" className={`qd-pay${t('pay')}`} onClick={() => pay(placed.total)}>
                        Pay {rs(placed.total)} by UPI
                      </button>
                    )}
                    <button type="button" className="qd-link" onClick={() => setPlaced(null)}>Order something else</button>
                  </div>
                ) : (
                  <>
                    <ul className="qd-menu">
                      {MENU.map(i => (
                        <li key={i.id}>
                          <Mark veg={i.veg} />
                          <div className="qd-item">
                            <span className="qd-n">{i.n}</span>
                            <span className="qd-d">{i.d}</span>
                            <span className="qd-p">{rs(i.p)}</span>
                          </div>
                          {cart[i.id] ? (
                            <div className="qd-step">
                              <button type="button" aria-label={`Remove one ${i.n}`} onClick={() => setCart(c => { const n = (c[i.id] ?? 0) - 1; const x = { ...c, [i.id]: n }; if (n <= 0) delete x[i.id]; return x })}>−</button>
                              <span>{cart[i.id]}</span>
                              <button type="button" className={t(`plus-${i.id}`).trim()} aria-label={`Add one more ${i.n}`} onClick={() => setCart(c => ({ ...c, [i.id]: (c[i.id] ?? 0) + 1 }))}>+</button>
                            </div>
                          ) : (
                            <button type="button" className={`qd-add${t(`add-${i.id}`)}`} onClick={() => setCart(c => ({ ...c, [i.id]: 1 }))} aria-label={`Add ${i.n}`}>Add</button>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="qd-bar">
                      <button type="button" className="qd-waiter" onClick={() => push({ kind: 'waiter' })}>Call waiter</button>
                      <button type="button" className={`qd-order${t('order')}`} disabled={!count} onClick={() => placeOrder(cart, true)}>
                        {count ? `Place order · ${rs(total)}` : 'Add a dish'}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className={`qd-wire ${flying ? 'is-flying' : ''}`} aria-hidden="true"><i /></div>

        {/* Staff side */}
        <div className="qd-kitchen" ref={kitchen}>
          <div className="qd-kitchen-head">
            <span>Kitchen printer</span>
            <span className="qd-live">Live</span>
          </div>
          <div className="qd-slot" aria-hidden="true" />
          <ol className="qd-tickets" aria-label="Kitchen tickets">
            {tickets.map(tk => (
              <li key={tk.id} className={`qd-ticket qd-k-${tk.kind} ${tk.fresh ? 'is-fresh' : ''}`}>
                {tk.kind === 'kot' && (
                  <>
                    <div className="qd-t-head"><b>KOT #{tk.id}</b><span>{tk.at}</span></div>
                    <div className="qd-t-table">TABLE {tk.table} · QR</div>
                    {tk.lines!.map(l => <div key={l} className="qd-t-line">{l}</div>)}
                  </>
                )}
                {tk.kind === 'waiter' && <div className="qd-t-note"><b>Table {tk.table}</b> is calling a waiter <span>{tk.at}</span></div>}
                {tk.kind === 'paid' && <div className="qd-t-note"><b>Table {tk.table}</b> paid {rs(tk.amount!)} by UPI <span>{tk.at}</span></div>}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="qd-status">
        {auto ? 'Tap the phone to try it yourself.' : 'Your turn: add a dish and order.'}
        {!auto && motionOk && <button type="button" className="qd-replay" onClick={replay}>Watch it again</button>}
      </p>
    </div>
  )
}

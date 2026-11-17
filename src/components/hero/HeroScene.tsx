'use client'
import { useEffect, useState } from 'react'
import { Icon } from '../Icons'
import { CHANNEL_LABEL, CHANNEL_MARK, HERO_INCOMING, HERO_ORDERS, type Channel } from '@/content/home'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export function ChannelBadge({ ch }: { ch: Channel }) {
  return <span className={`ch-badge ch-${ch}`} aria-label={CHANNEL_LABEL[ch]}>{CHANNEL_MARK[ch]}</span>
}

const TAG: Record<string, string> = {
  New: 'tag-info', Accepted: 'tag-info', 'Picked up': 'tag-info',
  Cooking: 'tag-warn', Preparing: 'tag-warn',
  Ready: 'tag-ok', 'Food ready': 'tag-ok', Delivered: '',
}
function StatusTag({ s }: { s: string }) {
  return <span className={`tag ${TAG[s] ?? ''}`}><span className="d" />{s}</span>
}

const SUBTOTAL = HERO_INCOMING.items.reduce((s, i) => s + i.q * i.p, 0)
const GST = Math.round(SUBTOTAL * 0.05)
const INCOMING_TOTAL = SUBTOTAL + GST
const TABLE7 = { sub: 260, total: 273 }
const RIDER = 'Ravi'

/**
 * One Swiggy order's whole life in Omega, as one number Hero.tsx advances on a timer.
 * The app window opens the section each moment belongs to, the way a cashier would
 * move through it: the accepted order lands on the Online board, the kitchen card
 * docks into Kitchen, the printed bill docks into the order in Orders, and the day's
 * Reports tick up once it is delivered.
 */
export const FLOW = {
  accept: 1,     // Accept is clicked on the order card
  orderDock: 2,  // the card flies into the Online board, which opens
  accepted: 3,   // #0419 lands in Preparing
  kot: 4,        // KOTs go to the hot line and the bar; the kitchen card gets the ticket
  rider: 5,      // Swiggy assigns a rider
  bump: 6,       // Mark ready is clicked on the kitchen card
  kdsDock: 7,    // the card flies into Kitchen, which opens
  ready: 8,      // the ticket shows ready in the app
  print: 9,      // the bill card prints the bill
  billDock: 10,  // the bill flies into the order in Orders, which opens
  billed: 11,    // the order shows its invoice, stamped
  arrived: 12,   // the rider is at the counter
  pickup: 13,    // handed over
  delivered: 14, // delivered
  reports: 15,   // Reports opens and the day's numbers tick up
  customers: 16, // then a walk around the rest of the portal: Customers
  inventory: 17, // and Inventory
  end: 18,       // dim, reset, go again
} as const

export type View = 'orders' | 'online' | 'kitchen' | 'reports' | 'customers' | 'inventory'
export function viewOf(step: number): View {
  if (step >= FLOW.inventory) return 'inventory'
  if (step >= FLOW.customers) return 'customers'
  if (step >= FLOW.reports) return 'reports'
  if (step >= FLOW.billDock) return 'orders'
  if (step >= FLOW.kdsDock) return 'kitchen'
  if (step >= FLOW.orderDock) return 'online'
  return 'orders'
}

const TOASTS: { from: number; to: number; text: string }[] = [
  { from: FLOW.accepted, to: FLOW.kot, text: 'Accepted · prep 15 min' },
  { from: FLOW.kot, to: FLOW.rider, text: 'KOT #31 → Hot line · KOT #32 → Bar' },
  { from: FLOW.rider, to: FLOW.bump, text: `Swiggy assigned ${RIDER} · 9 min away` },
  { from: FLOW.ready, to: FLOW.billDock, text: `${HERO_INCOMING.id} is ready for pickup` },
  { from: FLOW.billed, to: FLOW.arrived, text: 'INV/0419 printed · packed' },
  { from: FLOW.arrived, to: FLOW.pickup, text: `${RIDER} is at the counter` },
  { from: FLOW.delivered, to: FLOW.reports, text: 'Delivered in 32 min' },
]

function orderStatus(step: number) {
  if (step >= FLOW.delivered) return 'Delivered'
  if (step >= FLOW.pickup) return 'Picked up'
  if (step >= FLOW.ready) return 'Food ready'
  return 'Preparing'
}

/* ── Sidebar ─────────────────────────────────────────────── */
const NAV: { key: string; label: string; icon: React.ReactNode; view?: View }[] = [
  { key: 'orders', label: 'Orders', icon: <Icon.Grid size={14} />, view: 'orders' },
  { key: 'tables', label: 'Tables', icon: <Icon.Table size={14} /> },
  { key: 'kitchen', label: 'Kitchen', icon: <Icon.Flame size={14} />, view: 'kitchen' },
  { key: 'menu', label: 'Menu', icon: <Icon.Coffee size={14} /> },
  { key: 'inventory', label: 'Inventory', icon: <Icon.Box size={14} />, view: 'inventory' },
  { key: 'online', label: 'Online', icon: <Icon.Globe size={14} />, view: 'online' },
  { key: 'reservations', label: 'Reservations', icon: <Icon.Clock size={14} /> },
  { key: 'customers', label: 'Customers', icon: <Icon.Users size={14} />, view: 'customers' },
  { key: 'purchases', label: 'Purchases', icon: <Icon.Truck size={14} /> },
  { key: 'reports', label: 'Reports', icon: <Icon.Chart size={14} />, view: 'reports' },
]

function Sidebar({ step, view }: { step: number; view: View }) {
  const at = NAV.findIndex(n => n.view === view)
  const counts: Record<string, number | null> = {
    orders: step >= FLOW.accepted ? 8 : 7,
    kitchen: step >= FLOW.kot && step < FLOW.ready ? 5 : 3,
    online: step >= FLOW.accepted && step < FLOW.pickup ? 3 : 2,
  }
  const bumped: Record<string, boolean> = {
    orders: step === FLOW.accepted || step === FLOW.billDock,
    kitchen: step === FLOW.kot,
    online: step === FLOW.accepted,
  }
  return (
    <aside className="app-side">
      <div className="app-outlet">
        <span className="app-outlet-mark">B</span>
        <span className="app-outlet-name">
          <b>Brewbari Café</b>
          <span>Hauz Khas Village</span>
        </span>
        <Icon.ChevronDown size={11} />
      </div>
      <div className="app-search"><Icon.Search /> Search <span className="kbd">⌘K</span></div>
      <nav className="app-nav" style={{ ['--i' as string]: at }}>
        <span className="app-nav-ind" aria-hidden="true" />
        {NAV.map(n => (
          <span key={n.key} className={`app-nav-item app-nav-${n.key} ${n.view === view ? 'on' : ''}`}>
            {n.icon} {n.label}
            {n.key === 'inventory' && <i className="warn-dot" />}
            {counts[n.key] != null && (
              <em key={`${n.key}${counts[n.key]}`} className={`ui-num ${bumped[n.key] ? 'bump' : ''}`}>{counts[n.key]}</em>
            )}
          </span>
        ))}
      </nav>
      <div className="app-nav-group">
        <span className="app-nav-h"><Icon.ChevronDown size={10} /> Outlets</span>
        <span className="app-nav-item"><Icon.Store size={14} /> Hauz Khas Village</span>
        <span className="app-nav-item"><Icon.Store size={14} /> Connaught Place</span>
        <span className="app-nav-item"><Icon.Store size={14} /> Cyber Hub, Gurugram</span>
      </div>
      <div className="app-sync"><span className="live" /> Online · synced</div>
    </aside>
  )
}

/* ── Orders ──────────────────────────────────────────────── */

/** Table 7's bill: what the side panel shows before the Swiggy order is opened there */
function Table7Panel() {
  return (
    <>
      <div className="ui-head">Table 7 <span className="sp" /><span className="tag">#0418</span></div>
      <div className="app-detail-body">
        <div className="app-meta"><span>2 covers · Captain Arjun</span><span className="muted">Dine-in</span></div>
        <ul className="app-lines">
          <li><span>2× Masala Chai</span><span className="ui-num">₹120</span></li>
          <li><span>1× Aloo Paratha <em>no onion</em></span><span className="ui-num">₹140</span></li>
        </ul>
        <div className="app-sum">
          <div><span>Subtotal</span><span className="ui-num">{inr(TABLE7.sub)}</span></div>
          <div><span>CGST 2.5%</span><span className="ui-num">₹6.50</span></div>
          <div><span>SGST 2.5%</span><span className="ui-num">₹6.50</span></div>
          <div className="tot"><span>Total</span><span className="ui-num">{inr(TABLE7.total)}</span></div>
        </div>
        <div className="app-pay">
          <div className="app-pay-methods">
            <span className="ui-chip on">UPI</span><span className="ui-chip">Card</span><span className="ui-chip">Cash</span><span className="ui-chip">Split</span>
          </div>
          <span className="ui-btn app-charge"><Icon.Lightning size={13} /> Charge {inr(TABLE7.total)}</span>
        </div>
      </div>
    </>
  )
}

/** The Swiggy order with its invoice: the bill card lands in `.inv`, then the hand-over */
function InvoicePanel({ step }: { step: number }) {
  const status = orderStatus(step)
  const stamped = step >= FLOW.billed
  return (
    <>
      <div className="ui-head">
        {HERO_INCOMING.id} <span className="sp" />
        <span className="tag app-ch-tag"><ChannelBadge ch={HERO_INCOMING.ch} /> {CHANNEL_LABEL[HERO_INCOMING.ch]}</span>
      </div>
      <div className="app-detail-body">
        <div className="app-meta">
          <span>{HERO_INCOMING.ref} · Delivery</span>
          <span key={status} className={`app-state is-${status.split(' ')[0].toLowerCase()}`}>{status}</span>
        </div>
        <div className={`inv ${stamped ? 'is-stamped' : 'is-landing'}`}>
          <div className="inv-h">
            <span><Icon.Receipt size={12} /> Tax invoice</span>
            <b className="ui-num">INV/0419</b>
          </div>
          <ul className="inv-lines">
            {HERO_INCOMING.items.map(i => (
              <li key={i.n}><span>{i.q}× {i.n}</span><span className="ui-num">{inr(i.q * i.p)}</span></li>
            ))}
          </ul>
          <div className="inv-sum">
            <div><span>CGST 2.5% + SGST 2.5%</span><span className="ui-num">{inr(GST)}</span></div>
            <div className="tot"><span>Total</span><span className="ui-num">{inr(INCOMING_TOTAL)}</span></div>
            {stamped && <span className="inv-stamp" aria-hidden="true">PAID</span>}
          </div>
          <div className="inv-foot">
            <span className="inv-paid"><Icon.Check size={11} /> Paid online · Swiggy</span>
            <span className="inv-print"><Icon.Printer size={11} /> Printed</span>
          </div>
        </div>
        <div className="app-act-wrap">
          {step < FLOW.arrived && (
            <span className="app-rider on">
              <span className="app-rider-av">{RIDER[0]}</span>
              {RIDER} · Swiggy rider <em>2 min away</em>
            </span>
          )}
          {step >= FLOW.arrived && step < FLOW.pickup && (
            <span className="ui-btn app-act"><Icon.Check size={13} /> Hand over to {RIDER}</span>
          )}
          {step >= FLOW.pickup && (
            <span key={status} className={`app-done ${step >= FLOW.delivered ? 'is-final' : ''}`}>
              <Icon.Check size={13} /> {step >= FLOW.delivered ? 'Delivered · 32 min' : `Out for delivery with ${RIDER}`}
            </span>
          )}
        </div>
      </div>
    </>
  )
}

function OrdersView({ step }: { step: number }) {
  const hasNew = step >= FLOW.billDock
  return (
    <>
      <main className="app-main">
        <div className="ui-head">
          Orders
          <span className="sp" />
          <span className="ui-btn ghost app-hide-sm"><Icon.Plus size={13} /> New order</span>
        </div>
        <div className="app-filters">
          <span className="ui-chip on">All</span>
          <span className="ui-chip">Dine-in</span>
          <span className="ui-chip">Takeaway</span>
          <span className="ui-chip">Online</span>
          <span className="ui-chip app-hide-sm">QR</span>
        </div>
        <div className="app-table-wrap">
          <table className="ui-table app-table">
            <thead>
              <tr>
                <th>Order</th><th>Channel</th><th className="app-hide-sm">Table / ref</th><th className="app-hide-md">Items</th><th className="r">Amount</th><th>Status</th><th className="app-hide-lg r">Age</th>
              </tr>
            </thead>
            <tbody>
              {hasNew && (
                <tr className="row-new is-focus">
                  <td className="ui-num">{HERO_INCOMING.id}</td>
                  <td><span className="app-ch"><ChannelBadge ch={HERO_INCOMING.ch} /> {CHANNEL_LABEL[HERO_INCOMING.ch]}</span></td>
                  <td className="app-hide-sm ui-num">{HERO_INCOMING.ref}</td>
                  <td className="app-hide-md app-items">{HERO_INCOMING.items.map(i => `${i.q}× ${i.n}`).join(', ')}</td>
                  <td className="r ui-num">{inr(INCOMING_TOTAL)}</td>
                  <td><StatusTag key={orderStatus(step)} s={orderStatus(step)} /></td>
                  <td className="app-hide-lg r muted">13m</td>
                </tr>
              )}
              {HERO_ORDERS.map(o => (
                <tr key={o.id}>
                  <td className="ui-num">{o.id}</td>
                  <td><span className="app-ch"><ChannelBadge ch={o.ch} /> {CHANNEL_LABEL[o.ch]}</span></td>
                  <td className="app-hide-sm">{o.where}</td>
                  <td className="app-hide-md app-items">{o.items}</td>
                  <td className="r ui-num">{inr(o.amount)}</td>
                  <td><StatusTag s={o.status} /></td>
                  <td className="app-hide-lg r muted">{o.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside className="app-detail" key={hasNew ? 'inv' : 't7'}>
        {hasNew ? <InvoicePanel step={step} /> : <Table7Panel />}
      </aside>
    </>
  )
}

/* ── Online: the aggregator board ─────────────────────────── */
type Card = { id: string; ch: Channel; items: string; amount: number; meta: string; late?: boolean }
const BOARD: { key: string; label: string; cards: Card[] }[] = [
  { key: 'new', label: 'New', cards: [] },
  { key: 'prep', label: 'Preparing', cards: [{ id: '#0417', ch: 'zomato', items: '1× Veg Biryani, 1× Raita', amount: 399, meta: '6m · rider 4m', late: true }] },
  { key: 'ready', label: 'Ready', cards: [{ id: '#0412', ch: 'zomato', items: '2× Cold Brew', amount: 378, meta: 'rider at door' }] },
  { key: 'out', label: 'Picked up', cards: [{ id: '#0413', ch: 'swiggy', items: '1× Paneer Tikka Roll', amount: 231, meta: '21m' }] },
]

function BoardCard({ c, className = '', extra }: { c: Card; className?: string; extra?: React.ReactNode }) {
  return (
    <div className={`ob-card ${className}`}>
      <div className="ob-card-h">
        <ChannelBadge ch={c.ch} />
        <span className="ui-num">{c.id}</span>
        <span className={`ob-meta ${c.late ? 'is-late' : ''}`}>{c.meta}</span>
      </div>
      <div className="ob-items">{c.items}</div>
      <div className="ob-card-f"><span className="ui-num">{inr(c.amount)}</span>{extra}</div>
    </div>
  )
}

function OnlineView({ step }: { step: number }) {
  const landed = step >= FLOW.accepted
  const rider = step >= FLOW.rider
  const mine: Card = {
    id: HERO_INCOMING.id, ch: 'swiggy', amount: INCOMING_TOTAL,
    items: HERO_INCOMING.items.map(i => `${i.q}× ${i.n}`).join(', '),
    meta: rider ? `${RIDER} · 9m` : 'prep 15m',
  }
  return (
    <>
      <main className="app-main">
        <div className="ui-head">
          Online orders
          <span className="sp" />
          <span className="ob-live"><i /> Swiggy</span>
          <span className="ob-live app-hide-sm"><i /> Zomato</span>
        </div>
        <div className="app-filters">
          <span className="ui-chip on">All {landed ? 4 : 3}</span>
          <span className="ui-chip">Swiggy {landed ? 2 : 1}</span>
          <span className="ui-chip">Zomato 2</span>
        </div>
        <div className="ob">
          {BOARD.map(col => (
            <div key={col.key} className={`ob-col ob-col-${col.key}`}>
              <div className="ob-col-h">{col.label} <em className="ui-num">{col.cards.length + (col.key === 'prep' && landed ? 1 : 0)}</em></div>
              {col.key === 'prep' && (
                landed
                  ? <BoardCard c={mine} className="ob-slot is-landed" extra={<span className="ob-prep"><span style={{ ['--t' as string]: rider ? 0.62 : 0.94 }} /></span>} />
                  : <div className="ob-slot is-waiting" />
              )}
              {col.cards.map(c => <BoardCard key={c.id} c={c} />)}
              {col.key === 'new' && <div className="ob-empty">No new orders</div>}
            </div>
          ))}
        </div>
      </main>
      <aside className="app-detail" key="online">
        <div className="ui-head">
          {HERO_INCOMING.id} <span className="sp" />
          <span className="tag app-ch-tag"><ChannelBadge ch="swiggy" /> Swiggy</span>
        </div>
        <div className="app-detail-body">
          <div className="app-meta"><span>{HERO_INCOMING.ref} · Delivery</span><span className="app-state is-preparing">Preparing</span></div>
          <ul className="app-lines app-lines-o">
            {HERO_INCOMING.items.map(i => (
              <li key={i.n}><span>{i.q}× {i.n}</span><span className="ui-num">{inr(i.q * i.p)}</span></li>
            ))}
          </ul>
          <div className="ob-prepline">
            <span>Prep time</span>
            <b className="ui-num">{rider ? '9:20' : '15:00'} left</b>
          </div>
          <div className={`ob-route ${rider ? 'on' : ''}`}>
            <div className="ob-route-h">
              <span className="app-rider-av">{rider ? RIDER[0] : '?'}</span>
              <span key={rider ? 'r' : 'f'} className="ob-route-who">{rider ? <><b>{RIDER}</b> · Swiggy rider</> : 'Finding a rider…'}</span>
              {rider && <em className="ui-num">9 min</em>}
            </div>
            <div className="ob-route-line" aria-hidden="true">
              <span className="ob-route-dot" />
              <span className="ob-route-store"><Icon.Store size={10} /></span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

/* ── Kitchen: the display, inside the app ─────────────────── */
const KD_MORE: { id: string; ch: Channel; where: string; t: string; s: string; l: string[]; hide?: string }[] = [
  { id: '#0420', ch: 'dine', where: 'Table 4', t: '2:05', s: 'is-cook', l: ['1× Masala Dosa', '1× Filter Coffee'] },
  { id: '#0421', ch: 'qr', where: 'Table 9', t: '0:40', s: '', l: ['2× Veg Momos'] },
  { id: '#0422', ch: 'zomato', where: 'KOT #33', t: '0:12', s: '', l: ['1× Chole Bhature', '1× Lassi'], hide: 'app-hide-sm' },
  { id: '#0423', ch: 'take', where: 'Counter', t: '0:05', s: '', l: ['1× Paneer Tikka Roll'], hide: 'app-hide-sm' },
]
function KitchenView({ step }: { step: number }) {
  const ready = step >= FLOW.ready
  return (
    <main className="app-main app-wide">
      <div className="ui-head">
        Kitchen
        <span className="sp" />
        <span className="kd-avg">Avg ticket <b className="ui-num">8m 40s</b></span>
      </div>
      <div className="app-filters">
        <span className="ui-chip on">Hot line 3</span>
        <span className="ui-chip">Bar 1</span>
        <span className="ui-chip app-hide-sm">Tandoor 1</span>
      </div>
      <div className="kd">
        <div className={`kd-ticket kd-slot ${ready ? 'is-ready' : 'is-landing'}`}>
          <div className="kd-h"><ChannelBadge ch="swiggy" /><span className="ui-num">{HERO_INCOMING.id}</span><span className="kd-kot">KOT #31</span><span className="kd-t ui-num">{ready ? 'Ready' : '11:52'}</span></div>
          <div className="kd-l">2× Paneer Tikka Roll</div>
          <div className="kd-l">1× Masala Fries</div>
          <div className="kd-f">{ready ? <span className="kd-done"><Icon.Check size={10} /> Ready · {RIDER} 2m away</span> : <span className="kd-rider">Rider 2m</span>}</div>
        </div>
        <div className={`kd-ticket ${ready ? 'is-ready' : ''}`}>
          <div className="kd-h"><ChannelBadge ch="swiggy" /><span className="ui-num">{HERO_INCOMING.id}</span><span className="kd-kot">KOT #32 · Bar</span></div>
          <div className="kd-l">1× Cold Coffee</div>
          <div className="kd-f">{ready ? <span className="kd-done"><Icon.Check size={10} /> Ready</span> : <span className="muted">Bar</span>}</div>
        </div>
        <div className="kd-ticket is-cook">
          <div className="kd-h"><ChannelBadge ch="dine" /><span className="ui-num">#0418</span><span className="kd-kot">Table 7</span><span className="kd-t ui-num">4:12</span></div>
          <div className="kd-l">1× Aloo Paratha</div>
          <div className="kd-f"><span className="fw-flag">No onion</span></div>
        </div>
        <div className="kd-ticket is-late app-hide-sm">
          <div className="kd-h"><ChannelBadge ch="zomato" /><span className="ui-num">#0417</span><span className="kd-kot">KOT #29</span><span className="kd-t ui-num">6:30</span></div>
          <div className="kd-l">1× Veg Biryani</div>
          <div className="kd-l">1× Raita</div>
        </div>
        {KD_MORE.map(k => (
          <div key={k.id} className={`kd-ticket ${k.s} ${k.hide ?? ''}`}>
            <div className="kd-h"><ChannelBadge ch={k.ch} /><span className="ui-num">{k.id}</span><span className="kd-kot">{k.where}</span><span className="kd-t ui-num">{k.t}</span></div>
            {k.l.map(x => <div key={x} className="kd-l">{x}</div>)}
          </div>
        ))}
      </div>
    </main>
  )
}

/* ── Reports: the day, ticking up ─────────────────────────── */
function useCount(from: number, to: number, ms = 900, delay = 250) {
  const [v, setV] = useState(from)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / ms))
      setV(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [from, to, ms, delay])
  return v
}

/* Sample day for Brewbari Café (made up), not a customer metric. The views below are the
   ones the live homepage rotates through; here the story walks into them once the
   order is delivered. */
const HOURS = [
  ['8a', 18], ['9a', 34], ['10a', 41], ['11a', 37], ['12p', 72], ['1p', 96], ['2p', 81],
  ['3p', 44], ['4p', 39], ['5p', 52], ['6p', 68], ['7p', 88], ['8p', 100], ['9p', 74],
] as const
const CHANNELS = [
  { n: 'Dine-in', v: 46, c: 'var(--blue-500)' }, { n: 'Swiggy', v: 22, c: '#fc8019' },
  { n: 'Zomato', v: 17, c: '#e23744' }, { n: 'Takeaway', v: 9, c: 'var(--green-500)' }, { n: 'QR', v: 6, c: 'var(--yellow-500)' },
]

function ReportsView() {
  // The order that just went out lands in the day's numbers.
  const sales = useCount(48260, 48260 + INCOMING_TOTAL)
  const orders = useCount(186, 187, 500, 400)
  const rolls = useCount(41, 43, 500, 700)
  return (
    <>
      <main className="app-main">
        <div className="ui-head">Reports · Today <span className="sp" /><span className="ui-chip on app-hide-sm">Today</span><span className="ui-chip app-hide-sm">7 days</span></div>
        <div className="av-kpis">
          <div className="av-kpi"><span>Net sales</span><b className="ui-num">{inr(sales)}</b><em className="up">▲ 12%</em></div>
          <div className="av-kpi"><span>Orders</span><b className="ui-num">{orders}</b><em className="up">▲ 8%</em></div>
          <div className="av-kpi app-hide-sm"><span>Avg. bill</span><b className="ui-num">₹259</b><em className="up">▲ 3%</em></div>
          <div className="av-kpi app-hide-md"><span>Food cost</span><b className="ui-num">31.4%</b><em className="down">▼ 1.2 pts</em></div>
        </div>
        <div className="av-chart">
          <div className="av-chart-h"><b>Sales by hour</b><span className="muted">Lunch and dinner peaks</span></div>
          <div className="av-bars">
            {HOURS.map(([h, v], i) => (
              <div key={h} className="av-bar">
                <i style={{ height: `${v}%`, animationDelay: `${i * 45}ms` }} className={v >= 80 ? 'hot' : ''} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <aside className="app-detail">
        <div className="ui-head">Sales by channel</div>
        <div className="app-detail-body av-stack">
          <div className="av-split">{CHANNELS.map(c => <i key={c.n} style={{ flexGrow: c.v, background: c.c }} />)}</div>
          <ul className="av-list">
            {CHANNELS.map(c => <li key={c.n}><span><i style={{ background: c.c }} />{c.n}</span><b className="ui-num">{c.v}%</b></li>)}
          </ul>
          <div className="ui-head av-subhead">Top items</div>
          <ul className="av-list">
            <li><span>Masala Chai</span><b className="ui-num">84</b></li>
            <li className="av-now"><span>Paneer Tikka Roll</span><b key={rolls} className="ui-num">{rolls}</b></li>
            <li><span>Cold Coffee</span><b className="ui-num">37</b></li>
          </ul>
        </div>
      </aside>
    </>
  )
}

/* Customers: regulars by phone number, with visits, spend and loyalty coins (sample data). */
const GUESTS = [
  { n: 'Ananya Malhotra', ph: '98•••• 4410', v: 14, last: 'Today', spent: 5880, tag: 'Regular', cls: 'tag-ok' },
  { n: 'Kabir Sethi', ph: '99•••• 1207', v: 9, last: 'Yesterday', spent: 3420, tag: 'Regular', cls: 'tag-ok' },
  { n: 'Riya Khanna', ph: '97•••• 8833', v: 1, last: 'Today', spent: 756, tag: 'New', cls: 'tag-info' },
  { n: 'Arjun Bhatia', ph: '98•••• 0291', v: 6, last: '34 days ago', spent: 2110, tag: 'Lapsed', cls: 'tag-warn' },
  { n: 'Meher Kohli', ph: '90•••• 5518', v: 11, last: '3 days ago', spent: 4675, tag: 'Regular', cls: 'tag-ok' },
  { n: 'Dev Chopra', ph: '88•••• 3364', v: 2, last: 'Last week', spent: 640, tag: 'New', cls: 'tag-info' },
  { n: 'Ishita Arora', ph: '96•••• 7742', v: 18, last: 'Today', spent: 7930, tag: 'Regular', cls: 'tag-ok' },
  { n: 'Vikram Ahuja', ph: '98•••• 2159', v: 4, last: '41 days ago', spent: 1480, tag: 'Lapsed', cls: 'tag-warn' },
  { n: 'Simran Gill', ph: '99•••• 6603', v: 7, last: '2 days ago', spent: 2865, tag: 'Regular', cls: 'tag-ok' },
  { n: 'Rohan Bajaj', ph: '87•••• 9124', v: 1, last: 'Yesterday', spent: 420, tag: 'New', cls: 'tag-info' },
  { n: 'Tanya Suri', ph: '95•••• 3381', v: 9, last: '5 days ago', spent: 3640, tag: 'Regular', cls: 'tag-ok' },
] as const

function CustomersView() {
  const coins = useCount(294, 320, 600, 600)
  return (
    <>
      <main className="app-main">
        <div className="ui-head">Customers <span className="sp" /><span className="ui-chip on app-hide-sm">All</span><span className="ui-chip app-hide-sm">Regulars</span><span className="ui-chip app-hide-sm">Lapsed</span></div>
        <div className="app-table-wrap">
          <table className="ui-table app-table">
            <thead><tr><th>Customer</th><th className="r">Visits</th><th className="app-hide-sm">Last visit</th><th className="r app-hide-sm">Spent</th><th>Status</th></tr></thead>
            <tbody>
              {GUESTS.map((g, i) => (
                <tr key={g.n} className={i === 0 ? 'cu-on' : ''}>
                  <td><span className="cu-name"><b>{g.n}</b><span className="ui-num">{g.ph}</span></span></td>
                  <td className="r ui-num">{g.v}</td>
                  <td className="app-hide-sm">{g.last}</td>
                  <td className="r ui-num app-hide-sm">{inr(g.spent)}</td>
                  <td><span className={`tag ${g.cls}`}><span className="d" />{g.tag}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside className="app-detail">
        <div className="ui-head">Ananya Malhotra</div>
        <div className="app-detail-body av-stack">
          <div className="cu-coins"><span>Loyalty coins</span><b key={coins} className="ui-num">{coins}</b><em>+26 from today’s bill</em></div>
          <div className="av-rows">
            <div className="av-kv"><span>Visits</span><b className="ui-num">14</b></div>
            <div className="av-kv"><span>Avg. bill</span><b className="ui-num">₹420</b></div>
            <div className="av-kv"><span>Usually orders</span><b>Cold Coffee</b></div>
            <div className="av-kv"><span>Customer since</span><b>Mar 2026</b></div>
          </div>
          <div className="ui-head av-subhead">Recent visits</div>
          <ul className="av-list">
            <li><span>Today · Dine-in</span><b className="ui-num">₹520</b></li>
            <li><span>12 Nov · Takeaway</span><b className="ui-num">₹310</b></li>
            <li><span>8 Nov · Dine-in</span><b className="ui-num">₹465</b></li>
            <li className="app-hide-short"><span>2 Nov · Online</span><b className="ui-num">₹388</b></li>
            <li className="app-hide-short"><span>27 Oct · Dine-in</span><b className="ui-num">₹540</b></li>
          </ul>
          <div className="ui-head av-subhead app-hide-short">Favourites</div>
          <ul className="av-list app-hide-short">
            <li><span>Cold Coffee</span><b className="ui-num">11×</b></li>
            <li><span>Paneer Tikka Roll</span><b className="ui-num">6×</b></li>
          </ul>
        </div>
      </aside>
    </>
  )
}

const STOCK = [
  { n: 'Paneer', on: '4.2 kg', u: '3.1 kg', p: 22, st: 'bad', s: 'Runs out Fri', r: 'Reorder 3 kg', c: 1140 },
  { n: 'Cold brew concentrate', on: '12 L', u: '4 L', p: 38, st: 'warn', s: 'Low', r: 'Reorder 2 L', c: 520 },
  { n: 'Sourdough loaf', on: '28 pc', u: '14 pc', p: 46, st: 'warn', s: 'Low', r: 'Reorder 2 pc', c: 180 },
  { n: 'Amul butter', on: '1.5 kg', u: '0.8 kg', p: 34, st: 'warn', s: 'Low', r: 'Reorder 2 kg', c: 300 },
  { n: 'Whole milk', on: '42 L', u: '18 L', p: 81, st: 'ok', s: 'OK' },
  { n: 'Basmati rice', on: '36 kg', u: '6 kg', p: 74, st: 'ok', s: 'OK' },
  { n: 'Coffee beans', on: '9.5 kg', u: '1.2 kg', p: 63, st: 'ok', s: 'OK' },
  { n: 'Chicken (boneless)', on: '14 kg', u: '5 kg', p: 58, st: 'ok', s: 'OK' },
  { n: 'Maida', on: '25 kg', u: '3 kg', p: 70, st: 'ok', s: 'OK' },
  { n: 'Tomatoes', on: '11 kg', u: '6 kg', p: 52, st: 'ok', s: 'OK' },
  { n: 'Takeaway cups (12 oz)', on: '640 pc', u: '120 pc', p: 66, st: 'ok', s: 'OK' },
] as const

function InventoryView() {
  return (
    <>
      <main className="app-main">
        <div className="ui-head">Inventory · Before tomorrow’s delivery <span className="sp" /></div>
        <div className="av-alert"><Icon.Sparkle size={13} /> 4 items running low before the next delivery</div>
        <div className="app-table-wrap">
          <table className="ui-table app-table">
            <thead><tr><th>Item</th><th className="r">On hand</th><th className="r app-hide-md">Used today</th><th className="app-hide-sm">Stock level</th><th>Status</th></tr></thead>
            <tbody>
              {STOCK.map((x, i) => (
                <tr key={x.n}>
                  <td>{x.n}</td>
                  <td className="r ui-num">{x.on}</td>
                  <td className="r ui-num app-hide-md">{x.u}</td>
                  <td className="app-hide-sm"><span className={`av-level av-${x.st}`}><i style={{ width: `${x.p}%`, animationDelay: `${i * 70}ms` }} /></span></td>
                  <td><span className={`tag tag-${x.st}`}><span className="d" />{x.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside className="app-detail">
        <div className="ui-head">Draft purchase order</div>
        <div className="app-detail-body av-stack">
          <div className="av-rows">
            <div className="av-kv"><span>Supplier</span><b>Azadpur Fresh Co.</b></div>
            <div className="av-kv"><span>Delivery</span><b>Tomorrow, 8 am</b></div>
            <div className="av-kv"><span>Outlet</span><b>Hauz Khas Village</b></div>
          </div>
          <div className="ui-head av-subhead">Items</div>
          <ul className="av-list av-po">
            {STOCK.filter(x => 'r' in x).map(x => <li key={x.n}><span>{x.n} · {'r' in x ? x.r.replace('Reorder ', '') : ''}</span><b className="ui-num">{'c' in x ? inr(x.c) : ''}</b></li>)}
          </ul>
          <div className="av-kv av-total"><span>Est. total</span><b className="ui-num">₹2,140</b></div>
          <span className="ui-btn app-charge"><Icon.Truck size={13} /> Send to supplier</span>
        </div>
      </aside>
    </>
  )
}

/**
 * The Omega app inside the hero window shell, drawn for one step of the order's life.
 * Each section mounts fresh when it opens (keyed by view), so its entrance plays.
 */
export function AppWindow({ step }: { step: number }) {
  const view = viewOf(step)
  const toast = TOASTS.find(t => step >= t.from && step < t.to)
  return (
    <div className={`app ui v-${view}`}>
      <Sidebar step={step} view={view} />
      <div className="app-view" key={view}>
        {view === 'orders' && <OrdersView step={step} />}
        {view === 'online' && <OnlineView step={step} />}
        {view === 'kitchen' && <KitchenView step={step} />}
        {view === 'reports' && <ReportsView />}
        {view === 'customers' && <CustomersView />}
        {view === 'inventory' && <InventoryView />}
      </div>
      {toast && (
        <div key={toast.text} className="app-toast" role="status">
          <Icon.Check size={12} /> {toast.text}
        </div>
      )}
    </div>
  )
}

function Bar({ title }: { title: string }) {
  return (
    <div className="win-bar">
      <div className="win-dots"><span /><span /><span /></div>
      <div className="win-title">{title}</div>
    </div>
  )
}

/** Stand-in for Attio's "call" window: a new aggregator order waiting to be accepted. */
export function OrderWindow({ pressed = false }: { pressed?: boolean }) {
  const [secs, setSecs] = useState(42)
  useEffect(() => {
    const id = window.setInterval(() => setSecs(s => (s <= 8 ? 42 : s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="win sm fw-card">
      <Bar title="Online orders" />
      <div className="win-pane ui fw-order">
        <div className="fw-order-top">
          <ChannelBadge ch="swiggy" />
          <div>
            <b>New order</b>
            <span className="ui-num muted">{HERO_INCOMING.ref} · Delivery</span>
          </div>
          <span className="fw-ring" style={{ ['--t' as string]: secs / 42 }}><span className="ui-num">0:{String(secs).padStart(2, '0')}</span></span>
        </div>
        <ul className="fw-lines">
          {HERO_INCOMING.items.map(i => (
            <li key={i.n}><span>{i.q}× {i.n}</span><span className="ui-num">{inr(i.q * i.p)}</span></li>
          ))}
        </ul>
        <div className="fw-order-foot">
          <span className="muted">Total incl. GST</span>
          <b className="ui-num">{inr(INCOMING_TOTAL)}</b>
        </div>
        <div className="fw-actions">
          <span className="ui-btn ghost">Reject</span>
          <span className={`ui-btn ok fw-accept ${pressed ? 'is-pressed' : ''}`}>{pressed ? <><Icon.Check size={12} /> Accepted</> : 'Accept · prep 15m'}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Stand-in for Attio's "Slack" window: the hot line's kitchen display. The Swiggy
 * order's ticket drops in at the top when its KOT fires, first in line because a
 * rider is already on the way.
 */
export function KitchenWindow({ fired = false, bumped = false }: { fired?: boolean; bumped?: boolean }) {
  const tickets = [
    ...(fired ? [{ id: '#0419', ch: 'swiggy' as Channel, l: ['2× Paneer Tikka Roll', '1× Masala Fries'], t: '0:12', s: 'new', rider: true }] : []),
    { id: '#0418', ch: 'dine' as Channel, l: ['1× Aloo Paratha'], t: '4:12', s: 'cook', f: 'No onion' },
    { id: '#0417', ch: 'zomato' as Channel, l: ['1× Veg Biryani'], t: '6:30', s: 'late' },
  ]
  return (
    <div className="win sm fw-card">
      <Bar title="Kitchen · Hot line" />
      <div className="win-pane ui fw-kds">
        {tickets.map(k => {
          const done = k.id === HERO_INCOMING.id && bumped
          return (
            <div key={k.id} className={`fw-ticket ${done ? 'ready' : k.s} ${k.id === HERO_INCOMING.id ? 'is-fresh' : ''}`}>
              <div className="fw-ticket-h">
                <ChannelBadge ch={k.ch} />
                <span className="ui-num">{k.id}</span>
                {'rider' in k && k.rider && <span className="fw-rider">Rider 2m</span>}
                <span className="ui-num fw-ticket-t"><Icon.Clock size={11} /> {k.t}</span>
              </div>
              {k.l.map(x => <div key={x} className={`fw-ticket-l ${done ? 'is-done' : ''}`}>{x}</div>)}
              {'f' in k && k.f && <div className="fw-flag">{k.f}</div>}
              {'rider' in k && k.rider && (
                <span className={`fw-bump ${done ? 'is-done' : ''}`}>{done ? <><Icon.Check size={10} /> Ready</> : 'Mark ready'}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Stand-in for Attio's terminal window: the counter's bill printer. It waits empty;
 * once the food is ready it prints the GST bill for the Swiggy order (the paper feeds
 * out in short jerks and a PAID stamp lands), then the bill flies into the order.
 */
export function ReceiptWindow({ printing = false }: { printing?: boolean }) {
  return (
    <div
      className={`pr pr-float ${printing ? 'is-printing' : 'is-idle'}`}
      role="img"
      aria-label={`Bill printer: GST bill for Swiggy order ${HERO_INCOMING.ref}, ${inr(INCOMING_TOTAL)} paid online`}
    >
      <div className="pr-frame">
        <div className="pr-head">
          <span className="pr-mark">B</span>
          <span className="pr-where">
            <b>Brewbari Café</b>
            <span>{printing ? 'Printing INV/0419…' : 'Counter printer · ready'}</span>
          </span>
          <span className="pr-led" aria-hidden="true" />
        </div>
        <div className="pr-slot" aria-hidden="true" />
        <div className="pr-out">
          <div className="pr-tray" aria-hidden="true"><Icon.Printer size={14} /> Prints when the food is ready</div>
          <div className="pr-paper">
            <div className="pr-sec pr-ids">
              <div><span>GSTIN</span><b className="ui-num">29XXXXXXXXXX1Z5</b></div>
              <div className="r"><span>Swiggy</span><b className="ui-num">{HERO_INCOMING.ref}</b></div>
            </div>
            <div className="pr-sec pr-hi"><b>Order {HERO_INCOMING.id}, packed</b><Icon.Download size={12} /></div>
            <div className="pr-sec pr-amt">
              <div><span>Amount</span><b className="ui-num">{inr(INCOMING_TOTAL)}.00 <em>(online)</em></b></div>
              <div className="r"><b>12 Nov, 1:55pm</b><b>{HERO_INCOMING.items.length} items</b></div>
            </div>
            <div className="pr-sec pr-tail">
              <div><span>Bill no.</span><b className="ui-num">INV/0419</b></div>
              <div className="pr-stamp" aria-hidden="true"><span>PAID</span></div>
              <div className="r"><span>CGST + SGST</span><b className="ui-num">{inr(GST)}.00</b></div>
            </div>
            <span className="pr-pill">See full bill</span>
          </div>
        </div>
      </div>
    </div>
  )
}

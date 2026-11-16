'use client'
import { useEffect, useState } from 'react'
import { Icon } from '../Icons'
import { CHANNEL_LABEL, CHANNEL_MARK, HERO_INCOMING, HERO_ORDERS, type Channel } from '@/content/home'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/**
 * A seconds counter that drives each side window's own loop, the way every small
 * window on attio.com plays its own scene. Frozen at 0 for reduced motion.
 */
function useSeconds() {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setS(x => x + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return s
}
const clock = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`

export function ChannelBadge({ ch }: { ch: Channel }) {
  return <span className={`ch-badge ch-${ch}`} aria-label={CHANNEL_LABEL[ch]}>{CHANNEL_MARK[ch]}</span>
}

function StatusTag({ s }: { s: string }) {
  const cls = s === 'Ready' ? 'tag-ok' : s === 'New' ? 'tag-info' : s === 'Cooking' ? 'tag-warn' : ''
  return <span className={`tag ${cls}`}><span className="d" />{s}</span>
}

const INCOMING_TOTAL = Math.round(HERO_INCOMING.items.reduce((s, i) => s + i.q * i.p, 0) * 1.05)
const TABLE7 = { sub: 260, gst: 13, total: 273 }

/* Views the app window rotates through, like attio.com's hero moving between Home,
   Workflows and Reports. Seconds on screen each; Orders is longest because the
   .s1/.s2/.s3 scene (new order, KOT, paid) plays on it. */
const VIEWS = [
  { key: 'orders', secs: 12 },
  { key: 'tables', secs: 7 },
  { key: 'reports', secs: 8 },
  { key: 'inventory', secs: 7 },
] as const
type View = (typeof VIEWS)[number]['key']
const CYCLE = VIEWS.reduce((t, v) => t + v.secs, 0)
function viewAt(s: number): { view: View; k: number } {
  let t = s % CYCLE
  for (const v of VIEWS) { if (t < v.secs) return { view: v.key, k: t }; t -= v.secs }
  return { view: 'orders', k: 0 }
}

/**
 * The Omega app inside the hero window shell, for "Brewbari Café", a made-up outlet (sample data only).
 * It rotates Orders, Tables, Reports and Inventory on its own. On Orders the stage
 * toggles .s1/.s2/.s3 on an ancestor and CSS reveals the new order, KOT and payment.
 */
export function AppWindow() {
  const { view, k } = viewAt(useSeconds())
  const nav = (v: View | 'kitchen' | 'online') => `app-nav-item${v === view ? ' on' : ''}`
  return (
    <div className="app ui">
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
        <nav className="app-nav">
          <span className={nav('orders')}><Icon.Grid size={14} /> Orders <em className="ui-num">7</em></span>
          <span className={nav('tables')}><Icon.Table size={14} /> Tables</span>
          <span className="app-nav-item app-nav-kitchen">
            <Icon.Flame size={14} /> Kitchen
            <em className="ui-num"><span className="n0">4</span><span className="n1">5</span></em>
          </span>
          <span className="app-nav-item"><Icon.Coffee size={14} /> Menu</span>
          <span className={nav('inventory')}><Icon.Box size={14} /> Inventory <i className="warn-dot" /></span>
          <span className="app-nav-item"><Icon.Globe size={14} /> Online <em className="ui-num">3</em></span>
          <span className="app-nav-item"><Icon.Clock size={14} /> Reservations</span>
          <span className="app-nav-item"><Icon.Users size={14} /> Customers</span>
          <span className="app-nav-item"><Icon.Receipt size={14} /> Bills</span>
          <span className={nav('reports')}><Icon.Chart size={14} /> Reports</span>
        </nav>
        <div className="app-nav-group">
          <span className="app-nav-h"><Icon.ChevronDown size={10} /> Outlets</span>
          <span className="app-nav-item"><Icon.Store size={14} /> Hauz Khas Village</span>
          <span className="app-nav-item"><Icon.Store size={14} /> Cyber Hub, Gurugram</span>
          <span className="app-nav-item"><Icon.Store size={14} /> Sector 18, Noida</span>
        </div>
        <div className="app-sync"><span className="live" /> Online · synced</div>
      </aside>
      {view === 'orders' && <OrdersView />}
      {view === 'tables' && <TablesView k={k} />}
      {view === 'reports' && <ReportsView />}
      {view === 'inventory' && <InventoryView />}
    </div>
  )
}

function OrdersView() {
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
              <tr className="row-new">
                <td className="ui-num">{HERO_INCOMING.id}</td>
                <td><span className="app-ch"><ChannelBadge ch={HERO_INCOMING.ch} /> {CHANNEL_LABEL[HERO_INCOMING.ch]}</span></td>
                <td className="app-hide-sm ui-num">{HERO_INCOMING.ref}</td>
                <td className="app-hide-md app-items">{HERO_INCOMING.items.map(i => `${i.q}× ${i.n}`).join(', ')}</td>
                <td className="r ui-num">{inr(INCOMING_TOTAL)}</td>
                <td><span className="st-a"><StatusTag s="New" /></span><span className="st-b"><StatusTag s="Cooking" /></span></td>
                <td className="app-hide-lg r muted">now</td>
              </tr>
              {HERO_ORDERS.map(o => (
                <tr key={o.id} className={o.id === '#0418' ? 'row-t7' : undefined}>
                  <td className="ui-num">{o.id}</td>
                  <td><span className="app-ch"><ChannelBadge ch={o.ch} /> {CHANNEL_LABEL[o.ch]}</span></td>
                  <td className="app-hide-sm">{o.where}</td>
                  <td className="app-hide-md app-items">{o.items}</td>
                  <td className="r ui-num">{inr(o.amount)}</td>
                  <td>
                    {o.id === '#0418'
                      ? <><span className="st-a"><StatusTag s={o.status} /></span><span className="st-b"><StatusTag s="Paid" /></span></>
                      : <StatusTag s={o.status} />}
                  </td>
                  <td className="app-hide-lg r muted">{o.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <aside className="app-detail">
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
          {/* Shown from the bill step (.s3): the docked bill prints out right here */}
          <div className="app-print" aria-hidden="true"><ReceiptWindow /></div>
          <div className="app-pay">
            <div className="app-pay-methods">
              <span className="ui-chip on">UPI</span><span className="ui-chip">Card</span><span className="ui-chip">Cash</span><span className="ui-chip">Split</span>
            </div>
            <span className="ui-btn app-charge"><Icon.Lightning size={13} /> Charge {inr(TABLE7.total)}</span>
            <span className="app-paid"><Icon.Check size={13} /> Paid via UPI · bill printed</span>
          </div>
        </div>
      </aside>
    </>
  )
}

/* Floor plan: colour per table state. One table seats a walk-in partway through. */
const TABLES = [
  { t: 'T1', st: 'busy', c: 4, a: 1240, m: 38 }, { t: 'T2', st: 'free', c: 2 },
  { t: 'T3', st: 'bill', c: 2, a: 525, m: 52 }, { t: 'T4', st: 'free', c: 4 },
  { t: 'T5', st: 'free', c: 4 }, { t: 'T6', st: 'res', c: 6, r: '8:30 pm' },
  { t: 'T7', st: 'busy', c: 2, a: 273, m: 14 }, { t: 'T8', st: 'free', c: 4 },
  { t: 'T9', st: 'free', c: 2 }, { t: 'T10', st: 'bill', c: 5, a: 1860, m: 61 },
  { t: 'T11', st: 'res', c: 4, r: '9:00 pm' }, { t: 'T12', st: 'busy', c: 2, a: 756, m: 27 },
] as const
const TABLE_LABEL = { busy: 'Occupied', free: 'Free', bill: 'Bill printed', res: 'Reserved' } as const

/* Small line icons for the Tables view, drawn to match ./Icons (24 grid, 1.7 stroke) */
const tv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const TI = {
  Person: () => <svg width="11" height="11" viewBox="0 0 24 24" {...tv}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></svg>,
  Calendar: () => <svg width="11" height="11" viewBox="0 0 24 24" {...tv}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4M8 14h1.5M11.25 14h1.5M14.5 14H16M8 17h1.5M11.25 17h1.5" /></svg>,
  Timer: () => <svg width="13" height="13" viewBox="0 0 24 24" {...tv}><circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5v4l2.5 1.5M9.5 2.5h5M19 6.5l1.5-1.5" /></svg>,
  Seat: () => <svg width="13" height="13" viewBox="0 0 24 24" {...tv}><path d="M6 11V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" /><path d="M3.5 12.5a2 2 0 0 1 4 0V15h9v-2.5a2 2 0 0 1 4 0V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" /><path d="M6 19v2M18 19v2" /></svg>,
  /** a table with a chair either side, the card's corner mark */
  Dining: () => (
    <svg width="26" height="18" viewBox="0 0 34 22" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="4" width="16" height="4.5" rx="2.25" fill="currentColor" fillOpacity={.28} />
      <path d="M13 8.5V20M21 8.5V20" />
      <path d="M2 6v14M2 14h5.5v6M32 6v14M32 14h-5.5v6" />
    </svg>
  ),
}

function TablesView({ k }: { k: number }) {
  const seated = k >= 3                                   // T4 gets a walk-in of 3
  const rows = TABLES.map(t => (t.t === 'T4' && seated ? { t: 'T4', st: 'busy' as const, c: 3, a: 0, m: 0 } : t))
  const busy = rows.filter(t => t.st === 'busy' || t.st === 'bill').length
  return (
    <>
      <main className="app-main av-in" key="tables">
        <div className="ui-head">Tables · Ground floor <span className="sp" /><span className="ui-btn av-cta app-hide-sm"><Icon.Plus size={13} /> Seat walk-in</span></div>
        <div className="app-filters">
          {(['busy', 'free', 'bill', 'res'] as const).map(s => <span key={s} className={`av-legend av-${s}`}><i />{TABLE_LABEL[s]}</span>)}
        </div>
        <div className="av-floor">
          {rows.map(t => (
            <div key={t.t} className={`av-table av-${t.st} ${t.t === 'T4' && seated ? 'av-pop' : ''}`}>
              <b>{t.t}</b>
              <span className="av-table-p"><TI.Person /> {t.c} pax</span>
              <span className="ui-num av-table-v">
                {t.st === 'res' && <TI.Calendar />}
                {'a' in t && t.a ? inr(t.a) : 'r' in t ? t.r : t.st === 'busy' ? 'Just seated' : '—'}
              </span>
              {'m' in t && t.m ? <span className="ui-num av-table-m"><Icon.Clock size={10} /> {t.m}m</span> : null}
              <span className="av-table-i" aria-hidden="true">{t.st === 'bill' ? <Icon.Receipt size={17} /> : <TI.Dining />}</span>
            </div>
          ))}
        </div>
      </main>
      <aside className="app-detail av-in" key="tables-d">
        <div className="ui-head">Floor now</div>
        <div className="app-detail-body av-stack">
          <div className="av-ring" style={{ ['--p' as string]: busy / rows.length }}>
            <span><b className="ui-num">{busy}/{rows.length}</b><em>tables in use</em></span>
          </div>
          <div className="av-rows">
            <div className="av-kv"><span><TI.Seat /> Covers seated</span><b className="ui-num">{seated ? 18 : 15}</b></div>
            <div className="av-kv"><span><TI.Timer /> Avg. table turn</span><b className="ui-num">48m</b></div>
            <div className="av-kv"><span><TI.Calendar /> Next reservation</span><b>T6 · 8:30 pm</b></div>
          </div>
          <div className="av-note"><Icon.Receipt size={13} /> <span>T10 has waited <b>9m</b> for its bill</span></div>
        </div>
      </aside>
    </>
  )
}

/* Sample day for Brewbari Café (made up), not a customer metric. */
const HOURS = [
  ['8a', 18], ['9a', 34], ['10a', 41], ['11a', 37], ['12p', 72], ['1p', 96], ['2p', 81],
  ['3p', 44], ['4p', 39], ['5p', 52], ['6p', 68], ['7p', 88], ['8p', 100], ['9p', 74],
] as const
const CHANNELS = [
  { n: 'Dine-in', v: 46, c: 'var(--blue-500)' }, { n: 'Swiggy', v: 22, c: '#fc8019' },
  { n: 'Zomato', v: 17, c: '#e23744' }, { n: 'Takeaway', v: 9, c: 'var(--green-500)' }, { n: 'QR', v: 6, c: 'var(--yellow-500)' },
]

function ReportsView() {
  return (
    <>
      <main className="app-main av-in" key="reports">
        <div className="ui-head">Reports · Today <span className="sp" /><span className="ui-chip on app-hide-sm">Today</span><span className="ui-chip app-hide-sm">7 days</span></div>
        <div className="av-kpis">
          <div className="av-kpi"><span>Net sales</span><b className="ui-num">₹48,260</b><em className="up">▲ 12%</em></div>
          <div className="av-kpi"><span>Orders</span><b className="ui-num">186</b><em className="up">▲ 8%</em></div>
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
      <aside className="app-detail av-in" key="reports-d">
        <div className="ui-head">Sales by channel</div>
        <div className="app-detail-body av-stack">
          <div className="av-split">{CHANNELS.map(c => <i key={c.n} style={{ flexGrow: c.v, background: c.c }} />)}</div>
          <ul className="av-list">
            {CHANNELS.map(c => <li key={c.n}><span><i style={{ background: c.c }} />{c.n}</span><b className="ui-num">{c.v}%</b></li>)}
          </ul>
          <div className="ui-head av-subhead">Top items</div>
          <ul className="av-list">
            <li><span>Masala Chai</span><b className="ui-num">84</b></li>
            <li><span>Paneer Tikka Roll</span><b className="ui-num">41</b></li>
            <li><span>Cold Coffee</span><b className="ui-num">37</b></li>
          </ul>
        </div>
      </aside>
    </>
  )
}

const STOCK = [
  { n: 'Paneer', on: '4.2 kg', p: 22, st: 'bad', s: 'Runs out Fri', r: 'Reorder 3 kg' },
  { n: 'Cold brew concentrate', on: '12 L', p: 38, st: 'warn', s: 'Low', r: 'Reorder 2 L' },
  { n: 'Sourdough loaf', on: '28 pc', p: 46, st: 'warn', s: 'Low', r: 'Reorder 2 pc' },
  { n: 'Whole milk', on: '42 L', p: 81, st: 'ok', s: 'OK' },
  { n: 'Basmati rice', on: '36 kg', p: 74, st: 'ok', s: 'OK' },
  { n: 'Coffee beans', on: '9.5 kg', p: 63, st: 'ok', s: 'OK' },
] as const

function InventoryView() {
  return (
    <>
      <main className="app-main av-in" key="inventory">
        <div className="ui-head">Inventory · Before tomorrow’s delivery <span className="sp" /></div>
        <div className="av-alert"><Icon.Sparkle size={13} /> 3 items predicted to run out before the next delivery</div>
        <div className="app-table-wrap">
          <table className="ui-table app-table">
            <thead><tr><th>Item</th><th className="r">On hand</th><th className="app-hide-sm">Stock level</th><th>Status</th></tr></thead>
            <tbody>
              {STOCK.map((x, i) => (
                <tr key={x.n}>
                  <td>{x.n}</td>
                  <td className="r ui-num">{x.on}</td>
                  <td className="app-hide-sm"><span className={`av-level av-${x.st}`}><i style={{ width: `${x.p}%`, animationDelay: `${i * 70}ms` }} /></span></td>
                  <td><span className={`tag tag-${x.st}`}><span className="d" />{x.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <aside className="app-detail av-in" key="inventory-d">
        <div className="ui-head">Draft purchase order</div>
        <div className="app-detail-body av-stack">
          <div className="av-kv"><span>Supplier</span><b>Fresh Farms Co.</b></div>
          <ul className="av-list">
            {STOCK.filter(x => 'r' in x).map(x => <li key={x.n}><span>{x.n}</span><b>{'r' in x ? x.r.replace('Reorder ', '') : ''}</b></li>)}
          </ul>
          <div className="av-kv"><span>Est. total</span><b className="ui-num">₹2,140</b></div>
          <span className="ui-btn app-charge"><Icon.Truck size={13} /> Send to supplier</span>
        </div>
      </aside>
    </>
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

/* Demo orders only (Brewbari Café, made up): the online-orders window cycles through these. */
const INCOMING = [
  HERO_INCOMING,
  { id: '#0420', ch: 'zomato' as Channel, ref: 'ZO-55187', items: [{ n: 'Veg Biryani', q: 1, p: 280 }, { n: 'Raita', q: 1, p: 60 }] },
  { id: '#0421', ch: 'qr' as Channel, ref: 'Table 5', items: [{ n: 'Greek Salad', q: 1, p: 240 }, { n: 'Iced Tea', q: 2, p: 110 }] },
]
const ORDER_SECS = 7          // per order: 5s waiting with the ring counting down, 2s accepted

/** Stand-in for Attio's "call" window: new aggregator orders arrive and get accepted, on a loop. */
export function OrderWindow() {
  const s = useSeconds()
  const n = Math.floor(s / ORDER_SECS)
  const k = s % ORDER_SECS
  const o = INCOMING[n % INCOMING.length]
  const accepted = k >= 5
  const secs = 42 - k * 6
  const total = Math.round(o.items.reduce((t, i) => t + i.q * i.p, 0) * 1.05)
  return (
    <div className="win sm fw-card">
      <Bar title="Online orders" />
      <div className="win-pane ui fw-order" key={n}>
        <div className="fw-order-top fw-in">
          <ChannelBadge ch={o.ch} />
          <div>
            <b>New order</b>
            <span className="ui-num muted">{o.ref} · {o.ch === 'qr' ? 'Dine-in' : 'Delivery'}</span>
          </div>
          <span className={`fw-ring ${accepted ? 'is-done' : ''}`} style={{ ['--t' as string]: accepted ? 1 : secs / 42 }}>
            {accepted ? <Icon.Check size={12} /> : <span className="ui-num">0:{String(secs).padStart(2, '0')}</span>}
          </span>
        </div>
        <ul className="fw-lines">
          {o.items.map((i, j) => (
            <li key={i.n} className="fw-in" style={{ animationDelay: `${120 + j * 90}ms` }}><span>{i.q}× {i.n}</span><span className="ui-num">{inr(i.q * i.p)}</span></li>
          ))}
        </ul>
        <div className="fw-order-foot fw-in" style={{ animationDelay: '320ms' }}>
          <span className="muted">Total incl. GST</span>
          <b className="ui-num">{inr(total)}</b>
        </div>
        {accepted
          ? <div className="fw-accepted"><Icon.Check size={13} /> Accepted · KOT sent to kitchen</div>
          : <div className="fw-actions">
              <span className="ui-btn ghost">Reject</span>
              <span className={`ui-btn ok ${k === 4 ? 'is-press' : ''}`}>Accept · prep 15m</span>
            </div>}
      </div>
    </div>
  )
}

/* Demo kitchen tickets: three on the rail at a time, oldest on top. */
const TICKETS = [
  { id: '#0414', ch: 'dine' as Channel, l: ['2× Masala Dosa'] },
  { id: '#0415', ch: 'qr' as Channel, l: ['1× Pav Bhaji', '1× Lassi'] },
  { id: '#0416', ch: 'zomato' as Channel, l: ['1× Veg Biryani'] },
  { id: '#0417', ch: 'dine' as Channel, l: ['1× Aloo Paratha'], f: 'No onion' },
  { id: '#0418', ch: 'swiggy' as Channel, l: ['2× Paneer Tikka Roll', '1× Masala Fries'] },
  { id: '#0419', ch: 'take' as Channel, l: ['3× Cold Coffee'] },
]
const BUMP_SECS = 5           // every 5s the top ticket is bumped and a new one joins the rail
const SLOT_AGE = [372, 228, 41] // seconds already on the rail, per position, when a round starts

/** Stand-in for Attio's "Slack" window: the hot line's kitchen display, live. */
export function KitchenWindow() {
  const s = useSeconds()
  const round = Math.floor(s / BUMP_SECS)
  const k = s % BUMP_SECS
  const shown = [0, 1, 2].map(j => TICKETS[(round + j) % TICKETS.length])
  return (
    <div className="win sm fw-card">
      <Bar title="Kitchen · Hot line" />
      <div className="win-pane ui fw-kds">
        {shown.map((t, j) => {
          const age = SLOT_AGE[j] + k
          const bumped = j === 0 && k === BUMP_SECS - 1
          const st = bumped ? 'done' : age >= 360 ? 'late' : j === 2 ? 'new' : 'cook'
          return (
            <div key={t.id} className={`fw-ticket ${st} ${j === 2 ? 'fw-in' : ''}`}>
              <div className="fw-ticket-h">
                <ChannelBadge ch={t.ch} />
                <span className="ui-num">{t.id}</span>
                <span className="ui-num fw-ticket-t">
                  {bumped ? <><Icon.Check size={11} /> Ready</> : <><Icon.Clock size={11} /> {clock(age)}</>}
                </span>
              </div>
              {t.l.map(x => <div key={x} className="fw-ticket-l">{x}</div>)}
              {t.f && <div className="fw-flag">{t.f}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* The offline scene (claims as in src/content/features.ts: billing, KOTs and cash keep
   running from the device, orders queue locally and reconcile when the link returns). */
const QUEUED = [
  { id: '#0422', w: 'Table 4', a: 240 },
  { id: '#0423', w: 'Takeaway', a: 180 },
  { id: '#0424', w: 'Table 9', a: 410 },
]
const OFFLINE_SECS = 13       // 0-2 online, 2-9 offline (one order queued every 2s), 9-11 syncing, 11-13 synced

/** Stand-in for Attio's terminal window: the terminal riding out an internet outage, on a loop. */
export function OfflineWindow() {
  const k = useSeconds() % OFFLINE_SECS
  const phase = k < 2 ? 'online' : k < 9 ? 'offline' : k < 11 ? 'syncing' : 'synced'
  const queued = phase === 'online' ? 0 : phase === 'offline' ? Math.min(3, Math.floor((k - 2) / 2) + 1) : 3
  const label = {
    online: 'Online · synced',
    offline: 'Offline · billing continues',
    syncing: `Back online · syncing ${queued} orders`,
    synced: `${queued} orders synced · no duplicates`,
  }[phase]
  return (
    <div className="win sm fw-card">
      <Bar title="Counter · Billing" />
      <div className={`win-pane ui fw-off is-${phase}`}>
        <div className="fw-off-s" key={phase}>
          {phase === 'offline' ? <Icon.WifiOff size={13} /> : phase === 'synced' ? <Icon.Check size={13} /> : <Icon.Wifi size={13} />}
          <span>{label}</span>
        </div>
        <ul className="fw-off-log">
          {QUEUED.slice(0, queued).map(o => (
            <li key={o.id} className="fw-in">
              <span className="fw-off-i"><Icon.Receipt size={13} /></span>
              <span className="fw-off-o"><b>{o.w}</b><span className="ui-num">{o.id} · {inr(o.a)} cash</span></span>
              <span className={`tag ${phase === 'offline' ? 'tag-warn' : 'tag-ok'}`}><span className="d" />{phase === 'offline' ? 'KOT printed' : 'Synced'}</span>
            </li>
          ))}
          {phase === 'online' && <li className="fw-off-idle">Waiting for the next order…</li>}
        </ul>
        {phase === 'syncing' && <div className="fw-off-bar"><i /></div>}
        <div className="fw-off-f">
          <span>Queued on device · {phase === 'offline' ? queued : 0}</span>
          <span>{phase === 'offline' ? 'UPI · card paused' : 'All payments on'}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * The GST bill for Table 7 inside the app's Table 7 panel, displayed from the bill
 * step (.hs.s3): the paper feeds out of the print slot in short jerks, then a PAID
 * stamp lands. Same table, items and total as the app window.
 */
export function ReceiptWindow() {
  return (
    <div className="pr pr-docked">
      <div className="pr-frame">
        <div className="pr-head">
          <span className="pr-mark">B</span>
          <span className="pr-where">
            <b>Brewbari Café</b>
            <span>Hauz Khas Village, New Delhi</span>
          </span>
          <span className="pr-led" aria-hidden="true" />
        </div>
        <div className="pr-slot" aria-hidden="true" />
        <div className="pr-out">
          <div className="pr-paper">
            <div className="pr-sec pr-hi"><b>Table 7, here’s your bill</b><Icon.Download size={12} /></div>
            <div className="pr-sec pr-amt">
              <div><span>Amount</span><b className="ui-num">₹273.00 <em>(UPI)</em></b></div>
              <div className="r"><b>12 Nov, 1:42pm</b><b>3 items</b></div>
            </div>
            <div className="pr-sec pr-tail">
              <div><span>Bill no.</span><b className="ui-num">INV/0418</b></div>
              <div className="pr-stamp" aria-hidden="true"><span>PAID</span></div>
              <div className="r"><span>CGST + SGST</span><b className="ui-num">₹13.00</b></div>
            </div>
            <span className="pr-pill">See full bill</span>
          </div>
        </div>
      </div>
    </div>
  )
}

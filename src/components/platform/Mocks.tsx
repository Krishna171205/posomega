'use client'
import { Fragment, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '../Icons'
import { ChannelBadge } from '../hero/HeroScene'
import { CHANNEL_LABEL, DAY_END, FLOOR, HERO_INCOMING, KDS, MENU, QUEUE, RECIPE, STOCK, type Channel, type KdsTicket, type QueueItem } from '@/content/home'

const inr = (n: number, d = 0) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })

/**
 * Wrap mocks in <BareMocks value> to render them as screens inside a shared app
 * frame: no window chrome of their own, just a page header and the content.
 */
const Bare = createContext(false)
export const BareMocks = Bare.Provider

export function MockWindow({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  const bare = useContext(Bare)
  if (bare) {
    return (
      <div className="mock mock-bare">
        <div className="mock-h"><b>{title}</b>{right}</div>
        <div className="win-pane ui">{children}</div>
      </div>
    )
  }
  return (
    <div className="win mock">
      <div className="win-bar">
        <div className="win-dots"><span /><span /><span /></div>
        <div className="win-title">{title}</div>
        {right}
      </div>
      <div className="win-pane ui">{children}</div>
    </div>
  )
}

/* ── Front of house: billing ─────────────────────────────── */
export function BillingMock() {
  const [cart, setCart] = useState<Record<number, number>>({ 1: 2, 4: 1 })
  const [pay, setPay] = useState('UPI')
  const [paid, setPaid] = useState(false)
  const lines = MENU.filter(m => cart[m.id])
  const sub = lines.reduce((s, m) => s + m.price * cart[m.id], 0)
  const half = Math.round(sub * 0.025 * 100) / 100

  useEffect(() => {
    if (!paid) return
    const t = window.setTimeout(() => { setPaid(false); setCart({}) }, 2200)
    return () => window.clearTimeout(t)
  }, [paid])

  const add = (id: number) => { setPaid(false); setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 })) }
  const dec = (id: number) => setCart(c => {
    const n = { ...c }
    if (n[id] > 1) n[id] -= 1; else delete n[id]
    return n
  })

  return (
    <MockWindow title="Orders · Table 7">
      <div className="bill">
        <div className="bill-menu">
          {MENU.map(m => (
            <button key={m.id} className="bill-item" onClick={() => add(m.id)} aria-label={`Add ${m.name}`}>
              <span className="bill-thumb" style={{ background: m.tone }}>
                {m.img && <img src={m.img} alt="" loading="lazy" decoding="async" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                {cart[m.id] ? <span className="bill-q ui-num">{cart[m.id]}</span> : null}
              </span>
              <span className="bill-name">{m.name}</span>
              <span className="ui-num muted">{inr(m.price)}</span>
            </button>
          ))}
        </div>
        <div className="bill-cart">
          <div className="bill-cart-h"><b>Table 7</b><span className="muted">2 covers</span></div>
          <ul className="bill-lines">
            {lines.length === 0 && <li className="muted bill-empty">Tap an item to add it</li>}
            {lines.map(m => (
              <li key={m.id}>
                <button className="bill-dec" onClick={() => dec(m.id)} aria-label={`Remove one ${m.name}`}>−</button>
                <span>{cart[m.id]}× {m.name}</span>
                <span className="ui-num">{inr(m.price * cart[m.id])}</span>
              </li>
            ))}
          </ul>
          <div className="app-sum">
            <div><span>Subtotal</span><span className="ui-num">{inr(sub)}</span></div>
            <div><span>CGST 2.5%</span><span className="ui-num">{inr(half, 2)}</span></div>
            <div><span>SGST 2.5%</span><span className="ui-num">{inr(half, 2)}</span></div>
            <div className="tot"><span>Total</span><span className="ui-num">{inr(sub + half * 2, 2)}</span></div>
          </div>
          <div className="seg seg-xs" role="tablist" aria-label="Payment method">
            {['UPI', 'Card', 'Cash', 'Split'].map(p => (
              <button key={p} role="tab" aria-selected={pay === p} onClick={() => setPay(p)}>{p}</button>
            ))}
          </div>
          {paid
            ? <span className="app-paid" style={{ display: 'flex' }}><Icon.Check size={13} /> Paid via {pay} · bill printed</span>
            : <button className="ui-btn bill-charge" disabled={sub === 0} onClick={() => setPaid(true)}>Charge {inr(sub + half * 2, 2)}</button>}
        </div>
      </div>
    </MockWindow>
  )
}

/* ── Front of house: floor ───────────────────────────────── */
const FLOOR_LABEL = { free: 'Free', seated: 'Seated', reserved: 'Reserved', bill: 'Bill asked' }
export function FloorMock() {
  const [sel, setSel] = useState(5)
  const t = FLOOR.find(x => x.n === sel)!
  return (
    <MockWindow title="Tables">
      <div className="floor">
        <div className="floor-grid">
          {[['Main floor', FLOOR.slice(0, 12)], ['Terrace', FLOOR.slice(12)]].map(([zone, tables]) => (
            <Fragment key={zone as string}>
              <span className="floor-zone">{zone as string}</span>
              {(tables as typeof FLOOR).map(x => (
                <button key={x.n} className={`floor-t st-${x.s} ${sel === x.n ? 'sel' : ''}`} onClick={() => setSel(x.n)} aria-pressed={sel === x.n}>
                  <b>T{x.n}</b>
                  <span>{x.s === 'free' ? 'Free' : x.s === 'reserved' ? x.t : `${x.covers} · ${x.t}`}</span>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="floor-side">
          <div className="floor-side-h"><b>Table {t.n}</b><span className={`tag ${t.s === 'bill' ? 'tag-warn' : t.s === 'seated' ? 'tag-info' : ''}`}>{FLOOR_LABEL[t.s]}</span></div>
          <dl className="floor-dl">
            <div><dt>Covers</dt><dd>{t.covers ?? '-'}</dd></div>
            <div><dt>{t.s === 'reserved' ? 'Booked for' : 'Seated'}</dt><dd className="ui-num">{t.t ?? '-'}</dd></div>
            <div><dt>Captain</dt><dd>{t.captain ?? '-'}</dd></div>
            <div><dt>KOTs sent</dt><dd className="ui-num">{t.kots ?? '-'}</dd></div>
            <div><dt>Running bill</dt><dd className="ui-num">{t.amt ? inr(t.amt) : '-'}</dd></div>
          </dl>
          <div className="floor-actions">
            <span className="ui-btn ghost">Merge</span>
            <span className="ui-btn ghost">Split</span>
            <span className="ui-btn">{t.s === 'free' ? 'Seat guests' : 'Open order'}</span>
          </div>
          <div className="floor-legend">
            {(['free', 'seated', 'reserved', 'bill'] as const).map(k => <span key={k}><i className={`st-${k}`} />{FLOOR_LABEL[k]}</span>)}
          </div>
        </div>
      </div>
    </MockWindow>
  )
}

/* ── Kitchen display ─────────────────────────────────────── */
type Col = 'new' | 'cooking' | 'ready'
export function KdsMock() {
  const start = () => KDS.map((k, i) => ({ ...k, col: (i < 2 ? 'new' : i < 4 ? 'cooking' : 'ready') as Col }))
  const [tickets, setTickets] = useState(start)
  const [station, setStation] = useState<'All' | KdsTicket['station']>('All')
  const [served, setServed] = useState(0)
  const bump = (id: string) => {
    const t = tickets.find(x => x.id === id)
    if (!t) return
    if (t.col === 'ready') {
      setServed(s => s + 1)
      setTickets(ts => ts.filter(x => x.id !== id))
    } else {
      setTickets(ts => ts.map(x => x.id === id ? { ...x, col: x.col === 'new' ? 'cooking' : 'ready' } : x))
    }
  }
  const visible = tickets.filter(t => station === 'All' || t.station === station)
  const cols: { k: Col; label: string }[] = [{ k: 'new', label: 'New' }, { k: 'cooking', label: 'Cooking' }, { k: 'ready', label: 'Ready' }]
  return (
    <MockWindow
      title="Kitchen display"
      right={<span className="win-right ui-num">Served {served}</span>}
    >
      <div className="kds-top">
        <div className="seg seg-xs" role="tablist" aria-label="Station">
          {(['All', 'Hot', 'Cold', 'Bar'] as const).map(s => (
            <button key={s} role="tab" aria-selected={station === s} onClick={() => setStation(s)}>{s}</button>
          ))}
        </div>
        {tickets.length === 0 && <button className="ui-btn ghost" onClick={() => { setTickets(start()); setServed(0) }}>Reset</button>}
      </div>
      <div className="kds">
        {cols.map(c => (
          <div key={c.k} className="kds-col">
            <div className="kds-col-h">{c.label} <span className="ui-num muted">{visible.filter(t => t.col === c.k).length}</span></div>
            {visible.filter(t => t.col === c.k).map(t => (
              <div key={t.id} className={`kds-t ${c.k} ${t.mins >= 6 ? 'late' : ''}`}>
                <div className="fw-ticket-h">
                  <ChannelBadge ch={t.ch} />
                  <span className="ui-num">{t.id}</span>
                  <span className="ui-num fw-ticket-t"><Icon.Clock size={11} /> {t.mins}m</span>
                </div>
                <div className="kds-where muted">{t.where} · {t.station}</div>
                {t.items.map(x => <div key={x} className="fw-ticket-l">{x}</div>)}
                {t.flag && <div className="fw-flag">{t.flag}</div>}
                <button className="kds-bump" onClick={() => bump(t.id)}>{c.k === 'ready' ? 'Served' : 'Bump'} <Icon.Arrow size={11} /></button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </MockWindow>
  )
}

/* ── Back of house: stock ────────────────────────────────── */
export function StockMock() {
  const [ordered, setOrdered] = useState<Record<string, boolean>>({})
  return (
    <MockWindow title="Inventory · Before tomorrow’s delivery">
      <div className="stock-banner"><Icon.Sparkle size={13} /> 3 items running low before the next delivery</div>
      <div className="app-table-wrap">
        <table className="ui-table">
          <thead><tr><th>Item</th><th className="r">On hand</th><th className="hide-xs">Cover</th><th>Status</th><th /></tr></thead>
          <tbody>
            {STOCK.map(s => {
              const short = s.onHand < s.need
              const pct = Math.min(100, (s.daysLeft / 5) * 100)
              return (
                <tr key={s.name}>
                  <td><b className="stock-n">{s.name}</b><span className="stock-note muted">{s.note}</span></td>
                  <td className="r ui-num">{s.onHand} {s.unit}</td>
                  <td className="hide-xs"><span className="stock-bar"><i className={short ? (s.daysLeft < 1 ? 'bad' : 'warn') : ''} style={{ width: pct + '%' }} /></span><span className="ui-num muted">{s.daysLeft}d</span></td>
                  <td>{short ? <span className={`tag ${s.daysLeft < 1 ? 'tag-bad' : 'tag-warn'}`}>{s.daysLeft < 1 ? 'Runs out' : 'Low'}</span> : <span className="tag tag-ok">OK</span>}</td>
                  <td className="r">
                    {short && (ordered[s.name]
                      ? <span className="tag tag-info"><Icon.Check size={11} /> Ordered</span>
                      : <button className="ui-btn ghost stock-btn" onClick={() => setOrdered(o => ({ ...o, [s.name]: true }))}>Reorder {Math.ceil(s.need - s.onHand)} {s.unit}</button>)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="stock-po">
        <span><b>Draft purchase order</b><span className="muted"> · Azadpur Fresh Co. · 3 items · delivery tomorrow 8 am</span></span>
        <b className="ui-num">{inr(2140)}</b>
        <button className="ui-btn stock-btn" onClick={() => setOrdered({ Paneer: true, 'Cold brew concentrate': true, 'Sourdough loaf': true })}>
          {Object.keys(ordered).length >= 3 ? <><Icon.Check size={11} /> Sent</> : 'Send to supplier'}
        </button>
      </div>
    </MockWindow>
  )
}

/* ── Back of house: recipe cost ──────────────────────────── */
export function RecipeMock() {
  const cost = RECIPE.lines.reduce((s, l) => s + l.c, 0)
  const pct = (cost / RECIPE.price) * 100
  return (
    <MockWindow title={`Recipe · ${RECIPE.dish}`}>
      <div className="recipe">
        <div className="recipe-head">
          <div><span className="muted">Menu price</span><b className="ui-num">{inr(RECIPE.price)}</b></div>
          <div><span className="muted">Plate cost</span><b className="ui-num">{inr(cost)}</b></div>
          <div><span className="muted">Food cost</span><b className="ui-num">{pct.toFixed(1)}%</b></div>
        </div>
        <ul className="recipe-lines">
          {RECIPE.lines.map(l => (
            <li key={l.n}>
              <span className="recipe-dot" />
              <span className="recipe-n">{l.n}</span>
              <span className="ui-num muted">{l.q}</span>
              <span className="recipe-bar"><i style={{ width: (l.c / cost) * 100 + '%' }} /></span>
              <span className="ui-num">{inr(l.c)}</span>
            </li>
          ))}
        </ul>
        <div className="recipe-foot">
          <span>Each sale deducts these quantities from stock.</span>
          <span className="tag">Theoretical vs counted, in ₹</span>
        </div>
      </div>
    </MockWindow>
  )
}

/* ── Online orders: accept a Swiggy order, it joins the one queue ── */
const QTAG = { Preparing: 'tag-warn', Ready: 'tag-ok', 'Picked up': '' } as const
export function ChannelsMock() {
  // A 10-second loop: the order waits with its timer running, is accepted at 5s (or when
  // clicked), sits in the queue, then the next one arrives.
  const [t, setT] = useState(0)
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setT(x => (x + 1) % 10), 1000)
    return () => window.clearInterval(id)
  }, [])
  useEffect(() => { if (t === 0) setClicked(false) }, [t])
  const accepted = clicked || t >= 5
  const o = HERO_INCOMING
  const total = Math.round(o.items.reduce((s, i) => s + i.q * i.p, 0) * 1.05)
  const secs = 45 - Math.min(t, 5) * 7
  const rows: QueueItem[] = accepted
    ? [{ id: o.id, ch: o.ch, items: o.items.map(i => `${i.q}× ${i.n}`).join(', '), prep: '15 min', status: 'Preparing' }, ...QUEUE]
    : QUEUE
  return (
    <MockWindow
      title="Online orders"
      right={<span className="onl-chips"><span className="ui-chip on">All {rows.length}</span><span className="ui-chip">Swiggy</span><span className="ui-chip">Zomato</span></span>}
    >
      <div className="onl">
        {!accepted ? (
          <div className="onl-new" key="new">
            <ChannelBadge ch={o.ch} />
            <div className="onl-new-b">
              <b>New order <span className="ui-num muted">{o.ref} · Delivery</span></b>
              <span className="onl-new-i">{o.items.map(i => `${i.q}× ${i.n}`).join(', ')}</span>
            </div>
            <b className="ui-num onl-new-t">{inr(total)}</b>
            <span className="fw-ring" style={{ ['--t' as string]: secs / 45 }}><span className="ui-num">0:{String(secs).padStart(2, '0')}</span></span>
            <span className="ui-btn ghost onl-btn">Reject</span>
            <button className="ui-btn ok onl-btn" onClick={() => setClicked(true)}>Accept · prep 15m</button>
          </div>
        ) : (
          <div className="onl-done" key="done" role="status">
            <Icon.Check size={13} /> {o.id} accepted · KOT #31 sent to the hot line, #32 to the bar
          </div>
        )}
        <ul className="onl-q">
          {rows.map(q => (
            <li key={q.id} className={q.id === o.id ? 'is-new' : ''}>
              <ChannelBadge ch={q.ch} />
              <span className="ui-num">{q.id}</span>
              <span className="onl-q-i">{q.items}</span>
              <span className={`tag ${QTAG[q.status]}`}><span className="d" />{q.status}</span>
              <span className="ui-num muted onl-q-t">{q.prep}</span>
            </li>
          ))}
        </ul>
        <p className="onl-note muted">{CHANNEL_LABEL.swiggy} and {CHANNEL_LABEL.zomato} orders sit in the same queue as dine-in and QR.</p>
      </div>
    </MockWindow>
  )
}

/* ── Reports: day end ────────────────────────────────────── */
const DAY_HOURS = [['9a', 22], ['10a', 34], ['11a', 41], ['12p', 72], ['1p', 96], ['2p', 81], ['3p', 44], ['4p', 39], ['5p', 52], ['6p', 68], ['7p', 88], ['8p', 100], ['9p', 74], ['10p', 38]] as const
export function DayEndMock() {
  const [exported, setExported] = useState(false)
  const net = DAY_END.gross - DAY_END.discounts
  const taxable = Math.round(net / 1.05)
  const half = Math.round(((net - taxable) / 2) * 100) / 100
  const payTotal = useMemo(() => DAY_END.pay.reduce((s, p) => s + p.v, 0), [])
  return (
    <MockWindow title={`Day end · ${DAY_END.date}`}>
      <div className="dayend">
        <div className="dayend-kpis">
          <div><span className="muted">Gross</span><b className="ui-num">{inr(DAY_END.gross)}</b></div>
          <div><span className="muted">Discounts</span><b className="ui-num">−{inr(DAY_END.discounts)}</b></div>
          <div><span className="muted">CGST</span><b className="ui-num">{inr(half, 2)}</b></div>
          <div><span className="muted">SGST</span><b className="ui-num">{inr(half, 2)}</b></div>
        </div>
        <div className="dayend-mix">
          <div className="dayend-bar">
            {DAY_END.pay.map((p, i) => <i key={p.k} className={`c${i}`} style={{ width: (p.v / payTotal) * 100 + '%' }} />)}
          </div>
          <ul className="dayend-legend">
            {DAY_END.pay.map((p, i) => <li key={p.k}><i className={`c${i}`} />{p.k}<span className="ui-num">{inr(p.v)}</span></li>)}
          </ul>
        </div>
        <div className="dayend-hours">
          <div className="dayend-sub">Sales by hour <span className="muted">· lunch and dinner peaks</span></div>
          <div className="dayend-bars">
            {DAY_HOURS.map(([h, v], i) => (
              <div key={h}><i style={{ height: `${v}%`, animationDelay: `${i * 40}ms` }} className={v >= 80 ? 'hot' : ''} /><span>{h}</span></div>
            ))}
          </div>
        </div>
        <div className="dayend-disc">
          <div className="dayend-sub">Discounts, with a name and a reason</div>
          {DAY_END.discountNotes.map(d => (
            <div key={d.who} className="dayend-row"><span>{d.who}</span><span className="muted">{d.why}</span><span className="ui-num">−{inr(d.amt)}</span></div>
          ))}
        </div>
        <div className="dayend-foot">
          <span className="tag tag-ok"><Icon.Check size={11} /> UPI matched to bills</span>
          <button className="ui-btn" onClick={() => setExported(true)}>
            {exported ? <><Icon.Check size={12} /> Tally export ready</> : <><Icon.Download size={12} /> Export for accountant</>}
          </button>
        </div>
      </div>
    </MockWindow>
  )
}

'use client'
import { Icon } from '../Icons'
import { Bar, KitchenWindow, OfflineWindow, OrderWindow, inr, useSeconds } from '../hero/HeroScene'
import type { Mock } from '@/content/types'

/*
 * Looping product scenes for the outlet pages (/for/*). Same window chrome and
 * clock as the homepage hero, so every page reads as the same product. Each scene
 * shows a feature that ships today; names, items and amounts are made up.
 */

const withGst = (n: number) => Math.round(n * 1.05)

function CounterMock({ m }: { m: Extract<Mock, { kind: 'counter' }> }) {
  const s = useSeconds()
  const n = m.items.length
  const L = n + 4
  const k = s % L
  const price = (p: number) => (m.happy ? Math.round(p * 0.8) : p)
  const shown = m.items.slice(0, Math.min(k + 1, n))
  const total = withGst(shown.reduce((t, i) => t + price(i.p), 0))
  const paid = k >= n + 2
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-pane" key={Math.floor(s / L)}>
        {m.happy && <div className="om-note om-note-warn"><Icon.Clock size={12} /> Happy hour on · 20% off till 8 PM</div>}
        <ul className="om-bill">
          {shown.map(i => (
            <li key={i.n} className="fw-in">
              <span className="om-bill-n"><b>{i.n}</b>{i.mod && <em>{i.mod}</em>}</span>
              <span className="ui-num">{m.happy && <s>{inr(i.p)}</s>} {inr(price(i.p))}</span>
            </li>
          ))}
        </ul>
        <div className="fw-order-foot"><span className="muted">Total incl. GST</span><b className="ui-num">{inr(total)}</b></div>
        {paid
          ? <div className="fw-accepted"><Icon.Check size={13} /> Paid · UPI · KOT sent</div>
          : <span className={`ui-btn om-wide ${k === n + 1 ? 'is-press' : ''}`}>Charge {inr(total)}</span>}
      </div>
    </div>
  )
}

function TokenMock({ m }: { m: Extract<Mock, { kind: 'token' }> }) {
  const step = Math.floor(useSeconds() / 2)
  const tok = (i: number) => m.start + ((step + i) % 80)
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-tokens">
        <div className="om-tok-col">
          <span className="om-tok-h">Preparing</span>
          {[3, 4, 5].map(i => <span key={tok(i)} className="om-tok fw-in">{tok(i)}</span>)}
        </div>
        <div className="om-tok-col is-ready">
          <span className="om-tok-h">Ready to collect</span>
          {[2, 1, 0].map(i => <span key={tok(i)} className={`om-tok ${i === 2 ? 'is-new fw-in' : ''}`}>{tok(i)}</span>)}
        </div>
      </div>
    </div>
  )
}

type TState = 'free' | 'busy' | 'bill' | 'call'
const FLOOR: { n: string; s: TState }[] = [
  { n: 'T1', s: 'busy' }, { n: 'T2', s: 'free' }, { n: 'T3', s: 'busy' }, { n: 'T4', s: 'free' },
  { n: 'T5', s: 'busy' }, { n: 'T6', s: 'busy' }, { n: 'T7', s: 'free' }, { n: 'T8', s: 'busy' },
]
const FLOOR_SECS = 12 // 0-4 quiet, 4-8 T3 calls a waiter, 8-10 acknowledged, 10-12 T6 pays at the table

function FloorMock({ m }: { m: Extract<Mock, { kind: 'floor' }> }) {
  const k = useSeconds() % FLOOR_SECS
  const state = (t: { n: string; s: TState }): TState =>
    t.n === 'T3' && k >= 4 && k < 8 ? 'call' : t.n === 'T6' && k >= 10 ? 'bill' : t.s
  const note =
    k >= 4 && k < 8 ? { c: 'om-note-warn', t: 'Table 3 · Call waiter' }
    : k >= 8 && k < 10 ? { c: 'om-note-ok', t: 'Captain on the way to Table 3' }
    : k >= 10 ? { c: 'om-note-info', t: 'Table 6 paid at the table · UPI' }
    : null
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-pane">
        <div className="om-floor">
          {FLOOR.map(t => {
            const st = state(t)
            return <span key={t.n} className={`om-table is-${st}`}>{st === 'call' ? <Icon.Mic size={12} /> : null}{t.n}</span>
          })}
        </div>
        <div className="om-note-slot">{note && <div key={note.t} className={`om-note ${note.c}`}>{note.t}</div>}</div>
      </div>
    </div>
  )
}

function QrMock({ m }: { m: Extract<Mock, { kind: 'qr' }> }) {
  const s = useSeconds()
  const n = m.items.length
  const L = n + 4
  const k = s % L
  const shown = m.items.slice(0, Math.min(k + 1, n))
  const sent = k >= n + 2
  return (
    <div className="om-phone">
      <div className="om-phone-top"><b>{m.outlet}</b><span className="muted">Scan & order · Table 12</span></div>
      <div className="ui om-pane" key={Math.floor(s / L)}>
        <ul className="om-bill">
          {shown.map(i => (
            <li key={i.n} className="fw-in"><span className="om-bill-n"><b>{i.n}</b></span><span className="ui-num">{inr(i.p)}</span></li>
          ))}
        </ul>
        {sent
          ? <div className="fw-accepted"><Icon.Check size={13} /> Order sent to the kitchen</div>
          : <span className={`ui-btn om-wide ${k === n + 1 ? 'is-press' : ''}`}>Place order · {inr(withGst(shown.reduce((t, i) => t + i.p, 0)))}</span>}
      </div>
    </div>
  )
}

function LoyaltyMock({ m }: { m: Extract<Mock, { kind: 'loyalty' }> }) {
  const k = useSeconds() % 7 // 0-1 lookup, 2 found, 3 stamp lands, 5-6 reward line
  const filled = k >= 3 ? m.stamps - 1 : m.stamps - 2
  return (
    <div className="win sm fw-card">
      <Bar title="Customer · Loyalty" />
      <div className="win-pane ui om-pane">
        <div className="om-cust">
          <span className="om-avatar"><Icon.Phone size={13} /></span>
          <div><b className="ui-num">{k < 2 ? '98•• ••' : '98•• •• 4210'}</b><span className="muted">{k < 2 ? 'Looking up…' : 'Ananya · regular since March'}</span></div>
        </div>
        <div className="om-stamps" style={{ gridTemplateColumns: `repeat(${m.stamps}, 1fr)` }}>
          {Array.from({ length: m.stamps }, (_, i) => (
            <span key={i} className={`om-stamp ${i < filled ? 'is-on' : ''} ${i === filled - 1 && k === 3 ? 'is-new' : ''}`}>
              {i === m.stamps - 1 ? <Icon.Sparkle size={11} /> : i < filled ? <Icon.Check size={11} /> : null}
            </span>
          ))}
        </div>
        <div className="om-note-slot">
          {k >= 5 && <div className="om-note om-note-ok">+12 coins · 1 stamp to a free {m.item}</div>}
        </div>
      </div>
    </div>
  )
}

function StockMock({ m }: { m: Extract<Mock, { kind: 'stock' }> }) {
  const sales = Math.floor(useSeconds() / 2) % 6
  return (
    <div className="win sm fw-card">
      <Bar title="Inventory · Recipe usage" />
      <div className="win-pane ui om-pane">
        <div className="om-note om-note-info" key={sales}><Icon.Receipt size={12} /> Sold {sales + 1}× {m.sold}</div>
        <ul className="om-stock">
          {m.uses.map(u => {
            const left = u.left - u.q * (sales + 1)
            const low = left <= u.par
            return (
              <li key={u.n}>
                <span className="om-stock-n"><b>{u.n}</b><span className="muted ui-num">−{u.q}{u.unit} each</span></span>
                <span className="om-meter"><i style={{ width: `${Math.max(4, (left / u.left) * 100)}%` }} className={low ? 'is-low' : ''} /></span>
                <span className={`ui-num om-stock-l ${low ? 'is-low' : ''}`}>{low ? 'Low · reorder' : `${left}${u.unit}`}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function PreorderMock({ m }: { m: Extract<Mock, { kind: 'preorder' }> }) {
  const s = useSeconds()
  const L = m.orders.length * 2 + 3
  const shown = Math.min(m.orders.length, Math.floor((s % L) / 2) + 1)
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-pane" key={Math.floor(s / L)}>
        <ul className="om-rows">
          {m.orders.slice(0, shown).map((o, i) => (
            <li key={o.n} className="fw-in">
              <span className="om-time ui-num">{o.t}</span>
              <span className="om-rows-n"><b>{o.n}</b><span className="muted">{o.who} · paid online</span></span>
              {i === shown - 1 && <span className="tag tag-info"><span className="d" />New</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const DELIVERY_STEPS = ['Order accepted', 'Rider assigned · Ravi', 'Picked up', 'Delivered']

function DeliveryMock({ m }: { m: Extract<Mock, { kind: 'delivery' }> }) {
  const k = useSeconds() % 10
  const at = Math.min(3, Math.floor(k / 2))
  return (
    <div className="win sm fw-card">
      <Bar title="Deliveries" />
      <div className="win-pane ui om-pane">
        <div className="om-cust">
          <span className="om-avatar"><Icon.Truck size={13} /></span>
          <div><b>{m.order}</b><span className="muted">{m.area} · {at < 3 ? `ETA ${18 - at * 5} min` : 'Done'}</span></div>
        </div>
        <ol className="om-steps">
          {DELIVERY_STEPS.map((t, i) => (
            <li key={t} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}>
              <span className="om-step-d">{i <= at ? <Icon.Check size={10} /> : null}</span>{t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function ReserveMock({ m }: { m: Extract<Mock, { kind: 'reserve' }> }) {
  const k = useSeconds() % 9 // 0-3 waiting, 3-6 a table frees up, 6-9 the party is seated
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-pane">
        <ul className="om-rows">
          <li><span className="om-time ui-num">7:30</span><span className="om-rows-n"><b>Mehra · 4 guests</b><span className="muted">Window side, birthday</span></span><span className="tag tag-ok"><span className="d" />Confirmed</span></li>
          <li><span className="om-time ui-num">8:00</span><span className="om-rows-n"><b>Kapoor · 2 guests</b><span className="muted">Booked by phone</span></span><span className="tag tag-ok"><span className="d" />Confirmed</span></li>
          <li className={k >= 6 ? 'is-hl' : ''}>
            <span className="om-time ui-num">Walk-in</span>
            <span className="om-rows-n"><b>Singh · 6 guests</b><span className="muted">{k < 3 ? 'Waitlist · 15 min' : k < 6 ? 'T8 is free' : 'Seated at T8'}</span></span>
            <span key={k < 3 ? 'w' : k < 6 ? 'f' : 's'} className={`tag fw-in ${k < 3 ? 'tag-warn' : k < 6 ? 'tag-info' : 'tag-ok'}`}><span className="d" />{k < 3 ? 'Waiting' : k < 6 ? 'Table free' : 'Seated'}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function BarsMock({ m }: { m: Extract<Mock, { kind: 'bars' }> }) {
  const round = Math.floor(useSeconds() / 8)
  const max = Math.max(...m.rows.map(r => r.v))
  return (
    <div className="win sm fw-card">
      <Bar title={m.title} />
      <div className="win-pane ui om-pane" key={round}>
        <span className="muted om-cap">{m.caption}</span>
        <ul className="om-hbars">
          {m.rows.map((r, i) => (
            <li key={r.l}>
              <span className="om-hbar-l">{r.l}</span>
              <span className="om-hbar"><i style={{ ['--w' as string]: `${(r.v / max) * 100}%`, animationDelay: `${i * 90}ms` }} /></span>
              <span className="ui-num">{inr(r.v)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function MockView({ m }: { m: Mock }) {
  switch (m.kind) {
    case 'counter': return <CounterMock m={m} />
    case 'kds': return <KitchenWindow title={m.title} tickets={m.tickets} />
    case 'orders': return <OrderWindow title={m.title} />
    case 'offline': return <OfflineWindow />
    case 'token': return <TokenMock m={m} />
    case 'floor': return <FloorMock m={m} />
    case 'qr': return <QrMock m={m} />
    case 'loyalty': return <LoyaltyMock m={m} />
    case 'stock': return <StockMock m={m} />
    case 'preorder': return <PreorderMock m={m} />
    case 'delivery': return <DeliveryMock m={m} />
    case 'reserve': return <ReserveMock m={m} />
    case 'bars': return <BarsMock m={m} />
  }
}

'use client'
import { useEffect, useState } from 'react'
import { Icon } from '../Icons'
import { CHANNEL_LABEL, CHANNEL_MARK, HERO_INCOMING, type Channel } from '@/content/home'

/*
 * The small self-looping windows the outlet pages (/for/*) use: an online-orders window,
 * a kitchen rail and the offline counter. They began as the homepage hero's side windows;
 * the hero now tells one order's story with its own cards (hero/HeroScene.tsx), so these
 * live here, unchanged, for the outlet scenes in Mocks.tsx.
 */

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/**
 * A seconds counter that drives each side window's own loop, the way every small
 * window on attio.com plays its own scene. Frozen at 0 for reduced motion.
 */
export function useSeconds() {
  const [s, setS] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setS(x => x + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return s
}
export const clock = (secs: number) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`

export function ChannelBadge({ ch }: { ch: Channel }) {
  return <span className={`ch-badge ch-${ch}`} aria-label={CHANNEL_LABEL[ch]}>{CHANNEL_MARK[ch]}</span>
}

export function Bar({ title }: { title: string }) {
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
export function OrderWindow({ orders = INCOMING, title = 'Online orders' }: { orders?: typeof INCOMING; title?: string } = {}) {
  const s = useSeconds()
  const n = Math.floor(s / ORDER_SECS)
  const k = s % ORDER_SECS
  const o = orders[n % orders.length]
  const accepted = k >= 5
  const secs = 42 - k * 6
  const total = Math.round(o.items.reduce((t, i) => t + i.q * i.p, 0) * 1.05)
  return (
    <div className="win sm fw-card">
      <Bar title={title} />
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
export type KdsTicket = { id: string; ch: Channel; l: string[]; f?: string }

export function KitchenWindow({ tickets = TICKETS, title = 'Kitchen · Hot line' }: { tickets?: KdsTicket[]; title?: string } = {}) {
  const s = useSeconds()
  const round = Math.floor(s / BUMP_SECS)
  const k = s % BUMP_SECS
  const shown = [0, 1, 2].map(j => tickets[(round + j) % tickets.length])
  return (
    <div className="win sm fw-card">
      <Bar title={title} />
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

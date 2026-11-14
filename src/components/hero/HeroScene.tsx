'use client'
import { useEffect, useState } from 'react'
import { Icon } from '../Icons'
import { CHANNEL_LABEL, CHANNEL_MARK, HERO_INCOMING, HERO_ORDERS, type Channel } from '@/content/home'

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export function ChannelBadge({ ch }: { ch: Channel }) {
  return <span className={`ch-badge ch-${ch}`} aria-label={CHANNEL_LABEL[ch]}>{CHANNEL_MARK[ch]}</span>
}

function StatusTag({ s }: { s: string }) {
  const cls = s === 'Ready' ? 'tag-ok' : s === 'New' ? 'tag-info' : s === 'Cooking' ? 'tag-warn' : ''
  return <span className={`tag ${cls}`}><span className="d" />{s}</span>
}

const INCOMING_TOTAL = Math.round(HERO_INCOMING.items.reduce((s, i) => s + i.q * i.p, 0) * 1.05)
const TABLE7 = { sub: 260, gst: 13, total: 273 }

/**
 * The Omega app inside the hero window shell. Pure markup: the stage toggles
 * .s1/.s2/.s3 on an ancestor and CSS reveals what each docked window "brought in".
 */
export function AppWindow() {
  return (
    <div className="app ui">
      <aside className="app-side">
        <div className="app-outlet">
          <span className="app-outlet-mark">D</span>
          <span className="app-outlet-name">
            <b>Demo Café</b>
            <span>HSR Layout</span>
          </span>
          <Icon.ChevronDown size={11} />
        </div>
        <div className="app-search"><Icon.Search /> Search <span className="kbd">⌘K</span></div>
        <nav className="app-nav">
          <span className="app-nav-item on"><Icon.Grid size={14} /> Orders <em className="ui-num">7</em></span>
          <span className="app-nav-item"><Icon.Table size={14} /> Tables</span>
          <span className="app-nav-item app-nav-kitchen">
            <Icon.Flame size={14} /> Kitchen
            <em className="ui-num"><span className="n0">4</span><span className="n1">5</span></em>
          </span>
          <span className="app-nav-item"><Icon.Box size={14} /> Inventory <i className="warn-dot" /></span>
          <span className="app-nav-item"><Icon.Globe size={14} /> Online</span>
          <span className="app-nav-item"><Icon.Chart size={14} /> Reports</span>
        </nav>
        <div className="app-sync"><span className="live" /> Online · synced</div>
      </aside>

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
          <div className="app-print" aria-hidden="true"><ReceiptWindow docked /></div>
          <div className="app-pay">
            <div className="app-pay-methods">
              <span className="ui-chip on">UPI</span><span className="ui-chip">Card</span><span className="ui-chip">Cash</span><span className="ui-chip">Split</span>
            </div>
            <span className="ui-btn app-charge"><Icon.Lightning size={13} /> Charge {inr(TABLE7.total)}</span>
            <span className="app-paid"><Icon.Check size={13} /> Paid via UPI · bill printed</span>
          </div>
        </div>
      </aside>
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
export function OrderWindow() {
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
          <span className="ui-btn ok">Accept · prep 15m</span>
        </div>
      </div>
    </div>
  )
}

/** Stand-in for Attio's "Slack" window: the hot line's kitchen display. */
export function KitchenWindow() {
  const tickets = [
    { id: '#0419', ch: 'swiggy' as Channel, l: ['2× Paneer Tikka Roll', '1× Masala Fries'], t: '0:48', s: 'new' },
    { id: '#0418', ch: 'dine' as Channel, l: ['1× Aloo Paratha'], t: '4:12', s: 'cook', f: 'No onion' },
    { id: '#0417', ch: 'zomato' as Channel, l: ['1× Veg Biryani'], t: '6:30', s: 'late' },
  ]
  return (
    <div className="win sm fw-card">
      <Bar title="Kitchen · Hot line" />
      <div className="win-pane ui fw-kds">
        {tickets.map(k => (
          <div key={k.id} className={`fw-ticket ${k.s}`}>
            <div className="fw-ticket-h">
              <ChannelBadge ch={k.ch} />
              <span className="ui-num">{k.id}</span>
              <span className="ui-num fw-ticket-t"><Icon.Clock size={11} /> {k.t}</span>
            </div>
            {k.l.map(x => <div key={x} className="fw-ticket-l">{x}</div>)}
            {k.f && <div className="fw-flag">{k.f}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Stand-in for Attio's terminal window: the GST bill for Table 7.
 *  floating  the bill on its way to the app: static, already printed, not yet stamped
 *  docked    the same bill inside the app's Table 7 panel. It is displayed from the
 *            bill step (.hs.s3), and that is the only place it animates: the paper
 *            feeds out of the print slot in short jerks, then a PAID stamp lands.
 * Same table, items and total as the app window.
 */
export function ReceiptWindow({ docked = false }: { docked?: boolean }) {
  return (
    <div
      className={`pr ${docked ? 'pr-docked' : 'pr-float'}`}
      role={docked ? undefined : 'img'}
      aria-label={docked ? undefined : 'GST bill for Table 7, ₹273 paid by UPI'}
    >
      <div className="pr-frame">
        <div className="pr-head">
          <span className="pr-mark">D</span>
          <span className="pr-where">
            <b>Demo Café</b>
            <span>HSR Layout, Bengaluru</span>
          </span>
          <span className="pr-led" aria-hidden="true" />
        </div>
        <div className="pr-slot" aria-hidden="true" />
        <div className="pr-out">
          <div className="pr-paper">
            {!docked && <div className="pr-sec pr-ids">
              <div><span>GSTIN</span><b className="ui-num">29XXXXXXXXXX1Z5</b></div>
              <div className="r"><span>Table</span><b>T7 · 2 pax</b></div>
            </div>}
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

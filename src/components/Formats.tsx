'use client'
import { useState } from 'react'
import { Icon } from './Icons'
import { MockWindow } from './platform/Mocks'
import { ChannelBadge } from './hero/HeroScene'
import { SEGMENTS } from '@/content/segments'
import { Peek } from './crew/Peek'
import type { Who } from './crew/parts'
import type { MarketingPage } from '@/content/types'

/** First sentence only, so the panel stays scannable; the /for page carries the rest. */
const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim()

function cardsOf(p: MarketingPage) {
  const s = p.sections.find(x => x.kind === 'cards')
  return s && s.kind === 'cards' ? s.cards.slice(0, 4) : []
}

const TABS: { slug: string; label: string; link: string; icon: React.ReactNode; who: Who; say: string }[] = [
  { slug: 'for/cafes', label: 'Cafés', link: 'Omega for cafés', icon: <Icon.Coffee size={14} />, who: 'server', say: 'Same flat white, regular?' },
  { slug: 'for/qsr', label: 'QSR', link: 'Omega for QSR', icon: <Icon.Lightning size={14} />, who: 'chef', say: 'A42, ready!' },
  { slug: 'for/fine-dining', label: 'Fine dining', link: 'Omega for fine dining', icon: <Icon.Table size={14} />, who: 'captain', say: 'Mains at 20:40, seat 3 no nuts.' },
  { slug: 'for/cloud-kitchens', label: 'Cloud kitchens', link: 'Omega for cloud kitchens', icon: <Icon.Truck size={14} />, who: 'manager', say: 'Three brands, one kitchen.' },
  { slug: 'for/bars', label: 'Bars & lounges', link: 'Omega for bars', icon: <Icon.Store size={14} />, who: 'owner', say: 'Every 30 ml counted.' },
]

function CafeMock() {
  return (
    <MockWindow title="Open tabs · Morning">
      <div className="fm-list">
        {[
          { n: 'Laptop corner, T4', i: '3× Flat White, 1× Croissant', a: '₹680', t: '2h 10m' },
          { n: 'Window seat, T2', i: '1× Cold Brew', a: '₹180', t: '35m' },
          { n: 'Regular · 98xxxxxx21', i: '1× Filter Coffee · 8th visit', a: '₹80', t: '5m' },
          { n: 'Counter, takeaway', i: '2× Masala Chai', a: '₹120', t: 'now' },
        ].map(r => (
          <div key={r.n} className="fm-row">
            <div><b>{r.n}</b><span className="muted">{r.i}</span></div>
            <span className="ui-num muted">{r.t}</span>
            <span className="ui-num">{r.a}</span>
          </div>
        ))}
        <div className="fm-foot"><span className="tag">Tabs auto-close at end of day</span></div>
      </div>
    </MockWindow>
  )
}

function QsrMock() {
  return (
    <MockWindow title="Expo · Lunch rush">
      <div className="fm-qsr">
        {[
          { n: 'A41', src: 'Kiosk', s: 'Ready' }, { n: 'A42', src: 'QR', s: 'Ready' }, { n: 'A43', src: 'Counter', s: 'Fries pending' },
          { n: 'A44', src: 'Swiggy', s: 'Cooking' }, { n: 'A45', src: 'Kiosk', s: 'Cooking' }, { n: 'A46', src: 'Zomato', s: 'New' },
        ].map(o => (
          <div key={o.n} className={`fm-token ${o.s === 'Ready' ? 'ok' : o.s.includes('pending') ? 'warn' : ''}`}>
            <b className="ui-num">{o.n}</b>
            <span>{o.src}</span>
            <span className="fm-token-s">{o.s}</span>
          </div>
        ))}
      </div>
    </MockWindow>
  )
}

function FineMock() {
  return (
    <MockWindow title="Table 5 · Coursed">
      <div className="fm-list">
        {[
          { c: 'Amuse', s: 'Served', cls: 'tag-ok' },
          { c: 'Starters', s: 'Served', cls: 'tag-ok' },
          { c: 'Mains', s: 'Fire at 20:40', cls: 'tag-warn' },
          { c: 'Dessert', s: 'Held', cls: '' },
        ].map(r => (
          <div key={r.c} className="fm-row">
            <div><b>{r.c}</b><span className="muted">6 covers</span></div>
            <span />
            <span className={`tag ${r.cls}`}>{r.s}</span>
          </div>
        ))}
        <div className="fm-foot"><span className="fw-flag">Seat 3 · nut allergy</span><span className="muted">Guestbook: anniversary</span></div>
      </div>
    </MockWindow>
  )
}

function CloudMock() {
  return (
    <MockWindow title="One kitchen · three brands">
      <div className="fm-list">
        {[
          { b: 'Brand A · Bowls', ch: 'swiggy' as const, o: '#0731', i: '2× Rajma Bowl', p: '₹1,940 today' },
          { b: 'Brand B · Wraps', ch: 'zomato' as const, o: '#0732', i: '1× Paneer Wrap', p: '₹1,220 today' },
          { b: 'Brand C · Desserts', ch: 'swiggy' as const, o: '#0733', i: '3× Brownie', p: '₹860 today' },
        ].map(r => (
          <div key={r.o} className="fm-row">
            <div><b>{r.b}</b><span className="muted"><ChannelBadge ch={r.ch} /> {r.o} · {r.i}</span></div>
            <span />
            <span className="ui-num">{r.p}</span>
          </div>
        ))}
        <div className="fm-foot"><span className="tag">Shared inventory · separate P&amp;L</span></div>
      </div>
    </MockWindow>
  )
}

function BarMock() {
  const rows = [
    { n: 'House rum', ml: 30, pct: 72 }, { n: 'London dry gin', ml: 60, pct: 48 },
    { n: 'Single malt', ml: 30, pct: 31 }, { n: 'Draught lager', ml: 330, pct: 64 },
  ]
  return (
    <MockWindow title="Bar · Pour cost & tabs">
      <div className="fm-list">
        {rows.map(r => (
          <div key={r.n} className="fm-row">
            <div><b>{r.n}</b><span className="muted ui-num">{r.ml} ml pour</span></div>
            <span className="stock-bar fm-bar"><i style={{ width: r.pct + '%' }} /></span>
            <span className="ui-num muted">{r.pct}% left</span>
          </div>
        ))}
        <div className="fm-foot"><span className="tag">Happy hour pricing 17:00–19:00</span><span className="tag tag-info">Age check on spirits</span></div>
      </div>
    </MockWindow>
  )
}

const MOCKS: Record<string, React.ReactNode> = {
  'for/cafes': <CafeMock />, 'for/qsr': <QsrMock />, 'for/fine-dining': <FineMock />,
  'for/cloud-kitchens': <CloudMock />, 'for/bars': <BarMock />,
}

export function Formats() {
  const [active, setActive] = useState(TABS[0].slug)
  const page = SEGMENTS.find(s => s.slug === active)!
  const tab = TABS.find(t => t.slug === active)!

  return (
    <section className="section formats" id="formats">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow"><span className="dot" />Formats</div>
          <h2 className="h-section">Tuned to the way <span className="h-italic">you serve.</span></h2>
          <p className="lede">
            A café, a QSR line and a coursed dining room need different things from the same till.
            Pick yours.
          </p>
          <div className="seg fm-seg" role="tablist" aria-label="Restaurant format">
            {TABS.map(t => (
              <button key={t.slug} role="tab" aria-selected={active === t.slug} aria-controls="fm-panel" onClick={() => setActive(t.slug)}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="fm-panel" id="fm-panel" role="tabpanel" key={active}>
          <div className="fm-copy">
            <div className="eyebrow">{page.eyebrow}</div>
            <h3 className="h3">{page.h1Tail ? page.h1Tail.charAt(0).toUpperCase() + page.h1Tail.slice(1) : page.h1}</h3>
            <p className="ch-p">{firstSentence(page.lede)}</p>
            <div className="fm-cards">
              {cardsOf(page).map(c => (
                <div key={c.t} className="fm-card">
                  <h4>{c.t}</h4>
                  <p>{firstSentence(c.d)}</p>
                </div>
              ))}
            </div>
            <a href={`/${page.slug}`} className="text-link ch-link">{tab.link} <Icon.Arrow size={12} /></a>
          </div>
          <div className="panel dots-bg fm-vis has-peek">
            {MOCKS[active]}
            {/* Remounts with the panel, so a new face pops up on every tab change. */}
            <Peek who={tab.who} say={tab.say} side="right" x="10%" />
          </div>
        </div>
      </div>
    </section>
  )
}

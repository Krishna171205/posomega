'use client'
import { useState } from 'react'
import { Icon } from './Icons'

function MockFrame({ children, label }: any) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      aspectRatio: '1.05',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      position: 'relative',
    }}>
      <div style={{
        height: 36, background: 'var(--bg-2)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6,
      }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840' }} />
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{label}</div>
      </div>
      <div style={{ padding: 20, height: 'calc(100% - 36px)' }}>{children}</div>
    </div>
  )
}

function CafeMock() {
  const items: any[] = [
    { n: 'Espresso',     p: 130, e: '☕', bg: 'linear-gradient(135deg, #3D2914, #1A0F08)', img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80&auto=format&fit=crop' },
    { n: 'Flat White',   p: 180, e: '☕', bg: 'linear-gradient(135deg, #C9A47A, #8C6E4A)', img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&q=80&auto=format&fit=crop' },
    { n: 'Iced Mocha',   p: 220, e: '🧋', bg: 'linear-gradient(135deg, #6B4226, #3D2412)', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop' },
    { n: 'Croissant',    p: 140, e: '🥐', bg: 'linear-gradient(135deg, #E8C547, #C19F2F)', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80&auto=format&fit=crop' },
    { n: 'Granola Bowl', p: 280, e: '🥣', bg: 'linear-gradient(135deg, #88A878, #5C7A4D)', img: 'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=400&q=80&auto=format&fit=crop' },
    { n: 'Banana Bread', p: 160, e: '🍞', bg: 'linear-gradient(135deg, #D4A574, #A07442)' },
  ]
  return (
    <MockFrame label="omega.in / cafe-mode · Blue Tokai HSR">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        {['All', 'Coffee', 'Brunch', 'Bakery', 'Cold drinks'].map((c, i) => (
          <span key={c} style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 12,
            background: i === 1 ? 'var(--ink)' : 'var(--card-2)',
            color: i === 1 ? 'var(--bg)' : 'var(--muted)',
            border: '1px solid', borderColor: i === 1 ? 'var(--ink)' : 'var(--line)',
          }}>{c}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 10, padding: 10 }}>
            <div style={{
              aspectRatio: 1.3, background: it.bg, borderRadius: 6, marginBottom: 8,
              display: 'grid', placeItems: 'center', fontSize: 22, position: 'relative', overflow: 'hidden',
            }}>
              <span style={{ position: 'absolute' }}>{it.e}</span>
              {it.img && <img src={it.img} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 500 }}>{it.n}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>₹{it.p}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 10, background: 'var(--ink)', color: 'var(--bg)', borderRadius: 10, fontSize: 13 }}>
        <span>3 open tabs · 12 covers</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>₹2,840</span>
      </div>
    </MockFrame>
  )
}

function QsrMock() {
  return (
    <MockFrame label="omega.in / kiosk · Self order">
      <div style={{ textAlign: 'center', padding: 12 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24, marginBottom: 4 }}>Hello.</div>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>How would you like to order?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
          {[
            { l: 'Dine in', s: 'Eat here', i: '🍽️' },
            { l: 'Take away', s: 'On the go', i: '🥡' },
          ].map((c, i) => (
            <div key={i} style={{
              background: i === 0 ? 'var(--ink)' : 'var(--card-2)',
              color: i === 0 ? 'var(--bg)' : 'var(--ink)',
              border: '1px solid', borderColor: i === 0 ? 'var(--ink)' : 'var(--line)',
              borderRadius: 14, padding: '24px 16px',
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{c.i}</div>
              <div style={{ fontWeight: 500 }}>{c.l}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{c.s}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, padding: 12, background: 'var(--bg-2)', borderRadius: 10, fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginBottom: 4 }}>QUEUE</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontFamily: 'var(--font-mono)' }}>
            <span style={{ padding: '4px 10px', background: 'var(--ink)', color: 'var(--bg)', borderRadius: 6 }}>A23</span>
            <span style={{ padding: '4px 10px', background: 'var(--card-2)', borderRadius: 6 }}>A24</span>
            <span style={{ padding: '4px 10px', background: 'var(--card-2)', borderRadius: 6 }}>A25</span>
            <span style={{ padding: '4px 10px', background: 'var(--card-2)', borderRadius: 6 }}>A26</span>
          </div>
        </div>
      </div>
    </MockFrame>
  )
}

function FineDineMock() {
  const tables: any[] = [
    { n: '1', s: 'free' }, { n: '2', s: 'free' }, { n: '3', s: 'seated', g: '4', t: '0:24' }, { n: '4', s: 'reserved', g: '2', t: '20:00' },
    { n: '5', s: 'seated', g: '2', t: '1:12' }, { n: '6', s: 'free' }, { n: '7', s: 'seated', g: '6', t: '0:48' }, { n: '8', s: 'cleaning' },
    { n: '9', s: 'free' }, { n: '10', s: 'seated', g: '2', t: '0:32' }, { n: '11', s: 'reserved', g: '4', t: '20:30' }, { n: '12', s: 'seated', g: '4', t: '1:48' },
  ]
  const colors: any = {
    free: { bg: 'var(--card-2)', col: 'var(--muted)' },
    seated: { bg: 'var(--ink)', col: 'var(--bg)' },
    reserved: { bg: 'var(--accent-soft)', col: 'var(--accent)' },
    cleaning: { bg: 'var(--bg-2)', col: 'var(--muted)' },
  }
  return (
    <MockFrame label="omega.in / floor · Table map">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, height: '90%' }}>
        {tables.map((t, i) => {
          const c = colors[t.s]
          return (
            <div key={i} style={{
              background: c.bg, color: c.col, border: '1px solid var(--line)',
              borderRadius: 10, padding: 8, fontSize: 10,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>T{t.n}</div>
              <div>
                <div style={{ textTransform: 'capitalize' }}>{t.s}</div>
                {t.g && <div style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{t.g} · {t.t}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </MockFrame>
  )
}

function CloudKitchenMock() {
  const orders: any[] = [
    { src: 'Swiggy', n: 'B-2840', i: ['1× Cheeseburger', '1× Fries'], t: '0:42', c: 'var(--accent)' },
    { src: 'Zomato', n: 'B-2841', i: ['2× Biryani', '1× Raita'], t: '2:18', c: 'var(--sage)' },
    { src: 'Direct', n: 'W-2842', i: ['1× Pad Thai'], t: '0:08', c: 'var(--ink)' },
    { src: 'Swiggy', n: 'B-2843', i: ['1× Veggie burger'], t: '0:00', c: 'var(--accent)' },
    { src: 'Zomato', n: 'B-2844', i: ['3× Biryani'], t: '0:00', c: 'var(--sage)' },
    { src: 'Direct', n: 'W-2845', i: ['1× Bao'], t: '0:00', c: 'var(--ink)' },
  ]
  return (
    <MockFrame label="omega.in / kds · 3 brands · 1 kitchen">
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {['Burger Co.', 'Biryani Bros', 'Wok Box'].map((b, i) => (
          <span key={b} style={{
            padding: '5px 10px', fontSize: 11, borderRadius: 6, fontFamily: 'var(--font-mono)',
            background: i === 0 ? 'var(--ink)' : 'var(--card-2)',
            color: i === 0 ? 'var(--bg)' : 'var(--muted)',
            border: '1px solid var(--line)',
          }}>{b}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {orders.map((o, i) => (
          <div key={i} style={{
            background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 8,
            padding: 8, fontSize: 10, fontFamily: 'var(--font-mono)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: o.c }}>● {o.src}</span>
              <span>{o.t}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{o.n}</div>
            <div style={{ color: 'var(--muted)', lineHeight: 1.4 }}>{o.i.map((x: string, j: number) => <div key={j}>{x}</div>)}</div>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

function BarMock() {
  const bottles: any[] = [
    { n: 'Old Monk', p: 30, c: 12, b: 60 },
    { n: 'Tanqueray', p: 60, c: 240, b: 80 },
    { n: 'Glenfiddich', p: 30, c: 380, b: 70 },
    { n: 'Bombay Sapphire', p: 60, c: 220, b: 50 },
    { n: 'Jameson', p: 30, c: 280, b: 90 },
  ]
  return (
    <MockFrame label="omega.in / bar · Pour cost & tabs">
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>TONIGHT</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>₹38,420</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Bar revenue</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>21.2%</div>
            <div style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>POUR COST</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>14</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Open tabs</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {bottles.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 11 }}>
            <div style={{ width: 110, fontSize: 12 }}>{b.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', width: 50, color: 'var(--muted)' }}>{b.p}ml</div>
            <div style={{ flex: 1, height: 6, background: 'var(--bg-2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: b.b + '%', height: '100%', background: 'var(--ink)', borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', width: 56, textAlign: 'right' }}>₹{b.c}</div>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

export function Industries() {
  const [active, setActive] = useState('cafe')
  const tabs = [
    { id: 'cafe',     label: 'Cafés' },
    { id: 'qsr',      label: 'QSR' },
    { id: 'finedine', label: 'Fine dining' },
    { id: 'cloud',    label: 'Cloud kitchens' },
    { id: 'bar',      label: 'Bars & lounges' },
  ]
  const content: any = {
    cafe: {
      eyebrow: 'For specialty coffee, bakeries & all-day cafés',
      title: 'Built for the morning rush.',
      desc: 'Open-tab workflows, sub-2-second order entry, and tip-splitting that actually works. Baristas trained in one shift.',
      features: [
        { ic: <Icon.Coffee />, t: 'Open-tab & pre-auth', d: 'Run tabs without losing track. Auto-close at end of day.' },
        { ic: <Icon.Lightning />, t: 'Sub-2s order entry', d: 'Bigger buttons, fewer taps. Built for the morning queue.' },
        { ic: <Icon.Users />, t: 'Tip pools that work', d: 'Split tips by role, hours, or station — automatically.' },
        { ic: <Icon.Sparkle />, t: 'Loyalty built-in', d: 'Phone-based punch cards. No app downloads.' },
      ],
      mock: <CafeMock />,
    },
    qsr: {
      eyebrow: 'For QSR chains & food courts',
      title: 'Throughput at scale.',
      desc: 'Self-order kiosks, drive-thru flows, and multi-station KDS routing. Built to handle 1,200+ covers a day.',
      features: [
        { ic: <Icon.Lightning />, t: 'Kiosks & QR ordering', d: 'Customers order themselves — yours in any language.' },
        { ic: <Icon.Truck />, t: 'Drive-thru flow', d: 'Order, pay, dispatch — one terminal, one staffer.' },
        { ic: <Icon.Receipt />, t: 'Multi-station KDS', d: 'Hot side, cold side, expo. Routes itself.' },
        { ic: <Icon.Chart />, t: 'Throughput analytics', d: 'Track every second from order to handoff.' },
      ],
      mock: <QsrMock />,
    },
    finedine: {
      eyebrow: 'For chef-led restaurants',
      title: 'Hospitality, instrumented.',
      desc: 'Course-by-course pacing, table mapping, allergy flags, and a guestbook that remembers everyone.',
      features: [
        { ic: <Icon.Grid />, t: 'Course pacing & fire', d: "Send courses on cue. Kitchen knows what's coming." },
        { ic: <Icon.Shield />, t: 'Allergy flags', d: 'Auto-warn the kitchen. Print on every KOT.' },
        { ic: <Icon.Users />, t: 'Guestbook', d: 'Remember birthdays, favourite wines, last visit.' },
        { ic: <Icon.Tag />, t: 'Reservations integrated', d: 'EazyDiner, Dineout, OpenTable — all in one diary.' },
      ],
      mock: <FineDineMock />,
    },
    cloud: {
      eyebrow: 'For delivery-only operations',
      title: 'Run 8 brands. One kitchen.',
      desc: 'Multi-brand menu management, unified KDS across aggregators, and rider dispatch that minimises wait time.',
      features: [
        { ic: <Icon.Box />, t: 'Multi-brand menus', d: 'Run multiple brands from one kitchen — separate menus, P&L.' },
        { ic: <Icon.Globe />, t: 'Unified aggregators', d: "All orders, one screen. Mark items 86'd everywhere at once." },
        { ic: <Icon.Truck />, t: 'Rider dispatch', d: 'Auto-assign by zone. Track every kilometre.' },
        { ic: <Icon.Chart />, t: 'Per-brand reporting', d: 'Know which brand is actually making money.' },
      ],
      mock: <CloudKitchenMock />,
    },
    bar: {
      eyebrow: 'For bars, breweries & lounges',
      title: 'Pour. Tab. Track.',
      desc: 'Liquor inventory by the millilitre. Tab management. Age verification. Built for the late shift.',
      features: [
        { ic: <Icon.Tag />, t: 'Pour cost tracking', d: 'Recipe-level cost down to the ML. Catch shrinkage instantly.' },
        { ic: <Icon.Receipt />, t: 'Tab management', d: 'Pre-auth on card. Auto-close at last call.' },
        { ic: <Icon.Shield />, t: 'Age verification', d: 'Scan ID. Auto-block under-21 SKUs.' },
        { ic: <Icon.Box />, t: 'Stocktake by bottle', d: 'Weigh, scan, done. End-of-night in 12 minutes.' },
      ],
      mock: <BarMock />,
    },
  }
  const c = content[active]

  return (
    <section className="section" id="industries">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Tuned for your trade</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            One platform, <span className="h-italic">five disciplines.</span>
          </h2>
        </div>

        <div className="industries-tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
              {t.label}
            </div>
          ))}
        </div>

        <div className="industry-panel">
          <div>
            <div className="eyebrow">{c.eyebrow}</div>
            <h3 className="h-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: '14px 0 16px' }}>
              {c.title}
            </h3>
            <p className="lede" style={{ fontSize: 17 }}>{c.desc}</p>
            <div className="industry-features">
              {c.features.map((f: any, i: number) => (
                <div key={i} className="industry-feature">
                  <div className="ic">{f.ic}</div>
                  <div>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>{c.mock}</div>
        </div>
      </div>
    </section>
  )
}

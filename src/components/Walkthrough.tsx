'use client'
import { useState } from 'react'
import { Icon } from './Icons'

function WalkSetup() {
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', gap: 24 }}>
      <div style={{
        width: 180, height: 180, borderRadius: 24,
        background: 'linear-gradient(135deg, var(--ink), #2A2A2A)',
        display: 'grid', placeItems: 'center', color: 'var(--bg)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        <div style={{
          width: 110, height: 110, background: 'white', borderRadius: 8,
          backgroundImage: 'repeating-linear-gradient(0deg, var(--ink) 0 4px, transparent 4px 8px), repeating-linear-gradient(90deg, var(--ink) 0 4px, transparent 4px 8px)',
        }} />
        <div style={{ position: 'absolute', bottom: -8, right: -8, width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: 'white', display: 'grid', placeItems: 'center' }}>
          <Icon.Check size={16} />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>SCAN TO PROVISION</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, marginTop: 6 }}>One QR. No engineers.</div>
      </div>
    </div>
  )
}

function WalkAggregators() {
  const apps = [
    { name: 'Swiggy', color: '#FC8019' },
    { name: 'Zomato', color: '#E23744' },
    { name: 'Magicpin', color: '#E91E63' },
    { name: 'EazyDiner', color: '#1A1A1A' },
    { name: 'Dineout', color: '#FF6B35' },
    { name: 'WhatsApp', color: '#25D366' },
  ]
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'relative', width: 320, height: 320 }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 96, height: 96, borderRadius: 24, background: 'var(--ink)', color: 'var(--bg)',
          display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 36,
          boxShadow: 'var(--shadow-lg)', zIndex: 2,
        }}>Ω</div>
        {apps.map((a, i) => {
          const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2
          const x = 150 + Math.cos(angle) * 110
          const y = 150 + Math.sin(angle) * 110
          return (
            <div key={i} style={{
              position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)',
              padding: '8px 14px', background: 'var(--card-2)', border: '1px solid var(--line)',
              borderRadius: 999, fontSize: 12, fontWeight: 500, boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.color }} />
              {a.name}
            </div>
          )
        })}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 320 320">
          {apps.map((_, i) => {
            const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2
            const x = 160 + Math.cos(angle) * 110
            const y = 160 + Math.sin(angle) * 110
            return <line key={i} x1="160" y1="160" x2={x} y2={y} stroke="var(--line-2)" strokeWidth="1" strokeDasharray="3 3" />
          })}
        </svg>
      </div>
    </div>
  )
}

function WalkTraining() {
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 380, display: 'grid', gap: 14 }}>
        {[
          { label: 'Welcome video', time: '0:48', done: true },
          { label: 'Take your first order', time: '1:30', done: true },
          { label: 'Apply a discount', time: '0:32', done: true },
          { label: 'Split a bill', time: '0:45', done: true },
          { label: 'Run end-of-day report', time: '1:10', done: false, active: true },
          { label: "You're done.", time: '7:00', done: false },
        ].map((s: any, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px',
            background: s.active ? 'var(--ink)' : 'var(--card-2)',
            color: s.active ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid', borderColor: s.active ? 'var(--ink)' : 'var(--line)',
            borderRadius: 12,
            opacity: s.done ? 0.55 : 1,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: s.done ? 'var(--sage)' : s.active ? 'var(--accent)' : 'var(--bg-2)',
              color: 'white',
              display: 'grid', placeItems: 'center',
            }}>
              {s.done && <Icon.Check size={11} />}
              {s.active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            </div>
            <div style={{ flex: 1, fontSize: 14, textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>{s.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WalkDashboard() {
  return (
    <div style={{ height: '100%', padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 18, gridColumn: 'span 2' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>TODAY · CONNAUGHT PLACE</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 6 }}>
          ₹84,210
          <span style={{ fontSize: 13, color: 'var(--sage)', fontFamily: 'var(--font-mono)', marginLeft: 10 }}>↑ 12%</span>
        </div>
        <svg viewBox="0 0 400 60" style={{ width: '100%', height: 60, marginTop: 12 }}>
          <defs>
            <linearGradient id="dashG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,40 L40,35 L80,38 L120,28 L160,32 L200,22 L240,26 L280,18 L320,14 L360,20 L400,10 L400,60 L0,60 Z" fill="url(#dashG)" />
          <path d="M0,40 L40,35 L80,38 L120,28 L160,32 L200,22 L240,26 L280,18 L320,14 L360,20 L400,10" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      {[
        { label: 'Orders', value: '342', delta: '+18' },
        { label: 'Avg ticket', value: '₹246', delta: '+6%' },
        { label: 'Top item', value: 'Cold Brew', delta: '88 sold' },
        { label: 'Refunds', value: '0.3%', delta: '−0.1%' },
      ].map((s, i) => (
        <div key={i} style={{ background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{s.label}</div>
          <div style={{ fontSize: 22, fontWeight: 500, marginTop: 6, letterSpacing: '-0.02em' }}>{s.value}</div>
          <div style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{s.delta}</div>
        </div>
      ))}
    </div>
  )
}

function WalkVisual({ step }: { step: number }) {
  return (
    <div className="walk-visual">
      {step === 0 && <WalkSetup />}
      {step === 1 && <WalkAggregators />}
      {step === 2 && <WalkTraining />}
      {step === 3 && <WalkDashboard />}
    </div>
  )
}

export function Walkthrough() {
  const [active, setActive] = useState(0)
  const steps = [
    { n: '01', title: 'Plug it in.', desc: 'Open the box, scan one QR. Menu, taxes, tables, printer — all configured.' },
    { n: '02', title: 'Connect your aggregators.', desc: 'One-click sync with Swiggy, Zomato and Magicpin. Items and prices stay in lockstep.' },
    { n: '03', title: 'Train your team in 7 minutes.', desc: 'Built for staff turnover. Most captains take their first order within a single shift.' },
    { n: '04', title: 'Watch the dashboard.', desc: 'Live sales, smart alerts, weekly insights — delivered to your phone every morning.' },
  ]
  return (
    <section className="section" id="walkthrough" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div className="sec-head">
          <div className="eyebrow"><span className="dot" />From shutter-up to first sale</div>
          <h2 className="h-section" style={{ marginTop: 16 }}>
            Live in <span className="h-italic">an afternoon.</span>
          </h2>
        </div>

        <div className="walk">
          <div className="walk-steps">
            {steps.map((s, i) => (
              <div key={i} className={`walk-step ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
                <div className="num">Step {s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <WalkVisual step={active} />
        </div>
      </div>
    </section>
  )
}

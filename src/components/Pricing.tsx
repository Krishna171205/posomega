'use client'
import { useState } from 'react'
import { Icon } from './Icons'

export function Pricing() {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly')
  const plans: any[] = [
    {
      tier: 'Starter',
      name: 'Single café',
      monthly: 1499,
      annual: 1199,
      desc: 'For one location, getting started.',
      features: [
        'Unlimited orders & receipts',
        'Menu, inventory, KOTs',
        'UPI, card & cash payments',
        '1 aggregator integration',
        'Daily reports & email support',
      ],
      cta: 'Start free trial',
      featured: false,
    },
    {
      tier: 'Growth',
      name: 'Multi-outlet',
      monthly: 3499,
      annual: 2799,
      desc: 'For up to 10 outlets, scaling fast.',
      features: [
        'Everything in Starter, plus:',
        'Up to 10 outlets',
        'All aggregator integrations',
        'AI-powered inventory & forecasting',
        'Multi-outlet command centre',
        'WhatsApp commerce',
        '24×7 priority support',
      ],
      cta: 'Book a demo',
      featured: true,
    },
    {
      tier: 'Enterprise',
      name: 'Chains & franchises',
      monthly: null,
      annual: null,
      desc: 'For 10+ outlets, custom requirements.',
      features: [
        'Everything in Growth, plus:',
        'Unlimited outlets',
        'Dedicated infrastructure',
        'Custom integrations & SLAs',
        'On-site training & rollout',
        'Dedicated success manager',
      ],
      cta: 'Talk to sales',
      featured: false,
    },
  ]

  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Transparent pricing</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            Pay for outlets, <span className="h-italic">not seats.</span>
          </h2>
          <p className="lede" style={{ margin: '0 auto', textAlign: 'center' }}>
            One flat fee per outlet. Unlimited staff, terminals, and transactions.
            No setup fees. No long contracts.
          </p>

          <div className="industries-tabs" style={{ marginTop: 24 }}>
            <div className={`tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Monthly</div>
            <div className={`tab ${period === 'annual' ? 'active' : ''}`} onClick={() => setPeriod('annual')}>
              Annual <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>−20%</span>
            </div>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div key={i} className={`price-card ${p.featured ? 'featured' : ''}`}>
              {p.featured && <div className="featured-pill">Most popular</div>}
              <div>
                <div className="tier">{p.tier}</div>
                <h3>{p.name}</h3>
                <div className="amount" style={{ marginTop: 16 }}>
                  {p.monthly === null ? 'Custom' : <>₹{period === 'monthly' ? p.monthly.toLocaleString() : p.annual.toLocaleString()}<span className="unit">/outlet/mo</span></>}
                </div>
                <p className="desc" style={{ marginTop: 8 }}>{p.desc}</p>
              </div>
              <ul className="price-features">
                {p.features.map((f: string, j: number) => (
                  <li key={j}>
                    <Icon.Check />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/get-started" className={p.featured ? 'btn btn-primary' : 'btn btn-secondary'}
                 style={p.featured ? { background: 'var(--bg)', color: 'var(--ink)' } : {}}>
                {p.cta} <Icon.Arrow size={12} />
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, padding: '14px 22px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon.Sparkle size={20} />
            <div>
              <div style={{ fontWeight: 500 }}>Free hardware on Growth (12-month commit).</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>One Omega Terminal + one Omega Print, per outlet. Worth ₹31,300.</div>
            </div>
          </div>
          <a href="/get-started" className="btn btn-primary btn-sm">Claim offer <Icon.Arrow size={12} /></a>
        </div>
      </div>
    </section>
  )
}

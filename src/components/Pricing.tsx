'use client'
import { useState } from 'react'
import { Icon } from './Icons'
import { Peek } from './crew/Peek'
import type { Enter } from './crew/Peek'
import type { Who } from './crew/parts'

/** Who peeks over each card, and what they say. */
const PEEKS: Record<string, { who: Who; say: string; side: 'left' | 'right'; enter: Enter }> = {
  Starter: { who: 'server', say: 'Just the one café.', side: 'right', enter: 'walk' },
  Growth: { who: 'manager', say: 'Ten outlets, one view.', side: 'left', enter: 'pop' },
  Enterprise: { who: 'owner', say: 'Bring the whole chain.', side: 'right', enter: 'eyes' },
}

type Plan = {
  tier: string
  name: string
  monthly: number | null
  annual: number | null
  desc: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

/*
 * Prices match layout.tsx JSON-LD and /pricing copy. Feature lines are limited to
 * what the /pricing page and src/content describe.
 */
const PLANS: Plan[] = [
  {
    tier: 'Starter', name: 'Single outlet', monthly: 1499, annual: 1199,
    desc: 'For one location, getting started.',
    features: ['Unlimited orders, staff and terminals', 'Billing, KOTs, kitchen display', 'Recipe-level inventory', 'UPI, card and cash payments', '1 aggregator integration', 'Offline billing on the Android app', 'Email support'],
    cta: { label: 'Start free trial', href: 'https://billing.pepperpe.com/onboard' },
  },
  {
    tier: 'Growth', name: 'Multi-outlet', monthly: 3499, annual: 2799,
    desc: 'For up to 10 outlets.',
    features: ['Everything in Starter, plus:', 'Up to 10 outlets', 'All aggregator integrations', 'Reports across all outlets', 'Priority support', 'Free hardware on a 12-month plan'],
    cta: { label: 'Talk to sales', href: '/get-started' },
    featured: true,
  },
  {
    tier: 'Enterprise', name: 'Chains & franchises', monthly: null, annual: null,
    desc: 'For more than 10 outlets.',
    features: ['Everything in Growth, plus:', 'Unlimited outlets', 'All-outlet and per-outlet reports', 'Priced per chain, not per outlet'],
    cta: { label: 'Get a quote', href: '/get-started' },
  },
]

export function Pricing() {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly')
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow"><span className="dot" />Pricing</div>
          <h2 className="h-section">Pay for outlets, <span className="h-muted">not seats.</span></h2>
          <p className="lede">
            One flat fee per outlet. Unlimited staff, terminals and transactions. No setup fee, and no cut
            of your payments.
          </p>
          <div className="seg" role="tablist" aria-label="Billing period">
            <button role="tab" aria-selected={period === 'monthly'} onClick={() => setPeriod('monthly')}>Monthly</button>
            <button role="tab" aria-selected={period === 'annual'} onClick={() => setPeriod('annual')}>Annual <span className="off">−20%</span></button>
          </div>
        </div>

        <div className="price-grid peeks">
          {PLANS.map(p => {
            const amt = period === 'monthly' ? p.monthly : p.annual
            return (
              <div key={p.tier} className={`price-card has-peek ${p.featured ? 'featured' : ''}`}>
                <Peek {...PEEKS[p.tier]} x="14%" />
                <div className="price-top">
                  <div className="price-tier">{p.tier}{p.featured && <span className="tag tag-info">Most popular</span>}</div>
                  <div className="price-name">{p.name}</div>
                  <div className="price-amt">
                    {amt === null ? 'Custom' : <>₹{amt.toLocaleString('en-IN')}<span>/outlet/mo</span></>}
                  </div>
                  <p className="price-desc">{p.desc}{amt !== null && period === 'annual' ? ' Billed annually.' : ''}</p>
                  <a href={p.cta.href} className={`btn ${p.featured ? 'btn-blue' : 'btn-outline'} price-cta`}>{p.cta.label}</a>
                </div>
                <ul className="price-feat">
                  {p.features.map(f => (
                    <li key={f} className={f.endsWith('plus:') ? 'lead' : ''}>
                      {!f.endsWith('plus:') && <Icon.Check size={13} />}{f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="price-offer">
          <Icon.Printer size={18} />
          <div>
            <b>Free hardware on Growth with a 12-month commitment.</b>
            <span>One PepperPe Terminal and one PepperPe Print per outlet, worth ₹31,300.</span>
          </div>
          <a href="/get-started" className="btn btn-outline btn-sm">Claim offer <Icon.Arrow size={12} /></a>
        </div>
      </div>
    </section>
  )
}

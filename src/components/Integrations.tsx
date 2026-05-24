'use client'
import { useState } from 'react'
import { Icon } from './Icons'

function LogoSlot({ slug, color, fallback }: any) {
  const [err, setErr] = useState(!slug)
  const url = slug ? `https://cdn.simpleicons.org/${slug}/${color.slice(1)}` : null
  if (err || !slug) return <span className="wordmark-fb" style={{ color }}>{fallback}</span>
  return <img src={url!} alt="" loading="lazy" onError={() => setErr(true)} />
}

export function Integrations() {
  const cats: any[] = [
    { tag: 'Delivery', items: [
      { n: 'Swiggy',    c: '#FC8019', slug: 'swiggy' },
      { n: 'Zomato',    c: '#E23744', slug: 'zomato' },
      { n: 'Magicpin',  c: '#E91E63', slug: null },
      { n: 'EazyDiner', c: '#1A1A1A', slug: null },
      { n: 'Dineout',   c: '#FF6B35', slug: null },
    ]},
    { tag: 'Payments', items: [
      { n: 'Razorpay',  c: '#2D85F7', slug: 'razorpay' },
      { n: 'Paytm',     c: '#00BAF2', slug: 'paytm' },
      { n: 'PhonePe',   c: '#5F259F', slug: 'phonepe' },
      { n: 'GPay',      c: '#4285F4', slug: 'googlepay' },
      { n: 'Pine Labs', c: '#1A4FBA', slug: null },
      { n: 'Stripe',    c: '#635BFF', slug: 'stripe' },
    ]},
    { tag: 'Accounting', items: [
      { n: 'Tally',      c: '#1B4F8A', slug: null },
      { n: 'Zoho Books', c: '#E42527', slug: 'zoho' },
      { n: 'QuickBooks', c: '#2CA01C', slug: 'quickbooks' },
    ]},
    { tag: 'Marketing', items: [
      { n: 'WhatsApp Business', c: '#25D366', slug: 'whatsapp' },
      { n: 'Klaviyo',           c: '#FF5C2B', slug: null },
      { n: 'Mailchimp',         c: '#FFE01B', slug: 'mailchimp' },
    ]},
    { tag: 'Operations', items: [
      { n: 'Shopify',       c: '#7AB55C', slug: 'shopify' },
      { n: 'Slack',         c: '#4A154B', slug: null },
      { n: 'Google Sheets', c: '#0F9D58', slug: 'googlesheets' },
    ]},
  ]
  const allItems = cats.flatMap((c: any) => c.items)

  return (
    <section className="section" id="integrations">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />120+ integrations</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            Plays well with <span className="h-italic">everything else</span> you already pay for.
          </h2>
        </div>

        <div className="int-grid">
          {allItems.map((it: any, i: number) => (
            <div key={i} className="int-tile">
              <div className="logo-slot">
                <LogoSlot slug={it.slug} color={it.c} fallback={it.n.charAt(0)} />
              </div>
              <div className="name">{it.n}</div>
            </div>
          ))}
          <div className="int-tile" style={{ background: 'var(--ink)', color: 'var(--bg)', borderColor: 'var(--ink)' }}>
            <div className="logo-slot">
              <span style={{ fontSize: 26, fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--bg)' }}>+92</span>
            </div>
            <div className="name" style={{ color: 'color-mix(in oklab, var(--bg) 65%, transparent)' }}>more</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <a href="#" className="btn btn-secondary">View all integrations <Icon.Arrow size={12} /></a>
        </div>
      </div>
    </section>
  )
}

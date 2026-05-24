'use client'
import { useState } from 'react'
import { Icon } from './Icons'

export function FAQ() {
  const [open, setOpen] = useState(0)
  const items = [
    { q: 'How long does setup actually take?', a: "On average, 7 minutes from unboxing to first sale. Your menu, taxes, table layout and printer pair via one QR code. If you're migrating from another POS, our team imports your menu, customers and inventory for free." },
    { q: 'What happens when the internet goes down?', a: "Omega keeps running. Every order, payment and KOT is queued locally and automatically reconciled the moment connectivity returns. We've shipped 41 million offline transactions without a single lost rupee." },
    { q: 'Do I have to buy your hardware?', a: 'No — Omega runs on any modern Android tablet, iPad or Windows POS. Our hardware is purpose-built and beautifully cheaper than the alternative, but it\'s optional.' },
    { q: 'How does the Swiggy / Zomato integration work?', a: "Native, two-way sync — items, prices, stock and modifiers stay in lockstep across every platform. When you 86 paneer at the counter, it disappears from every aggregator in under 4 seconds." },
    { q: "What's your pricing in plain English?", a: '₹1,499/outlet/month for Starter, ₹3,499 for Growth, custom for Enterprise. No setup fees, no per-seat charges, no per-transaction fees. Pay annually and save 20%.' },
    { q: 'Is my data secure?', a: "PCI-DSS, SOC 2 Type II, ISO 27001. Your data sits in Indian data centres, never leaves the country, and is encrypted at rest and in transit. We don't train AI on your customer data." },
    { q: 'Can I switch from Petpooja / Posist / Square?', a: 'Yes — migrations are included in onboarding. Most customers are fully switched in under 48 hours, including history import.' },
  ]

  return (
    <section className="section" id="faq">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'flex-start' }}>
          <div style={{ position: 'sticky', top: 120 }}>
            <div className="eyebrow"><span className="dot" />Questions, answered</div>
            <h2 className="h-section" style={{ marginTop: 16 }}>
              Things you're<br /><span className="h-italic">probably wondering.</span>
            </h2>
            <p className="lede" style={{ marginTop: 16 }}>
              Still curious? Talk to a human — our team are former café operators, not call-centre staff.
            </p>
            <a href="#cta" className="btn btn-secondary" style={{ marginTop: 16 }}>
              Talk to a human <Icon.Arrow size={12} />
            </a>
          </div>
          <div className="faq-list">
            {items.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  {f.q}
                  <span className="plus"><Icon.Plus /></span>
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useState } from 'react'
import { Icon } from './Icons'

export function FAQ() {
  const [open, setOpen] = useState(0)
  const items = [
    { q: 'How long does setup actually take?', a: "Most cafes are taking orders the same day. Your menu, taxes, table layout and printer pair via one QR code, and there is no on-site engineer visit to schedule. If you're migrating from another POS, our team imports your menu, customers and inventory for free." },
    { q: 'What happens when the internet goes down?', a: "Omega keeps running. Billing, KOTs and cash payments all work from the local device. Every order is queued on the terminal and reconciled automatically the moment connectivity returns, so nothing is lost and nobody has to fall back to a paper bill book." },
    { q: 'Do I have to buy your hardware?', a: 'No — Omega runs on any modern Android tablet, iPad or Windows POS. Our hardware is purpose-built and beautifully cheaper than the alternative, but it\'s optional.' },
    { q: 'How does the Swiggy / Zomato integration work?', a: "Native, two-way sync. Items, prices, stock and modifiers stay in lockstep across every platform, and aggregator orders land in the same queue as your dine-in and takeaway tickets. Mark an item out of stock at the counter and Omega pushes that state out to each aggregator, so you stop taking orders you cannot fulfil." },
    { q: "What's your pricing in plain English?", a: '₹1,499/outlet/month for Starter, ₹3,499 for Growth, custom for Enterprise. No setup fees, no per-seat charges, no per-transaction fees. Pay annually and save 20%.' },
    { q: 'Is my data secure?', a: "Your data sits in Indian data centres, never leaves the country, and is encrypted at rest and in transit. Card payments are handled by our PCI-DSS certified payment partners, so raw card data never touches Omega's systems. We don't train AI on your customer data. Our SOC 2 programme is in progress and we will publish the report when it is complete." },
    { q: 'Can I switch from Petpooja / Posist / Square?', a: 'Yes. Migration is included in onboarding at no extra cost. We export your menu, modifiers, customers and inventory from your current POS and load them into Omega before you switch over, so you are not re-typing a menu on a Friday night.' },
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

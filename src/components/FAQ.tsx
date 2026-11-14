'use client'
import { useState } from 'react'
import { Icon } from './Icons'
import { FAQS } from '@/content/home'
import { Peek } from './crew/Peek'

export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <div className="eyebrow"><span className="dot" />Questions</div>
          <h2 className="h-section">Things you’re <span className="h-italic">probably wondering.</span></h2>
          <p className="lede">Still curious? Talk to a person. The team are former café operators, not a call centre.</p>
          <a href="/get-started" className="btn btn-outline">Talk to us <Icon.Arrow size={12} /></a>
        </div>
        <div className="faq-list has-peek">
          <Peek who="store" mood="think" say="Hmm, good question…" side="right" x="6%" enter="eyes" />
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <h3>
                  <button className="faq-q" aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    {f.q}
                    <span className="faq-plus" aria-hidden="true"><Icon.Plus size={14} /></span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} className="faq-a" role="region" hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

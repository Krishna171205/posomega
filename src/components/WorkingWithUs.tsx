import { Icon } from './Icons'
import { CONSENTED_CUSTOMERS } from '@/content/customers'
import { Peek } from './crew/Peek'
import type { Enter } from './crew/Peek'
import type { Who } from './crew/parts'

const POINTS: { ic: React.ReactNode; t: string; d: string; peek?: { who: Who; say: string; side: 'left' | 'right'; x?: string; enter?: Enter } }[] = [
  {
    peek: { who: 'manager', say: 'You’ll get me, not a ticket.', side: 'left', x: '8%', enter: 'walk' },
    ic: <Icon.Users size={16} />,
    t: 'You talk to the people who build it',
    d: 'No tiered support queue and no ticket that gets escalated twice before it reaches someone technical. When something breaks at eight on a Saturday, the message reaches a person who can change the code.',
  },
  {
    ic: <Icon.Box size={16} />,
    t: 'We do the migration',
    d: 'Your menu, modifier groups, customers and inventory come off your current POS and into PepperPe before you switch over. Included in onboarding, not quoted separately as a project.',
  },
  {
    peek: { who: 'captain', say: 'Ask for it. We might ship it.', side: 'right', x: '10%', enter: 'lean' },
    ic: <Icon.Sparkle size={16} />,
    t: 'Your requests shape what ships next',
    d: 'The roadmap is currently set by the cafés actually running PepperPe. That stops being true once there are hundreds of them, which is exactly why it is worth something now.',
  },
]

/**
 * The proof slot. attio.com puts a testimonial and scale metrics here; Omega has
 * neither to show honestly yet, so it says where it actually is. Consented customers
 * (src/content/customers.ts) appear as a row when there are any.
 */
export function WorkingWithUs() {
  return (
    <section className="section proof" id="early">
      <div className="container">
        <div className="proof-top" data-rv>
          <div className="eyebrow"><span className="dot" />Where we are</div>
          <blockquote className="proof-quote">
            PepperPe runs real cafés today, and not many of them. If you want a POS with two hundred logos
            on the homepage, <span className="proof-em">that is not us yet.</span>
          </blockquote>
          <p className="proof-by">The team at PepperPe · Unified Nexgrade</p>
        </div>

        {CONSENTED_CUSTOMERS.length > 0 && (
          <ul className="proof-customers">
            {CONSENTED_CUSTOMERS.map(c => (
              <li key={c.name} className="card">
                <h3>{c.name}</h3>
                {(c.format || c.place) && <p>{[c.format, c.place].filter(Boolean).join(' · ')}</p>}
              </li>
            ))}
          </ul>
        )}

        <div className="proof-grid peeks">
          {POINTS.map((p, i) => (
            <div className={`proof-card ${p.peek ? 'has-peek' : ''}`} key={p.t} data-rv style={{ ['--rv-i' as string]: i }}>
              {p.peek && <Peek {...p.peek} />}
              <span className="proof-ic">{p.ic}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>

        <p className="proof-note">
          What we have not finished: our SOC&nbsp;2 report is in progress and we will publish it
          when it is done. Anything else you want to know before trusting us with your till,
          ask directly at <a href="mailto:hello@unifiednexgrade.com">hello@unifiednexgrade.com</a>.
        </p>
      </div>
    </section>
  )
}

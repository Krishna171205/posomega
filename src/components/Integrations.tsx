import { Icon } from './Icons'
import { INTEGRATION_GROUPS } from '@/content/home'
import { Peek } from './crew/Peek'
import type { Enter } from './crew/Peek'
import type { Who } from './crew/parts'

const PEEKS: Record<string, { who: Who; say: string; side: 'left' | 'right'; x?: string; enter?: Enter }> = {
  Delivery: { who: 'manager', say: 'Swiggy and Zomato, one queue.', side: 'right', x: '12%', enter: 'pop' },
  Hardware: { who: 'chef', say: 'KOT printed. Nice.', side: 'left', x: '12%', enter: 'hat' },
}

/** attio.com "Your whole stack, connected." Only integrations documented in src/content. */
export function Integrations() {
  return (
    <section className="section" id="integrations">
      <div className="container">
        <div className="int-head" data-rv>
          <div className="sec-head">
            <div className="eyebrow"><span className="dot" />Integrations</div>
            <h2 className="h-section">Your whole counter, <span className="h-muted">connected.</span></h2>
            <p className="lede">
              The aggregators, payment rails and hardware Indian restaurants already pay for.
              The list is short because every item on it works.
            </p>
          </div>
          <a href="/integrations" className="btn btn-outline int-all">All integrations <Icon.Arrow size={12} /></a>
        </div>

        <div className="int-grid peeks">
          {INTEGRATION_GROUPS.map((g, i) => (
            <div key={g.tag} className={`int-group ${PEEKS[g.tag] ? 'has-peek' : ''}`} data-rv style={{ ['--rv-i' as string]: i }}>
              {PEEKS[g.tag] && <Peek {...PEEKS[g.tag]} />}
              <div className="int-group-h">
                <h3>{g.tag}</h3>
                <p>{g.blurb}</p>
              </div>
              <ul>
                {g.items.map(it => (
                  <li key={it.n} className="int-item">
                    <span className="int-mark" aria-hidden="true">{it.n.charAt(0)}</span>
                    <span className="int-txt"><b>{it.n}</b><span>{it.d}</span></span>
                  </li>
                ))}
              </ul>
              {g.href && <a href={g.href} className="text-link int-more">Learn more <Icon.Arrow size={11} /></a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

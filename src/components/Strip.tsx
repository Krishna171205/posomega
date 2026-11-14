import { CONSENTED_CUSTOMERS } from '@/content/customers'
import { WORKS_WITH } from '@/content/home'

/**
 * The slot under the hero where attio.com shows customer logos.
 * Customer names render only from consented entries in src/content/customers.ts;
 * until there are any, it lists integrations the product actually has.
 */
export function Strip() {
  if (CONSENTED_CUSTOMERS.length > 0) {
    return (
      <section className="strip" aria-label="Restaurants running Omega">
        <p className="strip-label">Running service on Omega</p>
        <ul className="strip-row">
          {CONSENTED_CUSTOMERS.map(c => (
            <li key={c.name} className="strip-cust">
              <span className="strip-word">{c.name}</span>
              {(c.place || c.format) && <span className="strip-sub">{[c.format, c.place].filter(Boolean).join(' · ')}</span>}
            </li>
          ))}
        </ul>
      </section>
    )
  }
  return (
    <section className="strip" aria-label="Works with">
      <p className="strip-label">Works with what your counter already runs on</p>
      <ul className="strip-row">
        {WORKS_WITH.map(n => <li key={n} className="strip-word">{n}</li>)}
      </ul>
    </section>
  )
}

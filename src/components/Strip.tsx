import { CONSENTED_CUSTOMERS } from '@/content/customers'
import { LOGOS, type Logo } from '@/content/brand-marks'

/**
 * A logo at a height that gives it the same visual weight as the rest (equal area,
 * within limits), the way restroworks.com and toasttab.com size their logo rows.
 */
function Mark({ l }: { l: Logo }) {
  const h = Math.round(Math.min(50, Math.max(30, Math.sqrt(2000 / l.aspect))))
  return (
    <li className="mq-logo" title={`${l.n} · ${l.role}`}>
      <img src={l.file} alt={l.n} height={h} width={Math.round(h * l.aspect)} style={{ ['--h' as string]: `${h}px` }} loading="lazy" decoding="async" draggable={false} />
    </li>
  )
}

/**
 * The slot under the hero where attio.com shows customer logos.
 * Customer names render only from consented entries in src/content/customers.ts;
 * until there are any, it is a slow marquee of the integrations Omega actually has.
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
      <div className="mq">
        {/* two copies side by side; the track slides by one copy, so the loop is seamless */}
        <div className="mq-track">
          <ul className="mq-set">{LOGOS.map(l => <Mark key={l.n} l={l} />)}</ul>
          <ul className="mq-set" aria-hidden="true">{LOGOS.map(l => <Mark key={l.n} l={l} />)}</ul>
        </div>
      </div>
    </section>
  )
}

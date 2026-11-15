import { Icon } from './Icons'
import { CHANGELOG } from '@/content/changelog'

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

/** attio.com's dated changelog strip. Renders nothing until real entries exist. */
export function Changelog() {
  if (CHANGELOG.length === 0) return null
  return (
    <section className="section-tight" id="changelog">
      <div className="container">
        <div className="cl-head">
          <div className="eyebrow"><span className="dot" />Changelog</div>
          <h2 className="h-section">What shipped <span className="h-muted">recently.</span></h2>
        </div>
        <ol className="cl-grid">
          {CHANGELOG.slice(0, 4).map(e => {
            const body = (
              <>
                <time className="cl-date mono" dateTime={e.date}>{fmt(e.date)}</time>
                <h3>{e.title}</h3>
                <p>{e.summary}</p>
                {e.href && <span className="text-link">Read more <Icon.Arrow size={11} /></span>}
              </>
            )
            return (
              <li key={e.date + e.title} className="cl-item">
                {e.href ? <a href={e.href}>{body}</a> : body}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

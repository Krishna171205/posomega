import Link from 'next/link'
import { Nav } from './Nav'
import { Footer } from './Footer'

export type LegalSection = {
  heading: string
  body: string | string[]
}

export type LegalPageProps = {
  title: string
  italicTail: string
  updated: string
  intro?: string
  sections: LegalSection[]
}

export function LegalPage({ title, italicTail, updated, intro, sections }: LegalPageProps) {
  return (
    <>
      <Nav />
      <main className="legal">
        <div className="container legal-inner">
          <Link href="/" className="legal-back">← Back to home</Link>
          <div className="legal-meta">
            <span className="dot" /> Last updated · {updated}
          </div>
          <h1 className="h-display legal-title">
            {title}<br />
            <span className="h-italic">{italicTail}</span>
          </h1>
          {intro && <p className="lede legal-intro">{intro}</p>}
          <div className="legal-content">
            {sections.map((s, i) => (
              <section key={i}>
                <h2>{s.heading}</h2>
                {Array.isArray(s.body)
                  ? s.body.map((p, j) => <p key={j}>{p}</p>)
                  : <p>{s.body}</p>}
              </section>
            ))}
          </div>
          <div className="legal-footer-cta">
            <p>
              Questions? Write to{' '}
              <a href="mailto:hello@unifiednexgrade.com">hello@unifiednexgrade.com</a>
              {' '}— our team are former café operators, not lawyers, but we'll route you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

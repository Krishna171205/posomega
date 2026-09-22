import Link from 'next/link'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Icon } from '../Icons'
import type { MarketingPage } from '@/content/types'
import { pageLink, TEMPLATE_PAGE_BY_SLUG } from '@/content/registry'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

function Breadcrumb({ page }: { page: MarketingPage }) {
  return (
    <nav className="mk-crumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {page.parent && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={`/${page.parent.slug}`}>{page.parent.label}</Link>
        </>
      )}
      <span aria-hidden="true">/</span>
      <span aria-current="page">{page.crumb}</span>
    </nav>
  )
}

function Section({ section }: { section: MarketingPage['sections'][number] }) {
  if (section.kind === 'prose') {
    return (
      <section className="mk-block">
        <h2 className="h-section mk-h2">{section.heading}</h2>
        <div className="mk-prose">
          {section.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
    )
  }

  if (section.kind === 'cards') {
    return (
      <section className="mk-block">
        <h2 className="h-section mk-h2">{section.heading}</h2>
        {section.intro && <div className="mk-prose"><p>{section.intro}</p></div>}
        <div className="mk-cards">
          {section.cards.map((c, i) => (
            <div className="bento-card mk-card" key={i}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mk-block">
      <h2 className="h-section mk-h2">{section.heading}</h2>
      {section.intro && <div className="mk-prose"><p>{section.intro}</p></div>}
      <ol className="mk-steps">
        {section.steps.map((s, i) => (
          <li key={i}>
            <span className="mk-step-n">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function MarketingPageView({ page }: { page: MarketingPage }) {
  const related = page.related.map(pageLink).filter(Boolean) as NonNullable<ReturnType<typeof pageLink>>[]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(page))} />
      <Nav />
      <main className="mk">
        <div className="container mk-inner">
          <Breadcrumb page={page} />

          <header className="mk-hero">
            <div className="eyebrow"><span className="dot" />{page.eyebrow}</div>
            <h1 className="h-display mk-h1">
              {page.h1}
              {page.h1Tail && <><br /><span className="h-italic">{page.h1Tail}</span></>}
            </h1>
            <p className="lede mk-lede">{page.lede}</p>
            <div className="mk-cta-row">
              {page.primaryCta ? (
                page.primaryCta.external ? (
                  <a
                    href={page.primaryCta.href}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener"
                  >
                    {page.primaryCta.label} <Icon.ArrowUpRight size={12} />
                  </a>
                ) : (
                  <Link href={page.primaryCta.href} className="btn btn-primary">
                    {page.primaryCta.label} <Icon.Arrow size={12} />
                  </Link>
                )
              ) : (
                <Link href="/get-started" className="btn btn-primary">
                  Book a demo <Icon.Arrow size={12} />
                </Link>
              )}
              <Link href="/pricing" className="btn btn-secondary">See pricing</Link>
            </div>
          </header>

          {page.sections.map((s, i) => <Section key={i} section={s} />)}

          <section className="mk-block">
            <h2 className="h-section mk-h2">Common questions</h2>
            <div className="mk-faq">
              {page.faq.map((f, i) => (
                <div className="mk-faq-item" key={i}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="mk-block">
              <h2 className="h-section mk-h2">Related</h2>
              <div className="mk-related">
                {related.map(r => (
                  <Link href={r.href} className="mk-related-card" key={r.href}>
                    <h3>{r.label} <Icon.Arrow size={11} /></h3>
                    <p>{r.blurb}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mk-endcap">
            <h2 className="h-section">Stop wrestling <span className="h-italic">your POS.</span></h2>
            <p className="lede">
              Tell us about your outlet and we will show you the system running on your own menu.
            </p>
            <Link href="/get-started" className="btn btn-primary btn-lg">
              Book a demo <Icon.Arrow size={13} />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

/** Hub pages: /for, /features, /integrations. Lists every child page. */
export function HubPageView({
  crumb,
  eyebrow,
  h1,
  h1Tail,
  lede,
  childSlugs,
}: {
  crumb: string
  eyebrow: string
  h1: string
  h1Tail: string
  lede: string
  childSlugs: string[]
}) {
  const children = childSlugs
    .map(s => TEMPLATE_PAGE_BY_SLUG.get(s))
    .filter(Boolean) as MarketingPage[]

  return (
    <>
      <Nav />
      <main className="mk">
        <div className="container mk-inner">
          <nav className="mk-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{crumb}</span>
          </nav>

          <header className="mk-hero">
            <div className="eyebrow"><span className="dot" />{eyebrow}</div>
            <h1 className="h-display mk-h1">
              {h1}<br /><span className="h-italic">{h1Tail}</span>
            </h1>
            <p className="lede mk-lede">{lede}</p>
          </header>

          <div className="mk-related mk-hub-grid">
            {children.map(c => (
              <Link href={`/${c.slug}`} className="mk-related-card" key={c.slug}>
                <h3>{c.crumb} <Icon.Arrow size={11} /></h3>
                <p>{c.lede}</p>
              </Link>
            ))}
          </div>

          <section className="mk-endcap">
            <h2 className="h-section">Stop wrestling <span className="h-italic">your POS.</span></h2>
            <p className="lede">
              Tell us about your outlet and we will show you the system running on your own menu.
            </p>
            <Link href="/get-started" className="btn btn-primary btn-lg">
              Book a demo <Icon.Arrow size={13} />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

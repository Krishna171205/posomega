import Link from 'next/link'
import type { ReactNode } from 'react'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Icon } from '../Icons'
import { Peek } from '../crew/Peek'
import { Reveals } from '../Reveals'
import { MockView } from './Mocks'
import { OutletTabs } from './OutletTabs'
import type { MarketingPage, OutletExtras, OutletSection, Photo } from '@/content/types'
import { CONSENTED_CUSTOMERS } from '@/content/customers'
import { pageLink } from '@/content/registry'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

/**
 * Outlet-type page (/for/*). Same look as the rest of the site; each format gets its
 * own venue photo, live product window, copy and section order (`outlet.order`).
 */

const DEFAULT_ORDER: OutletSection[] = ['pains', 'tabs', 'outcomes', 'photos', 'prose', 'proof', 'india', 'faq', 'switch']

/** Lowercase a format name for mid-sentence use, keeping acronyms like QSR. */
const inSentence = (s: string) => (s === s.toUpperCase() ? s : s.toLowerCase())

const unsplash = (id: string, w: number) => `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`

function Img({ p, w, sizes, eager }: { p: Photo; w: number; sizes: string; eager?: boolean }) {
  return (
    <img
      src={unsplash(p.id, w)}
      srcSet={[w / 2, w, w * 1.5].map(x => `${unsplash(p.id, Math.round(x))} ${Math.round(x)}w`).join(', ')}
      sizes={sizes}
      alt={p.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export function OutletPageView({ page, siblings }: { page: MarketingPage & { outlet: OutletExtras }; siblings: MarketingPage[] }) {
  const o = page.outlet
  const proof = CONSENTED_CUSTOMERS.filter(c => c.format === o.format)
  const related = page.related.map(pageLink).filter(Boolean) as NonNullable<ReturnType<typeof pageLink>>[]

  const sections: Record<OutletSection, ReactNode> = {
    pains: (
      <section className="mk-block ol-pains-sec">
        <h2 className="h-section mk-h2">What makes {inSentence(o.short)} <span className="h-muted">hard to run</span></h2>
        <ul className="ol-pains">
          {o.pains.map(p => <li key={p}>{p}</li>)}
        </ul>
      </section>
    ),
    tabs: (
      <section className="mk-block ol-tabs-sec">
        <h2 className="h-section mk-h2">How PepperPe runs {inSentence(o.short)}</h2>
        <OutletTabs tabs={o.tabs} />
      </section>
    ),
    outcomes: (
      <section className="mk-block ol-outcomes-sec">
        <h2 className="h-section mk-h2">What changes on day one</h2>
        <div className="ol-outcomes">
          {o.outcomes.map(x => (
            <div className="ol-outcome" key={x.t}>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    photos: o.photos.strip.length > 0 ? (
      <div className="ol-photos" data-n={o.photos.strip.length}>
        {o.photos.strip.map((p, i) => (
          <figure key={p.id} className="ol-photo">
            <Img p={p} w={i === 0 ? 1200 : 720} sizes={i === 0 ? '(max-width: 720px) 92vw, 60vw' : '(max-width: 720px) 92vw, 30vw'} />
          </figure>
        ))}
      </div>
    ) : null,
    prose: (
      <>
        {page.sections.map(s => s.kind === 'prose' && (
          <section className="mk-block ol-prose" key={s.heading}>
            <h2 className="h-section mk-h2">{s.heading}</h2>
            <div className="mk-prose">{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
        ))}
      </>
    ),
    proof: proof.length > 0 ? (
      <section className="mk-block">
        <h2 className="h-section mk-h2">Running on PepperPe</h2>
        <ul className="ol-proof">
          {proof.map(c => <li key={c.name}><b>{c.name}</b>{c.place && <span className="muted">{c.place}</span>}</li>)}
        </ul>
      </section>
    ) : null,
    india: (
      <section className="ol-india" aria-label="Built for India">
        {['GST invoices', 'UPI, card and cash', 'Swiggy and Zomato orders', 'Tally export', 'Offline on Android'].map(t => (
          <span key={t}><Icon.Check size={12} /> {t}</span>
        ))}
      </section>
    ),
    faq: (
      <section className="mk-block ol-faq">
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
    ),
    switch: (
      <section className="mk-block ol-switch-sec">
        <h2 className="h-section mk-h2">Run a different format?</h2>
        <div className="ol-switch">
          {siblings.filter(s => s.slug !== page.slug).map(s => (
            <Link key={s.slug} href={`/${s.slug}`} className="ol-switch-a">
              {s.outlet?.short ?? s.crumb} <Icon.Arrow size={11} />
            </Link>
          ))}
        </div>
        {related.length > 0 && (
          <div className="mk-related">
            {related.map(r => (
              <Link href={r.href} className="mk-related-card" key={r.href}>
                <h3>{r.label} <Icon.Arrow size={11} /></h3>
                <p>{r.blurb}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(page))} />
      <Nav />
      <main className="mk ol">
        <div className="container ol-inner">
          <nav className="mk-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/for">Industries</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.crumb}</span>
          </nav>

          <header className="ol-hero">
            <div className="ol-hero-copy">
              <div className="eyebrow"><span className="dot" />{page.eyebrow}</div>
              <h1 className="h-display mk-h1">
                {page.h1}
                {page.h1Tail && <><br /><span className="h-muted">{page.h1Tail}</span></>}
              </h1>
              <p className="lede mk-lede">{page.lede}</p>
              <div className="mk-cta-row">
                <Link href="/get-started" className="btn btn-blue">Book a demo <Icon.Arrow size={12} /></Link>
              </div>
            </div>
            <div className="ol-hero-art">
              {o.photos.hero && (
                <figure className="ol-hero-photo">
                  <Img p={o.photos.hero} w={1100} sizes="(max-width: 960px) 92vw, 560px" eager />
                </figure>
              )}
              <div className="ol-hero-win has-peek">
                <Peek who={o.peek.who} say={o.peek.say} side="right" x="12%" enter="pop" />
                <MockView m={o.hero} />
              </div>
            </div>
          </header>

          {(o.order ?? DEFAULT_ORDER).map(k => sections[k] ? <div key={k} className={`ol-s ol-s-${k}`}>{sections[k]}</div> : null)}

          <section className="mk-endcap ol-endcap">
            <h2 className="h-section">See it on <span className="h-muted">your own menu.</span></h2>
            <p className="lede">Tell us about your outlet and we will set PepperPe up with your items, tables and stations for the demo.</p>
            <Link href="/get-started" className="btn btn-blue btn-lg">Book a demo <Icon.Arrow size={13} /></Link>
          </section>
        </div>
      </main>
      <Footer />
      <Reveals />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Pricing } from '@/components/Pricing'
import { Icon } from '@/components/Icons'
import { SITE, jsonLdScript } from '@/lib/seo'
import { pageLink } from '@/content/registry'

export const metadata: Metadata = {
  title: { absolute: 'Omega POS Pricing | Restaurant POS Cost in India' },
  description:
    'Omega POS pricing: Rs 1,499 per outlet per month for one location, Rs 3,499 for up to ten. No setup fee, no per-seat charge, no per-transaction fee.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'article',
    title: 'Omega POS Pricing | Restaurant POS Software Cost in India',
    description:
      'Rs 1,499 per outlet per month for a single location, Rs 3,499 for up to ten outlets. No setup fee, no per-seat charge, no per-transaction fee.',
    url: `${SITE}/pricing`,
  },
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE}/pricing` },
  ],
}

const FAQ = [
  {
    q: 'Is Omega priced per outlet or per terminal?',
    a: 'Per outlet. Staff logins, terminals and transactions are unlimited within an outlet, so putting a second till on a busy counter costs nothing extra in software. This is worth checking in any quote you compare against, because per-terminal licensing is common and changes the real cost substantially once a counter has more than one screen.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No. Onboarding is included, and that includes migrating your menu, modifier groups, customers and inventory off your existing POS. We do not quote migration as a separate project.',
  },
  {
    q: 'Do you take a cut of each transaction?',
    a: 'No. There is no per-transaction fee from Omega. Your payment provider charges its own merchant discount rate, which is a separate arrangement between you and them, and we do not mark it up or take a share of it.',
  },
  {
    q: 'What does annual billing save?',
    a: 'Twenty per cent. Starter is Rs 1,499 per outlet per month billed monthly, or Rs 1,199 billed annually. Growth is Rs 3,499 monthly or Rs 2,799 annually.',
  },
  {
    q: 'What happens if I go over ten outlets?',
    a: 'Growth covers up to ten. Beyond that, Enterprise is priced per chain rather than per outlet and includes the multi-outlet command centre, regional menu overrides and per-brand reporting. Tell us your store count and we will quote against it.',
  },
  {
    q: 'Am I locked into a contract?',
    a: 'Monthly billing is month to month. Annual billing is a twelve-month commitment in exchange for the twenty per cent discount, and the free hardware offer on Growth is tied to that twelve-month commitment because the hardware has a real cost.',
  },
  {
    q: 'Do I have to buy your hardware?',
    a: 'No. Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard thermal printers over Bluetooth, USB or network. Our hardware is optional. Most existing restaurants keep the printer and cash drawer they already have.',
  },
]

const RELATED = ['restaurant-billing-software', 'for/cafes', 'for/cloud-kitchens', 'features/offline-mode']

export default function PricingPage() {
  const related = RELATED.map(pageLink).filter(Boolean) as NonNullable<ReturnType<typeof pageLink>>[]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumb)} />
      <Nav />
      <main className="mk">
        <div className="container mk-inner">
          <nav className="mk-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Pricing</span>
          </nav>

          <header className="mk-hero">
            <div className="eyebrow"><span className="dot" />Pricing</div>
            <h1 className="h-display mk-h1">
              What Omega costs<br /><span className="h-italic">and what it does not.</span>
            </h1>
            <p className="lede mk-lede">
              Rs 1,499 per outlet per month for a single location, Rs 3,499 per outlet for up to ten,
              custom for chains. No setup fee, no per-seat charge, and no cut of your transactions.
            </p>
          </header>
        </div>

        <Pricing />

        <div className="container mk-inner">
          <section className="mk-block">
            <h2 className="h-section mk-h2">What the price includes</h2>
            <div className="mk-prose">
              <p>
                Every plan includes the whole system rather than a billing core with the useful parts
                sold separately. GST-compliant invoicing, KOT routing, the kitchen display, recipe-level
                inventory, offline mode, UPI and card collection, and the reporting are all in the base
                price. The plans differ on outlet count, how many aggregator integrations are connected,
                and whether you get the demand-prediction and multi-outlet command-centre layers.
              </p>
              <p>
                Migration from your existing POS is included in onboarding. So is support: email on
                Starter, priority on Growth. We do not charge for the kitchen display per screen, which
                is a common line item elsewhere and a strange one, given that a second screen in a
                kitchen costs us nothing.
              </p>
            </div>
          </section>

          <section className="mk-block">
            <h2 className="h-section mk-h2">Common questions</h2>
            <div className="mk-faq">
              {FAQ.map((f, i) => (
                <div className="mk-faq-item" key={i}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

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

          <section className="mk-endcap">
            <h2 className="h-section">Stop wrestling <span className="h-italic">your POS.</span></h2>
            <p className="lede">
              Tell us about your outlet and we will show you the system running on your own menu.
            </p>
            <Link href="/get-started" className="btn btn-blue btn-lg">
              Book a demo <Icon.Arrow size={13} />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

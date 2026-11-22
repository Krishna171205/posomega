import Link from 'next/link'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Icon } from '../Icons'
import { MockView } from '../outlet/Mocks'
import { QrDemo } from './QrDemo'
import { QrCompare } from './QrCompare'
import { QR_MENU_PAGE as page } from '@/content/features'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

/*
 * /qr-menu: the QR menu and table ordering landing page. Built to be compared with
 * menu-only QR tools, so it leads with the part they do not have: the order arriving
 * in the kitchen. Every claim maps to PepperPe + Grabbit as shipped (see features.ts).
 * Photos are Unsplash (free licence), the same source as the /for pages.
 */

const GRABBIT = 'https://letsgrabbit.com'
const u = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ''}&q=72&auto=format&fit=crop`

function Photo({ id, alt, w, h, className, sizes = '(max-width: 900px) 100vw, 50vw' }: {
  id: string; alt: string; w: number; h: number; className?: string; sizes?: string
}) {
  return (
    <img
      className={className}
      src={u(id, w, h)}
      srcSet={[0.5, 1, 1.5].map(f => `${u(id, Math.round(w * f), Math.round(h * f))} ${Math.round(w * f)}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
    />
  )
}

const STEPS = [
  { t: 'Print a code per table', d: 'Ready to print, from your dashboard.' },
  { t: 'Guests scan and order', d: 'Your menu opens with the table already set.' },
  { t: 'The kitchen gets the ticket', d: 'Printed at the right station, table number on it.' },
  { t: 'Guests pay at the table', d: 'By UPI from the same page, or with staff.' },
]

const OUTLETS = [
  { href: '/for/cafes', t: 'Cafés', d: 'Table orders, pre-orders, coins.', id: 'photo-1509042239860-f550ce710b93', alt: 'Latte with leaf art on a wooden café table' },
  { href: '/for/qsr', t: 'Quick service', d: 'Shorter queues at the counter.', id: 'photo-1606491956689-2ea866880c84', alt: 'Pav bhaji with buttered pav' },
  { href: '/for/fine-dining', t: 'Fine dining', d: 'Call waiter and pay at table.', id: 'photo-1606660023296-81d67734170a', alt: 'A dining table set with plates, glasses and candles' },
  { href: '/for/bars', t: 'Bars & breweries', d: 'Rounds straight to the bar.', id: 'photo-1785765991779-4003970f84a6', alt: 'Beer taps lined up on a dark bar counter' },
  { href: '/for/food-courts', t: 'Food courts', d: 'Order and collect, no queue.', id: 'photo-1559329007-40df8a9345d8', alt: 'A busy dining hall seen from above' },
  { href: '/for/bakeries', t: 'Bakeries', d: 'Pickup pre-orders for cakes and bread.', id: 'photo-1517433670267-08bbd4be890f', alt: 'Bakery counter with fresh bread and pastries' },
]

function Points({ items }: { items: string[] }) {
  return (
    <ul className="qm-points">
      {items.map(t => <li key={t}><Icon.Check size={13} /> {t}</li>)}
    </ul>
  )
}

export function QrMenuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(page))} />
      <Nav />
      <main className="qm">
        <div className="container qm-inner">
          <nav className="mk-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/features">Features</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.crumb}</span>
          </nav>

          <header className="qm-hero" id="try">
            <div className="qm-hero-copy">
              <h1 className="qm-h1">QR menu and table ordering, straight to your kitchen</h1>
              <p className="qm-lede">Guests scan, order and pay from their phone. Your kitchen gets the ticket with the table number.</p>
              <div className="mk-cta-row">
                <Link href="/get-started" className="btn btn-blue">Book a demo <Icon.Arrow size={12} /></Link>
                <a href={GRABBIT} className="btn btn-secondary" target="_blank" rel="noopener">See Grabbit <Icon.ArrowUpRight size={12} /></a>
              </div>
              <ul className="qm-facts">
                <li><Icon.Check size={13} /> No app for guests</li>
                <li><Icon.Check size={13} /> No commission on Grabbit orders</li>
                <li><Icon.Check size={13} /> Runs on the PepperPe POS</li>
              </ul>
              <div className="qm-scan">
                <img src="/img/qr-menu-try.svg" alt="QR code that opens this demo on your phone" width={88} height={88} />
                <p>Scan to try the guest side on your own phone.</p>
              </div>
            </div>
            <div className="qm-hero-demo">
              <QrDemo />
            </div>
          </header>

          {/* The menu */}
          <section className="qm-band">
            <div className="qm-collage" aria-hidden="false">
              <Photo className="qm-c-main" id="photo-1588644525273-f37b60d78512" alt="A thali with rice, curries and sides on a dark table" w={720} h={560} />
              <Photo className="qm-c-a" id="photo-1511421661275-e389971ff6ba" alt="Grilled sandwich with fries on a wooden board" w={420} h={300} sizes="(max-width: 900px) 50vw, 22vw" />
              <Photo className="qm-c-b" id="photo-1589778655375-3e622a9fc91c" alt="A colourful thali with bread on a red cloth" w={420} h={300} sizes="(max-width: 900px) 50vw, 22vw" />
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">A menu guests want to order from</h2>
              <p className="qm-sub">Built once in PepperPe, shown on every table.</p>
              <Points items={['Photos and veg marks', 'Variations and add-ons', 'One menu for counter, table and online']} />
            </div>
          </section>

          {/* Scan */}
          <section className="qm-band is-flip">
            <div className="qm-duo">
              <Photo className="qm-duo-a" id="photo-1652345408103-7fbe3dd59324" alt="A QR code stand on a café table" w={560} h={700} sizes="(max-width: 900px) 50vw, 25vw" />
              <Photo className="qm-duo-b" id="photo-1595079835357-a94a13cab10c" alt="A hand holding a phone that is scanning a QR code" w={560} h={700} sizes="(max-width: 900px) 50vw, 25vw" />
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">Scan, order, done. No app.</h2>
              <p className="qm-sub">Opens in the phone browser with the table already set.</p>
              <Points items={['One code per table', 'Works in any phone browser', 'Straight into the kitchen queue']} />
            </div>
          </section>

          {/* Table tent */}
          <section className="qm-tent-band">
            <Photo className="qm-tent-bg" id="photo-1579018183467-a60b8dc9dd78" alt="A bright café with tables by tall windows" w={1400} h={640} sizes="100vw" />
            <div className="qm-tent-wrap">
              <div className="qm-tent" aria-label="Example table card">
                <span className="qm-tent-cafe">Brewbari Café</span>
                <img src="/img/qr-menu-try.svg" alt="" width={150} height={150} />
                <strong>Scan to order</strong>
                <span className="qm-tent-table">Table 12</span>
                <span className="qm-tent-small">Menu, order and pay from your phone</span>
              </div>
              <div className="qm-tent-copy">
                <h2 className="qm-h2">Print-ready for every table</h2>
                <p className="qm-sub">One code per table, printed from your dashboard.</p>
              </div>
            </div>
          </section>

          {/* Floor */}
          <section className="qm-band">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1719573019827-d06944a0c2be" alt="A waiter carrying plates through a busy restaurant" w={760} h={620} />
              <div className="qm-pm-mock"><MockView m={{ kind: 'floor', title: 'Floor · Main hall' }} /></div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">Fewer trips across the floor</h2>
              <p className="qm-sub">Guests call a waiter or pay from their phone.</p>
              <Points items={['Call waiter', 'UPI at the table', 'Alerts on your floor screen']} />
            </div>
          </section>

          <section className="qm-block">
            <h2 className="qm-h2">Most QR menus stop at the menu</h2>
            <p className="qm-sub">Other QR tools take the order. PepperPe also runs the kitchen.</p>
            <QrCompare />
          </section>

          {/* Grabbit page */}
          <section className="qm-band is-flip">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1550731358-491ded4af838" alt="A hand holding a cup of latte" w={760} h={620} />
              <div className="qm-pm-mock">
                <MockView m={{ kind: 'preorder', title: 'Grabbit · Pickup orders', orders: [{ t: '8:40', n: '2× Masala chai', who: 'Riya' }, { t: '8:45', n: 'Filter coffee, sandwich', who: 'Arjun' }, { t: '8:50', n: '3× Cold coffee', who: 'Office order' }] }} />
              </div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">Your own ordering page, no commission</h2>
              <p className="qm-sub">Regulars order ahead for pickup from your café&rsquo;s Grabbit page.</p>
              <Points items={['Your page on letsgrabbit.com', 'Pickup slots you control', 'Zero commission']} />
              <a href={GRABBIT} className="qm-textlink" target="_blank" rel="noopener">See Grabbit <Icon.ArrowUpRight size={12} /></a>
            </div>
          </section>

          {/* Come back */}
          <section className="qm-block">
            <h2 className="qm-h2">Then they come back</h2>
            <p className="qm-sub">Every QR order is a guest you can bring back.</p>
            <div className="qm-cards">
              <article className="qm-card">
                <Photo id="photo-1593443320739-77f74939d0da" alt="Cappuccino with latte art on a saucer" w={560} h={360} sizes="(max-width: 900px) 100vw, 33vw" />
                <div><h3>Coins on every order</h3><p>Coins, wallet top-ups and referrals.</p></div>
              </article>
              <article className="qm-card">
                <Photo id="photo-1565895405140-6b9830a88c19" alt="A guest eating at a set restaurant table" w={560} h={360} sizes="(max-width: 900px) 100vw, 33vw" />
                <div><h3>Tables booked ahead</h3><p>Reservations and a waitlist on your floor plan.</p></div>
              </article>
              <article className="qm-card">
                <Photo id="photo-1606660023296-81d67734170a" alt="A dining table set with plates, glasses and candles" w={560} h={360} sizes="(max-width: 900px) 100vw, 33vw" />
                <div><h3>Reviews where they count</h3><p>Google review requests from your own WhatsApp.</p></div>
              </article>
            </div>
          </section>

          <section className="qm-block">
            <h2 className="qm-h2">Live on your tables in an afternoon</h2>
            <ol className="qm-steps">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <span className="qm-step-n" aria-hidden="true">{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="qm-block">
            <h2 className="qm-h2">Built for the way you serve</h2>
            <div className="qm-outlets">
              {OUTLETS.map(o => (
                <Link key={o.href} href={o.href} className="qm-outlet">
                  <Photo id={o.id} alt={o.alt} w={520} h={340} sizes="(max-width: 640px) 100vw, (max-width: 1020px) 50vw, 33vw" />
                  <div>
                    <h3>{o.t} <Icon.Arrow size={11} /></h3>
                    <p>{o.d}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="ol-india" aria-label="Built for India">
            {['UPI at the table', 'Veg and non-veg marks', 'GST bills', 'Swiggy and Zomato in the same queue', 'Works on any phone browser'].map(t => (
              <span key={t}><Icon.Check size={12} /> {t}</span>
            ))}
          </section>

          <section className="qm-block qm-faq">
            <div className="qm-faq-side">
              <h2 className="qm-h2">Common questions</h2>
              <p className="qm-sub">Something else on your mind? We will show it running on your own menu.</p>
              <Link href="/get-started" className="btn btn-secondary">Talk to sales <Icon.Arrow size={12} /></Link>
            </div>
            <div className="qm-faq-list">
              {page.faq.map((f, i) => (
                <details key={f.q} name="qm-faq" className="qm-faq-item" open={i === 0}>
                  <summary>
                    <h3>{f.q}</h3>
                    <span className="qm-faq-icon" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mk-endcap">
            <h2 className="h-section">Put your menu on every table</h2>
            <p className="lede">We set it up with you, menu included.</p>
            <Link href="/get-started" className="btn btn-blue btn-lg">Book a demo <Icon.Arrow size={13} /></Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Nav } from '../Nav'
import { Footer } from '../Footer'
import { Icon } from '../Icons'
import { MockView } from '../outlet/Mocks'
import { QrCompare, type CompareRow } from '../qrmenu/QrCompare'
import { TapDemo } from './TapDemo'
import { NFC_TAGS_PAGE as page } from '@/content/features'
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo'

/*
 * /nfc-table-tags: one tap at the table for menu, Wi-Fi, a wallet stamp card and reviews,
 * set against tap-only table apps by what they cannot do: order, pay and run the kitchen.
 * Layout classes are shared with /qr-menu (qrmenu.css); NFC-only pieces live in nfc.css.
 * Photos are Unsplash (free licence), the same ones verified for /qr-menu.
 */

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

function Points({ items }: { items: string[] }) {
  return (
    <ul className="qm-points">
      {items.map(t => <li key={t}><Icon.Check size={13} /> {t}</li>)}
    </ul>
  )
}

const NFC = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 8.5a5 5 0 0 1 0 7" /><path d="M9.5 6a9 9 0 0 1 0 12" /><path d="M13 3.5a13 13 0 0 1 0 17" />
  </svg>
)

const G = (
  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6c1.9-5.6 7.2-9.8 13.5-9.8Z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4 6.8-10 6.8-17.2Z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6Z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6C6.6 42.6 14.6 48 24 48Z" />
  </svg>
)

/** One card in the bento: a small piece of the real guest UI, then a title and a line. */
function Tile({ className, t, d, children }: { className: string; t: string; d: string; children: ReactNode }) {
  return (
    <li className={`nb ${className}`}>
      <div className="nb-art" aria-hidden="true">{children}</div>
      <div className="nb-copy"><h3>{t}</h3><p>{d}</p></div>
    </li>
  )
}

function Bento() {
  return (
    <ul className="nb-grid">
      <Tile className="nb-order" t="Order from the table" d="The tap that opens the menu sends the order to the kitchen, table number on the ticket.">
        <div className="nb-order-ui">
          {[['photo-1593443320739-77f74939d0da', 'Filter coffee', '₹70', '1'], ['photo-1511421661275-e389971ff6ba', 'Veg sandwich', '₹160', 'Add']].map(([id, n, p, a]) => (
            <div key={n} className="nb-dish"><img src={u(id, 96, 96)} alt="" /><span><b>{n}</b><small>{p}</small></span><i className={a === 'Add' ? undefined : 'is-on'}>{a}</i></div>
          ))}
          <div className="nb-cart"><span>1 item · ₹70</span><b>Place order</b></div>
        </div>
        <div className="nb-kot">
          <b>KOT #412</b><span>TABLE 4 · TAP</span><span>1 × Filter coffee</span><em>8:42 am</em>
        </div>
      </Tile>
      <Tile className="nb-wifi" t="Instant Wi-Fi" d="No more asking the staff for the password.">
        <div className="nb-alert"><p>Join Wi-Fi network “Cafe_Guest”?</p><span><i>Cancel</i><i className="is-on">Join</i></span></div>
      </Tile>
      <Tile className="nb-stamps" t="Stamp card in their wallet" d="Apple Wallet and Google Wallet.">
        <div className="nb-pass"><div><b>Raydee Café</b><span>7/8</span></div><ol>{Array.from({ length: 8 }, (_, i) => <li key={i} className={i < 7 ? 'is-on' : undefined} />)}</ol></div>
      </Tile>
      <Tile className="nb-rate" t="Rate your visit" d="You hear first. Every guest gets the Google link.">
        <div className="nb-stars"><span>★★★★★</span><i>{G} Post on Google</i></div>
      </Tile>
      <Tile className="nb-games" t="Games while they wait" d="Ludo, sudoku, 2048 and tic-tac-toe.">
        <div className="nb-gv">
          <span className="td-gv td-gv-ttt"><i>X</i><i>O</i><i /><i /><i>X</i><i /><i>O</i><i /><i>X</i></span>
          <span className="td-gv td-gv-ludo" />
          <span className="td-gv td-gv-sudoku"><i>5</i><i /><i>3</i><i /><i>7</i><i /><i>1</i><i /><i>9</i></span>
          <span className="td-gv td-gv-2048"><i>2</i><i>4</i><i>8</i><i>16</i></span>
        </div>
      </Tile>
      <Tile className="nb-menu" t="A menu they want to order from" d="Photos, veg marks, tags and today’s prices, changed once in PepperPe.">
        <div className="nb-photos">
          {[['photo-1606491956689-2ea866880c84', 'Pav bhaji', '₹180', 'Bestseller'], ['photo-1509042239860-f550ce710b93', 'Masala chai', '₹40', ''], ['photo-1511421661275-e389971ff6ba', 'Veg sandwich', '₹160', 'Jain option']].map(([id, n, p, tag]) => (
            <figure key={n}><img src={u(id, 260, 220)} alt="" />{tag && <em>{tag}</em>}<figcaption><span className="nb-veg" />{n}<b>{p}</b></figcaption></figure>
          ))}
        </div>
      </Tile>
      <Tile className="nb-coins" t="Coins on every order" d="Spent on the next visit.">
        <div className="nb-coin"><span className="nb-coin-c">₹</span><b>+12 coins</b><small>Balance 120</small></div>
      </Tile>
      <Tile className="nb-insta" t="Your Instagram" d="One tap to follow your café.">
        <div className="nb-ig"><span className="nb-ig-logo" /><b>@yourcafe</b><i>Follow</i></div>
      </Tile>
    </ul>
  )
}

const COMPARE: CompareRow[] = [
  { row: 'Menu on the guest’s phone', why: 'No printed menus to reprint when a price changes.', cells: [true] },
  { row: 'Wi-Fi in one tap', why: 'Nobody asks the staff for the password again.', cells: [true] },
  { row: 'Stamp card in their wallet', why: 'The card is on their phone, not lost in a pocket.', cells: [true] },
  { row: 'Feedback straight to you', why: 'Hear about a bad visit before Google does.', cells: [true] },
  { row: 'Google review link for every guest', why: 'Asking only happy guests breaks Google’s rules and can cost you reviews.', cells: ['Often happy guests only'] },
  { row: 'Order from the table, to the kitchen', why: 'The tap that opens the menu also places the order.', cells: [false] },
  { row: 'Call a waiter', why: 'Requests show on the floor screen.', cells: [false] },
  { row: 'Pay by UPI at the table', why: 'Tables free up as soon as the meal ends.', cells: [false] },
  { row: 'GST bill and stock from the same order', why: 'One system for the table, the counter and the books.', cells: [false] },
  { row: 'Staff clock in on the same tags', why: 'Attendance without a separate punch machine.', cells: [false] },
]

const STEPS = [
  { t: 'Tell us your tables', d: 'How many, and where they are.' },
  { t: 'We send the stands', d: 'Set to your café, one per table.' },
  { t: 'Guests tap', d: 'Menu, Wi-Fi, rewards and reviews open.' },
  { t: 'They come back', d: 'Stamps, coins and offers bring them in.' },
]

export function NfcPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(page))} />
      <Nav />
      <main className="qm">
        <div className="container qm-inner">
          <header className="qm-hero">
            <div className="qm-hero-copy">
              <h1 className="qm-h1">One tap at the table. Menu, Wi-Fi, rewards and reviews.</h1>
              <p className="qm-lede">Guests tap their phone on the stand and your café opens. No app. Then they order and pay from the same page.</p>
              <div className="mk-cta-row">
                <Link href="/get-started" className="btn btn-blue">Book a demo <Icon.Arrow size={12} /></Link>
                <Link href="/get-started" className="btn btn-secondary">Talk to sales</Link>
              </div>
              <ul className="qm-facts">
                <li><Icon.Check size={13} /> No app for guests</li>
                <li><Icon.Check size={13} /> Stands supplied and set up</li>
                <li><Icon.Check size={13} /> Runs on the PepperPe POS</li>
              </ul>
            </div>
            <div className="qm-hero-demo">
              <TapDemo />
            </div>
          </header>

          <section className="qm-block">
            <h2 className="qm-h2">Everything at the table, from one tap</h2>
            <p className="qm-sub">Replaces paper menus, Wi-Fi cards, punch cards and review cards.</p>
            <Bento />
          </section>

          {/* Stamp card */}
          <section className="qm-band">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1593443320739-77f74939d0da" alt="Cappuccino with latte art on a saucer" w={760} h={620} />
              <div className="qm-pm-mock nf-pass" aria-label="Example wallet stamp card: 7 of 8 stamps">
                <div className="nf-pass-head">
                  <span className="nf-pass-logo" aria-hidden="true">R</span>
                  <b>Raydee Café</b>
                  <span className="nf-pass-field is-right"><small>Stamps</small>7/8</span>
                </div>
                <ol className="nf-pass-strip" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, i) => <li key={i} className={i < 7 ? 'is-on' : 'is-free'}>{i === 7 && 'Free'}</li>)}
                </ol>
                <div className="nf-pass-foot">
                  <span className="nf-pass-field"><small>Reward</small>Free coffee</span>
                  <span className="nf-pass-field"><small>Member</small>Riya S.</span>
                  <span className="nf-pass-code"><img src="/img/qr-menu-try.svg" alt="" width={46} height={46} /></span>
                </div>
              </div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">A loyalty card they keep</h2>
              <p className="qm-sub">Joining is one more tap. The card saves to Apple Wallet or Google Wallet.</p>
              <Points items={['Rewards you set, like a free coffee at 8', 'Stamps on every order', 'See who comes back and how often']} />
            </div>
          </section>

          {/* Feedback */}
          <section className="qm-band is-flip">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1565895405140-6b9830a88c19" alt="A guest eating at a set restaurant table" w={760} h={620} />
              <div className="qm-pm-mock nf-note" aria-label="Example feedback alert">
                <span className="nf-note-stars" aria-hidden="true">★★☆☆☆</span>
                <b>Table 4 · 2 stars</b>
                <p>“Coffee came out cold.”</p>
                <span className="nf-note-meta">Sent to you now · Google link offered</span>
              </div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">Hear it before Google does</h2>
              <p className="qm-sub">Every rating reaches you. Every guest gets the Google link.</p>
              <Points items={['Low ratings land with you right away', 'Google review link for all, as Google requires', 'Coins for guests who leave feedback']} />
            </div>
          </section>

          {/* Stand */}
          <section className="qm-tent-band">
            <Photo className="qm-tent-bg" id="photo-1579018183467-a60b8dc9dd78" alt="A bright café with tables by tall windows" w={1400} h={640} sizes="100vw" />
            <div className="qm-tent-wrap">
              <div className="qm-tent nf-stand" aria-label="Example NFC table stand">
                <span className="qm-tent-cafe">Raydee Café</span>
                <span className="nf-stand-nfc">{NFC}</span>
                <strong>Tap or scan</strong>
                <img src="/img/qr-menu-try.svg" alt="" width={96} height={96} />
                <span className="qm-tent-table">Table 4</span>
              </div>
              <div className="qm-tent-copy">
                <h2 className="qm-h2">We send the stands</h2>
                <p className="qm-sub">NFC and QR on every stand, set to your café and table.</p>
              </div>
            </div>
          </section>

          {/* Order and pay */}
          <section className="qm-band">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1719573019827-d06944a0c2be" alt="A waiter carrying plates through a busy restaurant" w={760} h={620} />
              <div className="qm-pm-mock"><MockView m={{ kind: 'floor', title: 'Floor · Main hall' }} /></div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">The same tap takes the order</h2>
              <p className="qm-sub">Straight to the kitchen with the table number.</p>
              <Points items={['Order from the table', 'Call a waiter', 'Pay by UPI']} />
              <Link href="/qr-menu" className="qm-textlink">See table ordering <Icon.Arrow size={11} /></Link>
            </div>
          </section>

          <section className="qm-block">
            <h2 className="qm-h2">Tap pages stop at the tap</h2>
            <p className="qm-sub">Others open a page. PepperPe also runs the order.</p>
            <QrCompare cols={['Tap-only table apps']} rows={COMPARE} />
          </section>

          {/* Staff */}
          <section className="qm-band is-flip">
            <div className="qm-photo-mock">
              <Photo className="qm-pm-photo" id="photo-1550731358-491ded4af838" alt="A hand holding a cup of latte" w={760} h={620} />
              <div className="qm-pm-mock nf-note" aria-label="Example attendance entry">
                <span className="nf-note-in">Clocked in</span>
                <b>Ravi · Barista</b>
                <p>8:02 am · at the outlet</p>
                <span className="nf-note-meta">Tag by the counter</span>
              </div>
            </div>
            <div className="qm-band-copy">
              <h2 className="qm-h2">Your staff tap in too</h2>
              <p className="qm-sub">A tag by the counter clocks shifts in and out.</p>
              <Points items={['Tap in, tap out', 'Checks they are on site', 'Shifts in your attendance report']} />
            </div>
          </section>

          <section className="qm-block">
            <h2 className="qm-h2">On your tables this week</h2>
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

          <section className="qm-block qm-faq">
            <div className="qm-faq-side">
              <h2 className="qm-h2">Common questions</h2>
              <p className="qm-sub">We will show it running on your own menu.</p>
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
            <h2 className="h-section">Put one tap on every table</h2>
            <p className="lede">We send the stands and set up your page.</p>
            <Link href="/get-started" className="btn btn-blue btn-lg">Book a demo <Icon.Arrow size={13} /></Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

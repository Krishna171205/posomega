import { Peek } from './crew/Peek'

const COLS: { h: string; links: { href: string; t: string; ext?: boolean }[] }[] = [
  {
    h: 'Platform',
    links: [
      { href: '/features/billing-and-kot', t: 'Billing & KOT' },
      { href: '/features/kitchen-display', t: 'Kitchen display' },
      { href: '/features/inventory-and-forecasting', t: 'Inventory' },
      { href: '/features/offline-mode', t: 'Offline mode' },
      { href: '/app', t: 'Android app' },
    ],
  },
  {
    h: 'Solutions',
    links: [
      { href: '/for/cafes', t: 'Cafés' },
      { href: '/for/qsr', t: 'QSR' },
      { href: '/for/fine-dining', t: 'Fine dining' },
      { href: '/for/cloud-kitchens', t: 'Cloud kitchens' },
      { href: '/for/bars', t: 'Bars & lounges' },
    ],
  },
  {
    h: 'Integrations',
    links: [
      { href: '/integrations', t: 'All integrations' },
      { href: '/integrations/swiggy-zomato', t: 'Swiggy & Zomato' },
      { href: '/integrations/upi-and-payments', t: 'UPI & payments' },
      { href: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega', t: 'Google Play', ext: true },
    ],
  },
  {
    h: 'Resources',
    links: [
      { href: '/restaurant-billing-software', t: 'Restaurant billing software' },
      { href: '/gst-billing-software-for-restaurants', t: 'GST billing' },
      { href: '/#faq', t: 'FAQ' },
      { href: 'mailto:security@unifiednexgrade.com', t: 'Security' },
    ],
  },
  {
    h: 'Company',
    links: [
      { href: '/pricing', t: 'Pricing' },
      { href: '/get-started', t: 'Contact' },
      { href: 'mailto:careers@unifiednexgrade.com', t: 'Careers' },
      { href: 'mailto:hello@unifiednexgrade.com', t: 'Press' },
    ],
  },
]

/** `crew` adds the ink characters waving over the top edge (homepage only). */
export function Footer({ crew = false }: { crew?: boolean }) {
  return (
    <footer className={`footer ${crew ? 'has-peek' : ''}`}>
      {crew && (
        <>
          <Peek who="chef" say="Kitchen’s closing!" side="left" x="7%" enter="hat" />
          <Peek who="server" say="Thanks for stopping by." side="left" x="calc(50% - 56px)" />
          <Peek who="captain" say="See you at service!" side="right" x="7%" enter="lean" />
        </>
      )}
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="nav-logo"><span className="glyph" aria-hidden="true">Ω</span><span>Omega</span></a>
            <p>Restaurant point of sale, built in India for Indian kitchens.</p>
          </div>
          {COLS.map(c => (
            <div key={c.h} className="footer-col">
              <h2>{c.h}</h2>
              <ul>
                {c.links.map(l => (
                  <li key={l.href}>
                    <a href={l.href} {...(l.ext ? { target: '_blank', rel: 'noopener' } : {})}>{l.t}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Unified Nexgrade Pvt. Ltd. · Delhi NCR</span>
          <nav className="footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/cookies">Cookies</a>
            <a href="/dpdp">DPDP</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

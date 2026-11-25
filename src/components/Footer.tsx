import { Peek } from './crew/Peek'
import { FooterColumns, type FooterCol } from './FooterColumns'

const COLS: FooterCol[] = [
  {
    h: 'Platform',
    links: [
      { href: '/features/billing-and-kot', t: 'Billing & KOT' },
      { href: '/features/kitchen-display', t: 'Kitchen display' },
      { href: '/features/inventory-and-forecasting', t: 'Inventory' },
      { href: '/features/offline-mode', t: 'Offline mode' },
      { href: '/qr-menu', t: 'QR menu & ordering' },
      { href: '/nfc-table-tags', t: 'NFC table tags' },
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
      { href: '/for/bars', t: 'Bars & breweries' },
      { href: '/for/food-courts', t: 'Food courts' },
      { href: '/for/bakeries', t: 'Bakeries & desserts' },
      { href: '/for/pizzerias', t: 'Pizzerias' },
      { href: '/for/chains', t: 'Chains' },
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
      { href: '/tools', t: 'Free tools' },
      { href: '/#faq', t: 'FAQ' },
      { href: 'mailto:security@unifiednexgrade.com', t: 'Security' },
    ],
  },
  {
    h: 'Company',
    links: [
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
            <a href="/" className="nav-logo"><span className="glyph" aria-hidden="true">Ω</span><span>PepperPe</span></a>
            <p>Restaurant point of sale, built in India for Indian kitchens.</p>
          </div>
          <FooterColumns cols={COLS} />
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

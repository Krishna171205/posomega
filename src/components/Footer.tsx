export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              <span className="glyph">Ω</span>
              <span>Omega</span>
            </a>
            <p className="desc">
              The point of sale, perfected for restaurants. Built in Bangalore, running in 19 cities.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map(s => (
                <a key={s} href="#" style={{
                  width: 32, height: 32, borderRadius: 8, background: 'var(--card-2)',
                  border: '1px solid var(--line)', display: 'grid', placeItems: 'center',
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                }}>{s.charAt(0)}</a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#product">Orders & POS</a></li>
              <li><a href="#product">Inventory & AI</a></li>
              <li><a href="#features">Payments</a></li>
              <li><a href="#hardware">Hardware</a></li>
              <li><a href="#integrations">Integrations</a></li>
              <li><a href="#features">What's new</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Industries</h5>
            <ul>
              <li><a href="#industries">Cafés</a></li>
              <li><a href="#industries">QSR</a></li>
              <li><a href="#industries">Fine dining</a></li>
              <li><a href="#industries">Cloud kitchens</a></li>
              <li><a href="#industries">Bars & lounges</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#features">About</a></li>
              <li><a href="mailto:careers@unifiednexgrade.com">Careers <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>14 OPEN</span></a></li>
              <li><a href="mailto:hello@unifiednexgrade.com">Press</a></li>
              <li><a href="#cta">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="#faq">Docs</a></li>
              <li><a href="#faq">API</a></li>
              <li><a href="#faq">Help centre</a></li>
              <li><a href="#cta">Status</a></li>
              <li><a href="mailto:security@unifiednexgrade.com">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-outro">
          <div className="footer-wordmark-huge">omega</div>

          <div className="footer-bottom">
            <span>© 2026 Unified Nexgrade Pvt. Ltd. · Delhi NCR</span>
            <div className="footer-legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/cookies">Cookies</a>
              <a href="/dpdp">DPDP</a>
            </div>
            <span className="footer-status">
              <span className="pulse" /> v 0.1.0 · all systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

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
              <li><a href="#">Orders & POS</a></li>
              <li><a href="#">Inventory & AI</a></li>
              <li><a href="#">Payments</a></li>
              <li><a href="#">Hardware</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">What's new</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Industries</h5>
            <ul>
              <li><a href="#">Cafés</a></li>
              <li><a href="#">QSR</a></li>
              <li><a href="#">Fine dining</a></li>
              <li><a href="#">Cloud kitchens</a></li>
              <li><a href="#">Bars & lounges</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Customers</a></li>
              <li><a href="#">Careers <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>14 OPEN</span></a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Docs</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Help centre</a></li>
              <li><a href="#">Status</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-outro">
          <div className="footer-wordmark-huge">omega</div>

          <div className="footer-bottom">
            <span>© 2026 Omega Systems Pvt. Ltd. · Bengaluru</span>
            <div className="footer-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
              <a href="#">DPDP</a>
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

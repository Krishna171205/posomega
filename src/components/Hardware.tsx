import { Icon } from './Icons'

function TerminalSketch() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '85%' }}>
      <defs>
        <linearGradient id="termBezel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#222" /><stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="termScreen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F4F1EA" /><stop offset="1" stopColor="#E8E2D3" />
        </linearGradient>
      </defs>
      <rect x="70" y="160" width="60" height="6" rx="2" fill="#1a1a1a" />
      <path d="M 80 140 L 80 160 L 120 160 L 120 140 Z" fill="#1a1a1a" />
      <rect x="20" y="20" width="160" height="130" rx="10" fill="url(#termBezel)" />
      <rect x="28" y="28" width="144" height="114" rx="4" fill="url(#termScreen)" />
      <rect x="34" y="34" width="32" height="6" rx="2" fill="#E84E1B" opacity="0.8" />
      <rect x="34" y="46" width="60" height="3" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="34" y="54" width="44" height="3" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="34" y="68" width="40" height="40" rx="4" fill="#0a0a0a" opacity="0.15" />
      <rect x="80" y="68" width="40" height="40" rx="4" fill="#E84E1B" opacity="0.7" />
      <rect x="126" y="68" width="40" height="40" rx="4" fill="#0a0a0a" opacity="0.15" />
      <rect x="34" y="114" width="132" height="20" rx="4" fill="#0a0a0a" />
    </svg>
  )
}

function MiniSketch() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '50%' }}>
      <defs>
        <linearGradient id="miniBezel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#222" /><stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect x="55" y="20" width="90" height="160" rx="14" fill="url(#miniBezel)" />
      <rect x="62" y="36" width="76" height="116" rx="3" fill="#F4F1EA" />
      <rect x="68" y="42" width="36" height="5" rx="2" fill="#E84E1B" opacity="0.8" />
      <rect x="68" y="54" width="64" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="68" y="60" width="48" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="68" y="72" width="64" height="24" rx="3" fill="#0a0a0a" opacity="0.1" />
      <rect x="68" y="100" width="64" height="24" rx="3" fill="#0a0a0a" opacity="0.1" />
      <rect x="68" y="128" width="64" height="18" rx="3" fill="#0a0a0a" />
      <circle cx="100" cy="167" r="6" fill="none" stroke="#444" strokeWidth="1" />
    </svg>
  )
}

function PrinterSketch() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '70%' }}>
      <defs>
        <linearGradient id="prntBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#222" /><stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      <rect x="40" y="60" width="120" height="90" rx="10" fill="url(#prntBody)" />
      <rect x="50" y="70" width="100" height="20" rx="3" fill="#0a0a0a" />
      <rect x="56" y="76" width="12" height="3" rx="1" fill="#E84E1B" />
      <rect x="50" y="100" width="100" height="50" rx="2" fill="#1a1a1a" />
      <path d="M 50 90 L 50 30 L 150 30 L 150 90 Z" fill="#FAF8F3" stroke="#ddd" strokeWidth="0.5" />
      <rect x="60" y="40" width="80" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="60" y="46" width="60" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="60" y="52" width="70" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="60" y="62" width="50" height="2" rx="1" fill="#0a0a0a" opacity="0.6" />
      <rect x="60" y="68" width="55" height="2" rx="1" fill="#0a0a0a" opacity="0.3" />
      <rect x="60" y="74" width="80" height="3" rx="1" fill="#E84E1B" opacity="0.8" />
    </svg>
  )
}

export function Hardware() {
  const items = [
    { name: 'Omega Terminal', tag: 'Flagship', price: 'From ₹24,900', desc: '14" touchscreen · M-class chip · 14-hour battery.', drawing: <TerminalSketch /> },
    { name: 'Omega Mini',     tag: 'Mobile',   price: 'From ₹9,900',  desc: 'Pocket-sized handheld. Take orders at the table.',   drawing: <MiniSketch /> },
    { name: 'Omega Print',    tag: 'Kitchen',  price: 'From ₹6,400',  desc: 'Thermal printer for KOTs. Cloud-paired. No drivers.', drawing: <PrinterSketch /> },
  ]
  return (
    <section className="section" id="hardware">
      <div className="container">
        <div className="hardware">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="eyebrow" style={{ color: 'color-mix(in oklab, var(--bg) 65%, transparent)' }}>
                <span className="dot" style={{ background: 'var(--accent)' }} />Designed in Bangalore
              </div>
              <h2 className="h-section" style={{ marginTop: 16, fontSize: 'clamp(36px, 4.5vw, 56px)' }}>
                Hardware that <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--aurora-1)' }}>belongs</span><br />
                on your counter.
              </h2>
              <p style={{ maxWidth: 460, fontSize: 17 }}>
                Built like an Apple product, priced for an Indian SMB. Pre-configured out of the box.
                Zero installation. Zero engineers.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" className="btn btn-primary" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
                Shop hardware <Icon.Arrow size={12} />
              </a>
            </div>
          </div>

          <div className="hardware-grid">
            {items.map((h, i) => (
              <div key={i} className="hardware-card">
                <div className="imgbox">{h.drawing}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>{h.name}</h4>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
                    background: 'color-mix(in oklab, var(--bg) 10%, transparent)', padding: '3px 8px', borderRadius: 6,
                    color: 'color-mix(in oklab, var(--bg) 70%, transparent)',
                  }}>{h.tag.toUpperCase()}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'color-mix(in oklab, var(--bg) 65%, transparent)' }}>{h.desc}</p>
                <div className="price">{h.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

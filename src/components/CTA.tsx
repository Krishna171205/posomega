import { Icon } from './Icons'

export function CTA() {
  return (
    <section className="section" id="cta">
      <div className="container">
        <div className="cta">
          <div className="cta-aurora" />
          <div className="cta-inner">
            <div className="eyebrow" style={{ color: 'color-mix(in oklab, var(--bg) 65%, transparent)', justifyContent: 'center' }}>
              <span className="dot" style={{ background: 'var(--aurora-1)' }} />
              Live in an afternoon
            </div>
            <h2 className="h-display" style={{ fontSize: 'clamp(48px, 7vw, 88px)', margin: '20px 0', color: 'var(--bg)' }}>
              Stop wrestling<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>your POS.</span>
            </h2>
            <p style={{ maxWidth: 540, margin: '0 auto', fontSize: 19, color: 'color-mix(in oklab, var(--bg) 65%, transparent)' }}>
              Book a 30-minute demo. We'll bring a working Omega terminal,
              load your menu, and show you exactly how a typical service runs.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              <a href="/get-started" className="btn btn-primary btn-lg">Book a demo <Icon.Arrow size={14} /></a>
              <a href="/get-started" className="btn btn-secondary btn-lg">Start free trial</a>
            </div>
            <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'color-mix(in oklab, var(--bg) 55%, transparent)', letterSpacing: '0.06em' }}>
              NO CREDIT CARD · 14-DAY FREE TRIAL · CANCEL ANYTIME
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { HERO } from '@/content/home'

/** attio.com's closing block: one line, the same three calls to action as the hero. */
export function CTA() {
  return (
    <section className="section cta" id="cta">
      <div className="container cta-inner">
        <h2 className="cta-h" data-rv>Your next service<br />runs on Omega.</h2>
        <p className="lede" data-rv style={{ ['--rv-i' as string]: 1 }}>
          Book a 30-minute demo. We will load your menu and show you exactly how a typical service runs.
        </p>
        <div className="hero-ctas" data-rv style={{ ['--rv-i' as string]: 2 }}>
          <a href={HERO.primary.href} className="btn btn-blue">{HERO.primary.label}</a>
          <a href={HERO.secondary.href} className="btn btn-tint">{HERO.secondary.label}</a>
          <a href="/get-started" className="btn btn-ghost">Send me a demo</a>
        </div>
        <p className="cta-meta mono" data-rv style={{ ['--rv-i' as string]: 3 }}>No credit card · 14-day free trial · Cancel anytime</p>
      </div>
    </section>
  )
}

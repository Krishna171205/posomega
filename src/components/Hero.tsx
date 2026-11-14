'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { HERO } from '@/content/home'
import DotGrid from './ui/DotGrid'
import { AppWindow, KitchenWindow, OrderWindow, ReceiptWindow } from './hero/HeroScene'

/**
 * Floating windows: where each one sits at the start (fractions of the frame) and
 * where it docks inside the app window, plus the slice of scroll progress it owns.
 * Mirrors attio.com's hero, where the call / Slack / terminal windows feed the app.
 */
const FLOATS = [
  { key: 'order', from: [-0.07, 0.04], to: [0.34, 0.2], rot: -2.5, span: [0.04, 0.34] },
  { key: 'kds', from: [0.78, 0.3], to: [0.03, 0.27], rot: 2, span: [0.34, 0.64] },
  { key: 'bill', from: [-0.09, 0.5], to: [0.8, 0.42], rot: -1.5, span: [0.64, 0.92] },
] as const

const STEPS = ['Swiggy order accepted', 'KOT fired to the hot line', 'Table 7 paid, bill printed']

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * attio.com's letter flip, values taken from their bundle: each glyph turns 88° on
 * X, staggered 20ms, 0.8s on cubic-bezier(.83,0,.17,1). All words share one grid
 * cell so the line never reflows as they swap.
 */
function Rotator({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI(n => (n + 1) % words.length), 2800)
    return () => window.clearInterval(id)
  }, [words.length])
  const prev = (i - 1 + words.length) % words.length
  return (
    <span className="rot">
      {words.map((w, wi) => (
        <span key={w} className={`rot-w ${wi === i ? 'on' : wi === prev ? 'off' : ''}`}>
          {(() => {
            let n = 0
            // Words stay unbroken groups so the phrase can still wrap on a phone.
            return w.split(' ').map((word, k) => (
              <span key={k} className="rot-word">
                {word.split('').map(ch => {
                  const d = n++ * 20
                  return <span key={d} className="rot-ch" style={{ transitionDelay: `${d}ms` }}>{ch}</span>
                })}
                {k < w.split(' ').length - 1 ? ' ' : null}
              </span>
            ))
          })()}
        </span>
      ))}
    </span>
  )
}

function DemoForm() {
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState(false)
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
    if (!/^[6-9]\d{9}$/.test(digits)) { setErr(true); return }
    window.location.href = `/get-started?phone=${digits}`
  }
  return (
    <form className={`demo-form ${err ? 'has-error' : ''}`} onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="demo-phone">WhatsApp number</label>
      <span className="demo-cc">+91</span>
      <input
        id="demo-phone"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="WhatsApp number"
        value={phone}
        aria-invalid={err}
        aria-describedby={err ? 'demo-err' : undefined}
        onChange={e => { setPhone(e.target.value); setErr(false) }}
      />
      <button type="submit" className="demo-send">Send me a demo</button>
      {err && <span id="demo-err" className="demo-err" role="alert">Enter a 10-digit mobile number.</span>}
    </form>
  )
}

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const floatRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const stage = stageRef.current
    const frame = frameRef.current
    if (!stage || !frame) return
    const mqWide = window.matchMedia('(min-width: 900px)')
    const mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let size = { w: 0, h: 0 }
    let lastStep = -2

    function measure() {
      size = { w: frame!.offsetWidth, h: frame!.offsetHeight }
    }
    function paint() {
      raf = 0
      const animated = mqWide.matches && !mqCalm.matches
      stage!.classList.toggle('is-pinned', animated)
      let p = 0
      if (animated) {
        const r = stage!.getBoundingClientRect()
        const range = stage!.offsetHeight - window.innerHeight
        p = range > 0 ? clamp01(-r.top / range) : 0
      }

      // Entrance: the window starts a little low and large, rises and settles to full
      // size as it reaches the centre (a: 0 -> 1, before the pin), then eases down a
      // little in size while pinned (p). No tilt.
      if (animated) {
        const r = stage!.getBoundingClientRect()
        const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
        const startTop = r.top + window.scrollY - navH
        const a = ease(clamp01(startTop > 0 ? window.scrollY / startTop : 1))
        const lift = 48 * (1 - a)
        const scale = (1.06 - 0.06 * a) * (1 - 0.08 * ease(clamp01(p / 0.5)))
        frame!.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
      } else {
        frame!.style.transform = ''
      }
      FLOATS.forEach((f, i) => {
        const el = floatRefs.current[i]
        if (!el) return
        if (!animated) { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; return }
        const t = ease(clamp01((p - f.span[0]) / (f.span[1] - f.span[0])))
        const x = (f.from[0] + (f.to[0] - f.from[0]) * t) * size.w
        const y = (f.from[1] + (f.to[1] - f.from[1]) * t) * size.h
        const s = 1 - 0.55 * t
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(f.rot * (1 - t)).toFixed(2)}deg) scale(${s.toFixed(3)})`
        el.style.opacity = String(t > 0.82 ? Math.max(0, 1 - (t - 0.82) / 0.18) : 1)
        el.style.filter = t > 0.6 ? `blur(${((t - 0.6) * 5).toFixed(2)}px)` : ''
      })
      // Docking order: each window "lands" just before its slice ends.
      const step = !animated ? -1 : p >= 0.88 ? 2 : p >= 0.6 ? 1 : p >= 0.3 ? 0 : -1
      if (step !== lastStep) {
        lastStep = step
        stage!.classList.toggle('s1', step >= 0)
        stage!.classList.toggle('s2', step >= 1)
        stage!.classList.toggle('s3', step >= 2)
        stage!.classList.toggle('is-scrolling', p > 0.01)
        setActive(step)
      } else {
        stage!.classList.toggle('is-scrolling', p > 0.01)
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }
    const onResize = () => { measure(); schedule() }
    measure()
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    mqWide.addEventListener('change', onResize)
    mqCalm.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      mqWide.removeEventListener('change', onResize)
      mqCalm.removeEventListener('change', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        {/* WebGL2 dot physics: the same component and settings as gradientui's
            /brand and /supplier heroes, recoloured to Omega's black and white. */}
        <DotGrid
          dotSize={1.3}
          gap={11}
          baseColor="#CAD0D9"
          activeColor="#1C1D1F"
          radius={160}
          force={12}
          spring={0.018}
          damping={0.82}
          rippleSpeed={420}
          rippleWidth={500}
          rippleF={11}
          rippleDecay={2.2}
          ambientRipples={true}
          opacity={0.85}
          intro={true}
          mouseInteraction={true}
          clickShock={true}
        />
      </div>
      <div className="hero-copy">
        <h1 id="hero-title" className="hero-title blur-in" aria-label={HERO.h1}>
          <span aria-hidden="true">{HERO.h1Lead}<br className="hero-br" /> {HERO.h1Mid} <Rotator words={HERO.h1Words} /></span>
        </h1>
        <p className="hero-sub blur-in" style={{ animationDelay: '60ms' }}>{HERO.sub}</p>
        <div className="hero-ctas blur-in" style={{ animationDelay: '120ms' }}>
          <a href={HERO.primary.href} className="btn btn-blue">{HERO.primary.label}</a>
          <a href={HERO.secondary.href} className="btn btn-tint">{HERO.secondary.label}</a>

        </div>
        <ul className="hero-meta blur-in" style={{ animationDelay: '180ms' }}>
          {HERO.meta.map(m => <li key={m}><Icon.Check size={12} />{m}</li>)}
        </ul>
      </div>

      <div className="hs" ref={stageRef}>
        <div className="hs-sticky">
          <div className="hs-frame" ref={frameRef}>
            <div className="hs-shell">
              <div className="win hs-win">
                <div className="win-bar">
                  <div className="win-dots"><span /><span /><span /></div>
                  <div className="win-title">cafe.posomega.com</div>
                </div>
                <div className="win-pane hs-pane"><AppWindow /></div>
              </div>
            </div>

            <div className="hs-floats" aria-hidden="true">
              {[<OrderWindow key="o" />, <KitchenWindow key="k" />, <ReceiptWindow key="r" />].map((w, i) => (
                <div
                  key={FLOATS[i].key}
                  className={`hs-float hs-float-${FLOATS[i].key}`}
                  ref={el => { floatRefs.current[i] = el }}
                >
                  <div className="hs-float-in" style={{ animationDelay: `${380 + i * 90}ms` }}>{w}</div>
                </div>
              ))}
            </div>
          </div>

          <ol className="hs-steps" aria-label="What just happened">
            {STEPS.map((s, i) => (
              <li key={s} className={active >= i ? 'done' : ''}>
                <span className="n ui-num">{active >= i ? <Icon.Check size={11} /> : i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

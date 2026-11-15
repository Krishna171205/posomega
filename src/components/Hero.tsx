'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { HERO } from '@/content/home'
import DotGrid from './ui/DotGrid'
import { AppWindow, KitchenWindow, OrderWindow, ReceiptWindow } from './hero/HeroScene'

/**
 * The hero scene, after attio.com's (values read from its markup): the app window
 * starts big (75% of the viewport, its pane min(40.35vw, 775px) tall) and shrinks
 * to about 81% as the page scrolls up to it, while the headline blurs away. Once it
 * has settled, the three small windows grow out from the corner nearest it, each
 * sized and placed like Attio's (30% of the window box, up to 268–300px, hanging
 * 96–160px past its edges). Then, one by one, they fly in and dock inside the app.
 *
 *  show    slice of the pinned scroll in which it appears
 *  origin  the corner it grows from, as fractions of its own box
 *  to      where it docks, as fractions of the window (before the window's scale)
 *  span    slice of the pinned scroll in which it docks
 *
 * While shown and not yet docking, each can be dragged about and thrown; docking
 * then flies it in from wherever it was left.
 */
const FLOATS = [
  { key: 'order', show: [0.02, 0.12], origin: [1, 1], to: [0.34, 0.2], span: [0.24, 0.46] },
  { key: 'kds', show: [0.05, 0.15], origin: [0, 1], to: [0.03, 0.27], span: [0.46, 0.68] },
  { key: 'bill', show: [0.08, 0.18], origin: [1, 0], to: [0.8, 0.42], span: [0.68, 0.9] },
] as const
/** How far the window shrinks before the small windows appear */
const SHRINK = 0.81

const STEPS = ['Swiggy order accepted', 'KOT fired to the hot line', 'Table 7 paid, bill printed']

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * attio.com's mechanical letter flip:
 * Each glyph turns 88° on X, staggered 20ms, 0.75s on cubic-bezier(.83,0,.17,1).
 * All words share one CSS grid cell so the line never reflows as they swap.
 * Strict idle visibility hiding ensures non-active words never overlap or flash.
 */
function Rotator({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setI(curr => {
        setPrev(curr)
        return (curr + 1) % words.length
      })
    }, 2800)
    return () => window.clearInterval(id)
  }, [words.length])

  return (
    <span className="rot" aria-hidden="true">
      {words.map((w, wi) => {
        const isOn = wi === i
        const isOff = wi === prev
        const stateClass = isOn ? 'on' : isOff ? 'off' : 'idle'
        return (
          <span key={w} className={`rot-w ${stateClass}`}>
            {(() => {
              let n = 0
              return w.split(' ').map((word, k) => (
                <span key={k} className="rot-word">
                  {word.split('').map(ch => {
                    const d = n++ * 20
                    return (
                      <span key={d} className="rot-ch" style={{ transitionDelay: `${d}ms` }}>
                        {ch}
                      </span>
                    )
                  })}
                  {k < w.split(' ').length - 1 ? '\u00A0' : null}
                </span>
              ))
            })()}
          </span>
        )
      })}
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
  const winRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLOListElement>(null)
  const floatRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const stage = stageRef.current
    const frame = frameRef.current
    const win = winRef.current
    if (!stage || !frame || !win) return
    const copy = copyRef.current
    const steps = stepsRef.current
    const mqWide = window.matchMedia('(min-width: 900px)')
    const mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)')
    stage.classList.add('has-js')

    let size = { w: 0, h: 0 }
    let navH = 68
    let animated = false
    let lastStep = -2
    let winScale = 1
    let stickyH = 0, frameTop = 0, stepsH = 0     // layout, for centring the shrunk window
    /* Scroll position: targets read from the page (aT: the approach before the pin,
       pT: progress while pinned) and the smoothed values the scene is drawn with, so
       it glides after the wheel instead of jumping a notch at a time. */
    let aT = 0, pT = 0, aS = 0, pS = 0

    /* Dragging: an offset per window, with momentum, a tilt into the motion and a lift */
    type Drag = { x: number; y: number; vx: number; vy: number; tilt: number; lift: number; held: boolean }
    const drag: Drag[] = FLOATS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, tilt: 0, lift: 0, held: false }))
    const home = FLOATS.map(() => ({ x: 0, y: 0 }))       // where CSS puts it, inside the frame
    const nudge = FLOATS.map(() => 0)                      // sideways shift that keeps it on screen
    const dims = FLOATS.map(() => ({ w: 0, h: 0 }))
    const bounds = FLOATS.map(() => ({ minX: 0, maxX: 0, minY: 0, maxY: 0 }))
    const free = FLOATS.map(() => false)
    let grab: { i: number; id: number; sx: number; sy: number; x0: number; y0: number; samples: { t: number; x: number; y: number }[] } | null = null
    let zTop = 4
    let tick = 0
    let last = 0

    function measure() {
      size = { w: frame!.offsetWidth, h: frame!.offsetHeight }
      navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
      stickyH = (frame!.offsetParent as HTMLElement | null)?.clientHeight ?? window.innerHeight
      frameTop = frame!.offsetTop
      stepsH = steps?.offsetHeight ?? 0
      const vw = document.documentElement.clientWidth
      const r = frame!.getBoundingClientRect()
      FLOATS.forEach((_, i) => {
        const el = floatRefs.current[i]
        if (!el) return
        const fw = el.offsetWidth
        const fh = el.offsetHeight
        dims[i] = { w: fw, h: fh }
        home[i] = { x: el.offsetLeft, y: el.offsetTop }
        const vx = r.left + el.offsetLeft
        nudge[i] = Math.min(vw - 12 - fw, Math.max(12, vx)) - vx
        const left = vx + nudge[i]
        bounds[i] = {
          minX: 12 - left, maxX: vw - 12 - fw - left,
          minY: 6 - frame!.offsetTop - el.offsetTop, maxY: size.h + 40 - fh * 0.5 - el.offsetTop,
        }
        clampDrag(i)
      })
    }
    function clampDrag(i: number) {
      const d = drag[i]
      const b = bounds[i]
      let hx = false
      let hy = false
      if (d.x < b.minX) { d.x = b.minX; hx = true } else if (d.x > b.maxX) { d.x = b.maxX; hx = true }
      if (d.y < b.minY) { d.y = b.minY; hy = true } else if (d.y > b.maxY) { d.y = b.maxY; hy = true }
      return { hx, hy }
    }

    function readTargets() {
      animated = mqWide.matches && !mqCalm.matches
      if (!animated) { aT = 0; pT = 0; return }
      const r = stage!.getBoundingClientRect()
      const range = stage!.offsetHeight - window.innerHeight
      pT = range > 0 ? clamp01(-r.top / range) : 0
      const startTop = r.top + window.scrollY - navH
      aT = clamp01(startTop > 0 ? window.scrollY / startTop : 1)
    }

    /** Momentum, tilt and lift for the windows; returns whether anything still moves */
    function stepDrag(dt: number) {
      let busy = !!grab
      const calm = mqCalm.matches
      drag.forEach((d, i) => {
        if (d.held) {
          const lean = calm ? 0 : Math.max(-7, Math.min(7, d.vx * 0.005))
          d.tilt += (lean - d.tilt) * Math.min(1, dt * 14)
          d.lift += (1 - d.lift) * Math.min(1, dt * 14)
          return
        }
        if (Math.abs(d.vx) > 3 || Math.abs(d.vy) > 3) {
          d.x += d.vx * dt
          d.y += d.vy * dt
          const f = Math.exp(-dt * 4.5)                    // friction
          d.vx *= f
          d.vy *= f
          const { hx, hy } = clampDrag(i)
          if (hx) d.vx *= -0.35                            // a soft bounce off the screen edge
          if (hy) d.vy *= -0.35
          busy = true
        } else {
          d.vx = 0
          d.vy = 0
        }
        d.tilt += -d.tilt * Math.min(1, dt * 9)
        d.lift += -d.lift * Math.min(1, dt * 10)
        if (Math.abs(d.tilt) > 0.03 || d.lift > 0.003) busy = true
      })
      return busy
    }

    function paint() {
      stage!.classList.toggle('is-pinned', animated)
      // 1. The window shrinks as the page scrolls up to it, and the headline blurs away
      winScale = animated ? 1 - (1 - SHRINK) * smooth(aS) : 1
      win!.style.transform = animated ? `scale(${winScale.toFixed(4)})` : ''
      // The layout box stays full size while the window is drawn smaller, so as it
      // shrinks the window and the steps under it are lifted together: the steps follow
      // the window's visible bottom edge, and the pair ends up centred in the pinned view.
      if (animated) {
        const visH = winScale * size.h
        const want = Math.max(8, (stickyH - (visH + 24 + stepsH)) / 2)
        const shift = (want - (frameTop + (size.h - visH) / 2)) * smooth(aS)
        frame!.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
        if (steps) steps.style.transform = `translate3d(0, ${(shift - (size.h - visH) / 2 + 4).toFixed(1)}px, 0)`
      } else {
        frame!.style.transform = ''
        if (steps) steps.style.transform = ''
      }
      if (copy) {
        const q = animated ? clamp01((aS - 0.35) / 0.65) : 0
        copy.style.opacity = q > 0 ? (1 - 0.8 * q).toFixed(3) : ''
        copy.style.filter = q > 0.01 ? `blur(${(q * 3).toFixed(2)}px)` : ''
      }
      // 2. Then the small windows grow out of their corners, and 3. dock one by one
      const cx = size.w / 2
      const cy = size.h / 2
      FLOATS.forEach((f, i) => {
        const el = floatRefs.current[i]
        if (!el) return
        const d = drag[i]
        const show = animated ? ease(clamp01((pS - f.show[0]) / (f.show[1] - f.show[0]))) : 1
        const t = animated ? ease(clamp01((pS - f.span[0]) / (f.span[1] - f.span[0]))) : 0
        const isFree = show > 0.98 && t < 0.001
        if (isFree !== free[i]) {
          free[i] = isFree
          el.classList.toggle('is-free', isFree)
          if (!isFree && grab?.i === i) release(null)      // the scroll takes over mid-drag
        }
        const sc = (0.72 + 0.28 * show) * (1 - 0.55 * t)
        const ox = f.origin[0] * dims[i].w
        const oy = f.origin[1] * dims[i].h
        // where it rests (on screen, plus any drag) and where it docks (through the window's scale)
        const fx = nudge[i] + d.x
        const fy = d.y
        const tx = cx + winScale * (f.to[0] * size.w - cx) - home[i].x - ox * (1 - sc)
        const ty = cy + winScale * (f.to[1] * size.h - cy) - home[i].y - oy * (1 - sc)
        const X = fx + (tx - fx) * t
        const Y = fy + (ty - fy) * t
        const k = 1 - t
        const mx = dims[i].w / 2
        const my = dims[i].h / 2
        // tilt and lift turn about the centre; growing and docking scale about its corner
        el.style.transform =
          `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) ` +
          `translate(${mx}px, ${my}px) rotate(${(d.tilt * k).toFixed(2)}deg) scale(${(1 + 0.035 * d.lift).toFixed(4)}) translate(${-mx}px, ${-my}px) ` +
          `translate(${ox}px, ${oy}px) scale(${sc.toFixed(4)}) translate(${-ox}px, ${-oy}px)`
        el.style.opacity = (show * (t > 0.82 ? Math.max(0, 1 - (t - 0.82) / 0.18) : 1)).toFixed(3)
        const blur = (1 - show) * 3 + (t > 0.6 ? (t - 0.6) * 5 : 0)
        el.style.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : ''
      })
      stage!.classList.toggle('is-scrolling', animated && aS > 0.02)
      // Docking order: each window "lands" just before its slice ends.
      const step = !animated ? -1 : pS >= 0.86 ? 2 : pS >= 0.64 ? 1 : pS >= 0.42 ? 0 : -1
      if (step !== lastStep) {
        lastStep = step
        stage!.classList.toggle('s1', step >= 0)
        stage!.classList.toggle('s2', step >= 1)
        stage!.classList.toggle('s3', step >= 2)
        setActive(step)
      }
    }

    function frameTick(now: number) {
      tick = 0
      const raw = (now - last) / 1000
      last = now
      const dt = Math.min(0.05, raw)                       // physics steps stay small and stable
      readTargets()
      // about 170ms behind the scroll (a slow, soft follow), on the real frame time, so a slow machine
      // catches up as quickly as a fast one
      const k = 1 - Math.exp(-Math.min(0.25, raw) * 6)
      aS += (aT - aS) * k
      pS += (pT - pS) * k
      if (Math.abs(aT - aS) < 0.0004) aS = aT
      if (Math.abs(pT - pS) < 0.0004) pS = pT
      const moving = stepDrag(dt)
      paint()
      if (moving || aS !== aT || pS !== pT) tick = requestAnimationFrame(frameTick)
    }
    const kick = () => { if (!tick) { last = performance.now(); tick = requestAnimationFrame(frameTick) } }

    function down(i: number, e: PointerEvent) {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (!free[i] || !mqWide.matches) return
      e.preventDefault()
      const el = floatRefs.current[i]
      if (!el) return
      el.setPointerCapture(e.pointerId)
      const d = drag[i]
      d.held = true
      d.vx = 0
      d.vy = 0
      grab = { i, id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: d.x, y0: d.y, samples: [{ t: e.timeStamp, x: d.x, y: d.y }] }
      el.style.zIndex = String(++zTop)                     // the one you pick up comes to the front
      el.classList.add('is-grabbed')
      kick()
    }
    function move(e: PointerEvent) {
      if (!grab || e.pointerId !== grab.id) return
      const d = drag[grab.i]
      d.x = grab.x0 + (e.clientX - grab.sx)
      d.y = grab.y0 + (e.clientY - grab.sy)
      clampDrag(grab.i)
      const sm = grab.samples
      sm.push({ t: e.timeStamp, x: d.x, y: d.y })
      while (sm.length > 2 && e.timeStamp - sm[0].t > 90) sm.shift()
      const span = (e.timeStamp - sm[0].t) / 1000
      if (span > 0) { d.vx = (d.x - sm[0].x) / span; d.vy = (d.y - sm[0].y) / span }
      kick()
    }
    function release(e: PointerEvent | null) {
      if (!grab || (e && e.pointerId !== grab.id)) return
      const { i, samples } = grab
      const d = drag[i]
      const lastSample = samples[samples.length - 1]
      // a window that was held still before letting go is not thrown
      if (!e || e.timeStamp - lastSample.t > 70 || mqCalm.matches) { d.vx = 0; d.vy = 0 }
      d.vx = Math.max(-3000, Math.min(3000, d.vx))
      d.vy = Math.max(-3000, Math.min(3000, d.vy))
      d.held = false
      floatRefs.current[i]?.classList.remove('is-grabbed')
      grab = null
      kick()
    }

    const onResize = () => { measure(); kick() }
    measure()
    readTargets()
    aS = aT
    pS = pT
    paint()
    const ro = new ResizeObserver(onResize)               // also catches sizes settling as fonts load
    ro.observe(frame)
    floatRefs.current.forEach(el => { if (el) ro.observe(el) })
    const downs = FLOATS.map((_, i) => (e: PointerEvent) => down(i, e))
    floatRefs.current.forEach((el, i) => el?.addEventListener('pointerdown', downs[i]))
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', onResize)
    mqWide.addEventListener('change', onResize)
    mqCalm.addEventListener('change', onResize)
    return () => {
      ro.disconnect()
      floatRefs.current.forEach((el, i) => el?.removeEventListener('pointerdown', downs[i]))
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      mqWide.removeEventListener('change', onResize)
      mqCalm.removeEventListener('change', onResize)
      if (tick) cancelAnimationFrame(tick)
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
      <div className="hero-copy" ref={copyRef}>
        <div className="hero-pill-wrap">
          <a href="/features/offline-mode" className="hero-pill">
            <span className="hero-pill-border" aria-hidden="true">
              <span className="hero-pill-spinner" />
            </span>
            <span className="hero-pill-ambient" aria-hidden="true">
              <span className="hero-pill-ambient-spinner" />
            </span>
            <span className="hero-pill-inner">
              <span className="hero-pill-text">Bills keep printing when the internet drops</span>
              <Icon.Arrow size={11} className="hero-pill-arrow" />
            </span>
          </a>
        </div>

        <h1 id="hero-title" className="hero-title" aria-label={HERO.h1}>
          <span className="hero-line-mask" aria-hidden="true">
            <span className="hero-line-inner line-1">
              {HERO.h1Lead}
            </span>
          </span>
          <span className="hero-line-mask" aria-hidden="true">
            <span className="hero-line-inner line-2">
              {HERO.h1Mid}{' '}
              <Rotator words={HERO.h1Words} />
            </span>
          </span>
        </h1>
        <p className="hero-sub">{HERO.sub}</p>
        <div className="hero-ctas">
          <a href={HERO.primary.href} className="btn btn-blue">{HERO.primary.label}</a>
          <a href={HERO.secondary.href} className="btn btn-tint">{HERO.secondary.label}</a>
        </div>
      </div>

      <div className="hs" ref={stageRef}>
        <div className="hs-sticky">
          <div className="hs-frame" ref={frameRef}>
            <div className="hs-shell">
              <div className="win hs-win" ref={winRef}>
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

          <ol className="hs-steps" ref={stepsRef} aria-label="What just happened">
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

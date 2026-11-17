'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { HERO } from '@/content/home'
import DotGrid from './ui/DotGrid'
import { AppWindow, FLOW, KitchenWindow, OrderWindow, ReceiptWindow } from './hero/HeroScene'

/**
 * The hero scene, after attio.com's: an app window with three small windows around it.
 *
 *  1. Scrolling down to it pulls the window back from full size to 87% (the pull-back).
 *  2. The story starts as soon as the window is in sight, like the product video under
 *     attio.com's headline: the three small windows (the new Swiggy order, the kitchen
 *     display, the bill printer) drift in by themselves and stay in while it plays.
 *  3. The story plays by itself (FLOW in HeroScene): the order is
 *     accepted and flies into the Online board, which opens; its KOT drops onto the
 *     kitchen display, is marked ready, and the display flies into Kitchen; the printer
 *     prints the bill, which flies into the order in Orders; the rider takes it, it is
 *     delivered, and Reports opens with the day's numbers ticking up. Then it loops.
 *
 * While a small window waits it can be picked up, dragged and thrown. The story waits
 * while one is held, and docking then flies it in from wherever it was left.
 * A demo cursor does the clicking. `at` is ms from the start of a loop.
 */
type Beat = { at: number; step?: number; cursor?: string; click?: boolean; hide?: boolean; restart?: boolean }
const TIMELINE: Beat[] = [
  { at: 450, cursor: '.hs-float-order .fw-accept' },
  { at: 1000, step: FLOW.accept, click: true },
  { at: 1450, step: FLOW.orderDock, hide: true },
  { at: 2100, step: FLOW.accepted },
  { at: 3050, step: FLOW.kot },
  { at: 3950, step: FLOW.rider },
  { at: 4650, cursor: '.hs-float-kds .fw-bump' },
  { at: 5250, step: FLOW.bump, click: true },
  { at: 5700, step: FLOW.kdsDock, hide: true },
  { at: 6400, step: FLOW.ready },
  { at: 7200, step: FLOW.print },
  { at: 9100, step: FLOW.billDock },
  { at: 9800, step: FLOW.billed },
  { at: 10950, step: FLOW.arrived },
  { at: 11350, cursor: '.app-act' },
  { at: 11950, step: FLOW.pickup, click: true },
  { at: 12400, hide: true },
  { at: 13300, step: FLOW.delivered },
  { at: 14200, cursor: '.app-nav-reports' },
  { at: 14800, step: FLOW.reports, click: true },
  { at: 15250, hide: true },
  { at: 18900, cursor: '.app-nav-customers' },
  { at: 19500, step: FLOW.customers, click: true },
  { at: 19950, hide: true },
  { at: 23300, cursor: '.app-nav-inventory' },
  { at: 23900, step: FLOW.inventory, click: true },
  { at: 24350, hide: true },
  { at: 27600, step: FLOW.end },
  { at: 28200, restart: true },          // one loop: 28 seconds
]

/**
 * Each small window: the slice of the pinned scroll it comes in over, the step it docks
 * at, and what it docks into (the first of these that is on screen). `from` is the step
 * its part starts: from then until it docks it sits in front of the dashboard; the rest
 * of the time it waits behind it (hovering or dragging brings it forward).
 */
const FLOATS = [
  { key: 'order', show: [0.03, 0.27], from: 0, dock: FLOW.orderDock, into: ['.ob-slot', '.app-nav-online'] },
  { key: 'kds', show: [0.2, 0.44], from: FLOW.kot, dock: FLOW.kdsDock, into: ['.kd-slot', '.app-nav-kitchen'] },
  { key: 'bill', show: [0.37, 0.61], from: FLOW.print, dock: FLOW.billDock, into: ['.inv', '.app-detail'] },
] as const

const STEPS = [
  { label: 'Order accepted', at: FLOW.accepted },
  { label: 'Fired to kitchen', at: FLOW.kot },
  { label: 'Food ready', at: FLOW.ready },
  { label: 'Bill printed', at: FLOW.billed },
  { label: 'Delivered', at: FLOW.delivered },
]

const shown = (el: Element | null): el is HTMLElement => !!el && el.getClientRects().length > 0

/** How far the window pulls back as the page scrolls down to it (attio.com settles at scale(0.872275)) */
const SHRINK = 0.872
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

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
                  {k < w.split(' ').length - 1 ? ' ' : null}
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
    // Kept out of the URL so the number never lands in logs, analytics or history.
    try { sessionStorage.setItem('demo-phone', digits) } catch {}
    window.location.href = '/get-started'
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

type Drag = { x: number; y: number; vx: number; vy: number; tilt: number; lift: number; held: boolean }

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLOListElement>(null)
  const floatRefs = useRef<(HTMLDivElement | null)[]>([])
  const dragRefs = useRef<(HTMLDivElement | null)[]>([])
  const drags = useRef<Drag[]>(FLOATS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, tilt: 0, lift: 0, held: false })))
  const held = useRef(false)
  /** How far each small window has come in (0 to 1), from the scroll */
  const showRef = useRef<number[]>(FLOATS.map(() => 1))
  /** The story may play. From first sight, like attio.com's hero video (no scroll gate) */
  const armedRef = useRef(true)
  /** The story has started: the windows stay in even if the page scrolls back a little */
  const latchRef = useRef(false)
  const syncRef = useRef<() => void>(() => {})
  const paintRef = useRef<() => void>(() => {})
  const loopsRef = useRef(0)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  stepRef.current = step

  /* The scroll: the pull-back on the way down to the stage, then, while it is pinned,
     the three small windows coming in. Both trail the scroll a little, so they glide
     rather than stepping with each notch of the wheel. Wide screens that allow motion
     only; elsewhere the windows simply show and the story plays when on screen. */
  useEffect(() => {
    const stage = stageRef.current
    const sticky = stickyRef.current
    const frame = frameRef.current
    const win = winRef.current
    if (!stage || !sticky || !frame || !win) return
    const steps = stepsRef.current
    const mqWide = window.matchMedia('(min-width: 900px)')
    const mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let size = { w: 0, h: 0 }
    let navH = 68, stickyH = 0, frameTop = 0, stepsH = 0
    let aT = 0, aS = 0, pT = 0, pS = 0, raf = 0, last = 0
    const on = () => mqWide.matches && !mqCalm.matches

    function measure() {
      size = { w: frame!.offsetWidth, h: frame!.offsetHeight }
      navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68
      stickyH = sticky!.clientHeight || window.innerHeight
      frameTop = frame!.offsetTop
      stepsH = steps?.offsetHeight ?? 0
    }
    function targets() {
      if (!on()) { aT = 0; pT = 1; return }
      const r = stage!.getBoundingClientRect()
      const startTop = r.top + window.scrollY - navH
      aT = clamp01(startTop > 0 ? window.scrollY / startTop : 1)
      const range = stage!.offsetHeight - sticky!.offsetHeight
      pT = range > 0 ? clamp01((navH - r.top) / range) : 1
    }
    function paint() {
      const wide = on()
      stage!.classList.toggle('is-pinned', wide)
      if (!wide) {
        win!.style.transform = ''
        frame!.style.transform = ''
        if (steps) steps.style.transform = ''
      } else {
        const k = smooth(aS)
        const sc = 1 - (1 - SHRINK) * k
        win!.style.transform = `scale(${sc.toFixed(4)})`
        // The layout box stays full size while the window is drawn smaller, so the frame
        // and the steps are lifted together until the pair sits centred in the view.
        const visH = sc * size.h
        const want = Math.max(8, (stickyH - (visH + 24 + stepsH)) / 2)
        const shift = (want - (frameTop + (size.h - visH) / 2)) * k
        frame!.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
        if (steps) steps.style.transform = `translate3d(0, ${(shift - (size.h - visH) / 2 + 4).toFixed(1)}px, 0)`
      }
      // The small windows, each over its own slice of the pinned scroll
      FLOATS.forEach((f, i) => {
        const el = floatRefs.current[i]
        const v = !wide || latchRef.current ? 1 : ease(clamp01((pS - f.show[0]) / (f.show[1] - f.show[0])))
        showRef.current[i] = v
        if (!el) return
        el.style.setProperty('--show', v.toFixed(4))
        el.classList.toggle('is-out', v < 0.98)
      })
    }
    paintRef.current = paint
    function tick(now: number) {
      raf = 0
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      targets()
      const k = 1 - Math.exp(-dt * 6)
      aS += (aT - aS) * k
      pS += (pT - pS) * k
      if (Math.abs(aT - aS) < 0.0004) aS = aT
      if (Math.abs(pT - pS) < 0.0004) pS = pT
      paint()
      if (aS !== aT || pS !== pT) raf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) } }
    const onResize = () => { measure(); kick() }

    measure()
    targets()
    aS = aT
    pS = pT
    paint()
    const ro = new ResizeObserver(onResize)
    ro.observe(frame)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', onResize)
    mqWide.addEventListener('change', onResize)
    mqCalm.addEventListener('change', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      mqWide.removeEventListener('change', onResize)
      mqCalm.removeEventListener('change', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* The story's clock. It runs while the stage is on screen, the tab is visible and the
     scroll has brought the three windows in, and stands still while one is held. Each
     time it starts, it starts from the top. */
  useEffect(() => {
    const sticky = stickyRef.current
    const frame = frameRef.current
    if (!sticky || !frame) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let clock = 0
    let elapsed = 0
    let next = 0
    let last = 0
    let inView = false

    const cursor = () => cursorRef.current
    function park() {
      const c = cursor()
      if (!c) return
      c.classList.remove('on', 'down')
      c.style.transform = `translate(${(frame!.offsetWidth * 0.62).toFixed(0)}px, ${(frame!.offsetHeight * 0.9).toFixed(0)}px)`
    }
    function point(sel: string) {
      const c = cursor()
      const t = frame!.querySelector(sel)
      if (!c) return
      if (!shown(t)) { c.classList.remove('on'); return }
      const f = frame!.getBoundingClientRect()
      const r = t.getBoundingClientRect()
      c.style.transform = `translate(${(r.left - f.left + r.width * 0.58).toFixed(1)}px, ${(r.top - f.top + r.height * 0.62).toFixed(1)}px)`
      c.classList.add('on')
    }
    function click() {
      const c = cursor()
      if (!c || !c.classList.contains('on')) return
      c.classList.add('down')
      window.setTimeout(() => c.classList.remove('down'), 200)
    }
    function fire(b: Beat) {
      if (b.restart) { loopsRef.current++; begin(); return }
      if (b.cursor) point(b.cursor)
      if (b.click) click()
      if (b.hide) cursor()?.classList.remove('on')
      if (b.step !== undefined) setStep(b.step)
    }
    function tick() {
      const now = performance.now()
      if (!held.current) elapsed += now - last
      last = now
      while (next < TIMELINE.length && TIMELINE[next].at <= elapsed) {
        const b = TIMELINE[next++]
        fire(b)
        if (b.restart) break
      }
    }
    function begin() {
      elapsed = 0
      next = 0
      last = performance.now()
      park()
      setStep(0)
    }
    function stop() {
      if (clock) window.clearInterval(clock)
      clock = 0
    }
    let paused = false
    function sync() {
      if (calm.matches) { stop(); park(); setStep(FLOW.delivered); return }   // the finished story, held still
      const can = inView && armedRef.current
      const go = can && !document.hidden
      if (go && clock) return                                                // already playing
      if (go) {
        if (paused) {                                                        // back to the tab: carry on
          paused = false
          last = performance.now()
        } else {
          latchRef.current = true
          loopsRef.current = 0
          begin()
        }
        clock = window.setInterval(tick, 50)
        return
      }
      stop()
      if (can) { paused = true; return }                                     // tab hidden: hold it where it is
      paused = false
      park()
      setStep(0)
    }
    syncRef.current = sync

    const io = new IntersectionObserver(([e]) => {
      const was = inView
      inView = e.isIntersecting
      if (!inView) latchRef.current = false                  // gone: the scroll brings them in again next time
      if (inView !== was) { sync(); paintRef.current() }
    }, { threshold: 0.05 })
    io.observe(sticky)
    document.addEventListener('visibilitychange', sync)
    calm.addEventListener('change', sync)
    return () => {
      stop()
      io.disconnect()
      syncRef.current = () => {}
      document.removeEventListener('visibilitychange', sync)
      calm.removeEventListener('change', sync)
    }
  }, [])

  /* Picking the small windows up: drag with a tilt into the motion and a lift, throw
     with momentum, a soft bounce off the screen edge. Only while one is in and waiting. */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let grab: { i: number; id: number; sx: number; sy: number; x0: number; y0: number; box: DOMRect; samples: { t: number; x: number; y: number }[] } | null = null
    let raf = 0
    let last = 0

    const isWaiting = (i: number) => showRef.current[i] > 0.98 && stepRef.current < FLOATS[i].dock
    function paint(i: number) {
      const el = dragRefs.current[i]
      const d = drags.current[i]
      if (!el) return
      const w = el.offsetWidth / 2
      const h = el.offsetHeight / 2
      el.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0) translate(${w}px, ${h}px) rotate(${d.tilt.toFixed(2)}deg) scale(${(1 + 0.035 * d.lift).toFixed(4)}) translate(${-w}px, ${-h}px)`
    }
    /** Keep the window on screen: its box at rest, moved by the drag */
    function clampTo(i: number, box: DOMRect) {
      const d = drags.current[i]
      const vw = document.documentElement.clientWidth
      const f = frame!.getBoundingClientRect()
      const minX = 8 - box.left, maxX = vw - 8 - box.right
      const minY = f.top - 60 - box.top, maxY = f.bottom + 40 - box.bottom
      let hx = false, hy = false
      if (d.x < minX) { d.x = minX; hx = true } else if (d.x > maxX) { d.x = maxX; hx = true }
      if (d.y < minY) { d.y = minY; hy = true } else if (d.y > maxY) { d.y = maxY; hy = true }
      return { hx, hy }
    }
    const boxes: (DOMRect | null)[] = FLOATS.map(() => null)
    function frameTick(now: number) {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      let busy = !!grab
      drags.current.forEach((d, i) => {
        if (!isWaiting(i)) return
        if (d.held) {
          const lean = calm.matches ? 0 : Math.max(-7, Math.min(7, d.vx * 0.005))
          d.tilt += (lean - d.tilt) * Math.min(1, dt * 14)
          d.lift += (1 - d.lift) * Math.min(1, dt * 14)
        } else {
          if (Math.abs(d.vx) > 3 || Math.abs(d.vy) > 3) {
            d.x += d.vx * dt
            d.y += d.vy * dt
            const fr = Math.exp(-dt * 4.5)
            d.vx *= fr
            d.vy *= fr
            const b = boxes[i]
            if (b) {
              const { hx, hy } = clampTo(i, b)
              if (hx) d.vx *= -0.35
              if (hy) d.vy *= -0.35
            }
            busy = true
          } else { d.vx = 0; d.vy = 0 }
          d.tilt -= d.tilt * Math.min(1, dt * 9)
          d.lift -= d.lift * Math.min(1, dt * 10)
          if (Math.abs(d.tilt) > 0.03 || d.lift > 0.003) busy = true
        }
        paint(i)
      })
      if (busy) raf = requestAnimationFrame(frameTick)
    }
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frameTick) } }

    function down(i: number, e: PointerEvent) {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (!isWaiting(i)) return
      const el = dragRefs.current[i]
      const outer = floatRefs.current[i]
      if (!el || !outer) return
      e.preventDefault()
      el.setPointerCapture(e.pointerId)
      const d = drags.current[i]
      d.held = true
      d.vx = 0
      d.vy = 0
      held.current = true                                   // the story waits for you
      const r = el.getBoundingClientRect()
      const box = new DOMRect(r.left - d.x, r.top - d.y, r.width, r.height)
      boxes[i] = box
      grab = { i, id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: d.x, y0: d.y, box, samples: [{ t: e.timeStamp, x: d.x, y: d.y }] }
      outer.classList.add('is-grabbed')
      kick()
    }
    function move(e: PointerEvent) {
      if (!grab || e.pointerId !== grab.id) return
      const d = drags.current[grab.i]
      d.x = grab.x0 + (e.clientX - grab.sx)
      d.y = grab.y0 + (e.clientY - grab.sy)
      clampTo(grab.i, grab.box)
      const sm = grab.samples
      sm.push({ t: e.timeStamp, x: d.x, y: d.y })
      while (sm.length > 2 && e.timeStamp - sm[0].t > 90) sm.shift()
      const span = (e.timeStamp - sm[0].t) / 1000
      if (span > 0) { d.vx = (d.x - sm[0].x) / span; d.vy = (d.y - sm[0].y) / span }
      kick()
    }
    function release(e: PointerEvent) {
      if (!grab || e.pointerId !== grab.id) return
      const { i, samples } = grab
      const d = drags.current[i]
      const lastSample = samples[samples.length - 1]
      if (e.timeStamp - lastSample.t > 70 || calm.matches) { d.vx = 0; d.vy = 0 }   // held still, not thrown
      d.vx = Math.max(-3000, Math.min(3000, d.vx))
      d.vy = Math.max(-3000, Math.min(3000, d.vy))
      d.held = false
      held.current = false
      floatRefs.current[i]?.classList.remove('is-grabbed')
      grab = null
      kick()
    }

    const downs = FLOATS.map((_, i) => (e: PointerEvent) => down(i, e))
    dragRefs.current.forEach((el, i) => el?.addEventListener('pointerdown', downs[i]))
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      dragRefs.current.forEach((el, i) => el?.removeEventListener('pointerdown', downs[i]))
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      if (raf) cancelAnimationFrame(raf)
      held.current = false
    }
  }, [])

  /* Docking: each small window flies, from wherever it is, into the section of the app
     that has just opened for it, and fades into the spot where its content lands.
     Step 0 puts them all back where they wait; on a loop they come back in by themselves. */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    if (step === 0) {
      floatRefs.current.forEach((el, i) => {
        const inner = dragRefs.current[i]
        Object.assign(drags.current[i], { x: 0, y: 0, vx: 0, vy: 0, tilt: 0, lift: 0, held: false })
        for (const n of [el, inner]) {
          if (!n) continue
          n.style.transition = 'none'
          n.style.transform = ''
          n.style.opacity = ''
          n.style.filter = ''
          void n.offsetWidth                                 // settle there before transitions return
          n.style.transition = ''
        }
        if (el) {
          el.classList.remove('is-again')
          void el.offsetWidth; el.classList.add('is-again')        // first start and every loop: they come in by themselves
        }
      })
      return
    }
    FLOATS.forEach((f, i) => {
      if (step !== f.dock) return
      const el = floatRefs.current[i]
      const inner = dragRefs.current[i]
      if (!el || !inner || !shown(el)) return
      const d = drags.current[i]
      d.vx = 0; d.vy = 0; d.tilt = 0; d.lift = 0
      inner.style.transition = 'transform .35s var(--ease-out-cubic)'
      inner.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0)`
      const target = f.into.map(s => frame.querySelector(s)).find(shown) ?? frame
      const o = el.getBoundingClientRect()                  // the resting box, before the drag
      const b = target.getBoundingClientRect()
      const s = Math.min(0.85, Math.max(0.22, b.width / o.width))
      // scaling about the resting box's centre also scales the drag offset
      const dx = b.left + b.width / 2 - (o.left + o.width / 2) - s * d.x
      const dy = b.top + b.height / 2 - (o.top + o.height / 2) - s * d.y
      el.style.transition = 'transform .6s cubic-bezier(.65, 0, .35, 1), opacity .26s linear .36s, filter .26s linear .36s'
      el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(3)})`
      el.style.opacity = '0'
      el.style.filter = 'blur(2px)'
    })
  }, [step])

  const floatEls = [
    <OrderWindow key="o" pressed={step >= FLOW.accept} />,
    <KitchenWindow key="k" fired={step >= FLOW.kot} bumped={step >= FLOW.bump} />,
    <ReceiptWindow key="r" printing={step >= FLOW.print} />,
  ]

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

      <div className={`hs ${step === FLOW.end ? 'is-fading' : ''}`} ref={stageRef} data-step={step}>
        <div className="hs-sticky" ref={stickyRef}>
          <div className="hs-frame" ref={frameRef}>
            <div className="hs-shell">
              <div className="win hs-win" ref={winRef}>
                <div className="win-bar">
                  <div className="win-dots"><span /><span /><span /></div>
                  <div className="win-title">cafe.posomega.com</div>
                </div>
                <div className="win-pane hs-pane"><AppWindow step={step} /></div>
              </div>
            </div>

            <div className="hs-floats" aria-hidden="true">
              {FLOATS.map((f, i) => (
                <div
                  key={f.key}
                  className={`hs-float hs-float-${f.key} ${step < f.dock ? 'is-free' : ''} ${step >= f.from && step <= f.dock ? 'is-play' : ''}`}
                  ref={el => { floatRefs.current[i] = el }}
                  style={{ ['--i' as string]: i }}
                >
                  <div className="hs-float-show">
                    <div className="hs-float-drag" ref={el => { dragRefs.current[i] = el }}>{floatEls[i]}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hs-cursor" ref={cursorRef} aria-hidden="true">
              <svg width="18" height="20" viewBox="0 0 18 20"><path d="M2 1.5v15.2l4.1-3.9 2.6 5.9 2.9-1.3-2.6-5.8 5.7-.3z" fill="#101010" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            </div>
          </div>

          <ol className="hs-steps" ref={stepsRef} aria-label="What just happened">
            {STEPS.map((s, i) => {
              const done = step >= s.at && step < FLOW.end
              return (
                <li key={s.label} className={done ? 'done' : ''}>
                  <span className="n ui-num">{done ? <Icon.Check size={11} /> : i + 1}</span>{s.label}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

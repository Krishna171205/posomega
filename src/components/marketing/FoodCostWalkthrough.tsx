'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * "How it works" for the food cost tool: five steps, each with a small animated scene
 * that explains the step rather than decorating it (yield shrinking a bar, ingredients
 * landing on a plate while the cost counts up, dishes sorting into the four verdicts).
 * Seen once per visit, so it may take its time. The stage replays on every step change
 * (key=step). Auto-advance is driven by the progress bar's CSS animation ending, so
 * pausing on hover, focus or off-screen is just animation-play-state. With
 * prefers-reduced-motion the bar is hidden (no auto-play), counters jump to their final
 * value and scenes only fade.
 */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts from 0 to `to` after `delay` ms, easing out. */
function useCountUp(to: number, delay = 0, duration = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (reduced()) { setV(to); return }
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1)
      setV(to * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, delay, duration])
  return v
}

const rs = (n: number, dp = 2) => `Rs ${n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`
const css = (o: Record<string, string | number>) => o as React.CSSProperties

/** Ingredient photos in public/img/food, chosen by us. `pos` is the crop focus for cover crops. */
const PHOTO: Record<string, { src: string; pos?: string; contain?: boolean }> = {
  paneer: { src: '/img/food/paneer.jpg', pos: '55% 45%' },
  // cut-outs on white are shown whole (contain) rather than cropped
  onion: { src: '/img/food/onion.jpg', contain: true },
  milk: { src: '/img/food/milk.jpg', contain: true },
  bread: { src: '/img/food/bread.jpg', pos: '62% 58%' },
  butter: { src: '/img/food/butter.jpg', pos: '58% 42%' },
  tomato: { src: '/img/food/tomato.jpg', pos: '50% 52%' },
}
type Ing = 'paneer' | 'onion' | 'milk' | 'bread' | 'butter' | 'tomato'
const photo = (k: Ing) => PHOTO[k].src
/** object-position for local files, which are not server-cropped. */
const pos = (k: Ing) =>
  PHOTO[k].contain ? css({ objectFit: 'contain', background: '#fff' })
    : PHOTO[k].pos ? css({ objectPosition: PHOTO[k].pos }) : undefined



function BuyScene() {
  const rows = [
    { k: 'paneer' as const, n: 'Paneer', p: 'Rs 380 / kg', y: 100 },
    { k: 'onion' as const, n: 'Onion', p: 'Rs 35 / kg', y: 85 },
    { k: 'milk' as const, n: 'Milk', p: 'Rs 62 / litre', y: 100 },
    { k: 'bread' as const, n: 'Bread', p: 'Rs 12 / slice', y: 100 },
  ]
  return (
    <div className="wt-card">
      <div className="wt-label">What you buy</div>
      <div className="wt-buy-grid">
        {rows.map((r, i) => (
          <div key={r.n} className="wt-in wt-buy" style={css({ '--i': i })}>
            <img className="wt-buy-img" src={photo(r.k)} alt="" width={180} height={110} loading="lazy" decoding="async" style={pos(r.k)} />
            <div className="wt-buy-text">
              <div className="wt-buy-top"><strong>{r.n}</strong><span className="wt-muted">{r.p}</span></div>
              <div className="wt-yield">
                <i style={css({ '--y': r.y / 100, '--i': i })} className={r.y < 100 ? 'wt-yield-cut' : undefined} />
              </div>
              <span className={`wt-chip ${r.y < 100 ? 'wt-chip-warm' : ''}`}>{r.y}% usable</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecipeScene() {
  const lines = [
    { k: 'bread' as const, n: 'Bread', q: '2 pc', v: 24, x: '30%', y: '31%' },
    { k: 'paneer' as const, n: 'Paneer', q: '80 g', v: 30.4, x: '70%', y: '31%' },
    { k: 'butter' as const, n: 'Butter', q: '10 g', v: 5.2, x: '30%', y: '69%' },
    { k: 'tomato' as const, n: 'Tomato, onion', q: '50 g', v: 2.16, x: '70%', y: '69%' },
  ]
  const total = useCountUp(61.76, 250, lines.length * 320)
  return (
    <div className="wt-card wt-recipe">
      <div className="wt-label">Paneer sandwich</div>
      <div className="wt-recipe-body">
        <div className="wt-plate" aria-hidden="true">
          {lines.map((l, i) => (
            <img key={l.n} className="wt-drop" src={photo(l.k)} alt="" width={56} height={56} loading="lazy" style={css({ left: l.x, top: l.y, '--i': i, ...pos(l.k) })} />
          ))}
        </div>
        <div className="wt-recipe-lines">
          {lines.map((l, i) => (
            <div key={l.n} className="wt-in wt-rline" style={css({ '--i': i })}>
              <img className="wt-thumb" src={photo(l.k)} alt="" width={20} height={20} loading="lazy" style={pos(l.k)} />
              <span>{l.n}</span>
              <span className="wt-muted">{l.q}</span>
              <span className="wt-num">{rs(l.v)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="wt-total-row">
        <span>Plate cost</span>
        <strong className="wt-num">{rs(total)}</strong>
      </div>
    </div>
  )
}

function PriceScene() {
  const pct = useCountUp(27, 300, 900)
  const C = 2 * Math.PI * 38
  return (
    <div className="wt-card">
      <div className="wt-label">Paneer sandwich</div>
      <div className="wt-price">
        <div className="wt-in wt-tag" style={css({ '--i': 0 })}>
          <small>Menu price</small>
          <strong>Rs 240</strong>
          <span className="wt-muted">250 sold a month</span>
        </div>
        <div className="wt-ring-wrap wt-in" style={css({ '--i': 1 })}>
          <svg viewBox="0 0 96 96" className="wt-ring" aria-hidden="true">
            <circle cx="48" cy="48" r="38" className="wt-ring-bg" />
            <circle
              cx="48" cy="48" r="38" className="wt-ring-fg"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
            />
          </svg>
          <div className="wt-ring-label"><strong>{pct.toFixed(1)}%</strong><small>goes on food</small></div>
        </div>
      </div>
      <div className="wt-in wt-result" style={css({ '--i': 3 })}>
        <span>Kept per plate</span><strong className="wt-good">Rs 166.81</strong>
      </div>
    </div>
  )
}

function MenuScene() {
  const dishes = [
    { n: 'Cold coffee', k: 'keep', q: 'tr' },
    { n: 'Cappuccino', k: 'reprice', q: 'br' },
    { n: 'Paneer sandwich', k: 'promote', q: 'tl' },
    { n: 'Cheese toast', k: 'rethink', q: 'bl' },
  ]
  const label: Record<string, string> = { keep: 'Keep', reprice: 'Reprice', promote: 'Promote', rethink: 'Rethink' }
  return (
    <div className="wt-card">
      <div className="wt-label">Your menu, sorted</div>
      <div className="wt-matrix">
        <span className="wt-axis wt-axis-y">Earns more per plate →</span>
        <div className="wt-quads">
          {(['tl', 'tr', 'bl', 'br'] as const).map(q => {
            const d = dishes.find(x => x.q === q)!
            return (
              <div key={q} className={`wt-quad wt-q-${d.k}`}>
                <span className="wt-quad-name">{label[d.k]}</span>
                <span
                  className={`wt-fly fc-tag fc-${d.k}`}
                  style={css({ '--fx': q.endsWith('l') ? '40%' : '-40%', '--fy': q.startsWith('t') ? '60%' : '-60%', '--i': dishes.indexOf(d) })}
                >{d.n}</span>
              </div>
            )
          })}
        </div>
        <span className="wt-axis wt-axis-x">Sells more →</span>
      </div>
    </div>
  )
}

function CheckScene() {
  const leak = useCountUp(13325, 900, 900)
  return (
    <div className="wt-card">
      <div className="wt-label">Last month</div>
      <div className="wt-in wt-bar-row" style={css({ '--i': 0 })}>
        <span>Recipes say</span>
        <div className="wt-bar"><i style={css({ '--w': 23.3 / 40, '--i': 0 })} /></div>
        <span className="wt-num">23.3%</span>
      </div>
      <div className="wt-in wt-bar-row" style={css({ '--i': 1 })}>
        <span>You spent</span>
        <div className="wt-bar">
          <i className="wt-bar-spent" style={css({ '--w': 27.7 / 40, '--split': `${(23.3 / 27.7) * 100}%`, '--i': 1 })} />
        </div>
        <span className="wt-num">27.7%</span>
      </div>
      <div className="wt-in wt-leak-note" style={css({ '--i': 4 })}>
        <span>Lost to wastage, portions or theft</span>
        <strong>Rs {Math.round(leak).toLocaleString('en-IN')}</strong>
      </div>
    </div>
  )
}

type Step = { t: string; d: string; href: string; tint: string; Scene: () => React.JSX.Element }

const STEPS: Step[] = [
  { t: 'List what you buy', d: 'Price per kg, litre or piece from your latest invoice, and the yield: how much you can actually use after peeling or trimming.', href: '#fc-buy', tint: '#f5b900', Scene: BuyScene },
  { t: 'Build each recipe', d: 'Grams, millilitres or pieces on one plate, including garnish, oil and the takeaway cup. The plate cost adds up as you go.', href: '#fc-recipes', tint: '#f97316', Scene: RecipeScene },
  { t: 'Add price and monthly sales', d: 'Your menu price and roughly how many you sell a month. Your POS sales report has the counts.', href: '#fc-recipes', tint: '#0fc27b', Scene: PriceScene },
  { t: 'Read the menu report', d: 'Every dish lands in one of four corners. If it is over target, you also get the price that fixes it.', href: '#fc-menu', tint: '#0071e3', Scene: MenuScene },
  { t: 'Check against last month', d: 'Enter your stock counts. The gap between what your recipes say and what you actually spent is money leaking out.', href: '#fc-check', tint: '#ff5b59', Scene: CheckScene },
]

export function FoodCostWalkthrough() {
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(true)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  // Play only while the walkthrough is on screen.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { Scene, tint } = STEPS[step]

  return (
    <div className="wt" ref={root} data-playing={auto && visible ? '' : undefined}>
      <div>
      <ol className="wt-steps">
        {STEPS.map((s, i) => (
          <li key={s.t} className={i === step ? 'is-on' : undefined} style={css({ '--tint': s.tint })}>
            <button
              type="button"
              className="wt-step"
              aria-current={i === step ? 'step' : undefined}
              onClick={() => { setStep(i); setAuto(false) }}
            >
              <span className="wt-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="wt-t">{s.t}</span>
            </button>
            {i === step && (
              <div className="wt-body">
                <p>{s.d}</p>
                <a href={s.href} className="wt-jump">Go to this part ↓</a>
              </div>
            )}
            {i === step && auto && (
              <span
                className="wt-progress"
                aria-hidden="true"
                onAnimationEnd={() => setStep(n => (n + 1) % STEPS.length)}
              />
            )}
          </li>
        ))}
      </ol>
      {!auto && (
        <button type="button" className="wt-replay" onClick={() => setAuto(true)}>▶ Play the steps again</button>
      )}
      </div>
      <div className="wt-stage" aria-hidden="true" style={css({ '--tint': tint })}>
        <Scene key={step} />
      </div>
    </div>
  )
}

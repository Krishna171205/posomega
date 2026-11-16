'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { Peek, type Enter } from './crew/Peek'
import type { Who } from './crew/parts'
import { ChannelBadge } from './hero/HeroScene'
import type { Channel } from '@/content/home'

type Outlet = {
  id: string
  name: string
  /** The line under the name on the card */
  kind: string
  /** What Omega does for it. Every clause traces to src/content/segments.ts or the pricing plans. */
  text: string
  pills: string[]
  link: { href: string; label: string }
  /** The crew member who pops up in the preview, each with their own entrance */
  crew: { who: Who; enter: Enter; side: 'left' | 'right' }
}

/*
 * The formats Omega says it is built for (src/content/landing-pages.ts: "cafés and
 * bakeries, quick-service restaurants and food courts, chef-led dining rooms, bars
 * and breweries, and delivery-only cloud kitchens"), plus chains from the
 * Enterprise plan. It is explicitly not built for retail, so no grocery or
 * convenience tiles of the kind toasttab.com lists.
 */
const OUTLETS: Outlet[] = [
  {
    id: 'cafes', name: 'Cafés', kind: 'Coffee shops and all-day cafés',
    text: 'Tabs for the guest who stays all afternoon, fast order entry for the morning queue, and tips that split themselves.',
    pills: ['Open tabs', 'Phone-number loyalty', 'Tip pools'],
    link: { href: '/for/cafes', label: 'Omega for cafés' },
    crew: { who: 'server', enter: 'walk', side: 'right' },
  },
  {
    id: 'bakeries', name: 'Bakeries', kind: 'Bakeries and coffee roasters',
    text: 'Quick counter billing with HSN codes on every invoice, and stock that flags what will run out before the next delivery.',
    pills: ['Fast order entry', 'HSN codes on invoices', 'Low-stock alerts'],
    link: { href: '/for/cafes', label: 'Omega for cafés and bakeries' },
    crew: { who: 'store', enter: 'pop', side: 'left' },
  },
  {
    id: 'qsr', name: 'Quick service', kind: 'QSR counters and drive-thrus',
    text: 'Self-order kiosks and QR, a drive-thru flow run from one terminal, and a kitchen display that sends each item to its station.',
    pills: ['Self-order kiosks', 'Drive-thru flow', 'Multi-station KDS'],
    link: { href: '/for/qsr', label: 'Omega for QSR' },
    crew: { who: 'chef', enter: 'hat', side: 'right' },
  },
  {
    id: 'food-courts', name: 'Food courts', kind: 'Food courts and transport hubs',
    text: 'Kiosk and QR ordering in the language each guest reads, with every order landing in the same kitchen queue as the counter.',
    pills: ['Multilingual kiosks', 'QR ordering', 'One kitchen queue'],
    link: { href: '/for/qsr', label: 'Omega for QSR and food courts' },
    crew: { who: 'manager', enter: 'phone', side: 'left' },
  },
  {
    id: 'fine-dining', name: 'Fine dining', kind: 'Chef-led dining rooms',
    text: 'Courses fired on cue, allergy flags printed on every KOT, and a guestbook that remembers each regular.',
    pills: ['Course pacing', 'Allergy flags', 'Reservations'],
    link: { href: '/for/fine-dining', label: 'Omega for fine dining' },
    crew: { who: 'captain', enter: 'lean', side: 'right' },
  },
  {
    id: 'cloud-kitchens', name: 'Cloud kitchens', kind: 'Delivery-only, many brands',
    text: 'Several brands out of one kitchen, every aggregator in one queue, and profit and loss reported brand by brand.',
    pills: ['Multi-brand menus', 'One aggregator queue', 'Per-brand P&L'],
    link: { href: '/for/cloud-kitchens', label: 'Omega for cloud kitchens' },
    crew: { who: 'chef', enter: 'pop', side: 'left' },
  },
  {
    id: 'bars', name: 'Bars & breweries', kind: 'Bars, pubs and lounges',
    text: 'Pour cost to the millilitre, tabs pre-authorised on card, and happy-hour prices that switch themselves on and off.',
    pills: ['Pour-cost tracking', 'Tab management', 'Happy-hour pricing'],
    link: { href: '/for/bars', label: 'Omega for bars' },
    crew: { who: 'owner', enter: 'walk', side: 'right' },
  },
  {
    id: 'chains', name: 'Chains & franchises', kind: 'More than ten outlets',
    text: 'Push a menu or price change to every outlet from one screen, keep regional overrides, and report per brand.',
    pills: ['Multi-outlet menu control', 'Regional overrides', 'Per-brand reporting'],
    link: { href: '/pricing', label: 'Plans for chains' },
    crew: { who: 'manager', enter: 'eyes', side: 'left' },
  },
]

/* ── Ink icons, 64×64. `.acc` areas take the soft blue; classed groups move on hover. ── */
const st = { fill: '#fff', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const ln = { ...st, fill: 'none' }

export function OutletIcon({ id }: { id: string }) {
  switch (id) {
    case 'cafes':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-steam"><path {...ln} d="M26.5 12.5c-2-2.5 2-4.5 0-7.5M32 11.5c-2-2.5 2-4.5 0-7.5M37.5 12.5c-2-2.5 2-4.5 0-7.5" /></g>
          <path {...st} d="M19.5 22 23.6 55a2 2 0 0 0 2 1.8h12.8a2 2 0 0 0 2-1.8L44.5 22Z" />
          <path {...st} className="acc" d="M21.2 31h21.6l-1.5 13H22.7Z" />
          <circle cx="32" cy="37.5" r="3.1" fill="currentColor" />
          <path {...st} d="M22 17.5 23.6 14h16.8l1.6 3.5" />
          <rect {...st} x="18" y="17.5" width="28" height="5" rx="2" />
        </svg>
      )
    case 'bakeries':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-steam"><path {...ln} d="M25.5 14.5c-2-2.5 2-4.5 0-7.5M32 13.5c-2-2.5 2-4.5 0-7.5M38.5 14.5c-2-2.5 2-4.5 0-7.5" /></g>
          <g className="ol-loaf">
            <path {...st} d="M13 34h38v16a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3Z" />
            <path {...st} className="acc" d="M11.5 36c-1.8-10.5 8-16 20.5-16s22.3 5.5 20.5 16Z" />
            <path {...ln} d="m21 29 4-4m5 3 4-4m5 4 4-4" />
            <g fill="currentColor"><circle cx="20" cy="44" r="1.3" /><circle cx="27" cy="48" r="1.3" /><circle cx="37" cy="45" r="1.3" /><circle cx="44" cy="48.5" r="1.3" /></g>
          </g>
        </svg>
      )
    case 'qsr':
      return (
        <svg viewBox="0 0 64 64">
          <path {...st} d="M13 46h38v2a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6Z" />
          <rect x="13" y="37.5" width="38" height="6" rx="3" fill="currentColor" />
          <path {...ln} d="M12 34.5q3.3 3 6.7 0t6.7 0 6.6 0 6.7 0 6.6 0 6.7 0" />
          <g className="ol-bun">
            <path {...st} className="acc" d="M13 31c0-11 8.6-16.5 19-16.5S51 20 51 31Z" />
            <path {...ln} strokeWidth={1.8} d="m24 22.5 2-1m6-1.5 2-1m6 3.5 2-1m-14 4.5 2-1m7 1 2-1" />
          </g>
        </svg>
      )
    case 'food-courts':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-sign">
            <path {...ln} d="M22 10v8m20-8v8" />
            <rect {...st} x="13" y="18" width="38" height="30" rx="5" />
            <circle {...st} className="acc" cx="32" cy="33" r="9" />
            <circle {...ln} strokeWidth={1.6} cx="32" cy="33" r="5" />
            <path {...ln} strokeWidth={1.8} d="M20 26v14m-2-14v4a2 2 0 0 0 4 0v-4m22 0q3 4 0 8v6" />
          </g>
          <path {...ln} strokeWidth={2.6} d="M11 10h42" />
        </svg>
      )
    case 'fine-dining':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-steam ol-steam-low"><path {...ln} d="M25 43c-2-2.5 2-4.5 0-7.5M32 42c-2-2.5 2-4.5 0-7.5M39 43c-2-2.5 2-4.5 0-7.5" /></g>
          <g className="ol-dome">
            <path {...st} className="acc" d="M13 46c0-12.5 8.5-19 19-19s19 6.5 19 19Z" />
            <path fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" d="M19.5 41c.8-5 4-8.5 8.5-9.6" />
            <circle {...st} cx="32" cy="24" r="3" />
          </g>
          <path {...ln} strokeWidth={2.4} d="M8 46.5h48M15 51.5h34" />
        </svg>
      )
    case 'cloud-kitchens':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-speed"><path {...ln} d="M4 31h7m-9 6h9m-6 6h6" /></g>
          <g className="ol-bag">
            <path {...ln} d="M28 22v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" />
            <rect {...st} className="acc" x="16" y="22" width="40" height="32" rx="5" />
            <path {...ln} d="M16 28.5h40" />
            <path {...st} d="M30 46.5a4 4 0 0 1-.4-8 6 6 0 0 1 11.6-1.2 4.6 4.6 0 0 1 1.3 9.2Z" />
          </g>
        </svg>
      )
    case 'bars':
      return (
        <svg viewBox="0 0 64 64">
          <path {...ln} strokeWidth={2.2} d="M44 30h4a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-4" />
          <path {...st} className="acc" d="M17 27h28v25a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4Z" />
          <path fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" d="M24 35v13m7-13v13m7-13v13" />
          <g className="ol-bubbles" fill="#fff"><circle cx="27" cy="50" r="1.3" /><circle cx="34.5" cy="47" r="1.1" /><circle cx="29.5" cy="43" r="1" /></g>
          <g className="ol-foam">
            <path {...st} d="M15.5 28.5c-2-5.5 1.5-8 5-8 .5-5.5 6.5-6.5 9-4 2.5-4 9-3.5 10.5 1 5-1 8 2 6.5 7 2.5 1.5 1.5 4.5-1 4.5H18c-1.5 0-2.3-.2-2.5-.5Z" />
            <path {...ln} d="M43.5 29q2 3.5 0 6.5" />
          </g>
        </svg>
      )
    case 'chains':
      return (
        <svg viewBox="0 0 64 64">
          <g className="ol-store ol-store-a">
            <rect {...st} x="6" y="31" width="20" height="23" rx="2" />
            <path {...st} className="acc" d="M5 31h22v4q-2.75 3-5.5 0-2.75 3-5.5 0-2.75 3-5.5 0Q7.75 38 5 35Z" />
            <path {...ln} d="M12.5 54v-9h7v9" />
          </g>
          <g className="ol-store ol-store-b">
            <rect x="30" y="13.5" width="20" height="7" rx="2" fill="currentColor" />
            <rect {...st} x="22" y="24" width="36" height="30" rx="2" />
            <path {...st} className="acc" d="M20 24h40v6q-5 4-10 0-5 4-10 0-5 4-10 0-5 4-10 0Z" />
            <rect {...ln} x="27" y="37" width="13" height="10" rx="1.5" />
            <path {...st} d="M45.5 54V39h8v15" />
          </g>
          <path {...ln} d="M3 54h58" />
        </svg>
      )
  }
  return null
}

/* ── The mini Omega screen each crew member peeks over in the preview ── */
function Scene({ id }: { id: string }) {
  switch (id) {
    case 'cafes':
      return (
        <>
          <div className="olt-row"><b>Open tab · Laptop corner</b><span className="ui-num">₹680</span></div>
          <div className="olt-row olt-sub"><span>3× Flat White, 1× Croissant</span><span className="ui-num">2h 10m</span></div>
        </>
      )
    case 'bakeries':
      return (
        <>
          <div className="olt-row"><b>Sourdough loaf</b><span className="tag tag-warn">Low</span></div>
          <div className="olt-row olt-sub"><span>28 pc on hand · brunch on Sunday</span></div>
        </>
      )
    case 'qsr':
      return (
        <div className="olt-tokens">
          {([['A41', 'Ready', 'ok'], ['A42', 'Ready', 'ok'], ['A43', 'Cooking', 'warn']] as const).map(([n, s, c]) => (
            <span key={n} className={`olt-token ${c}`}><b className="ui-num">{n}</b>{s}</span>
          ))}
        </div>
      )
    case 'food-courts':
      return (
        <>
          <div className="olt-row"><b>A45 · Kiosk 2</b><span className="tag tag-info">In kitchen queue</span></div>
          <div className="olt-row olt-sub"><span>2× Paneer Tikka Roll · paid by UPI</span></div>
        </>
      )
    case 'fine-dining':
      return (
        <>
          <div className="olt-row"><b>Table 5 · Mains</b><span className="tag tag-warn">Fire at 20:40</span></div>
          <div className="olt-row"><span className="fw-flag">Seat 3 · nut allergy</span></div>
        </>
      )
    case 'cloud-kitchens':
      return (
        <div className="olt-brands">
          {([['swiggy', 'Bowls', '₹1,940'], ['zomato', 'Wraps', '₹1,220'], ['swiggy', 'Desserts', '₹860']] as const).map(([ch, b, v]) => (
            <span key={b} className="olt-brand"><ChannelBadge ch={ch as Channel} /><b>{b}</b><span className="ui-num">{v}</span></span>
          ))}
        </div>
      )
    case 'bars':
      return (
        <>
          <div className="olt-row"><b>House rum · 30 ml pours</b><span className="ui-num olt-sub">72% left</span></div>
          <span className="olt-bar" aria-hidden="true"><i style={{ width: '72%' }} /></span>
        </>
      )
    case 'chains':
      return (
        <>
          <div className="olt-row"><b>Cold Brew</b><span className="ui-num"><s>₹180</s> ₹190</span></div>
          <div className="olt-row olt-sub"><span>Price pushed to 3 outlets</span><span className="tag tag-ok">Live</span></div>
        </>
      )
  }
  return null
}

/**
 * Outlet types, after petpooja.com's outlet grid and toasttab.com's format list,
 * drawn in the site's ink style. Each tile animates its own icon on hover; after a
 * short hover (or a tap, or keyboard focus) a preview card rises over the tile with
 * a crew member, a mini Omega screen, the features that format gets and a link.
 *
 * The preview is a child of its tile, so moving from the tile onto the preview
 * never counts as leaving. A shared timer gives hover intent: scanning across the
 * grid wiggles icons without flashing previews, and once one is open the next one
 * follows quickly.
 */
export function Outlets() {
  const [open, setOpen] = useState<string | null>(null)
  const openRef = useRef<string | null>(null)
  const hovered = useRef<string | null>(null)
  const timer = useRef(0)
  const cells = useRef<Record<string, HTMLDivElement | null>>({})
  openRef.current = open

  const enter = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hovered.current = id
    window.clearTimeout(timer.current)
    if (openRef.current === id) return
    timer.current = window.setTimeout(() => setOpen(id), openRef.current ? 70 : 220)
  }
  const leave = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (hovered.current === id) hovered.current = null
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => { if (!hovered.current) setOpen(null) }, 140)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Escape closes and returns focus; a tap or click anywhere else closes.
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(null)
      cells.current[open]?.querySelector<HTMLButtonElement>('.ol-card')?.focus()
    }
    const down = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.('.ol-cell.is-open')) setOpen(null)
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', down)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', down) }
  }, [open])

  // Keep every preview on screen, open or not: a hidden one still counts toward
  // the page width, and on a phone the right-hand column's would make the page
  // scroll sideways. Each centres on its tile, then shifts sideways if needed.
  useEffect(() => {
    let raf = 0
    const place = () => {
      raf = 0
      const vw = document.documentElement.clientWidth
      for (const cell of Object.values(cells.current)) {
        const pop = cell?.querySelector<HTMLElement>('.ol-pop')
        if (!cell || !pop) continue
        const r = cell.getBoundingClientRect()
        const w = pop.offsetWidth
        const want = r.left + r.width / 2 - w / 2
        pop.style.setProperty('--dx', `${(Math.min(vw - 12 - w, Math.max(12, want)) - want).toFixed(1)}px`)
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(place) }
    place()
    window.addEventListener('resize', schedule)
    return () => { window.removeEventListener('resize', schedule); if (raf) cancelAnimationFrame(raf) }
  }, [])

  // A soft spotlight follows the pointer across the tile under it.
  function spot(e: React.PointerEvent) {
    const card = (e.target as Element).closest<HTMLElement>('.ol-card')
    if (!card) return
    const r = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - r.left}px`)
    card.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <section className="section outlets" id="outlets" aria-labelledby="outlets-title">
      <div className="container">
        <div className="sec-head center ol-head" data-rv>
          <div className="eyebrow"><span className="dot" />Outlet types</div>
          <h2 id="outlets-title" className="h-section">Built for the way <span className="h-muted">you serve.</span></h2>
          <p className="lede">
            A café, a QSR line and a coursed dining room need different things from the same till.
            Pick yours to see what Omega does for it.
          </p>
        </div>

        <div className="ol-grid has-peek" data-rv style={{ ['--rv-i' as string]: 1 }} onPointerMove={spot}>
          {OUTLETS.map(o => {
            const isOpen = open === o.id
            return (
              <div
                key={o.id}
                ref={el => { cells.current[o.id] = el }}
                className={`ol-cell ${isOpen ? 'is-open' : ''}`}
                onPointerEnter={enter(o.id)}
                onPointerLeave={leave(o.id)}
                onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(cur => (cur === o.id ? null : cur)) }}
              >
                <button
                  type="button"
                  className="ol-card"
                  aria-expanded={isOpen}
                  aria-controls={`ol-${o.id}`}
                  onClick={() => setOpen(cur => (cur === o.id ? null : o.id))}
                  onFocus={e => { if (e.currentTarget.matches(':focus-visible')) setOpen(o.id) }}
                >
                  <span className={`ol-ic ol-ic-${o.id}`} aria-hidden="true"><OutletIcon id={o.id} /></span>
                  <span className="ol-name">{o.name}</span>
                  <span className="ol-kind">{o.kind}</span>
                </button>

                <div className="ol-pop" id={`ol-${o.id}`} role="region" aria-label={`${o.name}: what Omega does`} inert={!isOpen}>
                  <div className="ol-vis">
                    <span className={`ol-ghost ol-ic-${o.id}`} aria-hidden="true"><OutletIcon id={o.id} /></span>
                    <div className="ol-scene has-peek">
                      <Scene id={o.id} />
                      <Peek who={o.crew.who} enter={o.crew.enter} side={o.crew.side} x="9%" active={isOpen} />
                    </div>
                    <button type="button" className="ol-x" aria-label="Close" onClick={() => setOpen(null)}><Icon.Close size={13} /></button>
                  </div>
                  <div className="ol-pop-body">
                    <div className="ol-pop-h"><b>{o.name}</b><span>{o.kind}</span></div>
                    <p>{o.text}</p>
                    <ul className="ol-pills">
                      {o.pills.map((p, i) => <li key={p} style={{ ['--k' as string]: i }}>{p}</li>)}
                    </ul>
                    <a href={o.link.href} className="text-link ol-link">{o.link.label} <Icon.Arrow size={12} /></a>
                  </div>
                </div>
              </div>
            )
          })}
          <Peek who="chef" say="Which counter is yours?" side="right" x="6%" enter="pop" />
        </div>
      </div>
    </section>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { HERO } from '@/content/home'

/** Sign-in happens in the POS app. Under `next dev` this opens the local preview of the redesigned page (app/login). */
const SIGN_IN = process.env.NODE_ENV === 'development' ? '/login' : 'https://billing.pepperpe.com/login'

type MenuItem = { href: string; t: string; d: string }
type Menu = { id: string; label: string; items: MenuItem[]; foot?: MenuItem }

const MENUS: Menu[] = [
  {
    id: 'platform',
    label: 'Platform',
    items: [
      { href: '/features/billing-and-kot', t: 'Billing & KOT', d: 'GST per line, station routing, mixed tenders.' },
      { href: '/features/kitchen-display', t: 'Kitchen display', d: 'One queue for every channel, by station.' },
      { href: '/features/inventory-and-forecasting', t: 'Inventory', d: 'Recipe-level stock, wastage, purchases.' },
      { href: '/features/offline-mode', t: 'Offline mode', d: 'The Android app keeps billing without internet.' },
      { href: '/qr-menu', t: 'QR menu & table ordering', d: 'Guests order from their table, with Grabbit.' },
    ],
    foot: { href: '/app', t: 'Android app', d: 'Early access' },
  },
  {
    id: 'solutions',
    label: 'Solutions',
    items: [
      { href: '/for/cafes', t: 'Cafés', d: 'Fast billing, loyalty by phone, recipe stock.' },
      { href: '/for/qsr', t: 'QSR', d: 'Combos, station KDS, token display.' },
      { href: '/for/fine-dining', t: 'Fine dining', d: 'Floor plan, call waiter, reservations.' },
      { href: '/for/cloud-kitchens', t: 'Cloud kitchens', d: 'Swiggy and Zomato in one queue, own riders.' },
      { href: '/for/bars', t: 'Bars & breweries', d: 'Happy hour on a timer, bar and kitchen stations.' },
      { href: '/for', t: 'All outlet types', d: 'Food courts, bakeries, pizzerias, chains and more.' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    items: [
      { href: '/integrations/swiggy-zomato', t: 'Swiggy & Zomato orders', d: 'Aggregator orders in the same queue.' },
      { href: '/integrations/upi-and-payments', t: 'UPI & payments', d: 'Recorded against the bill, matched at close.' },
      { href: '/gst-billing-software-for-restaurants', t: 'GST billing', d: 'Tax per line, GSTIN, Tally export.' },
      { href: '/restaurant-billing-software', t: 'Restaurant billing software', d: 'What to look for, honestly.' },
    ],
  },
]

const BANNER_KEY = 'omega-banner-dismissed'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [banner, setBanner] = useState(true)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    try { if (sessionStorage.getItem(BANNER_KEY)) setBanner(false) } catch { /* storage blocked */ }
    const onScroll = () => setScrolled(window.scrollY > 8)
    const onResize = () => { if (window.innerWidth >= 960) setDrawer(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setDrawer(false) } }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : ''
  }, [drawer])

  function dismissBanner() {
    setBanner(false)
    try { sessionStorage.setItem(BANNER_KEY, '1') } catch { /* storage blocked */ }
  }
  function enter(id: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(id)
  }
  function leave() {
    closeTimer.current = window.setTimeout(() => setOpen(null), 120)
  }

  return (
    <>
      {banner && (
        <div className="banner">
          <a href={HERO.banner.href} className="banner-link">
            <span className="banner-new">New</span>
            {HERO.banner.label}
            <Icon.Arrow size={12} />
          </a>
          <button className="banner-x" onClick={dismissBanner} aria-label="Dismiss announcement">
            <Icon.Close size={14} />
          </button>
        </div>
      )}

      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav-inner">
          <a href="/" className="nav-logo" aria-label="PepperPe home">
            <span className="glyph" aria-hidden="true">Ω</span>
            <span>PepperPe</span>
          </a>

          <nav className="nav-links" aria-label="Main">
            {MENUS.map(m => (
              <div
                key={m.id}
                className="nav-item"
                onMouseEnter={() => enter(m.id)}
                onMouseLeave={leave}
              >
                <button
                  className="nav-link"
                  aria-expanded={open === m.id}
                  onClick={() => setOpen(open === m.id ? null : m.id)}
                >
                  {m.label} <Icon.ChevronDown size={11} />
                </button>
                {open === m.id && (
                  <div className="nav-pop" onMouseEnter={() => enter(m.id)} onMouseLeave={leave}>
                    <ul>
                      {m.items.map(it => (
                        <li key={it.href}>
                          <a href={it.href} className="nav-pop-item" onClick={() => setOpen(null)}>
                            <span className="t">{it.t}</span>
                            <span className="d">{it.d}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    {m.foot && (
                      <a href={m.foot.href} className="nav-pop-foot">
                        <span>{m.foot.t}</span>
                        <span className="tag tag-info">{m.foot.d}</span>
                        <Icon.Arrow size={12} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            <a href="/integrations" className="nav-link">Integrations</a>
          </nav>

          <div className="nav-cta">
            <a href={SIGN_IN} className="btn btn-ghost btn-sm nav-hide-sm">Sign in</a>
            <a href={HERO.secondary.href} className="btn btn-outline btn-sm nav-hide-md">{HERO.secondary.label}</a>
            <a href={HERO.primary.href} className="btn btn-blue btn-sm">{HERO.primary.label}</a>
            <button className="nav-burger" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
              <Icon.Menu />
            </button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-head">
            <a href="/" className="nav-logo"><span className="glyph" aria-hidden="true">Ω</span><span>PepperPe</span></a>
            <button className="nav-burger" aria-label="Close menu" onClick={() => setDrawer(false)}><Icon.Close size={18} /></button>
          </div>
          <div className="drawer-body">
            {MENUS.map(m => (
              <div key={m.id} className="drawer-group">
                <div className="drawer-label">{m.label}</div>
                {[...m.items, ...(m.foot ? [m.foot] : [])].map(it => (
                  <a key={it.href} href={it.href} className="drawer-link" onClick={() => setDrawer(false)}>{it.t}</a>
                ))}
              </div>
            ))}
            <div className="drawer-group">
              <a href="/integrations" className="drawer-link" onClick={() => setDrawer(false)}>Integrations</a>
              <a href={SIGN_IN} className="drawer-link">Sign in</a>
            </div>
          </div>
          <div className="drawer-foot">
            <a href={HERO.secondary.href} className="btn btn-outline btn-lg">{HERO.secondary.label}</a>
            <a href={HERO.primary.href} className="btn btn-blue btn-lg">{HERO.primary.label}</a>
          </div>
        </div>
      )}
    </>
  )
}

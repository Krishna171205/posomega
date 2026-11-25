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
      { href: '/nfc-table-tags', t: 'NFC table tags', d: 'One tap for menu, Wi-Fi, rewards, reviews.' },
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

/** The phone menu shows each link with an icon beside its line of description */
const ICONS: Record<string, React.ReactNode> = {
  '/features/billing-and-kot': <Icon.Printer size={17} />,
  '/features/kitchen-display': <Icon.Flame size={17} />,
  '/features/inventory-and-forecasting': <Icon.Box size={17} />,
  '/features/offline-mode': <Icon.WifiOff size={17} />,
  '/qr-menu': <Icon.Grid size={17} />,
  '/nfc-table-tags': <Icon.Wifi size={17} />,
  '/app': <Icon.Phone size={17} />,
  '/for/cafes': <Icon.Coffee size={17} />,
  '/for/qsr': <Icon.Lightning size={17} />,
  '/for/fine-dining': <Icon.Users size={17} />,
  '/for/cloud-kitchens': <Icon.Truck size={17} />,
  '/for/bars': <Icon.Clock size={17} />,
  '/for': <Icon.Store size={17} />,
  '/integrations/swiggy-zomato': <Icon.Globe size={17} />,
  '/integrations/upi-and-payments': <Icon.Tag size={17} />,
  '/gst-billing-software-for-restaurants': <Icon.Receipt size={17} />,
  '/restaurant-billing-software': <Icon.Search size={17} />,
}

const BANNER_KEY = 'omega-banner-dismissed'

/** Two lines that turn into a cross when the menu opens (nav.css) */
const Burger = () => <span className="burger" aria-hidden="true"><i /><i /></span>

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  /** The group open in the phone menu */
  const [sect, setSect] = useState<string | null>(null)
  /** Where the phone menu starts: over the header, wherever the header is */
  const [top, setTop] = useState(0)
  const [banner, setBanner] = useState(true)
  const closeTimer = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  function openMenu() {
    setTop(Math.max(0, Math.round(headerRef.current?.getBoundingClientRect().top ?? 0)))
    setSect(null)
    setDrawer(true)
  }
  function closeMenu() {
    if (menuRef.current?.contains(document.activeElement)) burgerRef.current?.focus({ preventScroll: true })
    setDrawer(false)
  }

  useEffect(() => {
    try { if (sessionStorage.getItem(BANNER_KEY)) setBanner(false) } catch { /* storage blocked */ }
    const onScroll = () => setScrolled(window.scrollY > 8)
    const onResize = () => {
      if (window.innerWidth >= 960) setDrawer(false)
      else setTop(Math.max(0, Math.round(headerRef.current?.getBoundingClientRect().top ?? 0)))
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); closeMenu() } }
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

  /* The phone menu is a dialog: the page stays put underneath, focus starts on its close
     button and Tab stays inside it until it closes. */
  useEffect(() => {
    document.documentElement.style.overflow = drawer ? 'hidden' : ''
    if (!drawer) return
    closeRef.current?.focus({ preventScroll: true })
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !menuRef.current) return
      const nodes = [...menuRef.current.querySelectorAll<HTMLElement>('a[href], button')]
        .filter(n => !n.closest('[inert]') && n.getClientRects().length > 0)
      if (!nodes.length) return
      const at = nodes.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey ? at <= 0 : at === -1 || at === nodes.length - 1) {
        e.preventDefault()
        nodes[e.shiftKey ? nodes.length - 1 : 0].focus()
      }
    }
    document.addEventListener('keydown', onTab)
    return () => document.removeEventListener('keydown', onTab)
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

      <header ref={headerRef} className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
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
            <button
              ref={burgerRef}
              className="nav-burger"
              aria-label="Open menu"
              aria-expanded={drawer}
              aria-controls="phone-menu"
              onClick={openMenu}
            >
              <Burger />
            </button>
          </div>
        </div>
      </header>

      {/* The phone menu. Always in the page, so it can fade out as well as in; inert while
          closed. Its own header sits exactly over the page's, where the burger turns into
          a cross. Each group opens in place, one at a time. */}
      <div
        ref={menuRef}
        id="phone-menu"
        className={`mm ${drawer ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!drawer}
        style={{ ['--mm-top' as string]: `${top}px` }}
      >
        <div className="mm-top">
          <a href="/" className="nav-logo" aria-label="PepperPe home" onClick={closeMenu}>
            <span className="glyph" aria-hidden="true">Ω</span>
            <span>PepperPe</span>
          </a>
          <button ref={closeRef} className="nav-burger" aria-label="Close menu" onClick={closeMenu}>
            <Burger />
          </button>
        </div>

        <nav className="mm-body" aria-label="Main">
          {MENUS.map((m, gi) => {
            const on = sect === m.id
            return (
              <div key={m.id} className={`mm-group ${on ? 'is-open' : ''}`} style={{ ['--r' as string]: gi }}>
                <button className="mm-head" aria-expanded={on} aria-controls={`mm-${m.id}`} onClick={() => setSect(on ? null : m.id)}>
                  {m.label}
                  <span className="mm-chev" aria-hidden="true"><Icon.ChevronDown size={14} /></span>
                </button>
                <div className="mm-items" id={`mm-${m.id}`} inert={!on}>
                  <ul>
                    {[...m.items, ...(m.foot ? [m.foot] : [])].map((it, i) => (
                      <li key={it.href} style={{ ['--i' as string]: i }}>
                        <a href={it.href} className="mm-item" onClick={closeMenu}>
                          <span className="mm-ic" aria-hidden="true">{ICONS[it.href]}</span>
                          <span className="mm-tx">
                            <span className="mm-t">
                              {it.t}
                              {it === m.foot && <span className="tag tag-info">{it.d}</span>}
                            </span>
                            {it !== m.foot && <span className="mm-d">{it.d}</span>}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
          <a href="/integrations" className="mm-row" style={{ ['--r' as string]: 3 }} onClick={closeMenu}>
            Integrations <Icon.Arrow size={16} />
          </a>
          <a href={SIGN_IN} className="mm-row" style={{ ['--r' as string]: 4 }} onClick={closeMenu}>
            Sign in <Icon.Arrow size={16} />
          </a>
        </nav>

        <div className="mm-foot">
          <a href={HERO.secondary.href} className="btn btn-outline btn-lg" onClick={closeMenu}>{HERO.secondary.label}</a>
          <a href={HERO.primary.href} className="btn btn-blue btn-lg" onClick={closeMenu}>{HERO.primary.label}</a>
        </div>
      </div>
    </>
  )
}

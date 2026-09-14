'use client'
import { useEffect, useState } from 'react'
import { Icon } from './Icons'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <a href="/" className="nav-logo">
        <span className="glyph">Ω</span>
        <span>Omega</span>
      </a>
      <div className="nav-links">
        <a href="#product" className="nav-link">Product</a>
        <a href="#industries" className="nav-link">Industries</a>
        <a href="#hardware" className="nav-link">Hardware</a>
        <a href="#pricing" className="nav-link">Pricing</a>
        <a href="#" className="nav-link">Docs</a>
      </div>
      <div className="nav-cta">
        <a href="https://cafe.posomega.com/login" className="btn btn-ghost btn-sm">Sign in</a>
        <a href="/get-started" className="btn btn-primary btn-sm">
          Book a demo <Icon.Arrow size={12} />
        </a>
      </div>
    </nav>
  )
}

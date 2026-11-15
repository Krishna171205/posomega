'use client'
import { useEffect } from 'react'

/**
 * Scroll-in reveals, the quiet fade-up notion.com and attio.com give each block.
 * Mark an element with `data-rv` (and optionally style={{ '--rv-i': n }} to stagger
 * siblings); it rises into place the first time it scrolls into view.
 *
 * The hidden starting state only applies once this has run (html.rv-on), so the
 * page reads fine before hydration and with JavaScript off. With reduced motion
 * it does nothing at all. Elements mounted later (a tab switch, for instance) are
 * picked up by a MutationObserver, batched to one scan per frame.
 */
export function Reveals() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('rv-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    const scan = () => document.querySelectorAll('[data-rv]:not(.rv-in)').forEach(el => io.observe(el))
    scan()
    // Anything already on screen is marked in the same task, so it never flashes hidden.
    root.classList.add('rv-on')

    let raf = 0
    const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; scan() }) })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      if (raf) cancelAnimationFrame(raf)
      root.classList.remove('rv-on')
    }
  }, [])
  return null
}

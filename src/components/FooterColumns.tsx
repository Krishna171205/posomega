'use client'
import { useEffect, useState } from 'react'
import { Icon } from './Icons'

export type FooterCol = { h: string; links: { href: string; t: string; ext?: boolean }[] }

/**
 * The footer's link groups. On a phone each one folds into a row that opens with a tap,
 * so the footer is a few rows instead of a long two-column list. Elsewhere they are
 * always open and the headings are plain headings (the server render is open too, so the
 * links are there for search engines and before any script runs).
 */
export function FooterColumns({ cols }: { cols: FooterCol[] }) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <>
      {cols.map(c => (
        <details key={`${c.h}-${compact}`} className="footer-col" open={!compact}>
          <summary onClick={e => { if (!compact) e.preventDefault() }} tabIndex={compact ? 0 : -1}>
            <h2>{c.h}</h2>
            <span className="footer-chev" aria-hidden="true"><Icon.ChevronDown size={13} /></span>
          </summary>
          <ul>
            {c.links.map(l => (
              <li key={l.href}>
                <a href={l.href} {...(l.ext ? { target: '_blank', rel: 'noopener' } : {})}>{l.t}</a>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </>
  )
}

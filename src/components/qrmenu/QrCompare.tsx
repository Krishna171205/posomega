'use client'

import { useState } from 'react'

/*
 * "Most QR menus stop at the menu": pick what to compare against, see both columns side
 * by side with a score, and tap a row for why it matters. Competitors are categories,
 * not named products, and the "apps" column is hedged where it varies.
 */

type Cell = true | false | string
type Row = { row: string; why: string; free: Cell; apps: Cell }

const ROWS: Row[] = [
  { row: 'Menu on the guest’s phone', why: 'No printed menus to reprint when a price changes.', free: true, apps: true },
  { row: 'Order from the table', why: 'Guests order the moment they sit down.', free: false, apps: true },
  { row: 'Order reaches the kitchen, no retyping', why: 'Nobody re-keys a phone order into the POS.', free: false, apps: 'Separate tablet' },
  { row: 'Table number on the kitchen ticket', why: 'Food goes to the right table the first time.', free: false, apps: 'Varies' },
  { row: 'Call a waiter', why: 'Requests show on the floor screen, not by waving.', free: false, apps: 'Rarely' },
  { row: 'Pay by UPI at the table', why: 'Tables free up as soon as the meal ends.', free: false, apps: 'Some' },
  { row: 'Updates the GST bill and stock', why: 'One order, one bill, ingredients deducted.', free: false, apps: false },
  { row: 'One menu everywhere', why: 'Change a price once for counter, tables and online.', free: false, apps: false },
]

const RIVALS = { free: 'A free QR menu', apps: 'QR ordering apps' } as const
type Rival = keyof typeof RIVALS

function Mark({ c }: { c: Cell }) {
  if (c === true) return <span className="qc-yes"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg><span className="sr-only">Yes</span></span>
  if (c === false) return <span className="qc-no"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg><span className="sr-only">No</span></span>
  return <span className="qc-some">{c}</span>
}

export function QrCompare() {
  const [rival, setRival] = useState<Rival>('free')
  const [open, setOpen] = useState<number | null>(null)
  const full = ROWS.filter(r => r[rival] === true).length
  const part = ROWS.filter(r => typeof r[rival] === 'string').length

  return (
    <div className="qc">
      <div className="qc-switch" role="group" aria-label="Compare PepperPe with">
        <span className="qc-switch-label">Compare with</span>
        {(Object.keys(RIVALS) as Rival[]).map(k => (
          <button key={k} type="button" aria-pressed={rival === k} className={rival === k ? 'is-on' : undefined} onClick={() => setRival(k)}>
            {RIVALS[k]}
          </button>
        ))}
      </div>

      <div className="qc-board">
        <div className="qc-head">
          <span />
          <div className="qc-col">
            <strong key={rival} className="qc-swap">{RIVALS[rival]}</strong>
            <div className="qc-meter"><i style={{ width: `${((full + part / 2) / ROWS.length) * 100}%` }} /></div>
            <small>{full} of {ROWS.length}{part ? `, ${part} partly` : ''}</small>
          </div>
          <div className="qc-col qc-us">
            <strong>PepperPe with Grabbit</strong>
            <div className="qc-meter"><i style={{ width: '100%' }} /></div>
            <small>{ROWS.length} of {ROWS.length}</small>
          </div>
        </div>

        <ul className="qc-rows">
          {ROWS.map((r, i) => (
            <li key={r.row} className={open === i ? 'is-open' : undefined}>
              <button type="button" className="qc-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className="qc-label">{r.row}<i className="qc-chev" aria-hidden="true" /></span>
                <span className="qc-cell"><span key={rival} className="qc-swap"><Mark c={r[rival]} /></span></span>
                <span className="qc-cell qc-us"><Mark c={true} /></span>
              </button>
              {open === i && <p className="qc-why">{r.why}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

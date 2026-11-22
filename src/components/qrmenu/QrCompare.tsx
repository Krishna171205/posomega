'use client'

import { useState, type CSSProperties } from 'react'

/*
 * Side-by-side comparison: rival columns plus PepperPe, a score each, and tap a row for
 * why it matters. Rivals are categories, not named products, hedged where they vary.
 * Used by /qr-menu (defaults below) and /nfc-table-tags.
 */

export type Cell = true | false | string
export type CompareRow = { row: string; why: string; cells: Cell[] }

const QR_COLS = ['A free QR menu', 'QR ordering apps']
const QR_ROWS: CompareRow[] = [
  { row: 'Menu on the guest’s phone', why: 'No printed menus to reprint when a price changes.', cells: [true, true] },
  { row: 'Order from the table', why: 'Guests order the moment they sit down.', cells: [false, true] },
  { row: 'Order reaches the kitchen, no retyping', why: 'Nobody re-keys a phone order into the POS.', cells: [false, 'Separate tablet'] },
  { row: 'Table number on the kitchen ticket', why: 'Food goes to the right table the first time.', cells: [false, 'Varies'] },
  { row: 'Call a waiter', why: 'Requests show on the floor screen, not by waving.', cells: [false, 'Rarely'] },
  { row: 'Pay by UPI at the table', why: 'Tables free up as soon as the meal ends.', cells: [false, 'Some'] },
  { row: 'Updates the GST bill and stock', why: 'One order, one bill, ingredients deducted.', cells: [false, false] },
  { row: 'One menu everywhere', why: 'Change a price once for counter, tables and online.', cells: [false, false] },
]

function Mark({ c }: { c: Cell }) {
  if (c === true) return <span className="qc-yes"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg><span className="sr-only">Yes</span></span>
  if (c === false) return <span className="qc-no"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg><span className="sr-only">No</span></span>
  return <span className="qc-some">{c}</span>
}

function Score({ name, full, part, total, us }: { name: string; full: number; part?: number; total: number; us?: boolean }) {
  return (
    <div className={us ? 'qc-col qc-us' : 'qc-col'}>
      <strong>{name}</strong>
      <div className="qc-meter"><i style={{ width: `${((full + (part ?? 0) / 2) / total) * 100}%` }} /></div>
      <small>{full} of {total}{part ? `, ${part} partly` : ''}</small>
    </div>
  )
}

export function QrCompare({ cols = QR_COLS, rows = QR_ROWS }: { cols?: string[]; rows?: CompareRow[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const count = (c: number) => rows.filter(r => r.cells[c] === true).length
  const partly = (c: number) => rows.filter(r => typeof r.cells[c] === 'string').length

  return (
    <div className="qc">
      <div className="qc-board" style={{ '--qc-n': cols.length + 1 } as CSSProperties}>
        <div className="qc-head">
          <span />
          {cols.map((name, c) => <Score key={name} name={name} full={count(c)} part={partly(c)} total={rows.length} />)}
          <Score name="PepperPe with Grabbit" full={rows.length} total={rows.length} us />
        </div>

        <ul className="qc-rows">
          {rows.map((r, i) => (
            <li key={r.row} className={open === i ? 'is-open' : undefined}>
              <button type="button" className="qc-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className="qc-label">{r.row}<i className="qc-chev" aria-hidden="true" /></span>
                {r.cells.map((c, j) => <span key={j} className="qc-cell"><Mark c={c} /></span>)}
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

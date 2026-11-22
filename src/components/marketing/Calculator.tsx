'use client'

import { useState } from 'react'
import type { ToolKind } from '@/content/types'
import { gst, menuPrice } from '@/lib/calc'
import { Select } from './Select'
import { FoodCostTool } from './FoodCostTool'

const inr = (n: number) =>
  `Rs ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Empty or junk input counts as 0, so the result never shows NaN. */
const num = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function Field({ label, value, onChange, suffix }: {
  label: string
  value: string
  onChange: (v: string) => void
  suffix?: string
}) {
  return (
    <div className="form-field">
      <label>
        <span>{label}{suffix && <span className="tool-suffix"> ({suffix})</span>}</span>
        <input
          className="form-input"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}

function GstSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="form-field">
      <label>
        GST rate
        <Select
          label="GST rate"
          value={value}
          onChange={onChange}
          options={[
            { value: '5', label: '5% (standalone restaurant, café, takeaway)' },
            { value: '18', label: '18% (restaurant in a specified hotel premises)' },
            { value: '0', label: '0% (composition scheme, no GST on the bill)' },
          ]}
        />
      </label>
    </div>
  )
}

function Rows({ rows }: { rows: [string, string, boolean?][] }) {
  return (
    <dl className="tool-out" aria-live="polite">
      {rows.map(([k, v, strong]) => (
        <div key={k} className={strong ? 'tool-strong' : undefined}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function GstCalc() {
  const [amount, setAmount] = useState('1000')
  const [rate, setRate] = useState('5')
  const [inclusive, setInclusive] = useState(false)
  const r = gst(num(amount), num(rate), inclusive)
  return (
    <>
      <div className="tool-in">
        <Field label="Amount" suffix="Rs" value={amount} onChange={setAmount} />
        <GstSelect value={rate} onChange={setRate} />
        <div className="form-field">
          <label>
            The amount is
            <Select
              label="The amount is"
              value={inclusive ? 'in' : 'ex'}
              onChange={v => setInclusive(v === 'in')}
              options={[
                { value: 'ex', label: 'before GST (add tax on top)' },
                { value: 'in', label: 'the menu price, GST included' },
              ]}
            />
          </label>
        </div>
      </div>
      <Rows rows={[
        ['Taxable value', inr(r.base)],
        [`CGST (${num(rate) / 2}%)`, inr(r.cgst)],
        [`SGST (${num(rate) / 2}%)`, inr(r.sgst)],
        ['Bill total', inr(r.total), true],
      ]} />
    </>
  )
}

function MenuPriceCalc() {
  const [cost, setCost] = useState('60')
  const [target, setTarget] = useState('30')
  const [rate, setRate] = useState('5')
  const r = menuPrice(num(cost), num(target), num(rate))
  return (
    <>
      <div className="tool-in">
        <Field label="Ingredient cost per plate" suffix="Rs" value={cost} onChange={setCost} />
        <Field label="Target food cost" suffix="%" value={target} onChange={setTarget} />
        <GstSelect value={rate} onChange={setRate} />
      </div>
      <Rows rows={[
        ['Price before GST', inr(r.exGst)],
        ['Price with GST', inr(r.withGst)],
        ['Menu price, rounded up to Rs 5', `Rs ${r.rounded}`, true],
      ]} />
    </>
  )
}

const CALCS: Record<Exclude<ToolKind, 'food-cost'>, () => React.JSX.Element> = {
  gst: GstCalc,
  'menu-price': MenuPriceCalc,
}

export function Calculator({ kind }: { kind: ToolKind }) {
  if (kind === 'food-cost') return <FoodCostTool />
  const C = CALCS[kind]
  return (
    <section className="mk-block" aria-label="Calculator">
      <div className="tool">
        <C />
      </div>
    </section>
  )
}

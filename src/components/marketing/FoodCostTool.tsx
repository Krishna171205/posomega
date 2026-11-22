'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import {
  foodCostPct, menuReport, unitCost, RECIPE_UNIT,
  type BuyUnit, type Dish, type Ingredient, type Verdict,
} from '@/lib/calc'
import { SAMPLE } from '@/content/food-cost-sample'
import { FoodCostWalkthrough } from './FoodCostWalkthrough'
import { Select } from './Select'

/* Everything stays in this browser. Nothing is sent anywhere. */
const KEY = 'pepperpe-food-cost-v1'
const GST = 5

type Stock = { opening: string; purchases: string; closing: string; sales: string }
type State = { target: number; inclusive: boolean; ingredients: Ingredient[]; dishes: Dish[]; stock: Stock; example?: boolean }

/** Everyone starts with an empty menu; the walkthrough above does the demonstrating. */
const fresh = (): State => ({
  target: 30,
  inclusive: true,
  ingredients: [],
  dishes: [],
  stock: { opening: '', purchases: '', closing: '', sales: '' },
})

/** The example café, loaded only when asked for, and labelled while it is on screen. */
const example = (): State => ({
  target: SAMPLE.target,
  inclusive: true,
  ingredients: SAMPLE.ingredients,
  dishes: SAMPLE.dishes,
  stock: { opening: '20000', purchases: '80000', closing: '15000', sales: '307000' },
  example: true,
})

const num = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : 0
}
const rs = (n: number, dp = 0) =>
  `Rs ${n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`
const id = () => Math.random().toString(36).slice(2, 10)

const VERDICT: Record<Verdict, { label: string; tip: string }> = {
  keep: { label: 'Keep', tip: 'Sells well and earns well. Protect the recipe and the price.' },
  reprice: { label: 'Reprice', tip: 'Sells well, but earns less per plate than your average dish. Because so many sell, even Rs 10 more, or a slightly lighter recipe, adds up fast.' },
  promote: { label: 'Promote', tip: 'Earns well but few people order it. Move it up the menu, name it on the board, train staff to suggest it.' },
  rethink: { label: 'Rethink', tip: 'Sells little and earns little. Rework it, or free up the menu space.' },
  solo: { label: 'Add another dish', tip: 'Verdicts compare your dishes with each other, so they appear once a second dish is costed.' },
  incomplete: { label: 'Needs details', tip: 'Add a menu price, and a recipe with priced ingredients, to see where this dish stands.' },
}

/** Number input that keeps whatever the person typed until it parses. */
function NumIn({ value, onChange, label, className }: {
  value: number
  onChange: (n: number) => void
  label: string
  className?: string
}) {
  // Zero shows as an empty field with a 0 placeholder, so new rows do not look filled in.
  const show = (n: number) => (n === 0 ? '' : String(n))
  const [text, setText] = useState(show(value))
  useEffect(() => { if (num(text) !== value) setText(show(value)) }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <input
      className={`form-input ${className ?? ''}`}
      inputMode="decimal"
      placeholder="0"
      aria-label={label}
      value={text}
      onChange={e => { setText(e.target.value); onChange(num(e.target.value)) }}
    />
  )
}

type Option = { kind: 'pick'; ing: Ingredient } | { kind: 'new'; name: string }

/**
 * Type-to-search ingredient field. Picks an existing ingredient, or creates a new one
 * from whatever was typed, so nobody is limited to the example list.
 */
function IngredientPicker({ value, ingredients, onPick, onCreate, autoFocus }: {
  value: string
  ingredients: Ingredient[]
  onPick: (id: string) => void
  onCreate: (name: string) => void
  autoFocus?: boolean
}) {
  const listId = useId()
  const current = ingredients.find(i => i.id === value)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const q = query.trim().toLowerCase()
  const showAll = !q || q === current?.name.toLowerCase()
  const matches = ingredients.filter(i => showAll || i.name.toLowerCase().includes(q))
  const options: Option[] = [
    ...matches.map(ing => ({ kind: 'pick' as const, ing })),
    ...(q && !ingredients.some(i => i.name.toLowerCase() === q) ? [{ kind: 'new' as const, name: query.trim() }] : []),
  ]

  function choose(o: Option | undefined) {
    if (!o) return
    if (o.kind === 'pick') onPick(o.ing.id)
    else onCreate(o.name)
    setOpen(false)
  }

  return (
    <div className="fc-pick">
      <input
        className="form-input"
        role="combobox"
        aria-label="Ingredient"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        placeholder="Type an ingredient"
        autoFocus={autoFocus}
        value={open ? query : current?.name ?? ''}
        onFocus={e => { setQuery(current?.name ?? ''); setActive(0); setOpen(true); e.target.select() }}
        onBlur={() => setOpen(false)}
        onChange={e => { setQuery(e.target.value); setActive(0); setOpen(true) }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, options.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
          else if (e.key === 'Enter') { e.preventDefault(); choose(options[active]); (e.target as HTMLInputElement).blur() }
          else if (e.key === 'Escape') { setOpen(false) }
        }}
      />
      {open && options.length > 0 && (
        <ul className="fc-pick-list" id={listId} role="listbox">
          {options.map((o, i) => (
            <li
              key={o.kind === 'pick' ? o.ing.id : 'new'}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`${i === active ? 'is-active' : ''} ${o.kind === 'new' ? 'fc-pick-new' : ''}`}
              onMouseDown={e => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
            >
              {o.kind === 'pick'
                ? <><span>{o.ing.name || 'Untitled'}</span><small>{o.ing.price > 0 ? `${rs(o.ing.price)} per ${o.ing.unit === 'l' ? 'litre' : o.ing.unit === 'pc' ? 'piece' : 'kg'}` : 'no price yet'}</small></>
                : <span>+ Add &ldquo;{o.name}&rdquo; as a new ingredient</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const UNIT_FROM_RECIPE: Record<string, BuyUnit> = { g: 'kg', ml: 'l', pc: 'pc' }

function csv(rows: (string | number)[][]) {
  return rows.map(r => r.map(c => {
    const s = String(c)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }).join(',')).join('\n')
}

export function FoodCostTool() {
  const [s, setS] = useState<State>(fresh)
  const [loaded, setLoaded] = useState(false)
  /** Dish just created from a button, so its name field can take focus. */
  const [justAdded, setJustAdded] = useState<string | null>(null)

  // Read after mount so the server-rendered sample and the first client render match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setS({ ...fresh(), ...JSON.parse(raw) })
    } catch { /* private window or blocked storage: start empty */ }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* see above */ }
  }, [s, loaded])

  const report = useMemo(
    () => menuReport(s.dishes, s.ingredients, s.target, GST, s.inclusive),
    [s.dishes, s.ingredients, s.target, s.inclusive],
  )
  const ingById = useMemo(() => new Map(s.ingredients.map(i => [i.id, i])), [s.ingredients])
  const actual = foodCostPct(num(s.stock.opening), num(s.stock.purchases), num(s.stock.closing), num(s.stock.sales))
  const leak = (actual.pct - report.pct) / 100 * num(s.stock.sales)

  const setIng = (i: number, patch: Partial<Ingredient>) =>
    setS(p => ({ ...p, ingredients: p.ingredients.map((x, j) => j === i ? { ...x, ...patch } : x) }))
  const setDish = (i: number, patch: Partial<Dish>) =>
    setS(p => ({ ...p, dishes: p.dishes.map((x, j) => j === i ? { ...x, ...patch } : x) }))
  const setLine = (d: number, l: number, patch: Partial<Dish['lines'][number]>) =>
    setDish(d, { lines: s.dishes[d].lines.map((x, j) => j === l ? { ...x, ...patch } : x) })

  /** Adds a new ingredient (price to be filled in under What you buy) and puts it on the line. */
  function createOnLine(d: number, l: number, name: string) {
    const ing: Ingredient = { id: id(), name, unit: 'kg', price: 0, yieldPct: 100 }
    setS(p => ({
      ...p,
      ingredients: [...p.ingredients, ing],
      dishes: p.dishes.map((x, j) => j === d ? { ...x, lines: x.lines.map((y, k) => k === l ? { ...y, ing: ing.id } : y) } : x),
    }))
  }

  function download() {
    const body = csv([
      ['Dish', 'Menu price', 'Sold per month', 'Plate cost', 'Food cost %', 'Margin per plate', 'Price to hit target', 'Verdict'],
      ...report.rows.map(r => [
        r.dish.name, r.dish.price, r.dish.sold, r.cost.toFixed(2), r.pct.toFixed(1),
        r.margin.toFixed(2), r.suggested, VERDICT[r.verdict].label,
      ]),
    ])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/csv' }))
    a.download = 'menu-food-cost.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const hasData = s.dishes.length > 0 || s.ingredients.length > 0
  const ready = report.sales > 0

  function addDish() {
    const d: Dish = { id: id(), name: '', price: 0, sold: 0, lines: [] }
    setS(p => ({ ...p, dishes: [...p.dishes, d] }))
    setJustAdded(d.id)
  }
  function loadExample() {
    if (!hasData || confirm('Replace what you have entered with the example café?')) setS(example())
  }
  function clearAll() {
    if (confirm('Clear every dish and ingredient? This cannot be undone.')) setS(fresh())
  }

  return (
    <section className="mk-block fc" aria-label="Food cost calculator">
      <h2 className="h-section mk-h2">How it works</h2>
      <p className="fc-note">Five steps, about ten minutes with your last few invoices.</p>
      <FoodCostWalkthrough />

      {s.example && (
        <div className="fc-banner fc-h" role="status">
          <span><strong>This is an example café</strong>, not your data. Change anything to see how the numbers move.</span>
          <button type="button" className="btn btn-secondary" onClick={() => { if (confirm('Clear the example café and start with your own menu?')) setS(fresh()) }}>Clear it and start with my menu</button>
        </div>
      )}

      {!ready ? (
        <div className="fc-start fc-h">
          <h3>Start with your best-selling dish</h3>
          <p>
            Add it under Recipes below: type each ingredient and how much goes on one plate, then its menu
            price and roughly how many you sell a month. Your menu report appears here as soon as one dish is complete.
          </p>
          <div className="fc-start-actions">
            <a href="#fc-recipes" className="btn btn-blue" onClick={() => { if (s.dishes.length === 0) addDish() }}>Add your first dish</a>
            {!s.example && <button type="button" className="btn btn-secondary" onClick={loadExample}>Or try an example café</button>}
          </div>
        </div>
      ) : (
      <div className="fc-summary fc-h">
        <div className="fc-stat">
          <span>Menu food cost</span>
          <strong className={report.pct > s.target ? 'fc-bad' : 'fc-good'}>{report.pct.toFixed(1)}%</strong>
          <small>target {s.target}%</small>
        </div>
        <div className="fc-stat">
          <span>Food cost per month</span>
          <strong>{rs(report.cost)}</strong>
          <small>on {rs(report.sales)} sales before GST</small>
        </div>
        <div className="fc-stat">
          <span>{report.gap > 0 ? 'Above target costs you' : 'Below target saves you'}</span>
          <strong className={report.gap > 0 ? 'fc-bad' : 'fc-good'}>{rs(Math.abs(report.gap))}</strong>
          <small>per month</small>
        </div>
      </div>
      )}

      <div className="fc-settings">
        <label>
          Target food cost (%)
          <NumIn className="fc-num" label="Target food cost" value={s.target} onChange={n => setS(p => ({ ...p, target: n }))} />
        </label>
        <label>
          Menu prices
          <Select
            label="Menu prices"
            value={s.inclusive ? 'in' : 'ex'}
            onChange={v => setS(p => ({ ...p, inclusive: v === 'in' }))}
            options={[
              { value: 'in', label: 'include 5% GST' },
              { value: 'ex', label: 'are before GST' },
            ]}
          />
        </label>
        <div className="fc-actions">
          {ready && <button type="button" className="btn btn-secondary" onClick={download}>Download CSV</button>}
          {hasData && <button type="button" className="btn btn-secondary" onClick={clearAll}>Clear everything</button>}
        </div>
      </div>

      {/* ── Menu ─────────────────────────────────────── */}
      <h2 className="h-section mk-h2 fc-h" id="fc-menu">Your menu</h2>
      <p className="fc-note">Each dish, judged on how well it sells and how much it earns per plate.</p>
      <div className="fc-menu">
        {report.rows.length === 0 && <p className="fc-empty">Your dishes show up here, with a verdict for each, once they have a price and a recipe.</p>}
        {report.rows.map(r => (
          <div className="fc-row" key={r.dish.id}>
            <div className="fc-row-name">
              <strong>{r.dish.name || 'Untitled dish'}</strong>
              <span className={`fc-tag fc-${r.verdict}`} title={VERDICT[r.verdict].tip}>{VERDICT[r.verdict].label}</span>
            </div>
            {r.verdict !== 'incomplete' && <dl className="fc-row-nums">
              <div><dt>Plate cost</dt><dd>{rs(r.cost, 2)}</dd></div>
              <div><dt>Food cost</dt><dd className={r.pct > s.target ? 'fc-bad' : undefined}>{r.pct.toFixed(1)}%</dd></div>
              <div><dt>Margin / plate</dt><dd>{rs(r.margin, 2)}</dd></div>
              <div><dt>Price to hit target</dt><dd>{r.pct > s.target ? rs(r.suggested) : 'Already under'}</dd></div>
            </dl>}
            <p className="fc-tip">{VERDICT[r.verdict].tip}</p>
          </div>
        ))}
      </div>

      {/* ── Recipes ─────────────────────────────────────── */}
      <h2 className="h-section mk-h2 fc-h" id="fc-recipes">Recipes</h2>
      <p className="fc-note">Quantities on one plate. Include packaging for takeaway.</p>
      <div className="fc-dishes">
        {s.dishes.map((d, di) => {
          const row = report.rows[di]
          return (
            <details className="fc-dish" key={d.id} open={di === 0 || d.lines.length === 0}>
              <summary>
                <span>{d.name || 'Untitled dish'}</span>
                <span className="fc-dish-cost">{rs(row?.cost ?? 0, 2)} a plate</span>
              </summary>
              <div className="fc-dish-head">
                <label>Dish<input className="form-input" aria-label="Dish name" placeholder="e.g. Masala chai" autoFocus={d.id === justAdded} value={d.name} onChange={e => setDish(di, { name: e.target.value })} /></label>
                <label>Menu price (Rs)<NumIn label="Menu price" value={d.price} onChange={n => setDish(di, { price: n })} /></label>
                <label>Sold per month<NumIn label="Sold per month" value={d.sold} onChange={n => setDish(di, { sold: n })} /></label>
              </div>
              {d.lines.map((l, li) => {
                const ing = ingById.get(l.ing)
                return (
                  <div className="fc-line" key={li}>
                    <IngredientPicker
                      value={l.ing}
                      ingredients={s.ingredients}
                      autoFocus={!l.ing}
                      onPick={ing => setLine(di, li, { ing })}
                      onCreate={name => createOnLine(di, li, name)}
                    />
                    <div className="fc-qty">
                      <NumIn label="Quantity" value={l.qty} onChange={n => setLine(di, li, { qty: n })} />
                      {ing ? (
                        <Select
                          className="fc-unit"
                          label={`Unit for ${ing.name}`}
                          value={RECIPE_UNIT[ing.unit]}
                          onChange={v => setIng(s.ingredients.indexOf(ing), { unit: UNIT_FROM_RECIPE[v] })}
                          options={[{ value: 'g', label: 'g' }, { value: 'ml', label: 'ml' }, { value: 'pc', label: 'pc' }]}
                        />
                      ) : <span className="fc-unit-empty" />}
                    </div>
                    <span className="fc-line-cost">{rs(ing ? unitCost(ing) * l.qty : 0, 2)}</span>
                    <button type="button" className="fc-x" aria-label="Remove ingredient" onClick={() => setDish(di, { lines: d.lines.filter((_, j) => j !== li) })}>×</button>
                    {ing && ing.price === 0 && (
                      <p className="fc-line-warn">
                        {ing.name} has no price yet. <a href="#fc-buy">Add it under What you buy</a>.
                      </p>
                    )}
                  </div>
                )
              })}
              <div className="fc-dish-foot">
                <button
                  type="button"
                  className="fc-link"
                  onClick={() => setDish(di, { lines: [...d.lines, { ing: '', qty: 0 }] })}
                >+ Add ingredient</button>
                <button
                  type="button"
                  className="fc-link fc-danger"
                  onClick={() => setS(p => ({ ...p, dishes: p.dishes.filter((_, j) => j !== di) }))}
                >Remove dish</button>
              </div>
            </details>
          )
        })}
      </div>
      <button
        type="button"
        className="btn btn-secondary fc-add"
        onClick={addDish}
      >+ Add dish</button>

      {/* ── Ingredients ─────────────────────────────────────── */}
      <h2 className="h-section mk-h2 fc-h" id="fc-buy">What you buy</h2>
      <p className="fc-note">
        Price per kg, litre or piece from your last invoice. Yield is the share you can actually use
        after peeling, trimming or spillage.
      </p>
      <div className="fc-ings">
        {s.ingredients.length === 0 && <p className="fc-empty">Ingredients you type into a recipe appear here, ready for their price.</p>}
        {s.ingredients.map((i, ii) => (
          <div className="fc-ing" key={i.id}>
            <input className="form-input" aria-label="Ingredient name" value={i.name} onChange={e => setIng(ii, { name: e.target.value })} />
            <div className="fc-qty">
              <span>Rs</span>
              <NumIn label={`Price of ${i.name}`} className={i.price === 0 ? 'has-error' : undefined} value={i.price} onChange={n => setIng(ii, { price: n })} />
            </div>
            <Select<BuyUnit>
              label={`${i.name || 'Ingredient'} bought by`}
              value={i.unit}
              onChange={v => setIng(ii, { unit: v })}
              options={[{ value: 'kg', label: 'per kg' }, { value: 'l', label: 'per litre' }, { value: 'pc', label: 'per piece' }]}
            />
            <div className="fc-qty">
              <NumIn label="Yield %" value={i.yieldPct} onChange={n => setIng(ii, { yieldPct: n })} />
              <span>% yield</span>
            </div>
            <button
              type="button"
              className="fc-x"
              aria-label={`Remove ${i.name}`}
              disabled={s.dishes.some(d => d.lines.some(l => l.ing === i.id))}
              title="Remove it from every recipe first"
              onClick={() => setS(p => ({ ...p, ingredients: p.ingredients.filter((_, j) => j !== ii) }))}
            >×</button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-secondary fc-add"
        onClick={() => setS(p => ({ ...p, ingredients: [...p.ingredients, { id: id(), name: '', unit: 'kg', price: 0, yieldPct: 100 }] }))}
      >+ Add ingredient</button>

      {/* ── Actual vs theoretical ─────────────────────────────────────── */}
      <h2 className="h-section mk-h2 fc-h" id="fc-check">Check last month against your recipes</h2>
      <p className="fc-note">
        Your recipes say what food should have cost. Your stock counts say what it did cost.
        The difference is wastage, portion drift, comps and loss.
      </p>
      <div className="fc-check">
        <div className="tool-in">
          {([
            ['opening', 'Opening stock value'],
            ['purchases', 'Purchases in the month'],
            ['closing', 'Closing stock value'],
            ['sales', 'Food sales, before GST'],
          ] as const).map(([k, label]) => (
            <label key={k}>
              {label} (Rs)
              <input
                className="form-input"
                inputMode="decimal"
                value={s.stock[k]}
                onChange={e => setS(p => ({ ...p, stock: { ...p.stock, [k]: e.target.value } }))}
              />
            </label>
          ))}
        </div>
        {num(s.stock.sales) > 0 && ready ? (
          <dl className="tool-out" aria-live="polite">
            <div><dt>Actual food cost</dt><dd>{actual.pct.toFixed(1)}%</dd></div>
            <div><dt>What your recipes say</dt><dd>{report.pct.toFixed(1)}%</dd></div>
            <div className="tool-strong">
              <dt>{leak > 0 ? 'Unaccounted this month' : 'Better than recipe by'}</dt>
              <dd className={leak > 0 ? 'fc-bad' : 'fc-good'}>{rs(Math.abs(leak))}</dd>
            </div>
          </dl>
        ) : (
          <p className="fc-empty">Fill in last month&rsquo;s figures, and cost at least one dish above, to see how far actual spending drifted from your recipes.</p>
        )}
      </div>
      <p className="fc-note fc-private">Saved in this browser only. Nothing you enter is sent to PepperPe or anyone else.</p>
    </section>
  )
}

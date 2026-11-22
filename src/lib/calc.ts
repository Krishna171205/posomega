/** Pure maths behind the /tools calculators. Money is rounded to paise. */

const paise = (n: number) => Math.round(n * 100) / 100

export type GstResult = { base: number; tax: number; cgst: number; sgst: number; total: number }

/**
 * GST on an amount. `inclusive` means the amount already contains the tax (a menu
 * price); otherwise tax is added on top. CGST and SGST are each half the tax, which
 * is the intra-state split every dine-in bill uses.
 */
export function gst(amount: number, ratePct: number, inclusive: boolean): GstResult {
  const base = inclusive ? amount * 100 / (100 + ratePct) : amount
  const tax = paise(base * ratePct / 100)
  const half = paise(tax / 2)
  return { base: paise(base), tax, cgst: half, sgst: paise(tax - half), total: paise(base + tax) }
}

/**
 * Food cost percentage for a period: what the food you used cost, as a share of food
 * sales. Used = opening stock + purchases - closing stock. Sales exclude GST.
 */
export function foodCostPct(opening: number, purchases: number, closing: number, sales: number) {
  const used = opening + purchases - closing
  return { used: paise(used), pct: sales > 0 ? paise(used / sales * 100) : 0 }
}

/**
 * Menu price for a dish from its plate cost and a target food cost %. Returns the
 * price before GST, the price a guest pays with GST, and that rounded up to the next
 * Rs 5 because menus are printed in round numbers.
 */
export function menuPrice(plateCost: number, targetPct: number, gstPct: number) {
  if (targetPct <= 0) return { exGst: 0, withGst: 0, rounded: 0 }
  const exGst = plateCost / (targetPct / 100)
  const withGst = exGst * (1 + gstPct / 100)
  return { exGst: paise(exGst), withGst: paise(withGst), rounded: Math.ceil(withGst / 5) * 5 }
}

/* ── Recipe and menu costing (/tools/food-cost-calculator) ─────────────── */

/** Bought by the kg, litre or piece; used in recipes by the g, ml or piece. */
export type BuyUnit = 'kg' | 'l' | 'pc'
export type Ingredient = { id: string; name: string; unit: BuyUnit; price: number; yieldPct: number }
export type Dish = { id: string; name: string; price: number; sold: number; lines: { ing: string; qty: number }[] }
/** 'incomplete' = no menu price or no costed recipe yet; left out of the menu averages. */
/** 'solo' = the only costed dish: verdicts compare dishes, so one alone has none. */
export type Verdict = 'keep' | 'reprice' | 'promote' | 'rethink' | 'incomplete' | 'solo'

export const RECIPE_UNIT: Record<BuyUnit, string> = { kg: 'g', l: 'ml', pc: 'pc' }

/**
 * Cost of one g, ml or piece as it lands on the plate. Yield is the usable share after
 * peeling, trimming or spillage, so 1 kg of onions at 85% yield costs more per usable gram.
 */
export function unitCost(i: Ingredient) {
  const perUnit = i.unit === 'pc' ? i.price : i.price / 1000
  return i.yieldPct > 0 ? perUnit / (i.yieldPct / 100) : 0
}

export function plateCost(d: Dish, ings: Map<string, Ingredient>) {
  return d.lines.reduce((sum, l) => {
    const i = ings.get(l.ing)
    return i ? sum + unitCost(i) * l.qty : sum
  }, 0)
}

export type DishRow = {
  dish: Dish
  cost: number
  net: number
  pct: number
  margin: number
  suggested: number
  verdict: Verdict
}

export type MenuReport = {
  rows: DishRow[]
  sales: number
  cost: number
  pct: number
  /** Monthly rupees above target. Negative means under target. */
  gap: number
}

/**
 * Costs every dish and sorts the menu the Kasavana and Smith way: a dish is popular
 * when its share of covers is at least 70% of an equal share, and profitable when its
 * margin per plate beats the menu's sales-weighted average margin.
 */
export function menuReport(
  dishes: Dish[],
  ingredients: Ingredient[],
  targetPct: number,
  gstPct: number,
  priceIncludesGst: boolean,
): MenuReport {
  const ings = new Map(ingredients.map(i => [i.id, i]))
  const base = dishes.map(dish => {
    const cost = plateCost(dish, ings)
    const net = priceIncludesGst ? dish.price / (1 + gstPct / 100) : dish.price
    return { dish, cost, net, pct: net > 0 ? cost / net * 100 : 0, margin: net - cost }
  })

  const done = (r: (typeof base)[number]) => r.net > 0 && r.cost > 0
  const ready = base.filter(done)
  const covers = ready.reduce((s, r) => s + r.dish.sold, 0)
  const sales = ready.reduce((s, r) => s + r.net * r.dish.sold, 0)
  const cost = ready.reduce((s, r) => s + r.cost * r.dish.sold, 0)
  const avgMargin = covers > 0 ? ready.reduce((s, r) => s + r.margin * r.dish.sold, 0) / covers : 0
  const popularAt = ready.length > 0 ? covers / ready.length * 0.7 : 0

  const rows = base.map(r => {
    if (!done(r)) return { ...r, suggested: 0, verdict: 'incomplete' as const }
    const suggested = menuPrice(r.cost, targetPct, priceIncludesGst ? gstPct : 0).rounded
    if (ready.length < 2) return { ...r, suggested, verdict: 'solo' as const }
    const popular = covers > 0 && r.dish.sold >= popularAt
    const profitable = r.margin >= avgMargin - 1e-9 // float noise on equal margins
    const verdict: Verdict = popular ? (profitable ? 'keep' : 'reprice') : (profitable ? 'promote' : 'rethink')
    return { ...r, suggested, verdict }
  })

  const pct = sales > 0 ? cost / sales * 100 : 0
  return { rows, sales, cost, pct, gap: (pct - targetPct) / 100 * sales }
}

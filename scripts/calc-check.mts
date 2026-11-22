// Run: node --experimental-strip-types scripts/calc-check.mts
import assert from 'node:assert/strict'
import { gst, foodCostPct, menuPrice, unitCost, menuReport } from '../src/lib/calc.ts'
import { SAMPLE } from '../src/content/food-cost-sample.ts'

assert.deepEqual(gst(1000, 5, false), { base: 1000, tax: 50, cgst: 25, sgst: 25, total: 1050 })
assert.deepEqual(gst(1050, 5, true), { base: 1000, tax: 50, cgst: 25, sgst: 25, total: 1050 })
assert.deepEqual(gst(99, 5, false), { base: 99, tax: 4.95, cgst: 2.48, sgst: 2.47, total: 103.95 })
assert.equal(gst(1180, 18, true).base, 1000)

assert.deepEqual(foodCostPct(20000, 80000, 25000, 250000), { used: 75000, pct: 30 })
assert.equal(foodCostPct(0, 0, 0, 0).pct, 0)

assert.deepEqual(menuPrice(60, 30, 5), { exGst: 200, withGst: 210, rounded: 210 })
assert.equal(menuPrice(61, 30, 5).rounded, 215)
assert.equal(menuPrice(60, 0, 5).rounded, 0)

assert.ok(Math.abs(unitCost({ id: 'a', name: 'onion', unit: 'kg', price: 34, yieldPct: 85 }) - 0.04) < 1e-9)
assert.equal(unitCost({ id: 'b', name: 'cup', unit: 'pc', price: 6, yieldPct: 100 }), 6)

// The sample menu is built to land one dish in each quadrant.
const r = menuReport(SAMPLE.dishes, SAMPLE.ingredients, SAMPLE.target, 5, true)
assert.deepEqual(r.rows.map(x => x.verdict).sort(), ['keep', 'promote', 'reprice', 'rethink'])
assert.ok(r.pct > 20 && r.pct < 30, `blended ${r.pct}`)
assert.equal(menuReport([], [], 30, 5, true).pct, 0)
// An empty new dish is flagged, and does not move anyone else's verdict.
const withBlank = menuReport([...SAMPLE.dishes, { id: 'x', name: '', price: 0, sold: 0, lines: [] }], SAMPLE.ingredients, SAMPLE.target, 5, true)
assert.equal(withBlank.rows.at(-1)!.verdict, 'incomplete')
assert.deepEqual(withBlank.rows.slice(0, -1).map(x => x.verdict), r.rows.map(x => x.verdict))

// One costed dish has nothing to compare against.
assert.equal(menuReport([SAMPLE.dishes[0]], SAMPLE.ingredients, 30, 5, true).rows[0].verdict, 'solo')

console.log('calc ok')

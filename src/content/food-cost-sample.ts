import type { Dish, Ingredient } from '../lib/calc.ts'

/**
 * The demo café the food cost tool opens with, so the report means something before
 * anyone types. Prices are rough Delhi NCR wholesale figures, not quotes. The mix is
 * tuned so each dish lands in a different menu quadrant (checked in calc-check.mts).
 */
export const SAMPLE: { target: number; ingredients: Ingredient[]; dishes: Dish[] } = {
  target: 30,
  ingredients: [
    { id: 'milk', name: 'Milk', unit: 'l', price: 62, yieldPct: 100 },
    { id: 'beans', name: 'Coffee beans', unit: 'kg', price: 1400, yieldPct: 100 },
    { id: 'sugar', name: 'Sugar', unit: 'kg', price: 45, yieldPct: 100 },
    { id: 'cup', name: 'Takeaway cup and lid', unit: 'pc', price: 6, yieldPct: 100 },
    { id: 'bread', name: 'Bread slice', unit: 'pc', price: 12, yieldPct: 100 },
    { id: 'paneer', name: 'Paneer', unit: 'kg', price: 380, yieldPct: 100 },
    { id: 'cheese', name: 'Cheddar', unit: 'kg', price: 600, yieldPct: 100 },
    { id: 'butter', name: 'Butter', unit: 'kg', price: 520, yieldPct: 100 },
    { id: 'tomato', name: 'Tomato', unit: 'kg', price: 40, yieldPct: 90 },
    { id: 'onion', name: 'Onion', unit: 'kg', price: 35, yieldPct: 85 },
  ],
  dishes: [
    { id: 'cap', name: 'Cappuccino', price: 180, sold: 900, lines: [
      { ing: 'milk', qty: 180 }, { ing: 'beans', qty: 18 }, { ing: 'sugar', qty: 8 },
    ] },
    { id: 'cold', name: 'Cold coffee', price: 220, sold: 400, lines: [
      { ing: 'milk', qty: 250 }, { ing: 'beans', qty: 18 }, { ing: 'sugar', qty: 20 }, { ing: 'cup', qty: 1 },
    ] },
    { id: 'pan', name: 'Paneer sandwich', price: 240, sold: 250, lines: [
      { ing: 'bread', qty: 2 }, { ing: 'paneer', qty: 80 }, { ing: 'butter', qty: 10 },
      { ing: 'tomato', qty: 30 }, { ing: 'onion', qty: 20 },
    ] },
    { id: 'toast', name: 'Cheese toast', price: 160, sold: 80, lines: [
      { ing: 'bread', qty: 2 }, { ing: 'cheese', qty: 40 }, { ing: 'butter', qty: 10 },
    ] },
  ],
}

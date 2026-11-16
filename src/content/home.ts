/**
 * Homepage copy and mock data.
 *
 * Every product claim here traces back to the long-form pages in src/content/*
 * (features.ts, segments.ts, integrations.ts), which are the vetted source. Mock data
 * (orders, tables, stock) is illustrative: the outlet is "Demo Café", never a real
 * business, and no number below is presented as a customer metric.
 */

export const HERO = {
  banner: { label: 'Omega for Android is in early access', href: '/app' },
  h1: 'The restaurant POS that never drops an order.',
  /** Visual headline: lead + rotating ending. `h1` above stays the accessible/SEO text. */
  h1Lead: 'The restaurant POS that',
  h1Mid: 'never drops',
  /** Kept short so the rotating part never wraps differently between words. */
  h1Words: ['an order.', 'a KOT.', 'a bill.', 'a table.'] as const,
  /** Facts carried over from the committed homepage copy. */
  meta: ['Same-day setup', 'No setup fee', 'Works offline'],
  sub: 'Omega bills, fires KOTs, syncs Swiggy and Zomato, and tracks stock, even when the internet doesn’t.',
  /** Sign-up happens in the POS app; under `next dev` this opens the local preview of the redesigned page (app/signup). */
  primary: { label: 'Start free trial', href: process.env.NODE_ENV === 'development' ? '/signup' : 'https://cafe.posomega.com/onboard' },
  secondary: { label: 'Talk to sales', href: '/get-started' },
}

export type Channel = 'swiggy' | 'zomato' | 'dine' | 'take' | 'qr'
export const CHANNEL_LABEL: Record<Channel, string> = {
  swiggy: 'Swiggy', zomato: 'Zomato', dine: 'Dine-in', take: 'Takeaway', qr: 'QR',
}
export const CHANNEL_MARK: Record<Channel, string> = {
  swiggy: 'S', zomato: 'Z', dine: 'D', take: 'T', qr: 'Q',
}

export type HeroOrder = {
  id: string
  ch: Channel
  where: string
  items: string
  amount: number
  status: 'New' | 'Cooking' | 'Ready' | 'Paid'
  age: string
}

/** Rows already in the app window before the hero choreography starts. */
export const HERO_ORDERS: HeroOrder[] = [
  { id: '#0418', ch: 'dine', where: 'Table 7', items: '2× Masala Chai, 1× Aloo Paratha', amount: 273, status: 'Cooking', age: '4m' },
  { id: '#0417', ch: 'zomato', where: 'ZO-55120', items: '1× Veg Biryani, 1× Raita', amount: 399, status: 'Cooking', age: '6m' },
  { id: '#0416', ch: 'take', where: 'Counter', items: '2× Cold Brew', amount: 378, status: 'Ready', age: '9m' },
  { id: '#0415', ch: 'qr', where: 'Table 3', items: '1× Avocado Toast, 1× Flat White', amount: 525, status: 'Ready', age: '12m' },
  { id: '#0414', ch: 'dine', where: 'Table 12', items: '3× Filter Coffee, 2× Banoffee Pie', amount: 756, status: 'Paid', age: '18m' },
  { id: '#0413', ch: 'swiggy', where: 'SW-48170', items: '1× Paneer Tikka Roll', amount: 231, status: 'Paid', age: '21m' },
]

/** The order that arrives in the floating "aggregator" window and docks into the table. */
export const HERO_INCOMING = {
  id: '#0419',
  ch: 'swiggy' as Channel,
  ref: 'SW-48212',
  items: [
    { n: 'Paneer Tikka Roll', q: 2, p: 220 },
    { n: 'Masala Fries', q: 1, p: 120 },
    { n: 'Cold Coffee', q: 1, p: 160 },
  ],
}

export type MenuItem = { id: number; name: string; price: number; cat: string; tone: string; img?: string }

const u = (id: string) => `https://images.unsplash.com/${id}?w=240&q=70&auto=format&fit=crop`
export const MENU: MenuItem[] = [
  { id: 1, name: 'Masala Chai', price: 60, cat: 'Drinks', tone: '#c9a46a', img: u('photo-1571934811356-5cc061b6821f') },
  { id: 2, name: 'Cold Brew', price: 180, cat: 'Drinks', tone: '#4a3324', img: u('photo-1461023058943-07fcbe16d735') },
  { id: 3, name: 'Filter Coffee', price: 80, cat: 'Drinks', tone: '#6b4226', img: u('photo-1509042239860-f550ce710b93') },
  { id: 4, name: 'Aloo Paratha', price: 140, cat: 'Kitchen', tone: '#d79b67', img: u('photo-1565557623262-b51c2513a641') },
  { id: 5, name: 'Paneer Tikka', price: 280, cat: 'Kitchen', tone: '#c4572f', img: u('photo-1567188040759-fb8a883dc6d8') },
  { id: 6, name: 'Banoffee Pie', price: 240, cat: 'Desserts', tone: '#d8b648', img: u('photo-1565958011703-44f9829ba187') },
]

export type FloorTable = { n: number; s: 'free' | 'seated' | 'reserved' | 'bill'; covers?: number; t?: string; amt?: number }
export const FLOOR: FloorTable[] = [
  { n: 1, s: 'free' }, { n: 2, s: 'seated', covers: 2, t: '0:24', amt: 640 }, { n: 3, s: 'bill', covers: 4, t: '1:12', amt: 2180 },
  { n: 4, s: 'reserved', covers: 2, t: '20:00' }, { n: 5, s: 'seated', covers: 6, t: '0:48', amt: 3420 }, { n: 6, s: 'free' },
  { n: 7, s: 'seated', covers: 3, t: '0:32', amt: 1150 }, { n: 8, s: 'free' }, { n: 9, s: 'reserved', covers: 4, t: '20:30' },
  { n: 10, s: 'seated', covers: 2, t: '1:05', amt: 920 }, { n: 11, s: 'free' }, { n: 12, s: 'bill', covers: 4, t: '1:48', amt: 2760 },
]

export type KdsTicket = { id: string; ch: Channel; where: string; items: string[]; station: 'Hot' | 'Cold' | 'Bar'; mins: number; flag?: string }
export const KDS: KdsTicket[] = [
  { id: '#0419', ch: 'swiggy', where: 'SW-48212', items: ['2× Paneer Tikka Roll', '1× Masala Fries'], station: 'Hot', mins: 1 },
  { id: '#0418', ch: 'dine', where: 'Table 7', items: ['1× Aloo Paratha'], station: 'Hot', mins: 4, flag: 'No onion' },
  { id: '#0417', ch: 'zomato', where: 'ZO-55120', items: ['1× Veg Biryani', '1× Raita'], station: 'Hot', mins: 6 },
  { id: '#0420', ch: 'qr', where: 'Table 3', items: ['2× Cold Coffee'], station: 'Bar', mins: 2 },
  { id: '#0421', ch: 'dine', where: 'Table 5', items: ['1× Greek Salad'], station: 'Cold', mins: 3, flag: 'Nut allergy' },
]

export type StockRow = { name: string; unit: string; onHand: number; need: number; daysLeft: number; note: string }
export const STOCK: StockRow[] = [
  { name: 'Paneer', unit: 'kg', onHand: 4.2, need: 6.5, daysLeft: 0.8, note: 'Busier Friday predicted' },
  { name: 'Cold brew concentrate', unit: 'L', onHand: 12, need: 14, daysLeft: 1.5, note: 'Weekend uplift' },
  { name: 'Sourdough loaf', unit: 'pc', onHand: 28, need: 30, daysLeft: 1.1, note: 'Brunch Sunday' },
  { name: 'Whole milk', unit: 'L', onHand: 42, need: 30, daysLeft: 3.2, note: 'Healthy' },
  { name: 'Tea leaves', unit: 'kg', onHand: 6.5, need: 2, daysLeft: 5.0, note: 'Healthy' },
]

export const RECIPE = {
  dish: 'Paneer Tikka',
  price: 280,
  lines: [
    { n: 'Paneer', q: '150 g', c: 54 },
    { n: 'Hung curd marinade', q: '40 g', c: 9 },
    { n: 'Capsicum & onion', q: '60 g', c: 6 },
    { n: 'Spice mix', q: '8 g', c: 4 },
    { n: 'Mint chutney', q: '30 g', c: 5 },
    { n: 'Packaging (takeaway)', q: '1 pc', c: 7 },
  ],
}

export type QueueItem = { id: string; ch: Channel; items: string; prep: string }
export const QUEUE: QueueItem[] = [
  { id: '#0422', ch: 'swiggy', items: '1× Cold Coffee, 1× Club Sandwich', prep: '12 min' },
  { id: '#0423', ch: 'dine', items: '2× Cold Coffee', prep: '6 min' },
  { id: '#0424', ch: 'zomato', items: '1× Veg Biryani', prep: '18 min' },
  { id: '#0425', ch: 'qr', items: '1× Masala Chai, 1× Cold Coffee', prep: '5 min' },
]

export const DAY_END = {
  date: 'Thu, 12 Nov',
  gross: 48620,
  discounts: 1240,
  discountNotes: [
    { who: 'Riya (manager)', why: 'Regular, 10%', amt: 640 },
    { who: 'Arjun (captain)', why: 'Late order comp', amt: 600 },
  ],
  pay: [
    { k: 'UPI', v: 26100 },
    { k: 'Card', v: 12880 },
    { k: 'Cash', v: 6460 },
    { k: 'Aggregator', v: 1940 },
  ],
}

/** Integrations named in src/content (integrations.ts, segments.ts, pricing). Nothing else. */
export const WORKS_WITH = [
  'Swiggy', 'Zomato', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Pine Labs', 'EazyDiner', 'Dineout',
]

export const INTEGRATION_GROUPS: { tag: string; blurb: string; href?: string; items: { n: string; d: string }[] }[] = [
  {
    tag: 'Delivery',
    blurb: 'Menu, stock and orders in both directions.',
    href: '/integrations/swiggy-zomato',
    items: [
      { n: 'Swiggy', d: 'Orders land in the kitchen queue; 86s push out.' },
      { n: 'Zomato', d: 'Same queue, same menu, same stock.' },
    ],
  },
  {
    tag: 'Payments',
    blurb: 'Collected against the order, reconciled at close.',
    href: '/integrations/upi-and-payments',
    items: [
      { n: 'UPI', d: 'Dynamic, order-linked collection.' },
      { n: 'Google Pay', d: 'Through the same flow as UPI.' },
      { n: 'PhonePe', d: 'Through the same flow as UPI.' },
      { n: 'Paytm', d: 'Through the same flow as UPI.' },
      { n: 'Pine Labs', d: 'Alongside the card terminal you run.' },
    ],
  },
  {
    tag: 'Reservations',
    blurb: 'One diary instead of three tabs.',
    href: '/for/fine-dining',
    items: [
      { n: 'EazyDiner', d: 'Bookings into the floor plan.' },
      { n: 'Dineout', d: 'Bookings into the floor plan.' },
    ],
  },
  {
    tag: 'Hardware',
    blurb: 'Keep the printer and drawer you already have.',
    href: '/pricing',
    items: [
      { n: 'Thermal printers', d: 'Bluetooth, USB or network.' },
      { n: 'Any tablet or PC', d: 'Android, iPad or Windows.' },
    ],
  },
]

export const FAQS = [
  { q: 'How long does setup actually take?', a: "Most cafés are taking orders the same day. Your menu, taxes, table layout and printer pair via one QR code, and there is no on-site engineer visit to schedule. If you're migrating from another POS, our team imports your menu, customers and inventory for free." },
  { q: 'What happens when the internet goes down?', a: 'Omega keeps running. Billing, KOTs and cash payments all work from the local device. Every order is queued on the terminal and reconciled automatically the moment connectivity returns, so nothing is lost and nobody has to fall back to a paper bill book. Card and UPI genuinely need a connection, so Omega shows them as unavailable rather than pretending.' },
  { q: 'Do I have to buy your hardware?', a: 'No. Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard thermal printers over Bluetooth, USB or network. Our hardware is optional, and most restaurants keep the printer and cash drawer they already have.' },
  { q: 'How does the Swiggy / Zomato integration work?', a: 'Two-way sync. Items, prices, stock and modifiers stay in step across every platform, and aggregator orders land in the same queue as your dine-in and takeaway tickets. Mark an item out of stock at the counter and Omega pushes that state out to each aggregator, so you stop taking orders you cannot fulfil.' },
  { q: "What's your pricing in plain English?", a: '₹1,499 per outlet per month for Starter, ₹3,499 for Growth, custom for Enterprise. No setup fees, no per-seat charges, no per-transaction fees. Pay annually and save 20%.' },
  { q: 'Is my data secure?', a: "Your data sits in Indian data centres and is encrypted at rest and in transit. Card payments are handled by PCI-DSS certified payment partners, so raw card data never touches Omega's systems. We don't train AI on your customer data. Our SOC 2 programme is in progress and we will publish the report when it is complete." },
  { q: 'Can I switch from Petpooja / Posist / another POS?', a: 'Yes. Migration is included in onboarding at no extra cost. We export your menu, modifiers, customers and inventory from your current POS and load them into Omega before you switch over, so you are not re-typing a menu on a Friday night.' },
]

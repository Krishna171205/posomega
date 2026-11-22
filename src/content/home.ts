/**
 * Homepage copy and mock data.
 *
 * Every product claim here traces back to the long-form pages in src/content/*
 * (features.ts, segments.ts, integrations.ts), which are the vetted source. Mock data
 * (orders, tables, stock) is illustrative: the outlet is "Brewbari Café" (Hauz Khas Village, New Delhi), made up, never a real
 * business, and no number below is presented as a customer metric.
 */

export const HERO = {
  banner: { label: 'PepperPe for Android is in early access', href: '/app' },
  h1: 'The restaurant POS that never drops an order.',
  /** Visual headline: lead + rotating ending. `h1` above stays the accessible/SEO text. */
  h1Lead: 'The restaurant POS that',
  h1Mid: 'never drops',
  /** Kept short so the rotating part never wraps differently between words. */
  h1Words: ['an order.', 'a KOT.', 'a bill.', 'a table.'] as const,
  /** Facts carried over from the committed homepage copy. */
  meta: ['Same-day setup', 'Menu set up for you', 'Offline on Android'],
  sub: 'PepperPe bills, fires KOTs, syncs Swiggy and Zomato, and tracks stock, even when the internet doesn’t.',
  /** Sign-up happens in the POS app; under `next dev` this opens the local preview of the redesigned page (app/signup). */
  primary: { label: 'Start free trial', href: process.env.NODE_ENV === 'development' ? '/signup' : 'https://billing.pepperpe.com/onboard' },
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
  { id: 7, name: 'Veg Biryani', price: 260, cat: 'Kitchen', tone: '#c98a3c', img: u('photo-1563379091339-03b21ab4a4f8') },
  { id: 8, name: 'Masala Dosa', price: 160, cat: 'Kitchen', tone: '#d9a45c', img: u('photo-1668236543090-82eba5ee5976') },
  { id: 9, name: 'Pav Bhaji', price: 180, cat: 'Kitchen', tone: '#b8572c', img: u('photo-1606491956689-2ea866880c84') },
  { id: 10, name: 'Samosa (2 pc)', price: 60, cat: 'Kitchen', tone: '#c08a43', img: u('photo-1601050690597-df0568f70950') },
  { id: 11, name: 'Idli Vada', price: 120, cat: 'Kitchen', tone: '#e6dccb', img: u('photo-1630383249896-424e482df921') },
  { id: 12, name: 'Cold Coffee', price: 160, cat: 'Drinks', tone: '#8a6a4f', img: u('photo-1517701604599-bb29b565090c') },
]

export type FloorTable = { n: number; s: 'free' | 'seated' | 'reserved' | 'bill'; covers?: number; t?: string; amt?: number; captain?: string; kots?: number }
/** Main floor is T1-T12, the terrace T13-T20 (sample data). */
export const FLOOR: FloorTable[] = [
  { n: 1, s: 'free' }, { n: 2, s: 'seated', covers: 2, t: '0:24', amt: 640, captain: 'Arjun', kots: 2 }, { n: 3, s: 'bill', covers: 4, t: '1:12', amt: 2180, captain: 'Riya', kots: 3 },
  { n: 4, s: 'reserved', covers: 2, t: '20:00' }, { n: 5, s: 'seated', covers: 6, t: '0:48', amt: 3420, captain: 'Arjun', kots: 4 }, { n: 6, s: 'free' },
  { n: 7, s: 'seated', covers: 3, t: '0:32', amt: 1150, captain: 'Meher', kots: 2 }, { n: 8, s: 'free' }, { n: 9, s: 'reserved', covers: 4, t: '20:30' },
  { n: 10, s: 'seated', covers: 2, t: '1:05', amt: 920, captain: 'Riya', kots: 2 }, { n: 11, s: 'free' }, { n: 12, s: 'bill', covers: 4, t: '1:48', amt: 2760, captain: 'Kabir', kots: 5 },
  { n: 13, s: 'seated', covers: 4, t: '0:15', amt: 1480, captain: 'Meher', kots: 1 }, { n: 14, s: 'free' }, { n: 15, s: 'reserved', covers: 2, t: '21:00' },
  { n: 16, s: 'seated', covers: 2, t: '0:41', amt: 760, captain: 'Kabir', kots: 2 }, { n: 17, s: 'free' }, { n: 18, s: 'bill', covers: 5, t: '1:20', amt: 3110, captain: 'Riya', kots: 4 },
  { n: 19, s: 'free' }, { n: 20, s: 'seated', covers: 3, t: '0:09', amt: 540, captain: 'Arjun', kots: 1 },
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
  { name: 'Paneer', unit: 'kg', onHand: 4.2, need: 6.5, daysLeft: 0.8, note: 'Below what tonight needs' },
  { name: 'Cold brew concentrate', unit: 'L', onHand: 12, need: 14, daysLeft: 1.5, note: 'Running low' },
  { name: 'Sourdough loaf', unit: 'pc', onHand: 28, need: 30, daysLeft: 1.1, note: 'Running low' },
  { name: 'Whole milk', unit: 'L', onHand: 42, need: 30, daysLeft: 3.2, note: 'Healthy' },
  { name: 'Tea leaves', unit: 'kg', onHand: 6.5, need: 2, daysLeft: 5.0, note: 'Healthy' },
  { name: 'Basmati rice', unit: 'kg', onHand: 36, need: 12, daysLeft: 4.4, note: 'Healthy' },
  { name: 'Coffee beans', unit: 'kg', onHand: 9.5, need: 4, daysLeft: 3.8, note: 'Healthy' },
  { name: 'Takeaway cups', unit: 'pc', onHand: 640, need: 240, daysLeft: 4.6, note: 'Healthy' },
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

export type QueueItem = { id: string; ch: Channel; items: string; prep: string; status: 'Preparing' | 'Ready' | 'Picked up' }
/** The online board behind the new order in the Platform section (sample data). */
export const QUEUE: QueueItem[] = [
  { id: '#0422', ch: 'swiggy', items: '1× Cold Coffee, 1× Club Sandwich', prep: '12 min', status: 'Preparing' },
  { id: '#0424', ch: 'zomato', items: '1× Veg Biryani, 1× Raita', prep: '18 min', status: 'Preparing' },
  { id: '#0425', ch: 'qr', items: '1× Masala Chai, 1× Cold Coffee', prep: '5 min', status: 'Ready' },
  { id: '#0417', ch: 'zomato', items: '2× Cold Brew', prep: '9 min', status: 'Ready' },
  { id: '#0413', ch: 'swiggy', items: '1× Paneer Tikka Roll', prep: '21 min', status: 'Picked up' },
  { id: '#0411', ch: 'zomato', items: '1× Chole Bhature, 1× Lassi', prep: '24 min', status: 'Picked up' },
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

/** Integrations named in src/content (integrations.ts, segments.ts). Nothing else. */
export const WORKS_WITH = [
  'Swiggy', 'Zomato', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Tally',
]

export const INTEGRATION_GROUPS: { tag: string; blurb: string; href?: string; items: { n: string; d: string }[] }[] = [
  {
    tag: 'Delivery',
    blurb: 'Orders in the same queue as dine-in.',
    href: '/integrations/swiggy-zomato',
    items: [
      { n: 'Swiggy', d: 'Accept with a prep time; the KOT goes to the kitchen.' },
      { n: 'Zomato', d: 'Same queue, same kitchen display.' },
    ],
  },
  {
    tag: 'Payments',
    blurb: 'Recorded against the order, matched at close.',
    href: '/integrations/upi-and-payments',
    items: [
      { n: 'UPI', d: 'Collected against the bill.' },
      { n: 'Google Pay', d: 'Any UPI app pays the bill.' },
      { n: 'PhonePe', d: 'Any UPI app pays the bill.' },
      { n: 'Paytm', d: 'Any UPI app pays the bill.' },
    ],
  },
  {
    tag: 'Accounts',
    blurb: 'Sales into the books without re-keying.',
    href: '/gst-billing-software-for-restaurants',
    items: [
      { n: 'Tally', d: 'Sales export that Tally imports.' },
    ],
  },
  {
    tag: 'Hardware',
    blurb: 'Keep the printer and drawer you already have.',
    href: '/get-started',
    items: [
      { n: 'Thermal printers', d: 'Bluetooth, USB or network.' },
      { n: 'Any tablet or PC', d: 'Web POS in the browser, Android app for offline.' },
    ],
  },
]

export const FAQS = [
  { q: 'How long does setup actually take?', a: "Most cafés are taking orders the same day. Menu, taxes, tables and printer are set up in one flow, with no on-site engineer visit to schedule. If you're moving from another POS, our team sets up your menu and modifiers as part of onboarding." },
  { q: 'What happens when the internet goes down?', a: 'On the PepperPe Android app, billing keeps going: orders are saved on the tablet and synced automatically when the line returns, without duplicates. The web POS and the kitchen display need a connection, and card and UPI payments always do. Cash keeps working.' },
  { q: 'Do I have to buy your hardware?', a: 'No. The web POS runs in a browser on an Android tablet, iPad or PC and prints to standard thermal printers. Our hardware is optional, and most restaurants keep the printer and cash drawer they already have.' },
  { q: 'How does the Swiggy / Zomato integration work?', a: 'Swiggy and Zomato orders arrive in the same queue as dine-in and takeaway. Accept with a prep time and the KOT goes to the right station. Menu, price and stock changes on the platforms are still made on their side today.' },
  { q: 'How much does PepperPe cost?', a: 'Pricing depends on how many outlets you run and what you need set up, so we quote after a short call rather than publish a rate card. Talk to sales or book a demo and we will walk you through it.' },
  { q: 'Is my data secure?', a: "Your data sits in Indian data centres and is encrypted at rest and in transit. Card payments are handled by PCI-DSS certified payment partners, so raw card data never touches PepperPe's systems. We don't train AI on your customer data. Our SOC 2 programme is in progress and we will publish the report when it is complete." },
  { q: 'Can I switch from Petpooja / Posist / another POS?', a: 'Yes. Our team sets up your menu and modifiers in PepperPe as part of onboarding at no extra cost, and you can run both systems side by side while you switch.' },
]

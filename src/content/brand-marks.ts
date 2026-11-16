/**
 * Logos for the "Works with" strip under the hero. Only integrations and platforms
 * that src/content documents (integrations.ts, segments.ts, landing-pages.ts), and
 * only official artwork, served from public/logos:
 *  - Swiggy, Zomato, Google Pay, PhonePe, Paytm, Android, Apple, Bluetooth: Simple
 *    Icons 14.0.0 (CC0), cropped to the mark, in the brand's own colour
 *  - UPI, OpenTable, Windows: Wikimedia Commons, public domain
 * Pine Labs, EazyDiner and Dineout are integrations too, but no official mark was
 * available to source, so they are left out rather than imitated. To add one, put its
 * official SVG in public/logos and add a row here.
 *
 * `aspect` is width / height of the artwork, used to give every logo the same visual
 * weight whether it is a square symbol or a long wordmark.
 */
export type Logo = { n: string; file: string; aspect: number; role: string }

export const LOGOS: Logo[] = [
  { n: 'Swiggy', file: '/logos/swiggy.svg', aspect: 0.675, role: 'Delivery orders' },
  { n: 'Zomato', file: '/logos/zomato.svg', aspect: 4.706, role: 'Delivery orders' },
  { n: 'UPI', file: '/logos/upi.svg', aspect: 2.830, role: 'Payments' },
  { n: 'Google Pay', file: '/logos/googlepay.svg', aspect: 2.518, role: 'UPI payments' },
  { n: 'PhonePe', file: '/logos/phonepe.svg', aspect: 1.000, role: 'UPI payments' },
  { n: 'Paytm', file: '/logos/paytm.svg', aspect: 3.130, role: 'UPI payments' },
  { n: 'OpenTable', file: '/logos/opentable.svg', aspect: 3.735, role: 'Reservations' },
  { n: 'Android', file: '/logos/android.svg', aspect: 1.716, role: 'Runs on Android tablets' },
  { n: 'iPad', file: '/logos/apple.svg', aspect: 0.815, role: 'Runs on iPad' },
  { n: 'Windows', file: '/logos/windows.svg', aspect: 1.000, role: 'Runs on Windows terminals' },
  { n: 'Bluetooth printers', file: '/logos/bluetooth.svg', aspect: 0.738, role: 'Thermal printers over Bluetooth' },
]

/**
 * Logos for the "Works with" strip under the hero: the platforms a restaurant's orders,
 * payments and books run through. Official artwork only, served from public/logos:
 *  - Swiggy, Zomato, Google Pay, PhonePe, Paytm: Simple Icons 14.0.0 (CC0), cropped to
 *    the mark, in the brand's own colour. UPI: Wikimedia Commons, public domain.
 *  - WhatsApp, Zoho Books, QuickBooks, Google Sheets, Excel, Gmail, Google Drive: the
 *    official marks used in gradientui's supplier bento (public/logos/integrations
 *    there), with their viewBox cropped to the artwork.
 *  - Tally, Razorpay: the official logo images from the same folder, cut out of their
 *    white backgrounds (Tally without its tagline).
 * The accounting, messaging and spreadsheet logos were added at the owner's request on
 * 2026-11-16 and are not yet described anywhere in src/content; keep this list to what
 * Omega really connects to.
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
  { n: 'Razorpay', file: '/logos/razorpay.png', aspect: 0.876, role: 'Payments' },
  { n: 'WhatsApp', file: '/logos/whatsapp.svg', aspect: 0.996, role: 'Messaging' },
  { n: 'Tally', file: '/logos/tally.png', aspect: 1.945, role: 'Accounting' },
  { n: 'Zoho Books', file: '/logos/zoho.svg', aspect: 2.899, role: 'Accounting' },
  { n: 'QuickBooks', file: '/logos/quickbooks.svg', aspect: 1.000, role: 'Accounting' },
  { n: 'Google Sheets', file: '/logos/google-sheets.svg', aspect: 0.727, role: 'Spreadsheets' },
  { n: 'Microsoft Excel', file: '/logos/microsoft-excel.svg', aspect: 0.972, role: 'Spreadsheets' },
  { n: 'Gmail', file: '/logos/gmail.svg', aspect: 1.333, role: 'Email' },
  { n: 'Google Drive', file: '/logos/google-drive.svg', aspect: 1.119, role: 'Cloud storage' },
]

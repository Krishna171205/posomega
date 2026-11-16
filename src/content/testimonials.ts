/**
 * Customer quotes for the homepage ticket rail (src/components/Testimonials.tsx).
 *
 * Only real words from real people, with their OK. Same rule as customers.ts and
 * SEO_PLAN.md §0: no invented quotes, no "representative" customers, no counts.
 * A quote goes live when it is in TESTIMONIALS with `consent: true`. Until there is
 * at least one, the section does not render on the live site.
 */
export type OutletFormat =
  | 'Café' | 'Bakery' | 'QSR' | 'Food court' | 'Fine dining' | 'Cloud kitchen' | 'Bar' | 'Chain'

export type Testimonial = {
  /** Their words, as they said or wrote them. Trim for length, never reword. */
  quote: string
  name: string
  /** e.g. 'Owner', 'Head chef', 'Operations lead' */
  role: string
  /** The business name, as they want it shown */
  outlet: string
  city: string
  format: OutletFormat
  /**
   * Where the quote came from. `permission`: an email or call in which they agreed
   * to be quoted, dated. `review`: a public review you can link to.
   */
  source:
    | { kind: 'permission'; date: string }
    | { kind: 'review'; site: 'Google' | 'Play Store' | 'G2' | 'Capterra'; url: string; stars?: 1 | 2 | 3 | 4 | 5 }
  /** Written OK to show their name, business and words on posomega.com. */
  consent: boolean
}

export const TESTIMONIALS: Testimonial[] = [
  // {
  //   quote: '…',
  //   name: '…', role: 'Owner', outlet: '…', city: 'Bengaluru', format: 'Café',
  //   source: { kind: 'permission', date: '2026-11-20' },
  //   consent: true,
  // },
]

export const CONSENTED_TESTIMONIALS = TESTIMONIALS.filter(t => t.consent)

/**
 * MOCK COPY, not from customers. Shown on the live site, labelled as samples, while TESTIMONIALS is empty.
 * Testimonials.tsx shows these only while
 * TESTIMONIALS is empty, stamped "Sample" and without a source line. The "Sample" names
 * are there so nobody mistakes them for real people.
 */
export const TESTIMONIAL_SAMPLES: Testimonial[] = [
  {
    quote: 'Our regulars get their stamp at the counter without an app. Closing the day is a check now, not a reconstruction.',
    name: 'Sample customer', role: 'Owner', outlet: 'Sample Café', city: 'Bengaluru', format: 'Café',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
  {
    quote: 'QR, counter and Swiggy orders land in one queue, so the kitchen stopped shouting across the line.',
    name: 'Sample customer', role: 'Operations lead', outlet: 'Sample QSR', city: 'Pune', format: 'QSR',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
  {
    quote: 'Allergy flags print on every KOT for the table. That alone changed how the pass talks to the floor.',
    name: 'Sample customer', role: 'General manager', outlet: 'Sample Restaurant', city: 'Mumbai', format: 'Fine dining',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
  {
    quote: 'Swiggy, Zomato and our own riders on one screen, and for the first time I can see what every dish costs.',
    name: 'Sample customer', role: 'Founder', outlet: 'Sample Kitchen', city: 'Hyderabad', format: 'Cloud kitchen',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
  {
    quote: 'Happy hour switches itself on and off now, and the bar and kitchen work from the same order.',
    name: 'Sample customer', role: 'Bar manager', outlet: 'Sample Bar', city: 'Goa', format: 'Bar',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
  {
    quote: 'The internet dropped on a Sunday morning and the Android till kept billing. Everything synced once it was back.',
    name: 'Sample customer', role: 'Owner', outlet: 'Sample Bakery', city: 'Delhi', format: 'Bakery',
    source: { kind: 'permission', date: '2026-11-01' }, consent: false,
  },
]

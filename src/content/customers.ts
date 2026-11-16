/**
 * Restaurants shown as Omega customers on the homepage.
 *
 * Rules (see SEO_PLAN.md §0 and commits #9 / #13):
 *  - Only outlets that actually run Omega today.
 *  - Only with written permission to use their name. `consent` must be true or the
 *    entry is ignored, so a draft can sit here without going live.
 *  - No counts, outlet numbers or quotes unless the customer supplied them.
 *
 * While no entry has consent, the homepage shows the integrations strip instead.
 */
export type Customer = {
  name: string
  /** Neighbourhood or city, shown under the name. */
  place?: string
  /** Format, e.g. "Café", "Cloud kitchen". */
  format?: string
  consent: boolean
}

export const CUSTOMERS: Customer[] = []

export const CONSENTED_CUSTOMERS = CUSTOMERS.filter(c => c.consent)

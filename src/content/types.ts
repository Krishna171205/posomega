export type MarketingSection =
  | { kind: 'prose'; heading: string; body: string[] }
  | { kind: 'cards'; heading: string; intro?: string; cards: { t: string; d: string }[] }
  | { kind: 'steps'; heading: string; intro?: string; steps: { t: string; d: string }[] }

export type MarketingPage = {
  /** Path without the leading slash, e.g. "for/cafes". Also the sitemap key. */
  slug: string
  /** Breadcrumb label for the parent segment, e.g. "Industries". Omitted for top-level pages. */
  parent?: { label: string; slug: string }
  /** Short crumb label for this page. */
  crumb: string
  eyebrow: string
  h1: string
  /** Rendered italic on a second line. Keep the primary keyword in h1, not here. */
  h1Tail?: string
  lede: string
  metaTitle: string
  metaDescription: string
  sections: MarketingSection[]
  faq: { q: string; a: string }[]
  /** Slugs of related pages, rendered as an internal-link block. */
  related: string[]
  /**
   * Overrides the default "Book a demo" button. Set it when the page's real next
   * step is somewhere else, e.g. the Play Store listing. `external` opens in a new
   * tab and is rendered as a plain <a> rather than a next/link.
   */
  primaryCta?: { href: string; label: string; external?: boolean }
  /** Set on /for/* pages: renders the animated outlet template. */
  outlet?: OutletExtras
}

/**
 * A looping product mock on an outlet page (/for/*). Every scene must show a
 * feature that ships in Omega today; the data is made up (Brewbari-style demo).
 */
export type Mock =
  | { kind: 'counter'; title: string; items: { n: string; p: number; mod?: string }[]; happy?: boolean }
  | { kind: 'kds'; title: string; tickets: { id: string; ch: 'swiggy' | 'zomato' | 'dine' | 'take' | 'qr'; l: string[]; f?: string }[] }
  | { kind: 'orders'; title: string }
  | { kind: 'offline' }
  | { kind: 'token'; title: string; start: number }
  | { kind: 'floor'; title: string }
  | { kind: 'qr'; outlet: string; items: { n: string; p: number }[] }
  | { kind: 'loyalty'; item: string; stamps: number }
  | { kind: 'stock'; sold: string; uses: { n: string; q: number; unit: string; left: number; par: number }[] }
  | { kind: 'preorder'; title: string; orders: { t: string; n: string; who: string }[] }
  | { kind: 'delivery'; order: string; area: string }
  | { kind: 'reserve'; title: string }
  | { kind: 'bars'; title: string; caption: string; rows: { l: string; v: number }[] }

/** An Unsplash photo (Unsplash licence: free for commercial use, no logos or faces as subject). */
export type Photo = { id: string; alt: string }

/** Sections of an outlet page below the hero, in the order a page lists them. */
export type OutletSection = 'pains' | 'tabs' | 'outcomes' | 'photos' | 'prose' | 'proof' | 'india' | 'faq' | 'switch'

export type OutletExtras = {
  /** Hero window, with a crew character peeking over it. */
  hero: Mock
  photos: { hero?: Photo; strip: Photo[] }
  /** Section order below the hero. Omitted: the default order in OutletPageView. */
  order?: OutletSection[]
  peek: { who: 'captain' | 'manager' | 'owner' | 'store' | 'chef' | 'server'; say: string }
  /** Short outlet name for the switcher, e.g. "Cafés". */
  short: string
  /** One-line pains shown as a strip under the hero. */
  pains: string[]
  /** Tabbed feature section, one live mock per tab. */
  tabs: { label: string; h: string; d: string; points: string[]; mock: Mock }[]
  outcomes: { t: string; d: string }[]
  /** Matches Customer.format, so consented customers of this format show as proof. */
  format: string
}

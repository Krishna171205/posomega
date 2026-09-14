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
}

import type { MarketingPage } from './types'
import { SEGMENTS } from './segments'
import { FEATURE_PAGES } from './features'
import { INTEGRATION_PAGES } from './integrations'
import { LANDING_PAGES } from './landing-pages'
import { TOOL_PAGES } from './tools'

/** Every page rendered from the shared marketing template. */
export const TEMPLATE_PAGES: MarketingPage[] = [
  ...LANDING_PAGES,
  ...SEGMENTS,
  ...FEATURE_PAGES,
  ...INTEGRATION_PAGES,
  ...TOOL_PAGES,
]

/**
 * Pages that exist but are not template-driven, so `related` links to them still
 * resolve to a label and a blurb.
 */
const HAND_BUILT: Record<string, { crumb: string; lede: string }> = {
}

export const TEMPLATE_PAGE_BY_SLUG = new Map(TEMPLATE_PAGES.map(p => [p.slug, p]))

export function pageLink(slug: string): { href: string; label: string; blurb: string } | null {
  const p = TEMPLATE_PAGE_BY_SLUG.get(slug)
  if (p) return { href: `/${p.slug}`, label: p.crumb, blurb: p.lede }
  const h = HAND_BUILT[slug]
  if (h) return { href: `/${slug}`, label: h.crumb, blurb: h.lede }
  return null
}

/** Hub pages that list their children. */
export const HUB_SLUGS = ['for', 'features', 'integrations', 'tools'] as const

/** Every indexable URL on the site, for sitemap.ts. */
export const INDEXABLE_SLUGS: string[] = [
  '',
  ...HUB_SLUGS,
  ...TEMPLATE_PAGES.map(p => p.slug),
]

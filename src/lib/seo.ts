import type { Metadata } from 'next'
import type { MarketingPage } from '@/content/types'

export const SITE = 'https://pepperpe.com'

export function pageMetadata(page: MarketingPage): Metadata {
  const path = `/${page.slug}`
  return {
    // absolute: metaTitle already carries the brand. Without this the root layout's
    // "%s | Omega POS" template appends it a second time and pushes every title past
    // the ~60 characters Google will actually render.
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE}${path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  }
}

/**
 * BreadcrumbList only. We deliberately do not emit FAQPage: Google restricted FAQ
 * rich results to government and health sites in 2023, so it buys no listing here,
 * and the answers are already plain SSR'd HTML that AI crawlers can extract.
 */
export function breadcrumbJsonLd(page: MarketingPage) {
  const items = [{ name: 'Home', item: `${SITE}/` }]
  if (page.parent) items.push({ name: page.parent.label, item: `${SITE}/${page.parent.slug}` })
  items.push({ name: page.crumb, item: `${SITE}/${page.slug}` })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  }
}

/** JSON.stringify never escapes "<", so a value containing "</script>" would close the tag early. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

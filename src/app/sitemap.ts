import type { MetadataRoute } from 'next'
import { INDEXABLE_SLUGS } from '@/content/registry'

const base = 'https://posomega.com'

// Marketing pages are prerendered at build time, so build time is their real
// last-modified date. Legal pages keep the date they were actually last revised.
// Bumping those on every deploy is a lastmod lie Google learns to ignore.
const buildTime = new Date()
const legalRevised = new Date('2026-06-21')

const LEGAL = ['privacy', 'terms', 'cookies', 'dpdp']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...INDEXABLE_SLUGS.map(slug => ({
      url: `${base}/${slug}`,
      lastModified: buildTime,
      changeFrequency: 'weekly' as const,
      priority: slug === '' ? 1.0 : slug.includes('/') ? 0.7 : 0.8,
    })),
    ...LEGAL.map(slug => ({
      url: `${base}/${slug}`,
      lastModified: legalRevised,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}

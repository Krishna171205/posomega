import type { MetadataRoute } from 'next'

const base = 'https://posomega.com'

// The marketing page is prerendered at build time, so build time is its real
// last-modified date. Legal pages keep the date they were actually last revised —
// bumping those on every deploy is a lastmod lie Google learns to ignore.
const buildTime = new Date()
const legalRevised = new Date('2026-06-21')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, lastModified: buildTime, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/privacy`, lastModified: legalRevised, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: legalRevised, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookies`, lastModified: legalRevised, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/dpdp`, lastModified: legalRevised, changeFrequency: 'yearly', priority: 0.3 },
  ]
}

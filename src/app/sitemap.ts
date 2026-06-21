import type { MetadataRoute } from 'next'

const base = 'https://posomega.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-06-21')
  return [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookies`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/dpdp`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]
}

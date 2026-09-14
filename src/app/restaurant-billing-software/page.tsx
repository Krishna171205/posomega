import type { Metadata } from 'next'
import { MarketingPageView } from '@/components/marketing/MarketingPageView'
import { LANDING_PAGES } from '@/content/landing-pages'
import { pageMetadata } from '@/lib/seo'

const page = LANDING_PAGES.find(p => p.slug === 'restaurant-billing-software')!

export const metadata: Metadata = pageMetadata(page)

export default function Page() {
  return <MarketingPageView page={page} />
}

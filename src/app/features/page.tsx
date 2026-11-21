import type { Metadata } from 'next'
import { HubPageView } from '@/components/marketing/MarketingPageView'
import { FEATURE_PAGES } from '@/content/features'

export const metadata: Metadata = {
  title: { absolute: 'PepperPe Features | Billing, KOT, KDS, Inventory' },
  description: 'What PepperPe actually does: GST-compliant billing and KOT routing, a kitchen display that sequences by departure time, recipe-level inventory with demand prediction, and an offline-first architecture.',
  alternates: { canonical: '/features' },
}

export default function Page() {
  return (
    <HubPageView
      crumb="Features"
      eyebrow="Features"
      h1="One system,"
      h1Tail="not four that sync."
      lede="The order, the kitchen ticket, the stock deduction and the payment are the same record. That is less a feature list than the reason the numbers agree at the end of the day."
      childSlugs={FEATURE_PAGES.map(p => p.slug)}
    />
  )
}

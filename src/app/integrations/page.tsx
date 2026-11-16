import type { Metadata } from 'next'
import { HubPageView } from '@/components/marketing/MarketingPageView'
import { INTEGRATION_PAGES } from '@/content/integrations'

export const metadata: Metadata = {
  title: { absolute: 'Omega POS Integrations | Swiggy, Zomato, UPI' },
  description: 'Omega connects to what Indian restaurants already run: Swiggy and Zomato orders in the same queue as dine-in, UPI collected against the bill, and a Tally export for your accountant.',
  alternates: { canonical: '/integrations' },
}

export default function Page() {
  return (
    <HubPageView
      crumb="Integrations"
      eyebrow="Integrations"
      h1="Plays well with"
      h1Tail="what you already pay for."
      lede="Aggregators and payment providers are not things to replace, they are things to stop maintaining by hand. Omega connects to them so the menu and the money stay one record."
      childSlugs={INTEGRATION_PAGES.map(p => p.slug)}
    />
  )
}

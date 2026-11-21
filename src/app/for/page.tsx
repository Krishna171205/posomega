import type { Metadata } from 'next'
import { HubPageView } from '@/components/marketing/MarketingPageView'
import { SEGMENTS } from '@/content/segments'

export const metadata: Metadata = {
  title: { absolute: 'Restaurant POS by Industry | PepperPe' },
  description: 'PepperPe for the format you run: cafés, QSR, fine dining, cloud kitchens, bars and breweries, food courts and canteens, bakeries and dessert shops, pizzerias and multi-outlet chains.',
  alternates: { canonical: '/for' },
}

export default function Page() {
  return (
    <HubPageView
      crumb="Industries"
      eyebrow="Industries"
      h1="Built for the format"
      h1Tail="you actually run."
      lede="A café is not a small restaurant and a cloud kitchen is not a restaurant without seats. PepperPe surfaces differently for each, because the constraints are genuinely different."
      childSlugs={SEGMENTS.map(p => p.slug)}
    />
  )
}

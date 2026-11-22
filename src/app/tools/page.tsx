import type { Metadata } from 'next'
import { HubPageView } from '@/components/marketing/MarketingPageView'
import { TOOL_PAGES } from '@/content/tools'

export const metadata: Metadata = {
  title: { absolute: 'Free Restaurant Calculators | PepperPe' },
  description: 'Free calculators for Indian restaurants and cafés: GST on a bill, food cost percentage and menu pricing from plate cost.',
  alternates: { canonical: '/tools' },
}

export default function Page() {
  return (
    <HubPageView
      crumb="Free tools"
      eyebrow="Free tools"
      h1="Free restaurant calculators"
      h1Tail="no sign-up, no email."
      lede="The sums every outlet does on the back of a bill book: GST on a bill, what each dish really costs, and what to charge for it."
      childSlugs={TOOL_PAGES.map(p => p.slug)}
    />
  )
}

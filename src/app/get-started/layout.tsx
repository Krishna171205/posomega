import type { Metadata } from 'next'

// Lead-capture form, no indexable content. It previously inherited the homepage
// title and a canonical pointing at "/", which made it a duplicate of the homepage.
export const metadata: Metadata = {
  title: 'Get started',
  description: 'Tell us about your cafe and we will set up your PepperPe trial.',
  alternates: { canonical: '/get-started' },
  robots: { index: false, follow: true },
}

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children
}

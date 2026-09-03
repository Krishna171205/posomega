import { LegalPage } from '@/components/LegalPage'

export const metadata = {
  title: 'Cookie Policy',
  description: 'The cookies and similar technologies Omega uses, and how to control them.',
  alternates: { canonical: '/cookies' },
}

export default function Page() {
  return (
    <LegalPage
      title="Cookie"
      italicTail="policy."
      updated="24 May 2026"
      intro="Cookies are tiny files that remember things across page loads — like keeping you signed in or remembering your dark-mode preference. Here is exactly what we use and why."
      sections={[
        {
          heading: '1. Essential cookies',
          body: 'These keep Omega working — your sign-in session, your CSRF token, and a load-balancing cookie that routes you to the nearest edge. You cannot disable these without breaking the product.',
        },
        {
          heading: '2. Preference cookies',
          body: 'These remember UI choices: language, dark mode, last-used outlet, and the most-recent dashboard filters. You can clear them via your browser settings at any time.',
        },
        {
          heading: '3. Analytics',
          body: 'We use first-party analytics — a single Omega-owned cookie that records anonymous, aggregated page views, click paths, and load times. We do not use Google Analytics, Hotjar, or any third-party analytics on the Omega application. The marketing site (posomega.com) uses Vercel\'s first-party analytics for traffic measurement.',
        },
        {
          heading: '4. Marketing & advertising cookies',
          body: 'We do not set marketing or advertising cookies. We do not embed Facebook Pixel, Google Ads, LinkedIn Insight Tag, or similar trackers on the Omega application.',
        },
        {
          heading: '5. Third-party cookies',
          body: 'Embedded payment widgets (Razorpay, Cashfree) set their own cookies when you process a transaction — these are essential for payment processing and are governed by those partners\' policies.',
        },
        {
          heading: '6. Managing cookies',
          body: [
            'You can clear or block cookies from your browser settings — most browsers also let you whitelist specific sites.',
            'Blocking essential cookies will break sign-in. Blocking preference cookies will reset your UI choices on every visit. Blocking analytics will have no effect on the product but will remove our ability to spot issues from aggregate data.',
          ],
        },
        {
          heading: '7. Changes',
          body: 'We will update this page whenever the set of cookies we use changes materially. The "Last updated" date reflects the current state.',
        },
      ]}
    />
  )
}

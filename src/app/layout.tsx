import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://posomega.com'),
  title: {
    default: 'Omega POS | Restaurant Billing & POS Software in India',
    template: '%s | Omega POS',
  },
  description:
    'Omega is a modern point-of-sale platform built for restaurants, cafes, bars, and cloud kitchens. Take orders, manage tables, run the kitchen, and bill faster.',
  keywords: [
    'restaurant POS',
    'cafe point of sale',
    'cloud kitchen POS',
    'bar billing software',
    'KDS kitchen display',
    'India restaurant software',
    'Omega POS',
  ],
  authors: [{ name: 'Omega POS' }],
  applicationName: 'Omega POS',
  alternates: { canonical: '/' },
  // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION in the Vercel project
  // and redeploy. Verifying Search Console and Bing Webmaster needs the Google and
  // Microsoft accounts, but it should not also need a code change to land the token.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : {},
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Omega POS',
    title: 'Omega POS | Restaurant Billing & POS Software in India',
    description:
      'A modern point-of-sale platform for restaurants, cafes, bars, and cloud kitchens. Take orders, manage tables, run the kitchen, and bill faster.',
    url: 'https://posomega.com',
    locale: 'en_IN',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Omega POS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omega POS | Restaurant Billing & POS Software in India',
    description:
      'A modern point-of-sale platform for restaurants, cafes, bars, and cloud kitchens.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://posomega.com/#software',
      name: 'Omega POS',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Android',
      url: 'https://posomega.com/',
      description:
        'A modern point-of-sale platform built for restaurants, cafes, bars, and cloud kitchens.',
      offers: {
        '@type': 'Offer',
        price: '1499',
        priceCurrency: 'INR',
        // Matches the Starter tier in src/components/Pricing.tsx.
        description: 'Starter plan, per outlet per month. Unlimited seats.',
        url: 'https://posomega.com/#pricing',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://posomega.com/#organization',
      name: 'Omega POS',
      legalName: 'Unified Nexgrade Pvt. Ltd.',
      alternateName: ['Omega', 'posomega', 'Omega Point of Sale'],
      disambiguatingDescription:
        'Restaurant point-of-sale software company based in India. Not affiliated with Omega SA (watches) or Omega Engineering.',
      url: 'https://posomega.com/',
      logo: 'https://posomega.com/og-image.png',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      parentOrganization: { '@id': 'https://www.unifiednexgrade.com/#organization' },
      sameAs: [
        'https://www.unifiednexgrade.com',
        'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      ],
    },
    {
      '@type': 'MobileApplication',
      '@id': 'https://posomega.com/#android-app',
      name: 'Omega POS - Cafe Billing & KOT',
      operatingSystem: 'Android',
      applicationCategory: 'BusinessApplication',
      url: 'https://posomega.com/app',
      installUrl: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      publisher: { '@id': 'https://posomega.com/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://posomega.com/#website',
      url: 'https://posomega.com/',
      name: 'Omega POS',
      publisher: { '@id': 'https://posomega.com/#organization' },
      inLanguage: 'en-IN',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          // JSON.stringify never escapes "<", so a value containing "</script>" would
          // close this tag early and inject arbitrary markup. jsonLd is hardcoded today,
          // but this closes the footgun before it's ever fed dynamic data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div id="root">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

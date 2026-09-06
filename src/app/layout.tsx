import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://posomega.com'),
  title: {
    default: 'Omega | The point of sale, perfected for restaurants',
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Omega POS',
    title: 'Omega | The point of sale, perfected for restaurants',
    description:
      'A modern point-of-sale platform for restaurants, cafes, bars, and cloud kitchens. Take orders, manage tables, run the kitchen, and bill faster.',
    url: 'https://posomega.com',
    locale: 'en_IN',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Omega POS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omega | The point of sale, perfected for restaurants',
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
      offers: { '@type': 'Offer', priceCurrency: 'INR' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://posomega.com/#organization',
      name: 'Omega POS',
      url: 'https://posomega.com/',
      logo: 'https://posomega.com/og-image.png',
      sameAs: ['https://www.unifiednexgrade.com'],
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
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          // JSON.stringify never escapes "<", so a value containing "</script>" would
          // close this tag early and inject arbitrary markup. jsonLd is hardcoded today,
          // but this closes the footgun before it's ever fed dynamic data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div id="root">{children}</div>
      </body>
    </html>
  )
}

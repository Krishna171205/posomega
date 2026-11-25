import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ScrollRail } from '@/components/ScrollRail'
/*
 * Design system: attio.com tokens and type, restaurant-POS content. Order matters:
 * tokens first, accents last. Each sheet is imported here rather than through
 * CSS @import, because the dev server only notices edits to stylesheets that are
 * imported from JavaScript.
 */
import '../styles/fonts.css'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/primitives.css'
import '../styles/sections/nav.css'
import '../styles/sections/hero.css'
import '../styles/sections/platform.css'
import '../styles/sections/features.css'
import '../styles/sections/outlets.css'
import '../styles/sections/testimonials.css'
import '../styles/sections/characters.css'
import '../styles/sections/closing.css'
import '../styles/sections/templates.css'
import '../styles/sections/outlet.css'
import '../styles/sections/qrmenu.css'
import '../styles/sections/nfc.css'
import '../styles/accent.css'
import '../styles/mobile.css'

/* The page fills the whole screen, round the notch too (mobile.css keeps content clear of
   it); pinch-zoom stays on. The browser's own bars take the page's white. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://pepperpe.com'),
  title: {
    default: 'PepperPe | Restaurant Billing & POS Software in India',
    template: '%s | PepperPe',
  },
  description:
    'PepperPe is a modern point-of-sale platform built for restaurants, cafes, bars, and cloud kitchens. Take orders, manage tables, run the kitchen, and bill faster.',
  keywords: [
    'restaurant POS',
    'cafe point of sale',
    'cloud kitchen POS',
    'bar billing software',
    'KDS kitchen display',
    'India restaurant software',
    'PepperPe',
  ],
  authors: [{ name: 'PepperPe' }],
  applicationName: 'PepperPe',
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
    siteName: 'PepperPe',
    title: 'PepperPe | Restaurant Billing & POS Software in India',
    description:
      'A modern point-of-sale platform for restaurants, cafes, bars, and cloud kitchens. Take orders, manage tables, run the kitchen, and bill faster.',
    url: 'https://pepperpe.com',
    locale: 'en_IN',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PepperPe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PepperPe | Restaurant Billing & POS Software in India',
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
      '@id': 'https://pepperpe.com/#software',
      name: 'PepperPe',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Android',
      url: 'https://pepperpe.com/',
      description:
        'A modern point-of-sale platform built for restaurants, cafes, bars, and cloud kitchens.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://pepperpe.com/#organization',
      name: 'PepperPe',
      legalName: 'Unified Nexgrade Pvt. Ltd.',
      alternateName: ['PepperPe', 'PepperPe Point of Sale', 'Omega POS', 'posomega'],
      disambiguatingDescription:
        'Restaurant point-of-sale software company based in India. Not affiliated with Omega SA (watches) or Omega Engineering.',
      url: 'https://pepperpe.com/',
      logo: 'https://pepperpe.com/og-image.png',
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      parentOrganization: { '@id': 'https://www.unifiednexgrade.com/#organization' },
      sameAs: [
        'https://www.unifiednexgrade.com',
        'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      ],
    },
    {
      '@type': 'MobileApplication',
      '@id': 'https://pepperpe.com/#android-app',
      name: 'PepperPe - Cafe Billing & KOT',
      operatingSystem: 'Android',
      applicationCategory: 'BusinessApplication',
      url: 'https://pepperpe.com/app',
      installUrl: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      publisher: { '@id': 'https://pepperpe.com/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://pepperpe.com/#website',
      url: 'https://pepperpe.com/',
      name: 'PepperPe',
      publisher: { '@id': 'https://pepperpe.com/#organization' },
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
      <head>
        {/* The two faces the hero paints with; everything else loads on demand. */}
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <script
          type="application/ld+json"
          // JSON.stringify never escapes "<", so a value containing "</script>" would
          // close this tag early and inject arbitrary markup. jsonLd is hardcoded today,
          // but this closes the footgun before it's ever fed dynamic data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <div id="root">{children}</div>
        <ScrollRail />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

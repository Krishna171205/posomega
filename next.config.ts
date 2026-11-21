import type { NextConfig } from 'next'

// ponytail: CSP allows 'unsafe-inline' for scripts/styles - no middleware.ts nonce
// wiring exists here, and Tailwind's inline styles plus the inline JSON-LD script
// need it. Fonts are self-hosted local .woff2 files (src/app/landing-fonts.css),
// no external CDN, no analytics, no Sentry. img-src needs the broad https: though -
// verified by actually loading the page: it pulls stock photos from Unsplash, brand
// logos from Clearbit, and icons from Simple Icons, all hardcoded into page content
// (not caught by grepping package.json deps).
// In production, @vercel/analytics and @vercel/speed-insights load from
// /_vercel/*/script.js on our own origin, so 'self' covers them. In development
// they load the .debug.js builds from va.vercel-scripts.com, which the production
// CSP correctly blocks. Allow that host in dev only so local runs are not full of
// CSP errors, without loosening what actually ships.
// Dev also needs 'unsafe-eval': React Refresh evaluates modules as strings, and without
// it no client JS runs locally at all. Never in production.
const devScriptHosts = process.env.NODE_ENV === 'development' ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devScriptHosts}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https:",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.pepperpe.com'}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: csp },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // One canonical host. www and the old brand domains (posomega.com, the 2026-11 rename)
    // and pepperpe.in all 308 to https://pepperpe.com, path kept, so old links, KYC links
    // in sent emails and search rankings carry over. 308 preserves the method and is a
    // permanent redirect for search engines.
    return ['www.pepperpe.com', 'pepperpe.in', 'www.pepperpe.in', 'posomega.com', 'www.posomega.com'].map(
      (host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: 'https://pepperpe.com/:path*',
        permanent: true,
      }),
    )
  },
}

export default nextConfig

import type { NextConfig } from 'next'

// ponytail: CSP allows 'unsafe-inline' for scripts/styles - no middleware.ts nonce
// wiring exists here, and Tailwind's inline styles plus the inline JSON-LD script
// need it. Fonts are self-hosted local .woff2 files (src/app/landing-fonts.css),
// no external CDN, no analytics, no Sentry. img-src needs the broad https: though -
// verified by actually loading the page: it pulls stock photos from Unsplash, brand
// logos from Clearbit, and icons from Simple Icons, all hardcoded into page content
// (not caught by grepping package.json deps).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https:",
  "connect-src 'self'",
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
}

export default nextConfig

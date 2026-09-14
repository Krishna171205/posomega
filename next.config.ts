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
const devScriptHosts = process.env.NODE_ENV === 'development' ? ' https://va.vercel-scripts.com' : ''

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devScriptHosts}`,
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
  async redirects() {
    return [
      {
        // www.posomega.com served a 200 duplicate of the apex. The canonical tag
        // pointed search engines at the apex, but a duplicate that resolves is
        // still a duplicate: it can be linked, shared and indexed on its own.
        // 308 preserves the method and is treated as a permanent redirect.
        source: '/:path*',
        has: [{ type: 'host', value: 'www.posomega.com' }],
        destination: 'https://posomega.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

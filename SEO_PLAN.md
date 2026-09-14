# posomega.com SEO Plan

Audited 2026-09-14. Target market: India. Product: Omega POS (restaurant point of sale).

---

## 0. P0 BLOCKER — fix before any SEO work

The site currently makes claims that are not true. SEO amplifies whatever is on the page,
so this has to be fixed first or the outcome of a successful campaign is wide distribution
of false statements about named third parties.

| Claim | Where | Reality |
|---|---|---|
| Blue Tokai, Third Wave, Sly Granny, Big Chill, Indigo Deli, Kunafa World shown as customers | `src/components/LogoCloud.tsx` | Not customers. Real, trademarked Indian brands. |
| Named testimonials: "Anika Roy, Co-founder, Blue Tokai"; "Karthik Iyer, Operations Head, Sly Granny" | `src/components/Testimonials.tsx` | Fabricated people attributed to real companies. |
| "PCI-DSS, SOC 2 Type II, ISO 27001" | `src/components/FAQ.tsx:13` | SOC 2 program began 2026-07-29, P0 items still open. Not certified. |
| "4,200+ outlets", "₹840 Cr/month processed", "99.99% uptime" | `src/components/Stats.tsx` | Live outlet count is in single digits. |

Action: replace with real numbers, or delete the sections. A "Design partner programme —
now onboarding" block beats fake social proof and is honest.

---

## 1. Why the site does not rank (diagnosis)

Measured, not guessed:

1. **Domain is 3.7 months old.** `posomega.com` created 2026-05-24 (whois). No authority yet.
2. **One indexable content URL.** Sitemap has 5 entries; 4 are legal pages. Google ranks URLs,
   not sites. One URL can rank for roughly one query cluster.
3. **Effectively not indexed.** `site:posomega.com` returns nothing on Bing. A brand query
   (`"posomega" OR "Omega POS" restaurant billing`) returns zero results on DuckDuckGo/Bing.
4. **No Google Search Console.** No DNS TXT record, no verification meta tag. Sitemap was never
   submitted, and there is zero query/impression data to work from.
5. **No analytics.** No GA4, no GTM, no Vercel Analytics package. Nothing is being measured.
   Note: `next.config.ts` CSP is `script-src 'self' 'unsafe-inline'` + `connect-src 'self'`,
   which will silently block GA4/GTM/Clarity until widened.
6. **Wrong target query.** "point of sale for restaurant" is a US-intent head term. That SERP is
   owned by Toast, Square, Lightspeed, SpotOn — DR 80+, thousands of pages, years of links.
   Not winnable from zero inside 18 months, and the traffic would not convert (wrong country).
7. **Brand entity collision.** "Omega" resolves to Omega SA (watches), Omega-3, Omega Engineering.
   The `<title>` default drops "POS" entirely: "Omega | The point of sale, perfected for restaurants".
8. **36 of 48 images ship `alt=""`** — including the Swiggy/Zomato/Razorpay/Tally integration logos,
   which are exactly the entities worth being associated with.

---

## 2. What actually wins this SERP (evidence)

Live SERP for "restaurant pos software india" is not owned by Toast/Square. It is owned by small
Indian sites. Their sitemaps show why:

| Site | URLs in sitemap |
|---|---|
| dineopen.com | **352** |
| rasoeecloud.com | 131 |
| qrcrave.com | 29 |
| **posomega.com** | **5 (1 real)** |

dineopen.com URL architecture — this is the template:

```
/blog/*                    163 pages
/tools/*                    57 pages   free calculators, link magnets
/hi/*                       32 pages   Hindi
/products/*                 14
/pos/<city|country>         14         /pos/mumbai /pos/delhi /pos/bangalore ...
/alternatives/<competitor>  11         /alternatives/petpooja /alternatives/posist ...
/vs/<a>-vs-<b>               9         /vs/dineopen-vs-petpooja ...
/for/<segment>               8         /for/cafes /for/cloud-kitchens /for/qsr ...
```

Their `/tools/` set: gst-calculator, food-cost-calculator, labor-cost-calculator,
menu-price-calculator, break-even-calculator, fssai-fee-calculator, kitchen-conversion-calculator,
menu-card-maker, opening-checklist, closing-checklist...

Those tools are how a new domain earns links without a PR budget.

---

## 3. Target the right queries

Drop "point of sale for restaurant". Target the commercial-intent India cluster:

**Tier 1 — money pages (build first)**
- restaurant billing software
- restaurant pos software india
- gst billing software for restaurant
- petpooja alternative / posist alternative / restroworks alternative
- cafe billing software
- cloud kitchen pos software
- restaurant pos with swiggy zomato integration
- offline restaurant billing software

**Tier 2 — segment + city**
- pos for cafes / bakeries / bars / QSR / food trucks / ice cream parlours
- restaurant pos software in delhi / mumbai / bangalore / hyderabad / pune / chennai

**Tier 3 — top of funnel (blog, earns links, feeds AI citation)**
- how much does restaurant pos cost in india
- kot meaning in restaurant
- fssai licence fee calculator
- food cost percentage formula
- how to reduce food wastage in restaurant

---

## 4. Execution plan

### Phase 0 — measurement + technical (1 day, do this week)

| # | Task | File / place |
|---|---|---|
| 1 | Fix the P0 false-claims section above | `LogoCloud.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `Stats.tsx` |
| 2 | Verify Google Search Console (DNS TXT at Hostinger), submit sitemap | DNS + GSC |
| 3 | Verify Bing Webmaster Tools, enable IndexNow | Bing + Vercel |
| 4 | Add GA4 (or Vercel Analytics) **and widen CSP** to allow it | `next.config.ts`, `layout.tsx` |
| 5 | 301 `www.posomega.com` → apex (currently serves a 200 duplicate) | Vercel domain settings |
| 6 | `noindex` `/get-started` (currently `index,follow` with the homepage's title + canonical `/`) | `src/app/get-started/page.tsx` |
| 7 | Title default → `Omega POS \| Restaurant Billing & POS Software in India` | `src/app/layout.tsx` |
| 8 | Organization schema: `legalName`, `alternateName`, `disambiguatingDescription`, `addressCountry: IN`, real `sameAs` | `src/app/layout.tsx` |
| 9 | `SoftwareApplication.offers.price` (currently only `priceCurrency`, which is invalid) | `src/app/layout.tsx` |
| 10 | Real `alt` text on all 48 images, especially integration logos | `Integrations.tsx`, `LogoCloud.tsx` |
| 11 | `sitemap.ts` — derive `lastModified` instead of hardcoding `2026-06-21` | `src/app/sitemap.ts` |

### Phase 1 — page architecture (2-3 weeks)

Split the single page into real, individually-targeted URLs. ~25 pages:

```
/pricing
/features/billing-kot
/features/kds
/features/inventory
/features/offline-mode
/integrations/swiggy-zomato
/integrations/upi-payments
/for/cafes
/for/cloud-kitchens
/for/bars
/for/qsr
/for/bakeries
/alternatives/petpooja
/alternatives/posist-restroworks
/alternatives/gofrugal
/alternatives/square
/vs/omega-vs-petpooja
/restaurant-billing-software
/gst-billing-software-restaurant
/pos/delhi  /pos/mumbai  /pos/bangalore  /pos/hyderabad  /pos/pune
/blog
```

Rules (these are the difference between ranking and a thin-content penalty):
- One `<h1>`, one primary query per URL.
- 900+ words minimum, 60%+ unique between city pages. If you cannot write 900 unique words
  for a city, do not ship that city page.
- Question-form `<h2>`s with a direct ~150-word answer immediately under each. That format is
  what gets extracted into AI Overviews and ChatGPT answers.
- `BreadcrumbList` schema on every non-home page.
- Every comparison page must be factually fair. Naming a competitor and lying about them is the
  same problem as section 0.

### Phase 2 — content + links (ongoing)

- **Free tools** (highest ROI for a new domain): GST calculator, food cost % calculator,
  labour cost calculator, FSSAI fee calculator, menu price calculator, KOT template.
  Each is a standalone URL and a natural link target.
- **Blog**: 2 posts/week on Tier 3 queries.
- **Listings** (this is what AI engines corroborate against, and it is faster than link building):
  G2, Capterra, GetApp, SoftwareSuggest, Techjockey, Crunchbase, LinkedIn company page, YouTube.
  Then put all of them in the `sameAs` array.
- **Google Business Profile** for the Delhi NCR office — unlocks map pack for "restaurant pos near me".
- **Hindi** (`/hi/*`) once English pages are ranking. Competitor has 32 such pages.

---

## 5. Honest timeline

New domain, zero links, one page today.

| Month | Expectation |
|---|---|
| 0-1 | Indexed. First brand-query impressions in GSC. |
| 2-3 | Long-tail rankings (page 2-5) on `/alternatives/*` and `/for/*`. |
| 4-6 | Page 1 for low-competition long-tail. First non-brand organic demo requests. |
| 9-12 | Competitive for "restaurant billing software" / "restaurant pos software india". |
| — | "point of sale for restaurant" (US head term): not a goal. |

Paid search on the Tier 1 terms is the correct bridge for months 0-6. SEO is not a Q4 lever.

---

## 6. Skills to use for each phase

| Phase | Skill |
|---|---|
| Full re-audit | `/seo audit https://posomega.com` |
| Technical fixes | `seo-technical`, `seo-schema` |
| Page architecture | `seo-plan`, `seo-programmatic` (city pages — mind the 30/50-page quality gates) |
| Comparison pages | `seo-competitor-pages` |
| AI/LLM citation | `seo-geo` |
| City pages + GBP | `seo-local` |
| Content QA before publish | `seo-content` (E-E-A-T, thin-content check) |
| Speed | `seo-performance`, `chrome-devtools-mcp:debug-optimize-lcp` |
| Hindi rollout | `seo-hreflang` |
| Building the new pages | `frontend-design`, `vercel:nextjs` |
| Keyword/SERP data | Semrush MCP (currently out of API units) |

---

## 7. Core Web Vitals (lab, Lighthouse 12.8.2)

No CrUX field data available (PSI keyless quota is now 0; needs an API key). Zero third-party
scripts on the page confirms there is no RUM/analytics either.

| Metric | Mobile | Desktop |
|---|---|---|
| Perf score | 86 | 100 |
| LCP | **3.5 s** | 0.5 s |
| CLS | 0 (lab) | 0.017 |
| TBT | 0 ms | 0 ms |
| TTFB (real, from Mumbai) | 170-200 ms | same |
| Page weight | 433 KiB | 649 KiB |

**Speed is not why the site doesn't rank.** TTFB is fine (Vercel `bom1` edge, cache HIT,
prerendered). Fix these when convenient, not before sections 0-4.

LCP root cause: the LCP element is the hero `<h1>` text, and the 1.1 s FCP→LCP gap is the webfont
swap repaint. Fonts are only discoverable after CSS parses (HTML 375 ms → CSS 699 ms → fonts 1007 ms).

1. **Preload the two hero font subsets** in `src/app/layout.tsx` (DM Sans latin, Instrument Serif
   latin) with `rel=preload as=font type=font/woff2 crossorigin`. ~300 ms off mobile LCP. Only
   those two, not all 12.
2. **Fix font cache headers.** `/public/fonts/*.woff2` serve `max-age=0, must-revalidate` despite
   content-hashed filenames — 139 KiB revalidated every repeat visit. Add a `/fonts/:path*`
   entry to `headers()` in `next.config.ts` with `max-age=31536000, immutable`.
3. **Drop latin-ext subsets** from `src/app/landing-fonts.css` — 29.5 KiB of waste for en-IN.
   Also audit whether JetBrains Mono earns its 30.9 KiB.
4. **Add `width`/`height` to all 48 `<img>`** (`Hero.tsx`, `LogoCloud.tsx`, `Integrations.tsx`).
   All are raw tags with `loading="lazy"` and no dimensions. Lab CLS reads 0 only because they
   never enter the lab viewport; real devices will shift. Batch this with the alt-text fix in
   Phase 0 item 10.
5. **Self-host the 12 logos and 6 stock photos** (currently Unsplash / Clearbit / Simple Icons).
   Removes 3 TLS handshakes and lets `img-src` tighten from `https:` to `'self'`.
6. **Tighten browserslist** in `package.json` — 11.4 KiB of dead ES2019-2022 polyfills shipping.
7. **Remove `'use client'` from `src/components/Hero.tsx`** — zero hooks, zero handlers, and it is
   the above-fold LCP section. (`InteractivePosDemo.tsx` legitimately needs it; leave that alone.)

Skipped deliberately: code-splitting the POS demo. TBT is already 0 ms.

To get real field data, get a free PSI key at console.cloud.google.com and run:
`curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://posomega.com&strategy=mobile&key=$PSI_KEY"`

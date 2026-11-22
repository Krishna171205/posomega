import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingPageView } from '@/components/marketing/MarketingPageView'
import { TOOL_PAGES } from '@/content/tools'
import { pageMetadata } from '@/lib/seo'

const PREFIX = 'tools'
const PAGES = TOOL_PAGES

export function generateStaticParams() {
  return PAGES.map(p => ({ slug: p.slug.slice(PREFIX.length + 1) }))
}

function find(slug: string) {
  return PAGES.find(p => p.slug === `${PREFIX}/${slug}`)
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const page = find((await params).slug)
  return page ? pageMetadata(page) : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const page = find((await params).slug)
  if (!page) notFound()
  return <MarketingPageView page={page} />
}

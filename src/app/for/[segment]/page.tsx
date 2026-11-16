import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { OutletPageView } from '@/components/outlet/OutletPageView'
import { SEGMENTS } from '@/content/segments'
import { pageMetadata } from '@/lib/seo'

const PREFIX = 'for'
const PAGES = SEGMENTS

export function generateStaticParams() {
  return PAGES.map(p => ({ segment: p.slug.slice(PREFIX.length + 1) }))
}

function find(segment: string) {
  return PAGES.find(p => p.slug === `${PREFIX}/${segment}`)
}

export async function generateMetadata(
  { params }: { params: Promise<{ segment: string }> },
): Promise<Metadata> {
  const page = find((await params).segment)
  return page ? pageMetadata(page) : {}
}

export default async function Page({ params }: { params: Promise<{ segment: string }> }) {
  const page = find((await params).segment)
  if (!page) notFound()
  return <OutletPageView page={page} siblings={SEGMENTS} />
}

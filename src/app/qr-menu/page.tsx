import type { Metadata } from 'next'
import { QrMenuPage } from '@/components/qrmenu/QrMenuPage'
import { QR_MENU_PAGE } from '@/content/features'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(QR_MENU_PAGE)

export default function Page() {
  return <QrMenuPage />
}

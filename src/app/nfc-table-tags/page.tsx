import type { Metadata } from 'next'
import { NfcPage } from '@/components/nfc/NfcPage'
import { NFC_TAGS_PAGE } from '@/content/features'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(NFC_TAGS_PAGE)

export default function Page() {
  return <NfcPage />
}

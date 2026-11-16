import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignupPreview } from './SignupPreview'

export const metadata: Metadata = {
  title: 'Create an account',
  robots: { index: false, follow: false },
}

/*
 * The redesigned POS sign-up page, previewed. Accounts are created in the POS app at
 * cafe.posomega.com/onboard, so under `next dev` this renders the design and in a
 * production build /signup forwards there. Same component file as /login.
 */
export default function SignupPage() {
  if (process.env.NODE_ENV !== 'development') redirect('https://cafe.posomega.com/onboard')
  return <SignupPreview />
}

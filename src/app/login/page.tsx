import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginPreview } from './LoginPreview'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

/*
 * The redesigned POS sign-in page, previewed. Signing in has to happen on
 * cafe.posomega.com, where the session cookie is first-party (see ops/signup), so this
 * origin can only show the design: under `next dev` it renders the page, and in a
 * production build /login forwards to the real sign-in. The component lives in
 * components/auth/Auth.tsx, ready to move into the POS app.
 */
export default function LoginPage() {
  if (process.env.NODE_ENV !== 'development') redirect('https://cafe.posomega.com/login')
  return <LoginPreview />
}

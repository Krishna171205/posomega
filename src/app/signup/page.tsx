import type { Metadata } from 'next'
import { SignupPreview } from './SignupPreview'

export const metadata: Metadata = {
  title: 'Talk to our team',
  description: 'Get your restaurant on PepperPe. Leave your number and the PepperPe team sets up your outlet for you.',
}

/*
 * New cafes do not create their own account; the Omega team sets each one up. This page
 * takes a name and a number and stores them as a lead (omegaservice /api/v1/leads), so
 * unlike /login it works on this origin and is served in production too.
 */
export default function SignupPage() {
  return <SignupPreview />
}

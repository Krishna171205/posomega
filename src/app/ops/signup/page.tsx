import { redirect } from 'next/navigation'

// Cafe provisioning moved into the authenticated app: the session cookie is
// first-party to cafe.posomega.com, so this origin can never carry it.
export default function OpsSignupRedirect() {
  redirect('https://cafe.posomega.com/ops/signup')
}

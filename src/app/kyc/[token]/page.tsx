import { redirect } from 'next/navigation'

// KYC moved into the authenticated app so it shares one origin with the API.
// This origin has no API URL configured and is not in the CORS allowlist.
export default async function KycRedirect({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  redirect(`https://billing.pepperpe.com/kyc/${token}`)
}

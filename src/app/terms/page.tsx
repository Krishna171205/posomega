import { LegalPage } from '@/components/LegalPage'

export const metadata = {
  title: 'Terms of Service',
  description: 'The agreement between you and PepperPe Point-of-Sale.',
  alternates: { canonical: '/terms' },
}

export default function Page() {
  return (
    <LegalPage
      title="Terms of"
      italicTail="service."
      updated="24 May 2026"
      intro="By using PepperPe Point-of-Sale, you agree to these terms. They are written for humans. If anything is unclear, write to us and we will explain."
      sections={[
        {
          heading: '1. The service',
          body: 'PepperPe is a cloud-hosted point-of-sale, inventory, and analytics platform for restaurants, cafés, bars, and cloud kitchens, operated by Unified Nexgrade Pvt. Ltd. ("PepperPe", "we"). You access it via web, mobile, and supported hardware terminals.',
        },
        {
          heading: '2. Who can use PepperPe',
          body: 'You must be a legally constituted business in India, at least 18 years old, and authorised to bind your business to this agreement. You must provide accurate registration details and keep them current.',
        },
        {
          heading: '3. Your subscription',
          body: [
            'Subscriptions are billed monthly or annually per outlet, in advance. Fees are listed at pepperpe.com/pricing and may be revised with 30 days\' notice.',
            'You can cancel any time. Pre-paid annual subscriptions are non-refundable after 14 days from the start of a new billing cycle, except where required by law.',
          ],
        },
        {
          heading: '4. Acceptable use',
          body: [
            'You will not use PepperPe to violate Indian law, infringe third-party rights, or process transactions that breach our payment partners\' rules.',
            'You will not reverse-engineer the service, attempt unauthorised access, or resell access to non-affiliated third parties.',
            'You are responsible for the conduct of staff accounts you create.',
          ],
        },
        {
          heading: '5. Your data',
          body: 'You own your data. We process it on your behalf to provide the service, as described in our Privacy policy. You grant us a limited licence to host, transmit, and back up that data for as long as your account is active.',
        },
        {
          heading: '6. Service availability',
          body: 'We target 99.99% monthly uptime, including offline mode that queues orders locally during connectivity loss. We schedule maintenance during off-peak hours and notify you in advance.',
        },
        {
          heading: '7. Payments & settlements',
          body: 'Card and UPI payments are processed by our payment partners (Razorpay, Cashfree, Pine Labs) under their terms. Settlements arrive in your linked bank account on the cycle defined by those partners — typically T+1 working day for UPI and T+2 for cards.',
        },
        {
          heading: '8. Hardware',
          body: 'PepperPe Terminal, PepperPe Mini, and PepperPe Print carry a 12-month manufacturer warranty against defects. Extended warranty and on-site replacement are available on Growth and Enterprise plans.',
        },
        {
          heading: '9. Termination',
          body: [
            'You may terminate at any time from your billing settings.',
            'We may suspend or terminate for non-payment, breach of these terms, or activity that puts our platform or other customers at risk. We will give 14 days\' notice except in cases of fraud or imminent harm.',
            'On termination, you can export your data for 60 days, after which we delete it subject to legal retention obligations.',
          ],
        },
        {
          heading: '10. Liability',
          body: 'To the maximum extent permitted by law, our aggregate liability for any claim arising from the service is limited to the fees you paid us in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.',
        },
        {
          heading: '11. Governing law',
          body: 'These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at New Delhi.',
        },
        {
          heading: '12. Changes to these terms',
          body: 'We will email account owners at least 14 days before material changes take effect. Continued use after the effective date constitutes acceptance.',
        },
      ]}
    />
  )
}

import { LegalPage } from '@/components/LegalPage'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Omega Point-of-Sale collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
}

export default function Page() {
  return (
    <LegalPage
      title="Privacy"
      italicTail="policy."
      updated="24 May 2026"
      intro="We built Omega for restaurant operators, not advertisers. This policy explains what we collect, why we collect it, and the controls you have."
      sections={[
        {
          heading: '1. What we collect',
          body: [
            'Account data: business name, owner name, phone number, GSTIN, billing address, and bank account details for settlements.',
            'Operational data: orders, payments, KOTs, menu items, inventory levels, customer phone numbers and order history, and staff sign-in logs — generated as you run your outlet.',
            'Device data: IP address, device type, browser, app version, and crash logs for security and reliability.',
          ],
        },
        {
          heading: '2. How we use it',
          body: [
            'To operate the Omega platform: process orders, sync inventory across aggregators, settle payments, and deliver receipts.',
            'To provide support: investigate issues you report and prevent fraud.',
            'To improve the product: aggregated and de-identified metrics shape what we build next. We do not train AI models on your customer data.',
          ],
        },
        {
          heading: '3. What we never do',
          body: [
            'We do not sell your customer list, your menu pricing, or your sales data to anyone.',
            'We do not let competing brands on the platform see each other\'s catalogue, demand, or pricing data.',
            'We do not retain payment card details — those live with our PCI-DSS Level 1 payment partners.',
          ],
        },
        {
          heading: '4. Sharing & sub-processors',
          body: 'We share data only with sub-processors required to run the service — payment gateways (Razorpay, Cashfree), aggregators (Swiggy, Zomato) that you choose to connect, cloud hosting (AWS Mumbai), email/SMS (Resend, MSG91), and WhatsApp Business via Meta. All are bound by data-processing agreements.',
        },
        {
          heading: '5. Where your data lives',
          body: 'Production data resides in AWS data centres in Mumbai (ap-south-1). Backups are encrypted at rest and never leave India.',
        },
        {
          heading: '6. Your rights under DPDP Act 2023',
          body: [
            'Access, correction, completion, and erasure of personal data you have provided.',
            'Withdrawal of consent at any time (note: withdrawal may limit your ability to use Omega).',
            'Nomination of another individual to exercise your rights in the event of incapacity.',
            'Grievance redressal — write to grievance@unifiednexgrade.com.',
          ],
        },
        {
          heading: '7. Retention',
          body: 'We retain operational data for as long as your Omega account is active, plus 7 years thereafter to comply with Indian tax and accounting law. You can request deletion at any time, subject to those obligations.',
        },
        {
          heading: '8. Cookies & analytics',
          body: 'See our Cookies policy for the specifics. We use first-party analytics only and do not embed third-party advertising trackers.',
        },
        {
          heading: '9. Changes to this policy',
          body: 'We will email account owners at least 14 days before material changes take effect. The "Last updated" date at the top of this page reflects the current version.',
        },
      ]}
    />
  )
}

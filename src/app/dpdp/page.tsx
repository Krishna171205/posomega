import { LegalPage } from '@/components/LegalPage'

export const metadata = {
  title: 'DPDP Notice',
  description: 'How Omega complies with the Digital Personal Data Protection Act, 2023.',
  alternates: { canonical: '/dpdp' },
}

export default function Page() {
  return (
    <LegalPage
      title="DPDP"
      italicTail="notice."
      updated="24 May 2026"
      intro="Under the Digital Personal Data Protection Act, 2023 (DPDP Act), we owe you a plain-language summary of how we process personal data. This is it."
      sections={[
        {
          heading: '1. Who is the data fiduciary',
          body: 'Unified Nexgrade Pvt. Ltd., operating Omega Point-of-Sale, registered at Delhi NCR, India. For all DPDP-related notices, write to dpo@unifiednexgrade.com.',
        },
        {
          heading: '2. What personal data we process',
          body: [
            'From restaurant operators (our direct customers): business and owner details, contact information, banking details, and operational data described in our Privacy policy.',
            'From cafe customers (your end users, processed on your behalf): phone number, name where you collect it, order history, and any feedback they submit via Omega-powered surfaces.',
            'We are a data processor in respect of your cafe customers\' data, and you are the data fiduciary.',
          ],
        },
        {
          heading: '3. Purposes of processing',
          body: 'To operate the Omega service, settle payments, provide support, prevent fraud, meet legal obligations, and improve the product using aggregated metrics. We do not process personal data for profiling, automated decision-making affecting legal rights, or behavioural advertising.',
        },
        {
          heading: '4. Lawful basis',
          body: 'We rely on (a) consent obtained at sign-up and at relevant feature gates, and (b) the "legitimate uses" specified under Section 7 of the Act — primarily contract performance and compliance with law.',
        },
        {
          heading: '5. Your rights as a data principal',
          body: [
            'Right to access a summary of your personal data we process and the identities of recipients we have shared it with.',
            'Right to correction, completion, updating, and erasure of personal data.',
            'Right to nominate another individual to exercise these rights in the event of your death or incapacity.',
            'Right to grievance redressal — write to grievance@unifiednexgrade.com. We respond within 7 working days.',
          ],
        },
        {
          heading: '6. Cross-border transfers',
          body: 'We process all personal data in AWS Mumbai (ap-south-1). We do not transfer personal data outside India for routine processing. If we ever do, it will only be to jurisdictions notified as permissible under the Act.',
        },
        {
          heading: '7. Data Protection Officer',
          body: 'Our Data Protection Officer can be reached at dpo@unifiednexgrade.com for all queries, exercise of rights, and complaints. We acknowledge requests within 48 hours and resolve within 30 days, in line with Act timelines.',
        },
        {
          heading: '8. Complaints to the Board',
          body: 'If you are unsatisfied with our response, you may approach the Data Protection Board of India at dpb.gov.in (once it begins accepting complaints) under Section 27 of the Act.',
        },
        {
          heading: '9. Children & persons with disability',
          body: 'We do not knowingly process personal data of children under 18 or persons with disability who have appointed a lawful guardian, without verifiable parental or guardian consent. If you believe we have done so, write to dpo@unifiednexgrade.com and we will delete the data immediately.',
        },
        {
          heading: '10. Updates to this notice',
          body: 'We will revise this notice as the DPDP Act\'s rules are notified and as our processing changes. Material changes are notified to account owners by email at least 14 days before they take effect.',
        },
      ]}
    />
  )
}

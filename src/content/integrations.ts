import type { MarketingPage } from './types'

const INTEGRATIONS = { label: 'Integrations', slug: 'integrations' }

export const INTEGRATION_PAGES: MarketingPage[] = [
  {
    slug: 'integrations/swiggy-zomato',
    parent: INTEGRATIONS,
    crumb: 'Swiggy & Zomato',
    eyebrow: 'Aggregator integration',
    h1: 'Swiggy and Zomato POS integration',
    h1Tail: 'one menu, one queue, one inventory.',
    lede:
      'Two-way sync for items, prices, modifiers and stock. Aggregator orders arrive in the same queue as dine-in, and marking something unavailable at the counter takes it off every platform at once.',
    metaTitle: 'Swiggy & Zomato POS Integration | Omega POS',
    metaDescription:
      "Two-way sync for menu, price, modifiers and stock. Aggregator orders land in the same queue as dine-in, and 86ing an item clears every platform.",
    sections: [
      {
        kind: 'prose',
        heading: 'The two problems aggregators create',
        body: [
          'The first is menu drift. You change a price at the counter, and the aggregator menu keeps the old one because updating it is a separate job on a separate portal that somebody does on a Sunday. Within a few months the two menus describe different restaurants, and every discrepancy is either a margin you are not collecting or a complaint you are about to receive.',
          'The second is stock. You run out of paneer at eight, and the platforms keep selling it, because they have no way to know. Each of those orders becomes a cancellation, each cancellation counts against your rating, and the rating is what determines how much volume you see next week. Running out is a bad evening; running out invisibly is a bad month.',
          'Both problems have the same root: the aggregator menu and the restaurant menu are separate records maintained by separate people. The fix is not discipline, it is making them one record.',
        ],
      },
      {
        kind: 'steps',
        heading: 'How the sync works',
        steps: [
          {
            t: 'Menu, outbound',
            d: 'Items, prices, descriptions, modifier groups and category structure are published from Omega to each platform. Platform-specific pricing is supported, because delivery pricing usually should differ from counter pricing.',
          },
          {
            t: 'Stock, outbound and immediate',
            d: 'Marking an item unavailable at the counter or on the kitchen display pushes that state to every connected platform at once. Replenishing it reverses the same way.',
          },
          {
            t: 'Orders, inbound',
            d: 'Orders arrive in Omega and enter the same queue as dine-in and takeaway, with the channel marked on the ticket. They are sequenced on the kitchen display alongside everything else rather than in a separate list.',
          },
          {
            t: 'Reconciliation',
            d: 'Aggregator revenue, commission and payouts are reported next to your direct revenue, so the question of what each channel is actually worth after commission has an answer.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'One kitchen queue, sequenced together',
        body: [
          'Running aggregator orders on a separate tablet means the kitchen is working two lists with no shared sense of priority, and the tie-break is whoever shouted most recently. The result is a delivery order sitting for eleven minutes while the line works through dine-in, or the reverse.',
          'Because Omega puts every channel into one queue, the line sequences all of it by when it needs to leave. A delivery order with a rider already assigned is genuinely more urgent than a table that has just been seated, and a queue that knows about both can act on that.',
        ],
      },
      {
        kind: 'prose',
        heading: 'What still happens on the platform',
        body: [
          'Promotional campaigns, platform-side discounting and some storefront settings remain on Swiggy and Zomato, because they are commercial levers the platforms own rather than menu data. We would rather be precise about that than imply the tablets disappear entirely on day one.',
          'What does move into Omega is everything operational: the menu, the prices, the modifiers, the stock state and the order queue. In practice most kitchens keep the tablets powered on through changeover and then shelve them.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I charge different prices on delivery than at the counter?',
        a: 'Yes, and most restaurants should, because aggregator commission is a real cost that counter pricing does not carry. Omega supports per-channel pricing on the same item, so the menu stays one record while the price differs where you want it to.',
      },
      {
        q: 'How quickly does an out-of-stock item disappear from the platforms?',
        a: 'The push happens as soon as the item is marked unavailable. The time to actually appear on the customer side then depends on each platform\'s own processing, which we do not control, so we would rather not publish a number we cannot guarantee. What we can say is that it is one action rather than one action per platform.',
      },
      {
        q: 'Do I need to keep the Swiggy and Zomato tablets?',
        a: 'For day-to-day operation, no. The integration is two-way, so orders and menu both flow through Omega. Keep them accessible for platform-side promotional settings, which remain on the platform. Most kitchens keep them on during changeover and then put them away.',
      },
      {
        q: 'What happens to aggregator orders during an internet outage?',
        a: 'They are held by the platform, because the platform cannot reach you either. When connectivity returns Omega pulls in the orders that arrived during the gap so they enter the queue rather than being lost. This is the specific failure a paper fallback cannot cover.',
      },
    ],
    related: ['integrations/upi-and-payments', 'for/cloud-kitchens', 'features/kitchen-display', 'restaurant-billing-software'],
  },

  {
    slug: 'integrations/upi-and-payments',
    parent: INTEGRATIONS,
    crumb: 'UPI & payments',
    eyebrow: 'Payments',
    h1: 'UPI and card payments in your POS',
    h1Tail: 'collected and reconciled in one step.',
    lede:
      'UPI, cards, wallets and cash settled against the order rather than matched by hand afterwards. Omega works with the payment providers and terminals Indian restaurants already use.',
    metaTitle: 'Restaurant POS with UPI & Card Payments | Omega POS',
    metaDescription:
      "UPI, card, wallet and cash collected against the order and reconciled automatically, so day-end is a check rather than a matching exercise.",
    sections: [
      {
        kind: 'prose',
        heading: 'Collecting the payment is easy. Reconciling it is not.',
        body: [
          'Almost every restaurant in India can already take UPI, usually via a static QR code taped to the counter. The problem is not collection, it is attribution. A payment arrives in the bank with a reference nobody recognises, and at the end of the day somebody sits down with a settlement report and a stack of bills and tries to make two numbers agree.',
          'That exercise takes time it is hard to justify and it is done badly under fatigue, which means genuine mismatches get written off as rounding. A missed payment and a double payment look identical at that level of attention.',
          'Omega raises the collection against the specific order, so the payment is matched at the moment it is made rather than reconstructed later. The end-of-day tally becomes a check rather than an investigation.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What is supported',
        cards: [
          { t: 'UPI, order-linked', d: 'A dynamic collection against the bill rather than a static counter QR, so the payment knows which order it belongs to.' },
          { t: 'Cards', d: 'Works alongside the card terminals Indian restaurants already run, including Pine Labs devices.' },
          { t: 'Wallets', d: 'Paytm, PhonePe and Google Pay through the same flow as UPI.' },
          { t: 'Cash', d: 'Recorded on the device, works offline, and folded into the same day-end tally as everything else.' },
          { t: 'Split tender', d: 'Part cash and part UPI on the same bill, which is the normal case on a shared table.' },
          { t: 'Refunds', d: 'Raised against the original payment so the trail survives, rather than handed back as cash with a note.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Day-end should be a check, not a reconstruction',
        body: [
          'Because every payment is attached to an order when it is taken, closing the day is a matter of confirming that expected and received agree, per tender type. Where they do not, the discrepancy points at a specific order rather than at a total.',
          'The practical effect is that the discrepancies you find are real ones. When reconciliation is a manual matching exercise, small differences get absorbed to finish the job, and a persistent leak hides comfortably inside that noise for months.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Payments and connectivity',
        body: [
          'UPI and card payments require a live connection by their nature, and no point-of-sale system can change that. During an outage Omega shows them as unavailable rather than appearing to accept a payment that has not been confirmed, which is the more dangerous behaviour.',
          'Cash continues to work normally and is recorded on the device. This is why cash matters operationally even in a mostly-digital restaurant: it is the tender that survives the line going down.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do I have to change my payment provider to use Omega?',
        a: 'No. Omega is designed to work with the providers and terminals Indian restaurants already run rather than requiring you to move. If you are mid-contract with a provider, that is not a reason to delay. Tell us what you are using and we will confirm the specifics for your setup.',
      },
      {
        q: 'How is this different from the static UPI QR on my counter?',
        a: 'A static QR collects an amount with no idea which bill it belongs to, which is why reconciliation is manual. Omega raises a collection against the specific order, so the payment is attributed at the moment it happens and the day-end tally becomes a confirmation rather than a matching exercise.',
      },
      {
        q: 'Can one bill be paid partly in cash and partly by UPI?',
        a: 'Yes. Split tender across any combination of cash, UPI, card and wallet is supported on a single bill, and each portion is recorded against its own tender type so the day-end breakdown stays accurate.',
      },
      {
        q: 'Does Omega charge a per-transaction fee?',
        a: 'No. Omega\'s pricing is per outlet per month with no per-transaction charge on our side. Your payment provider\'s own merchant discount rate is a separate commercial arrangement between you and them, and we do not mark it up.',
      },
    ],
    related: ['integrations/swiggy-zomato', 'pricing', 'features/billing-and-kot', 'restaurant-billing-software'],
  },
]

import type { MarketingPage } from './types'

/*
 * Checked against omegaservice / omegawebui master on 2026-11-16: Swiggy and Zomato
 * orders come in (accept or reject with a prep time); menu, price and stock are not
 * pushed out. Online payments run through a payment gateway (UPI collected against
 * the bill); there is no Pine Labs or wallet-specific integration.
 */

const INTEGRATIONS = { label: 'Integrations', slug: 'integrations' }

export const INTEGRATION_PAGES: MarketingPage[] = [
  {
    slug: 'integrations/swiggy-zomato',
    parent: INTEGRATIONS,
    crumb: 'Swiggy & Zomato',
    eyebrow: 'Aggregator orders',
    h1: 'Swiggy and Zomato orders in your POS',
    h1Tail: 'one queue, one kitchen.',
    lede:
      'Swiggy and Zomato orders arrive in PepperPe next to counter, QR and Grabbit orders. Accept with a prep time and the KOT goes to the right kitchen station without anyone retyping it.',
    metaTitle: 'Swiggy & Zomato Order Integration | PepperPe',
    metaDescription:
      'Swiggy and Zomato orders land in the same PepperPe queue as dine-in: accept or reject with a prep time, KOTs by station, and online order reports.',
    sections: [
      {
        kind: 'prose',
        heading: 'The tablet wall',
        body: [
          'A restaurant on two aggregators usually runs two tablets beside the POS. Someone watches each one, retypes every order into the kitchen, and the kitchen works two lists with no shared sense of priority.',
          'PepperPe brings the orders into the same queue as everything else, so the kitchen works one list and nothing is retyped.',
        ],
      },
      {
        kind: 'steps',
        heading: 'How an aggregator order moves',
        steps: [
          { t: 'It arrives', d: 'The order appears in PepperPe\'s online orders with the platform, items and amount.' },
          { t: 'Accept or reject', d: 'Accept with a prep time, or reject it, from PepperPe instead of the platform tablet.' },
          { t: 'Into the kitchen', d: 'The accepted order becomes a KOT, routed by station, on paper or on the kitchen display, with the channel marked.' },
          { t: 'In the reports', d: 'Online orders show in the same sales reports, with an online order activity report of their own.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What still happens on the platform',
        body: [
          'Menu, price and stock changes on Swiggy and Zomato are still made on their side today. PepperPe does not push your menu or mark items out of stock on the platforms yet, and promotions stay on the platform too.',
          'So most restaurants keep one partner app for menu and stock changes, while everyday order handling moves into PepperPe. We would rather say that plainly than imply the tablets disappear on day one.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do I still need the Swiggy and Zomato apps?',
        a: 'For menu, price and stock changes, yes, because those are still made on the platform. Orders themselves are accepted and handled in PepperPe.',
      },
      {
        q: 'Can I set a prep time when I accept?',
        a: 'Yes. Each accepted order carries a prep time, and the ticket on the kitchen display shows how long it has been cooking.',
      },
      {
        q: 'Can I charge a different price for delivery?',
        a: 'PepperPe supports separate parcel and delivery prices on an item for your own orders. Prices on Swiggy and Zomato are set on the platforms.',
      },
      {
        q: 'Do aggregator orders print KOTs?',
        a: 'Yes. Once accepted, they route by station like any other order, to paper, to the kitchen display, or both.',
      },
    ],
    related: ['features/kitchen-display', 'for/cloud-kitchens', 'integrations/upi-and-payments', 'restaurant-billing-software'],
  },

  {
    slug: 'integrations/upi-and-payments',
    parent: INTEGRATIONS,
    crumb: 'UPI & payments',
    eyebrow: 'Payments',
    h1: 'UPI and card payments in your POS',
    h1Tail: 'recorded against the bill.',
    lede:
      'Take UPI against the bill through our payment gateway, record cash and card, mix them on one bill, and close the register with every payment already attached to its order.',
    metaTitle: 'Restaurant POS with UPI & Card Payments | PepperPe',
    metaDescription:
      'UPI collected against the bill, cash and card recorded per order, mixed tenders on one bill, and register shifts that close with every payment matched.',
    sections: [
      {
        kind: 'prose',
        heading: 'Collecting the payment is easy. Matching it is not.',
        body: [
          'Most restaurants already take UPI on a static QR taped to the counter. The trouble is matching: a payment lands in the bank with a reference nobody recognises, and at the end of the day someone tries to make two numbers agree.',
          'With PepperPe, UPI can be collected against the bill itself, so the payment is matched to the order when it is made.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What is supported',
        cards: [
          { t: 'UPI against the bill', d: 'A payment raised for the specific bill through our payment gateway, payable from any UPI app.' },
          { t: 'Cash', d: 'Recorded on the bill and counted into the register shift.' },
          { t: 'Card', d: 'Recorded against the bill when taken on your own card machine.' },
          { t: 'Mixed tenders', d: 'Part cash, part UPI on the same bill, each recorded against its own mode.' },
          { t: 'Part payments', d: 'Take part of a bill now and the rest later; the bill closes when it adds up.' },
          { t: 'Register shifts', d: 'Open and close the register per shift, with every payment attached to the shift it was taken in.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Day-end is a check, not a reconstruction',
        body: [
          'Because every payment is attached to an order and a shift, closing the day is confirming that expected and received agree for each payment mode. When they do not, the difference points at specific bills, not at a total.',
        ],
      },
    ],
    faq: [
      {
        q: 'How is this different from the static UPI QR on my counter?',
        a: 'A static QR collects an amount with no idea which bill it belongs to. A payment raised against the bill is matched to the order the moment it is paid.',
      },
      {
        q: 'Can one bill be paid partly in cash and partly by UPI?',
        a: 'Yes. Each portion is recorded against its own payment mode, so the day-end breakdown stays accurate.',
      },
      {
        q: 'Do you integrate with my card machine?',
        a: 'Not directly. Take the card payment on your machine as usual and record it against the bill in PepperPe.',
      },
      {
        q: 'Does PepperPe charge a per-transaction fee?',
        a: 'No. PepperPe is priced per outlet per month with no per-transaction charge from us. The payment gateway\'s own charges for online payments are separate.',
      },
    ],
    related: ['features/billing-and-kot', 'pricing', 'integrations/swiggy-zomato', 'restaurant-billing-software'],
  },
]

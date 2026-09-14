import type { MarketingPage } from './types'

export const LANDING_PAGES: MarketingPage[] = [
  {
    slug: 'restaurant-billing-software',
    crumb: 'Restaurant billing software',
    eyebrow: 'Restaurant billing software',
    h1: 'Restaurant billing software',
    h1Tail: 'for Indian cafés and restaurants.',
    lede:
      'GST-compliant billing, kitchen order tickets, inventory, aggregator sync and UPI payments in one system. Runs on the tablet you already have, keeps working when the internet does not, and costs Rs 1,499 per outlet per month.',
    metaTitle: 'Restaurant Billing Software India | Omega POS',
    metaDescription:
      "Restaurant billing software for Indian cafés and restaurants: GST invoices, KOT, inventory, Swiggy and Zomato sync and UPI from Rs 1,499 per outlet.",
    sections: [
      {
        kind: 'prose',
        heading: 'What restaurant billing software actually has to do',
        body: [
          'The phrase covers more ground than it sounds like. A restaurant does not need something that prints bills, it needs one system that can take an order at a counter or a table, send the right parts of it to the right kitchen station, price it correctly under GST for dine-in and for takeaway, collect payment across four tender types, deduct the ingredients it just consumed, and do all of that in the same shape whether the order came from a walk-in, a QR code or Swiggy.',
          'Systems that only do the billing half push the rest back onto people. That is why so many restaurants end up running a POS, a separate aggregator tablet per platform, an inventory spreadsheet and a reconciliation ritual at the end of every day. Each of those is a place for the numbers to stop agreeing.',
          'Omega is built as one system across those functions, which is less about features and more about the fact that the order, the ticket, the stock deduction and the payment are all the same record.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What is included',
        cards: [
          { t: 'GST-compliant billing', d: 'CGST and SGST splits, HSN codes on the line, correct dine-in and takeaway treatment, and GSTR-ready exports.' },
          { t: 'KOT and kitchen display', d: 'Tickets routed by station to paper, to screen, or to both during a transition.' },
          { t: 'Inventory at recipe level', d: 'Sales deduct actual ingredients, and variance is reported in rupees rather than in units.' },
          { t: 'Swiggy and Zomato sync', d: 'Two-way on menu, price, modifiers and stock, with orders in the same queue as dine-in.' },
          { t: 'UPI, card, wallet and cash', d: 'Collected against the order so day-end is a check rather than a manual matching exercise.' },
          { t: 'Offline mode', d: 'Billing, KOTs and cash keep running through an outage and reconcile automatically afterwards.' },
          { t: 'Multi-outlet control', d: 'Push menus and prices from one screen, with per-outlet overrides made explicit.' },
          { t: 'Reports that answer questions', d: 'Item profitability, variance, throughput and per-channel revenue after commission.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What it costs',
        body: [
          'Rs 1,499 per outlet per month for a single location, Rs 3,499 per outlet per month for up to ten outlets, and custom pricing for chains. Annual billing is twenty per cent cheaper.',
          'There is no per-seat charge, which matters because a second terminal on a busy counter is an operational decision and should not be a licensing one. There is no setup fee, no per-transaction fee on our side, and migration from your existing system is included in onboarding rather than quoted separately.',
          'Hardware is optional. Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard thermal printers, so the common outcome for an existing restaurant is that the printer and the cash drawer stay and only the software changes.',
        ],
      },
      {
        kind: 'steps',
        heading: 'Switching from an existing POS',
        intro:
          'Most restaurants evaluating billing software are replacing something rather than starting fresh. The migration is the part that decides whether the switch is painful.',
        steps: [
          { t: 'Export', d: 'We take your menu, modifier groups, customers and inventory out of your current system. This is included in onboarding, not billed as a project.' },
          { t: 'Load and check', d: 'Everything is loaded into Omega and checked against your live menu before you switch, so you are not proofreading a menu during service.' },
          { t: 'Run both briefly', d: 'Most restaurants run the old system alongside Omega for a short period. Nothing about Omega requires you to cut over on a single date.' },
          { t: 'Switch', d: 'Pick a quiet shift rather than a quiet day. Staff training happens on the order screen, which is the only surface most of them touch.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Who it is for',
        body: [
          'Omega is built for Indian food businesses: cafés and bakeries, quick-service restaurants and food courts, chef-led dining rooms, bars and breweries, and delivery-only cloud kitchens. The formats differ enough that the product surfaces differently for each, which is why there are separate pages describing what each one gets.',
          'It is not built for retail, and we would rather say so than sell you something that fits badly. If you are running a grocery or a pharmacy, the inventory model here is the wrong shape for you.',
        ],
      },
    ],
    faq: [
      {
        q: 'How much does restaurant billing software cost in India?',
        a: 'Omega is Rs 1,499 per outlet per month for a single location and Rs 3,499 per outlet per month for up to ten outlets, with twenty per cent off on annual billing. There is no setup fee, no per-seat charge and no per-transaction fee from us. Across the Indian market you will see anything from free tools with limits to per-terminal licences that run several times this, and the thing worth checking in any quote is whether it is priced per outlet or per terminal.',
      },
      {
        q: 'Do I need to buy new hardware?',
        a: 'No. Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard thermal printers over Bluetooth, USB or network. Our own hardware exists and is optional. For a restaurant already running a counter setup, the usual outcome is that the printer and cash drawer stay and only the software changes.',
      },
      {
        q: 'Does it work without an internet connection?',
        a: 'Billing, KOT printing, the kitchen display and cash payments all keep running from the local device, with orders queuing and reconciling automatically when the connection returns. Card and UPI need connectivity by nature, so those are the functions an outage actually affects.',
      },
      {
        q: 'Is it GST compliant?',
        a: 'Yes. Invoices carry your GSTIN, HSN codes at the line level and the correct CGST and SGST split, with the different treatment dine-in and takeaway require. Invoice numbering stays sequential even through an offline period, and exports are produced in a form your accountant can file from.',
      },
      {
        q: 'Can I migrate from Petpooja, Posist or another POS?',
        a: 'Yes, and migration is included in onboarding at no extra cost. We export your menu, modifiers, customers and inventory from your current system and load them into Omega before you switch, so nobody is re-typing a menu during service.',
      },
      {
        q: 'How long does setup take?',
        a: 'Most cafés and restaurants are taking orders the same day. Your menu, taxes, table layout and printer pair through a single setup flow, and there is no on-site engineer visit to schedule. Larger multi-outlet rollouts are staged store by store rather than done in one weekend.',
      },
    ],
    related: ['gst-billing-software-for-restaurants', 'pricing', 'features/offline-mode', 'integrations/swiggy-zomato'],
  },

  {
    slug: 'gst-billing-software-for-restaurants',
    crumb: 'GST billing',
    eyebrow: 'GST billing',
    h1: 'GST billing software for restaurants',
    h1Tail: 'correct on the line, not just the total.',
    lede:
      'CGST and SGST splits, HSN codes at line level, the right treatment for dine-in and takeaway, invoice numbering that survives an outage, and exports your accountant can actually file from.',
    metaTitle: 'GST Billing Software for Restaurants | Omega POS',
    metaDescription:
      "GST-compliant restaurant invoices with CGST and SGST splits, line-level HSN codes, correct dine-in versus takeaway treatment and GSTR-ready exports.",
    sections: [
      {
        kind: 'prose',
        heading: 'Where restaurant GST billing usually goes wrong',
        body: [
          'It is rarely the tax rate. Most systems get the headline percentage right. What they get wrong is everything around it, and those errors are invisible until somebody looks at a filing months later.',
          'The common ones: HSN codes missing at the line level so the invoice is not fully compliant even though the total is correct. Composite items where food and beverage carry different treatment being taxed as one line. A gap in the invoice sequence because the system was offline for twenty minutes and numbered from the cloud. Discounts applied after tax rather than before, which changes what is owed. Exports that arrive as a PDF, so the numbers are re-keyed by hand and acquire a fresh set of errors on the way.',
          'None of these are dramatic on any single bill. They matter because a restaurant issues thousands of bills a month, and an error that is systematic is an error on all of them.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What Omega handles',
        cards: [
          { t: 'CGST and SGST splits', d: 'Correctly separated on the invoice rather than shown as one combined tax line.' },
          { t: 'Line-level HSN codes', d: 'Carried per item, not stated once in a footer.' },
          { t: 'Dine-in and takeaway', d: 'Treated according to their respective rules rather than sharing one configuration.' },
          { t: 'Mixed food and beverage bills', d: 'Different treatment on different lines of the same invoice, which is the normal case in a bar with a kitchen.' },
          { t: 'Discounts before tax', d: 'Applied in the correct order so the taxable value is right, with the reason recorded.' },
          { t: 'Offline-safe numbering', d: 'The sequence is maintained on the device, so an outage does not open a gap in the invoice series.' },
          { t: 'GSTR-ready exports', d: 'Structured output your accountant files from, rather than a PDF that has to be re-entered.' },
          { t: 'Per-outlet GSTIN', d: 'Multi-outlet businesses registered separately by state get the correct GSTIN on each outlet\'s invoices.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Invoice numbering and offline periods',
        body: [
          'This is the detail that most often surprises people. If invoice numbers are issued by a server, a restaurant that bills through an internet outage either stops issuing invoices or issues them outside the series, and the gap shows up at filing time.',
          'Omega maintains the sequence on the device. Bills printed while the line is down carry correct sequential numbers, and when connectivity returns the queue drains into the same series rather than alongside it. Nothing needs to be renumbered afterwards, which is important because renumbering issued invoices is not something you are supposed to do.',
        ],
      },
      {
        kind: 'prose',
        heading: 'What your accountant gets',
        body: [
          'Structured, line-level exports covering sales, tax collected by rate, HSN summary and credit notes, per outlet and per period. The point of exporting at line level rather than as summaries is that a summary cannot be checked, only accepted.',
          'Where a restaurant runs several outlets under separate registrations, each outlet\'s data comes out separately with its own GSTIN rather than as a consolidated figure that then has to be pulled apart.',
        ],
      },
      {
        kind: 'prose',
        heading: 'A note on what this page is not',
        body: [
          'This describes what the software does. It is not tax advice, and rates and rules change. Your rate configuration, your registration position and how you treat specific items are between you and your accountant, and Omega is configured to match their answer rather than to decide it for you.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Omega generate GST-compliant invoices?',
        a: 'Yes. Invoices carry your GSTIN, line-level HSN codes, a correct CGST and SGST split and the appropriate treatment for dine-in versus takeaway. The invoice series stays sequential including through offline periods, and exports are produced at line level rather than as a PDF summary.',
      },
      {
        q: 'Can I run different GSTINs for different outlets?',
        a: 'Yes. Each outlet carries its own GSTIN, which is what multi-state businesses registered separately by state require. Reporting can be viewed per outlet or consolidated, and exports are produced per registration so nothing has to be separated afterwards.',
      },
      {
        q: 'How are discounts treated for tax?',
        a: 'Discounts are applied before tax so the taxable value is correct, and every discount records who applied it and why. Applying a discount after tax is a common configuration error that quietly misstates the tax collected on every bill it touches.',
      },
      {
        q: 'What happens to the invoice series if I bill offline?',
        a: 'The sequence is maintained on the device, so offline bills carry correct sequential numbers and no gap appears in the series. When the connection returns, those invoices sync into the same series. Nothing is renumbered after issue.',
      },
      {
        q: 'Can I file GST returns directly from Omega?',
        a: 'Omega produces GSTR-ready exports rather than filing on your behalf. Filing stays with you or your accountant, which is deliberate: we would rather give your accountant checkable line-level data than take responsibility for a submission we cannot verify.',
      },
    ],
    related: ['restaurant-billing-software', 'features/billing-and-kot', 'pricing', 'integrations/upi-and-payments'],
  },
]

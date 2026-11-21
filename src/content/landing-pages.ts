import type { MarketingPage } from './types'

export const LANDING_PAGES: MarketingPage[] = [
  {
    slug: 'app',
    crumb: 'Android app',
    eyebrow: 'Android app',
    h1: 'PepperPe Android app',
    h1Tail: 'early access on Google Play.',
    lede:
      'A Kotlin-native tablet terminal for billing, orders and the kitchen queue, built offline-first so the till keeps working when the connection does not. It is on Google Play in early access, and we would rather you knew exactly what that means before you install it.',
    metaTitle: 'PepperPe Android App | Restaurant Billing App on Google Play',
    metaDescription:
      'PepperPe on Google Play: an offline-first Android tablet app for restaurant billing, orders and the kitchen queue. Early access, same account as the web POS.',
    primaryCta: {
      href: 'https://play.google.com/store/apps/details?id=com.unifiednexgrade.omega',
      label: 'Get it on Google Play',
      external: true,
    },
    sections: [
      {
        kind: 'prose',
        heading: 'What early access actually means here',
        body: [
          'The app is published and installable. It is not yet the surface we put a paying café on by default, and we would rather say that on our own website than have you find out on a Friday night.',
          'The web POS at billing.pepperpe.com is the primary terminal today. It runs in a browser on the same tablet, it is what our live cafés are billing on, and every feature lands there first. The Android app is the same product in a native shell, ahead on feel and on offline behaviour, behind on a small number of things that genuinely need device hardware.',
          'If you are evaluating PepperPe, start on the web POS. Install the app alongside it if you want to see where the product is going, or if offline reliability is the specific thing you are shopping for.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What the app does today',
        cards: [
          { t: 'Offline-first billing', d: 'Orders are written to the device first and synced after, so the terminal does not slow down or stop when the connection does.' },
          { t: 'Orders and kitchen queue', d: 'The same order queue and kitchen display as the web POS, including aggregator orders, on one screen.' },
          { t: 'One account, both surfaces', d: 'Sign in with your existing PepperPe credentials. Outlets, menu, staff and reporting are shared, not duplicated.' },
          { t: 'Register and shift close', d: 'Open and close the register on the device, with the day reconciling into the same reporting as everything else.' },
          { t: 'Catalogue and inventory', d: 'Menu, modifiers and stock, editable from the terminal rather than only from a back office.' },
          { t: 'Built for a tablet', d: 'Designed for a counter tablet in landscape, not a phone layout stretched to fit.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What is not finished',
        body: [
          'Thermal printing over ESC/POS and barcode scanning are still landing. Both depend on physical hardware we cannot meaningfully verify without it in hand, so we are not going to claim them until they are done. Today, printing runs through the web POS.',
          'That is the honest reason the app is in early access rather than pitched as the main terminal. Everything else in the list above works, and the offline behaviour is genuinely ahead of the browser.',
        ],
      },
      {
        kind: 'prose',
        heading: 'iOS',
        body: [
          'The codebase is Kotlin Multiplatform and the iOS target is wired, so an iPad build is a question of finishing and shipping rather than of rewriting. There is no public iOS build yet and no date we are willing to put on this page.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is the PepperPe app free?',
        a: 'The app is a free download. It signs in to an PepperPe account, and the account is what is billed: Rs 1,499 per outlet per month for a single location. There is no separate charge for the Android app, and no per-device or per-seat fee, so installing it on a second tablet costs nothing.',
      },
      {
        q: 'What Android version and hardware does it need?',
        a: 'A modern Android tablet is the target. It is built for a landscape counter tablet rather than a phone. If you are buying hardware specifically for this, wait until printing lands or talk to us first, because the right answer depends on the printer you intend to use.',
      },
      {
        q: 'Does the app work without internet?',
        a: 'Yes, and this is the part it does better than the browser. Orders are written to the device first and queued for sync, so billing continues through an outage and reconciles automatically afterwards. Card and UPI payments still need a connection, because they cannot be confirmed without one.',
      },
      {
        q: 'Do I need the app to use PepperPe?',
        a: 'No. The web POS at billing.pepperpe.com is the primary surface and is what our live cafés bill on. The app is an alternative terminal for the same account, not a requirement and not an upsell.',
      },
      {
        q: 'Can I use the app and the web POS at the same time?',
        a: 'Yes. They are two terminals on one account, so a counter can run the browser while a second station runs the app. Orders, menu and reporting are shared, and pricing is per outlet, so running both costs no more than running one.',
      },
    ],
    related: ['pricing', 'features/offline-mode', 'restaurant-billing-software', 'for/cafes'],
  },

  {
    slug: 'restaurant-billing-software',
    crumb: 'Restaurant billing software',
    eyebrow: 'Restaurant billing software',
    h1: 'Restaurant billing software',
    h1Tail: 'for Indian cafés and restaurants.',
    lede:
      'GST billing, kitchen order tickets, recipe-level inventory, Swiggy and Zomato orders and UPI in one system. Runs on the tablet you already have and costs Rs 1,499 per outlet per month.',
    metaTitle: 'Restaurant Billing Software India | PepperPe',
    metaDescription:
      'Restaurant billing software for Indian cafés and restaurants: GST invoices, KOT and kitchen display, recipe inventory, Swiggy and Zomato orders, UPI. From Rs 1,499 per outlet.',
    sections: [
      {
        kind: 'prose',
        heading: 'What restaurant billing software actually has to do',
        body: [
          'A restaurant does not need something that only prints bills. It needs one system that takes an order at a counter or a table, sends the right parts to the right kitchen station, prices it under GST, collects payment, takes the ingredients off stock, and does all of it the same way whether the order came from a walk-in, a QR code or Swiggy.',
          'Systems that only do the billing half push the rest onto people: a tablet per platform, an inventory spreadsheet, a reconciliation ritual every night. PepperPe keeps the order, the ticket, the stock deduction and the payment as one record.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What is included',
        cards: [
          { t: 'GST billing', d: 'Tax worked out per line from each item\'s slab, with your GSTIN on the invoice and a Tally export for your accountant.' },
          { t: 'KOT and kitchen display', d: 'Tickets routed by station to paper, to screen, or both.' },
          { t: 'Inventory at recipe level', d: 'Sales deduct their ingredients, including variations and add-ons, with wastage logged by reason.' },
          { t: 'Swiggy and Zomato orders', d: 'Accepted in PepperPe with a prep time and sent to the kitchen with the rest.' },
          { t: 'UPI, card and cash', d: 'UPI collected against the bill, mixed tenders and part payments, register shifts.' },
          { t: 'Tables, QR and reservations', d: 'Floor plan, QR ordering at the table, call waiter, pay at table and a reservation diary with waitlist.' },
          { t: 'Loyalty by phone number', d: 'Coins, stamp cards and customer history keyed to the guest\'s phone.' },
          { t: 'Reports', d: 'Around fifty reports: sales, items, payment modes, discounts, cancellations, captains and more.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What it costs',
        body: [
          'Rs 1,499 per outlet per month for a single location, Rs 3,499 per outlet per month for up to ten outlets, and custom pricing for more. Annual billing is twenty per cent cheaper.',
          'There is no per-seat charge, so a second terminal on a busy counter is an operational decision and not a licensing one. There is no setup fee and no per-transaction fee from us.',
          'Hardware is optional. The web POS runs in a browser on an Android tablet, iPad or PC and prints to standard thermal printers, so an existing restaurant usually keeps its printer and cash drawer and changes only the software.',
        ],
      },
      {
        kind: 'steps',
        heading: 'Switching from an existing POS',
        intro:
          'Most restaurants evaluating billing software are replacing something. The switch is the part that decides whether it hurts.',
        steps: [
          { t: 'Hand over your menu', d: 'Send us your current menu and modifiers. Our team sets them up in PepperPe as part of onboarding.' },
          { t: 'Check it together', d: 'Everything is checked against your live menu before you switch, so nobody proofreads a menu during service.' },
          { t: 'Run both briefly', d: 'Most restaurants run the old system alongside PepperPe for a short period. Nothing forces a single cut-over date.' },
          { t: 'Switch', d: 'Pick a quiet shift. Staff training happens on the order screen, which is the only surface most of them touch.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Who it is for',
        body: [
          'PepperPe is built for Indian food businesses: cafés, bakeries and dessert shops, quick-service restaurants and food courts, dining rooms, bars and breweries, pizzerias, cloud kitchens and growing chains. Each has its own page describing what it gets.',
          'It is not built for retail. If you run a grocery or a pharmacy, the inventory model here is the wrong shape for you.',
        ],
      },
    ],
    faq: [
      {
        q: 'How much does restaurant billing software cost in India?',
        a: 'PepperPe is Rs 1,499 per outlet per month for a single location and Rs 3,499 per outlet per month for up to ten outlets, with twenty per cent off on annual billing. There is no setup fee, no per-seat charge and no per-transaction fee from us. When comparing quotes, check whether a price is per outlet or per terminal.',
      },
      {
        q: 'Do I need to buy new hardware?',
        a: 'No. The web POS runs in a browser on an Android tablet, iPad or PC and prints to standard thermal printers. Our own hardware is optional.',
      },
      {
        q: 'Does it work without an internet connection?',
        a: 'The PepperPe Android app does: it saves orders on the tablet and syncs them when the line returns. The web POS and the kitchen display need a connection. Card and UPI payments always need one.',
      },
      {
        q: 'Is it GST compliant?',
        a: 'Invoices carry your GSTIN and tax worked out per line from each item\'s slab. PepperPe does not yet print HSN or SAC codes per item or produce GSTR return files; your accountant works from the Tally export and tax reports.',
      },
      {
        q: 'Can I move from Petpooja, Posist or another POS?',
        a: 'Yes. Our team sets up your menu and modifiers in PepperPe as part of onboarding, at no extra cost, and you can run both systems side by side while you switch.',
      },
      {
        q: 'How long does setup take?',
        a: 'Most cafés are taking orders the same day. Menu, taxes, tables and printer are set up in one flow, with no on-site engineer visit to schedule.',
      },
    ],
    related: ['gst-billing-software-for-restaurants', 'pricing', 'features/offline-mode', 'integrations/swiggy-zomato'],
  },

  {
    slug: 'gst-billing-software-for-restaurants',
    crumb: 'GST billing',
    eyebrow: 'GST billing',
    h1: 'GST billing software for restaurants',
    h1Tail: 'tax worked out on every line.',
    lede:
      'Each item carries its own tax slab, so food and drinks at different rates sit correctly on one invoice. Your GSTIN on every bill, a tax report per period, and a Tally export your accountant can import.',
    metaTitle: 'GST Billing Software for Restaurants | PepperPe',
    metaDescription:
      'GST restaurant billing with tax worked out per line from each item\'s slab, GSTIN on every invoice, tax reports and a Tally export for your accountant.',
    sections: [
      {
        kind: 'prose',
        heading: 'Where restaurant GST billing usually goes wrong',
        body: [
          'It is rarely the headline rate. It is a bill with items at different rates taxed as one, a discount nobody can explain, or numbers re-keyed by hand from a PDF into the accounts.',
          'None of these is dramatic on a single bill. They matter because a restaurant issues thousands of bills a month, and a systematic error is an error on all of them.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What PepperPe handles',
        cards: [
          { t: 'Tax per line', d: 'Every item has its own tax slab, so a mixed bill is taxed line by line, not as one total.' },
          { t: 'GSTIN on the invoice', d: 'Each outlet carries its own GSTIN, which prints on its bills.' },
          { t: 'Discounts with a reason', d: 'Every discount records who gave it and why, and shows in the discount report.' },
          { t: 'Tax report', d: 'Tax collected per period, ready for your accountant to check.' },
          { t: 'Tally export', d: 'Sales export that Tally imports, so nothing is re-keyed by hand.' },
          { t: 'Per-outlet reports', d: 'Sales and tax read per outlet, or across all of them together.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What is not built yet',
        body: [
          'PepperPe does not yet print HSN or SAC codes per item, and it does not produce GSTR return files. Filing stays with you or your accountant, working from the tax report and the Tally export.',
          'We would rather say that here than have it surface at filing time.',
        ],
      },
      {
        kind: 'prose',
        heading: 'A note on what this page is not',
        body: [
          'This describes what the software does. It is not tax advice, and rates and rules change. Your rate configuration and how you treat specific items are between you and your accountant, and PepperPe is set up to match their answer.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does PepperPe generate GST invoices?',
        a: 'Yes. Invoices carry your GSTIN and tax worked out per line from each item\'s slab.',
      },
      {
        q: 'Can different outlets have different GSTINs?',
        a: 'Yes. Each outlet carries its own GSTIN, and reports can be read per outlet.',
      },
      {
        q: 'Does PepperPe print HSN codes?',
        a: 'Not yet. Tax is correct per line, but HSN and SAC codes are not printed per item today.',
      },
      {
        q: 'Can I file GST returns from PepperPe?',
        a: 'No. PepperPe gives your accountant a tax report and a Tally export; it does not produce GSTR files or file on your behalf.',
      },
    ],
    related: ['restaurant-billing-software', 'features/billing-and-kot', 'pricing', 'integrations/upi-and-payments'],
  },
]

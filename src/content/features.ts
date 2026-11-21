import type { MarketingPage } from './types'

/*
 * Feature pages. Every claim here was checked against omegaservice / omegawebui /
 * omega-pos master on 2026-11-16. Notably: offline billing lives in the Android app
 * (early access), not the web POS; the kitchen display talks through the server, not
 * a local network; there is no HSN/GSTR export, bill split/merge, course firing,
 * expo screen, variance report, par levels or aggregator menu/stock push.
 */

const FEATURES = { label: 'Features', slug: 'features' }

export const FEATURE_PAGES: MarketingPage[] = [
  {
    slug: 'features/offline-mode',
    parent: FEATURES,
    crumb: 'Offline mode',
    eyebrow: 'Offline-first Android app',
    h1: 'Offline restaurant billing',
    h1Tail: 'that keeps taking orders.',
    lede:
      'On the PepperPe Android app, orders are written to the tablet first and synced after. When the internet drops, billing and cash keep going, and the queue syncs on its own when the line comes back.',
    metaTitle: 'Offline Restaurant Billing App | PepperPe',
    metaDescription:
      'The PepperPe Android app bills through an internet outage: orders are saved on the tablet, queued, and synced without duplicates when the connection returns.',
    sections: [
      {
        kind: 'prose',
        heading: 'The outage is short. The re-entry is where money goes missing.',
        body: [
          'In an Indian restaurant the internet does drop: roadwork cuts the fibre, the mall\'s shared link slows down at peak. The outage is usually twenty minutes at seven in the evening, which is the worst twenty minutes you have.',
          'What usually follows is a paper bill book, and the next morning a reconciliation nobody does properly. The revenue rarely goes missing during the outage. It goes missing during the re-entry.',
        ],
      },
      {
        kind: 'steps',
        heading: 'What happens when the line drops',
        steps: [
          { t: 'The tablet keeps billing', d: 'The app writes every order to the device first, so order entry does not change mode or slow down.' },
          { t: 'Orders queue locally', d: 'Each order gets its own reference on the device and waits in an outbound queue. Cash completes normally.' },
          { t: 'Card and UPI need the line', d: 'Online payments genuinely need a connection, and no software changes that. Cash is the tender that survives an outage.' },
          { t: 'Sync when it returns', d: 'The queue drains on its own. Because each order already carries its reference, replaying the queue does not create duplicates.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Where offline mode runs today',
        body: [
          'Offline-first billing is built into the PepperPe Android app, which is on Google Play in early access. The web POS at billing.pepperpe.com needs a connection.',
          'The kitchen display and the online views also work through our servers, so during an outage the tablet keeps billing and the rest catches up when the line returns. We would rather say that plainly than have you discover it at seven on a Saturday.',
        ],
      },
    ],
    faq: [
      {
        q: 'Which PepperPe terminal works offline?',
        a: 'The PepperPe Android app. It saves orders on the tablet and syncs them later. The web POS in the browser needs an internet connection.',
      },
      {
        q: 'Will syncing the queue create duplicate orders?',
        a: 'No. Every order gets its reference on the device when it is created, before any network call, and the server treats a repeat as the same order. An interrupted sync that is retried gives the same result as a clean one.',
      },
      {
        q: 'Can I take UPI or card payments offline?',
        a: 'No. Online payments need a connection to be confirmed. Cash keeps working on the device and is folded into the day once the queue syncs.',
      },
      {
        q: 'Is the Android app ready for my counter?',
        a: 'It is in early access. Printing from the app is still landing, so today most cafés bill on the web POS and use the app where offline reliability matters most. The Android app page has the full list of what works and what does not yet.',
      },
    ],
    related: ['app', 'features/billing-and-kot', 'for/cafes', 'restaurant-billing-software'],
  },

  {
    slug: 'features/billing-and-kot',
    parent: FEATURES,
    crumb: 'Billing & KOT',
    eyebrow: 'Billing, KOT and GST',
    h1: 'Restaurant billing and KOT software',
    h1Tail: 'that the kitchen can read.',
    lede:
      'GST invoices with tax worked out per line, kitchen order tickets routed by station, part payments and mixed tenders on one bill, and every discount recorded with who gave it and why.',
    metaTitle: 'Restaurant Billing & KOT Software | PepperPe',
    metaDescription:
      'Restaurant billing with GST worked out per line, KOTs routed by kitchen station, part and mixed payments, and discounts recorded with a reason and the staff member.',
    sections: [
      {
        kind: 'prose',
        heading: 'The KOT decides whether service works',
        body: [
          'A bill is read once, at the end. A kitchen order ticket is read under time pressure, in heat, by someone holding something else. It is the highest-frequency document in the building.',
          'PepperPe sends each item to the station that makes it, set per item, so the tandoor sees tandoor items and the bar sees drinks. Notes like "no onion" travel with the item to the ticket and the kitchen display.',
        ],
      },
      {
        kind: 'cards',
        heading: 'Billing',
        cards: [
          { t: 'GST worked out per line', d: 'Each item carries its own tax slab, so a bill with food and drinks at different rates is taxed correctly line by line.' },
          { t: 'Dine-in, parcel and delivery prices', d: 'Set a different price for parcel or delivery on the same item, without duplicating the menu.' },
          { t: 'Part payments', d: 'Take part of a bill now and the rest later. The bill closes when the payments add up to the total.' },
          { t: 'Mixed tenders', d: 'Part cash, part UPI on the same bill, each recorded against its own payment mode.' },
          { t: 'Discounts with a reason', d: 'Every discount records the reason and the staff member who applied it.' },
          { t: 'Tally export', d: 'Sales export in the format Tally imports, so your accountant is not re-keying bills.' },
        ],
      },
      {
        kind: 'cards',
        heading: 'Kitchen order tickets',
        cards: [
          { t: 'Station routing', d: 'Each item is assigned to a kitchen station, and its ticket goes only there.' },
          { t: 'Notes on the ticket', d: 'Modifiers, allergen tags and guest notes travel with the item.' },
          { t: 'Updates, not duplicates', d: 'When an order changes, the ticket on the kitchen display updates instead of a second one appearing.' },
          { t: 'Removed items audited', d: 'Removing an item after it was ordered is recorded against the staff member who did it.' },
          { t: 'Hold and fire', d: 'Hold an order and fire it to the kitchen when the table is ready.' },
          { t: 'Screen or paper', d: 'Print KOTs, use the kitchen display, or both during a changeover.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Discounts and removed items are where margin leaks',
        body: [
          'The largest unexplained variance in most restaurants is not theft from the till. It is discounts and items removed after they were made, which are easy and look legitimate.',
          'PepperPe records the reason and the staff member on every discount and audits removed items, and the discount and cancellation reports break both down by staff. A manager can answer "why was margin down last month" with something better than a shrug.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does PepperPe produce GST invoices?',
        a: 'Yes. Invoices carry your GSTIN and tax worked out per line from each item\'s slab. PepperPe does not yet print HSN or SAC codes per item or produce a GSTR return file; sales go to your accountant through the Tally export and the tax report.',
      },
      {
        q: 'Can a bill be paid in parts or split by tender?',
        a: 'Yes. You can take part of a bill and the rest later, and mix cash, card and UPI on the same bill. Splitting one table into separate bills per person is not built yet.',
      },
      {
        q: 'Can I run printed KOTs and a kitchen display together?',
        a: 'Yes. The same station setup drives both, so a station can stay on paper while the rest of the line moves to screen.',
      },
      {
        q: 'Can I see who gave a discount?',
        a: 'Yes. Every discount records the staff member and the reason, and the discount report lists them.',
      },
    ],
    related: ['features/kitchen-display', 'gst-billing-software-for-restaurants', 'integrations/upi-and-payments', 'for/fine-dining'],
  },

  {
    slug: 'features/kitchen-display',
    parent: FEATURES,
    crumb: 'Kitchen display',
    eyebrow: 'Kitchen display system',
    h1: 'Kitchen display system (KDS)',
    h1Tail: 'for restaurants that run hot.',
    lede:
      'Every order on one screen per station, from the counter, QR tables, Swiggy and Zomato, with the channel on each ticket. Runs in a browser on whatever screen you can mount.',
    metaTitle: 'Restaurant Kitchen Display System (KDS) | PepperPe',
    metaDescription:
      'A browser-based KDS: orders from every channel in one queue, routed by kitchen station, with start, ready and served on each ticket. Runs on any screen.',
    sections: [
      {
        kind: 'prose',
        heading: 'One list instead of a pile of slips',
        body: [
          'A kitchen running on paper has no shared view of what is waiting. Slips get lost, two stations make the same item, and the delivery order sits while the line works through dine-in.',
          'PepperPe puts every order, whatever channel it came from, on the screen of the station that makes it, in the order it was fired, with the channel marked so the line knows whether it is plating or packing.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What it does',
        cards: [
          { t: 'Station routing', d: 'Each station sees only its own items, set per menu item.' },
          { t: 'One queue for every channel', d: 'Counter, takeaway, QR, Swiggy, Zomato and Grabbit orders arrive in one list with the channel on the ticket.' },
          { t: 'Start, ready, served', d: 'The line marks each ticket as it moves, and the counter sees the change straight away.' },
          { t: 'Live updates', d: 'A changed order updates its ticket on screen instead of creating a second one.' },
          { t: 'Notes that stand out', d: 'Modifiers, allergen tags and guest notes show on the ticket.' },
          { t: 'Runs on any screen', d: 'A browser on a spare tablet, a monitor with a stick PC, or a dedicated panel. No proprietary hardware.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What it needs',
        body: [
          'The kitchen display runs in a browser and stays in step through our servers, so it needs the restaurant\'s internet connection. If the line drops, the PepperPe Android app keeps billing and the kitchen display catches up when it returns.',
        ],
      },
    ],
    faq: [
      {
        q: 'What hardware do I need for the KDS?',
        a: 'Anything that runs a modern browser and can be mounted away from heat and steam. Most kitchens start with a spare tablet or an existing monitor. There is no proprietary display to buy and no charge per screen.',
      },
      {
        q: 'Can one kitchen have several stations?',
        a: 'Yes. Each menu item is assigned to a station, and each station gets its own screen or printer.',
      },
      {
        q: 'Do aggregator orders appear on the KDS?',
        a: 'Yes. Once accepted, Swiggy and Zomato orders arrive in the same queue as dine-in and takeaway, with the channel marked on the ticket.',
      },
      {
        q: 'Does the KDS work during an internet outage?',
        a: 'No, it needs the connection. Billing can continue on the PepperPe Android app, and the kitchen display picks up the queued orders once the line is back.',
      },
    ],
    related: ['features/billing-and-kot', 'for/qsr', 'for/cloud-kitchens', 'integrations/swiggy-zomato'],
  },

  {
    slug: 'features/inventory-and-forecasting',
    parent: FEATURES,
    crumb: 'Inventory',
    eyebrow: 'Inventory and recipes',
    h1: 'Restaurant inventory management',
    h1Tail: 'that deducts itself as you sell.',
    lede:
      'Recipes on every dish, variation and add-on, so each sale takes its ingredients off. Wastage logged with a reason, purchases and expenses in the same place, and low-stock reorder suggestions in the Android app.',
    metaTitle: 'Restaurant Inventory Management Software | PepperPe',
    metaDescription:
      'Recipe-level stock deduction for restaurants, including variations and add-ons, wastage with reasons, store and counter stock, purchases and expenses.',
    sections: [
      {
        kind: 'prose',
        heading: 'Counting stock is not the same as managing it',
        body: [
          'Most restaurant inventory is a counting exercise: what you have, and what you bought. The useful question is what you should have used, and that only exists if every sale knows its recipe.',
          'PepperPe deducts stock at the recipe level, so selling a dish removes its actual ingredients rather than a count of that dish. Variations and add-ons carry their own recipes, so a large coffee with extra shot takes off what it really used.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          { t: 'Recipe-level deduction', d: 'Every sale removes its ingredients, including the recipe for each variation and add-on.' },
          { t: 'Store and counter stock', d: 'Keep stock in the store and move it to the counter as you use it, so each location is counted on its own.' },
          { t: 'Wastage with a reason', d: 'Record waste where it happens, with a reason, so it is not mistaken for missing stock.' },
          { t: 'Purchases and expenses', d: 'Log what you buy and what you spend, next to the stock it affects.' },
          { t: 'Low-stock reorder suggestions', d: 'The Android app suggests what to reorder from how fast items have been selling.' },
          { t: 'Inside the POS', d: 'Stock updates as a by-product of billing, with no second app for staff to keep up.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Why it has to be inside the POS',
        body: [
          'Standalone inventory software fails in restaurants for a structural reason: it needs someone to enter consumption, and nobody does, because the person who knows is on the line.',
          'Inventory inside the point of sale is updated by selling. There is no separate data-entry step to skip, which is why the numbers stay real past the third week.',
        ],
      },
    ],
    faq: [
      {
        q: 'How detailed do recipes need to be?',
        a: 'As detailed as the decisions you want to make. A café tracking milk, beans and syrups gets most of the value for little setup. You can start shallow and deepen the recipes that turn out to matter.',
      },
      {
        q: 'Does PepperPe forecast demand?',
        a: 'The Android app suggests reorder quantities from recent sales. There is no stock-level forecasting in the web POS yet, and no automatic par levels.',
      },
      {
        q: 'Does it handle stock across several outlets?',
        a: 'Each outlet keeps its own stock. Transfers between outlets and a combined stock view across outlets are not built yet.',
      },
      {
        q: 'Can I record wastage?',
        a: 'Yes, with a reason each time, so waste is reported separately instead of hiding in the stock count.',
      },
    ],
    related: ['for/cafes', 'for/cloud-kitchens', 'features/billing-and-kot', 'pricing'],
  },
]

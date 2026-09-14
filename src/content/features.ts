import type { MarketingPage } from './types'

const FEATURES = { label: 'Features', slug: 'features' }

export const FEATURE_PAGES: MarketingPage[] = [
  {
    slug: 'features/offline-mode',
    parent: FEATURES,
    crumb: 'Offline mode',
    eyebrow: 'Offline-first architecture',
    h1: 'Offline restaurant billing software',
    h1Tail: 'that keeps taking orders.',
    lede:
      'Billing, KOTs and cash payments run from the device, not from the cloud. Orders queue locally during an outage and reconcile automatically the moment the connection returns.',
    metaTitle: 'Offline Restaurant Billing Software | Omega POS',
    metaDescription:
      "Billing, KOT printing and cash payments keep running through an internet outage. Orders queue on the terminal and reconcile automatically.",
    sections: [
      {
        kind: 'prose',
        heading: 'Cloud POS has one failure mode, and it is the expensive one',
        body: [
          'A cloud point of sale is the right architecture for almost everything: no server in the back office, updates that happen without a visit, data that survives the tablet being dropped. The trade is that a naive implementation stops working when the line does.',
          'In an Indian restaurant that is not a theoretical risk. Fibre gets cut by roadwork, the backup connection turns out to have been unplugged in March, the mall\'s shared link degrades at exactly the hour everyone is trying to use it. The outage is not usually long. It is usually twenty minutes at seven in the evening, which is the worst twenty minutes you have.',
          'What happens next in most restaurants is a paper bill book, and what happens after that is a reconciliation exercise the following morning that nobody does properly. The revenue that goes missing during an outage rarely goes missing during the outage itself. It goes missing during the re-entry.',
        ],
      },
      {
        kind: 'steps',
        heading: 'What actually happens when the line drops',
        steps: [
          {
            t: 'Nothing visible, at first',
            d: 'The terminal does not change mode or ask anyone to do anything. Order entry, bill printing and KOT printing were already being served from the device, so they continue.',
          },
          {
            t: 'Orders queue locally',
            d: 'Each order is written to the device with its own identifier and held in an outbound queue. Cash payments complete normally because cash does not require a network.',
          },
          {
            t: 'Card and UPI are the exception',
            d: 'Those genuinely need connectivity, and no software can change that. Omega shows them as unavailable rather than appearing to accept a payment that did not happen.',
          },
          {
            t: 'Reconciliation on reconnect',
            d: 'The queue drains in order. Because every order already carries an identifier assigned on the device, replaying the queue cannot create duplicates, and aggregator orders that arrived during the gap are pulled in at the same time.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Why the local device is the source of truth',
        body: [
          'The distinction that matters is whether the terminal is a screen for a remote system or a system in its own right that synchronises. Omega is the second. The order is real the moment it is written locally, which is why the interface does not need to change behaviour during an outage.',
          'This also removes a subtler problem. Systems that treat the cloud as authoritative tend to become sluggish on a slow connection rather than failing cleanly, so the counter gets a system that technically works and practically cannot be used at speed. A local-first design has consistent latency whether the connection is good, bad or absent.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What keeps working',
        cards: [
          { t: 'Order entry', d: 'Full menu, modifiers, tables and tabs. No degraded mode, no reduced item list.' },
          { t: 'KOT printing', d: 'Tickets print to the kitchen over the local network or a directly attached printer.' },
          { t: 'Bill printing', d: 'GST-compliant invoices with correct tax lines and sequential numbering maintained locally.' },
          { t: 'Cash payments', d: 'Completed and recorded on the device, reconciled into the day\'s takings on reconnect.' },
          { t: 'Kitchen display', d: 'Continues on the local network. The KDS and the terminal talk to each other, not through the cloud.' },
          { t: 'Reporting, afterwards', d: 'Once the queue drains, the day reports as a single continuous shift rather than as two halves with a hole.' },
        ],
      },
    ],
    faq: [
      {
        q: 'How long can Omega stay offline?',
        a: 'There is no fixed time limit. The constraint is device storage, which in practice means a terminal can run through an outage far longer than any outage you are likely to have. The relevant limit is not duration, it is that card and UPI payments cannot be taken while the line is down.',
      },
      {
        q: 'Will replaying the queue create duplicate orders?',
        a: 'No. Every order is assigned an identifier on the device at the moment it is created, before any network call. The server treats a repeated identifier as the same order, so a queue that is interrupted mid-drain and retried produces the same result as one that drains cleanly.',
      },
      {
        q: 'What about aggregator orders that arrive during an outage?',
        a: 'Those are held by the platform, since the platform cannot reach you either. When connectivity returns, Omega pulls the orders that arrived during the gap into the queue. This is the part that usually goes wrong with a paper fallback, because nobody re-enters aggregator orders by hand.',
      },
      {
        q: 'Do I need a local server in the restaurant?',
        a: 'No. The terminal itself holds the data and the kitchen display talks to it over the local network. There is no back-office machine to maintain, which is deliberate: an on-premise server is one more thing that fails at seven in the evening.',
      },
    ],
    related: ['features/billing-and-kot', 'for/cafes', 'for/qsr', 'restaurant-billing-software'],
  },

  {
    slug: 'features/billing-and-kot',
    parent: FEATURES,
    crumb: 'Billing & KOT',
    eyebrow: 'Billing, KOT and GST',
    h1: 'Restaurant billing and KOT software',
    h1Tail: 'that the kitchen can read.',
    lede:
      'GST-compliant invoices, kitchen order tickets that route themselves by station, and splitting that survives a full room. The part of the system your staff touch two hundred times a day.',
    metaTitle: 'Restaurant Billing & KOT Software | Omega POS',
    metaDescription:
      "GST-compliant invoices with line-level HSN codes, kitchen tickets routed by station, and bill splitting by cover or item.",
    sections: [
      {
        kind: 'prose',
        heading: 'The KOT is the document that decides whether service works',
        body: [
          'A bill is read once, by one person, at the end. A kitchen order ticket is read under time pressure, in heat, by someone holding something else. It is the highest-frequency document in the building and the one most restaurants think about least.',
          'Most KOT problems are formatting problems. Modifiers printed in the same weight as the item, so "no onion" reads as decoration. Table numbers at the bottom where they are cut off. Two stations receiving the same ticket, so an item is made twice, or neither station receiving it, so it is made never.',
          'Omega routes each line to the station responsible for it and prints the ticket so the thing that changes the dish is the thing that stands out. Items that belong to no station raise a configuration warning rather than silently vanishing, which is the failure that costs a cover.',
        ],
      },
      {
        kind: 'cards',
        heading: 'Billing',
        cards: [
          { t: 'GST-compliant invoices', d: 'Correct CGST and SGST splits, HSN codes on the line, and the different treatment that dine-in and takeaway require.' },
          { t: 'Sequential numbering', d: 'Invoice sequence is maintained on the device, so it does not develop a gap during an outage.' },
          { t: 'Split by cover or item', d: 'Split a table by person, by item, by arbitrary amount, or any combination, without rebuilding the order.' },
          { t: 'Merge tables mid-service', d: 'Combine tables when a party grows without re-entering anything already ordered.' },
          { t: 'Discounts with a reason', d: 'Every discount records who applied it and why, because an unexplained discount is indistinguishable from shrinkage.' },
          { t: 'Accountant-ready exports', d: 'GSTR-ready output and line-level exports rather than a PDF someone has to re-key.' },
        ],
      },
      {
        kind: 'cards',
        heading: 'Kitchen order tickets',
        cards: [
          { t: 'Station routing', d: 'Hot, cold, bar, expo and dessert each receive only what they are responsible for, driven by the item.' },
          { t: 'Modifier emphasis', d: 'Allergy flags and modifiers print prominently, not at the same weight as the item name.' },
          { t: 'Amendments, not reprints', d: 'Changing an order prints a clearly marked amendment rather than a second full ticket the line has to diff by eye.' },
          { t: 'Course firing', d: 'Hold and fire courses on cue for rooms that run coursed service.' },
          { t: 'Void trail', d: 'Voids after firing are printed to the station and recorded against the staff member who made them.' },
          { t: 'Screen or paper', d: 'The same routing drives a kitchen display, printed tickets, or both at once during a transition.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Discounts and voids are where the money leaks',
        body: [
          'In most restaurants the largest unexplained variance is not theft from the till, which is difficult, but discounts and post-fire voids, which are easy and look legitimate. A void applied after the food was made is functionally identical to giving it away.',
          'Omega requires a reason on discount and records the staff member on every void, and reports both by staff member rather than only in aggregate. The intent is not surveillance. It is that a manager can answer the question "why was margin down last month" with something more useful than a shrug.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Omega produce GST-compliant invoices?',
        a: 'Yes. Invoices carry your GSTIN, HSN codes at the line level and the correct CGST and SGST split, with the different treatment that dine-in and takeaway require. Exports are produced in a form your accountant can file from rather than a PDF that has to be re-keyed.',
      },
      {
        q: 'What happens to invoice numbering during an outage?',
        a: 'The sequence is maintained on the device, so bills printed offline carry correct sequential numbers and the series does not develop a gap. This matters more than it sounds, because a gap in the invoice series is the kind of thing that becomes a problem months later during a filing.',
      },
      {
        q: 'Can a bill be split after some of it has already been paid?',
        a: 'Yes. Part-payment against an open table is supported, and the remaining balance can then be split again by cover, item or amount. This is the common case at a table where one person leaves early.',
      },
      {
        q: 'Can I run printed KOTs and a kitchen display at the same time?',
        a: 'Yes, and most kitchens do during a transition. The same routing configuration drives both, so a station can be on paper while the rest of the line is on screen without maintaining two sets of rules.',
      },
    ],
    related: ['features/kitchen-display', 'features/offline-mode', 'gst-billing-software-for-restaurants', 'for/fine-dining'],
  },

  {
    slug: 'features/kitchen-display',
    parent: FEATURES,
    crumb: 'Kitchen display',
    eyebrow: 'Kitchen display system',
    h1: 'Kitchen display system (KDS)',
    h1Tail: 'for restaurants that run hot.',
    lede:
      'Orders routed to the right station, sequenced by when they need to leave rather than when they arrived, with elapsed time on every ticket. Runs in a browser on whatever screen you can mount.',
    metaTitle: 'Restaurant Kitchen Display System (KDS) | Omega POS',
    metaDescription:
      "A KDS that routes orders by station and sequences by required departure time, not arrival order. Runs in a browser on any screen.",
    sections: [
      {
        kind: 'prose',
        heading: 'A KDS is a sequencing tool, not a screen for tickets',
        body: [
          'The common mistake is to treat a kitchen display as a printer that does not use paper. Installed that way it changes nothing, because the line still works in arrival order and still has no view of what is about to become urgent.',
          'The value is in sequencing. A table that ordered four minutes ago and needs two items that take one minute each should not be behind a table that ordered eight minutes ago and needs one item that takes twelve. Arrival order produces the wrong sequence constantly, and a line running on paper has no practical way to see it.',
          'Omega sequences by required departure time and shows elapsed time on every ticket, so the ticket about to breach is visible before it breaches rather than after. That single change is most of the difference between a KDS that helps and one that is ignored within a fortnight.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What it does',
        cards: [
          { t: 'Station routing', d: 'Each station sees only its own items. Expo sees the whole order reassembled so the handoff is complete.' },
          { t: 'Elapsed time per ticket', d: 'Visible from across the line, with thresholds that change state before a ticket is late rather than when it already is.' },
          { t: 'One queue for every channel', d: 'Dine-in, takeaway, QR, kiosk, Swiggy and Zomato arrive in one list with the channel marked on the ticket.' },
          { t: 'Bump and recall', d: 'Bump when plated, recall when something comes back. Recalls are recorded so the pattern is visible later.' },
          { t: 'Amendments in place', d: 'A changed order updates the ticket and marks what changed, instead of issuing a second ticket the line has to compare.' },
          { t: 'Runs on any screen', d: 'A browser on a spare tablet, a monitor with a stick PC, or a dedicated panel. No proprietary hardware.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'It keeps working when the internet does not',
        body: [
          'The kitchen display talks to the terminal over the local network rather than through the cloud. During an internet outage the terminal keeps taking orders and the KDS keeps receiving them, because neither of them needed the outside world to talk to the other.',
          'This is the reason the offline behaviour is worth anything operationally. A POS that keeps billing while the kitchen goes blind has moved the problem rather than solved it.',
        ],
      },
      {
        kind: 'prose',
        heading: 'What you learn from it afterwards',
        body: [
          'A kitchen display is also the only place a restaurant can measure itself honestly. Time from fire to bump, per station, per item, per hour. Which item is consistently the one the rest of the order waits on. Which shift runs long, and whether it runs long because of volume or because of sequencing.',
          'Those questions are asked in every management meeting and answered with opinion, because the data was never recorded. Once the line is on a screen, it is recorded as a by-product of working normally.',
        ],
      },
    ],
    faq: [
      {
        q: 'What hardware do I need for the KDS?',
        a: 'Anything that runs a modern browser and can be mounted safely away from heat and steam. Most kitchens start with a spare tablet or an existing monitor driven by an inexpensive stick PC. There is no proprietary display to buy, and the licence is included rather than charged per screen.',
      },
      {
        q: 'Can one kitchen have several stations?',
        a: 'Yes. Stations are configured per outlet with items routed to them by category or individually, and expo receives the reassembled order. A small kitchen often runs one station and expo; a large one might run five.',
      },
      {
        q: 'Do aggregator orders appear on the KDS?',
        a: 'Yes. Swiggy and Zomato orders arrive in the same queue as dine-in and takeaway, with the channel marked on the ticket so the line knows whether it is plating or packing. They are sequenced alongside everything else rather than in a separate list.',
      },
      {
        q: 'Does the KDS work during an internet outage?',
        a: 'Yes, because it communicates with the terminal over your local network rather than through the cloud. Orders taken offline appear on the kitchen display normally. The two only need the internet to sync with the outside world, not with each other.',
      },
    ],
    related: ['features/billing-and-kot', 'for/qsr', 'for/cloud-kitchens', 'features/offline-mode'],
  },

  {
    slug: 'features/inventory-and-forecasting',
    parent: FEATURES,
    crumb: 'Inventory',
    eyebrow: 'Inventory and demand prediction',
    h1: 'Restaurant inventory management',
    h1Tail: 'that predicts the shortage.',
    lede:
      'Recipe-level stock deduction, variance reported in rupees rather than units, and demand prediction that tells you what to order before you run out of it mid-service.',
    metaTitle: 'Restaurant Inventory Management Software | Omega POS',
    metaDescription:
      "Recipe-level stock deduction, theoretical-versus-actual variance reported in rupees, and demand prediction that flags shortages early.",
    sections: [
      {
        kind: 'prose',
        heading: 'Counting stock is not the same as managing it',
        body: [
          'Most restaurant inventory systems are elaborate counting exercises. They tell you what you have, which you could also establish by walking into the store cupboard, and they tell you what you bought, which is on the invoice. What they rarely tell you is the number that matters: the gap between what you should have used and what you actually used.',
          'That gap is where the money is. It is over-portioning, waste that never got recorded, and stock that left the building. In units it looks trivial, which is why nobody acts on it. In rupees per month it is usually the largest controllable line in the business after labour.',
          'Omega deducts stock at the recipe level, so selling a dish removes its actual components rather than decrementing an abstract count of that dish. Theoretical consumption is then compared against your counted stock and the variance is reported in rupees, per item, per period.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          { t: 'Recipe-level deduction', d: 'Every sale removes actual ingredients, including garnishes, mixers and packaging.' },
          { t: 'Variance in rupees', d: 'Theoretical against actual, reported as money rather than units, so it is a number someone acts on.' },
          { t: 'Demand prediction', d: 'Omega learns the shape of your week and flags what will run out before the next delivery.' },
          { t: 'Par levels and reorder', d: 'Par levels per item per outlet, with suggested order quantities based on predicted consumption.' },
          { t: 'Multi-outlet stock view', d: 'See stock across every outlet at once, including what one store has that another needs.' },
          { t: 'Wastage recording', d: 'Record waste at the point it happens so the variance number reflects reality instead of absorbing it.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Predicting the eighty-six before it happens',
        body: [
          'Running out of your best-selling item at eight on a Saturday is expensive twice: you lose the covers, and you lose them at the moment you had the most demand for them. It is also almost always predictable, because it has happened before, on the same day, for the same reason.',
          'Omega uses your own sales history, adjusted for day of week and recent trend, to flag items that are likely to run short before the next delivery lands. The output is not an alert after the fact, it is an ordering suggestion beforehand, which is the only form of this that changes the outcome.',
          'When something does run out, marking it unavailable once removes it from the counter, the kitchen display and every aggregator at the same time, so you stop accepting orders you cannot make.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Why it has to be inside the POS',
        body: [
          'Standalone inventory software fails in restaurants for a structural reason: it requires someone to enter consumption, and nobody does, because the person who knows what was consumed is on the line and has no reason to open a second application.',
          'Inventory that lives inside the point of sale is updated as a by-product of selling. There is no separate data-entry step to skip, which is why the numbers stay real past the third week.',
        ],
      },
    ],
    faq: [
      {
        q: 'How detailed do recipes need to be?',
        a: 'As detailed as the decisions you want to make. A café tracking only milk, beans and syrups gets most of the value for a fraction of the setup effort. A bar tracking every cocktail to the millilitre gets a much sharper variance number. You can start shallow and deepen the recipes that turn out to matter.',
      },
      {
        q: 'Does it handle stock across multiple outlets?',
        a: 'Yes. Stock is tracked per outlet with a consolidated view across all of them, including transfers between outlets. For cloud kitchens running several brands out of one kitchen, stock is a single pool at the kitchen level while cost is attributed back per brand.',
      },
      {
        q: 'How accurate is the demand prediction early on?',
        a: 'It needs a few weeks of your own sales history before it is useful, because it is learning your pattern rather than applying a generic one. Before then it behaves as ordinary par-level reordering. We would rather say that plainly than have you distrust the feature in month one.',
      },
      {
        q: 'Can I record wastage and staff meals?',
        a: 'Yes, and you should, because unrecorded waste is the single biggest source of noise in the variance number. Both are recorded at the point they happen and reported separately, so waste does not get silently misread as shrinkage.',
      },
    ],
    related: ['for/bars', 'for/cloud-kitchens', 'features/billing-and-kot', 'pricing'],
  },
]

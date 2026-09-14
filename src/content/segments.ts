import type { MarketingPage } from './types'

const INDUSTRIES = { label: 'Industries', slug: 'for' }

export const SEGMENTS: MarketingPage[] = [
  {
    slug: 'for/cafes',
    parent: INDUSTRIES,
    crumb: 'Cafés',
    eyebrow: 'For specialty coffee, bakeries and all-day cafés',
    h1: 'Café billing software',
    h1Tail: 'built for the morning rush.',
    lede:
      'Open tabs, fast order entry, tip pools that actually balance, and billing that keeps working when the internet does not. Omega is a point-of-sale system for cafés, coffee roasters and bakeries in India.',
    metaTitle: 'Café Billing Software for Cafes in India | Omega POS',
    metaDescription:
      "Café billing software for Indian coffee shops and bakeries: open tabs, fast order entry, GST billing, KOT printing, UPI and offline mode.",
    sections: [
      {
        kind: 'prose',
        heading: 'What makes café billing different from restaurant billing',
        body: [
          'A café is not a small restaurant. The order value is lower, the order count is far higher, and almost all of it lands inside a ninety-minute window in the morning and a second, softer one in the evening. A system that works fine for a forty-cover dining room falls apart at a counter taking two hundred orders before eleven.',
          'The failure mode is always the same: too many taps. If ordering a flat white with oat milk takes six screens, the queue backs out of the door and the barista starts writing on cups again. Every café that has abandoned a POS has abandoned it for this reason, not for a missing report.',
          'Omega is built around that constraint. The order screen puts your highest-volume items on the first surface with no category drilling, modifiers are one tap from the item rather than a separate screen, and the whole flow is usable one-handed while the other hand is on the group head.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          {
            t: 'Open tabs and pre-authorisation',
            d: 'Run a tab for a guest working through the afternoon without losing track of it. Tabs auto-close at end of day so nothing carries silently into tomorrow.',
          },
          {
            t: 'Fast order entry',
            d: 'Bigger targets, fewer taps, modifiers attached to the item. Built to be operated at speed by someone who started last week.',
          },
          {
            t: 'Tip pools that balance',
            d: 'Split tips by role, by hours worked or by station, automatically. No spreadsheet at the end of the week.',
          },
          {
            t: 'Phone-number loyalty',
            d: 'Punch cards keyed to a phone number. No app for the customer to download, no card for them to lose.',
          },
          {
            t: 'GST-compliant billing',
            d: 'Correct tax treatment on dine-in and takeaway, HSN codes on the invoice, and GSTR-ready exports for your accountant.',
          },
          {
            t: 'Offline mode',
            d: 'Billing, KOTs and cash all run from the device. Orders queue locally and reconcile the moment the connection returns.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Inventory that survives a milk-based menu',
        body: [
          'Café inventory is deceptively hard because the recipes are shallow and the shrinkage is invisible. A twenty-rupee variance on milk per day is six thousand rupees a year per outlet, and nobody notices it because nobody weighs the jug.',
          'Omega tracks stock at the recipe level, so pulling a cappuccino deducts the beans and the milk rather than decrementing an abstract "cappuccino" count. When the theoretical stock and the counted stock diverge, you see the gap in rupees instead of in units, which is the only form in which anyone acts on it.',
          'The same data drives demand prediction. Omega learns the shape of your week, flags the items likely to run out before the next delivery, and tells you what to order rather than leaving you to reconstruct it from last month\'s bills.',
        ],
      },
      {
        kind: 'prose',
        heading: 'One inventory across the counter and the aggregators',
        body: [
          'Most cafés now take a meaningful share of revenue through Swiggy and Zomato, and most run those as a separate universe with a separate tablet and a separate menu that drifts out of date within a month.',
          'Omega syncs both directions. Items, prices, modifiers and stock stay in step, aggregator orders arrive in the same queue as the counter and the KDS, and marking something out of stock at the counter pushes that state out to each platform so you stop accepting orders you cannot fulfil.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can Omega handle a café with one outlet?',
        a: 'Yes. The Starter plan is Rs 1,499 per outlet per month and is designed for exactly that: one location, unlimited staff logins, unlimited orders, one aggregator integration, daily reports and email support. There is no per-seat charge, so putting a second terminal on the counter costs nothing extra in software.',
      },
      {
        q: 'Does it work with the printer I already have?',
        a: 'Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard thermal printers over Bluetooth, USB or network. Our own hardware is optional. If you are already running a counter setup, the usual outcome is that you keep the printer and the cash drawer and replace only the software.',
      },
      {
        q: 'What happens to my open tabs if the tablet dies mid-shift?',
        a: 'Orders are written locally and synced to the cloud continuously, so an open tab is recoverable from any other device signed into the same outlet. If the outlet is offline at that moment, the tab is restored from the queue the next time the device reconnects.',
      },
      {
        q: 'How long does it take to train a new barista on it?',
        a: 'Most cafés put a new hire on the till within their first shift. The order screen is the only surface a barista needs, and it is deliberately shallow: no nested menus, no admin functions mixed into the ordering flow, and destructive actions like voids sit behind a manager PIN.',
      },
    ],
    related: ['for/cloud-kitchens', 'for/qsr', 'features/offline-mode', 'pricing'],
  },

  {
    slug: 'for/qsr',
    parent: INDUSTRIES,
    crumb: 'QSR',
    eyebrow: 'For QSR chains and food courts',
    h1: 'QSR POS software',
    h1Tail: 'for throughput at scale.',
    lede:
      'Self-order kiosks, drive-thru flows and multi-station kitchen routing. Omega is a point-of-sale system for quick-service restaurants and food-court operators who are measured in covers per hour.',
    metaTitle: 'QSR POS Software for Quick Service Restaurants | Omega',
    metaDescription:
      "QSR POS software for Indian quick-service chains and food courts: self-order kiosks, drive-thru flow, multi-station KDS and throughput analytics.",
    sections: [
      {
        kind: 'prose',
        heading: 'In QSR, the POS is a throughput instrument',
        body: [
          'Every other format can absorb a slow point of sale. QSR cannot, because the queue is the product. A counter that takes forty seconds per order instead of twenty-five does not serve slightly fewer people, it serves visibly fewer people and the line becomes the reason the next customer walks past.',
          'That makes the interesting number time-to-handoff rather than average order value, and almost no POS reports it. Omega does, broken down by stage: order entry, payment, kitchen, expo. When the number moves you can see which stage moved it.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          {
            t: 'Self-order kiosks and QR ordering',
            d: 'Customers place their own orders in the language they read. Every kiosk order lands in the same queue as the counter, so the kitchen sees one list.',
          },
          {
            t: 'Drive-thru flow',
            d: 'Order, pay and dispatch from a single terminal operated by a single staffer, with the order held open across the window sequence.',
          },
          {
            t: 'Multi-station KDS routing',
            d: 'Hot side, cold side and expo each see only what they are responsible for. Routing is driven by the item, not by someone remembering to press the right button.',
          },
          {
            t: 'Throughput analytics',
            d: 'Time from order to handoff, by stage and by hour. Find the shift that is slow rather than the store that is slow.',
          },
          {
            t: 'Unified aggregator queue',
            d: 'Swiggy, Zomato and your own channels arrive on the same screen and are prepared in the same sequence as walk-ins.',
          },
          {
            t: 'Multi-outlet menu control',
            d: 'Push a price change or a new item to every store from one screen. Regional overrides where you need them.',
          },
        ],
      },
      {
        kind: 'steps',
        heading: 'How a peak-hour order moves through Omega',
        intro:
          'The path is deliberately short. Every step that is not required to get food to a customer has been removed from the critical path.',
        steps: [
          { t: 'Entry', d: 'Counter, kiosk, QR or aggregator. All four write into the same order queue with the same shape.' },
          { t: 'Payment', d: 'UPI, card, wallet or cash. UPI settles against the order rather than requiring a manual match afterwards.' },
          { t: 'Routing', d: 'The KOT splits by station automatically. Hot items go to the hot line, drinks go to the beverage station, nothing is printed twice.' },
          { t: 'Expo', d: 'The expo screen shows the order as one unit again, with the slowest item flagged, so the handoff is not waiting on something nobody started.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Running more than one store',
        body: [
          'The multi-outlet problem in QSR is not reporting, it is consistency. A price that is correct in eleven stores and wrong in the twelfth costs more in trust than it does in revenue, and the usual cause is a manual menu update that somebody skipped.',
          'Omega treats the menu as central with per-outlet overrides rather than as twelve independent menus that happen to look similar. Push once, and every store that has not been deliberately overridden takes the change. The outlets that have been overridden are listed explicitly, so the exceptions are visible instead of accidental.',
        ],
      },
    ],
    faq: [
      {
        q: 'How many outlets can Omega handle?',
        a: 'The Growth plan covers up to ten outlets at Rs 3,499 per outlet per month. Beyond that, Enterprise pricing is per chain rather than per outlet and includes the multi-outlet command centre, regional menu overrides and per-brand reporting. Get in touch and we will quote against your actual store count.',
      },
      {
        q: 'Can kiosks run in more than one language?',
        a: 'Yes. Kiosk and QR ordering surfaces support multiple languages, which matters more in food courts and transport hubs than it does in a neighbourhood store. The kitchen-side display stays in one working language so the line is not switching context.',
      },
      {
        q: 'Does the KDS need its own hardware?',
        a: 'No. The kitchen display runs in a browser on any screen you can mount, including a spare tablet or an existing monitor with a cheap stick PC. Most kitchens start on whatever is already in the building and buy dedicated screens later, if at all.',
      },
      {
        q: 'What happens during an internet outage at peak hour?',
        a: 'Billing, KOT printing and cash payments continue from the local device. Card and UPI need connectivity by nature, so those are the only functions affected. Orders queue on the terminal and reconcile automatically when the line comes back, including the aggregator orders that arrived during the gap.',
      },
    ],
    related: ['for/cloud-kitchens', 'for/cafes', 'features/kitchen-display', 'pricing'],
  },

  {
    slug: 'for/fine-dining',
    parent: INDUSTRIES,
    crumb: 'Fine dining',
    eyebrow: 'For chef-led restaurants',
    h1: 'Fine dining restaurant POS',
    h1Tail: 'with hospitality instrumented.',
    lede:
      'Course pacing, table mapping, allergy flags and a guestbook that remembers everyone. Omega is a point-of-sale system for chef-led restaurants where the service, not the transaction, is the product.',
    metaTitle: 'Fine Dining Restaurant POS System India | Omega POS',
    metaDescription:
      "Fine dining POS for chef-led Indian restaurants: course pacing, table mapping, allergy flags on every KOT and integrated reservations.",
    sections: [
      {
        kind: 'prose',
        heading: 'The POS is the only thing that remembers',
        body: [
          'In a chef-led room, the thing that separates a good service from a great one is memory. That a guest sat at table four last March, that they do not drink, that their partner is allergic to shellfish, that the anniversary is next week. Traditionally that memory lived in a head waiter who had been there eleven years.',
          'Very few rooms still have that person, and no room can rely on having them. What is left is whatever the system recorded, which in most restaurants is a bill total and a phone number.',
          'Omega treats guest history as first-class rather than as a CRM bolt-on. Every cover is attached to a guest record, the record surfaces at the point the table is seated rather than at the point the bill is printed, and it survives the departure of the person who built it.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          {
            t: 'Course pacing and fire',
            d: 'Send courses on cue instead of all at once. The kitchen sees what is coming and when, so the pass is not guessing at the room.',
          },
          {
            t: 'Allergy flags',
            d: 'Recorded against the cover, warned to the kitchen automatically and printed on every KOT for that table. Not a note somebody shouted.',
          },
          {
            t: 'Table mapping',
            d: 'A floor plan that matches your actual room, with covers, course state and elapsed time visible at a glance.',
          },
          {
            t: 'Guestbook',
            d: 'Birthdays, preferences, previous visits and what they drank. Present when the table is seated, not when it is paid.',
          },
          {
            t: 'Integrated reservations',
            d: 'EazyDiner, Dineout and OpenTable land in one diary rather than three tabs and a paper book.',
          },
          {
            t: 'Split and merge that works',
            d: 'Split by cover, by item or by arbitrary amount, and merge tables mid-service without rebuilding the order.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Pacing is a kitchen problem the floor creates',
        body: [
          'Most pacing failures are not kitchen failures. They are the result of four tables being seated in six minutes and every order hitting the pass simultaneously, which the floor could see coming and the kitchen could not.',
          'Omega puts course state on both sides of the pass. The floor fires the next course when the table is ready; the kitchen sees the queue of what has been fired and what is held, with elapsed time per table. The effect is that the pass stops being a surprise, which is the only way a small brigade holds a full room together.',
          'It also means the data exists afterwards. Which service ran long, on which section, against which menu. That is a question chefs ask constantly and almost never have an answer to, because the information was never written down.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I lay out my actual floor plan?',
        a: 'Yes. Tables are placed on a plan that matches the room, including irregular shapes, bar seats and private dining. Covers, course state and time-since-seated are visible on the plan itself, so a manager reads the room from one screen rather than walking it.',
      },
      {
        q: 'How are allergies handled?',
        a: 'An allergy is recorded against the cover, not against the order. Once set, it warns on every item added for that cover that conflicts with it, and it is printed on every KOT for that table for the rest of the service. It also persists in the guest record for future visits.',
      },
      {
        q: 'Does it work with EazyDiner and Dineout reservations?',
        a: 'Yes, both land in the same diary alongside walk-ins and direct bookings, so the floor is working from one view of the night. Table assignment and guest history attach to the reservation rather than being re-keyed on arrival.',
      },
      {
        q: 'Can I split a bill by cover rather than by item?',
        a: 'Yes. Omega supports splitting by cover, by item, by an arbitrary amount, or any combination of those on the same table. Merging tables mid-service does not require rebuilding the order, which is the more common failure in restaurants that seat overflow.',
      },
    ],
    related: ['for/bars', 'for/cafes', 'features/billing-and-kot', 'pricing'],
  },

  {
    slug: 'for/cloud-kitchens',
    parent: INDUSTRIES,
    crumb: 'Cloud kitchens',
    eyebrow: 'For delivery-only operations',
    h1: 'Cloud kitchen POS software',
    h1Tail: 'run eight brands from one kitchen.',
    lede:
      'Multi-brand menu management, one unified queue across every aggregator, and per-brand profit and loss. Omega is a point-of-sale and order-management system for delivery-only kitchens in India.',
    metaTitle: 'Cloud Kitchen POS Software India | Omega POS',
    metaDescription:
      "Cloud kitchen POS for Indian delivery-only operations: run several brands from one kitchen, unify Swiggy and Zomato, track per-brand P&L.",
    sections: [
      {
        kind: 'prose',
        heading: 'The tablet wall is the problem',
        body: [
          'Almost every cloud kitchen in India starts with a shelf of tablets, one per brand per aggregator. Eight brands across two platforms is sixteen devices, sixteen notification sounds and sixteen places an order can be missed at nine on a Friday.',
          'The cost is not the hardware. It is that no single surface knows what the kitchen is actually committed to. Nobody can answer how many orders are open, which brand is running late, or whether the paneer will last until eleven, because the answer is distributed across sixteen screens and one person\'s memory.',
          'Omega collapses that into one queue. Every order from every brand on every platform arrives in the same list, prepared in the sequence the kitchen should actually prepare it, with the brand shown on the ticket rather than implied by which tablet buzzed.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          {
            t: 'Multi-brand menus',
            d: 'Run separate brands out of one kitchen with separate menus, separate pricing and separate reporting, sharing one inventory underneath.',
          },
          {
            t: 'Unified aggregator queue',
            d: 'All platforms, one screen. Mark an item unavailable once and it goes out of stock everywhere at the same time.',
          },
          {
            t: 'Shared inventory, separate P&L',
            d: 'One stock pool because there is one kitchen, but costs attributed per brand so you know which brand is actually making money.',
          },
          {
            t: 'Rider dispatch',
            d: 'Auto-assign by zone for your own delivery fleet, with distance tracked per drop.',
          },
          {
            t: 'Prep-time control',
            d: 'Set realistic prep times per brand and per hour instead of one number that is wrong at both ends of the day.',
          },
          {
            t: 'Demand prediction',
            d: 'Omega learns your pattern and flags the items likely to run out before the next delivery.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Per-brand economics, not blended economics',
        body: [
          'The structural trap in a multi-brand kitchen is that the blended number always looks acceptable. Revenue is up, the kitchen is busy, and the overall margin is fine, so nobody examines the brand that is quietly losing money on every order because its packaging cost was estimated once in the first month and never revisited.',
          'Omega attributes food cost, packaging and commission per brand, which is enough to see that one of your eight is subsidising the rest. That is usually the single highest-value report a cloud kitchen operator runs, and it is the one almost nobody has, because a single shared inventory makes the attribution tedious to do by hand.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Eighty-sixing an item, once',
        body: [
          'In a delivery-only kitchen, accepting an order you cannot fulfil is more expensive than in any other format. The customer has already paid, the rider is already assigned, the cancellation counts against your rating on that platform, and you find out about all of it ten minutes later.',
          'Because Omega holds one stock pool across every brand and every platform, marking an item unavailable at the kitchen pushes that state out everywhere at once rather than requiring the same action on sixteen tablets. The same applies in reverse when stock is replenished.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I run more than one brand on a single subscription?',
        a: 'Yes. Pricing is per outlet, not per brand, so a single kitchen running eight virtual brands is one outlet. That is deliberate: a cloud kitchen is one set of walls and one set of staff, and charging per brand would penalise exactly the model the format exists to enable.',
      },
      {
        q: 'How does inventory work across brands that share ingredients?',
        a: 'Stock is a single pool at the kitchen level because there is a single physical store cupboard. Recipes deduct from that pool regardless of which brand the order came through, while cost is attributed back to the brand that consumed it. This gives you accurate stock counts and accurate per-brand margins at the same time.',
      },
      {
        q: 'Do I still need the aggregator tablets?',
        a: 'The integration is two-way, so day-to-day operation happens in Omega. Most kitchens keep the tablets powered on for a short period during changeover and then shelve them. Platform-side actions that have no API equivalent, such as some promotional settings, still happen on the platform.',
      },
      {
        q: 'Does Omega handle my own delivery fleet as well as aggregator riders?',
        a: 'Yes. Riders on your own fleet are auto-assigned by zone with distance tracked per drop, which matters when you are running direct orders alongside aggregator ones. Aggregator riders remain managed by the platform, but their pickups appear in the same queue so the kitchen sequences all of it together.',
      },
    ],
    related: ['for/qsr', 'integrations/swiggy-zomato', 'features/inventory-and-forecasting', 'pricing'],
  },

  {
    slug: 'for/bars',
    parent: INDUSTRIES,
    crumb: 'Bars & lounges',
    eyebrow: 'For bars, breweries and lounges',
    h1: 'Bar billing software',
    h1Tail: 'pour, tab, track.',
    lede:
      'Liquor inventory by the millilitre, tab management with pre-authorisation, and age verification at the point of sale. Omega is a point-of-sale system for bars, breweries and lounges in India.',
    metaTitle: 'Bar Billing Software & POS for Pubs in India | Omega POS',
    metaDescription:
      "Bar billing software for Indian bars and breweries: pour-cost tracking to the millilitre, tab management, age verification and GST billing.",
    sections: [
      {
        kind: 'prose',
        heading: 'Bars lose money in millilitres',
        body: [
          'The economics of a bar are unusually sensitive to a quantity nobody measures. A thirty-millilitre over-pour on a sixty-millilitre peg is a fifty per cent cost overrun on that drink, and it is completely invisible in a system that tracks stock by the bottle.',
          'Over a month, across a busy bar, the difference between a disciplined pour and a generous one is a meaningful fraction of the profit. It does not show up as theft, it shows up as a margin that is slightly worse than the spreadsheet said it would be, every single month, for reasons nobody can locate.',
          'Omega tracks pour cost at the recipe level, down to the millilitre. Every cocktail deducts its actual components, theoretical consumption is compared against counted stock, and the variance is reported in rupees. The point is not to catch anyone. The point is that a number that is invisible cannot be managed, and this one is worth managing.',
        ],
      },
      {
        kind: 'cards',
        heading: 'What you get',
        cards: [
          {
            t: 'Pour-cost tracking',
            d: 'Recipe-level cost down to the millilitre, with theoretical against actual variance reported in rupees rather than in units.',
          },
          {
            t: 'Tab management',
            d: 'Pre-authorise on card, run the tab through the night and auto-close at last call so nothing walks.',
          },
          {
            t: 'Age verification',
            d: 'Scan an ID at the point of sale and automatically block age-restricted SKUs when the check fails.',
          },
          {
            t: 'Stocktake by bottle',
            d: 'Weigh and scan rather than counting and estimating. End-of-night close becomes a task rather than an evening.',
          },
          {
            t: 'Happy hour and timed pricing',
            d: 'Price rules that switch themselves on and off by time and day, so nobody has to remember at seven.',
          },
          {
            t: 'GST-compliant billing',
            d: 'Correct treatment of food and beverage lines on the same bill, with the exports your accountant needs.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Tabs are a trust problem, not a software problem',
        body: [
          'Every bar that runs tabs has lost money on them, and the loss is rarely dramatic. It is a table that left while the bar was three deep, a card that was never pre-authorised because it was busy, a tab that was opened under a first name and never closed.',
          'Omega pre-authorises the card at open, holds the tab against it, and closes everything still open at last call rather than leaving it to be discovered the next afternoon. Tabs are visible on one screen with elapsed time and running total, which is the difference between noticing at eleven and noticing at two.',
        ],
      },
      {
        kind: 'prose',
        heading: 'The late shift has different constraints',
        body: [
          'A bar at midnight is loud, dark and staffed by people who have been on their feet for seven hours. Interfaces that test well in an office do not survive it. Small targets get mis-tapped, confirmation dialogs get dismissed without reading, and anything requiring precision gets worked around.',
          'The practical consequence in Omega is that the bar surface is deliberately coarse: large targets, high contrast, destructive actions behind a manager PIN rather than a dialog, and no admin functionality anywhere near the ordering flow.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can Omega track cocktail recipes with multiple spirits?',
        a: 'Yes. A recipe can contain any number of components at millilitre precision, including garnishes and mixers, and each pour deducts its actual components from stock. That is what makes pour-cost variance meaningful rather than approximate.',
      },
      {
        q: 'How does age verification work?',
        a: 'Scanning an accepted ID at the point of sale records the check against the order and unblocks age-restricted SKUs. If the check fails or is skipped, those SKUs cannot be added. The check is recorded so it is auditable later, which is the part that matters if it is ever questioned.',
      },
      {
        q: 'Does it handle happy-hour pricing?',
        a: 'Yes. Price rules are defined by time and day and apply themselves, including different rules for different days of the week. Because the rule is applied by the system rather than by the bartender remembering, the reporting afterwards reflects what was actually charged.',
      },
      {
        q: 'Can I run food and drink on the same bill?',
        a: 'Yes, and the GST treatment on each line is handled correctly on a single invoice. For bars attached to a kitchen, food items route to the kitchen display while drinks route to the bar station, from the same order.',
      },
    ],
    related: ['for/fine-dining', 'features/inventory-and-forecasting', 'features/billing-and-kot', 'pricing'],
  },
]

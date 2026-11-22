import type { MarketingPage } from './types'

/*
 * Free calculators. The maths lives in src/lib/calc.ts (checked by
 * scripts/calc-check.mts). GST rules below reflect the rate changes effective
 * 22 September 2025; every page tells the reader to confirm with their CA rather
 * than present itself as tax advice.
 */

const TOOLS = { label: 'Free tools', slug: 'tools' }

export const TOOL_PAGES: MarketingPage[] = [
  {
    slug: 'tools/restaurant-gst-calculator',
    parent: TOOLS,
    tool: 'gst',
    crumb: 'Restaurant GST calculator',
    eyebrow: 'Free tool',
    h1: 'Restaurant GST calculator',
    h1Tail: 'CGST and SGST on a bill, both ways.',
    lede:
      'Add GST to a bill, or pull it back out of a menu price. Pick the rate that applies to your outlet and the calculator splits the tax into CGST and SGST the way it prints on an Indian restaurant bill.',
    metaTitle: 'Restaurant GST Calculator (5% and 18%) | PepperPe',
    metaDescription:
      'Free GST calculator for restaurants and cafés in India. Add GST to a bill or extract it from a menu price, with the CGST and SGST split. 5% and 18% rates explained.',
    primaryCta: { href: '/gst-billing-software-for-restaurants', label: 'GST billing in PepperPe' },
    sections: [
      {
        kind: 'prose',
        heading: 'Which GST rate does a restaurant charge?',
        body: [
          'Most restaurants, cafés, bakeries with seating, cloud kitchens and takeaway counters in India charge 5% GST on food and beverage service, and cannot claim input tax credit on what they buy. That is the default for a standalone outlet, whether the order is eaten in, packed or delivered.',
          'The exception is a restaurant inside a "specified premises", which after the changes that took effect on 22 September 2025 broadly means a hotel that charged more than Rs 7,500 for a room per night in the previous financial year, or a hotel that has declared itself one. Restaurant service there is taxed at 18%, and input tax credit is allowed.',
          'A standalone restaurant cannot opt into 18% to claim credit. If you are not sure which side of the line your outlet sits on, your CA can confirm it in a few minutes, and it is worth doing before you print a menu.',
        ],
      },
      {
        kind: 'prose',
        heading: 'How CGST and SGST are split',
        body: [
          'A dine-in, takeaway or delivery bill inside one state is an intra-state supply, so the tax is split evenly into central GST and state GST. At 5% that is 2.5% CGST and 2.5% SGST; at 18% it is 9% and 9%. IGST applies to inter-state supplies, which a restaurant bill almost never is.',
          'When the tax does not divide evenly to the paisa, the calculator puts the extra paisa on SGST, so the two halves always add back up to the full tax.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Adding GST versus extracting it',
        body: [
          'If your menu shows prices before tax, choose "before GST" and the calculator adds tax on top. If your menu prices already include tax, which many cafés prefer because the guest pays the number they see, choose "GST included" and the calculator works backwards to the taxable value. For a 5% inclusive price, the taxable value is the price divided by 1.05.',
          'Either way the bill has to show the taxable value and the tax separately, so even an inclusive menu needs this calculation on every invoice.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Orders through Swiggy and Zomato',
        body: [
          'Since 1 January 2022 the food delivery platform, not the restaurant, pays the 5% GST on orders placed through it, under section 9(5) of the CGST Act. The restaurant still records those sales, but does not deposit GST on them. Your own website, phone and walk-in orders stay your responsibility.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is GST on restaurant food 5% or 18%?',
        a: '5% without input tax credit for a standalone restaurant, café or cloud kitchen, which covers most outlets. 18% with input tax credit applies to restaurant service inside a specified hotel premises. Packaged goods sold as they are, like a bottled drink at MRP, follow their own goods rate rather than the restaurant service rate.',
      },
      {
        q: 'Can a composition scheme restaurant charge GST on the bill?',
        a: 'No. A restaurant registered under the composition scheme pays tax on its turnover itself and must not collect GST from guests. It issues a bill of supply rather than a tax invoice and has to say it is a composition taxable person. Choose 0% in the calculator to see a composition bill.',
      },
      {
        q: 'Is service charge part of the GST calculation?',
        a: 'If a restaurant levies a service charge, it is part of the value of the supply and GST applies to it. Service charge is also voluntary for the guest under consumer protection guidelines, so many restaurants have dropped it. The calculator works on whatever total you enter.',
      },
      {
        q: 'Is this tax advice?',
        a: 'No. It is a calculator and a plain-language summary of the rules as we understand them. GST rates and definitions change through notifications, so confirm your outlet\'s rate with your CA.',
      },
    ],
    related: ['gst-billing-software-for-restaurants', 'tools/menu-price-calculator', 'tools/food-cost-calculator', 'restaurant-billing-software'],
  },

  {
    slug: 'tools/food-cost-calculator',
    parent: TOOLS,
    tool: 'food-cost',
    crumb: 'Food cost calculator',
    eyebrow: 'Free tool',
    h1: 'Food cost calculator',
    h1Tail: 'cost every dish, then fix the menu.',
    lede:
      'Cost every dish from what you actually pay, see the food cost of your whole menu, and find out which dishes to keep, reprice, promote or rethink. Free, no sign-up, and nothing leaves your browser.',
    metaTitle: 'Food Cost Calculator: Recipe Costing and Menu Analysis | PepperPe',
    metaDescription:
      'Free food cost calculator for Indian restaurants and cafés. Cost each recipe from your purchase prices, see menu food cost %, sort dishes by profit and popularity, and find the gap between recipe and actual cost.',
    sections: [
      {
        kind: 'cards',
        heading: 'What the four verdicts mean',
        intro: 'This is menu engineering, the method Kasavana and Smith set out in 1982 and still the standard way to read a menu. A dish counts as popular when it sells at least 70% of an equal share of orders, and as profitable when its margin per plate beats your menu average.',
        cards: [
          { t: 'Keep', d: 'Popular and profitable. Protect the recipe, keep it consistent and do not discount it.' },
          { t: 'Reprice', d: 'Popular, but earns less than average per plate. Because so many sell, a Rs 10 to 20 rise or a slightly lighter recipe moves your whole month.' },
          { t: 'Promote', d: 'Earns well but few people order it. Give it a better spot on the menu, a better description, or a staff recommendation.' },
          { t: 'Rethink', d: 'Low on both. Rework the recipe or the price, or drop it and simplify your prep and stock.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'What is the food cost percentage formula?',
        body: [
          'For one dish: food cost % = plate cost / menu price before GST x 100.',
          'For a period: food cost % = (opening stock + purchases - closing stock) / food sales x 100. Opening stock plus what you bought is what you had; subtract what is left and you have what was used, whether it was sold, wasted or lost.',
          'Always use prices and sales before GST. The tax is not your money, and leaving it in makes the percentage look better than it is.',
        ],
      },
      {
        kind: 'prose',
        heading: 'What is a good food cost percentage?',
        body: [
          'A common rule of thumb for Indian restaurants is roughly 28 to 35 per cent, but it depends on what you sell. Coffee-led cafés usually run well under that, because milk and beans are cheap against the price of a cup. Seafood or meat-heavy menus can run higher and still make money if the ticket size carries it.',
          'More useful than any benchmark is the gap between your recipe cost and your actual cost. A few points is normal. A gap that grows month on month means something changed: a supplier price, portions, wastage, or stock walking out of the door.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Your data stays with you',
        body: [
          'Nothing you enter here is sent to us or anyone else. It is saved in this browser so you can come back to it, and you can download your menu report as a CSV for your accountant or partner.',
          'If you would rather not keep it up to date by hand, PepperPe does this continuously: each sale deducts its ingredients at recipe level, including variations and add-ons, and wastage is logged with a reason, so the recipe-versus-actual gap is there every day instead of once a month.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do I need to cost every dish on my menu?',
        a: 'No. Start with your ten best sellers. They are most of your orders, so they are most of your food cost, and the verdicts are most useful on dishes that sell in volume.',
      },
      {
        q: 'What should I put as yield?',
        a: 'The share of what you buy that ends up on plates. Bottled milk and packaged items are close to 100%. Onions and leafy vegetables after peeling and trimming are often 80 to 90%. If you are not sure, weigh a kilo before and after prep once.',
      },
      {
        q: 'Do beverages go into food cost?',
        a: 'Many operators track beverage cost separately, because drinks run at a very different percentage. In a coffee-led café it is reasonable to cost them together, as the example does. Whatever you choose, use matching sales figures in the monthly check.',
      },
      {
        q: 'Why is my actual food cost higher than my recipes say?',
        a: 'Wastage, heavier portions than the recipe, staff meals and comps that are not recorded, supplier price rises since you last costed, counting errors, and theft. The monthly check puts a rupee figure on the gap so you know whether it is worth chasing.',
      },
      {
        q: 'Is my data saved?',
        a: 'Yes, in this browser only. Clearing your browser data or switching device will lose it, so download the CSV if you want a copy.',
      },
    ],
    related: ['tools/menu-price-calculator', 'features/inventory-and-forecasting', 'tools/restaurant-gst-calculator'],
  },

  {
    slug: 'tools/menu-price-calculator',
    parent: TOOLS,
    tool: 'menu-price',
    crumb: 'Menu price calculator',
    eyebrow: 'Free tool',
    h1: 'Menu price calculator',
    h1Tail: 'price a dish from its plate cost.',
    lede:
      'Enter what the ingredients on one plate cost and the food cost percentage you are aiming for. The calculator gives you the price before GST, the price the guest pays, and a round number to print on the menu.',
    metaTitle: 'Menu Price Calculator for Restaurants and Cafés | PepperPe',
    metaDescription:
      'Free menu price calculator for Indian restaurants and cafés. Price a dish from its plate cost and target food cost %, with GST added and rounded for the menu.',
    sections: [
      {
        kind: 'prose',
        heading: 'How do you price a dish on a menu?',
        body: [
          'Price before GST = plate cost / target food cost %.',
          'A dish whose ingredients cost Rs 60, at a 30% target, needs to sell for Rs 200 before tax. Add 5% GST and the guest pays Rs 210. If your menu shows tax-inclusive prices, that is the number to print, rounded to something a guest can read at a glance.',
          'The calculator rounds up to the next Rs 5, never down, so rounding never quietly eats your margin.',
        ],
      },
      {
        kind: 'steps',
        heading: 'Working out plate cost',
        intro: 'The price is only as good as the plate cost under it. Build it from the recipe, not from memory.',
        steps: [
          { t: 'List every ingredient', d: 'Including oil, garnish, sauces and the packaging for takeaway. The small things are where plate cost goes wrong.' },
          { t: 'Use the quantity on the plate', d: 'Grams or millilitres actually served, not the pack size you buy.' },
          { t: 'Allow for yield', d: 'If 1 kg of onions gives 850 g after peeling, the usable cost per gram is higher than the purchase price says.' },
          { t: 'Use current prices', d: 'Price from the last invoice, and redo it when a supplier changes prices.' },
        ],
      },
      {
        kind: 'prose',
        heading: 'Choosing a target food cost',
        body: [
          'Not every dish has to hit the same target. High-margin items like beverages and fries let you price a signature dish closer to its cost and still land the overall menu where you want it. What matters is the blended number across what you actually sell, which is what the food cost calculator measures.',
          'Price is also set by what guests will pay in your area and what the outlet next door charges. Use the calculator to find the floor, then decide where above it the dish belongs.',
        ],
      },
    ],
    faq: [
      {
        q: 'Should menu prices include GST?',
        a: 'Both are allowed, as long as the bill shows the taxable value and GST separately. Tax-inclusive menu prices avoid the surprise of a bigger total at the end and are common in cafés. If your menu shows prices before tax, say so clearly on the menu.',
      },
      {
        q: 'Do delivery app prices need to be different?',
        a: 'Many restaurants price higher on Swiggy and Zomato to cover the platform commission, packaging and the discounts the platform asks for. Work out the plate cost including packaging, then price for the margin you need after commission.',
      },
      {
        q: 'How often should I reprice?',
        a: 'Check plate costs whenever a key ingredient moves noticeably, and review the whole menu at least a couple of times a year. A dish priced on last year\'s costs is often the reason food cost creeps up.',
      },
    ],
    related: ['tools/food-cost-calculator', 'tools/restaurant-gst-calculator', 'features/inventory-and-forecasting', 'restaurant-billing-software'],
  },
]

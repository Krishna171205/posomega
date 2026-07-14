'use client'
import { Icon } from './Icons'

const HERO_PREVIEW_ITEMS = [
  { name: 'Masala Chai',  price: 60,  emoji: '🍵', bg: 'linear-gradient(135deg, #C7A24B, #8C6E35)', stock: '24', img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80&auto=format&fit=crop' },
  { name: 'Cold Brew',    price: 180, emoji: '☕', bg: 'linear-gradient(135deg, #3D2914, #1A0F08)', stock: '18', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop' },
  { name: 'Aloo Paratha', price: 140, emoji: '🥞', bg: 'linear-gradient(135deg, #E8A87C, #C38D52)', stock: '12', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop' },
  { name: 'Avocado Toast',price: 320, emoji: '🥑', bg: 'linear-gradient(135deg, #88A878, #5C7A4D)', stock: '8', stockLow: true, img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop' },
  { name: 'Filter Coffee',price: 80,  emoji: '☕', bg: 'linear-gradient(135deg, #6B4226, #3D2412)', stock: '32', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop' },
  { name: 'Banoffee Pie', price: 240, emoji: '🥧', bg: 'linear-gradient(135deg, #E8C547, #C19F2F)', stock: '14', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80&auto=format&fit=crop' },
]

const HERO_CART = [
  { name: 'Masala Chai', price: 60, qty: 2 },
  { name: 'Aloo Paratha', price: 140, qty: 1 },
  { name: 'Cold Brew', price: 180, qty: 1 },
]
const HERO_CART_SUBTOTAL = HERO_CART.reduce((s, i) => s + i.price * i.qty, 0)

function HeroPosPreview() {
  return (
    <div className="pos-demo" style={{ transform: 'perspective(2400px) rotateX(4deg)', transformOrigin: 'center top' }}>
      <div className="pos-chrome">
        <div className="traffic"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
        <div className="url">app.omega.in / orders · Connaught Place</div>
      </div>
      <div className="pos-body">
        <aside className="pos-sidebar">
          <div className="brand"><span className="glyph">Ω</span> Omega</div>
          <div className="pos-nav-item active"><Icon.Grid /> Orders</div>
          <div className="pos-nav-item"><Icon.Receipt /> Kitchen <span className="badge">12</span></div>
          <div className="pos-nav-item"><Icon.Box /> Inventory</div>
          <div className="pos-nav-item"><Icon.Chart /> Analytics</div>
          <div className="pos-nav-item"><Icon.Users /> Customers</div>
          <div className="pos-nav-divider" />
          <div className="pos-nav-item"><Icon.Tag /> Promotions</div>
          <div className="pos-nav-item"><Icon.Settings /> Settings</div>
        </aside>
        <main className="pos-main">
          <div className="pos-search">
            <Icon.Search /> Search menu, customers, orders…
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)' }}>⌘K</span>
          </div>
          <div className="pos-categories">
            <div className="pos-cat active">All</div>
            <div className="pos-cat">Beverages</div>
            <div className="pos-cat">Breakfast</div>
            <div className="pos-cat">Mains</div>
            <div className="pos-cat">Desserts</div>
            <div className="pos-cat">Specials</div>
          </div>
          <div className="pos-items">
            {HERO_PREVIEW_ITEMS.map((it, i) => (
              <div className="pos-item" key={i}>
                <div className="thumb" style={{ background: it.bg }}>
                  <span className="fallback">{it.emoji}</span>
                  {it.img && <img src={it.img} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                </div>
                <div className="name">{it.name}</div>
                <div className="price">₹{it.price}</div>
                {it.stock && <div className={`stock ${it.stockLow ? 'low' : ''}`}>{it.stock}</div>}
              </div>
            ))}
          </div>
        </main>
        <aside className="pos-cart">
          <div className="pos-cart-head">
            <h3>Order #2847</h3>
            <span className="table">Table 12</span>
          </div>
          <div className="pos-cart-items">
            {HERO_CART.map((c, i) => (
              <div className="pos-cart-item" key={i} style={{ animation: 'none' }}>
                <div className="iname">{c.name}</div>
                <div className="iprice">₹{c.price * c.qty}</div>
                <div className="qty-row">
                  <div className="qty-btn">−</div>
                  <div className="q">{c.qty}</div>
                  <div className="qty-btn">+</div>
                  <div className="remove">Remove</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pos-cart-foot">
            <div className="row"><span>Subtotal</span><span>₹{HERO_CART_SUBTOTAL}</span></div>
            <div className="row"><span>GST (5%)</span><span>₹{Math.round(HERO_CART_SUBTOTAL * 0.05)}</span></div>
            <div className="row total"><span>Total</span><span>₹{Math.round(HERO_CART_SUBTOTAL * 1.05)}</span></div>
            <button className="pos-checkout">
              <Icon.Lightning size={14} /> Charge ₹{Math.round(HERO_CART_SUBTOTAL * 1.05)}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="section hero">
      <div className="hero-aurora" />
      <div className="container hero-inner">
        <div className="hero-badge">
          <span className="pill">New</span>
          <span>Omega Voice — take orders in 8 Indian languages</span>
          <Icon.Arrow size={12} />
        </div>

        <h1 className="h-display hero-title">
          The point of sale,<br />
          <span className="italic-accent">perfected</span> for restaurants.
        </h1>

        <p className="hero-sub">
          Built for India's busiest cafés and restaurants — unified online & offline orders,
          AI-powered inventory, and a terminal that never stops. Even when the internet does.
        </p>

        <div className="hero-cta">
          <a href="/get-started" className="btn btn-primary btn-lg">
            Book a demo <Icon.Arrow size={14} />
          </a>
          <a href="#product" className="btn btn-secondary btn-lg">
            See it in action
          </a>
        </div>

        <div className="hero-meta">
          <span><span className="check"><Icon.Check size={12} /></span> 7-min setup</span>
          <span><span className="check"><Icon.Check size={12} /></span> No contracts</span>
          <span><span className="check"><Icon.Check size={12} /></span> 99.99% uptime</span>
        </div>
      </div>

      <div className="container">
        <div className="hero-stage" id="hero-stage">
          <HeroPosPreview />
        </div>
      </div>
    </section>
  )
}

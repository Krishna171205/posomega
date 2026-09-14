'use client'
import { useMemo, useRef, useState } from 'react'
import { Icon } from './Icons'

const MENU: any[] = [
  { id: 1,  name: 'Masala Chai',       price: 60,  cat: 'Beverages',  emoji: '🍵', bg: 'linear-gradient(135deg, #C7A24B, #8C6E35)', stock: 24, img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80&auto=format&fit=crop' },
  { id: 2,  name: 'Cold Brew',         price: 180, cat: 'Beverages',  emoji: '☕', bg: 'linear-gradient(135deg, #3D2914, #1A0F08)', stock: 18, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop' },
  { id: 3,  name: 'Filter Coffee',     price: 80,  cat: 'Beverages',  emoji: '☕', bg: 'linear-gradient(135deg, #6B4226, #3D2412)', stock: 32, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop' },
  { id: 4,  name: 'Iced Latte',        price: 220, cat: 'Beverages',  emoji: '🧋', bg: 'linear-gradient(135deg, #D4AB7E, #8C6E4A)', stock: 14, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80&auto=format&fit=crop' },
  { id: 5,  name: 'Aloo Paratha',      price: 140, cat: 'Breakfast',  emoji: '🥞', bg: 'linear-gradient(135deg, #E8A87C, #C38D52)', stock: 12, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&auto=format&fit=crop' },
  { id: 6,  name: 'Avocado Toast',     price: 320, cat: 'Breakfast',  emoji: '🥑', bg: 'linear-gradient(135deg, #88A878, #5C7A4D)', stock: 8,  img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&auto=format&fit=crop' },
  { id: 7,  name: 'Eggs Benedict',     price: 380, cat: 'Breakfast',  emoji: '🍳', bg: 'linear-gradient(135deg, #F2C94C, #D4A332)', stock: 16, img: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&q=80&auto=format&fit=crop' },
  { id: 8,  name: 'Paneer Tikka',      price: 280, cat: 'Mains',      emoji: '🧀', bg: 'linear-gradient(135deg, #E84E1B, #B83A12)', stock: 22, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80&auto=format&fit=crop' },
  { id: 9,  name: 'Butter Chicken',    price: 420, cat: 'Mains',      emoji: '🍗', bg: 'linear-gradient(135deg, #D2691E, #8B4513)', stock: 19, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80&auto=format&fit=crop' },
  { id: 10, name: 'Veg Biryani',       price: 340, cat: 'Mains',      emoji: '🍚', bg: 'linear-gradient(135deg, #D4A574, #A07442)', stock: 26, img: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&q=80&auto=format&fit=crop' },
  { id: 11, name: 'Banoffee Pie',      price: 240, cat: 'Desserts',   emoji: '🥧', bg: 'linear-gradient(135deg, #E8C547, #C19F2F)', stock: 14, img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80&auto=format&fit=crop' },
  { id: 12, name: 'Tiramisu',          price: 280, cat: 'Desserts',   emoji: '🍰', bg: 'linear-gradient(135deg, #8B6F47, #5C4A30)', stock: 9,  img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80&auto=format&fit=crop' },
]

const CATEGORIES = ['All', 'Beverages', 'Breakfast', 'Mains', 'Desserts']

const INVENTORY: any[] = [
  { id: 1, name: 'Paneer (cubed)',   sku: 'ING-001', stock: 4.2, unit: 'kg', daysLeft: 0.8, status: 'critical', pred: '+38% Fri', emoji: '🧀', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=160&q=80&auto=format&fit=crop' },
  { id: 2, name: 'Cold brew coffee', sku: 'BEV-014', stock: 12, unit: 'L',  daysLeft: 1.5, status: 'low',      pred: '+12% Sat', emoji: '☕', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=160&q=80&auto=format&fit=crop' },
  { id: 3, name: 'Avocado',          sku: 'PRD-027', stock: 18, unit: 'pc', daysLeft: 2.1, status: 'low',      pred: 'Stable',   emoji: '🥑', img: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=160&q=80&auto=format&fit=crop' },
  { id: 4, name: 'Whole milk',       sku: 'BEV-002', stock: 42, unit: 'L',  daysLeft: 3.2, status: 'healthy',  pred: 'Stable',   emoji: '🥛', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=160&q=80&auto=format&fit=crop' },
  { id: 5, name: 'Bread (sourdough)',sku: 'BAK-005', stock: 28, unit: 'pc', daysLeft: 1.0, status: 'low',      pred: '+18% Sun', emoji: '🍞', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=160&q=80&auto=format&fit=crop' },
  { id: 6, name: 'Eggs',             sku: 'PRD-010', stock: 220,unit: 'pc', daysLeft: 4.0, status: 'healthy',  pred: 'Stable',   emoji: '🥚', img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=160&q=80&auto=format&fit=crop' },
  { id: 7, name: 'Tea leaves',       sku: 'BEV-022', stock: 6.5,unit: 'kg', daysLeft: 5.0, status: 'healthy',  pred: 'Stable',   emoji: '🍵', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=160&q=80&auto=format&fit=crop' },
]

function DemoSidebar({ mode, setMode }: any) {
  const items: any[] = [
    { id: 'orders',    label: 'Orders',     ic: <Icon.Grid />,    badge: null },
    { id: 'kitchen',   label: 'Kitchen',    ic: <Icon.Receipt />, badge: '12', disabled: true },
    { id: 'inventory', label: 'Inventory',  ic: <Icon.Box /> },
    { id: 'analytics', label: 'Analytics',  ic: <Icon.Chart /> },
    { id: 'customers', label: 'Customers',  ic: <Icon.Users />, disabled: true },
  ]
  const settings: any[] = [
    { id: 'promotions', label: 'Promotions', ic: <Icon.Tag />, disabled: true },
    { id: 'settings',   label: 'Settings',   ic: <Icon.Settings />, disabled: true },
  ]
  function navItem(it: any) {
    const active = mode === it.id
    return (
      <div
        key={it.id}
        className={`pos-nav-item ${active ? 'active' : ''}`}
        onClick={() => !it.disabled && setMode && setMode(it.id)}
        style={{ cursor: it.disabled ? 'default' : 'pointer', opacity: it.disabled ? 0.55 : 1 }}
      >
        {it.ic} {it.label} {it.badge && <span className="badge">{it.badge}</span>}
      </div>
    )
  }
  return (
    <aside className="pos-sidebar">
      <div className="brand"><span className="glyph">Ω</span> Omega</div>
      {items.map(navItem)}
      <div className="pos-nav-divider" />
      {settings.map(navItem)}
    </aside>
  )
}

function OrdersDemo({ setMode }: any) {
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState<any[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)
  const [payMethod, setPayMethod] = useState('upi')
  const [stockOverrides, setStockOverrides] = useState<any>({})
  const toastTimerRef = useRef<any>(null)

  const filtered = useMemo(() => cat === 'All' ? MENU : MENU.filter(m => m.cat === cat), [cat])

  function showToast(msg: string) {
    setToast(msg)
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 1900)
  }

  function addItem(item: any) {
    const currentStock = stockOverrides[item.id] ?? item.stock
    if (currentStock <= 0) { showToast('Out of stock'); return }
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id)
      if (existing) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { ...item, qty: 1 }]
    })
    setStockOverrides((s: any) => ({ ...s, [item.id]: currentStock - 1 }))
    showToast(`Added ${item.name}`)
  }
  function incQty(id: number) {
    const item = MENU.find(m => m.id === id)
    const currentStock = stockOverrides[id] ?? item.stock
    if (currentStock <= 0) { showToast('Out of stock'); return }
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p))
    setStockOverrides((s: any) => ({ ...s, [id]: currentStock - 1 }))
  }
  function decQty(id: number) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p).filter(p => p.qty > 0))
    setStockOverrides((s: any) => ({ ...s, [id]: (s[id] ?? MENU.find(m => m.id === id)!.stock) + 1 }))
  }
  function removeItem(id: number) {
    const item = cart.find(c => c.id === id)
    if (!item) return
    setStockOverrides((s: any) => ({ ...s, [id]: (s[id] ?? MENU.find(m => m.id === id)!.stock) + item.qty }))
    setCart(prev => prev.filter(p => p.id !== id))
  }
  function startCheckout() {
    if (cart.length === 0) return
    setPaying(true); setPaySuccess(false)
  }
  function completePayment() {
    setPaySuccess(true)
    setTimeout(() => {
      setPaying(false); setPaySuccess(false); setCart([]); setStockOverrides({})
      showToast('Order #2847 paid · receipt sent')
    }, 1400)
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  return (
    <div style={{ position: 'relative' }}>
      <div className="pos-demo">
        <div className="pos-chrome">
          <div className="traffic"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
          <div className="url">app.omega.in / orders · Connaught Place</div>
        </div>
        <div className="pos-body">
          <DemoSidebar mode="orders" setMode={setMode} />

          <main className="pos-main">
            <div className="pos-search">
              <Icon.Search /> Search menu, customers, orders…
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)' }}>⌘K</span>
            </div>
            <div className="pos-categories">
              {CATEGORIES.map(c => (
                <div key={c} className={`pos-cat ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</div>
              ))}
            </div>
            <div className="pos-items">
              {filtered.map((it: any) => {
                const currentStock = stockOverrides[it.id] ?? it.stock
                const isLow = currentStock <= 5
                return (
                  <div key={it.id} className="pos-item" onClick={() => addItem(it)}>
                    <div className="thumb" style={{ background: it.bg }}>
                      <span className="fallback">{it.emoji}</span>
                      {it.img && <img src={it.img} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                    </div>
                    <div className="name">{it.name}</div>
                    <div className="price">₹{it.price}</div>
                    {currentStock > 0 ? (
                      <div className={`stock ${isLow ? 'low' : ''}`}>{currentStock}</div>
                    ) : (
                      <div className="stock low">0</div>
                    )}
                  </div>
                )
              })}
            </div>
          </main>

          <aside className="pos-cart">
            <div className="pos-cart-head">
              <h3>Order #2847</h3>
              <span className="table">Table 12</span>
            </div>
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>
                    Empty order
                  </div>
                  Tap menu items on the left to start.
                </div>
              </div>
            ) : (
              <div className="pos-cart-items">
                {cart.map(c => (
                  <div className="pos-cart-item" key={c.id}>
                    <div className="iname">{c.name}</div>
                    <div className="iprice">₹{c.price * c.qty}</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => decQty(c.id)}>−</button>
                      <div className="q">{c.qty}</div>
                      <button className="qty-btn" onClick={() => incQty(c.id)}>+</button>
                      <span className="remove" onClick={() => removeItem(c.id)}>Remove</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pos-cart-foot">
              <div className="row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="row"><span>GST (5%)</span><span>₹{tax}</span></div>
              <div className="row total"><span>Total</span><span>₹{total}</span></div>
              <button className="pos-checkout" onClick={startCheckout} disabled={cart.length === 0}>
                <Icon.Lightning size={14} /> {cart.length === 0 ? 'Add items to charge' : `Charge ₹${total}`}
              </button>
            </div>
          </aside>
        </div>

        {paying && (
          <div className="pos-pay">
            <div className="pay-card">
              {!paySuccess ? (
                <>
                  <h3>Take payment</h3>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Order #2847 · Table 12</div>
                  <div className="amt">₹{total}</div>
                  <div className="pay-methods">
                    {[
                      { id: 'upi', label: 'UPI / QR', sub: 'GPay · PhonePe · Paytm' },
                      { id: 'card', label: 'Card', sub: 'Visa · Master · Amex' },
                      { id: 'cash', label: 'Cash', sub: 'Drawer opens' },
                      { id: 'wallet', label: 'Wallet', sub: 'Customer credit' },
                    ].map(m => (
                      <div key={m.id} className={`pay-method ${payMethod === m.id ? 'selected' : ''}`} onClick={() => setPayMethod(m.id)}>
                        <div style={{ fontWeight: 500 }}>{m.label}</div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                  <button className="pos-checkout" onClick={completePayment} style={{ marginTop: 0 }}>
                    Confirm payment · ₹{total}
                  </button>
                  <button onClick={() => setPaying(false)} style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', background: 'transparent' }}>Cancel</button>
                </>
              ) : (
                <>
                  <div className="pay-success">
                    <Icon.Check size={28} />
                  </div>
                  <h3>Paid</h3>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>Receipt sent to customer · KOT to kitchen</div>
                  <div className="amt" style={{ color: 'var(--sage)' }}>₹{total}</div>
                </>
              )}
            </div>
          </div>
        )}

        {toast && <div className="pos-toast"><Icon.Check size={14} className="check" /> {toast}</div>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '0 8px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em' }}>
          ● LIVE PROTOTYPE · CLICK ANY ITEM
        </div>
        <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
          <span><Icon.Lock size={11} /> ENCRYPTED IN TRANSIT &amp; AT REST</span>
          <span>DATA STORED IN INDIA</span>
        </div>
      </div>
    </div>
  )
}

function InventoryDemo({ setMode }: any) {
  const [items, setItems] = useState(INVENTORY)
  function reorder(id: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, stock: i.stock + 20, status: 'healthy', daysLeft: 4 } : i))
  }
  return (
    <div className="pos-demo">
      <div className="pos-chrome">
        <div className="traffic"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
        <div className="url">app.omega.in / inventory · 19 outlets · powered by Omega Intelligence</div>
      </div>
      <div className="pos-body">
        <DemoSidebar mode="inventory" setMode={setMode} />

        <main className="pos-main" style={{ gridColumn: 'span 2', padding: 24, gap: 18, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>STOCK ON HAND</div>
              <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>7 ingredients · 2 critical</div>
            </div>
            <button className="btn btn-primary btn-sm">
              <Icon.Sparkle size={12} /> Auto-reorder all
            </button>
          </div>

          <div className="inv-ai-banner">
            <span className="badge"><Icon.Sparkle size={9} /> Omega Intelligence</span>
            <span>
              <strong>Paneer demand spiking Friday.</strong> Based on weather, last 4 Fridays, and a local cricket match — order 6kg by Thursday 6pm to avoid 86s.
            </span>
          </div>

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--card-2)' }}>
            <div className="inv-row head">
              <div></div>
              <div>Item</div>
              <div>Stock</div>
              <div>Days left</div>
              <div>Forecast</div>
            </div>
            {items.map(i => (
              <div key={i.id} className="inv-row">
                <div className="ic" style={{ overflow: 'hidden', position: 'relative' }}>
                  <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 16 }}>{i.emoji}</span>
                  <img src={i.img} alt="" loading="lazy"
                       style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                       onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                <div>
                  <div className="nm">{i.name}</div>
                  <div className="sku">{i.sku}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{i.stock} {i.unit}</div>
                </div>
                <div>
                  <div className={`stock-bar ${i.status}`}><span className="pulse" />{i.daysLeft.toFixed(1)}d</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="inv-pred">{i.pred}</span>
                  {i.status !== 'healthy' && (
                    <button onClick={() => reorder(i.id)}
                            style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-soft)', padding: '3px 8px', borderRadius: 6, marginLeft: 'auto' }}>
                      REORDER
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

function AnalyticsDemo({ setMode }: any) {
  const sparkPath = 'M0,90 L25,85 L50,82 L75,70 L100,72 L125,55 L150,60 L175,45 L200,48 L225,32 L250,28 L275,38 L300,22 L325,18 L350,14 L375,20 L400,10'
  return (
    <div className="pos-demo">
      <div className="pos-chrome">
        <div className="traffic"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
        <div className="url">app.omega.in / analytics · Last 30 days</div>
      </div>
      <div className="pos-body">
        <DemoSidebar mode="analytics" setMode={setMode} />

        <main className="pos-main" style={{ gridColumn: 'span 2', padding: 24, gap: 16, overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>NET REVENUE · 30D</div>
              <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 4, lineHeight: 1 }}>
                ₹24.8L
                <span style={{ fontSize: 14, color: 'var(--sage)', fontFamily: 'var(--font-mono)', marginLeft: 12 }}>↑ 12.4%</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {['7d', '30d', '90d', '12m'].map((p, i) => (
                <div key={p} style={{
                  padding: '6px 12px', fontSize: 12,
                  background: i === 1 ? 'var(--ink)' : 'var(--card-2)',
                  color: i === 1 ? 'var(--bg)' : 'var(--ink)',
                  border: '1px solid', borderColor: i === 1 ? 'var(--ink)' : 'var(--line)',
                  borderRadius: 8, cursor: 'pointer',
                }}>{p}</div>
              ))}
            </div>
          </div>

          <div className="an-grid">
            <div className="an-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>Revenue trend</h4>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Daily, last 30 days</div>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--ink)' }}>● Dine-in</span>
                  <span style={{ color: 'var(--accent)' }}>● Delivery</span>
                </div>
              </div>
              <svg viewBox="0 0 400 180" className="an-chart" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="anG1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--ink)" stopOpacity="0.18" />
                    <stop offset="1" stopColor="var(--ink)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="anG2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.2" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map(g => <line key={g} x1="0" x2="400" y1={g * 45 + 22} y2={g * 45 + 22} stroke="var(--line)" strokeWidth="1" />)}
                <path d={sparkPath + ' L400,180 L0,180 Z'} fill="url(#anG1)" />
                <path d={sparkPath} stroke="var(--ink)" strokeWidth="2" fill="none" />
                <path d="M0,110 L25,105 L50,98 L75,88 L100,92 L125,75 L150,80 L175,68 L200,72 L225,55 L250,48 L275,58 L300,42 L325,38 L350,32 L375,40 L400,28 L400,180 L0,180 Z" fill="url(#anG2)" />
                <path d="M0,110 L25,105 L50,98 L75,88 L100,92 L125,75 L150,80 L175,68 L200,72 L225,55 L250,48 L275,58 L300,42 L325,38 L350,32 L375,40 L400,28" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <circle cx="400" cy="10" r="3.5" fill="var(--ink)" />
                <circle cx="400" cy="28" r="3.5" fill="var(--accent)" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                <span>Apr 23</span><span>Apr 30</span><span>May 7</span><span>May 14</span><span>May 21</span>
              </div>
            </div>

            <div className="an-right">
              <div className="an-mini">
                <div className="lbl">Orders</div>
                <div className="val">8,294 <span style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>↑ 8%</span></div>
              </div>
              <div className="an-mini">
                <div className="lbl">Avg ticket</div>
                <div className="val">₹298 <span style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>↑ 4%</span></div>
              </div>
              <div className="an-mini">
                <div className="lbl">Repeat visits</div>
                <div className="val">42% <span style={{ fontSize: 11, color: 'var(--sage)', fontFamily: 'var(--font-mono)' }}>↑ 6pt</span></div>
              </div>
            </div>

            <div className="an-card">
              <h4>Top items</h4>
              <div className="an-bars">
                {[
                  { l: 'Cold Brew', v: 92 },
                  { l: 'Paneer Tikka', v: 78 },
                  { l: 'Masala Chai', v: 66 },
                  { l: 'Aloo Paratha', v: 54 },
                  { l: 'Butter Chicken', v: 48 },
                ].map(b => (
                  <div className="an-bar-row" key={b.l}>
                    <span className="lbl">{b.l}</span>
                    <div className="track"><div className="fill" style={{ width: b.v + '%' }} /></div>
                    <span className="num">{b.v * 8}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="an-card">
              <h4>Channel mix</h4>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: 110, height: 110 }}>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="var(--line)" strokeWidth="14" />
                  <circle cx="50" cy="50" r="36" fill="none" stroke="var(--ink)" strokeWidth="14"
                          strokeDasharray="135 226" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="36" fill="none" stroke="var(--accent)" strokeWidth="14"
                          strokeDasharray="68 226" strokeDashoffset="-135" transform="rotate(-90 50 50)" />
                  <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="500" fill="currentColor">60%</text>
                  <text x="50" y="60" textAnchor="middle" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">DINE-IN</text>
                </svg>
                <div style={{ display: 'grid', gap: 8, fontSize: 12 }}>
                  <div><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--ink)', borderRadius: 2, marginRight: 8 }} />Dine-in · 60%</div>
                  <div><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent)', borderRadius: 2, marginRight: 8 }} />Delivery · 30%</div>
                  <div><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--line-2)', borderRadius: 2, marginRight: 8 }} />Takeaway · 10%</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export function InteractivePosDemo() {
  const [mode, setMode] = useState<'orders' | 'inventory' | 'analytics'>('orders')
  return (
    <section className="section" id="product">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Try it yourself</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            Click around. <span className="h-italic">It's the real thing.</span>
          </h2>
          <p className="lede" style={{ margin: '0 auto' }}>
            This is a working Omega terminal. Tap items, build orders, take payment.
            Then switch to inventory and analytics — same demo data, live.
          </p>
        </div>

        <div className="demo-modes">
          <div className={`demo-mode ${mode === 'orders' ? 'active' : ''}`} onClick={() => setMode('orders')}>Orders</div>
          <div className={`demo-mode ${mode === 'inventory' ? 'active' : ''}`} onClick={() => setMode('inventory')}>Inventory · AI</div>
          <div className={`demo-mode ${mode === 'analytics' ? 'active' : ''}`} onClick={() => setMode('analytics')}>Analytics</div>
        </div>

        {mode === 'orders' && <OrdersDemo setMode={setMode} />}
        {mode === 'inventory' && <InventoryDemo setMode={setMode} />}
        {mode === 'analytics' && <AnalyticsDemo setMode={setMode} />}
      </div>
    </section>
  )
}

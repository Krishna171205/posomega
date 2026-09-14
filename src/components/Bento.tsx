import { Icon } from './Icons'

export function Bento() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="sec-head">
          <div className="eyebrow"><span className="dot" />Everything in one box</div>
          <h2 className="h-section" style={{ marginTop: 16 }}>
            One system. Every<br />
            <span className="h-italic">surface</span> of your café.
          </h2>
          <p className="lede">
            From the first tap on the terminal to the last rupee in your bank — Omega replaces
            half a dozen apps with software that thinks like an operator.
          </p>
        </div>

        <div className="bento">
          {/* Tile 1: Offline-first reliability — wide */}
          <div className="bento-card" style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
            <div>
              <span className="label">Offline-first</span>
              <h3 style={{ fontSize: 32, marginTop: 14 }}>Never miss a sale —<br /><span className="h-italic">even when the internet won't.</span></h3>
              <p style={{ maxWidth: 360, marginTop: 12 }}>
                Every order, payment and KOT is queued locally and reconciled the second you're back.
                Billing, KOTs and cash never depend on the connection.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
              <div className="vis-wifi"><span /><span /><span /><span /></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>SYNC: QUEUED LOCALLY · 0 LOST</span>
            </div>
            <svg className="bento-vis" viewBox="0 0 600 400" style={{ opacity: 0.08 }}>
              <circle cx="500" cy="300" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="500" cy="300" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="500" cy="300" r="200" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Tile 2: Unified online + offline */}
          <div className="bento-card" style={{ gridColumn: 'span 3', gridRow: 'span 2', background: 'linear-gradient(135deg, var(--accent-soft), var(--card))' }}>
            <div style={{ maxWidth: 'calc(100% - 150px)' }}>
              <span className="label">Unified commerce</span>
              <h3 style={{ fontSize: 28, marginTop: 14 }}>Swiggy. Zomato.<br />Dine-in. One inventory.</h3>
              <p style={{ marginTop: 12 }}>
                Items sync everywhere in real time. Mark something 86'd at the counter and Omega pushes
                that state out to every aggregator.
              </p>
            </div>
            <div className="vis-channels">
              <div className="vis-channel"><span className="dot" />Swiggy · LIVE</div>
              <div className="vis-channel"><span className="dot" />Zomato · LIVE</div>
              <div className="vis-channel"><span className="dot" />Magicpin · LIVE</div>
              <div className="vis-channel"><span className="dot" />Dine-in · LIVE</div>
              <div className="vis-channel"><span className="dot" />WhatsApp · LIVE</div>
            </div>
          </div>

          {/* Tile 3: AI inventory forecasting */}
          <div className="bento-card" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <div>
              <span className="label"><Icon.Sparkle size={11} /> Omega Intelligence</span>
              <h3 style={{ marginTop: 14 }}>Predicts demand. Stops 86s.</h3>
              <p>
                Trained on your history, weather, and footfall. Tells you exactly how much paneer
                to prep before Friday rush.
              </p>
            </div>
            <div style={{ position: 'relative', height: 80 }}>
              <svg viewBox="0 0 240 80" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="forecastG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.4" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30 L180,20 L210,15 L240,10 L240,80 L0,80 Z" fill="url(#forecastG)" />
                <path d="M0,60 L30,50 L60,55 L90,40 L120,45 L150,30" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
                <path d="M150,30 L180,20 L210,15 L240,10" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                <circle cx="150" cy="30" r="3" fill="var(--accent)" />
              </svg>
              <div style={{ position: 'absolute', right: 0, top: 0, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)' }}>+38% FRI</div>
            </div>
          </div>

          {/* Tile 4: Payments — UPI / card / wallet */}
          <div className="bento-card" style={{ gridColumn: 'span 2' }}>
            <div>
              <span className="label">Payments</span>
              <h3 style={{ marginTop: 14, fontSize: 20 }}>UPI, card, wallet — one tap.</h3>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Visa', 'Amex'].map(p => (
                <span key={p} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 8px',
                  background: 'var(--card-2)', border: '1px solid var(--line)', borderRadius: 6,
                }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Tile 5: KDS */}
          <div className="bento-card" style={{ gridColumn: 'span 2' }}>
            <div>
              <span className="label">Kitchen Display</span>
              <h3 style={{ marginTop: 14, fontSize: 20 }}>KOTs that never get lost.</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                { t: '4:32', s: 'cooking' },
                { t: '4:35', s: 'new' },
                { t: '4:38', s: 'ready' },
              ].map((k, i) => (
                <div key={i} style={{
                  background: 'var(--card-2)', border: '1px solid var(--line)',
                  borderRadius: 8, padding: 8, fontFamily: 'var(--font-mono)', fontSize: 9,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>#{2840 + i}</span>
                    <span style={{ color: k.s === 'ready' ? 'var(--sage)' : k.s === 'new' ? 'var(--accent)' : 'var(--muted)' }}>● {k.s}</span>
                  </div>
                  <div style={{ color: 'var(--muted)' }}>2× Paneer<br />1× Naan</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tile 6: Multi-outlet */}
          <div className="bento-card" style={{ gridColumn: 'span 2' }}>
            <div>
              <span className="label">Multi-outlet</span>
              <h3 style={{ marginTop: 14, fontSize: 20 }}>One brain, every branch.</h3>
              <p style={{ fontSize: 13 }}>Push menus & prices to 200+ outlets in seconds.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>
                CP · GK1 · HSR · Bandra · Indiranagar +14
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink)', color: 'var(--bg)', display: 'grid', placeItems: 'center', fontSize: 11 }}>19</div>
            </div>
          </div>

          {/* Tile 7: Voice */}
          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div>
              <span className="label"><Icon.Sparkle size={11} /> Omega Voice</span>
              <h3 style={{ marginTop: 14 }}>Take orders by voice. In your language.</h3>
              <p>
                Hindi, Tamil, Bengali, Marathi, Kannada, Telugu, Gujarati, Punjabi. Captain speaks, Omega rings it up.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--accent)', color: 'white',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 0 0 8px color-mix(in oklab, var(--accent) 22%, transparent)',
              }}>
                <Icon.Mic size={16} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--muted)' }}>
                &quot;Do masala chai, ek paneer paratha…&quot;
              </div>
            </div>
          </div>

          {/* Tile 8: Customer CRM */}
          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div>
              <span className="label">Customer 360</span>
              <h3 style={{ marginTop: 14 }}>Remember every guest.</h3>
              <p>
                Auto-recognises returning customers by phone. Their last order, favourite table,
                allergies — surfaced before they sit down.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--aurora-3), var(--aurora-2))',
                display: 'grid', placeItems: 'center', fontWeight: 500,
              }}>AS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Aanya Singh · 12th visit</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Loves the cold brew · always table 7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { Icon } from './Icons'
import { Peek } from './crew/Peek'

/* Points condensed from src/content/features.ts → offline-mode ("What keeps working"). */
const POINTS = [
  { t: 'Order entry and bills', d: 'Full menu, modifiers, tables and tabs, with GST invoice numbering kept on the device.' },
  { t: 'KOTs still print', d: 'Tickets reach the kitchen over the local network. The KDS and the terminal talk to each other, not through the cloud.' },
  { t: 'Replays without duplicates', d: 'Every order gets its identifier on the device, so draining the queue twice gives the same result as once.' },
  { t: 'Honest about payments', d: 'Card and UPI genuinely need a connection. Omega marks them unavailable instead of appearing to accept them.' },
]

type Net = 'online' | 'offline' | 'syncing'

export function Offline() {
  const [net, setNet] = useState<Net>('online')
  const [queued, setQueued] = useState(0)
  const [rung, setRung] = useState(0)

  useEffect(() => {
    if (net !== 'syncing') return
    if (queued === 0) { setNet('online'); return }
    const t = window.setTimeout(() => setQueued(q => q - 1), 380)
    return () => window.clearTimeout(t)
  }, [net, queued])

  function ring() {
    setRung(r => r + 1)
    if (net !== 'online') setQueued(q => q + 1)
  }
  const offline = net === 'offline'

  return (
    <section className="section offline" id="offline">
      <div className="container offline-grid">
        <div>
          <div className="eyebrow"><span className="dot" />Offline-first</div>
          <h2 className="h-section offline-h">The internet drops.<br /><span className="h-italic">Billing doesn’t.</span></h2>
          <p className="lede offline-lede">
            Cloud POS has one failure mode, and it is the expensive one. Omega treats the device
            in your restaurant as the source of truth and the cloud as the place it syncs to.
          </p>
          <div className="offline-points">
            {POINTS.map(p => (
              <div key={p.t} className="offline-point">
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
          <a href="/features/offline-mode" className="text-link offline-link">How offline mode works <Icon.Arrow size={12} /></a>
        </div>

        <div className="panel dots-bg offline-vis has-peek">
          {/* Reacts to the simulator: calm online, sweating offline, relieved on sync. */}
          <Peek
            who="server"
            side="right"
            x="12%"
            mood={net === 'offline' ? 'worried' : net === 'syncing' ? 'wow' : 'happy'}
            say={net === 'offline' ? 'Wi-Fi’s down. Still billing!' : net === 'syncing' ? 'Catching up…' : rung > 0 ? 'All synced. Nothing lost.' : 'Go on, cut the internet.'}
          />
          <div className="win mock offline-win">
            <div className="win-bar">
              <div className="win-dots"><span /><span /><span /></div>
              <div className="win-title">Counter · Terminal 1</div>
            </div>
            <div className="win-pane ui sim">
              <div className={`sim-status ${net}`}>
                {offline ? <Icon.WifiOff size={15} /> : <Icon.Wifi size={15} />}
                <b>{net === 'online' ? 'Online · synced' : net === 'offline' ? 'Offline · billing locally' : 'Back online · syncing'}</b>
                <span className="ui-num sim-q">{queued} queued</span>
              </div>

              <div className="sim-grid">
                <div className="sim-tile"><span className="muted">Orders rung up</span><b className="ui-num">{rung}</b></div>
                <div className="sim-tile"><span className="muted">Waiting to sync</span><b className="ui-num">{queued}</b></div>
                <div className="sim-tile"><span className="muted">Lost</span><b className="ui-num">0</b></div>
              </div>

              <div className="sim-pay">
                <span className="sim-pay-l">Payment methods</span>
                {['Cash', 'UPI', 'Card'].map(m => {
                  const down = offline && m !== 'Cash'
                  return <span key={m} className={`tag ${down ? 'tag-bad' : 'tag-ok'}`}>{m}{down ? ' · needs network' : ''}</span>
                })}
              </div>

              <div className="sim-queue" aria-live="polite">
                {Array.from({ length: Math.min(queued, 6) }).map((_, i) => (
                  <span key={i} className="sim-chip ui-num">#{String(420 + rung - queued + i + 1).padStart(4, '0')}</span>
                ))}
                {queued > 6 && <span className="sim-chip ui-num">+{queued - 6}</span>}
                {queued === 0 && <span className="muted">Nothing waiting. Every order is on the server.</span>}
              </div>

              <div className="sim-actions">
                <button className="ui-btn" onClick={ring}><Icon.Plus size={13} /> Ring up an order</button>
                {net === 'online' && <button className="ui-btn ghost" onClick={() => setNet('offline')}><Icon.WifiOff size={13} /> Cut the internet</button>}
                {net === 'offline' && <button className="ui-btn ok" onClick={() => setNet('syncing')}><Icon.Wifi size={13} /> Reconnect</button>}
                {net === 'syncing' && <button className="ui-btn ghost" disabled>Draining queue…</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

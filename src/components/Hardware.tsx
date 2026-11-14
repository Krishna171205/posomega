import { Icon } from './Icons'

function TerminalSketch() {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <rect x="70" y="140" width="60" height="6" rx="2" fill="#2e3238" />
      <path d="M86 122h28l6 18H80z" fill="#232529" />
      <rect x="18" y="12" width="164" height="112" rx="10" fill="#101010" stroke="#383e47" />
      <rect x="26" y="20" width="148" height="96" rx="5" fill="#fafafb" />
      <rect x="32" y="26" width="30" height="84" rx="3" fill="#edeff3" />
      <rect x="68" y="26" width="64" height="6" rx="2" fill="#cad0d9" />
      {[0, 1, 2].map(r => [0, 1].map(c => <rect key={`${r}${c}`} x={68 + c * 33} y={38 + r * 24} width="29" height="20" rx="3" fill={r === 0 && c === 1 ? '#266df0' : '#e4e7ec'} />))}
      <rect x="138" y="26" width="30" height="84" rx="3" fill="#f3f4f6" />
      <rect x="141" y="98" width="24" height="8" rx="2" fill="#1c1d1f" />
    </svg>
  )
}
function MiniSketch() {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <rect x="66" y="8" width="68" height="144" rx="14" fill="#101010" stroke="#383e47" />
      <rect x="72" y="22" width="56" height="112" rx="4" fill="#fafafb" />
      <rect x="78" y="28" width="30" height="5" rx="2" fill="#cad0d9" />
      {[0, 1, 2, 3].map(r => <rect key={r} x="78" y={40 + r * 18} width="44" height="13" rx="3" fill={r === 1 ? '#266df0' : '#e4e7ec'} />)}
      <rect x="78" y="114" width="44" height="13" rx="3" fill="#1c1d1f" />
    </svg>
  )
}
function PrinterSketch() {
  return (
    <svg viewBox="0 0 200 160" aria-hidden="true">
      <path d="M62 24h76v62H62z" fill="#fffefa" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x="70" y={32 + i * 9} width={i === 4 ? 40 : 60 - i * 6} height="3" rx="1" fill="#b5bdc9" />)}
      <rect x="38" y="70" width="124" height="70" rx="12" fill="#101010" stroke="#383e47" />
      <rect x="50" y="80" width="100" height="10" rx="3" fill="#232529" />
      <circle cx="146" cy="124" r="4" fill="#0fc27b" />
    </svg>
  )
}

const ITEMS = [
  { name: 'Omega Terminal', tag: 'Counter', price: 'From ₹24,900', desc: 'Touchscreen counter terminal, configured with your menu before it ships.', drawing: <TerminalSketch /> },
  { name: 'Omega Mini', tag: 'Handheld', price: 'From ₹9,900', desc: 'Take orders at the table and fire them straight to the kitchen.', drawing: <MiniSketch /> },
  { name: 'Omega Print', tag: 'Kitchen', price: 'From ₹6,400', desc: 'Thermal printer for KOTs and bills.', drawing: <PrinterSketch /> },
]

export function Hardware() {
  return (
    <section className="section-tight" id="hardware">
      <div className="container">
        <div className="hw theme-dark">
          <div className="hw-head">
            <div>
              <div className="eyebrow"><span className="dot" />Hardware, optional</div>
              <h2 className="h-section hw-h">Counter hardware, <span className="h-italic">or bring your own.</span></h2>
              <p className="lede">
                Omega runs on any modern Android tablet, iPad or Windows terminal and pairs with standard
                thermal printers over Bluetooth, USB or network. If you would rather not source it, we sell a set.
              </p>
            </div>
            <a href="/get-started" className="btn btn-primary">Ask about hardware <Icon.Arrow size={12} /></a>
          </div>
          <div className="hw-grid">
            {ITEMS.map(h => (
              <div key={h.name} className="hw-card">
                <div className="hw-img">{h.drawing}</div>
                <div className="hw-row"><h3>{h.name}</h3><span className="tag">{h.tag}</span></div>
                <p>{h.desc}</p>
                <div className="hw-price mono">{h.price}</div>
              </div>
            ))}
          </div>
          <p className="hw-note">Free on Growth with a 12-month commitment: one Omega Terminal and one Omega Print per outlet, worth ₹31,300.</p>
        </div>
      </div>
    </section>
  )
}

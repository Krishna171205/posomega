export function Stats() {
  const stats = [
    { value: '4,200', unit: '+', label: 'Outlets running on Omega' },
    { value: '₹840', unit: 'Cr', label: 'Processed every month' },
    { value: '99.99', unit: '%', label: 'Uptime, including offline' },
    { value: '7', unit: 'min', label: 'Average time to go live' },
  ]
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value">
                {s.value}<span className="unit">{s.unit}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

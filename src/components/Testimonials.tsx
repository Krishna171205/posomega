export function Testimonials() {
  const items = [
    {
      quote: 'We replaced Petpooja, our payment gateway and three spreadsheets with Omega. Closing time at our HSR outlet dropped from 45 minutes to 7.',
      name: 'Anika Roy',
      role: 'Co-founder, Blue Tokai',
      avatar: 'AR',
      metric: '7 outlets · ₹4.2 Cr/mo',
      gradient: 'linear-gradient(135deg, #FFB199, #FF7AA2)',
    },
    {
      quote: "Omega Intelligence flagged a paneer shortage 36 hours before it happened. We've cut food waste by 22% and stopped 86'ing the top seller.",
      name: 'Karthik Iyer',
      role: 'Operations Head, Sly Granny',
      avatar: 'KI',
      metric: '22 outlets · 8 cities',
      gradient: 'linear-gradient(135deg, #B197FC, #8FD8FF)',
    },
    {
      quote: 'Setup was 11 minutes. The thing has been live for 14 months. Internet went down twice and we never noticed at the counter.',
      name: 'Priya Menon',
      role: 'Owner, Filtr Coffee Co.',
      avatar: 'PM',
      metric: '1 outlet · Bengaluru',
      gradient: 'linear-gradient(135deg, #FFE5A8, #FF8FA3)',
    },
  ]
  return (
    <section className="section" id="customers">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Operator-tested</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            Loved by the people <span className="h-italic">behind the counter.</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          {items.map((t, i) => (
            <div key={i} className="testimonial">
              <div className="quote">&quot;{t.quote}&quot;</div>
              <div className="author">
                <div className="avatar" style={{ background: t.gradient }}>{t.avatar}</div>
                <div>
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
              <div className="metric"><strong>{t.metric.split('·')[0].trim()}</strong>{t.metric.includes('·') && <strong>{t.metric.split('·')[1].trim()}</strong>}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

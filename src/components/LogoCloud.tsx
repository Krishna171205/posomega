export function LogoCloud() {
  const logos = ['Blue Tokai', 'Third Wave', 'Sly Granny', 'Big Chill', 'Indigo Deli', 'Kunafa World']
  return (
    <section className="container logos">
      <div className="logos-label">Powering 4,200+ outlets across India</div>
      <div className="logos-row">
        {logos.map((l, i) => (
          <div className="logo-item" key={i}>
            <span className="wordmark">{l}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

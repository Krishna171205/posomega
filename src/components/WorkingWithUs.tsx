import { Icon } from './Icons'

const POINTS = [
  {
    ic: <Icon.Users />,
    t: 'You talk to the people who build it',
    d: 'No tiered support queue and no ticket that gets escalated twice before it reaches someone technical. When something breaks at eight on a Saturday, the message reaches a person who can change the code.',
  },
  {
    ic: <Icon.Box />,
    t: 'We do the migration',
    d: 'Your menu, modifier groups, customers and inventory come off your current POS and into Omega before you switch over. Included in onboarding, not quoted separately as a project.',
  },
  {
    ic: <Icon.Sparkle />,
    t: 'Your requests shape what ships next',
    d: 'The roadmap is currently set by the cafes actually running Omega. That stops being true once there are hundreds of them, which is exactly why it is worth something now.',
  },
]

export function WorkingWithUs() {
  return (
    <section className="section" id="early">
      <div className="container">
        <div className="sec-head center">
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Where we are</div>
          <h2 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
            Early, and we would <span className="h-italic">rather tell you.</span>
          </h2>
          <p className="lede" style={{ margin: '0 auto', textAlign: 'center' }}>
            Omega runs real cafés today, and not many of them. We are onboarding a small number
            directly, with the people who build it. If you want a POS with two hundred logos on
            the homepage, that is not us yet.
          </p>
        </div>

        <div className="early-grid">
          {POINTS.map((p, i) => (
            <div className="bento-card early-card" key={i}>
              <span className="early-ic">{p.ic}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>

        <p className="early-note">
          What we have not finished: our SOC&nbsp;2 report is in progress and we will publish it
          when it is done. Anything else you want to know before trusting us with your till,
          ask directly at{' '}
          <a href="mailto:hello@unifiednexgrade.com">hello@unifiednexgrade.com</a>.
        </p>
      </div>
    </section>
  )
}

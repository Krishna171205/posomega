'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { api } from '@/lib/api'
import { Bl, DET, Head, Hl, Ln, Sh } from './crew/parts'

/*
 * The closing block, laid out like Petpooja's demo section: the form on the left, an
 * illustration on the right. Kept to one idea: a big black P, for PepperPe, holding a
 * restaurant owner on the phone in its bowl, while a bubble types out PepperPe's side of
 * the call (the same promise as the form: a call, with the menu already loaded). The form posts to the same lead endpoint as /get-started
 * (omegaservice stores it); if that fails the form stays filled in and says so, so the visitor can retry.
 */

type Lead = { name: string; cafeName: string; phone: string; city: string; email: string; role: string }
type Errors = Partial<Record<keyof Lead, string>>
const EMPTY: Lead = { name: '', cafeName: '', phone: '', city: '', email: '', role: '' }
const ROLES = ['Owner', 'Outlet manager', 'Operations head', 'Chef / Kitchen head', 'Admin / Accountant', 'Other']

function validate(f: Lead): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Enter your name.'
  if (!f.cafeName.trim()) e.cafeName = 'Enter your restaurant’s name.'
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = 'Enter a 10-digit mobile number.'
  if (!f.city.trim()) e.city = 'Enter your city.'
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email, or leave it empty.'
  if (!f.role) e.role = 'Pick your role.'
  return e
}

/** A fist round an upright phone, seen from the front: fingers wrapped across it from
    the knuckles on the right, the thumb up its side. Origin at the middle of the fist. */
function PhoneFist({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  const rows = [
    { y0: -12.8, y1: -6.4, tip: -9.4 },
    { y0: -6.4, y1: 0, tip: -10 },
    { y0: 0, y1: 6.4, tip: -9.6 },
    { y0: 6.4, y1: 12, tip: -8 },
  ]
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g transform="rotate(-24 1 -12)">
        <Sh w={1.3} d="M-1.6 -10 V-22.4 A2.5 2.5 0 0 1 3.4 -22.4 V-10 Z" />
      </g>
      <Sh w={1.5} d="M-1.5 -13.6 C6 -15.6 12.6 -11.6 13 -3.6 C13.4 4.6 12.2 12.4 5.6 15 L-1.5 15 Z" />
      {rows.map(f => {
        const k = (f.y1 - f.y0) / 2
        return <Sh key={f.y0} w={1.3} d={`M4 ${f.y0} H${f.tip + k} A${k} ${k} 0 0 0 ${f.tip + k} ${f.y1} H4`} />
      })}
    </g>
  )
}

/**
 * The P: a geometric letter, its bowl a D drawn round a circle (centre 330,248, outer 150,
 * counter 108, stroke 42) on a straight stem (x 180 to 222) that runs on below the bowl.
 */
const P_OUTER = 'M180 98 H330 A150 150 0 0 1 330 398 H222 V518 H180 Z'
const P_COUNTER = 'M222 140 H330 A108 108 0 0 1 330 356 H222 Z'

/** PepperPe's side of the call, a line at a time: the promise the form makes */
const CALL = ['Hi! It\u2019s PepperPe calling.', 'Your menu is already loaded.', 'Shall we set up your counter?']
/** The owner's answer to the last line */
const REPLY = 'Yes, let\u2019s do it!'

type Phase = 'talk' | 'done'

/**
 * PepperPe's bubble, styled as a call: an avatar, a voice waveform that moves while it
 * speaks, and a timer. Three dots, then the line types out and holds; the scene (its
 * parent) is told when a line starts and when it is done, so the owner can react and
 * answer. Its own component, so the typing never redraws the illustration.
 */
function CallBubble({ live, calm, line, onPhase, onNext }: {
  live: boolean; calm: boolean; line: number; onPhase: (p: Phase) => void; onNext: () => void
}) {
  // characters shown of which line; -1 while the dots show. Tied to the line, so a new
  // line starts from the dots in the same render it arrives in.
  const [st, setSt] = useState({ line: 0, n: -1 })
  const typed = st.line === line ? st.n : -1
  const [secs, setSecs] = useState(0)
  const text = CALL[line]

  useEffect(() => {
    if (!live || calm) return
    const id = window.setInterval(() => setSecs(s => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [live, calm])

  useEffect(() => {
    if (!live || calm) return
    let t: number
    if (typed < 0) { onPhase('talk'); t = window.setTimeout(() => setSt({ line, n: 0 }), 900) }
    else if (typed < text.length) t = window.setTimeout(() => setSt({ line, n: typed + 1 }), 34)
    else { onPhase('done'); t = window.setTimeout(onNext, line === CALL.length - 1 ? 3600 : 2400) }
    return () => window.clearTimeout(t)
  }, [live, calm, typed, text, line, onPhase, onNext])

  const shown = calm ? text.length : typed
  const talking = !calm && live && shown < text.length
  const clock = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`
  return (
    <div className={`cs-bubble ${talking ? 'is-talking' : ''}`}>
      <div className="cs-bubble-h">
        <span className="cs-av">P</span>
        <b>PepperPe</b>
        <span className="cs-voice" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span className="ui-num">{calm ? 'On call' : clock}</span>
      </div>
      <p className="cs-bubble-t">
        <span className="cs-ghost">{text}</span>
        {shown < 0
          ? <span className="cs-dots"><i /><i /><i /></span>
          : <span>{text.slice(0, shown)}{talking && <i className="cs-caret" />}</span>}
      </p>
    </div>
  )
}

/**
 * The owner's clothes, in head space (neck at y 42), drawn like the crew's: a white shirt
 * under a black apron, its straps over the shoulders, a pocket with a pen and a small P
 * stitched on the bib. A café owner, ready for service.
 */
function OwnerTorso() {
  return (
    <g>
      <Sh d="M-50 112 C-48 64 -30 42 0 42 C30 42 48 64 50 112Z" />
      <Ln w={DET} d="M-35 76 C-36 88 -37 100 -38 112 M35 76 C36 88 37 100 38 112" />
      <Bl d="M-25 64 L-15 43.5 L-9.5 44.5 L-19 64 Z" />
      <Bl d="M25 64 L15 43.5 L9.5 44.5 L19 64 Z" />
      <Bl d="M-26 63 Q0 59 26 63 L29 112 L-29 112 Z" />
      <Hl w={1.2} d="M5 79 H19 V91 Q12 93.5 5 91 Z" />
      <path className="fill" d="M14.2 70.5 h2.4 v9 h-2.4 Z" fill="#fff" />
      <Hl w={1.4} d="M-15 90 V77 H-10.5 A3.6 3.6 0 0 1 -10.5 84.2 H-15" />
    </g>
  )
}
/** The open collar, over the neck */
function OwnerCollar() {
  return (
    <g>
      <Sh w={DET} d="M-9 41 L-1 49.5 L-4 56.5 L-14 47 Z" />
      <Sh w={DET} d="M9 41 L1 49.5 L4 56.5 L14 47 Z" />
    </g>
  )
}

/** A thumbs-up, seen from the side: the thumb up, four fingers curled under it, a white
    sleeve below. Origin at the middle of the fist. */
function ThumbsUp() {
  return (
    <g>
      <Sh w={1.5} d="M-5 21 L-6.5 52 L14 52 L13 21 Z" />
      <Ln w={1.1} d="M-5.6 31 L13.4 31" />
      <Sh w={1.5} d="M-.5 -8 C-2.6 -16 -1.8 -25.5 3.2 -27.6 C7.4 -29.2 9.4 -25.8 8.4 -20.6 L7 -8 Z" />
      <Sh w={1.5} d="M-4 -9.5 H11 C15 -9.5 16.4 -5.6 15.6 -1.4 L14.4 18 C14.2 22 11.4 24.4 7.4 24.4 H-2.6 C-6.8 24.4 -9 21.4 -9 17.4 V-3.4 C-9 -7.2 -7 -9.5 -4 -9.5 Z" />
      {[-4.2, 2.6, 9.4, 16.2].map(y => (
        <Sh key={y} w={1.3} d={`M-13 ${y - 3.2} H1.6 A3.3 3.3 0 0 1 1.6 ${y + 3.4} H-13 A3.3 3.3 0 0 1 -13 ${y - 3.2} Z`} />
      ))}
    </g>
  )
}

/**
 * The call, inside a black P. Ink characters from crew/parts, so they match the rest of
 * the page. The owner sits in the P's bowl under a pendant lamp, listens, looks impressed
 * when the menu is already loaded, and answers the last line.
 */
function CallScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [calm, setCalm] = useState(false)
  const [line, setLine] = useState(0)
  const [phase, setPhase] = useState<Phase>('talk')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCalm(true); return }
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const onPhase = useCallback((p: Phase) => setPhase(p), [])
  const onNext = useCallback(() => setLine(l => (l + 1) % CALL.length), [])

  const done = phase === 'done'
  const mood = line === 1 && done ? 'wow' : 'happy'
  const replying = !calm && line === CALL.length - 1 && done
  return (
    <div className={`cta-art ${live ? 'is-live' : ''} ${phase === 'talk' && live ? 'is-talking' : ''} ${replying ? 'is-replying' : ''}`} ref={ref} aria-hidden="true">
      <div className="cs-stage">
        <svg className="cs-art" viewBox="170 90 320 436" role="presentation">
          <defs>
            <linearGradient id="cs-om" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#383e47" />
              <stop offset=".55" stopColor="#1c1d1f" />
              <stop offset="1" stopColor="#101010" />
            </linearGradient>
            <radialGradient id="cs-glow">
              <stop offset="0" stopColor="#ffd666" stopOpacity=".55" />
              <stop offset="1" stopColor="#ffd666" stopOpacity="0" />
            </radialGradient>
            <pattern id="cs-paper" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="#d3d8df" />
            </pattern>
            <clipPath id="cs-bubble"><path d={P_COUNTER} /></clipPath>
          </defs>

          <path className="cs-mark" fill="url(#cs-om)" fillRule="evenodd" d={`${P_OUTER} ${P_COUNTER}`} />

          {/* The bowl: dot paper, a soft disc, a pendant lamp, and the owner picking up */}
          <g clipPath="url(#cs-bubble)">
            <path d={P_COUNTER} fill="#fff" />
            <path d={P_COUNTER} fill="url(#cs-paper)" opacity=".7" />
            <circle className="cs-disc" cx="316" cy="282" r="78" />
            <g className="cs-lamp">
              <ellipse className="cs-lamp-glow" cx="258" cy="196" rx="34" ry="26" fill="url(#cs-glow)" />
              <path d="M258 140 V170" stroke="currentColor" strokeWidth="1.4" />
              <path d="M244 184 Q244 170 258 170 Q272 170 272 184 Z" fill="currentColor" />
              <path d="M253 184 a5 4 0 0 0 10 0" fill="#ffd666" />
            </g>
            <g className="cs-caller">
              {/* lifted a little, so the apron's pocket and stitched P show above the bowl's edge */}
              <g transform="translate(0 -12)">
              <g transform="translate(318 252) rotate(4) scale(1.2)">
                <OwnerTorso />
                <Head who="owner" mood={mood} />
                <OwnerCollar />
              </g>
              {/* the phone against the ear */}
              <g className="cs-phone">
                <rect x="345" y="212" width="10.5" height="66" rx="3.6" fill="currentColor" transform="rotate(6 350 245)" />
                <rect x="347.3" y="217" width="2" height="15" rx="1" fill="#fff" opacity=".45" transform="rotate(6 350 245)" />
              </g>
              {/* forearm up from in front of the chest, the white sleeve rolled to the elbow */}
              <Sh w={1.5} d="M357 266 L375 262 C379 281 382 300 384 322 L362 324 C362 304 360 285 357 266 Z" />
              <Sh w={1.5} d="M361 342 L388 339 C389 348 389.5 357 389.5 368 L362.5 368 C362.5 359 362 350 361 342 Z" />
              <Sh w={1.5} d="M359.5 320 L386.5 317 L388.5 341 L361 344 Z" />
              <Ln w={1.1} d="M360.4 331.6 L387.6 328.6" />
              {/* the hand: a fist round the phone, thumb up its side */}
              <PhoneFist x={356} y={254} r={6} s={1.02} />
              </g>
            </g>
            {/* the free hand comes up for "yes" */}
            <g className="cs-thumb">
              <g transform="translate(268 318) rotate(-8) scale(1.1)"><ThumbsUp /></g>
            </g>
          </g>
          {/* sound from the phone while PepperPe speaks */}
          <g className="cs-waves" fill="none" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round">
            <path d="M381 220 Q387 228 382 237" />
            <path d="M389 213 Q398 227 391 242" />
          </g>
        </svg>
        <CallBubble live={live} calm={calm} line={line} onPhase={onPhase} onNext={onNext} />
        {replying && <div className="cs-reply">{REPLY}</div>}
      </div>
    </div>
  )
}

function Field({ id, label, hint, value, error, onChange, className = '', ...rest }: {
  id: keyof Lead; label: string; hint?: string; value: string; error?: string; onChange: (v: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'id'>) {
  return (
    <label className={`cta-field ${error ? 'has-error' : ''} ${className}`}>
      <span className="cta-label">{label}{hint && <span> {hint}</span>}</span>
      <span className="cta-input">
        {id === 'phone' && <span className="cta-cc">+91</span>}
        <input
          name={id}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `cta-err-${id}` : undefined}
          onChange={e => onChange(e.target.value)}
          {...rest}
        />
      </span>
      {error && <span className="cta-err" id={`cta-err-${id}`} role="alert">{error}</span>}
    </label>
  )
}

export function CTA() {
  const [form, setForm] = useState<Lead>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)

  const set = (k: keyof Lead) => (v: string) => {
    setForm(f => ({ ...f, [k]: k === 'phone' ? v.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').slice(0, 10) : v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return
    setBusy(true)
    setFailed(false)
    try {
      await api.post('/api/v1/leads', { ...form, source: 'home-cta' })
      setDone(true)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section cta" id="cta" aria-labelledby="cta-title">
      <div className="container cta-wrap">
        <div className="cta-form-side" data-rv>
          {!done ? (
            <>
              <h2 id="cta-title" className="cta-h">Book a free demo</h2>
              <p className="cta-lede">Leave your number. We will call within 24 hours, with your menu already loaded.</p>
              <form className="cta-form" onSubmit={submit} noValidate>
                <div className="cta-grid">
                  <Field id="name" label="Your name" value={form.name} error={errors.name} onChange={set('name')} autoComplete="name" />
                  <Field id="cafeName" label="Restaurant" value={form.cafeName} error={errors.cafeName} onChange={set('cafeName')} autoComplete="organization" />
                  <Field id="phone" label="Phone" value={form.phone} error={errors.phone} onChange={set('phone')} inputMode="numeric" autoComplete="tel-national" />
                  <Field id="city" label="City" value={form.city} error={errors.city} onChange={set('city')} autoComplete="address-level2" />
                  <Field id="email" label="Email" hint="(optional)" className="cta-wide" value={form.email} error={errors.email} onChange={set('email')} type="email" inputMode="email" autoComplete="email" />
                </div>
                <fieldset className={`cta-roles ${errors.role ? 'has-error' : ''}`} aria-describedby={errors.role ? 'cta-err-role' : undefined}>
                  <legend className="cta-label">Your role at the restaurant</legend>
                  <div className="cta-chips">
                    {ROLES.map(r => (
                      <label key={r} className="cta-chip">
                        <input type="radio" name="role" value={r} checked={form.role === r} onChange={() => set('role')(r)} />
                        <span>{r}</span>
                      </label>
                    ))}
                  </div>
                  {errors.role && <span className="cta-err" id="cta-err-role" role="alert">{errors.role}</span>}
                </fieldset>
                <div className="cta-submit-row">
                  <button type="submit" className="btn btn-blue cta-submit" disabled={busy}>
                    {busy ? 'Sending…' : <>Book my demo <Icon.Arrow size={13} /></>}
                  </button>
                  {failed && <p className="cta-err" role="alert">That did not go through. Check your connection and try again.</p>}
                  <p className="cta-fine">Only used to set up your demo. <a href="/privacy">Privacy</a></p>
                </div>
              </form>
            </>
          ) : (
            <div className="cta-done" role="status">
              <span className="cta-done-mark"><Icon.Check size={22} /></span>
              <h2 id="cta-title" className="cta-h">Thanks, {form.name.split(' ')[0]}.</h2>
              <p className="cta-lede">We will call you on +91 {form.phone} within 24 hours to set up the demo for {form.cafeName}.</p>
            </div>
          )}
        </div>
        <CallScene />
      </div>
    </section>
  )
}

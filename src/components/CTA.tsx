'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'
import { api } from '@/lib/api'
import { Bl, Head, Hl, Ln, Sh, ShR, Torso } from './crew/parts'

/*
 * The closing block, laid out like Petpooja's demo section: the form on the left, an
 * illustration on the right. Here that is a big black Omega with the call happening
 * inside it: a restaurant owner picking up in the bowl of the Ω, our agent on a
 * headset in front of it. Kept to those two. The form posts to the same lead endpoint as /get-started
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

/** Fingers hooked over an edge at y=0: the back of the hand behind it, four slim
    fingertips over it, the middle one longest. */
function EdgeHand({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Sh w={1.5} d="M-10 .5 C-10.5 -6 -6 -10.2 0 -10.2 C6 -10.2 10 -6.5 10 .5 Z" />
      <Ln w={1.1} d="M-5 -6.6 Q-4.3 -5.5 -4.7 -4.3 M0 -7.6 Q.8 -6.4 .4 -5.2 M5 -6.8 Q5.6 -5.7 5.2 -4.5" />
      <Sh w={1.3} d="M-9.6 -1 H-5 V5 A2.3 2.3 0 0 1 -9.6 5 Z" />
      <Sh w={1.3} d="M-4.8 -1 H-.2 V6.6 A2.3 2.3 0 0 1 -4.8 6.6 Z" />
      <Sh w={1.3} d="M0 -1 H4.6 V6.2 A2.3 2.3 0 0 1 0 6.2 Z" />
      <Sh w={1.3} d="M4.8 -1 H9.2 V4.6 A2.2 2.2 0 0 1 4.8 4.6 Z" />
    </g>
  )
}

/** An open hand, palm out, wrist at the origin and fingers up: four slim fingers fanned
    a little, the thumb out to the side. The palm is filled over the finger roots, with
    strokes only down its sides, so the silhouette stays one clean shape. */
function OpenHand({ x, y, r = 0, s = 1, flip = false }: { x: number; y: number; r?: number; s?: number; flip?: boolean }) {
  const fingers = [
    { cx: -5.5, top: -24.6, a: -8 },
    { cx: -1.8, top: -27, a: -2 },
    { cx: 1.9, top: -25.6, a: 4 },
    { cx: 5.5, top: -22, a: 11 },
  ]
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}>
      {fingers.map(f => (
        <g key={f.cx} transform={`rotate(${f.a} ${f.cx} -12)`}>
          <Sh w={1.3} d={`M${f.cx - 1.85} -10.5 V${f.top + 1.85} A1.85 1.85 0 0 1 ${f.cx + 1.85} ${f.top + 1.85} V-10.5 Z`} />
        </g>
      ))}
      <g transform="rotate(-42 -6.8 -5.5)">
        <Sh w={1.3} d="M-8.9 -4 V-14.6 A2.1 2.1 0 0 1 -4.7 -14.6 V-4 Z" />
      </g>
      <path d="M-7.4 .6 C-8 -4.6 -8.3 -9 -7.7 -13.4 L7.6 -13.8 C8.1 -9 8 -4.6 7.4 .6 Z" fill="#fff" />
      <Ln w={1.3} d="M-7.4 .6 C-8 -4.6 -8.3 -9 -7.9 -12.6 M7.4 .6 C8 -4.6 8.1 -9 7.6 -13.2" />
      <Ln w={1} d="M-3.6 -6.4 Q0 -4.2 3.8 -6.9" />
    </g>
  )
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

/** The call, inside a black Ω. Ink characters from crew/parts, so they match the rest of the page. */
function CallScene() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-live', e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="cta-art" ref={ref} aria-hidden="true">
      <svg className="cs-art" viewBox="136 56 540 425" role="presentation">
        <defs>
          <linearGradient id="cs-om" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#383e47" />
            <stop offset=".55" stopColor="#1c1d1f" />
            <stop offset="1" stopColor="#101010" />
          </linearGradient>
          <clipPath id="cs-bubble"><circle cx="330" cy="248" r="108" /></clipPath>
        </defs>

        {/* A soft disc behind the scene, as Petpooja's demo art has, in our blue */}
        <circle className="cs-backdrop" cx="352" cy="262" r="214" />

        {/* Small things around the call, drawn like the crew: the demo going in the calendar,
            the confirmation mail, and a printed bill (what PepperPe does once it is set up) */}
        <g transform="translate(184 110) rotate(-10) scale(1.6)">
          <g className="cs-float">
            <rect x="-24" y="-20" width="48" height="44" rx="7" className="cs-obj" />
            <path d="M-24 -13 a7 7 0 0 1 7 -7 h34 a7 7 0 0 1 7 7 v6 h-48 z" fill="currentColor" />
            <rect x="-13" y="-25" width="4.5" height="10" rx="2.2" className="cs-obj" />
            <rect x="8.5" y="-25" width="4.5" height="10" rx="2.2" className="cs-obj" />
            {[-14, -2, 10].flatMap(x => [5, 15].map(y => <rect key={`${x}${y}`} x={x} y={y - 3} width="6" height="5" rx="1.5" fill="currentColor" opacity=".18" />))}
            <circle cx="13" cy="14" r="7" className="cs-tick" />
            <path d="M9.6 14 l2.4 2.4 l4.4 -4.6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g transform="translate(606 410) rotate(9) scale(1.5)">
          <g className="cs-float" style={{ animationDelay: '-1.3s' }}>
            <rect x="-26" y="-17" width="52" height="34" rx="5" className="cs-obj" />
            <path d="M-24 -14 L0 4 L24 -14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="24" cy="-16" r="6" className="cs-tick" />
          </g>
        </g>
        <g transform="translate(636 300) rotate(-7) scale(1.5)">
          <g className="cs-float" style={{ animationDelay: '-2.6s' }}>
            <path d="M-16 -26 H16 V22 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 l-4 4 l-4 -4 Z" className="cs-obj" />
            {[-17, -10, -3].map(y => <path key={y} d={`M-9 ${y} H${y === -10 ? 4 : 9}`} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />)}
            <path d="M-9 8 H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" />
            <path d="M-9 15 H1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>

        {/* The PepperPe: an even ring (outer 172, inner 130, centre 330,248). At the base the
            ring is cut straight down at x 275 and 385 and its outer circle runs into flat
            feet as thick as the ring, like the plain geometric glyph */}
        <path
          className="cs-omega"
          fill="url(#cs-om)"
          d="M140 411 H275 V366 A130 130 0 1 1 385 366 V411 H520 V366 H455.1 A172 172 0 1 0 204.9 366 H140 Z"
        />

        {/* The bowl: a restaurant owner picking up */}
        <circle cx="330" cy="248" r="108" fill="#fff" />
        <g clipPath="url(#cs-bubble)">
          <g className="cs-caller">
            <g transform="translate(318 252) rotate(4) scale(1.2)">
              <Torso who="owner" bottom={112} w={50} />
              <Head who="owner" mood="happy" />
            </g>
            {/* the phone against the ear */}
            <g className="cs-phone">
              <rect x="345" y="212" width="10.5" height="66" rx="3.6" fill="currentColor" transform="rotate(6 350 245)" />
              <rect x="347.3" y="217" width="2" height="15" rx="1" fill="#fff" opacity=".45" transform="rotate(6 350 245)" />
            </g>
            {/* forearm up from in front of the chest, in the same black shirt */}
            <Bl d="M356 268 L375 264 C381 288 385 322 387 362 L361 364 C363 330 361 296 356 268 Z" />
            <Hl w={1.3} d="M359.5 286 C362 310 363 336 362 360" />
            <Hl w={1.3} d="M357 273.5 L375.5 269.5" />
            {/* the hand: a fist round the phone, thumb up its side */}
            <PhoneFist x={356} y={254} r={6} s={1.02} />
          </g>
        </g>
        <circle cx="330" cy="248" r="108" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <g className="cs-waves" fill="none" stroke="var(--blue-500)" strokeWidth="2" strokeLinecap="round">
          <path d="M381 220 Q387 228 382 237" />
          <path d="M389 213 Q398 227 391 242" />
        </g>

        {/* The call: dots flowing from the caller's phone, over the ring, to her headset */}
        <path className="cs-link" d="M402 214 Q446 126 540 124" />
        <circle className="cs-link-ping" cx="543" cy="123" r="7" />

        {/* Our agent, on a headset, at a laptop with an Ω on the lid. Drawn around
            x 396-566, y 305-506; the wrapper puts her at the PepperPe's top right, clear of
            the ring (its right edge is x 502). */}
        <g transform="translate(203.2 -170) scale(.8)">
        <g className="cs-agent">
          <g transform="translate(474 356) scale(1.16)">
            <Torso who="captain" bottom={100} w={52} />
            <g className="cs-agent-head">
              <Head who="captain" mood="happy" />
              {/* headset: a white band so it reads over the hair, cups, a boom mic */}
              <Sh w={1.5} d="M-31.5 1 C-36 -47 36 -47 31.5 1 L27.5 1 C31.5 -41 -31.5 -41 -27.5 1 Z" />
              <ShR x={-35.5} y={-5.5} width={9.5} height={16} rx={4.5} w={1.6} />
              <ShR x={26} y={-5.5} width={9.5} height={16} rx={4.5} w={1.6} />
              <Ln w={1.5} d="M-31 9.5 C-31 21 -24 27.5 -15 27" />
              <rect className="cs-mic" x="-17" y="24" width="8" height="6" rx="3" fill="currentColor" />
            </g>
          </g>
          {/* her right hand up in a wave, the sleeve down behind the laptop */}
          <g className="cs-wave-hand"><OpenHand x={525} y={392} r={13} s={1.32} /></g>
          <Sh w={1.5} d="M510.5 396.5 L530.5 393.5 C533 404 534.5 413 535 424 L514.5 424 C514 414 512.5 405 510.5 396.5 Z" />
          <Ln w={1.1} d="M511.6 401 L531.4 398" />

          <rect x="410" y="422" width="128" height="78" rx="9" className="cs-lidbox" />
          <text x="474" y="470" textAnchor="middle" className="cs-lid">Ω</text>
          <ShR x={396} y={498} width={156} height={8} rx={4} w={1.6} />
          {/* her left hand on the keys, fingertips over the top of the lid */}
          <g className="cs-type-a"><EdgeHand x={446} y={422} s={1.3} /></g>
        </g>
        </g>
      </svg>
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

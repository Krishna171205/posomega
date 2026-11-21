'use client'
import { useId, useState, type FocusEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import '@/styles/sections/auth.css'
import { DiningScene } from './DiningScene'

/*
 * Omega POS sign in and sign up, in the posomega.com look: the form on a white card
 * (labels over boxed fields, a blue button that stays pale until the form can be
 * sent),
 * and a pixel band along the bottom where a little dining scene plays.
 *
 * `decor` stands on the band. Pass a function to have it follow the form: it
 * gets an AuthState (which field has focus, whether the password is shown, busy,
 * error), so characters peeking over the card can watch, cover their eyes for the
 * password, or look worried at a mistake.
 *
 * Both are presentational: they own the form state and the validation and hand the
 * values to `onSubmit`, which is the app's own call. Throw (or reject) from it with a
 * message to show that message under the form; navigate away from it on success.
 */

export type AuthField = 'email' | 'password' | 'restaurant' | 'name' | 'phone' | 'city'
export type AuthState = {
  /** The field being filled in, if any */
  focus: AuthField | null
  /** The password is shown as text */
  showPassword: boolean
  busy: boolean
  error: boolean
  /** Anything has been typed yet */
  filled: boolean
}
export type Decor = ReactNode | ((state: AuthState) => ReactNode)

const EMAIL = /^\S+@\S+\.\S+$/
const message = (err: unknown, fallback: string) => (err instanceof Error && err.message ? err.message : fallback)

/**
 * Pixel grass along the bottom, after CofounderOS's login footer: fine square cells in
 * a few of the site's blues, a mostly flat top with tufts and loose bits poking up. Drawn once from a
 * fixed seed (the same on every load) and cropped at the sides, never squashed.
 */
const G_COLS = 480, G_ROWS = 11, G_CELL = 4, G_TOP = 4
const G_TONES = ['#d6e8fc', '#bcd8f8', '#9fc6f4', '#80b3f0', '#5f9deb', '#3d86e4']   // the site's blues
const GRASS = (() => {
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const cells: { x: number; y: number; c: string }[] = []
  for (let x = 0; x < G_COLS; x++) {
    const top = G_TOP + (rnd() < 0.3 ? 1 : 0)
    for (let y = top; y < G_ROWS; y++) {
      const t = Math.min(G_TONES.length - 1, Math.max(0, Math.round(1.2 + (y - top) * 0.45 + (rnd() - 0.5) * 2.4)))
      cells.push({ x, y, c: G_TONES[t] })
    }
    const r = rnd()
    if (r < 0.22) for (let k = 1; k <= 1 + Math.floor(rnd() * 3); k++) cells.push({ x, y: top - k, c: G_TONES[2 + Math.floor(rnd() * 3)] })   // a tuft
    else if (r < 0.3) cells.push({ x, y: top - 2 - Math.floor(rnd() * 3), c: G_TONES[1 + Math.floor(rnd() * 2)] })                      // a loose bit
  }
  return cells
})()
function Grass() {
  return (
    <svg className="au-grass" viewBox={`0 0 ${G_COLS * G_CELL} ${G_ROWS * G_CELL}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" shapeRendering="crispEdges">
      {GRASS.map((p, i) => <rect key={i} x={p.x * G_CELL} y={p.y * G_CELL} width={G_CELL} height={G_CELL} fill={p.c} />)}
    </svg>
  )
}

function Shell({ backHref, title, sub, decor, waiterFrom, state, children, after }: {
  backHref: string; title: string; sub: string; decor?: Decor; waiterFrom?: 'left' | 'right'; state: AuthState; children: ReactNode; after: ReactNode
}) {
  return (
    <div className="au">
      <div className="au-body">
        <main className="au-main">
          <a className="au-back" href={backHref}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            pepperpe.com
          </a>
          <div className="au-col">
            <div className="au-card">
              <span className="au-mark" aria-hidden="true">Ω</span>
              <h1 className="au-h">{title}</h1>
              <p className="au-sub">{sub}</p>
              {children}
            </div>
            {after}
          </div>
        </main>
      </div>
      <footer className="au-foot">
        <Grass />
        <DiningScene waiterFrom={waiterFrom} />
        {/* zero-height line at the grass surface, for the crew to stand on */}
        <div className="au-ground has-peek">{typeof decor === 'function' ? decor(state) : decor}</div>
        <p>Made with <span aria-label="love">♥</span> in India, for Indian kitchens</p>
      </footer>
    </div>
  )
}

function Terms({ termsHref, privacyHref }: { termsHref: string; privacyHref: string }) {
  return <p className="au-terms">By continuing you agree to our <a href={privacyHref}>Privacy Policy</a> and <a href={termsHref}>Terms of Service</a>.</p>
}

/**
 * Password input with a show/hide toggle and a Caps Lock hint. Focus is reported for
 * the input and its toggle together, so clicking the eye does not count as leaving.
 */
function Password({ id, value, onChange, show, onToggle, onFocusChange, invalid, autoComplete, describedBy }: {
  id: string; value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void; onFocusChange: (on: boolean) => void
  invalid: boolean; autoComplete: string; describedBy?: string
}) {
  const [caps, setCaps] = useState(false)
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => setCaps(e.getModifierState('CapsLock'))
  const onBlur = (e: FocusEvent<HTMLSpanElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onFocusChange(false)
  }
  return (
    <>
      <span className="au-pass" onFocus={() => onFocusChange(true)} onBlur={onBlur}>
        <input
          id={id}
          className="au-input"
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={e => onChange(e.target.value)}
          onKeyUp={onKey}
          onKeyDown={onKey}
        />
        <button type="button" className="au-eye" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={onToggle}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            {show && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
          </svg>
        </button>
      </span>
      {caps && <span className="au-caps">Caps Lock is on</span>}
    </>
  )
}

/** Form plumbing shared by both pages: values, focus, busy, the error and which field it is about */
function useAuthForm<K extends AuthField>(keys: readonly K[]) {
  const [values, setValues] = useState(() => Object.fromEntries(keys.map(k => [k, ''])) as Record<K, string>)
  const [focus, setFocus] = useState<AuthField | null>(null)
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bad, setBad] = useState<K | null>(null)

  const set = (k: K) => (v: string) => {
    setValues(s => ({ ...s, [k]: v }))
    if (bad === k || error) { setBad(null); setError(null) }
  }
  const focusProps = (k: K) => ({
    onFocus: () => setFocus(k),
    onBlur: () => setFocus(f => (f === k ? null : f)),
  })
  const fail = (k: K | null, msg: string) => { setBad(k); setError(msg) }
  const state: AuthState = {
    focus,
    showPassword: show,
    busy,
    error: !!error,
    filled: keys.some(k => values[k] !== ''),
  }
  return { values, set, focus, setFocus, focusProps, show, setShow, busy, setBusy, error, setError, bad, fail, state }
}

export type SignInProps = {
  onSubmit: (email: string, password: string) => Promise<void> | void
  forgotHref?: string
  signupHref?: string
  backHref?: string
  termsHref?: string
  privacyHref?: string
  /** Who stands on the band along the bottom; a function gets the form's state */
  decor?: Decor
  /** The side the waiter in the bottom scene walks in from (put the chef there) */
  waiterFrom?: 'left' | 'right'
  /** An error to show on arrival, e.g. a session that expired */
  initialError?: string
}

export function SignIn({
  onSubmit,
  forgotHref = '/forgot-password',
  signupHref = '/signup',
  backHref = 'https://pepperpe.com',
  termsHref = 'https://pepperpe.com/terms',
  privacyHref = 'https://pepperpe.com/privacy',
  decor,
  waiterFrom,
  initialError,
}: SignInProps) {
  const id = useId()
  const f = useAuthForm(['email', 'password'] as const)
  const [shownInitial, setShownInitial] = useState(!!initialError)
  const error = f.error ?? (shownInitial ? initialError ?? null : null)
  const ready = f.values.email.trim() !== '' && f.values.password !== ''

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (f.busy || !ready) return
    setShownInitial(false)
    if (!EMAIL.test(f.values.email.trim())) return f.fail('email', 'Enter a valid email address.')
    f.fail(null, '')
    f.setError(null)
    f.setBusy(true)
    try {
      await onSubmit(f.values.email.trim(), f.values.password)
    } catch (err) {
      f.setError(message(err, 'We could not sign you in. Check your email and password.'))
    } finally {
      f.setBusy(false)
    }
  }

  return (
    <Shell
      backHref={backHref} title="Welcome back" sub="Sign in to PepperPe" decor={decor} waiterFrom={waiterFrom} state={{ ...f.state, error: !!error }}
      after={<><p className="au-alt">New to PepperPe? <a href={signupHref}>Talk to our team</a></p><Terms termsHref={termsHref} privacyHref={privacyHref} /></>}
    >
      <form className={`au-form ${f.busy ? 'is-busy' : ''}`} onSubmit={submit} noValidate aria-busy={f.busy}>
        <div className={`au-field ${f.bad === 'email' ? 'has-error' : ''}`}>
          <label className="au-label" htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            className="au-input"
            type="email"
            autoComplete="username"
            value={f.values.email}
            aria-invalid={f.bad === 'email'}
            onChange={e => f.set('email')(e.target.value)}
            {...f.focusProps('email')}
            autoFocus
          />
        </div>
        <div className={`au-field ${f.bad === 'password' ? 'has-error' : ''}`}>
          <div className="au-label-row">
            <label className="au-label" htmlFor={`${id}-password`}>Password</label>
            <a className="au-link-sm" href={forgotHref}>Forgot your password?</a>
          </div>
          <Password
            id={`${id}-password`}
            value={f.values.password}
            onChange={f.set('password')}
            show={f.show}
            onToggle={() => f.setShow(s => !s)}
            onFocusChange={on => f.setFocus(cur => (on ? 'password' : cur === 'password' ? null : cur))}
            invalid={f.bad === 'password'}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="au-error" role="alert">{error}</p>}
        <button className="au-btn" type="submit" disabled={!ready || f.busy}>Sign in</button>
      </form>
    </Shell>
  )
}

export type ContactValues = { name: string; restaurant: string; phone: string; city: string; role: string }
const ROLES = ['Owner', 'Outlet manager', 'Operations head', 'Chef / Kitchen head', 'Admin / Accountant', 'Other']
export type ContactProps = {
  /** Send the details to the team; throw (or reject) with a message to show it */
  onSubmit: (values: ContactValues) => Promise<void> | void
  signinHref?: string
  backHref?: string
  termsHref?: string
  privacyHref?: string
  /** Who stands on the band along the bottom; a function gets the form's state */
  decor?: Decor
  /** The side the waiter in the bottom scene walks in from (put the chef there) */
  waiterFrom?: 'left' | 'right'
}

/**
 * New cafes do not make their own account: the Omega team sets each one up. So the
 * page a new cafe lands on asks for a name and a number, and the team calls back.
 */
export function ContactTeam({
  onSubmit,
  signinHref = '/login',
  backHref = 'https://pepperpe.com',
  termsHref = 'https://pepperpe.com/terms',
  privacyHref = 'https://pepperpe.com/privacy',
  decor,
  waiterFrom,
}: ContactProps) {
  const id = useId()
  const f = useAuthForm(['name', 'restaurant', 'phone', 'city'] as const)
  const [sent, setSent] = useState(false)
  const [role, setRole] = useState('')
  const ready = (['name', 'restaurant', 'phone', 'city'] as const).every(k => f.values[k].trim() !== '') && role !== ''

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (f.busy || !ready) return
    if (!/^[6-9]\d{9}$/.test(f.values.phone)) return f.fail('phone', 'Enter a 10-digit mobile number.')
    f.fail(null, '')
    f.setError(null)
    f.setBusy(true)
    try {
      await onSubmit({ name: f.values.name.trim(), restaurant: f.values.restaurant.trim(), phone: f.values.phone, city: f.values.city.trim(), role })
      setSent(true)
    } catch (err) {
      f.setError(message(err, 'That did not go through. Check your connection and try again.'))
    } finally {
      f.setBusy(false)
    }
  }

  const field = (k: 'name' | 'restaurant' | 'city', label: string, autoComplete: string, autoFocus = false) => (
    <div className={`au-field ${f.bad === k ? 'has-error' : ''}`}>
      <label className="au-label" htmlFor={`${id}-${k}`}>{label}</label>
      <input
        id={`${id}-${k}`} className="au-input" autoComplete={autoComplete} value={f.values[k]} aria-invalid={f.bad === k}
        onChange={e => f.set(k)(e.target.value)} {...f.focusProps(k)} autoFocus={autoFocus}
      />
    </div>
  )

  return (
    <Shell
      backHref={backHref}
      title={sent ? `Thanks, ${f.values.name.trim().split(' ')[0]}.` : 'Talk to our team'}
      sub={sent ? `We will call +91 ${f.values.phone} within a day and set up ${f.values.restaurant.trim()} on PepperPe for you.` : 'We set up every cafe for you, menu and all.'}
      decor={decor} waiterFrom={waiterFrom} state={{ ...f.state, error: !!f.error, filled: sent || f.state.filled }}
      after={<><p className="au-alt">Already on PepperPe? <a href={signinHref}>Sign in</a></p><Terms termsHref={termsHref} privacyHref={privacyHref} /></>}
    >
      {!sent && (
        <form className={`au-form ${f.busy ? 'is-busy' : ''}`} onSubmit={submit} noValidate aria-busy={f.busy}>
          <div className="au-row">
            {field('name', 'Your name', 'name', true)}
            {field('restaurant', 'Restaurant', 'organization')}
          </div>
          <div className="au-row">
          <div className={`au-field ${f.bad === 'phone' ? 'has-error' : ''}`}>
            <label className="au-label" htmlFor={`${id}-phone`}>Phone</label>
            <span className="au-phone">
              <span className="au-cc">+91</span>
              <input
                id={`${id}-phone`} className="au-input" inputMode="numeric" autoComplete="tel-national" value={f.values.phone} aria-invalid={f.bad === 'phone'}
                onChange={e => f.set('phone')(e.target.value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').slice(0, 10))} {...f.focusProps('phone')}
              />
            </span>
          </div>
          {field('city', 'City', 'address-level2')}
          </div>
          <fieldset className="au-roles">
            <legend className="au-label">Your role at the restaurant</legend>
            <div className="au-chips">
              {ROLES.map(r => (
                <label key={r} className="au-chip">
                  <input type="radio" name={`${id}-role`} value={r} checked={role === r} onChange={() => setRole(r)} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {f.error && <p className="au-error" role="alert">{f.error}</p>}
          <button className="au-btn" type="submit" disabled={!ready || f.busy}>Request a call back</button>
        </form>
      )}
    </Shell>
  )
}

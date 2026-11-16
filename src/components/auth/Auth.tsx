'use client'
import { useId, useState, type FocusEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import '@/styles/sections/auth.css'

/*
 * Omega POS sign in and sign up. The form follows ElevenLabs' auth pages (one centred
 * column, labels over plain fields, a button that stays grey until the form can be
 * sent); the frame follows CofounderOS (warm off-white, a back arrow, the mark over
 * the heading, a soft black pill, a playful band along the bottom).
 *
 * `decor` fills that band. Pass a function to have it follow the form: it gets an
 * AuthState (which field has focus, whether the password is shown, busy, error), so
 * characters peeking over the band can watch, cover their eyes for the password, or
 * look worried at a mistake.
 *
 * Both are presentational: they own the form state and the validation and hand the
 * values to `onSubmit`, which is the app's own call. Throw (or reject) from it with a
 * message to show that message under the form; navigate away from it on success.
 */

export type AuthField = 'email' | 'password' | 'restaurant'
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
const FALLBACK = 'Something went wrong. Please try again.'
const message = (err: unknown, fallback: string) => (err instanceof Error && err.message ? err.message : fallback)

function Shell({ backHref, title, sub, decor, state, children }: {
  backHref: string; title: string; sub: string; decor?: Decor; state: AuthState; children: ReactNode
}) {
  return (
    <div className="au">
      <a className="au-back" href={backHref} aria-label="Back to posomega.com">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </a>
      <main className="au-main">
        <div className="au-col">
          <span className="au-mark" aria-hidden="true">Ω</span>
          <h1 className="au-h">{title}</h1>
          <p className="au-sub">{sub}</p>
          {children}
        </div>
      </main>
      <footer className="au-foot has-peek">
        {typeof decor === 'function' ? decor(state) : decor}
        <p>Built in India for Indian kitchens</p>
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
  /** What goes in the band along the bottom; a function gets the form's state */
  decor?: Decor
  /** An error to show on arrival, e.g. a session that expired */
  initialError?: string
}

export function SignIn({
  onSubmit,
  forgotHref = '/forgot-password',
  signupHref = '/onboard',
  backHref = 'https://posomega.com',
  termsHref = 'https://posomega.com/terms',
  privacyHref = 'https://posomega.com/privacy',
  decor,
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
    <Shell backHref={backHref} title="Welcome back" sub="Sign in to Omega POS" decor={decor} state={{ ...f.state, error: !!error }}>
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
      <p className="au-alt">Don’t have an account? <a href={signupHref}>Sign up</a></p>
      <Terms termsHref={termsHref} privacyHref={privacyHref} />
    </Shell>
  )
}

export type SignUpValues = { restaurant: string; email: string; password: string }
export type SignUpProps = {
  onSubmit: (values: SignUpValues) => Promise<void> | void
  signinHref?: string
  backHref?: string
  termsHref?: string
  privacyHref?: string
  /** What goes in the band along the bottom; a function gets the form's state */
  decor?: Decor
  /** Match the app's own password rule */
  minPassword?: number
  initialError?: string
}

export function SignUp({
  onSubmit,
  signinHref = '/login',
  backHref = 'https://posomega.com',
  termsHref = 'https://posomega.com/terms',
  privacyHref = 'https://posomega.com/privacy',
  decor,
  minPassword = 8,
  initialError,
}: SignUpProps) {
  const id = useId()
  const f = useAuthForm(['restaurant', 'email', 'password'] as const)
  const [shownInitial, setShownInitial] = useState(!!initialError)
  const error = f.error ?? (shownInitial ? initialError ?? null : null)
  const ready = f.values.restaurant.trim() !== '' && f.values.email.trim() !== '' && f.values.password !== ''

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (f.busy || !ready) return
    setShownInitial(false)
    if (!EMAIL.test(f.values.email.trim())) return f.fail('email', 'Enter a valid email address.')
    if (f.values.password.length < minPassword) return f.fail('password', `Use at least ${minPassword} characters for your password.`)
    f.fail(null, '')
    f.setError(null)
    f.setBusy(true)
    try {
      await onSubmit({ restaurant: f.values.restaurant.trim(), email: f.values.email.trim(), password: f.values.password })
    } catch (err) {
      f.setError(message(err, FALLBACK))
    } finally {
      f.setBusy(false)
    }
  }

  return (
    <Shell backHref={backHref} title="Create an account" sub="Get your restaurant on Omega POS" decor={decor} state={{ ...f.state, error: !!error }}>
      <form className={`au-form ${f.busy ? 'is-busy' : ''}`} onSubmit={submit} noValidate aria-busy={f.busy}>
        <div className={`au-field ${f.bad === 'restaurant' ? 'has-error' : ''}`}>
          <label className="au-label" htmlFor={`${id}-restaurant`}>Restaurant name</label>
          <input
            id={`${id}-restaurant`}
            className="au-input"
            autoComplete="organization"
            value={f.values.restaurant}
            aria-invalid={f.bad === 'restaurant'}
            onChange={e => f.set('restaurant')(e.target.value)}
            {...f.focusProps('restaurant')}
            autoFocus
          />
        </div>
        <div className={`au-field ${f.bad === 'email' ? 'has-error' : ''}`}>
          <label className="au-label" htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            className="au-input"
            type="email"
            autoComplete="email"
            value={f.values.email}
            aria-invalid={f.bad === 'email'}
            onChange={e => f.set('email')(e.target.value)}
            {...f.focusProps('email')}
          />
        </div>
        <div className={`au-field ${f.bad === 'password' ? 'has-error' : ''}`}>
          <label className="au-label" htmlFor={`${id}-password`}>Password</label>
          <Password
            id={`${id}-password`}
            value={f.values.password}
            onChange={f.set('password')}
            show={f.show}
            onToggle={() => f.setShow(s => !s)}
            onFocusChange={on => f.setFocus(cur => (on ? 'password' : cur === 'password' ? null : cur))}
            invalid={f.bad === 'password'}
            autoComplete="new-password"
            describedBy={`${id}-password-hint`}
          />
          <span className="au-hint" id={`${id}-password-hint`}>At least {minPassword} characters</span>
        </div>
        {error && <p className="au-error" role="alert">{error}</p>}
        <button className="au-btn" type="submit" disabled={!ready || f.busy}>Create account</button>
      </form>
      <p className="au-alt">Already have an account? <a href={signinHref}>Sign in</a></p>
      <Terms termsHref={termsHref} privacyHref={privacyHref} />
    </Shell>
  )
}

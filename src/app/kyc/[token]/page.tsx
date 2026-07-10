'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/Icons'
import { api, ApiError } from '@/lib/api'

// Mirrors com.omega.pos.merchant.dto.OnboardingView on the backend (omegaservice,
// VendorController). status drives which step is active; individual fields (rather
// than a separate "steps complete" flag) tell us whether a step has been saved.
type OnboardingStatus = 'not_started' | 'in_progress' | 'submitted' | 'vendor_pending' | 'active' | 'rejected'
type BusinessType = 'proprietorship' | 'partnership' | 'private_limited' | 'llp'
type FssaiStatus = 'unverified' | 'verified' | 'failed'

interface OnboardingView {
  status: OnboardingStatus
  legalName: string | null
  businessType: BusinessType | null
  pan: string | null
  gst: string | null
  fssaiNumber: string | null
  fssaiExpiry: string | null
  fssaiStatus: FssaiStatus | null
  bankAccountNumberMasked: string | null
  bankIfsc: string | null
  bankAccountHolder: string | null
  bankName: string | null
  cashfreeVendorId: string | null
  rejectionReason: string | null
}

const SUPPORT_EMAIL = 'hello@unifiednexgrade.com'

const BUSINESS_TYPE_LABEL: Record<BusinessType, string> = {
  proprietorship: 'Sole proprietorship',
  partnership: 'Partnership',
  private_limited: 'Private limited',
  llp: 'LLP',
}

export default function KycLandingPage() {
  const params = useParams<{ token: string }>()
  const token = typeof params.token === 'string' ? params.token : ''

  const [phase, setPhase] = useState<'accepting' | 'accepted' | 'link-error'>('accepting')
  const [linkError, setLinkError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLinkError('This link is missing its invite code. Ask your Omega contact to resend it.')
      setPhase('link-error')
      return
    }
    let cancelled = false
    api
      .post<{ status: string; redirectTo: string }>('/api/v1/merchant/kyc-link/accept', { token })
      .then(() => {
        if (!cancelled) setPhase('accepted')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const status = err instanceof ApiError ? err.status : 0
        setLinkError(
          status === 401
            ? 'This link has expired or has already been used.'
            : 'We could not verify your link. Check your connection and try again.'
        )
        setPhase('link-error')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="ops-shell">
      <div className="ops-topbar">
        <div className="ops-topbar-inner">
          <Link href="/" className="ops-brand">
            <span className="glyph">Ω</span>
            <span>Omega</span>
          </Link>
          <span className="ops-badge">Owner onboarding</span>
        </div>
      </div>

      <div className="ops-main">
        {phase === 'accepting' && (
          <CenteredState>
            <div className="spinner" role="status" aria-live="polite" aria-label="Verifying your invite" />
            <p>Verifying your invite…</p>
          </CenteredState>
        )}

        {phase === 'link-error' && (
          <CenteredState>
            <div className="step-num" style={{ width: 44, height: 44, fontSize: 18, background: 'var(--bg-2)', color: '#D43A2F', marginBottom: 4 }}>
              <Icon.Close size={20} />
            </div>
            <h1 className="h-section" style={{ fontSize: 24, textAlign: 'center' }}>Link no longer works</h1>
            <p role="alert" style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', maxWidth: 360 }}>{linkError}</p>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Resend%20KYC%20link`} className="btn btn-primary btn-sm">
              Request a new link
            </a>
          </CenteredState>
        )}

        {phase === 'accepted' && (
          <>
            <div className="status-banner success" role="status" aria-live="polite">
              <Icon.Check size={16} />
              <span>Invite accepted. Your onboarding session is ready: complete the steps below.</span>
            </div>
            <OnboardingEntry />
          </>
        )}
      </div>
    </div>
  )
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return <div className="kyc-center">{children}</div>
}

function OnboardingEntry() {
  const [view, setView] = useState<OnboardingView | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  function load() {
    setLoading(true)
    setLoadError(false)
    api
      .get<OnboardingView>('/api/v1/merchant/onboarding')
      .then(setView)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) {
    return (
      <CenteredState>
        <div className="spinner" />
        <p>Loading your onboarding status…</p>
      </CenteredState>
    )
  }

  if (loadError || !view) {
    return (
      <CenteredState>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Could not load your onboarding status.</p>
        <button className="btn btn-secondary btn-sm" onClick={load}>Try again</button>
      </CenteredState>
    )
  }

  if (view.status === 'active') {
    return (
      <div className="result-card success-card">
        <div className="success-icon"><Icon.Check size={26} /></div>
        <h3>You&apos;re fully onboarded</h3>
        <p>{view.legalName ?? 'Your business'} is verified and ready to accept orders on Omega.</p>
      </div>
    )
  }

  if (view.status === 'submitted' || view.status === 'vendor_pending') {
    return (
      <div className="result-card success-card">
        <div className="success-icon" style={{ background: 'var(--accent)' }}><Icon.Check size={26} /></div>
        <h3>Submitted for review</h3>
        <p>
          We&apos;re verifying {view.legalName ?? 'your business'}&apos;s details. This usually takes 1–2 business
          days: we&apos;ll notify you once it&apos;s approved.
        </p>
      </div>
    )
  }

  const profileDone = Boolean(view.legalName && view.pan)
  const fssaiDone = Boolean(view.fssaiNumber)
  const bankDone = Boolean(view.bankAccountNumberMasked)

  return (
    <>
      {view.status === 'rejected' && (
        <div className="status-banner error">
          <Icon.Close size={16} />
          <span>Your submission needs a fix: {view.rejectionReason ?? 'please review the details below and resubmit.'}</span>
        </div>
      )}

      <ProfileStep view={view} onSaved={setView} />
      <FssaiStep view={view} onSaved={setView} />
      <BankStep view={view} onSaved={setView} />
      <SubmitStep canSubmit={profileDone && fssaiDone && bankDone} onSaved={setView} />
    </>
  )
}

function StepHeader({ n, title, done }: { n: number; title: string; done: boolean }) {
  return (
    <div className="step-head">
      <div className="step-title">
        <span className={`step-num${done ? ' done' : ''}`}>{done ? <Icon.Check size={11} /> : n}</span>
        {title}
      </div>
      <span className={`step-pill ${done ? 'done' : 'pending'}`}>{done ? 'Saved' : 'Pending'}</span>
    </div>
  )
}

function ProfileStep({ view, onSaved }: { view: OnboardingView; onSaved: (v: OnboardingView) => void }) {
  const [legalName, setLegalName] = useState(view.legalName ?? '')
  const [businessType, setBusinessType] = useState<BusinessType>(view.businessType ?? 'proprietorship')
  const [pan, setPan] = useState(view.pan ?? '')
  const [gst, setGst] = useState(view.gst ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = Boolean(view.legalName && view.pan)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!legalName.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim().toUpperCase())) {
      setError('Enter your legal business name and a valid 10-character PAN.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const next = await api.patch<OnboardingView>('/api/v1/merchant/onboarding/profile', {
        legalName: legalName.trim(),
        businessType,
        pan: pan.trim().toUpperCase(),
        gst: gst.trim(),
      })
      onSaved(next)
    } catch {
      setError('Could not save your profile. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`step-card${done ? ' is-done' : ''}`}>
      <StepHeader n={1} title="Business profile" done={done} />
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="form-banner-error">{error}</div>}
        <div className="form-field">
          <label>Legal business name</label>
          <input className="form-input" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Ananya Foods Pvt Ltd" />
        </div>
        <div className="form-field">
          <label>Business type</label>
          <select className="form-input" value={businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
            {Object.entries(BUSINESS_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="form-row-2">
          <div className="form-field">
            <label>PAN</label>
            <input className="form-input" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
          </div>
          <div className="form-field">
            <label>GST (optional)</label>
            <input className="form-input" value={gst} onChange={(e) => setGst(e.target.value.toUpperCase())} placeholder="22ABCDE1234F1Z5" />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn btn-secondary btn-sm">{busy ? 'Saving…' : 'Save profile'}</button>
      </form>
    </div>
  )
}

function FssaiStep({ view, onSaved }: { view: OnboardingView; onSaved: (v: OnboardingView) => void }) {
  const [fssaiNumber, setFssaiNumber] = useState(view.fssaiNumber ?? '')
  const [fssaiExpiry, setFssaiExpiry] = useState(view.fssaiExpiry ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = Boolean(view.fssaiNumber)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^\d{14}$/.test(fssaiNumber.trim()) || !fssaiExpiry) {
      setError('Enter your 14-digit FSSAI number and its expiry date.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const next = await api.patch<OnboardingView>('/api/v1/merchant/onboarding/fssai', {
        fssaiNumber: fssaiNumber.trim(),
        fssaiExpiry,
      })
      onSaved(next)
    } catch {
      setError('Could not save your FSSAI details. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`step-card${done ? ' is-done' : ''}`}>
      <StepHeader n={2} title="FSSAI license" done={done} />
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="form-banner-error">{error}</div>}
        <div className="form-row-2">
          <div className="form-field">
            <label>FSSAI number</label>
            <input className="form-input" value={fssaiNumber} onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, ''))} placeholder="14-digit number" maxLength={14} inputMode="numeric" />
          </div>
          <div className="form-field">
            <label>Expiry date</label>
            <input className="form-input" type="date" value={fssaiExpiry} onChange={(e) => setFssaiExpiry(e.target.value)} />
          </div>
        </div>
        {view.fssaiStatus && view.fssaiStatus !== 'unverified' && (
          <p style={{ fontSize: 12.5, color: view.fssaiStatus === 'verified' ? 'var(--sage)' : '#D43A2F', margin: '-8px 0 16px' }}>
            {view.fssaiStatus === 'verified' ? 'Verified' : 'Verification failed: recheck the number and resubmit.'}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn btn-secondary btn-sm">{busy ? 'Saving…' : 'Save FSSAI'}</button>
      </form>
    </div>
  )
}

function BankStep({ view, onSaved }: { view: OnboardingView; onSaved: (v: OnboardingView) => void }) {
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState(view.bankIfsc ?? '')
  const [accountHolder, setAccountHolder] = useState(view.bankAccountHolder ?? '')
  const [bankName, setBankName] = useState(view.bankName ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = Boolean(view.bankAccountNumberMasked)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accountNumber.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase()) || !accountHolder.trim() || !bankName.trim()) {
      setError('Fill in the account number, a valid IFSC, account holder name, and bank name.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const next = await api.patch<OnboardingView>('/api/v1/merchant/onboarding/bank', {
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        accountHolder: accountHolder.trim(),
        bankName: bankName.trim(),
      })
      onSaved(next)
      setAccountNumber('')
    } catch {
      setError('Could not save your bank details. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`step-card${done ? ' is-done' : ''}`}>
      <StepHeader n={3} title="Bank details" done={done} />
      {done && <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '-8px 0 16px' }}>On file: {view.bankAccountNumberMasked}</p>}
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="form-banner-error">{error}</div>}
        <div className="form-field">
          <label>Account number</label>
          <input className="form-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder={done ? 'Enter to replace on file account' : 'Account number'} inputMode="numeric" />
        </div>
        <div className="form-row-2">
          <div className="form-field">
            <label>IFSC</label>
            <input className="form-input" value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="HDFC0001234" maxLength={11} />
          </div>
          <div className="form-field">
            <label>Bank name</label>
            <input className="form-input" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="HDFC Bank" />
          </div>
        </div>
        <div className="form-field">
          <label>Account holder name</label>
          <input className="form-input" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="As per bank records" />
        </div>
        <button type="submit" disabled={busy} className="btn btn-secondary btn-sm">{busy ? 'Saving…' : 'Save bank details'}</button>
      </form>
    </div>
  )
}

function SubmitStep({ canSubmit, onSaved }: { canSubmit: boolean; onSaved: (v: OnboardingView) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    setBusy(true)
    try {
      const next = await api.post<OnboardingView>('/api/v1/merchant/submit')
      onSaved(next)
    } catch {
      setError('Could not submit. Make sure every step above is saved, then try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="step-card">
      {error && <div className="form-banner-error">{error}</div>}
      <button className="btn btn-primary btn-lg form-submit" disabled={!canSubmit || busy} onClick={submit}>
        {busy ? 'Submitting…' : canSubmit ? 'Submit for review' : 'Complete all 3 steps to submit'}
      </button>
    </div>
  )
}

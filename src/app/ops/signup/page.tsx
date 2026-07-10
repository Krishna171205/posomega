'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icons'

interface ProvisionForm {
  tenantName: string
  slug: string
  firstOutletName: string
  firstOutletCode: string
  firstOutletCity: string
  ownerFullName: string
  ownerEmail: string
  ownerPhone: string
  ownerPassword: string
}

const EMPTY_FORM: ProvisionForm = {
  tenantName: '',
  slug: '',
  firstOutletName: '',
  firstOutletCode: '',
  firstOutletCity: '',
  ownerFullName: '',
  ownerEmail: '',
  ownerPhone: '',
  ownerPassword: '',
}

// Loosely typed: the current contract returns tenantId/outletId/ownerUserId/slug/
// grabitCafeId; kycLinkUrl is anticipated once the KYC magic-link work (task EO2)
// lands on the response. Anything the API sends is rendered, nothing is assumed.
interface ProvisionResponse {
  tenantId?: number
  outletId?: number
  ownerUserId?: number
  slug?: string
  grabitCafeId?: number
  kycLinkUrl?: string
  [key: string]: unknown
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function OpsSignupPage() {
  const [form, setForm] = useState<ProvisionForm>(EMPTY_FORM)
  const [adminSecret, setAdminSecret] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ProvisionResponse | null>(null)

  function update<K extends keyof ProvisionForm>(key: K, value: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'tenantName' && !slugTouched) next.slug = slugify(value)
      return next
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(`${BASE}/api/v1/provisioning/cafe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': adminSecret,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        if (res.status === 401) {
          setError('Invalid admin secret.')
        } else if (res.status === 409) {
          setError('That slug or owner email is already taken.')
        } else {
          let detail: string | undefined
          try {
            const body = await res.json()
            detail = body?.detail ?? body?.message
          } catch { /* ignore */ }
          setError(detail ?? `Provisioning failed (${res.status}).`)
        }
        return
      }

      setResult((await res.json()) as ProvisionResponse)
    } catch {
      setError('Network error. Check the API is running and NEXT_PUBLIC_API_URL is set.')
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    setForm(EMPTY_FORM)
    setAdminSecret('')
    setSlugTouched(false)
    setResult(null)
    setError(null)
  }

  return (
    <div className="ops-shell">
      <div className="ops-topbar">
        <div className="ops-topbar-inner">
          <Link href="/" className="ops-brand">
            <span className="glyph">Ω</span>
            <span>Omega</span>
          </Link>
          <span className="ops-badge">Internal — Ops use only</span>
        </div>
      </div>

      <div className="ops-main">
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          <span className="dot" />
          Cafe provisioning
        </div>
        <h1 className="h-section" style={{ fontSize: 'clamp(28px, 4vw, 38px)' }}>
          Spin up a new tenant.
        </h1>
        <p className="lede" style={{ marginBottom: 8 }}>
          For onboarding ops only. This creates the tenant, first outlet, and owner account
          directly, and issues a KYC link for the owner. It is not part of the public site and
          sits behind the admin secret, not a login.
        </p>

        <div className="ops-warn">
          <Icon.Shield size={16} />
          <span>
            The admin secret is never stored here. Get it from SSM Parameter Store
            (<code>/omega/*</code>) — do not paste it anywhere else.
          </span>
        </div>

        {!result ? (
          <form onSubmit={onSubmit} noValidate>
            {error && <div className="form-banner-error">{error}</div>}

            <div className="ops-section-title">Brand</div>
            <Field
              label="Tenant name"
              placeholder="Acme Coffee Co."
              required
              value={form.tenantName}
              onChange={(v) => update('tenantName', v)}
            />
            <Field
              label="URL slug"
              placeholder="acme-coffee"
              required
              value={form.slug}
              onChange={(v) => {
                setSlugTouched(true)
                update('slug', v)
              }}
            />

            <div className="ops-section-title">First outlet</div>
            <Field
              label="Outlet name"
              placeholder="Acme HSR Layout"
              required
              value={form.firstOutletName}
              onChange={(v) => update('firstOutletName', v)}
            />
            <div className="form-row-2">
              <Field
                label="Code"
                placeholder="HSR-01"
                required
                value={form.firstOutletCode}
                onChange={(v) => update('firstOutletCode', v)}
              />
              <Field
                label="City"
                placeholder="Bangalore"
                required
                value={form.firstOutletCity}
                onChange={(v) => update('firstOutletCity', v)}
              />
            </div>

            <div className="ops-section-title">Owner account</div>
            <Field
              label="Full name"
              placeholder="Sahil Kumar"
              required
              value={form.ownerFullName}
              onChange={(v) => update('ownerFullName', v)}
            />
            <div className="form-row-2">
              <Field
                label="Email"
                type="email"
                required
                value={form.ownerEmail}
                onChange={(v) => update('ownerEmail', v)}
              />
              <Field
                label="Phone"
                placeholder="98765 43210"
                required
                value={form.ownerPhone}
                onChange={(v) => update('ownerPhone', v)}
              />
            </div>
            <Field
              label="Temporary password"
              type="password"
              required
              minLength={8}
              value={form.ownerPassword}
              onChange={(v) => update('ownerPassword', v)}
            />

            <div className="ops-section-title">Admin secret</div>
            <Field
              label="X-Admin-Secret"
              type="password"
              required
              value={adminSecret}
              onChange={setAdminSecret}
            />

            <button type="submit" disabled={busy} className="btn btn-primary btn-lg form-submit">
              {busy ? 'Provisioning…' : 'Provision cafe'}
            </button>
          </form>
        ) : (
          <div className="result-card">
            <div className="success-icon">
              <Icon.Check size={26} />
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 500 }}>Tenant provisioned</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 20 }}>
              Share the KYC link with the owner, or hand it off directly.
            </p>
            {Object.entries(result).map(([key, value]) => (
              <ResultRow key={key} label={key} value={String(value)} />
            ))}
            <button onClick={reset} className="btn btn-secondary btn-sm" style={{ marginTop: 20 }}>
              Provision another
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  minLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  minLength?: number
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        className="form-input"
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable — nothing to fall back to */ }
  }

  return (
    <div className="result-row">
      <span className="k">{label}</span>
      <span className="v">{value}</span>
      <button type="button" onClick={copy} className={`copy-btn${copied ? ' copied' : ''}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

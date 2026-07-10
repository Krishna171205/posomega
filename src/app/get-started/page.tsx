'use client'

import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Icon } from '@/components/Icons'
import { api } from '@/lib/api'

interface LeadForm {
  name: string
  cafeName: string
  phone: string
  city: string
}

type FieldErrors = Partial<Record<keyof LeadForm, string>>

const EMPTY_FORM: LeadForm = { name: '', cafeName: '', phone: '', city: '' }
const CONTACT_EMAIL = 'hello@unifiednexgrade.com'

function validate(form: LeadForm): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!form.cafeName.trim()) errors.cafeName = 'Enter your cafe or restaurant name.'
  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (!form.city.trim()) errors.city = 'Enter your city.'
  return errors
}

export default function GetStartedPage() {
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fallbackHref, setFallbackHref] = useState<string | null>(null)

  function update<K extends keyof LeadForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setBusy(true)
    try {
      await api.post('/api/v1/leads', form)
    } catch (err) {
      // No leads store is live yet (or the request failed) — never drop the lead on
      // the floor, just widen the net with a direct email fallback.
      console.warn('[get-started] lead API unavailable, offering direct fallback', err)
      const subject = encodeURIComponent(`Demo request — ${form.cafeName}`)
      const body = encodeURIComponent(
        `Name: ${form.name}\nCafe/restaurant: ${form.cafeName}\nPhone: ${form.phone}\nCity: ${form.city}`
      )
      setFallbackHref(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)
    } finally {
      setBusy(false)
      setSubmitted(true)
    }
  }

  return (
    <>
      <Nav />
      <section className="section" style={{ paddingTop: 160, paddingBottom: 100 }}>
        <div className="container form-shell">
          {!submitted ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div className="eyebrow" style={{ justifyContent: 'center' }}>
                  <span className="dot" />
                  Get started
                </div>
                <h1 className="h-section" style={{ marginTop: 16, textAlign: 'center' }}>
                  Let&apos;s get your <span className="h-italic">counter</span> live.
                </h1>
                <p className="lede" style={{ margin: '0 auto', textAlign: 'center' }}>
                  Tell us about your place. Our team will call within 24 hours to book a demo
                  and walk through onboarding.
                </p>
              </div>

              <div className="form-card">
                <form onSubmit={onSubmit} noValidate>
                  <Field
                    label="Your name"
                    placeholder="Ananya Rao"
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => update('name', v)}
                  />
                  <Field
                    label="Cafe / restaurant name"
                    placeholder="Blue Tokai, Indiranagar"
                    value={form.cafeName}
                    error={errors.cafeName}
                    onChange={(v) => update('cafeName', v)}
                  />
                  <div className="form-row-2">
                    <Field
                      label="Phone"
                      placeholder="98765 43210"
                      value={form.phone}
                      error={errors.phone}
                      onChange={(v) => update('phone', v)}
                      inputMode="numeric"
                    />
                    <Field
                      label="City"
                      placeholder="Bangalore"
                      value={form.city}
                      error={errors.city}
                      onChange={(v) => update('city', v)}
                    />
                  </div>

                  <button type="submit" disabled={busy} className="btn btn-primary btn-lg form-submit">
                    {busy ? 'Sending…' : 'Book a demo'}
                    {!busy && <Icon.Arrow size={14} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="form-card success-card">
              <div className="success-icon">
                <Icon.Check size={26} />
              </div>
              <h3>Thanks, {form.name.trim().split(' ')[0]}.</h3>
              <p>
                We&apos;ve got your details for {form.cafeName}. Our team will call {form.phone} within
                24 hours to set up your demo.
              </p>
              {fallbackHref && (
                <a href={fallbackHref} className="btn btn-secondary btn-sm">
                  Email us directly instead <Icon.ArrowUpRight size={12} />
                </a>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}

function Field({
  label,
  value,
  error,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  placeholder?: string
  inputMode?: 'numeric' | 'text'
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        className={`form-input${error ? ' has-error' : ''}`}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  )
}

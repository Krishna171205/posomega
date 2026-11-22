'use client'

import { useState } from 'react'
import { api, ApiError } from '@/lib/api'

/**
 * "What would make this more useful?" under each free tool. Goes to omegaservice
 * /api/v1/site-feedback (platform staff read it); contact is optional.
 */
export function ToolFeedback({ page }: { page: string }) {
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setState('sending')
    try {
      await api.post('/api/v1/site-feedback', { page, message: message.trim(), contact: contact.trim() || undefined })
      setState('sent')
    } catch (err) {
      setError(err instanceof ApiError && err.status === 429
        ? 'You have sent a few already. Try again in an hour.'
        : 'That did not go through. Please try again.')
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <section className="tf" aria-live="polite">
        <h2 className="tf-h">Thank you</h2>
        <p className="tf-p">We read every suggestion. If you left a way to reach you, we will tell you when it ships.</p>
      </section>
    )
  }

  return (
    <section className="tf">
      <h2 className="tf-h">What would make this more useful?</h2>
      <p className="tf-p">
        A missing field, a calculation you do by hand, something that confused you. Tell us and we will build it.
      </p>
      <form className="tf-form" onSubmit={send}>
        <label>
          Your suggestion
          <textarea
            className="form-input tf-text"
            required
            maxLength={2000}
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="For example: let me track wastage per dish"
          />
        </label>
        <div className="tf-row">
          <label>
            Email or phone, if you want a reply (optional)
            <input className="form-input" maxLength={254} value={contact} onChange={e => setContact(e.target.value)} />
          </label>
          <button type="submit" className="btn btn-blue" disabled={state === 'sending' || !message.trim()}>
            {state === 'sending' ? 'Sending…' : 'Send suggestion'}
          </button>
        </div>
        {state === 'error' && <p className="tf-err" role="alert">{error}</p>}
      </form>
    </section>
  )
}

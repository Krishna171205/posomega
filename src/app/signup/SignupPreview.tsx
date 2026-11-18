'use client'
import { ContactTeam, type AuthState } from '@/components/auth/Auth'
import { Peek } from '@/components/crew/Peek'
import { api } from '@/lib/api'

/** The crew on the band follow the form. Only the chef talks. */
function crew(s: AuthState) {
  const mood = s.error ? 'worried' : s.busy ? 'think' : 'happy'
  const say = s.error ? 'Hmm, check that once?'
    : s.busy ? 'Sending it to the team…'
    : s.focus === 'restaurant' ? 'Ooh, what’s it called?'
    : s.focus === 'phone' ? 'We’ll ring you on this.'
    : s.filled ? undefined : 'Welcome aboard!'
  // `active`: up as soon as any of it is on screen (the band sits at the bottom edge)
  return (
    <>
      <Peek active who="owner" side="left" x="8%" enter="phone" mood={mood} />
      <Peek active who="chef" side="right" x="8%" enter="hat" mood={mood} say={say} />
    </>
  )
}

/** New cafes ask for a call back; the details go to the same leads store as the homepage demo form. */
export function SignupPreview() {
  return (
    <ContactTeam
      onSubmit={async v => { await api.post('/api/v1/leads', { name: v.name, cafeName: v.restaurant, phone: v.phone, city: v.city, role: v.role, source: 'signup' }) }}
      signinHref="/login"
      backHref="/"
      decor={crew}
      waiterFrom="right"
    />
  )
}

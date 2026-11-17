'use client'
import { SignUp, type AuthState } from '@/components/auth/Auth'
import { Peek } from '@/components/crew/Peek'

/** The same small reactions as the sign-in page, with lines for a new account. Only the chef talks. */
function crew(s: AuthState) {
  // hands down while it signs in, and for the result
  const cover = s.focus === 'password' && !s.busy && !s.error ? (s.showPassword ? 'peek' : 'shy') : undefined
  const mood = s.error ? 'worried' : s.busy ? 'think' : 'happy'
  const say = s.error ? 'Hmm, check that once?'
    : s.busy ? 'Setting up your kitchen…'
    : cover === 'shy' ? 'Not looking!'
    : cover === 'peek' ? 'Just a tiny peek…'
    : s.focus === 'restaurant' ? 'Ooh, what’s it called?'
    : s.filled ? undefined : 'Welcome aboard!'
  // `active`: up as soon as any of it is on screen. The default waits until a figure is
  // 12% of the window's height clear of the bottom edge, which a band pinned to the
  // bottom of a tall window never is, so they would never come up.
  return (
    <>
      <Peek active who="owner" side="left" x="8%" enter="phone" mood={mood} cover={cover} />
      <Peek active who="chef" side="right" x="8%" enter="hat" mood={mood} cover={cover} say={say} />
    </>
  )
}

/** The sign-up design with a stand-in submit: it shows the busy state, then says where accounts are made for real. */
export function SignupPreview() {
  return (
    <SignUp
      onSubmit={async () => {
        await new Promise(r => setTimeout(r, 1400))
        throw new Error('This is a local preview of the new design. To create an account, use cafe.posomega.com.')
      }}
      signinHref="/login"
      backHref="/"
      decor={crew}
    />
  )
}

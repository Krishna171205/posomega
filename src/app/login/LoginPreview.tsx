'use client'
import { SignIn, type AuthState } from '@/components/auth/Auth'
import { Peek } from '@/components/crew/Peek'

/**
 * How the crew along the bottom reacts to the form. Small on purpose: they watch while
 * you type your email, cover their eyes for the password (one peeks if you show it),
 * look worried at a mistake and thoughtful while it signs in. Two of them, one at each
 * side, so they never stand over the form. Only the captain talks.
 */
function crew(s: AuthState) {
  // hands down while it signs in, and for the result
  const cover = s.focus === 'password' && !s.busy && !s.error ? (s.showPassword ? 'peek' : 'shy') : undefined
  const mood = s.error ? 'worried' : s.busy ? 'think' : 'happy'
  const say = s.error ? 'Hmm, try that again?'
    : s.busy ? 'Opening the till…'
    : cover === 'shy' ? 'Not looking!'
    : cover === 'peek' ? 'Just a tiny peek…'
    : s.filled ? undefined : 'Welcome back!'
  // `active`: up as soon as any of it is on screen. The default waits until a figure is
  // 12% of the window's height clear of the bottom edge, which a band pinned to the
  // bottom of a tall window never is, so they would never come up.
  return (
    <>
      <Peek active who="chef" side="left" x="8%" enter="hat" mood={mood} cover={cover} />
      <Peek active who="captain" side="right" x="8%" enter="lean" mood={mood} cover={cover} say={say} />
    </>
  )
}

/** The sign-in design with a stand-in submit: it shows the busy state, then says where to sign in for real. */
export function LoginPreview() {
  return (
    <SignIn
      onSubmit={async () => {
        await new Promise(r => setTimeout(r, 1400))
        throw new Error('This is a local preview of the new design. To sign in, use billing.pepperpe.com.')
      }}
      forgotHref="https://billing.pepperpe.com/login"
      signupHref="/signup"
      backHref="/"
      decor={crew}
      waiterFrom="left"
    />
  )
}

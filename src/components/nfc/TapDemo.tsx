'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
 * The hero of /nfc-table-tags: a flat lay of a café table. The tag lies by the coffee and
 * a guest's iPhone taps it.
 *
 * The loop follows the shape of a real visit: tap, the iOS NFC banner, a branded loading
 * screen, then the café page. From there it orders from a photo menu, leaves a Google
 * review, copies the Wi-Fi password, sends honest feedback (typed on a keyboard), plays a
 * game and saves the stamp card to Wallet. A caption names each moment. The first touch
 * or key press inside hands it to the visitor; "Watch it again" restarts it. Reduced
 * motion: no loop, interactive only. Demo data is made up; every screen maps to Grabbit.
 */

type Phase = 'lock' | 'tap' | 'banner' | 'loading' | 'page'
type Screen = 'home' | 'menu' | 'photo' | 'google' | 'wifi' | 'feedback' | 'thanks' | 'games' | 'play'

const TABLE = 4
const CAFE = 'Raydee Café'
const GOAL = 8
const FEEDBACK = 'Filter coffee was perfect. Music a little loud.'
const u = (id: string, w: number, h: number) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=70&auto=format&fit=crop`
const TABLE_PHOTO = 'photo-1611564494260-6f21b80af7ea'
const COVER_PHOTO = 'photo-1579018183467-a60b8dc9dd78'
const MENU = [
  { id: 'coffee', n: 'Filter coffee', d: 'South Indian, strong, frothy', p: 70, veg: true, tag: 'Bestseller', img: 'photo-1593443320739-77f74939d0da' },
  { id: 'chai', n: 'Masala chai', d: 'Kadak, ginger and cardamom', p: 40, veg: true, tag: '', img: 'photo-1509042239860-f550ce710b93' },
  { id: 'sando', n: 'Veg sandwich', d: 'Grilled, mint chutney, cheese', p: 160, veg: true, tag: 'Jain option', img: 'photo-1511421661275-e389971ff6ba' },
  { id: 'pav', n: 'Pav bhaji', d: 'Butter pav, onions, lemon', p: 180, veg: true, tag: '', img: 'photo-1606491956689-2ea866880c84' },
]

/** The loop, in ms from its start. `tap` highlights the control being "pressed". */
const SCRIPT: { at: number; tap?: string; act: string; n?: number }[] = [
  { at: 0, act: 'reset' },
  { at: 900, act: 'tap' },
  { at: 1700, act: 'banner' },
  { at: 2700, tap: 'banner', act: 'noop' },
  { at: 3000, act: 'loading' },
  { at: 3900, tap: 'open', act: 'noop' },
  { at: 4300, act: 'page' },
  { at: 6200, act: 'promo-off' },
  { at: 6600, tap: 'row-menu', act: 'menu' },
  { at: 7600, tap: 'photo-toggle', act: 'photo' },
  { at: 9000, tap: 'photo-toggle', act: 'menu' },
  { at: 9600, tap: 'add-coffee', act: 'cart' },
  { at: 10600, tap: 'done', act: 'home' },
  { at: 11400, tap: 'row-google', act: 'google' },
  { at: 12100, act: 'stars' },
  { at: 13300, tap: 'close', act: 'home' },
  { at: 14100, tap: 'row-wifi', act: 'wifi' },
  { at: 14800, tap: 'copy', act: 'copy' },
  { at: 15900, tap: 'close', act: 'home' },
  { at: 16700, tap: 'row-feedback', act: 'feedback' },
  { at: 17000, act: 'fbstars' },
  ...Array.from({ length: 12 }, (_, i) => ({ at: 17200 + i * 140, act: 'type', n: Math.round(((i + 1) / 12) * FEEDBACK.length) })),
  { at: 19200, tap: 'send', act: 'thanks' },
  { at: 20600, tap: 'close', act: 'home' },
  { at: 21400, tap: 'row-games', act: 'games' },
  { at: 22300, tap: 'game-ttt', act: 'play' },
  { at: 23000, act: 'move', n: 4 },
  { at: 23450, act: 'move', n: 0 },
  { at: 23900, act: 'move', n: 2 },
  { at: 24350, act: 'move', n: 8 },
  { at: 24800, act: 'move', n: 6 },
  { at: 26200, tap: 'close', act: 'home' },
  { at: 27000, tap: 'wallet', act: 'wallet' },
  { at: 29400, act: 'end' },
]

/** Caption next to the phone, by screen. */
const CAPTIONS: Partial<Record<Screen | Phase, [string, string]>> = {
  banner: ['No app', 'Opens from a tap'],
  loading: ['No app', 'Opens from a tap'],
  home: ['One page per table', 'Menu, rewards, Wi-Fi, games'],
  menu: ['Order from the table', 'Straight to the kitchen'],
  photo: ['Menus with photos', 'Veg marks, tags, search'],
  google: ['Google reviews', 'In a tap, for every guest'],
  wifi: ['Instant Wi-Fi', 'Without asking the staff'],
  feedback: ['Honest feedback', 'Straight to the owner'],
  thanks: ['Honest feedback', 'Straight to the owner'],
  games: ['Friend running late?', 'Four games at the table'],
  play: ['Friend running late?', 'Four games at the table'],
}

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const winner = (b: string[]) => LINES.find(([a, c, d]) => b[a] && b[a] === b[c] && b[a] === b[d])
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ico = (d: ReactNode) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
const I = {
  nfc: ico(<><path d="M6 8.5a5 5 0 0 1 0 7" /><path d="M9.5 6a9 9 0 0 1 0 12" /><path d="M13 3.5a13 13 0 0 1 0 17" /></>),
  menu: ico(<><path d="M7 3v8a2 2 0 0 0 2 2V21" /><path d="M5 3v6M9 3v6" /><path d="M17 21V3c-2 1.5-3 4-3 7h3" /></>),
  gift: ico(<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9" /><path d="M12 8S10.5 3 8 4.5 9 8 12 8Zm0 0s1.5-5 4-3.5S15 8 12 8Z" /></>),
  wifi: ico(<><path d="M2 8.8a15 15 0 0 1 20 0" /><path d="M5 12.6a10.5 10.5 0 0 1 14 0" /><path d="M8.5 16.4a5.5 5.5 0 0 1 7 0" /><circle cx="12" cy="20" r="0.8" fill="currentColor" /></>),
  game: ico(<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>),
  chat: ico(<path d="M4 5h16v11H9l-5 4Z" />),
  bag: ico(<><path d="M5 8h14l-1 12H6Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>),
  insta: ico(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></>),
  back: ico(<path d="M15 18l-6-6 6-6" />),
  x: ico(<path d="M18 6 6 18M6 6l12 12" />),
  search: ico(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  filter: ico(<path d="M4 6h16M7 12h10M10 18h4" />),
  photo: ico(<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>),
  wallet: ico(<><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18M16 15h2" /></>),
  copy: ico(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>),
}

/** Google's "G", in its four colours. */
const G = (
  <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6c1.9-5.6 7.2-9.8 13.5-9.8Z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4 6.8-10 6.8-17.2Z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6Z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6C6.6 42.6 14.6 48 24 48Z" />
  </svg>
)

/** iOS-style status bar: time on the left (hidden on the lock screen), signal, Wi-Fi, battery. */
function StatusBar({ dark, lock }: { dark: boolean; lock: boolean }) {
  return (
    <div className={`td-sb${dark ? ' is-dark' : ''}`} aria-hidden="true">
      <span>{lock ? '' : '8:42'}</span>
      <span className="td-sb-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.8" /><rect x="4.5" y="5" width="3" height="6" rx="0.8" /><rect x="9" y="2.5" width="3" height="8.5" rx="0.8" /><rect x="13.5" y="0" width="3" height="11" rx="0.8" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2.3c2 0 3.9.8 5.3 2.1l1.1-1.1A9.2 9.2 0 0 0 7.5.7 9.2 9.2 0 0 0 1.1 3.3l1.1 1.1a7.6 7.6 0 0 1 5.3-2.1Zm0 3.1c1.2 0 2.3.5 3.1 1.2l1.1-1.1a6 6 0 0 0-8.4 0l1.1 1.1c.8-.7 1.9-1.2 3.1-1.2Zm0 3.1c-.5 0-.9.2-1.2.5L7.5 10.2l1.2-1.2c-.3-.3-.7-.5-1.2-.5Z" /></svg>
        <span className="td-sb-batt"><i /></span>
      </span>
    </div>
  )
}

const ROWS: { id: Screen; t: string; icon: ReactNode; tone: string }[] = [
  { id: 'menu', t: 'Order from the table', icon: I.bag, tone: 'green' },
  { id: 'google', t: 'Leave a Google review', icon: G, tone: 'white' },
  { id: 'wifi', t: 'Connect to Wi-Fi', icon: I.wifi, tone: 'blue' },
  { id: 'feedback', t: 'Honest feedback', icon: I.chat, tone: 'violet' },
  { id: 'games', t: 'Play a game', icon: I.game, tone: 'amber' },
]
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

export function TapDemo() {
  const [phase, setPhase] = useState<Phase>('page')
  const [screen, setScreen] = useState<Screen>('home')
  const [promo, setPromo] = useState(false)
  const [cart, setCart] = useState(0)
  const [stars, setStars] = useState(0)
  const [copied, setCopied] = useState(false)
  const [typed, setTyped] = useState(0)
  const [fbStars, setFbStars] = useState(0)
  const [wallet, setWallet] = useState(false)
  const [board, setBoard] = useState<string[]>(Array(9).fill(''))
  const [tap, setTap] = useState<string | null>(null)
  const [auto, setAuto] = useState(true)
  const [visible, setVisible] = useState(false)
  const [motionOk, setMotionOk] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  useEffect(() => { if (reduced()) { setAuto(false); setMotionOk(false) } }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function reset() {
    setScreen('home'); setPromo(false); setCart(0); setStars(0); setCopied(false); setTyped(0); setFbStars(0); setWallet(false); setBoard(Array(9).fill(''))
  }

  /** X and O take turns; a finished board starts over on the next tap. */
  function play(cell: number) {
    setBoard(b => {
      if (winner(b) || b.every(Boolean)) return Array(9).fill('')
      if (b[cell]) return b
      const n = [...b]
      n[cell] = b.filter(Boolean).length % 2 ? 'O' : 'X'
      return n
    })
  }

  useEffect(() => {
    if (!auto || !visible) return
    let cancelled = false
    const run = () => {
      for (const s of SCRIPT) {
        later(() => {
          if (cancelled) return
          if (s.tap) { setTap(s.tap); later(() => setTap(null), 380) }
          switch (s.act) {
            case 'reset': reset(); setPhase('lock'); break
            case 'tap': setPhase('tap'); break
            case 'banner': setPhase('banner'); break
            case 'loading': setPhase('loading'); break
            case 'page': setPhase('page'); setPromo(true); break
            case 'promo-off': setPromo(false); break
            case 'home': case 'menu': case 'photo': case 'google': case 'wifi': case 'feedback': case 'thanks': case 'games': case 'play': setScreen(s.act); break
            case 'cart': setCart(1); break
            case 'stars': setStars(5); break
            case 'copy': setCopied(true); break
            case 'type': setTyped(s.n!); break
            case 'fbstars': setFbStars(4); break
            case 'move': play(s.n!); break
            case 'wallet': setWallet(true); break
            case 'end': run(); break
          }
        }, s.at)
      }
    }
    run()
    return () => { cancelled = true; clearTimers() }
  }, [auto, visible]) // eslint-disable-line react-hooks/exhaustive-deps

  /** First real touch or key press inside the demo hands it to the visitor. */
  function takeOver() {
    if (!auto) return
    setAuto(false)
    clearTimers()
    setTap(null)
    setPromo(false)
    setPhase('page')
  }

  function replay() { reset(); setAuto(true) }

  const t = (k: string) => (tap === k ? ' is-tap' : '')
  const touching = phase === 'tap' || phase === 'banner'
  const onPage = phase === 'page'
  const win = winner(board)
  const caption = auto ? CAPTIONS[onPage ? screen : phase] : undefined
  const home = () => setScreen('home')

  /** A screen pushed over the café page, with a back link. */
  const pushed = (title: string, body: ReactNode, right?: ReactNode, back: Screen = 'home') => (
    <div className="td-detail" key={screen === 'photo' ? 'menu' : screen}>
      <div className="td-nav">
        <button type="button" className={`td-back${t('done')}${t('close')}`} onClick={() => setScreen(back)}>{I.back}</button>
        <b>{title}</b>
        {right ?? <span />}
      </div>
      {body}
    </div>
  )

  /** A bottom sheet over the dimmed café page. */
  const sheet = (body: ReactNode, full = false) => (
    <>
      <div className="td-dim" onClick={home} />
      <div className={`td-sheet${full ? ' is-full' : ''}`} key={screen}>
        <span className="td-grab" aria-hidden="true" />
        <button type="button" className={`td-close${t('close')}`} aria-label="Close" onClick={home}>{I.x}</button>
        {body}
      </div>
    </>
  )

  const homePage = (
    <div className="td-home-page">
      <div className="td-cover">
        <img src={u(COVER_PHOTO, 520, 300)} alt="" />
        <div className="td-marquee" aria-hidden="true"><span>COFFEE · CHAI · SANDWICHES · BREAKFAST · DESSERTS · COFFEE · CHAI · SANDWICHES · BREAKFAST · DESSERTS ·&nbsp;</span></div>
        {promo && (
          <div className="td-promo">
            <span className="td-promo-logo" aria-hidden="true">g</span>
            <span><small>Powered by</small><b>Grabbit</b><small>Order, earn and play at your table</small></span>
          </div>
        )}
      </div>
      <div className="td-id">
        <span className="td-logo" aria-hidden="true">R</span>
        <div><strong>{CAFE}</strong><small>Filter coffee, slow mornings · Table {TABLE}</small></div>
      </div>
      <div className="td-stampcard">
        <div className="td-stampcard-top"><span className="td-chip is-pink">{I.gift}</span><b>{GOAL - 2} / {GOAL} stamps towards a free coffee</b></div>
        <ol className="td-dots" aria-label={`${GOAL - 2} of ${GOAL} stamps`}>
          {Array.from({ length: GOAL }, (_, i) => <li key={i} className={i < GOAL - 2 ? 'is-on' : undefined} />)}
        </ol>
        <button type="button" className={`td-wallet${t('wallet')}`} onClick={() => setWallet(true)}>{I.wallet} {wallet ? 'Added to Wallet' : 'Add to Wallet'}</button>
      </div>
      <ul className="td-rows">
        {ROWS.map(r => (
          <li key={r.id}>
            <button type="button" className={`td-row${t(`row-${r.id}`)}`} onClick={() => setScreen(r.id)}>
              <span className={`td-chip is-${r.tone}`}>{r.icon}</span>{r.t}
            </button>
          </li>
        ))}
      </ul>
      <div className="td-foot">
        <span className="td-insta">{I.insta}</span>
        <small>Powered by <b>Grabbit</b> · PepperPe</small>
      </div>
    </div>
  )

  let body: ReactNode = null
  if (!onPage) {
    body = phase === 'loading' ? (
      <div className="td-launch">
        <img className="td-launch-bg" src={u(COVER_PHOTO, 520, 900)} alt="" />
        <div className="td-launch-card">
          <span className="td-launch-x" aria-hidden="true">{I.x}</span>
          <div className="td-launch-art"><img src="/img/grabbit-icon.png" alt="" width={74} height={74} /></div>
          <div className="td-launch-body">
            <div><b>{CAFE}</b><small>Your visit, made easier.</small></div>
            <span className={`td-launch-open${t('open')}`}>Open</span>
          </div>
          <div className="td-launch-foot"><img src="/img/grabbit-icon.png" alt="" width={16} height={16} /><span><small>Powered by</small>Grabbit</span><em>letsgrabbit.com</em></div>
        </div>
      </div>
    ) : (
      <div className="td-lock" aria-live="polite">
        <span className="td-lock-time">8:42</span>
        <span className="td-lock-date">Saturday, 22 November</span>
        {phase === 'banner' ? (
          <span className={`td-banner${t('banner')}`}>
            <span className="td-banner-icon">{I.nfc}</span>
            <span><b>NFC Tag</b><small>Open “letsgrabbit.com”</small></span>
            <em>now</em>
          </span>
        ) : (
          <span className="td-lock-hint">{phase === 'tap' ? 'Reading tag…' : 'Hold near the tag'}</span>
        )}
      </div>
    )
  } else if (screen === 'menu' || screen === 'photo') {
    body = pushed('Coffee & Drinks', screen === 'photo' ? (
      <div className="td-photo">
        <img src={u(MENU[0].img, 480, 700)} alt="" />
        <div className="td-photo-cap">
          <b>{MENU[0].n}</b><span>₹{MENU[0].p}</span><small>{MENU[0].d}</small>
        </div>
        <span className="td-photo-dots" aria-hidden="true"><i className="is-on" /><i /><i /><i /></span>
      </div>
    ) : (
      <>
        <div className="td-cats"><span className="is-on">Coffee & Drinks</span><span>Breakfast</span><span>Snacks</span></div>
        <ul className="td-dishes">
          {MENU.map(i => (
            <li key={i.id}>
              <div>
                <span className="td-dish-n"><span className={`qd-mark ${i.veg ? 'is-veg' : 'is-nonveg'}`} role="img" aria-label={i.veg ? 'Vegetarian' : 'Non-vegetarian'} />{i.n}</span>
                {i.tag && <span className="td-dish-tag">{i.tag}</span>}
                <small>{i.d}</small>
                <b>₹{i.p}</b>
              </div>
              <span className="td-thumb">
                <img src={u(i.img, 120, 120)} alt="" />
                <button type="button" className={`td-add${t(`add-${i.id}`)}`} onClick={() => setCart(c => c + 1)}>{cart && i.id === 'coffee' ? cart : 'Add'}</button>
              </span>
            </li>
          ))}
        </ul>
        {cart ? <span className="td-cartbar"><span>{cart} item{cart > 1 ? 's' : ''} · ₹{70 * cart}</span><b>Place order</b></span> : <span className="td-search">{I.search} Search the menu</span>}
      </>
    ), (
      <span className="td-navicons">
        <button type="button" className={`td-navicon${t('photo-toggle')}`} aria-label="Photo view" onClick={() => setScreen(screen === 'photo' ? 'menu' : 'photo')}>{I.photo}</button>
        <span className="td-navicon" aria-hidden="true">{I.filter}</span>
      </span>
    ))
  } else if (screen === 'google') {
    body = (
      <div className="td-detail td-google-page" key={screen}>
        <div className="td-nav"><button type="button" className={`td-back${t('close')}`} onClick={home}>{I.back}</button><b>{CAFE}</b><span /></div>
        <div className="td-guser"><span className="td-avatar">RS</span><div><b>Riya S.</b><small>Posting publicly across Google</small></div></div>
        <div className="td-gstars">{[1, 2, 3, 4, 5].map(n => <button key={n} type="button" className={n <= stars ? 'is-on' : undefined} aria-label={`${n} stars`} onClick={() => setStars(n)}>★</button>)}</div>
        {['Food', 'Service', 'Atmosphere'].map(r => (
          <div key={r} className="td-grow"><span>{r}</span><span className="td-gsmall">{[1, 2, 3, 4, 5].map(n => <i key={n} className={stars ? 'is-on' : undefined}>★</i>)}</span></div>
        ))}
        <span className={`td-gtext${stars ? ' is-filled' : ''}`}>{stars ? 'Best filter coffee near campus, friendly staff.' : 'Share details of your own experience at this place'}</span>
        <span className="td-gpost">Post</span>
        <span className="td-safari">{I.search} search.google.com</span>
      </div>
    )
  } else if (screen === 'games') {
    body = pushed('Games', (
      <>
        <small className="td-games-sub">Something to do while you wait.</small>
        <ul className="td-gamegrid">
          <li><button type="button" className={`td-game${t('game-ttt')}`} onClick={() => { setBoard(Array(9).fill('')); setScreen('play') }}><span className="td-gv td-gv-ttt" aria-hidden="true"><i>X</i><i>O</i><i /><i /><i>X</i><i /><i>O</i><i /><i>X</i></span>Tic-tac-toe<small>2 players</small></button></li>
          <li><span className="td-game"><span className="td-gv td-gv-ludo" aria-hidden="true" />Ludo<small>2 to 4 players</small></span></li>
          <li><span className="td-game"><span className="td-gv td-gv-sudoku" aria-hidden="true"><i>5</i><i /><i>3</i><i /><i>7</i><i /><i>1</i><i /><i>9</i></span>Mini sudoku<small>Solo</small></span></li>
          <li><span className="td-game"><span className="td-gv td-gv-2048" aria-hidden="true"><i>2</i><i>4</i><i>8</i><i>16</i></span>2048<small>Solo</small></span></li>
        </ul>
      </>
    ))
  } else if (screen === 'play') {
    const turn = board.filter(Boolean).length % 2 ? 'O' : 'X'
    body = pushed('Tic-tac-toe', (
      <>
        <div className="td-players">
          <span className={!win && turn === 'X' ? 'is-turn' : undefined}><b className="is-x">X</b>You</span>
          <em>{win ? `${board[win[0]] === 'X' ? 'You win!' : 'Friend wins!'}` : board.every(Boolean) ? 'Draw' : turn === 'X' ? 'Your turn' : 'Friend’s turn'}</em>
          <span className={!win && turn === 'O' ? 'is-turn' : undefined}><b className="is-o">O</b>Friend</span>
        </div>
        <div className="td-ttt is-big" aria-label="Tic-tac-toe board">
          {board.map((m, i) => (
            <button key={i} type="button" className={`${m === 'X' ? 'is-x' : m === 'O' ? 'is-o' : ''}${win?.includes(i) ? ' is-win' : ''}`} aria-label={m || `Cell ${i + 1}`} onClick={() => play(i)}>{m}</button>
          ))}
        </div>
        <button type="button" className="td-newgame" onClick={() => setBoard(Array(9).fill(''))}>New game</button>
      </>
    ), undefined, 'games')
  } else {
    body = homePage
  }

  return (
    <div className="qd-wrap">
      <div
        className="td"
        ref={root}
        aria-label="NFC table tag demo"
        onPointerDownCapture={e => { if (e.isTrusted) takeOver() }}
        onKeyDownCapture={e => { if (e.isTrusted) takeOver() }}
      >
        <img className="td-table" src={u(TABLE_PHOTO, 1400, 1000)} alt="" aria-hidden="true" />

        {/* The tag lying on the table: QR on the left, what a tap opens on the right. */}
        <div className={`td-tag${touching ? ' is-live' : ''}`} aria-hidden="true">
          <div className="td-tag-qr">
            <img src="/img/qr-menu-try.svg" alt="" width={74} height={74} />
            <span>by PepperPe</span>
          </div>
          <div className="td-tag-main">
            <b className="td-tag-name">Raydee <i>Café</i></b>
            <div className="td-tag-icons">
              <span>{I.menu}Menu</span>
              <span>{I.gift}Rewards</span>
              <span>{I.wifi}Wi-Fi</span>
              <span>{I.game}Games</span>
            </div>
          </div>
          <span className="td-tag-nfc">{I.nfc}<span className="td-ripple"><i /><i /><i /></span></span>
        </div>

        <div className={`qd-phone td-phone${touching ? ' is-touching' : ''}`}>
          <div className="qd-phone-screen">
            <span className="td-island" aria-hidden="true"><i /></span>
            <span className="td-glare" aria-hidden="true" />
            <StatusBar dark={onPage && screen !== 'home' && screen !== 'photo'} lock={phase === 'lock' || phase === 'tap' || phase === 'banner'} />
            {body}
            {onPage && screen === 'wifi' && (copied ? (
              <div className="td-toast" key="joined"><span className="td-toast-ok">{I.wifi}</span><span><b>Connected</b><small>Cafe_Guest</small></span></div>
            ) : (
              <>
                <div className="td-dim is-light" onClick={home} />
                <div className="td-alert" role="alertdialog" aria-label="Join Wi-Fi">
                  <p>“Grabbit” Wants to Join Wi-Fi Network “Cafe_Guest”?</p>
                  <div className="td-alert-btns">
                    <button type="button" onClick={home}>Cancel</button>
                    <button type="button" className={`is-primary${t('copy')}`} onClick={() => setCopied(true)}>Join</button>
                  </div>
                </div>
              </>
            ))}
            {onPage && screen === 'feedback' && sheet(
              <div className="td-fb">
                <b className="td-fb-title">Honest feedback</b>
                <small className="td-fb-sub">Speak freely. Only the Raydee team reads this.</small>
                <div className="td-fb-stars" aria-label="Rating">{[1, 2, 3, 4, 5].map(n => <i key={n} className={n <= fbStars ? 'is-on' : undefined}>★</i>)}</div>
                <span className={`td-fb-text${typed ? ' is-filled' : ''}`}>{typed ? FEEDBACK.slice(0, typed) : 'Tell us what you loved, or what we could do better.'}{typed > 0 && typed < FEEDBACK.length && <i className="td-caret" />}</span>
                <div className="td-fb-tags">{['Coffee', 'Service', 'Music'].map((g, i) => <span key={g} className={typed && (i === 0 || i === 2) ? 'is-on' : undefined}>{g}</span>)}</div>
                <button type="button" className={`td-send${t('send')}`} onClick={() => setScreen('thanks')}>Send feedback</button>
                <small className="td-fb-note">Low ratings reach the owner first.</small>
                <div className="td-kb" aria-hidden="true">
                  <div className="td-kb-sugg"><span>I</span><span>The</span><span>loved</span></div>
                  {KEYS.map(r => <div key={r} className="td-kb-row">{[...r].map(k => <i key={k}>{k}</i>)}</div>)}
                  <div className="td-kb-row"><i className="is-wide">123</i><i className="is-space">space</i><i className="is-wide">return</i></div>
                </div>
              </div>, true
            )}
            {onPage && screen === 'thanks' && sheet(
              <div className="td-fb-done">
                <span className="td-fb-done-logo" aria-hidden="true"><img src="/img/grabbit-icon.png" alt="" width={30} height={30} /></span>
                <b className="td-fb-title">Thank you!</b>
                <small>Your feedback has been sent to the team.</small>
                <span className="td-earned">+5 coins for your feedback</span>
              </div>, true
            )}
            <span className={`td-home${onPage && screen !== 'photo' ? ' is-dark' : ''}`} aria-hidden="true" />
          </div>
        </div>

        {caption && (
          <div className="td-caption" key={caption[0]} aria-hidden="true">
            <b>{caption[0]}</b>
            <span>{caption[1]}</span>
          </div>
        )}
      </div>
      <p className="qd-status">
        {auto ? 'Tap the phone to try it yourself.' : 'Your turn: tap around the café page.'}
        {!auto && motionOk && <button type="button" className="qd-replay" onClick={replay}>Watch it again</button>}
      </p>
    </div>
  )
}

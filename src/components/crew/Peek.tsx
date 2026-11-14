'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { DET, Fist, Grip, Head, Ln, Sh, Torso, type Mood, type Who } from './parts'

/*
 * One pointer listener for every peek on the page. Each visible peek subscribes
 * while it is on screen; the eyes are updated in a single rAF per pointer move.
 */
const subs = new Set<(x: number, y: number) => void>()
let px = 0, py = 0, raf = 0
function onMove(e: PointerEvent) {
  px = e.clientX; py = e.clientY
  if (!raf) raf = requestAnimationFrame(() => { raf = 0; subs.forEach(f => f(px, py)) })
}
function track(fn: (x: number, y: number) => void) {
  if (subs.size === 0) window.addEventListener('pointermove', onMove, { passive: true })
  subs.add(fn)
  return () => { subs.delete(fn); if (subs.size === 0) window.removeEventListener('pointermove', onMove) }
}

/**
 * How the figure arrives (characters.css has the choreography):
 *  pop    springs up, then nods twice
 *  walk   strolls in along the edge from its side
 *  hat    the top of the head comes up alone, wobbles, then the face follows
 *  eyes   rises to eye level, looks left and right, then comes all the way up
 *  phone  a phone is held up first and buzzes; the head follows it
 *  lean   tips in from the corner and stays tilted
 * Omitted: a plain spring up.
 *
 * Each entrance also has its own hand gesture once it has arrived, repeated
 * every few seconds while it stays up:
 *  pop    waves hello            walk   drums the fingers
 *  hat    salutes at the brim    eyes   taps the screen twice
 *  phone  waves with the free hand   lean   thumbs-up
 */
export type Enter = 'pop' | 'walk' | 'hat' | 'eyes' | 'phone' | 'lean'

type Props = {
  who: Who
  /** Which end of the card's top edge to sit on. */
  side?: 'left' | 'right'
  /** Distance from that end, any CSS length. */
  x?: string
  /** Speech bubble, shown on arrival, when it changes, and on hover. */
  say?: string
  mood?: Mood
  enter?: Enter
  /**
   * Controlled mode: the figure is up only while this is true (and on screen).
   * Leave undefined for the default, which is to come up once when scrolled to.
   */
  active?: boolean
}

/* Art box: 112 x 96, the card edge at y=86, the head centred at (56, 42). */
const W = 112, H = 96, EDGE = 86

/**
 * Notion-style figure peeking over the top edge of its parent (give the parent
 * `has-peek`). Hands land on the edge, the head comes up from behind it, the eyes
 * follow the cursor, and hovering the card makes it stand on tiptoe and wave.
 */
export function Peek({ who, side = 'right', x = '10%', say, mood = 'happy', enter, active }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const clip = `pk${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
  // Stagger blinks so a row of figures never blinks in unison.
  const blink = `-${([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 40) / 10}s`
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)
  const [talk, setTalk] = useState(false)
  const up = active === undefined ? seen : active && inView

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setSeen(true)
    }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Say something on arrival, and again whenever the line changes.
  useEffect(() => {
    if (!up || !say) { setTalk(false); return }
    setTalk(true)
    const t = window.setTimeout(() => setTalk(false), 3000)
    return () => window.clearTimeout(t)
  }, [up, say])

  useEffect(() => {
    if (!inView || !up) return
    const look = ref.current?.querySelector<SVGGElement>('.look')
    const face = ref.current?.querySelector<SVGGElement>('.head')
    if (!look || !face) return
    return track((mx, my) => {
      const r = face.getBoundingClientRect()
      const dx = mx - (r.left + r.width / 2)
      const dy = my - (r.top + r.height * 0.55)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 240)
      look.style.transform = `translate(${((dx / d) * 2.6 * k).toFixed(2)}px, ${((dy / d) * 2.2 * k).toFixed(2)}px)`
    })
  }, [inView, up, mood])

  return (
    <div
      ref={ref}
      className={`peek at-${side} ${enter ? `enter-${enter}` : ''} ${up ? 'is-in' : ''} ${talk ? 'talk' : ''}`}
      style={{ ['--peek-x' as string]: x, ['--blink-d' as string]: blink }}
      aria-hidden="true"
    >
      {/* width/height keep it small even before the stylesheet arrives */}
      <svg viewBox={`0 0 ${W} ${H}`} width={80} height={(80 * H) / W} className="pk-art">
        <defs><clipPath id={clip}><rect x="-24" y="-40" width={W + 48} height={EDGE + 40} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          {/* lift: hover tiptoe · rise: up/down state · bob: the entrance's own move */}
          <g className="pk-lift">
            <g className="pk-rise">
              <g className="pk-bob">
                <g transform="translate(56 42) scale(.9)">
                  <Torso who={who} />
                  <Head who={who} mood={mood} />
                </g>
              </g>
            </g>
          </g>
          {enter === 'phone' && (
            <g className="pk-prop">
              <Sh d="M91 78 L90 100 L104 100 L103 78Z" />
              <rect className="fill" x={89.5} y={42} width={15} height={27} rx={3.5} fill="currentColor" />
              <rect className="fill" x={92} y={46} width={10} height={15} rx={1.5} fill="#fff" />
              <Ln w={1.2} d="M94 50.5 L100 50.5 M94 54.5 L98 54.5" />
              <Fist x={97} y={74} r={-90} s={0.8} />
              <g className="pk-ping"><circle cx={107} cy={41} r={3.2} fill="none" stroke="currentColor" strokeWidth={1.4} /></g>
              <circle className="fill" cx={107} cy={41} r={2} fill="currentColor" />
            </g>
          )}
        </g>
        <g className="pk-burst"><Ln w={DET} d="M21 9 L26 14.5 M14 23 L21.5 24.5 M91 9 L86 14.5 M98 23 L90.5 24.5" /></g>
        <g transform={`translate(0 ${EDGE})`}>
          <Grip x={18} inward={1} className="pk-hand-l" />
          {/* with the phone variant that hand is busy holding the phone */}
          {enter !== 'phone' && <Grip x={94} inward={-1} className="pk-hand-r" />}
        </g>
      </svg>
      {say && <span className="peek-say">{say}</span>}
    </div>
  )
}

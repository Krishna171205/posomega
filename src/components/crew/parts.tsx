import type { SVGProps } from 'react'

/**
 * Shared parts for the ink characters. Heads are drawn in a local space centred on
 * the face (rx 26, ry 30; chin at y=30, neck to y=42), so one head serves both the
 * full-body crew and the small figures that peek over cards.
 *
 * Kept deliberately sparse: two line weights, solid ink for hair and dark clothes,
 * one white strand per head, dots for eyes.
 *
 * Class hooks used by characters.css:
 *  .ink   stroked shape, pathLength=1 so it can be drawn in
 *  .fill  solid ink or highlight, fades in after the strokes
 *  .look  pupils, moved by the peek figures to follow the cursor
 *  .eye   blink
 *  .brows raised or knitted by mood
 */
export type Who = 'captain' | 'manager' | 'owner' | 'store' | 'chef' | 'server'
export type Mood = 'happy' | 'wow' | 'worried' | 'think'

/** Outline weight and detail weight, in head units. */
export const OUT = 2.2
export const DET = 1.6

const INK = 'currentColor'
const PAPER = '#fff'
const round = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

type PathP = SVGProps<SVGPathElement> & { w?: number }
/** Open stroke */
export const Ln = ({ w = OUT, ...p }: PathP) => <path className="ink" pathLength={1} fill="none" stroke={INK} strokeWidth={w} {...round} {...p} />
/** Paper-filled shape with an ink outline */
export const Sh = ({ w = OUT, ...p }: PathP) => <path className="ink" pathLength={1} fill={PAPER} stroke={INK} strokeWidth={w} {...round} {...p} />
/** Solid ink */
export const Bl = (p: SVGProps<SVGPathElement>) => <path className="fill" fill={INK} {...p} />
/** White strand drawn over solid ink */
export const Hl = ({ w = 1.4, ...p }: PathP) => <path className="fill" fill="none" stroke={PAPER} strokeWidth={w} {...round} {...p} />
export const ShE = ({ w = OUT, ...p }: SVGProps<SVGEllipseElement> & { w?: number }) => <ellipse className="ink" pathLength={1} fill={PAPER} stroke={INK} strokeWidth={w} {...p} />
export const LnC = ({ w = DET, ...p }: SVGProps<SVGCircleElement> & { w?: number }) => <circle className="ink" pathLength={1} fill="none" stroke={INK} strokeWidth={w} {...p} />
export const ShR = ({ w = OUT, ...p }: SVGProps<SVGRectElement> & { w?: number }) => <rect className="ink" pathLength={1} fill={PAPER} stroke={INK} strokeWidth={w} {...round} {...p} />

/** A closed hand, knuckles to the right. Place with x/y, rotate with r, mirror with flip. */
export function Fist({ x, y, r = 0, s = 1, flip = false }: { x: number; y: number; r?: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`}>
      <Sh d="M-9 -3 C-10 -9 -4 -11 1 -10.5 C7 -10 10 -5 9.5 1 C9 7 3 9 -2.5 8.5 C-7.5 8 -9 3 -9 -3Z" />
      <Ln w={DET} d="M2 -10 C4.5 -7 4.5 -3.5 2.5 -1.5 M6.5 -8 C8.5 -5 8 -1 6 .5" />
    </g>
  )
}

/**
 * A hand resting on a ledge at y=0: back of the hand and knuckles above it, four
 * fingers hooked over, and a thumb on the side facing the head (`inward` = +1 when
 * the head is to the right). The thumb is its own group so a gesture can raise it
 * into a thumbs-up.
 */
export function Grip({ x, inward = 1, className = '' }: { x: number; inward?: 1 | -1; className?: string }) {
  return (
    // CSS animates the inner groups; the outer one keeps the SVG position attribute,
    // which a CSS transform on the same element would otherwise replace.
    <g transform={`translate(${x} 0)`}>
      <g className={`pk-hand ${className}`}>
        <g transform={`scale(${inward} 1)`}>
          <Sh d="M-9.5 1 C-10.5 -6 -6.5 -11 -.5 -11.5 C5.5 -12 9.5 -8 9.5 -3 L9.5 1Z" />
          <Ln w={DET} d="M-4.5 -8.8 Q-3.6 -7.6 -4.2 -6.2 M.5 -10.6 Q1.4 -9.2 .8 -7.8" />
          <Sh d="M-9.5 -1 L-9.5 4.5 Q-9.5 7.8 -6.5 7.8 L5 7.8 Q8 7.8 8 4.5 L8 -1" />
          <Ln w={DET} d="M-5.2 1.8 L-5.2 7.2 M-.8 1.8 L-.8 7.5 M3.6 1.8 L3.6 7.2" />
          <g className="pk-thumb">
            <Sh d="M7 -5 C11 -6.5 14.5 -4.5 14 -1 C13.6 2 10.5 3 7.5 1.5Z" />
          </g>
        </g>
      </g>
    </g>
  )
}

function Eyes({ dx = 11, y = 3, mood }: { dx?: number; y?: number; mood: Mood }) {
  const ox = mood === 'think' ? 2.5 : 0
  const oy = mood === 'think' ? -2.5 : 0
  const k = mood === 'wow' ? 1.3 : 1
  return (
    <g className="look">
      <g className="eye">
        <ellipse className="fill" cx={-dx + ox} cy={y + oy} rx={2.2 * k} ry={2.8 * k} fill={INK} />
        <ellipse className="fill" cx={dx + ox} cy={y + oy} rx={2.2 * k} ry={2.8 * k} fill={INK} />
      </g>
    </g>
  )
}

/** Mouth for the mood; `smile` is the character's own resting expression. */
function Mouth({ mood, smile }: { mood: Mood; smile: React.ReactNode }) {
  if (mood === 'wow') return <ellipse className="fill" cx="0" cy="20" rx="3.2" ry="4.2" fill={INK} />
  if (mood === 'worried') return (
    <>
      <Ln w={DET} d="M-6 21 Q-3 18 0 20.5 Q3 23 6 20" />
      <path className="fill" d="M29 -24 C25.5 -16 26.5 -11 29.5 -11 C32.5 -11 33 -16 29 -24Z" fill={PAPER} stroke={INK} strokeWidth={DET} />
    </>
  )
  if (mood === 'think') return <Ln w={DET} d="M-3.5 21 Q1 19.5 5.5 21" />
  return <>{smile}</>
}

const Neck = () => <Sh d="M-8 20 L-8 42 L8 42 L8 20" />
const Ears = () => <><ShE cx={-25.5} cy={4} rx={4.5} ry={6.5} /><ShE cx={25.5} cy={4} rx={4.5} ry={6.5} /></>
const Face = () => <ShE cx={0} cy={0} rx={26} ry={30} />
const Smile = ({ d }: { d: string }) => <Ln w={DET + .2} d={d} />

export function Head({ who, mood = 'happy' }: { who: Who; mood?: Mood }) {
  const m = `head mood-${mood}`
  switch (who) {
    case 'captain':
      return (
        <g className={m}>
          <Bl d="M-33 -6 C-39 -40 -14 -49 4 -47 C29 -47 41 -28 35 4 C33 25 37 42 29 48 C19 54 -19 54 -29 48 C-39 41 -31 20 -33 -6Z" />
          <Hl d="M27 -26 C33 -10 32 12 30 32" />
          <Neck /><Face />
          <Bl d="M-27 -6 C-31 -36 -4 -41 10 -39 C27 -37 33 -22 27 -5 C22 -15 14 -21 6 -19 C2 -11 -8 -8 -14 -12 C-18 -7 -22 -5 -27 -6Z" />
          <Hl d="M-12 -31 C-5 -34 4 -34 11 -31" />
          <LnC cx={-11} cy={4} r={8} /><LnC cx={11} cy={4} r={8} />
          <Ln w={DET} d="M-3 3 Q0 1 3 3" />
          <Eyes dx={11} y={4.5} mood={mood} />
          <g className="fill" fill={INK}><circle cx="-17" cy="15.5" r="1" /><circle cx="17" cy="15.5" r="1" /></g>
          <Ln w={DET} d="M0 9 Q2.2 12 0 14" />
          <Mouth mood={mood} smile={<Smile d="M-5.5 20 Q0 24.5 5.5 20" />} />
        </g>
      )
    case 'manager':
      return (
        <g className={m}>
          <Neck /><Ears /><Face />
          <Bl d="M-27 -2 C-32 -34 -6 -44 10 -40 C30 -38 34 -16 27 -2 C24 -14 16 -22 4 -22 C-6 -22 -16 -18 -22 -10 C-24 -6 -26 -4 -27 -2Z" />
          <Ln w={OUT + .4} d="M6 -40 C6 -49 13 -53 19 -49" />
          <Hl d="M-14 -32 C-6 -36 6 -36 13 -32" />
          <g className="brows"><Ln w={DET} d="M-17 -10 L-7 -11" /><Ln w={DET} d="M7 -11 L17 -10" /></g>
          <rect className="ink" pathLength={1} x="-20" y="-2" width="16" height="12" rx="4" fill="none" stroke={INK} strokeWidth={DET} />
          <rect className="ink" pathLength={1} x="4" y="-2" width="16" height="12" rx="4" fill="none" stroke={INK} strokeWidth={DET} />
          <Ln w={DET} d="M-4 3 L4 3" />
          <Eyes dx={12} y={4} mood={mood} />
          <Ln w={DET} d="M1 9.5 L-1.5 14.5 L1.5 14.5" />
          <Mouth mood={mood} smile={<Smile d="M-6 20.5 Q0 25.5 6 20.5" />} />
        </g>
      )
    case 'owner':
      return (
        <g className={m}>
          <Neck /><Ears /><Face />
          <Bl d="M-27 1 C-34 -30 -12 -46 8 -42 C28 -40 36 -20 27 3 C26 -12 20 -22 12 -26 C2 -18 -14 -13 -27 1Z" />
          <Hl d="M10 -36 C1 -30 -8 -25 -17 -15" />
          <g className="brows"><Ln d="M-17 -7 Q-12 -9.5 -6 -7" /><Ln d="M6 -7 Q12 -9.5 17 -7" /></g>
          <Eyes dx={12} y={3} mood={mood} />
          <Ln w={DET} d="M0 5 Q-3.5 10.5 0 12.5" />
          <Bl d="M-9 15.5 C-6 13 -2 13.5 0 15.5 C2 13.5 6 13 9 15.5 C6 18.5 2 17.5 0 16.5 C-2 17.5 -6 18.5 -9 15.5Z" />
          <Mouth mood={mood} smile={<Smile d="M-4.5 22 Q0 24.5 4.5 22" />} />
        </g>
      )
    case 'store':
      return (
        <g className={m}>
          <Bl d="M-32 -4 C-38 -40 -10 -50 2 -48 C28 -48 40 -30 34 0 L36 54 C26 59 -24 59 -34 54 L-32 -4Z" />
          <Hl d="M28 8 C30 22 30 36 29 48" />
          <Neck /><Face />
          <Bl d="M-27 -1 C-29 -30 -10 -40 0 -36 C-6 -28 -14 -19 -26 5Z" />
          <Bl d="M27 -1 C29 -30 10 -40 0 -36 C6 -28 14 -19 26 5Z" />
          <g transform="rotate(-32 22 -20)">
            <ShR x={18} y={-22.5} width={22} height={5} rx={1.5} w={DET} />
            <Ln w={DET} d="M40 -22.5 L44.5 -20 L40 -17.5" />
          </g>
          <g className="brows"><Ln w={DET} d="M-16 -5 Q-11.5 -7.5 -6 -5" /><Ln w={DET} d="M6 -5 Q11.5 -7.5 16 -5" /></g>
          <Eyes dx={11} y={4.5} mood={mood} />
          <Ln w={DET} d="M0 9 L-1.5 14 L1.5 14" />
          <Mouth mood={mood} smile={<Smile d="M-5 20.5 Q0 23.5 5 20.5" />} />
        </g>
      )
    case 'chef':
      return (
        <g className={m}>
          <Neck /><Ears /><Face />
          <Bl d="M-26 -6 C-24 -19 24 -19 26 -6 C18 -12 -18 -12 -26 -6Z" />
          <Sh d="M-22 -27 C-36 -32 -33 -56 -16 -52 C-14 -67 14 -67 16 -52 C33 -56 36 -32 22 -27Z" />
          <Ln w={DET} d="M-8 -30 L-10 -47 M8 -30 L10 -47" />
          <ShR x={-23} y={-30} width={46} height={11} rx={3} />
          <g className="brows"><Ln w={DET} d="M-16 -8 Q-11.5 -10.5 -6 -8" /><Ln w={DET} d="M6 -8 Q11.5 -10.5 16 -8" /></g>
          <Eyes dx={11} y={3} mood={mood} />
          <Ln w={DET} d="M0 5.5 Q3 10 0 12" />
          <Mouth mood={mood} smile={<Bl d="M-7 17 Q0 26 7 17 Q0 19.5 -7 17Z" />} />
        </g>
      )
    case 'server':
      return (
        <g className={m}>
          <Bl d="M-9 -45 a11 11 0 1 1 22 0 a11 11 0 1 1 -22 0Z" />
          <Neck /><Ears /><Face />
          <g className="fill" fill={INK}><circle cx="-25.5" cy="13" r="1.8" /><circle cx="25.5" cy="13" r="1.8" /></g>
          <Bl d="M-27 1 C-32 -32 -10 -40 2 -38 C22 -38 34 -26 27 1 C24 -14 14 -26 2 -26 C-10 -26 -22 -14 -27 1Z" />
          <Hl d="M-4 -36.5 Q2 -33.5 8 -36.5" />
          <Hl d="M-15 -30 C-8 -34 5 -34 13 -30" />
          <g className="brows"><Ln w={DET} d="M-16 -9 Q-11.5 -11.5 -6 -9" /><Ln w={DET} d="M6 -9 Q11.5 -11.5 16 -9" /></g>
          <Eyes dx={11} y={3} mood={mood} />
          <Ln w={DET} d="M-14.5 .5 L-17 -1.5 M14.5 .5 L17 -1.5" />
          <Ln w={DET} d="M0 6.5 Q-2.8 10.5 0 12" />
          <Mouth mood={mood} smile={<Smile d="M-6 18.5 Q0 24 6 18.5" />} />
        </g>
      )
  }
}

/** Shoulders and clothing, drawn down to `bottom` in head space. */
export function Torso({ who, bottom = 60, w = 54 }: { who: Who; bottom?: number; w?: number }) {
  const body = `M${-w} ${bottom} C${-w + 2} 64 -30 42 0 42 C30 42 ${w - 2} 64 ${w} ${bottom}Z`
  const neckline = <Sh w={DET} d="M-10 41.5 Q0 49 10 41.5 Q0 45 -10 41.5Z" />
  switch (who) {
    case 'captain':
      return (
        <g>
          <Sh d={body} />
          <Bl d={`M-22 45 L0 66 L22 45 C28 66 29 ${bottom - 20} 32 ${bottom} L-32 ${bottom} C-29 ${bottom - 20} -28 66 -22 45Z`} />
          {bottom > 70 && <g className="fill" fill={PAPER}>{[80, 94, 108].filter(y => y < bottom - 6).map(y => <circle key={y} cx="0" cy={y} r="1.8" />)}</g>}
          <Ln w={DET} d="M-8 42.5 L0 51 L8 42.5" />
        </g>
      )
    case 'manager':
      return (
        <g>
          <Sh d={body} />
          <Ln w={DET} d="M-8 42.5 Q0 49 8 42.5" />
          <Ln w={DET} d={`M-7 46 L-2 ${Math.min(bottom, 72)} M7 46 L2 ${Math.min(bottom, 72)}`} />
          {bottom > 90 && <><ShR x={-8} y={70} width={16} height={20} rx={3} w={DET} /><Bl d="M-4.5 74 h9 v7 h-9Z" /></>}
        </g>
      )
    case 'owner':
      return <g><Bl d={body} />{neckline}</g>
    case 'store':
      return (
        <g>
          <Sh d={body} />
          {bottom > 80 && <Bl d={`M-28 72 L28 72 L31 ${bottom} L-31 ${bottom}Z`} />}
          {bottom > 80 && <Ln w={DET} d="M-18 46 L-26 72 M18 46 L26 72" />}
          <Ln w={DET} d="M-8 42.5 L0 50 L8 42.5" />
        </g>
      )
    case 'chef':
      return (
        <g>
          <Sh d={body} />
          <Ln w={DET} d={`M-6 48 C3 62 10 80 13 ${bottom}`} />
          {bottom > 70 && <g className="fill" fill={INK}>{[66, 84, 102, 118].filter(y => y < bottom - 4).map(y => <g key={y}><circle cx="8" cy={y} r="2" /><circle cx="22" cy={y} r="2" /></g>)}</g>}
          <Bl d="M-11 40 L11 40 L0 54Z" />
        </g>
      )
    case 'server':
      return <g><Bl d={body} />{neckline}</g>
  }
}

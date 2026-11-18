'use client'
import { useEffect, useRef } from 'react'
import { Bl, Head, Ln, LnC, Sh, ShR } from '../crew/parts'

/**
 * A small dining scene standing on the pixel grass at the bottom of the sign-in pages,
 * drawn in the crew's ink style. It loops every 12 seconds (CSS in auth.css, `ds-`):
 * a guest taps the bell on the table, the waiter comes out from behind the chef (who
 * stands on the band at the side of the page), walks behind the table with a dish on his tray, sets it down between the two guests, and walks back out. Ground is y=126.
 */
/**
 * `waiterFrom`: the chef's side of the page. The waiter starts and ends where the chef
 * stands, so the scene measures the chef's figure (the peek on that side of the band)
 * and hands its position, in the scene's own units, to the CSS as --ds-from.
 */
export function DiningScene({ waiterFrom = 'right' }: { waiterFrom?: 'left' | 'right' }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const place = () => {
      const chef = svg.parentElement?.querySelector(`.au-ground .peek.at-${waiterFrom}`)
      if (!chef) return
      const s = svg.getBoundingClientRect(), c = chef.getBoundingClientRect()
      const units = (c.left + c.width / 2 - s.left) * (480 / s.width)
      svg.style.setProperty('--ds-from', `${units.toFixed(1)}px`)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [waiterFrom])
  return (
    <svg ref={ref} className={`ds from-${waiterFrom}`} viewBox="0 0 480 130" aria-hidden="true">
      {/* The waiter, behind the table, so he is drawn first */}
      <g className="ds-waiter">
        {/* dark trousers, one leg each, swinging from the hip; shoes point the way he walks in */}
        <g className="ds-leg ds-leg-a"><Bl d="M-11 82 h9 v40 h-9 Z" /><Bl d="M-14 120 h11 a3 3 0 0 1 3 3 v3 h-14 Z" /></g>
        <g className="ds-leg ds-leg-b"><Bl d="M2 82 h9 v40 h-9 Z" /><Bl d="M-1 120 h11 a3 3 0 0 1 3 3 v3 h-14 Z" /></g>
        <Sh d="M-16 86 C-16 55 -10 45 0 45 C10 45 16 55 16 86 Z" />
        <Ln w={1.6} d="M-7 51 L0 59 L7 51" />
        {/* the apron over shirt and thighs */}
        <ShR w={1.8} x={-12} y={72} width={24} height={30} rx={3} />
        <Ln w={1.4} d="M-16 74 L16 74" />
        <g transform="translate(0 24) scale(.5)"><Head who="server" /></g>
        {/* the tray arm: the tray (and the dish on it) lowers onto the table to serve */}
        <g className="ds-tray">
          <Ln d="M-13 54 C-22 50 -26 44 -26 38" />
          <Ln d="M-44 37 L-8 37" />
          <g className="ds-dish-up">
            <Ln w={1.6} d="M-38 35 L-14 35" />
            <Sh d="M-36 35 A10 9 0 0 1 -16 35 Z" />
            <LnC cx={-26} cy={24.5} r={1.6} />
          </g>
        </g>
      </g>

      {/* Chairs: back, seat at y=104, front leg */}
      <Ln d="M126 62 L126 126 M126 104 L156 104 M154 104 L154 126" />
      <Ln d="M326 62 L326 126 M326 104 L296 104 M298 104 L298 126" />

      {/* Left guest, tapping the bell: dark trousers along the seat and down to the floor */}
      <Bl d="M131 94 H170 a5 5 0 0 1 0 10 H131 Z" />
      <Bl d="M163 100 h9 v22 h-9 Z" />
      <Bl d="M161 121 h15 a3 3 0 0 1 3 3 v2 h-18 Z" />
      <Sh d="M130 98 C130 78 135 68 146 68 C157 68 162 78 162 98 Z" />
      <g transform="translate(146 50) scale(.5)"><Head who="owner" /></g>
      <g className="ds-tap"><Ln d="M158 78 C168 80 176 84 180 88" /><LnC cx={181} cy={88.5} r={2.6} /></g>

      {/* Right guest */}
      <Bl d="M321 94 H282 a5 5 0 0 0 0 10 H321 Z" />
      <Bl d="M289 100 h-9 v22 h9 Z" />
      <Bl d="M291 121 h-15 a3 3 0 0 0 -3 3 v2 h18 Z" />
      <Sh d="M290 98 C290 78 295 68 306 68 C317 68 322 78 322 98 Z" />
      <g transform="translate(306 50) scale(.5)"><Head who="store" /></g>
      <Ln d="M294 78 C284 80 276 84 272 90" />

      {/* Table, bell, and the dish once it is served */}
      <ShR x={170} y={92} width={112} height={6} rx={3} />
      <Ln d="M226 98 L226 126 M208 126 L244 126" />
      {/* The table's QR standee: scan to see the menu and order */}
      <g className="ds-qr">
        <Ln w={1.4} d="M246 92 L266 92" />
        <ShR w={1.4} x={248} y={72} width={16} height={19} rx={2} />
        <Bl d="M250.5 74.5 h4.5 v4.5 h-4.5 Z M257 74.5 h4.5 v4.5 h-4.5 Z M250.5 81 h4.5 v4.5 h-4.5 Z" />
        <Bl d="M257.5 81.5 h1.6 v1.6 h-1.6 Z M260 83 h1.6 v1.6 h-1.6 Z M257.5 84.5 h1.6 v1.6 h-1.6 Z M253 86.8 h1.6 v1.6 h-1.6 Z M259.5 86.8 h1.6 v1.6 h-1.6 Z" />
      </g>
      <g className="ds-bell">
        <Sh w={1.8} d="M178 92 A8 8 0 0 1 194 92 Z" />
        <LnC cx={186} cy={82.5} r={1.6} />
      </g>
      <g className="ds-ding">
        <Ln w={1.6} d="M174 80 q-4 -4 0 -9 M198 80 q4 -4 0 -9 M170 84 q-6 -7 0 -15" />
      </g>
      <g className="ds-dish">
        <Ln w={1.6} d="M216 91 L246 91" />
        <Sh d="M219 91 A12 10 0 0 1 243 91 Z" />
        <LnC cx={231} cy={79} r={1.6} />
      </g>
    </svg>
  )
}

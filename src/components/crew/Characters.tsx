import { Bl, DET, Fist, Head, Hl, Ln, Sh, ShE, ShR, Torso } from './parts'

/**
 * Full-body ink characters for the "How it works" story: a shared head and torso
 * from parts.tsx plus the one prop that explains the job. Prop groups carry a class
 * characters.css animates (pen scribble, phone ping, page flip, pan toss, files).
 */
const at = (x: number, y: number) => `translate(${x} ${y}) scale(1.1)`
/** Torso depth that reaches the bottom of the 220 box from a head placed at y. */
const reach = (y: number) => Math.ceil((220 - y) / 1.1)

/** Floor captain with a notepad: takes the order once. */
export function Captain() {
  return (
    <svg viewBox="0 0 220 220" className="char char-captain" aria-hidden="true">
      <g transform={at(108, 82)}><Torso who="captain" bottom={reach(82)} w={62} /><Head who="captain" /></g>
      <g className="prop prop-pad">
        <g transform="rotate(8 144 175)">
          <ShR x={124} y={150} width={40} height={50} rx={3} />
          <g className="fill" fill="currentColor">{[130, 137, 144, 151, 158].map(x => <rect key={x} x={x - 1.3} y={146} width={2.6} height={8} rx={1.3} />)}</g>
          <g className="scribble"><Ln w={DET} d="M131 165 L157 165 M131 174 L152 174 M131 183 L142 183" /></g>
          <Ln w={DET} d="M147 184 l3 3 l6 -7" />
        </g>
        <Fist x={162} y={200} r={-80} />
      </g>
      <g className="prop prop-pen">
        <Sh d="M50 220 C54 202 74 188 98 184 L106 199 C92 203 84 211 80 220Z" />
        <Ln w={3.2} d="M104 198 L132 170" />
        <Ln w={DET} d="M132 170 L136 166" />
        <Fist x={106} y={192} r={-35} />
      </g>
      <g className="marks"><Ln w={DET} d="M172 136 L178 130 M176 146 L184 145" /></g>
    </svg>
  )
}

/** Head chef tossing a pan: tickets in the order they were fired. */
export function Chef() {
  return (
    <svg viewBox="0 0 220 220" className="char char-chef" aria-hidden="true">
      <g transform={at(132, 84)}><Torso who="chef" bottom={reach(84)} w={62} /><Head who="chef" /></g>
      {/* Forearm rises along his side from an elbow below the frame, pan held out to the left */}
      <g className="prop prop-pan">
        <g className="steam"><Ln w={DET} d="M18 126 C14 120 22 116 18 108 M29 122 C25 116 33 112 29 104 M40 126 C36 120 44 116 40 108" /></g>
        <g className="flipper"><ShE cx={29} cy={140} rx={11} ry={3.4} /></g>
        <Sh d="M8 146 C10 158 48 158 50 146Z" />
        <ShE cx={29} cy={146} rx={21} ry={4.6} />
        <Ln w={4.4} d="M49 149 L62 159" />
        <Sh d="M55 170 C55 186 57 204 59 220 L86 220 C82 204 77 186 73 166Z" />
        <Fist x={64} y={163} r={30} />
      </g>
    </svg>
  )
}

/** Shift manager holding up a phone that has just pinged: every channel, one queue. */
export function Manager() {
  return (
    <svg viewBox="0 0 220 220" className="char char-manager" aria-hidden="true">
      <g className="prop note note-a"><ShR x={12} y={138} width={32} height={30} rx={2} /><Ln w={DET} d="M18 149 L37 149 M18 156 L31 156" /></g>
      <g transform={at(104, 82)}><Torso who="manager" bottom={reach(82)} w={62} /><Head who="manager" /></g>
      <g className="prop note note-b"><rect className="fill" x={178} y={170} width={30} height={28} rx={2} fill="currentColor" /><Hl d="M184 181 L201 181 M184 188 L195 188" /></g>
      <g className="prop prop-arm">
        <Sh d="M140 158 C150 134 156 112 160 94 L180 96 C180 120 174 148 164 174Z" />
        <rect className="fill" x={159} y={44} width={22} height={36} rx={4} fill="currentColor" />
        <rect className="fill" x={162.5} y={49} width={15} height={22} rx={2} fill="#fff" />
        <Ln w={DET} d="M165 55 L175 55 M165 60 L172 60" />
        <Fist x={170} y={86} r={-90} />
        <g className="ping"><circle cx={187} cy={45} r={4} fill="none" stroke="currentColor" strokeWidth={DET} /></g>
        <circle className="fill" cx={187} cy={45} r={2.6} fill="currentColor" />
      </g>
    </svg>
  )
}

/** Owner reading the day-end book. */
export function Owner() {
  return (
    <svg viewBox="0 0 220 220" className="char char-owner" aria-hidden="true">
      <g transform={at(110, 78)}><Torso who="owner" bottom={reach(78)} w={62} /><Head who="owner" /></g>
      <g className="prop prop-book">
        <Sh d="M30 168 C60 156 92 160 110 174 C128 160 160 156 190 168 L190 214 C160 204 128 206 110 218 C92 206 60 204 30 214Z" />
        <Ln d="M110 174 L110 218" />
        <Ln w={DET} d="M46 181 C64 177 84 179 98 185 M46 191 C64 187 84 189 98 195 M46 201 C60 198 76 199 90 204" />
        <g className="page">
          <Sh d="M110 174 C128 162 156 160 182 168 L182 206 C156 200 130 202 110 212Z" />
          <Bl d="M125 201 h5 v-9 h-5Z M134 199.5 h5 v-14 h-5Z M143 198 h5 v-10 h-5Z M152 197 h5 v-18 h-5Z M161 196.5 h5 v-13 h-5Z" />
        </g>
      </g>
      <Fist x={30} y={192} r={-100} />
      <Fist x={190} y={192} r={-80} flip />
    </svg>
  )
}

/** Store in-charge with the file box: stock that counts itself. */
export function Storekeeper() {
  return (
    <svg viewBox="0 0 220 220" className="char char-store" aria-hidden="true">
      <g transform={at(110, 80)}><Torso who="store" bottom={reach(80)} w={62} /><Head who="store" /></g>
      <g className="prop prop-files">
        <g className="file f1"><Sh w={DET} d="M72 152 L72 146 L83 146 L86 152" /><ShR x={70} y={152} width={28} height={30} rx={2} /></g>
        <g className="file f2"><Bl d="M101 146 L101 140 L112 140 L115 146Z" /><ShR x={98} y={146} width={28} height={36} rx={2} /><Ln w={DET} d="M104 156 L119 156 M104 162 L114 162" /></g>
        <g className="file f3"><Sh w={DET} d="M130 154 L130 148 L141 148 L144 154" /><ShR x={126} y={154} width={28} height={28} rx={2} /></g>
      </g>
      <ShR x={58} y={170} width={104} height={48} rx={3} />
      <ShR x={92} y={185} width={36} height={11} rx={2} w={DET} />
      <Fist x={58} y={192} r={-90} flip />
      <Fist x={162} y={192} r={-90} />
    </svg>
  )
}

export const CHARACTERS = { Captain, Chef, Manager, Owner, Storekeeper }

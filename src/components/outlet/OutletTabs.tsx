'use client'
import { useState } from 'react'
import { Icon } from '../Icons'
import { MockView } from './Mocks'
import type { OutletExtras } from '@/content/types'

/** Feature switcher: a tab list on the left, the live scene for that tab on the right. */
export function OutletTabs({ tabs }: { tabs: OutletExtras['tabs'] }) {
  const [on, setOn] = useState(0)
  const t = tabs[on]
  const go = (i: number) => setOn((i + tabs.length) % tabs.length)
  return (
    <div className="ol-tabs">
      <div
        className="ol-tablist"
        role="tablist"
        aria-label="Features"
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(on + 1) }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(on - 1) }
        }}
      >
        {tabs.map((x, i) => (
          <button
            key={x.label}
            type="button"
            role="tab"
            id={`ol-tab-${i}`}
            aria-selected={i === on}
            aria-controls="ol-panel"
            tabIndex={i === on ? 0 : -1}
            className={`ol-tab ${i === on ? 'is-on' : ''}`}
            onClick={() => setOn(i)}
          >
            <span className="ol-tab-l">{x.label}</span>
            {i === on && (
              <span className="ol-tab-body">
                <span className="ol-tab-h">{x.h}</span>
                <span className="ol-tab-d">{x.d}</span>
                <span className="ol-points">
                  {x.points.map(p => <span key={p}><Icon.Check size={12} /> {p}</span>)}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="ol-stage" role="tabpanel" id="ol-panel" aria-labelledby={`ol-tab-${on}`}>
        <div className="ol-stage-in" key={on}><MockView m={t.mock} /></div>
      </div>
    </div>
  )
}

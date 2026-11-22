'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * Dropdown in the site's own style. A native <select> opens an OS-drawn menu that
 * CSS cannot touch, so the tools use this instead. Button + listbox pattern:
 * click, Enter, Space or ArrowDown opens; arrows move; Enter picks; Escape or a
 * click outside closes; focus returns to the button.
 */
export function Select<T extends string>({ value, options, onChange, label, className }: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const current = options.find(o => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  function show() {
    setActive(Math.max(0, options.findIndex(o => o.value === value)))
    setOpen(true)
  }
  function pick(i: number) {
    onChange(options[i].value)
    setOpen(false)
    btn.current?.focus()
  }

  return (
    <div className={`ui-select ${className ?? ''}`} ref={root}>
      <button
        ref={btn}
        type="button"
        className="form-input ui-select-btn"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={e => {
          if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); show(); return }
          if (!open) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, options.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
          else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active) }
          else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
        }}
      >
        <span className="ui-select-value">{current?.label}</span>
      </button>
      {open && (
        <ul className="ui-listbox" id={id} role="listbox" aria-label={label}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={i === active ? 'is-active' : undefined}
              onMouseEnter={() => setActive(i)}
              onMouseDown={e => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              {o.value === value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

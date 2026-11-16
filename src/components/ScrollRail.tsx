'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Overlay scrollbar drawn inside the page: a floating black pill on the right edge.
 * The native scrollbar is hidden in base.css so this takes no layout width.
 * Drag the pill, or click the rail to jump. Fades out when idle.
 */
export function ScrollRail() {
  const thumbRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hidden, setHidden] = useState(true)
  const idle = useRef<number | null>(null)
  const drag = useRef<{ startY: number; startScroll: number } | null>(null)

  useEffect(() => {
    let raf = 0
    const paint = () => {
      raf = 0
      const el = document.documentElement
      const thumb = thumbRef.current
      const rail = railRef.current
      if (!thumb || !rail) return
      const view = window.innerHeight
      const total = el.scrollHeight
      if (total <= view + 1) { setHidden(true); return }
      setHidden(false)
      const railH = rail.clientHeight
      const h = Math.max(48, (view / total) * railH)
      const y = (window.scrollY / (total - view)) * (railH - h)
      thumb.style.height = `${h}px`
      thumb.style.transform = `translateY(${y}px)`
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint) }
    const wake = () => {
      setActive(true)
      if (idle.current) window.clearTimeout(idle.current)
      idle.current = window.setTimeout(() => setActive(false), 1100)
      schedule()
    }
    paint()
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!dragging) return
    const move = (e: PointerEvent) => {
      const d = drag.current
      const rail = railRef.current
      const thumb = thumbRef.current
      if (!d || !rail || !thumb) return
      const el = document.documentElement
      const range = rail.clientHeight - thumb.offsetHeight
      const ratio = (el.scrollHeight - window.innerHeight) / Math.max(1, range)
      window.scrollTo({ top: d.startScroll + (e.clientY - d.startY) * ratio, behavior: 'instant' as ScrollBehavior })
    }
    const up = () => { setDragging(false); drag.current = null }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [dragging])

  function onThumbDown(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    drag.current = { startY: e.clientY, startScroll: window.scrollY }
    setDragging(true)
  }
  function onRailDown(e: React.PointerEvent) {
    const rail = railRef.current
    if (!rail) return
    const r = rail.getBoundingClientRect()
    const el = document.documentElement
    const ratio = (e.clientY - r.top) / r.height
    window.scrollTo({ top: ratio * (el.scrollHeight - window.innerHeight), behavior: 'smooth' })
  }

  return (
    <div
      ref={railRef}
      className={`srail ${active || dragging ? 'is-active' : ''} ${dragging ? 'is-dragging' : ''}`}
      hidden={hidden}
      aria-hidden="true"
      onPointerDown={onRailDown}
    >
      <div ref={thumbRef} className="srail-thumb" onPointerDown={onThumbDown} />
    </div>
  )
}

'use client'
import { useState } from 'react'

type Brand = { name: string; domain?: string }

const BRANDS: Brand[] = [
  { name: 'Blue Tokai',   domain: 'bluetokaicoffee.com' },
  { name: 'Third Wave',   domain: 'thirdwavecoffeeroasters.com' },
  { name: 'Sly Granny',   domain: 'slygranny.com' },
  { name: 'Big Chill',    domain: 'bigchillrestaurants.com' },
  { name: 'Indigo Deli',  domain: 'indigodeli.com' },
  { name: 'Kunafa World', domain: 'kunafaworld.in' },
]

function BrandLogo({ brand }: { brand: Brand }) {
  const [err, setErr] = useState(false)
  if (err || !brand.domain) return <span className="wordmark">{brand.name}</span>
  return (
    <img
      src={`https://logo.clearbit.com/${brand.domain}`}
      alt={brand.name}
      loading="lazy"
      onError={() => setErr(true)}
    />
  )
}

export function LogoCloud() {
  // Duplicate list so the marquee can translate -50% and loop seamlessly.
  const loop = [...BRANDS, ...BRANDS]
  return (
    <section className="container logos">
      <div className="logos-label">Powering 4,200+ outlets across India</div>
      <div className="logos-viewport">
        <div className="logos-track">
          {loop.map((b, i) => (
            <div className="logo-item" key={i} aria-hidden={i >= BRANDS.length}>
              <BrandLogo brand={b} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

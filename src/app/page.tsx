import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Strip } from '@/components/Strip'
import { Platform } from '@/components/Platform'
import { Crew } from '@/components/Crew'
import { Offline } from '@/components/Offline'
import { Outlets } from '@/components/Outlets'
import { Integrations } from '@/components/Integrations'
import { Testimonials } from '@/components/Testimonials'
import { WorkingWithUs } from '@/components/WorkingWithUs'
import { Changelog } from '@/components/Changelog'
import { FAQ } from '@/components/FAQ'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'
import { Reveals } from '@/components/Reveals'

/*
 * Order: what it is (hero, what it works with), what it does (the six modules),
 * who uses it, why it holds up (offline), where it fits (outlet types, integrations),
 * who is behind it, then questions and the close.
 */
export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Platform />
        <Crew />
        <Offline />
        <Outlets />
        <Integrations />
        <Testimonials />
        <WorkingWithUs />
        <Changelog />
        <FAQ />
        <CTA />
      </main>
      <Footer crew />
      <Reveals />
    </>
  )
}

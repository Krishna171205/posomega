import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Strip } from '@/components/Strip'
import { Platform } from '@/components/Platform'
import { Crew } from '@/components/Crew'
import { Offline } from '@/components/Offline'
import { Formats } from '@/components/Formats'
import { Integrations } from '@/components/Integrations'
import { Hardware } from '@/components/Hardware'
import { WorkingWithUs } from '@/components/WorkingWithUs'
import { Pricing } from '@/components/Pricing'
import { Changelog } from '@/components/Changelog'
import { FAQ } from '@/components/FAQ'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <Crew />
        <Platform />
        <Offline />
        <Formats />
        <Integrations />
        <Hardware />
        <WorkingWithUs />
        <Pricing />
        <Changelog />
        <FAQ />
        <CTA />
      </main>
      <Footer crew />
    </>
  )
}

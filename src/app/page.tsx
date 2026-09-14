import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Bento } from '@/components/Bento'
import { InteractivePosDemo } from '@/components/InteractivePosDemo'
import { Walkthrough } from '@/components/Walkthrough'
import { Industries } from '@/components/Industries'
import { Hardware } from '@/components/Hardware'
import { Integrations } from '@/components/Integrations'
import { Pricing } from '@/components/Pricing'
import { FAQ } from '@/components/FAQ'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Bento />
      <InteractivePosDemo />
      <Walkthrough />
      <Industries />
      <Hardware />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

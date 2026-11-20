import { Hero } from '@/components/sections/Hero'
import { TechHighlights } from '@/components/sections/TechHighlights'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Experience } from '@/components/sections/Experience'
import { Process } from '@/components/sections/Process'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/data/profile'

export function HomePage() {
  usePageMeta({ title: site.title, description: site.description, path: '/' })

  return (
    <>
      <Hero />
      <TechHighlights />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Experience />
      <Process />
    </>
  )
}

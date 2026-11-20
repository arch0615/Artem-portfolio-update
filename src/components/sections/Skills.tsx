import { useState } from 'react'
import type { SkillCategory } from '@/types'
import { skillsContent } from '@/data/content'
import { skillCategories } from '@/data/skills'
import { Container } from '@/components/layout/Container'
import { AnimatedSection, Reveal } from '@/components/ui/AnimatedSection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCategorySelector } from '@/components/skills/SkillCategorySelector'
import { SkillGrid } from '@/components/skills/SkillGrid'

const panelId = 'skills-panel'
const tabId = (category: SkillCategory) => `skills-tab-${category.id}`
const maxCount = Math.max(...skillCategories.map((category) => category.technologies.length))

/**
 * Skills: category tabs on the left (a scrolling row above the grid on smaller screens) and the
 * selected category's technologies on the right, each with its official logo. Content: `skills.ts`.
 */
export function Skills() {
  const [active, setActive] = useState(0)
  const category = skillCategories[active]

  return (
    <AnimatedSection id="skills" labelledBy="skills-title" className="overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow={skillsContent.eyebrow}
          title={skillsContent.title}
          description={skillsContent.description}
          // Desktop: the description runs on one line too. From 1280px its size eases down just enough to fit
          // the narrower desktops; between 1024 and 1280px it splits into two even lines.
          descriptionClassName="lg:max-w-none lg:text-balance xl:text-[length:min(1.125rem,calc((100vw_-_6rem)/70))]"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 lg:mt-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:items-start lg:gap-10 xl:gap-12">
          <Reveal>
            <SkillCategorySelector
              categories={skillCategories}
              active={active}
              onSelect={setActive}
              panelId={panelId}
              tabId={tabId}
            />
          </Reveal>
          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(category)}
            tabIndex={0}
            className="rounded-2xl outline-offset-4"
          >
            <SkillGrid category={category} maxCount={maxCount} />
          </div>
        </div>
      </Container>
    </AnimatedSection>
  )
}

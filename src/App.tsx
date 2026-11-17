import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { IntroProvider } from '@/components/intro/IntroProvider'
import { HomePage } from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

const CaseStudyPage = lazy(() => import('@/pages/CaseStudyPage'))

export function App() {
  // LazyMotion + `m` components ship only the animation features in use (no layout/drag code).
  // MotionConfig honours the visitor's "reduce motion" OS setting for every animation.
  // IntroProvider plays the intro overlay on top of the page on every fresh page load.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <IntroProvider>
          <BrowserRouter>
            <ScrollManager />
            <a
              href="#main"
              className="sr-only rounded-full bg-fg px-4 py-2 text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects/:slug" element={<CaseStudyPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </IntroProvider>
      </MotionConfig>
    </LazyMotion>
  )
}

function PageFallback() {
  return (
    <div className="grid min-h-dvh place-items-center" role="status" aria-label="Loading">
      <span className="size-6 animate-spin rounded-full border-2 border-line-strong border-t-accent-soft" />
    </div>
  )
}

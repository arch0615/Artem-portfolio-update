import { useEffect, useRef, useState } from 'react'
import { m, useInView } from 'framer-motion'
import { portrait } from '@/data/profile'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const srcSet = portrait.images.map((image) => `${image.src} ${image.width}w`).join(', ')
const fallbackSrc = portrait.images[Math.floor(portrait.images.length / 2)].src
/** Rendered frame width per breakpoint; keep in sync with the `max-w-*` classes below. */
const sizes = '(min-width: 1280px) 24rem, (min-width: 1024px) 22rem, (min-width: 640px) 24rem, 20rem'

/**
 * Full-length portrait on the right of the hero. Shows the still photo; when a looping clip is
 * configured (`portrait.videos`), it fades in over the photo once the intro has dissolved, pauses
 * while off screen and is never loaded for visitors who prefer reduced motion.
 */
export function HeroPortrait() {
  const revealed = useIntroRevealed()
  const reducedMotion = usePrefersReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(frameRef)
  const [playing, setPlaying] = useState(false)
  const hasVideo = portrait.videos.length > 0 && !reducedMotion
  const shouldPlay = hasVideo && revealed && inView

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (shouldPlay) {
      // Autoplay can still be refused (e.g. battery saver); the still photo then simply stays.
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [shouldPlay])

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
      className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[22rem] xl:max-w-[24rem]"
    >
      {/* Blue and violet glow around the frame, echoing the photo's own lighting */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-12 motion-safe:animate-glow">
        <div className="absolute inset-y-0 left-0 w-3/4 bg-[radial-gradient(closest-side,rgb(59_130_246/0.2),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-3/4 bg-[radial-gradient(closest-side,rgb(139_92_246/0.22),transparent)]" />
      </div>

      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface card-highlight"
        style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
      >
        <img
          src={fallbackSrc}
          srcSet={srcSet}
          sizes={sizes}
          width={portrait.width}
          height={portrait.height}
          alt={portrait.alt}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        {hasVideo && (
          // `object-contain`: a clip in another aspect ratio is never cropped (head to feet stay
          // visible); any uncovered edge shows the matching still photo underneath.
          <video
            ref={videoRef}
            aria-hidden
            tabIndex={-1}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            onPlaying={() => setPlaying(true)}
            className={cn(
              'absolute inset-0 size-full object-contain transition-opacity duration-700',
              playing ? 'opacity-100' : 'opacity-0',
            )}
          >
            {portrait.videos.map((video) => (
              <source key={video.src} src={video.src} type={video.type} />
            ))}
          </video>
        )}
      </div>
    </m.div>
  )
}

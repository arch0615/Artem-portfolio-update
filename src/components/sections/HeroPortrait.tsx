import { useEffect, useRef, useState } from 'react'
import { m, useInView } from 'framer-motion'
import { portrait } from '@/data/profile'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { useIntroRevealed } from '@/components/intro/intro-context'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const srcSet = portrait.images.map((image) => `${image.src} ${image.width}w`).join(', ')
const fallbackSrc = portrait.images[Math.floor(portrait.images.length / 2)].src
/** The frame takes the clip's aspect ratio when there is one, so the clip is never cropped. */
const frame = portrait.video ?? portrait
/**
 * Rendered width of the still image: it covers the frame, so it is the frame height (`h-*` classes
 * below) times the image's 2:3 aspect ratio.
 */
const sizes = '(min-width: 1280px) 24rem, (min-width: 1024px) 22rem, (min-width: 640px) 24rem, 20rem'

type ClipStatus = 'waiting' | 'playing' | 'failed'

/**
 * Full-length portrait on the right of the hero. The animated clip (`portrait.video`) is the main
 * visual; the still image sits underneath as the placeholder until the clip plays, and stays on its
 * own with reduced motion or if the clip can't load or autoplay is refused.
 *
 * Loading and playback: nothing of the clip is requested until the frame is close to the viewport
 * (then only its metadata); it starts once the intro has dissolved and the frame is on screen, and
 * pauses whenever the frame is scrolled out of view.
 */
export function HeroPortrait() {
  const revealed = useIntroRevealed()
  const reducedMotion = usePrefersReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(frameRef)
  const nearView = useInView(frameRef, { once: true, margin: '25% 0px' })
  const [status, setStatus] = useState<ClipStatus>('waiting')
  const clip = !reducedMotion && status !== 'failed' ? portrait.video : undefined
  const shouldPlay = Boolean(clip) && nearView && revealed && inView

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!shouldPlay) {
      video.pause()
      return
    }
    video.muted = true // Required for autoplay; React doesn't reflect `muted` as an attribute.
    video.play().catch((error: unknown) => {
      // Autoplay refused (e.g. battery saver): keep the still image. An AbortError only means a
      // pause() (scrolled away) interrupted the start, which is expected.
      if (error instanceof DOMException && error.name === 'NotAllowedError') setStatus('failed')
    })
  }, [shouldPlay])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Errors from <source> elements don't bubble but do reach a capturing listener. The clip has
    // failed when the last source fails, or when the video itself errors (e.g. while decoding).
    const onError = (event: Event) => {
      if (event.target === video || event.target === video.lastElementChild) setStatus('failed')
    }
    video.addEventListener('error', onError, true)
    return () => video.removeEventListener('error', onError, true)
  }, [clip])

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
      className="relative mx-auto w-fit max-w-full"
    >
      {/* Blue and violet glow around the frame, echoing the portrait's own lighting */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-12 motion-safe:animate-glow">
        <div className="absolute inset-y-0 left-0 w-3/4 bg-[radial-gradient(closest-side,rgb(59_130_246/0.2),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-3/4 bg-[radial-gradient(closest-side,rgb(139_92_246/0.22),transparent)]" />
      </div>

      <div
        ref={frameRef}
        className="relative isolate h-[30rem] max-w-full transform-gpu overflow-hidden rounded-[1.75rem] bg-surface card-highlight sm:h-[36rem] lg:h-[33rem] xl:h-[36rem]"
        style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
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
        {clip && (
          <video
            ref={videoRef}
            aria-hidden
            tabIndex={-1}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            onPlaying={() => setStatus('playing')}
            className={cn(
              // `object-contain` in a frame of the clip's own aspect ratio: shown whole, never cropped or stretched.
              'absolute inset-0 size-full object-contain transition-opacity duration-700',
              status === 'playing' ? 'opacity-100' : 'opacity-0',
            )}
          >
            {/* Sources are added only near the viewport, so nothing is downloaded before it's needed. */}
            {nearView &&
              clip.sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
          </video>
        )}
        {/* Border drawn on top, so it doesn't shrink the frame's content box */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] border border-line" />
      </div>
    </m.div>
  )
}

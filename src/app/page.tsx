'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ValentinePage() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [noStyle, setNoStyle] = useState<any>({})
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  const searchParams = useSearchParams()
  const name = searchParams.get('name') || 'My Love'

  useEffect(() => {
    setMounted(true)

    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    checkScreen()
    window.addEventListener('resize', checkScreen)

    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  /* ---------- INITIAL POSITION ---------- */
  useEffect(() => {
    if (!containerRef.current || !noButtonRef.current) return

    const setInitialPosition = () => {
      const c = containerRef.current!.getBoundingClientRect()
      const b = noButtonRef.current!.getBoundingClientRect()
      const padding = 16

      const left = isSmallScreen
        ? c.width / 2 - b.width / 2
        : Math.min(c.width - b.width - padding, c.width * 0.65)

      const top = isSmallScreen
        ? c.height * 0.65
        : c.height / 2 - b.height / 2

      setNoStyle({
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
      })
    }

    setInitialPosition()
    window.addEventListener('resize', setInitialPosition)

    return () => window.removeEventListener('resize', setInitialPosition)
  }, [mounted, isSmallScreen])

  /* ---------- INSTANT ESCAPE ---------- */
  const instantEscape = () => {
    if (!containerRef.current || !noButtonRef.current) return

    const c = containerRef.current.getBoundingClientRect()
    const b = noButtonRef.current.getBoundingClientRect()
    const padding = 20

    const maxX = c.width - b.width - padding
    const maxY = c.height - b.height - padding

    setNoStyle({
      position: 'absolute',
      left: `${Math.random() * maxX + padding}px`,
      top: `${Math.random() * maxY + padding}px`,
    })
  }

  /* ---------- PRE-HOVER DETECTION ---------- */
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!noButtonRef.current) return

    const b = noButtonRef.current.getBoundingClientRect()

    const distance = Math.hypot(
      e.clientX - (b.left + b.width / 2),
      e.clientY - (b.top + b.height / 2)
    )

    if (distance < 70) {
      instantEscape()
    }
  }

  if (!mounted) return null
  if (showCelebration) return <CelebrationScreen name={name} />

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* FLOATING EMOJIS (MAIN SCREEN) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-xl sm:text-2xl opacity-25 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {['💖', '💕', '✨', '🌸', '💝'][i % 5]}
          </span>
        ))}
      </div>

      <div className="relative text-center space-y-8 w-full max-w-3xl">

        {/* TITLE */}
        <h1
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-bold
            bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400
            bg-clip-text text-transparent
          "
        >
          Will you be my Valentine, {name}?
        </h1>

        {/* BUTTON AREA */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative h-56 sm:h-64 w-full flex items-center justify-center"
        >
          {/* YES BUTTON */}
          <button
            onClick={() => setShowCelebration(true)}
            className={`
              absolute
              px-6 py-3
              sm:px-8 sm:py-4
              text-base sm:text-lg md:text-xl
              font-semibold
              rounded-xl
              bg-gradient-to-r from-green-400 to-emerald-500
              text-white shadow-lg
              hover:scale-105 transition
              ${isSmallScreen
                ? 'top-6 left-1/2 -translate-x-1/2'
                : 'left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2'
              }
            `}
          >
            💚 Yes!
          </button>

          {/* NO BUTTON */}
          <button
            ref={noButtonRef}
            style={{
              ...noStyle,
              pointerEvents: 'none',
            }}
            className="
              px-6 py-3
              sm:px-8 sm:py-4
              text-base sm:text-lg md:text-xl
              font-semibold
              rounded-xl
              bg-gradient-to-r from-rose-400 to-pink-500
              text-white shadow-lg
              select-none
            "
          >
            💔 No
          </button>
        </div>
      </div>

      {/* COPYRIGHT */}
      <footer className="mt-12 text-xs sm:text-sm text-pink-400 opacity-80 text-center relative z-10">
        © {new Date().getFullYear()} — Built with ❤️ by{' '}
        <span className="font-medium">
          sonuparjapat.connect@gmail.com
        </span>
      </footer>

      {/* FLOAT ANIMATION */}
      {/* <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style> */}
    </div>
  )
}

/* ---------- CELEBRATION ---------- */

function CelebrationScreen({ name }: { name: string }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 overflow-hidden px-4">

      {/* FLOATING EMOJIS (CELEBRATION) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {['💖', '💕', '✨', '🌸', '💝'][i % 5]}
          </span>
        ))}
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl px-8 py-10 sm:px-12 sm:py-14 text-center space-y-5 max-w-xl w-full">

        <h1
          className="
            text-4xl
            sm:text-5xl
            md:text-6xl
            font-bold
            text-pink-600
          "
        >
          YAY! 💖
        </h1>

        <p
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-semibold
            text-rose-600
          "
        >
          I’m so happy, {name}! 🥰
        </p>

        <p className="text-base sm:text-lg text-gray-600">
          You just made this moment unforgettable 🌹
        </p>

        <div className="pt-4 flex justify-center space-x-4 text-2xl sm:text-3xl">
          <span className="animate-bounce">💐</span>
          <span className="animate-bounce delay-150">🍫</span>
          <span className="animate-bounce delay-300">💝</span>
        </div>
      </div>
    </div>
  )
}
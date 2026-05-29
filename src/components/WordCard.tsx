import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Word } from '../types'
import type { StudyDirection } from '../utils/studyHelpers'
import { IconCheck, IconVolume, IconX } from './icons'
import { speakEnglish } from '../utils/speech'

interface WordCardProps {
  word: Word
  direction?: StudyDirection
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const SWIPE_THRESHOLD = 80

function WordDetailOverlay({
  word,
  direction,
  onClose,
}: {
  word: Word
  direction: StudyDirection
  onClose: () => void
}) {
  const isReverse = direction === 'ja-to-en'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="単語の詳細"
    >
      <div className="detail-backdrop absolute inset-0 bg-zinc-900/45 backdrop-blur-[3px]" />

      <div
        className="detail-zoom relative max-h-[min(80dvh,640px)] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/95 px-5 py-3 backdrop-blur-sm">
          <span className="text-xs tabular-nums text-zinc-400">
            #{word.no.toString().padStart(3, '0')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="閉じる"
          >
            <IconX width={18} height={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          {isReverse ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                英語
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-snug tracking-tight text-zinc-900">
                {word.english}
              </h2>
              {word.phonetic && (
                <p className="mt-2 font-mono text-sm text-zinc-400">{word.phonetic}</p>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold leading-snug tracking-tight text-zinc-900">
                {word.english}
              </h2>
              {word.phonetic && (
                <p className="mt-2 font-mono text-sm text-zinc-400">{word.phonetic}</p>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => speakEnglish(word.english)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <IconVolume width={14} height={14} />
            発音を聞く
          </button>

          <div className="mt-6 space-y-5 border-t border-zinc-100 pt-5">
            {!isReverse && word.meaning && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  意味
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-900">{word.meaning}</p>
              </section>
            )}
            {isReverse && word.meaning && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  意味（確認）
                </p>
                <p className="mt-1.5 text-sm text-zinc-600">{word.meaning}</p>
              </section>
            )}
            {word.example && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  例文
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{word.example}</p>
              </section>
            )}
            {word.similar && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  類似
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{word.similar}</p>
              </section>
            )}
            {word.note && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  補足
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{word.note}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function WordCard({
  word,
  direction = 'en-to-ja',
  onSwipeLeft,
  onSwipeRight,
}: WordCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const isHorizontal = useRef<boolean | null>(null)
  const didSwipe = useRef(false)

  const isReverse = direction === 'ja-to-en'
  const frontPrimary = isReverse
    ? word.meaning || '（意味未設定）'
    : word.english
  const frontSecondary = isReverse ? null : word.phonetic

  const resetDrag = useCallback(() => {
    setOffsetX(0)
    setIsDragging(false)
    isHorizontal.current = null
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (detailOpen) return
    didSwipe.current = false
    startX.current = e.clientX
    startY.current = e.clientY
    isHorizontal.current = null
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || detailOpen) return
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (isHorizontal.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }
    if (isHorizontal.current) {
      setOffsetX(dx)
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (offsetX > SWIPE_THRESHOLD) {
      didSwipe.current = true
      onSwipeRight()
    } else if (offsetX < -SWIPE_THRESHOLD) {
      didSwipe.current = true
      onSwipeLeft()
    }
    resetDrag()
  }

  const handleTap = () => {
    if (detailOpen || didSwipe.current || Math.abs(offsetX) >= 5) return
    setDetailOpen(true)
  }

  const rotation = offsetX * 0.025
  const leftHintOpacity = offsetX < -20 ? Math.min(Math.abs(offsetX) / SWIPE_THRESHOLD, 1) : 0
  const rightHintOpacity = offsetX > 20 ? Math.min(offsetX / SWIPE_THRESHOLD, 1) : 0

  return (
    <>
      <div className="relative mx-auto w-full max-w-md select-none">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-6"
          aria-hidden
        >
          <div
            className="rounded-lg border-2 border-amber-400 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600"
            style={{ opacity: leftHintOpacity, transform: 'rotate(-12deg)' }}
          >
            Again
          </div>
          <div
            className="rounded-lg border-2 border-emerald-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600"
            style={{ opacity: rightHintOpacity, transform: 'rotate(12deg)' }}
          >
            Got it
          </div>
        </div>

        <div
          className={`touch-none transition-transform duration-300 ${
            detailOpen ? 'scale-[0.96] opacity-50' : ''
          }`}
          style={{
            transform: detailOpen
              ? undefined
              : `translateX(${offsetX}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleTap}
        >
          <article className="cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-6 shadow-[var(--shadow-card)] transition-shadow active:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-medium tabular-nums text-zinc-400">
                #{word.no.toString().padStart(3, '0')}
                {isReverse && (
                  <span className="ml-2 text-zinc-300">· 日→英</span>
                )}
              </span>
              {!isReverse && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    speakEnglish(word.english)
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
                  aria-label="発音を聞く"
                >
                  <IconVolume width={18} height={18} />
                </button>
              )}
            </div>

            <h2
              className={`mt-3 font-semibold leading-snug tracking-tight text-zinc-900 ${
                isReverse ? 'text-[1.25rem]' : 'text-[1.375rem]'
              }`}
            >
              {frontPrimary}
            </h2>
            {frontSecondary && (
              <p className="mt-2 font-mono text-sm text-zinc-400">{frontSecondary}</p>
            )}
          </article>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onSwipeLeft}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-3.5 text-zinc-600 transition-all active:scale-[0.97] hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800"
            aria-label="間違えた"
          >
            <IconX width={20} height={20} />
            <span className="text-[11px] font-medium">Again</span>
          </button>
          <button
            type="button"
            onClick={() => speakEnglish(word.english)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white py-3.5 text-zinc-600 transition-all active:scale-[0.97] hover:bg-zinc-50 hover:text-zinc-900"
            aria-label="発音"
          >
            <IconVolume width={20} height={20} />
            <span className="text-[11px] font-medium">Listen</span>
          </button>
          <button
            type="button"
            onClick={onSwipeRight}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-zinc-900 bg-zinc-900 py-3.5 text-white transition-all active:scale-[0.97] hover:bg-zinc-800"
            aria-label="覚えた"
          >
            <IconCheck width={20} height={20} />
            <span className="text-[11px] font-medium">Got it</span>
          </button>
        </div>
      </div>

      {detailOpen && (
        <WordDetailOverlay
          word={word}
          direction={direction}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StudyOptions } from '../components/StudyOptions'
import { WordCard } from '../components/WordCard'
import { Button, EmptyState, PageHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useApp } from '../hooks/useAppData'
import { useStudySettings } from '../hooks/useStudySettings'
import { shuffleArray } from '../utils/studyHelpers'
import { filterWordsByMode, getStats } from '../types'

export function ReviewPage() {
  const { progress, words, setWordStatus } = useApp()
  const { direction, shuffle: shuffleOn, setDirection, setShuffle } = useStudySettings()
  const [index, setIndex] = useState(0)
  const [sessionKey, setSessionKey] = useState(0)
  const [shuffleSeed, setShuffleSeed] = useState(0)

  const stats = useMemo(() => getStats(words, progress), [words, progress])

  const baseQueue = useMemo(
    () => filterWordsByMode(words, progress, 'review'),
    [words, progress],
  )

  const queue = useMemo(() => {
    if (!shuffleOn) return baseQueue
    return shuffleArray([...baseQueue])
  }, [baseQueue, shuffleOn, shuffleSeed])

  const currentWord = queue[index]

  const handleAnswer = (status: 'known' | 'unknown') => {
    if (!currentWord) return
    setWordStatus(currentWord.id, status)
    setSessionKey((k) => k + 1)
    setIndex((i) => i + 1)
  }

  const resetSession = () => {
    setIndex(0)
    setSessionKey((k) => k + 1)
    setShuffleSeed((s) => s + 1)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="復習" subtitle={`要復習 ${stats.unknown} 語`} />

      {words.length === 0 ? (
        <EmptyState
          title="単語データがありません"
          description="data/words.tsv を配置してください。"
        />
      ) : queue.length === 0 ? (
        <EmptyState
          title="復習する単語はありません"
          description="学習中に間違えた単語がここに集まります。"
          action={
            <Link to="/">
              <Button size="lg">学習を始める</Button>
            </Link>
          }
        />
      ) : index >= queue.length ? (
        <EmptyState
          title="復習完了"
          description="まだ間違えている単語は復習リストに残ります。"
          action={
            <Button onClick={resetSession} size="lg">
              もう一度復習
            </Button>
          }
        />
      ) : (
        <>
          <StudyOptions
            direction={direction}
            shuffle={shuffleOn}
            onDirectionChange={setDirection}
            onShuffleChange={(s) => {
              setShuffle(s)
              resetSession()
            }}
          />

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm leading-relaxed text-amber-950/80">
            間違えたフレーズを重点的に復習します。
          </div>

          <div className="space-y-2">
            <div className="text-xs tabular-nums text-zinc-500">
              {index + 1} / {queue.length}
            </div>
            <ProgressBar value={index} max={queue.length} />
          </div>

          <WordCard
            key={`${currentWord?.id}-${sessionKey}`}
            word={currentWord!}
            direction={direction}
            onSwipeLeft={() => handleAnswer('unknown')}
            onSwipeRight={() => handleAnswer('known')}
          />
        </>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { StudyOptions } from '../components/StudyOptions'
import { WordCard } from '../components/WordCard'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button, EmptyState, PageHeader } from '../components/ui/PageHeader'
import { ProgressBar, StatBar } from '../components/ui/ProgressBar'
import { useApp } from '../hooks/useAppData'
import { useStudySettings } from '../hooks/useStudySettings'
import { shuffleArray } from '../utils/studyHelpers'
import {
  filterWordsByMode,
  getSections,
  getStats,
  type StudyMode,
} from '../types'

export function StudyPage() {
  const { progress, words, setWordStatus } = useApp()
  const { direction, shuffle: shuffleOn, setDirection, setShuffle } = useStudySettings()
  const [mode, setMode] = useState<StudyMode>('new')
  const [section, setSection] = useState<string>('')
  const [index, setIndex] = useState(0)
  const [sessionKey, setSessionKey] = useState(0)
  const [shuffleSeed, setShuffleSeed] = useState(0)

  const sections = useMemo(() => getSections(words), [words])
  const stats = useMemo(() => getStats(words, progress), [words, progress])

  const baseQueue = useMemo(
    () => filterWordsByMode(words, progress, mode, section || undefined),
    [words, progress, mode, section],
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

  if (words.length === 0) {
    return (
      <EmptyState
        title="単語データがありません"
        description="data/words.tsv にスプレッドシートのデータを配置し、開発サーバーを再起動してください。"
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="学習" subtitle={`全 ${stats.total} 語`}>
        <StatBar
          known={stats.known}
          unknown={stats.unknown}
          notStarted={stats.notStarted}
          total={stats.total}
        />
      </PageHeader>

      <SegmentedControl
        value={mode}
        onChange={(m) => {
          setMode(m)
          resetSession()
        }}
        options={[
          { value: 'new', label: '未学習' },
          { value: 'all', label: 'すべて' },
          { value: 'review', label: '復習' },
        ]}
      />

      <StudyOptions
        direction={direction}
        shuffle={shuffleOn}
        onDirectionChange={(d) => {
          setDirection(d)
          resetSession()
        }}
        onShuffleChange={(s) => {
          setShuffle(s)
          resetSession()
        }}
      />

      {sections.length > 1 && (
        <select
          value={section}
          onChange={(e) => {
            setSection(e.target.value)
            resetSession()
          }}
          className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-[var(--shadow-card)] outline-none focus:border-zinc-400"
        >
          <option value="">すべてのセクション</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {queue.length === 0 ? (
        <EmptyState
          title={
            mode === 'new'
              ? '未学習の単語はありません'
              : mode === 'review'
                ? '復習する単語はありません'
                : '該当する単語がありません'
          }
          description={
            mode === 'review'
              ? '学習中に間違えた単語が復習リストに追加されます。'
              : undefined
          }
        />
      ) : index >= queue.length ? (
        <EmptyState
          title="セッション完了"
          description={`${queue.length} 語を学習しました。`}
          action={
            <Button onClick={resetSession} size="lg">
              もう一度
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span className="tabular-nums">
                {index + 1} / {queue.length}
              </span>
              {currentWord?.section && currentWord.section !== '未分類' && (
                <span>{currentWord.section}</span>
              )}
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

          <p className="text-center text-[11px] text-zinc-400">
            左スワイプ — Again　·　右スワイプ — Got it
          </p>
        </>
      )}
    </div>
  )
}

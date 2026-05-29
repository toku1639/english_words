import { useMemo, useState } from 'react'
import { IconChevronDown, IconChevronUp, IconSearch, IconVolume } from '../components/icons'
import { StatusBadge, StatusIcon } from '../components/StatusBadge'
import { Button, EmptyState, PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../hooks/useAppData'
import { searchWords } from '../utils/studyHelpers'
import { getSections, getStats, getWordStatus, STATUS_LABELS, type Word, type WordStatus } from '../types'
import { speakEnglish } from '../utils/speech'

type FilterStatus = 'all' | WordStatus

export function ListPage() {
  const { progress, words, resetSingleProgress } = useApp()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)

  const sections = useMemo(() => getSections(words), [words])
  const stats = useMemo(() => getStats(words, progress), [words, progress])

  const filteredByStatus = useMemo(() => {
    let result = filter === 'all' ? words : words.filter((w) => getWordStatus(w.id, progress) === filter)
    if (searchQuery.trim()) {
      result = searchWords(result, searchQuery)
    }
    return result
  }, [words, progress, filter, searchQuery])

  const grouped = useMemo(() => {
    const map = new Map<string, Word[]>()
    for (const word of filteredByStatus) {
      const section = word.section || '未分類'
      if (!map.has(section)) map.set(section, [])
      map.get(section)!.push(word)
    }
    return map
  }, [filteredByStatus])

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  if (words.length === 0) {
    return <EmptyState title="単語データがありません" />
  }

  return (
    <div className="space-y-5">
      <PageHeader title="一覧" subtitle={`${stats.known} 覚えた · ${stats.unknown} 要復習 · ${stats.notStarted} 未学習`} />

      <div className="relative">
        <IconSearch
          width={16}
          height={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="英語・意味・例文で検索"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-800 shadow-[var(--shadow-card)] outline-none placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </div>

      {searchQuery && (
        <p className="text-xs text-zinc-500">{filteredByStatus.length} 件ヒット</p>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(['all', 'not_started', 'known', 'unknown'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {f === 'all' ? 'すべて' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sections
          .filter((s) => grouped.has(s))
          .map((section) => {
            const sectionWords = grouped.get(section) ?? []
            const isOpen = expandedSection === section || expandedSection === null

            const sectionStats = {
              known: sectionWords.filter((w) => getWordStatus(w.id, progress) === 'known').length,
              unknown: sectionWords.filter((w) => getWordStatus(w.id, progress) === 'unknown').length,
              notStarted: sectionWords.filter((w) => getWordStatus(w.id, progress) === 'not_started').length,
            }

            return (
              <section
                key={section}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[var(--shadow-card)]"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-zinc-50/80"
                >
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900">{section}</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {sectionWords.length} 語 · {sectionStats.known} 覚えた · {sectionStats.unknown} 要復習
                    </p>
                  </div>
                  {isOpen ? (
                    <IconChevronUp width={18} height={18} className="shrink-0 text-zinc-400" />
                  ) : (
                    <IconChevronDown width={18} height={18} className="shrink-0 text-zinc-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-100">
                    {sectionWords.map((word, i) => {
                      const status = getWordStatus(word.id, progress)
                      return (
                        <button
                          key={word.id}
                          type="button"
                          onClick={() => setSelectedWord(word)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 ${
                            i > 0 ? 'border-t border-zinc-50' : ''
                          }`}
                        >
                          <span className="w-8 shrink-0 text-xs tabular-nums text-zinc-400">
                            {word.no}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800">
                            {word.english}
                          </span>
                          <StatusIcon status={status} />
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
      </div>

      {filteredByStatus.length === 0 && (
        <EmptyState title="該当する単語がありません" description="検索条件を変えてみてください。" />
      )}

      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          status={getWordStatus(selectedWord.id, progress)}
          onClose={() => setSelectedWord(null)}
          onReset={() => resetSingleProgress(selectedWord.id)}
        />
      )}
    </div>
  )
}

function WordDetailModal({
  word,
  status,
  onClose,
  onReset,
}: {
  word: Word
  status: WordStatus
  onClose: () => void
  onReset: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs tabular-nums text-zinc-400">#{word.no.toString().padStart(3, '0')}</p>
              <h2 className="mt-1 text-xl font-semibold leading-snug text-zinc-900">{word.english}</h2>
              {word.phonetic && (
                <p className="mt-1.5 font-mono text-sm text-zinc-400">{word.phonetic}</p>
              )}
            </div>
            <StatusBadge status={status} size="md" />
          </div>

          <div className="mt-5 space-y-4 border-t border-zinc-100 pt-5 text-sm">
            {word.meaning && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">意味</p>
                <p className="mt-1.5 text-zinc-800">{word.meaning}</p>
              </div>
            )}
            {word.example && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">例文</p>
                <p className="mt-1.5 leading-relaxed text-zinc-700">{word.example}</p>
              </div>
            )}
            {word.similar && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">類似</p>
                <p className="mt-1.5 leading-relaxed text-zinc-700">{word.similar}</p>
              </div>
            )}
            {word.note && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">補足</p>
                <p className="mt-1.5 leading-relaxed text-zinc-600">{word.note}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => speakEnglish(word.english)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <IconVolume width={16} height={16} />
              発音
            </button>
            <Button
              variant="secondary"
              onClick={() => {
                onReset()
                onClose()
              }}
            >
              リセット
            </Button>
            <Button variant="primary" onClick={onClose}>
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

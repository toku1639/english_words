export type WordStatus = 'not_started' | 'known' | 'unknown'

export interface Word {
  id: string
  no: number
  english: string
  phonetic: string
  meaning: string
  example: string
  similar: string
  note: string
  section: string
}

export interface WordProgress {
  wordId: string
  status: WordStatus
  lastReviewed?: string
  reviewCount: number
}

export type StudyMode = 'all' | 'new' | 'review'

export const STATUS_LABELS: Record<WordStatus, string> = {
  not_started: '未学習',
  known: '覚えた',
  unknown: '要復習',
}

export function getWordStatus(
  wordId: string,
  progress: Record<string, WordProgress>,
): WordStatus {
  return progress[wordId]?.status ?? 'not_started'
}

export function getSections(words: Word[]): string[] {
  const sections = [...new Set(words.map((w) => w.section || '未分類'))]
  return sections.sort((a, b) => {
    if (a === '未分類') return 1
    if (b === '未分類') return -1
    return a.localeCompare(b, 'ja')
  })
}

export function filterWordsByMode(
  words: Word[],
  progress: Record<string, WordProgress>,
  mode: StudyMode,
  section?: string,
): Word[] {
  let filtered = section
    ? words.filter((w) => (w.section || '未分類') === section)
    : words

  if (mode === 'new') {
    filtered = filtered.filter(
      (w) => getWordStatus(w.id, progress) === 'not_started',
    )
  } else if (mode === 'review') {
    filtered = filtered.filter(
      (w) => getWordStatus(w.id, progress) === 'unknown',
    )
  }

  return filtered.sort((a, b) => a.no - b.no)
}

export function getStats(words: Word[], progress: Record<string, WordProgress>) {
  let known = 0
  let unknown = 0
  let notStarted = 0

  for (const word of words) {
    const status = getWordStatus(word.id, progress)
    if (status === 'known') known++
    else if (status === 'unknown') unknown++
    else notStarted++
  }

  return { known, unknown, notStarted, total: words.length }
}

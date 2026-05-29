import type { WordProgress, WordStatus } from '../types'

const STORAGE_KEY = 'english-word-app-progress'

export function loadProgress(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, WordProgress>
    return parsed ?? {}
  } catch {
    return {}
  }
}

export function saveProgress(progress: Record<string, WordProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function updateWordStatus(
  progress: Record<string, WordProgress>,
  wordId: string,
  status: WordStatus,
): Record<string, WordProgress> {
  const existing = progress[wordId]
  return {
    ...progress,
    [wordId]: {
      wordId,
      status,
      lastReviewed: new Date().toISOString(),
      reviewCount: (existing?.reviewCount ?? 0) + 1,
    },
  }
}

export function resetProgress(): Record<string, WordProgress> {
  return {}
}

export function resetWordProgress(
  progress: Record<string, WordProgress>,
  wordId: string,
): Record<string, WordProgress> {
  const next = { ...progress }
  delete next[wordId]
  return next
}

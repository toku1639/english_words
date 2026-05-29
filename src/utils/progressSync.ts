import type { WordProgress } from '../types'
import type { StudyMeta } from './studyMeta'

export const PROGRESS_EXPORT_VERSION = 1

export interface ProgressExport {
  version: number
  exportedAt: string
  progress: Record<string, WordProgress>
  meta?: StudyMeta
}

export function mergeProgress(
  local: Record<string, WordProgress>,
  remote: Record<string, WordProgress>,
): Record<string, WordProgress> {
  const merged = { ...local }

  for (const [id, remoteEntry] of Object.entries(remote)) {
    const localEntry = merged[id]
    if (!localEntry) {
      merged[id] = remoteEntry
      continue
    }

    const remoteTime = remoteEntry.lastReviewed
      ? new Date(remoteEntry.lastReviewed).getTime()
      : 0
    const localTime = localEntry.lastReviewed
      ? new Date(localEntry.lastReviewed).getTime()
      : 0

    if (
      remoteTime > localTime ||
      (remoteTime === localTime && remoteEntry.reviewCount > localEntry.reviewCount)
    ) {
      merged[id] = remoteEntry
    }
  }

  return merged
}

export function parseProgressExport(json: string): ProgressExport {
  const parsed = JSON.parse(json) as ProgressExport
  if (!parsed || typeof parsed !== 'object' || !parsed.progress) {
    throw new Error('無効な進捗データです')
  }
  return parsed
}

export function createProgressExport(
  progress: Record<string, WordProgress>,
  meta?: StudyMeta,
): ProgressExport {
  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    meta,
  }
}

export async function fetchRemoteProgress(): Promise<ProgressExport | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}progress.json`, { cache: 'no-cache' })
    if (!res.ok) return null
    const data = (await res.json()) as ProgressExport
    if (!data?.progress) return null
    return data
  } catch {
    return null
  }
}

export function downloadProgressJson(exportData: ProgressExport, filename?: string) {
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `vocab-progress-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

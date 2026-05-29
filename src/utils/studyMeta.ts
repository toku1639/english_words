const META_KEY = 'english-word-app-meta'

export interface StudyMeta {
  dailyCounts: Record<string, number>
}

const DEFAULT_META: StudyMeta = { dailyCounts: {} }

export function loadMeta(): StudyMeta {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return { ...DEFAULT_META }
    const parsed = JSON.parse(raw) as StudyMeta
    return { dailyCounts: parsed.dailyCounts ?? {} }
  } catch {
    return { ...DEFAULT_META }
  }
}

export function saveMeta(meta: StudyMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta))
}

export function mergeMeta(local: StudyMeta, remote: StudyMeta): StudyMeta {
  const dailyCounts = { ...local.dailyCounts }
  for (const [date, count] of Object.entries(remote.dailyCounts ?? {})) {
    dailyCounts[date] = Math.max(dailyCounts[date] ?? 0, count)
  }
  return { dailyCounts }
}

export function recordStudyToday(meta: StudyMeta): StudyMeta {
  const today = new Date().toISOString().slice(0, 10)
  return {
    dailyCounts: {
      ...meta.dailyCounts,
      [today]: (meta.dailyCounts[today] ?? 0) + 1,
    },
  }
}

export function getTodayCount(meta: StudyMeta): number {
  const today = new Date().toISOString().slice(0, 10)
  return meta.dailyCounts[today] ?? 0
}

export function getStudyStreak(meta: StudyMeta): number {
  const dates = new Set(Object.keys(meta.dailyCounts).filter((d) => meta.dailyCounts[d] > 0))
  if (dates.size === 0) return 0

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (!dates.has(key)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getLast7Days(meta: StudyMeta): { date: string; count: number; label: string }[] {
  const days: { date: string; count: number; label: string }[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  for (let i = 6; i >= 0; i--) {
    const d = new Date(cursor)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
    days.push({
      date: key,
      count: meta.dailyCounts[key] ?? 0,
      label: weekday,
    })
  }

  return days
}

export function resetMeta(): StudyMeta {
  return { ...DEFAULT_META }
}

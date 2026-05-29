import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { WORDS } from '../data/words'
import type { Word, WordProgress, WordStatus } from '../types'
import {
  createProgressExport,
  downloadProgressJson,
  fetchRemoteProgress,
  mergeProgress,
  parseProgressExport,
} from '../utils/progressSync'
import {
  getLast7Days,
  getStudyStreak,
  getTodayCount,
  loadMeta,
  mergeMeta,
  recordStudyToday,
  resetMeta,
  saveMeta,
  type StudyMeta,
} from '../utils/studyMeta'
import {
  loadProgress,
  resetProgress,
  resetWordProgress,
  saveProgress,
  updateWordStatus,
} from '../utils/storage'

interface AppContextValue {
  words: Word[]
  progress: Record<string, WordProgress>
  meta: StudyMeta
  setWordStatus: (wordId: string, status: WordStatus) => void
  resetAllProgress: () => void
  resetSingleProgress: (wordId: string) => void
  exportProgress: () => void
  importProgressFromFile: (file: File) => Promise<void>
  todayCount: number
  streak: number
  last7Days: ReturnType<typeof getLast7Days>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Record<string, WordProgress>>(() => loadProgress())
  const [meta, setMeta] = useState<StudyMeta>(() => loadMeta())
  const [remoteSynced, setRemoteSynced] = useState(false)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    saveMeta(meta)
  }, [meta])

  useEffect(() => {
    if (remoteSynced) return
    fetchRemoteProgress().then((remote) => {
      if (!remote) return
      setProgress((prev) => mergeProgress(prev, remote.progress))
      if (remote.meta) {
        setMeta((prev) => mergeMeta(prev, remote.meta ?? { dailyCounts: {} }))
      }
      setRemoteSynced(true)
    })
  }, [remoteSynced])

  const setWordStatus = useCallback((wordId: string, status: WordStatus) => {
    setProgress((prev) => updateWordStatus(prev, wordId, status))
    setMeta((prev) => recordStudyToday(prev))
  }, [])

  const resetAllProgress = useCallback(() => {
    setProgress(resetProgress())
    setMeta(resetMeta())
  }, [])

  const resetSingleProgress = useCallback((wordId: string) => {
    setProgress((prev) => resetWordProgress(prev, wordId))
  }, [])

  const exportProgress = useCallback(() => {
    downloadProgressJson(createProgressExport(progress, meta))
  }, [progress, meta])

  const importProgressFromFile = useCallback(async (file: File) => {
    const text = await file.text()
    const data = parseProgressExport(text)
    setProgress((prev) => mergeProgress(prev, data.progress))
    if (data.meta) {
      setMeta((prev) => mergeMeta(prev, data.meta ?? { dailyCounts: {} }))
    }
  }, [])

  const todayCount = useMemo(() => getTodayCount(meta), [meta])
  const streak = useMemo(() => getStudyStreak(meta), [meta])
  const last7Days = useMemo(() => getLast7Days(meta), [meta])

  const value = useMemo(
    () => ({
      words: WORDS,
      progress,
      meta,
      setWordStatus,
      resetAllProgress,
      resetSingleProgress,
      exportProgress,
      importProgressFromFile,
      todayCount,
      streak,
      last7Days,
    }),
    [
      progress,
      meta,
      setWordStatus,
      resetAllProgress,
      resetSingleProgress,
      exportProgress,
      importProgressFromFile,
      todayCount,
      streak,
      last7Days,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

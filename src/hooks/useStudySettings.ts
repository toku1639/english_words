import { useCallback, useEffect, useState } from 'react'
import type { StudyDirection } from '../utils/studyHelpers'

const SETTINGS_KEY = 'english-word-app-settings'

interface StudySettings {
  direction: StudyDirection
  shuffle: boolean
}

const DEFAULT: StudySettings = {
  direction: 'en-to-ja',
  shuffle: false,
}

function loadSettings(): StudySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT }
    const parsed = JSON.parse(raw) as StudySettings
    return {
      direction: parsed.direction === 'ja-to-en' ? 'ja-to-en' : 'en-to-ja',
      shuffle: Boolean(parsed.shuffle),
    }
  } catch {
    return { ...DEFAULT }
  }
}

export function useStudySettings() {
  const [settings, setSettings] = useState<StudySettings>(() => loadSettings())

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const setDirection = useCallback((direction: StudyDirection) => {
    setSettings((s) => ({ ...s, direction }))
  }, [])

  const setShuffle = useCallback((shuffle: boolean) => {
    setSettings((s) => ({ ...s, shuffle }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setSettings((s) => ({ ...s, shuffle: !s.shuffle }))
  }, [])

  return { ...settings, setDirection, setShuffle, toggleShuffle }
}

export type StudyDirection = 'en-to-ja' | 'ja-to-en'

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function searchWords(words: import('../types').Word[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return words
  return words.filter(
    (w) =>
      w.english.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      w.phonetic.toLowerCase().includes(q) ||
      w.example.toLowerCase().includes(q) ||
      w.similar.toLowerCase().includes(q) ||
      w.note.toLowerCase().includes(q),
  )
}

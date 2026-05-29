import type { Word } from '../types'

function mapHeader(header: string): keyof Omit<Word, 'id'> | null {
  const h = header.trim()
  if (h.includes('英単語') || h === 'english' || h === 'word') return 'english'
  if (h.includes('発音記号') || h === 'phonetic' || h === 'ipa') return 'phonetic'
  if (h === '意味' || h === 'meaning' || h === '訳' || h === '日本語') return 'meaning'
  if (h.includes('ほとんど同じ') || h === '例文' || h === 'example') return 'example'
  if (h.includes('少し単語') || h.includes('類似')) return 'similar'
  if (h.includes('補足') || h === 'note' || h === 'notes' || h === 'メモ') return 'note'
  if (h.includes('セクション') || h === 'section' || h === '章' || h === 'グループ') return 'section'
  if (h === 'no' || h === '#' || h === 'number' || h === '番号') return 'no'

  const normalized = h.toLowerCase().replace(/\s+/g, '')
  const COLUMN_MAP: Record<string, keyof Omit<Word, 'id'>> = {
    no: 'no',
    english: 'english',
    word: 'english',
    phonetic: 'phonetic',
    ipa: 'phonetic',
    meaning: 'meaning',
    example: 'example',
    similar: 'similar',
    note: 'note',
    section: 'section',
  }
  return COLUMN_MAP[normalized] ?? null
}

function parseDelimitedLine(line: string, delimiter: ',' | '\t'): string[] {
  if (delimiter === '\t') {
    return line.split('\t').map((v) => v.trim())
  }

  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function mapRow(headers: string[], values: string[]): Partial<Word> | null {
  const row: Partial<Word> = {}

  headers.forEach((header, i) => {
    const key = mapHeader(header)
    if (!key) return
    const value = values[i]?.trim() ?? ''
    if (key === 'no') {
      row.no = parseInt(value, 10) || 0
    } else {
      row[key] = value
    }
  })

  if (!row.english?.trim()) return null
  return row
}

function createWord(partial: Partial<Word>, index: number): Word {
  const no = partial.no && partial.no > 0 ? partial.no : index + 1
  return {
    id: `word-${no}`,
    no,
    english: partial.english!.trim(),
    phonetic: partial.phonetic ?? '',
    meaning: partial.meaning ?? '',
    example: partial.example ?? '',
    similar: partial.similar ?? '',
    note: partial.note ?? '',
    section: partial.section?.trim() || '未分類',
  }
}

export function parseCsvText(text: string): Word[] {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return []
  }

  const delimiter: ',' | '\t' = lines[0].includes('\t') ? '\t' : ','
  const headers = parseDelimitedLine(lines[0], delimiter)
  const words: Word[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseDelimitedLine(lines[i], delimiter)
    const partial = mapRow(headers, values)
    if (partial?.english) {
      words.push(createWord(partial, i - 1))
    }
  }

  return words.sort((a, b) => a.no - b.no)
}

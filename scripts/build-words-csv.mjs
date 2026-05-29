import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tsvPath = join(root, 'data', 'words.tsv')
const csvPath = join(root, 'data', 'words.csv')

function escapeCsvField(value) {
  const text = value ?? ''
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function parseTsvLine(line) {
  return line.split('\t')
}

const raw = readFileSync(tsvPath, 'utf8').replace(/^\uFEFF/, '')
const lines = raw.split(/\r?\n/).filter((line) => line.trim())

if (lines.length < 2) {
  throw new Error('words.tsv needs a header row and at least one data row')
}

const headers = parseTsvLine(lines[0])
const csvHeaders = ['No', '英単語', '発音記号', '意味', '例文', '類似文章', '補足情報', 'セクション']

const headerIndex = {
  english: headers.findIndex((h) => h.includes('英単語')),
  phonetic: headers.findIndex((h) => h.includes('発音記号')),
  meaning: headers.findIndex((h) => h.includes('意味')),
  example: headers.findIndex((h) => h.includes('ほとんど同じ')),
  similar: headers.findIndex((h) => h.includes('少し単語')),
  note: headers.findIndex((h) => h.includes('補足')),
}

for (const [key, index] of Object.entries(headerIndex)) {
  if (index < 0) throw new Error(`Missing column for ${key}`)
}

const rows = []
const seen = new Set()

for (let i = 1; i < lines.length; i++) {
  const cols = parseTsvLine(lines[i])
  const english = cols[headerIndex.english]?.trim()
  if (!english) continue
  if (seen.has(english)) continue
  seen.add(english)

  rows.push([
    String(rows.length + 1),
    english,
    cols[headerIndex.phonetic]?.trim() ?? '',
    cols[headerIndex.meaning]?.trim() ?? '',
    cols[headerIndex.example]?.trim() ?? '',
    cols[headerIndex.similar]?.trim() ?? '',
    (cols[headerIndex.note]?.trim() ?? '').replace('#ERROR!', 'meanwhile: その間に'),
    '',
  ])
}

const csvLines = [
  csvHeaders.join(','),
  ...rows.map((row) => row.map(escapeCsvField).join(',')),
]

writeFileSync(csvPath, `\uFEFF${csvLines.join('\n')}\n`, 'utf8')
console.log(`Wrote ${rows.length} words to ${csvPath}`)

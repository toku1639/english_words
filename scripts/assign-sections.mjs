import fs from 'node:fs'

const SECTION_RANGES = [
  [1, 41, '日常生活'],
  [47, 99, '食'],
  [107, 123, 'お金'],
  [127, 139, '買い物'],
  [140, 156, '交通／乗り物'],
  [161, 182, '車／道'],
  [197, 218, 'タイミング'],
  [234, 253, 'スポーツ／レジャー'],
  [254, 255, '旅行'],
  [256, 270, '男女'],
  [271, 292, '旅行'],
  [307, 351, '仕事'],
  [352, 382, 'オフィスで'],
  [395, 407, '宗教'],
  [408, 421, '政治'],
  [422, 436, '社会'],
  [443, 475, '社会'],
  [476, 510, '病気／医療'],
  [511, 530, '身体'],
  [531, 560, '自然／天気'],
  [561, 593, '科学'],
  [599, 643, '学校'],
  [644, 661, '大学'],
  [673, 706, '服'],
  [707, 719, 'パーティー／イベント'],
  [720, 751, '家のあこがれ'],
  [752, 786, '動物／農業'],
  [787, 808, '場所の表現'],
  [819, 829, '意思'],
  [830, 855, '感情'],
  [883, 947, '動作／行動'],
  [948, 978, '性格／態度'],
  [979, 997, '人生'],
  [998, 1011, '家族／友人'],
  [1026, 1057, '定型表現'],
  [1058, 1084, 'いろいろな名詞'],
]

const BASIC_VERB_RANGES = [
  [42, 46],
  [100, 106],
  [124, 126],
  [157, 160],
  [183, 196],
  [219, 233],
  [293, 306],
  [383, 394],
  [437, 442],
  [594, 599],
  [662, 672],
  [701, 707],
  [809, 818],
  [856, 875],
  [876, 882],
  [1012, 1025],
]

const BASIC_VERB = '大切な基本動詞'

function inRange(no, ranges) {
  return ranges.some(([start, end]) => no >= start && no <= end)
}

function sectionFor(no) {
  if (inRange(no, BASIC_VERB_RANGES)) return BASIC_VERB
  for (const [start, end, name] of SECTION_RANGES) {
    if (no >= start && no <= end) return name
  }
  return '未分類'
}

const path = 'data/words.tsv'
const text = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '')
const lines = text.split(/\r?\n/)
const header = lines[0].split('\t').filter((col, i, arr) => {
  if (col === 'セクション' && arr.indexOf('セクション') !== i) return false
  return true
})
if (!header.includes('セクション')) header.push('セクション')

const sectionIdx = header.indexOf('セクション')
const out = [header.join('\t')]
let wordNo = 0
const unassigned = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  if (!line.trim()) continue
  wordNo++
  const cols = line.split('\t')
  while (cols.length < header.length - 1) cols.push('')
  const section = sectionFor(wordNo)
  if (cols.length >= header.length) {
    cols[sectionIdx] = section
  } else {
    cols.push(section)
  }
  if (section === '未分類') unassigned.push({ no: wordNo, english: cols[0] })
  out.push(cols.join('\t'))
}

if (unassigned.length) {
  console.error('未分類:', unassigned)
  process.exit(1)
}

fs.writeFileSync(path, out.join('\n') + '\n', 'utf8')

const counts = {}
for (let i = 1; i < out.length; i++) {
  const s = out[i].split('\t')[sectionIdx]
  counts[s] = (counts[s] || 0) + 1
}
console.log('付与完了:', wordNo, '語')
console.log(JSON.stringify(counts, null, 2))

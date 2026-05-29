import wordText from '../../data/words.tsv?raw'
import { parseCsvText } from '../utils/csvImport'

export const WORDS = parseCsvText(wordText)

import type { StudyDirection } from '../utils/studyHelpers'

interface StudyOptionsProps {
  direction: StudyDirection
  shuffle: boolean
  onDirectionChange: (direction: StudyDirection) => void
  onShuffleChange: (shuffle: boolean) => void
}

export function StudyOptions({
  direction,
  shuffle,
  onDirectionChange,
  onShuffleChange,
}: StudyOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex rounded-xl bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => onDirectionChange('en-to-ja')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            direction === 'en-to-ja'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          英 → 日
        </button>
        <button
          type="button"
          onClick={() => onDirectionChange('ja-to-en')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            direction === 'ja-to-en'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          日 → 英
        </button>
      </div>

      <button
        type="button"
        onClick={() => onShuffleChange(!shuffle)}
        className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
          shuffle
            ? 'bg-zinc-900 text-white'
            : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50'
        }`}
      >
        シャッフル
      </button>
    </div>
  )
}

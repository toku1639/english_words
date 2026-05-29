interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-zinc-200 ${className}`}>
      <div
        className="h-full rounded-full bg-zinc-900 transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

interface StatBarProps {
  known: number
  unknown: number
  notStarted: number
  total: number
}

export function StatBar({ known, unknown, notStarted, total }: StatBarProps) {
  if (total === 0) return null

  const knownPct = (known / total) * 100
  const unknownPct = (unknown / total) * 100
  const notStartedPct = (notStarted / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        {knownPct > 0 && (
          <div className="bg-emerald-500 transition-all" style={{ width: `${knownPct}%` }} />
        )}
        {unknownPct > 0 && (
          <div className="bg-amber-500 transition-all" style={{ width: `${unknownPct}%` }} />
        )}
        {notStartedPct > 0 && (
          <div className="bg-zinc-300 transition-all" style={{ width: `${notStartedPct}%` }} />
        )}
      </div>
      <div className="flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          覚えた {known}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          要復習 {unknown}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-300" />
          未学習 {notStarted}
        </span>
      </div>
    </div>
  )
}

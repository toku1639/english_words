import type { WordStatus } from '../types'

const STATUS_CONFIG: Record<
  WordStatus,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  not_started: {
    label: '未学習',
    dot: 'bg-zinc-400',
    bg: 'bg-zinc-50',
    text: 'text-zinc-600',
    border: 'border-zinc-200',
  },
  known: {
    label: '覚えた',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  unknown: {
    label: '要復習',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
}

interface StatusBadgeProps {
  status: WordStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClass}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export function StatusIcon({ status }: { status: WordStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex h-2 w-2 rounded-full ${config.dot}`}
      title={config.label}
      aria-label={config.label}
    />
  )
}

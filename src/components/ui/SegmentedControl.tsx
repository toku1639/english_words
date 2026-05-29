interface SegmentedControlProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      className="flex rounded-xl bg-zinc-100 p-1"
      role="tablist"
    >
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

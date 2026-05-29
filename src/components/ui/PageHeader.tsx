import { IconStudy } from '../icons'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <div>
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-zinc-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
        <IconStudy width={22} height={22} />
      </div>
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      {description && <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: PrimaryButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50'

  const variants = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800',
    secondary: 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
    ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
    danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  }

  const sizes = {
    sm: 'rounded-lg px-3 py-1.5 text-xs',
    md: 'rounded-xl px-4 py-2.5 text-sm',
    lg: 'rounded-xl px-6 py-3 text-sm',
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

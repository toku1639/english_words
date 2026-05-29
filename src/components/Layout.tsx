import { NavLink } from 'react-router-dom'
import { IconChart, IconList, IconReview, IconStudy } from './icons'

const navItems = [
  { to: '/', label: '学習', Icon: IconStudy },
  { to: '/list', label: '一覧', Icon: IconList },
  { to: '/review', label: '復習', Icon: IconReview },
  { to: '/stats', label: '統計', Icon: IconChart },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-100">
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-white/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-lg px-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="group relative flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              {({ isActive }) => (
                <>
                  <Icon
                    width={20}
                    height={20}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className={`transition-colors ${
                      isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-medium tracking-wide transition-colors ${
                      isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-zinc-900" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RoleBadge } from '../common/Badges'

export function Navbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user } = useAuth()
  if (!user) return null

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden h-9 w-9 rounded-md border border-ink-200 flex items-center justify-center text-ink-600 focus-ring"
          aria-label="Open navigation"
        >
          ≡
        </button>
        <h1 className="text-sm font-semibold text-ink-800 hidden sm:block">Welcome back, {user.fullName.split(' ')[0]}</h1>
      </div>
      <div className="flex items-center gap-3">
        <RoleBadge role={user.role} />
        <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-ink-50 focus-ring">
          <div className="h-8 w-8 rounded-full bg-ink-800 text-white flex items-center justify-center text-xs font-semibold">
            {user.fullName
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')}
          </div>
          <span className="text-sm font-medium text-ink-700 hidden sm:inline">{user.fullName}</span>
        </Link>
      </div>
    </header>
  )
}

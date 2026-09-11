import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { RoleBadge } from '../common/Badges'

export function Navbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  if (!user) return null

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-primary-100 dark:border-ink-800 bg-primary-50/90 dark:bg-ink-900/90 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden h-9 w-9 rounded-md border border-primary-200 dark:border-ink-700 flex items-center justify-center text-primary-700 dark:text-ink-400 focus-ring"
          aria-label="Open navigation"
        >
          ≡
        </button>
        <h1 className="text-sm font-semibold text-ink-800 dark:text-ink-100 hidden sm:block">Welcome back, {user.fullName.split(' ')[0]}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md border border-primary-200 dark:border-ink-700 flex items-center justify-center text-primary-700 dark:text-ink-300 hover:bg-primary-100 dark:hover:bg-ink-800 focus-ring"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
        <RoleBadge role={user.role} />
        <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-primary-100 dark:hover:bg-ink-800 focus-ring">
          <div className="h-8 w-8 rounded-full bg-primary-700 dark:bg-primary-200 dark:text-primary-900 text-white flex items-center justify-center text-xs font-semibold">
            {user.fullName
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')}
          </div>
          <span className="text-sm font-medium text-ink-700 dark:text-ink-300 hidden sm:inline">{user.fullName}</span>
        </Link>
      </div>
    </header>
  )
}

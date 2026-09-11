import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: string
}

const navByRole: Record<string, NavItem[]> = {
  Admin: [
    { to: '/dashboard', label: 'Dashboard', icon: '▢' },
    { to: '/tickets', label: 'Tickets', icon: '≡' },
    { to: '/users', label: 'Users', icon: '◍' },
    { to: '/categories', label: 'Categories', icon: '◫' },
    { to: '/reports', label: 'Reports', icon: '▤' },
    { to: '/profile', label: 'Profile', icon: '○' },
  ],
  'Support Agent': [
    { to: '/dashboard', label: 'Dashboard', icon: '▢' },
    { to: '/tickets', label: 'My Tickets', icon: '≡' },
    { to: '/profile', label: 'Profile', icon: '○' },
  ],
  Employee: [
    { to: '/dashboard', label: 'Dashboard', icon: '▢' },
    { to: '/tickets/new', label: 'Create Ticket', icon: '+' },
    { to: '/tickets', label: 'My Tickets', icon: '≡' },
    { to: '/profile', label: 'Profile', icon: '○' },
  ],
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const { user, logout } = useAuth()
  if (!user) return null
  const items = navByRole[user.role] || []

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-primary-800 dark:bg-ink-950 text-primary-50 dark:text-ink-100 flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-primary-700 dark:border-white/10">
          <div className="h-8 w-8 rounded bg-primary-200 flex items-center justify-center font-mono font-bold text-primary-900">SD</div>
          <div>
            <p className="text-sm font-semibold leading-tight">ServiceDesk</p>
            <p className="text-[11px] text-primary-300 dark:text-ink-400 leading-tight">IT Ticket Management</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/tickets'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600/60 dark:bg-white/10 text-white'
                    : 'text-primary-200 dark:text-ink-300 hover:bg-primary-700/60 dark:hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="w-4 text-center font-mono">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary-700 dark:border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary-200 dark:text-ink-300 hover:bg-primary-700/60 dark:hover:bg-white/5 hover:text-white"
          >
            <span className="w-4 text-center">⏻</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

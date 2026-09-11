import type { User } from '../../types/user'
import { RoleBadge, UserStatusBadge } from '../common/Badges'
import { EmptyState } from '../common/States'
import { formatDate } from '../../utils/date'

export function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  users: User[]
  onEdit: (u: User) => void
  onDelete: (u: User) => void
  onToggleStatus: (u: User) => void
}) {
  if (users.length === 0) return <EmptyState title="No users found" description="Try a different search or add a new user." />

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 dark:border-ink-800 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Email</th>
            <th className="px-4 py-3 hidden lg:table-cell">Department</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 hidden md:table-cell">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-ink-50 dark:hover:bg-ink-800">
              <td className="px-4 py-3 font-medium text-ink-800 dark:text-ink-100">{u.fullName}</td>
              <td className="px-4 py-3 hidden md:table-cell text-ink-500 dark:text-ink-400">{u.email}</td>
              <td className="px-4 py-3 hidden lg:table-cell text-ink-500 dark:text-ink-400">{u.department}</td>
              <td className="px-4 py-3">
                <RoleBadge role={u.role} />
              </td>
              <td className="px-4 py-3">
                <UserStatusBadge status={u.status} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-ink-400">{formatDate(u.createdDate)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3 text-xs font-medium">
                  <button onClick={() => onEdit(u)} className="text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50">
                    Edit
                  </button>
                  <button onClick={() => onToggleStatus(u)} className="text-signal-amber hover:text-signal-amber/80">
                    {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => onDelete(u)} className="text-signal-rust hover:text-signal-rust/80">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

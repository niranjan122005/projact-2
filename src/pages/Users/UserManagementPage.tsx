import { useMemo, useState } from 'react'
import { useUsers } from '../../hooks/useUsers'
import { useToast } from '../../context/ToastContext'
import { usePagination } from '../../hooks/usePagination'
import { userService } from '../../services/userService'
import { getErrorMessage } from '../../services/api'
import { Loader, ErrorState } from '../../components/common/States'
import { UserTable } from '../../components/Users/UserTable'
import { UserFormModal, type UserFormValues } from '../../components/Users/UserFormModal'
import { ConfirmModal } from '../../components/common/Modal'
import { Pagination } from '../../components/common/Pagination'
import type { User } from '../../types/user'

export function UserManagementPage() {
  const { users, loading, error, reload } = useUsers()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchesSearch = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchesRole = !roleFilter || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8)

  if (loading) return <Loader label="Loading users…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  function openAddForm() {
    setEditingUser(undefined)
    setFormOpen(true)
  }

  function openEditForm(u: User) {
    setEditingUser(u)
    setFormOpen(true)
  }

  async function handleSubmit(values: UserFormValues) {
    try {
      if (editingUser) {
        const patch: Partial<UserFormValues> = { ...values }
        if (!patch.password) delete patch.password
        await userService.update(editingUser.id, patch)
        showToast('User updated.')
      } else {
        await userService.create({ ...values, status: 'Active' })
        showToast('User created.')
      }
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleToggleStatus(u: User) {
    try {
      await userService.setStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active')
      showToast(`${u.fullName} ${u.status === 'Active' ? 'deactivated' : 'activated'}.`)
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await userService.remove(deleteTarget.id)
      showToast('User deleted.')
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">User Management</h1>
          <p className="text-sm text-ink-400">{filtered.length} user{filtered.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={openAddForm} className="rounded-md bg-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 focus-ring">
          + Add User
        </button>
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 rounded-md border border-ink-200 px-3 py-2 text-sm placeholder:text-ink-300 focus-ring"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-md border border-ink-200 px-2.5 py-2 text-sm bg-white focus-ring">
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Support Agent">Support Agent</option>
          <option value="Employee">Employee</option>
        </select>
      </div>

      <div className="rounded-lg border border-ink-100 bg-white">
        <UserTable users={pageItems} onEdit={openEditForm} onDelete={setDeleteTarget} onToggleStatus={handleToggleStatus} />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editingUser} onSubmit={handleSubmit} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this user?"
        message={`This will permanently remove ${deleteTarget?.fullName}. This action cannot be undone.`}
      />
    </div>
  )
}

import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../context/ToastContext'
import { categoryService } from '../../services/categoryService'
import { getErrorMessage } from '../../services/api'
import { Loader, ErrorState, EmptyState } from '../../components/common/States'
import { CategoryFormModal, type CategoryFormValues } from '../../components/Categories/CategoryFormModal'
import { ConfirmModal } from '../../components/common/Modal'
import { UserStatusBadge } from '../../components/common/Badges'
import type { Category } from '../../types/category'

export function CategoryManagementPage() {
  const { categories, loading, error, reload } = useCategories()
  const { showToast } = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  if (loading) return <Loader label="Loading categories…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  function openAdd() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setFormOpen(true)
  }

  async function handleSubmit(values: CategoryFormValues) {
    try {
      if (editing) {
        await categoryService.update(editing.id, values)
        showToast('Category updated.')
      } else {
        await categoryService.create({ ...values, status: 'Active' })
        showToast('Category created.')
      }
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleToggle(c: Category) {
    try {
      await categoryService.update(c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' })
      showToast(`${c.name} ${c.status === 'Active' ? 'deactivated' : 'activated'}.`)
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await categoryService.remove(deleteTarget.id)
      showToast('Category deleted.')
      reload()
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Category Management</h1>
          <p className="text-sm text-ink-400">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="rounded-md bg-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 focus-ring">
          + Add Category
        </button>
      </div>

      <div className="rounded-lg border border-ink-100 bg-white divide-y divide-ink-100">
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Add a category to start organizing tickets." />
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-800">{c.name}</p>
                  <UserStatusBadge status={c.status} />
                </div>
                <p className="text-sm text-ink-400 truncate">{c.description}</p>
              </div>
              <div className="flex gap-3 text-xs font-medium shrink-0">
                <button onClick={() => openEdit(c)} className="text-ink-600 hover:text-ink-900">
                  Edit
                </button>
                <button onClick={() => handleToggle(c)} className="text-signal-amber hover:text-signal-amber/80">
                  {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => setDeleteTarget(c)} className="text-signal-rust hover:text-signal-rust/80">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSubmit={handleSubmit} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this category?"
        message={`This will permanently remove "${deleteTarget?.name}". Tickets already using it will keep the label.`}
      />
    </div>
  )
}

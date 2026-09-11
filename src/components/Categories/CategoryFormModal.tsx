import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { FormField, inputClass } from '../common/FormField'
import { validateCategoryForm, type FieldErrors } from '../../utils/validation'
import type { Category } from '../../types/category'

export interface CategoryFormValues {
  name: string
  description: string
}

export function CategoryFormModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  initial?: Category
  onSubmit: (values: CategoryFormValues) => Promise<void>
}) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name || '',
    description: initial?.description || '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateCategoryForm(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setSubmitting(true)
    try {
      await onSubmit(values)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Category' : 'Add Category'} size="sm">
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Category Name" htmlFor="name" error={errors.name}>
          <input id="name" className={inputClass(!!errors.name)} value={values.name} onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))} />
        </FormField>
        <FormField label="Description" htmlFor="description" error={errors.description}>
          <textarea id="description" rows={3} className={inputClass(!!errors.description)} value={values.description} onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))} />
        </FormField>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 dark:hover:bg-ink-300 disabled:opacity-60 focus-ring">
            {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

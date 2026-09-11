import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { FormField, inputClass } from '../common/FormField'
import { validateUserForm, type FieldErrors } from '../../utils/validation'
import type { Role, User } from '../../types/user'

export interface UserFormValues {
  fullName: string
  email: string
  password: string
  phone: string
  department: string
  role: Role
}

export function UserFormModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  initial?: User
  onSubmit: (values: UserFormValues) => Promise<void>
}) {
  const isEdit = !!initial
  const [values, setValues] = useState<UserFormValues>({
    fullName: initial?.fullName || '',
    email: initial?.email || '',
    password: '',
    phone: initial?.phone || '',
    department: initial?.department || '',
    role: initial?.role || 'Employee',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof UserFormValues>(key: K, v: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateUserForm(values, { requirePassword: !isEdit, password: values.password })
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
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit User' : 'Add User'} size="md">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Full Name" htmlFor="fullName" error={errors.fullName}>
            <input id="fullName" className={inputClass(!!errors.fullName)} value={values.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input id="email" type="email" className={inputClass(!!errors.email)} value={values.email} onChange={(e) => set('email', e.target.value)} disabled={isEdit} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Phone" htmlFor="phone" error={errors.phone}>
            <input id="phone" className={inputClass(!!errors.phone)} value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-123-4567" />
          </FormField>
          <FormField label="Department" htmlFor="department" error={errors.department}>
            <input id="department" className={inputClass(!!errors.department)} value={values.department} onChange={(e) => set('department', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormField label="Role" htmlFor="role" error={errors.role}>
            <select id="role" className={inputClass(!!errors.role)} value={values.role} onChange={(e) => set('role', e.target.value as Role)}>
              <option value="Admin">Admin</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Employee">Employee</option>
            </select>
          </FormField>
          <FormField label={isEdit ? 'New Password (optional)' : 'Password'} htmlFor="password" error={errors.password}>
            <input id="password" type="password" className={inputClass(!!errors.password)} value={values.password} onChange={(e) => set('password', e.target.value)} placeholder={isEdit ? 'Leave blank to keep current' : ''} />
          </FormField>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 dark:hover:bg-ink-300 disabled:opacity-60 focus-ring">
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

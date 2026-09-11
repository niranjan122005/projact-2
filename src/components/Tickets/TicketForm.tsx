import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { ContactMethod, Ticket, TicketPriority } from '../../types/ticket'
import { FormField, inputClass } from '../common/FormField'
import { validateTicketForm, type FieldErrors } from '../../utils/validation'

export interface TicketFormValues {
  subject: string
  description: string
  category: string
  priority: TicketPriority
  preferredContact: ContactMethod
}

export function TicketForm({
  initial,
  categories,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Ticket>
  categories: Category[]
  submitLabel: string
  onSubmit: (values: TicketFormValues) => Promise<void>
  onCancel?: () => void
}) {
  const [values, setValues] = useState<TicketFormValues>({
    subject: initial?.subject || '',
    description: initial?.description || '',
    category: initial?.category || categories[0]?.name || '',
    priority: initial?.priority || 'Medium',
    preferredContact: initial?.preferredContact || 'Email',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof TicketFormValues>(key: K, v: TicketFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateTicketForm(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setSubmitting(false)
    }
  }

  const activeCategories = categories.filter((c) => c.status === 'Active')

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Subject" htmlFor="subject" error={errors.subject}>
        <input
          id="subject"
          className={inputClass(!!errors.subject)}
          value={values.subject}
          onChange={(e) => set('subject', e.target.value)}
          placeholder="Short summary of the issue"
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description} hint="Include steps to reproduce and what you've already tried.">
        <textarea
          id="description"
          rows={5}
          className={inputClass(!!errors.description)}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the issue in detail"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField label="Category" htmlFor="category" error={errors.category}>
          <select id="category" className={inputClass(!!errors.category)} value={values.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Select category</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Priority" htmlFor="priority" error={errors.priority}>
          <select
            id="priority"
            className={inputClass(!!errors.priority)}
            value={values.priority}
            onChange={(e) => set('priority', e.target.value as TicketPriority)}
          >
            {(['Low', 'Medium', 'High', 'Critical'] as TicketPriority[]).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Preferred Contact Method" htmlFor="preferredContact" error={errors.preferredContact}>
        <div className="flex gap-3">
          {(['Email', 'Phone', 'Chat'] as ContactMethod[]).map((m) => (
            <label
              key={m}
              className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium ${
                values.preferredContact === m ? 'border-ink-900 dark:border-ink-100 bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white' : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800'
              }`}
            >
              <input type="radio" name="preferredContact" className="sr-only" checked={values.preferredContact === m} onChange={() => set('preferredContact', m)} />
              {m}
            </label>
          ))}
        </div>
      </FormField>

      <div className="mt-6 flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 dark:hover:bg-ink-300 disabled:opacity-60 focus-ring">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { FormField, inputClass } from '../common/FormField'
import { validateResolutionForm, type FieldErrors } from '../../utils/validation'

export function ResolutionModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: { resolution: string; resolutionNotes: string }) => Promise<void>
}) {
  const [resolution, setResolution] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateResolutionForm({ resolution, resolutionNotes })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setSubmitting(true)
    try {
      await onSubmit({ resolution, resolutionNotes })
      setResolution('')
      setResolutionNotes('')
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Resolve Ticket" size="md">
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Resolution" htmlFor="resolution" error={errors.resolution} hint='e.g. "Network adapter was reset and reconnected."'>
          <input id="resolution" className={inputClass(!!errors.resolution)} value={resolution} onChange={(e) => setResolution(e.target.value)} />
        </FormField>
        <FormField label="Resolution Notes" htmlFor="resolutionNotes" error={errors.resolutionNotes}>
          <textarea
            id="resolutionNotes"
            rows={4}
            className={inputClass(!!errors.resolutionNotes)}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Add detail for the record — what was diagnosed and what fixed it."
          />
        </FormField>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-md bg-signal-teal text-white px-4 py-2 text-sm font-medium hover:bg-signal-teal/90 disabled:opacity-60 focus-ring">
            {submitting ? 'Saving…' : 'Mark Resolved'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

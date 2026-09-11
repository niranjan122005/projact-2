import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { FormField, inputClass } from '../common/FormField'
import { validateCompletionForm, type FieldErrors } from '../../utils/validation'

export function CompleteTicketModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (comment: string) => Promise<void>
}) {
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateCompletionForm({ comment })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setSubmitting(true)
    try {
      await onSubmit(comment)
      setComment('')
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Mark Ticket Complete" size="md">
      <form onSubmit={handleSubmit} noValidate>
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">
          Add a closing comment for this ticket. It will be posted to the ticket and the ticket will be marked
          resolved and closed.
        </p>
        <FormField label="Comment" htmlFor="completionComment" error={errors.comment}>
          <textarea
            id="completionComment"
            rows={4}
            className={inputClass(!!errors.comment)}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you do, and how was it resolved?"
          />
        </FormField>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-md bg-signal-teal text-white px-4 py-2 text-sm font-medium hover:bg-signal-teal/90 disabled:opacity-60 focus-ring">
            {submitting ? 'Saving…' : 'Mark Complete & Close'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

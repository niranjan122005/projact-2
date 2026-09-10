import { useState, type FormEvent } from 'react'
import type { Comment } from '../../types/comment'
import { formatDate } from '../../utils/date'

export function CommentSection({
  comments,
  canComment,
  onAdd,
}: {
  comments: Comment[]
  canComment: boolean
  onAdd: (text: string) => Promise<void>
}) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await onAdd(text.trim())
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {comments.length === 0 ? (
        <p className="text-sm text-ink-400 mb-4">No comments yet.</p>
      ) : (
        <ul className="space-y-4 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-md border border-ink-100 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-ink-800">{c.userName}</span>
                <span className="text-xs text-ink-400">
                  {formatDate(c.createdDate)} · {c.createdTime}
                </span>
              </div>
              <p className="text-sm text-ink-600 whitespace-pre-wrap">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 rounded-md border border-ink-200 px-3 py-2 text-sm placeholder:text-ink-300 focus-ring"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="rounded-md bg-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 disabled:opacity-50 focus-ring"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-xs text-ink-400">You don't have permission to comment on this ticket.</p>
      )}
    </div>
  )
}

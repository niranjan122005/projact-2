export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-sm">
      <span className="text-ink-400">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border border-ink-200 px-3 py-1.5 font-medium text-ink-600 disabled:opacity-40 hover:bg-ink-50 focus-ring"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border border-ink-200 px-3 py-1.5 font-medium text-ink-600 disabled:opacity-40 hover:bg-ink-50 focus-ring"
        >
          Next
        </button>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

export function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-ink-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 py-16 px-6 text-center">
      <div className="h-10 w-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-400 text-lg">□</div>
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description && <p className="text-sm text-ink-400 max-w-sm">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-signal-rust/30 bg-signal-rust/5 py-12 px-6 text-center">
      <p className="text-sm font-medium text-signal-rust">Something went wrong</p>
      <p className="text-sm text-ink-500 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md border border-signal-rust/30 px-4 py-2 text-sm font-medium text-signal-rust hover:bg-signal-rust/10 focus-ring"
        >
          Try again
        </button>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'

export function FormField({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-signal-rust">{error}</p>}
    </div>
  )
}

export const inputClass = (hasError?: boolean) =>
  `w-full rounded-md border bg-white dark:bg-ink-900 px-3 py-2 text-sm text-ink-900 dark:text-ink-50 placeholder:text-ink-300 dark:placeholder:text-ink-600 focus-ring ${
    hasError ? 'border-signal-rust' : 'border-ink-200 dark:border-ink-700'
  }`

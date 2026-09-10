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
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-signal-rust">{error}</p>}
    </div>
  )
}

export const inputClass = (hasError?: boolean) =>
  `w-full rounded-md border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus-ring ${
    hasError ? 'border-signal-rust' : 'border-ink-200'
  }`

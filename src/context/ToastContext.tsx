import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: string
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  showToast: (message: string, kind?: ToastKind) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, kind, message }])
      setTimeout(() => dismissToast(id), 4000)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`rounded-md border px-4 py-3 text-sm shadow-lg flex items-start justify-between gap-3 animate-[fadeIn_.15s_ease-out] ${
            t.kind === 'success'
              ? 'bg-white border-signal-teal/30 text-ink-800'
              : t.kind === 'error'
                ? 'bg-white border-signal-rust/40 text-ink-800'
                : 'bg-white border-ink-200 text-ink-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                t.kind === 'success' ? 'bg-signal-teal' : t.kind === 'error' ? 'bg-signal-rust' : 'bg-ink-400'
              }`}
            />
            <span>{t.message}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-ink-400 hover:text-ink-700 leading-none text-base"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

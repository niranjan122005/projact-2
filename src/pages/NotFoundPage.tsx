import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ink-50 text-center px-6">
      <p className="font-mono text-sm text-ink-400">404</p>
      <h1 className="text-xl font-semibold text-ink-900">Page not found</h1>
      <p className="text-sm text-ink-400 max-w-sm">The page you're looking for doesn't exist or you don't have access to it.</p>
      <Link to="/dashboard" className="mt-2 rounded-md bg-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800">
        Back to dashboard
      </Link>
    </div>
  )
}

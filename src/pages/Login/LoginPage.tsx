import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DEMO_EMPLOYEE_EMAIL = 'employee@servicedesk.io'
const DEMO_EMPLOYEE_PASSWORD = 'employee123'
const DEMO_AGENT_EMAIL = 'agent@servicedesk.io'
const DEMO_AGENT_PASSWORD = 'agent123'

export function LoginPage() {
  const { user, login, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const location = useLocation()

  if (user) {
    const from = (location.state as { from?: string } | null)?.from || '/dashboard'
    return <Navigate to={from} replace />
  }

  function fillDemoAccount(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setLocalError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!email.trim() || !password) {
      setLocalError('Enter your email and password.')
      return
    }
    setSubmitting(true)
    await login(email.trim().toLowerCase(), password)
    setSubmitting(false)
    // On success, `user` updates and the redirect above sends us to the dashboard.
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEDED] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] px-8 pt-14 pb-8 relative">
        {/* Avatar / brand icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-[#171717] flex items-center justify-center ring-8 ring-[#EDEDED]">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-sans font-bold text-2xl text-[#171717] tracking-tight">ServiceDesk</h1>
          <p className="text-xs text-[#737373] mt-1">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] border border-[#E0E0E0] px-3.5 py-2.5 focus-within:border-[#171717] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.8" className="shrink-0">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <input
              type="email"
              autoComplete="username"
              className="w-full bg-transparent text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] border border-[#E0E0E0] px-3.5 py-2.5 focus-within:border-[#171717] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.8" className="shrink-0">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="w-full bg-transparent text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-[#737373] hover:text-[#171717] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.5 5.2A10.4 10.4 0 0 1 12 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.4 3.9M6.6 6.6C4.8 7.8 3.4 9.5 2 12c1 3 5 7 10 7 1.3 0 2.5-.3 3.6-.7" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-[#737373] hover:text-[#171717] underline underline-offset-2">
              Forgot password?
            </Link>
          </div>

          {(localError || error) && (
            <p className="rounded-md bg-[#B3452B]/10 border border-[#B3452B]/30 px-3 py-2 text-xs text-[#B3452B]">
              {localError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#171717] text-white py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#262626] disabled:opacity-60 transition-colors mt-2"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount(DEMO_EMPLOYEE_EMAIL, DEMO_EMPLOYEE_PASSWORD)}
            className="rounded-lg border border-dashed border-[#CCCCCC] px-3 py-2.5 text-left hover:border-[#171717] transition-colors"
          >
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1F3D2E]">Demo employee</p>
            <p className="text-[11px] text-[#737373] mt-0.5 truncate">{DEMO_EMPLOYEE_EMAIL}</p>
            <p className="text-[11px] text-[#A3A3A3]">Tap to autofill</p>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount(DEMO_AGENT_EMAIL, DEMO_AGENT_PASSWORD)}
            className="rounded-lg border border-dashed border-[#CCCCCC] px-3 py-2.5 text-left hover:border-[#171717] transition-colors"
          >
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1F3D2E]">Demo support agent</p>
            <p className="text-[11px] text-[#737373] mt-0.5 truncate">{DEMO_AGENT_EMAIL}</p>
            <p className="text-[11px] text-[#A3A3A3]">Tap to autofill</p>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#A3A3A3]">
          <Link to="/admin-login" className="hover:text-[#737373] underline underline-offset-2">
            Are you an admin?
          </Link>
        </p>
      </div>
    </div>
  )
}

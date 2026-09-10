import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../../services/userService'
import { getErrorMessage } from '../../services/api'
import type { User } from '../../types/user'

type Step = 'email' | 'reset' | 'done'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleLookup(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    try {
      const user = await userService.findByEmail(email.trim().toLowerCase())
      if (!user) {
        setError('No account found with that email address.')
        return
      }
      if (user.status === 'Inactive') {
        setError('This account has been deactivated. Contact an administrator.')
        return
      }
      setFoundUser(user)
      setStep('reset')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!foundUser) return
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await userService.update(foundUser.id, { password: newPassword })
      setStep('done')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEDED] p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] px-8 pt-14 pb-8 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-[#171717] flex items-center justify-center ring-8 ring-[#EDEDED]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>

        {step === 'email' && (
          <>
            <div className="text-center mb-8">
              <h1 className="font-sans font-bold text-2xl text-[#171717] tracking-tight">Forgot Password</h1>
              <p className="text-xs text-[#737373] mt-1">
                Enter your account email and we'll help you reset it.
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-3.5" noValidate>
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
                  placeholder="Email"
                  autoFocus
                />
              </div>

              {error && (
                <p className="rounded-md bg-[#B3452B]/10 border border-[#B3452B]/30 px-3 py-2 text-xs text-[#B3452B]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#171717] text-white py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#262626] disabled:opacity-60 transition-colors mt-2"
              >
                {loading ? 'Checking…' : 'Continue'}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && foundUser && (
          <>
            <div className="text-center mb-8">
              <h1 className="font-sans font-bold text-2xl text-[#171717] tracking-tight">Set a new password</h1>
              <p className="text-xs text-[#737373] mt-1">
                Resetting password for <span className="text-[#171717] font-medium">{foundUser.email}</span>
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-3.5" noValidate>
              <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] border border-[#E0E0E0] px-3.5 py-2.5 focus-within:border-[#171717] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.8" className="shrink-0">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full bg-transparent text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="shrink-0 text-[#737373] hover:text-[#171717] transition-colors"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? (
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

              <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] border border-[#E0E0E0] px-3.5 py-2.5 focus-within:border-[#171717] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.8" className="shrink-0">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full bg-transparent text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="shrink-0 text-[#737373] hover:text-[#171717] transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
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

              {error && (
                <p className="rounded-md bg-[#B3452B]/10 border border-[#B3452B]/30 px-3 py-2 text-xs text-[#B3452B]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#171717] text-white py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#262626] disabled:opacity-60 transition-colors mt-2"
              >
                {loading ? 'Saving…' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#1F3D2E]/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1F3D2E" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className="font-sans font-bold text-2xl text-[#171717] tracking-tight mb-1">Password updated</h1>
            <p className="text-xs text-[#737373] mb-8">
              You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full rounded-lg bg-[#171717] text-white py-3 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#262626] transition-colors"
            >
              Back to Log In
            </button>
          </div>
        )}

        {step !== 'done' && (
          <p className="mt-6 text-center text-xs text-[#737373]">
            <Link to="/login" className="hover:text-[#171717] underline underline-offset-2">
              Back to log in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

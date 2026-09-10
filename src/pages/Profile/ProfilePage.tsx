import { useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { userService } from '../../services/userService'
import { getErrorMessage } from '../../services/api'
import { FormField, inputClass } from '../../components/common/FormField'
import { validateUserForm, type FieldErrors } from '../../utils/validation'
import { RoleBadge, UserStatusBadge } from '../../components/common/Badges'
import { formatDate } from '../../utils/date'

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [department, setDepartment] = useState(user?.department || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validateUserForm(
      { fullName, email: user!.email, phone, department, role: user!.role },
      { requirePassword: false, password: newPassword },
    )
    if (newPassword) {
      if (!currentPassword) {
        fieldErrors.currentPassword = 'Enter your current password.'
      } else if (currentPassword !== user!.password) {
        fieldErrors.currentPassword = 'Current password is incorrect.'
      }
    }
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setSubmitting(true)
    try {
      const patch: Record<string, string> = { fullName, phone, department }
      if (newPassword) patch.password = newPassword
      await userService.update(user!.id, patch)
      await refreshUser()
      setCurrentPassword('')
      setNewPassword('')
      showToast('Profile updated.')
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">Profile</h1>
        <p className="text-sm text-ink-400">Manage your account details.</p>
      </div>

      <div className="rounded-lg border border-ink-100 bg-white p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-ink-800 text-white flex items-center justify-center text-lg font-semibold">
          {user.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </div>
        <div>
          <p className="font-semibold text-ink-900">{user.fullName}</p>
          <p className="text-sm text-ink-400">{user.email}</p>
          <div className="flex gap-2 mt-1.5">
            <RoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        </div>
        <p className="ml-auto text-xs text-ink-400 self-start">Member since {formatDate(user.createdDate)}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-ink-100 bg-white p-5">
        <FormField label="Full Name" htmlFor="fullName" error={errors.fullName}>
          <input id="fullName" className={inputClass(!!errors.fullName)} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={errors.phone}>
          <input id="phone" className={inputClass(!!errors.phone)} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormField>
        <FormField label="Department" htmlFor="department" error={errors.department}>
          <input id="department" className={inputClass(!!errors.department)} value={department} onChange={(e) => setDepartment(e.target.value)} />
        </FormField>
        <FormField
          label="Current Password"
          htmlFor="currentPassword"
          error={errors.currentPassword}
          hint="Required only if you're setting a new password below."
        >
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              className={`${inputClass(!!errors.currentPassword)} pr-9`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 transition-colors"
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? (
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
        </FormField>
        <FormField label="New Password" htmlFor="newPassword" error={errors.password} hint="Leave blank to keep your current password.">
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className={`${inputClass(!!errors.password)} pr-9`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 transition-colors"
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
        </FormField>
        <button type="submit" disabled={submitting} className="rounded-md bg-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 disabled:opacity-60 focus-ring">
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

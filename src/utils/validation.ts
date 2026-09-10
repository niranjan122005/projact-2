export type FieldErrors = Record<string, string>

export const isRequired = (value: string | null | undefined) => value != null && value.trim().length > 0

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// Accepts formats like +1 555-123-4567, (555) 123-4567, 5551234567
export const isValidPhone = (value: string) => /^[+]?[\d\s()-]{7,20}$/.test(value)

export const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime())

export function validateTicketForm(input: {
  subject: string
  description: string
  category: string
  priority: string
  preferredContact: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!isRequired(input.subject)) errors.subject = 'Subject is required.'
  else if (input.subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters.'

  if (!isRequired(input.description)) errors.description = 'Description is required.'
  else if (input.description.trim().length < 15)
    errors.description = 'Description must be at least 15 characters.'

  if (!isRequired(input.category)) errors.category = 'Please select a category.'
  if (!isRequired(input.priority)) errors.priority = 'Please select a priority.'
  if (!isRequired(input.preferredContact)) errors.preferredContact = 'Please select a contact method.'

  return errors
}

export function validateUserForm(
  input: { fullName: string; email: string; phone: string; department: string; role: string },
  opts: { requirePassword?: boolean; password?: string } = {},
): FieldErrors {
  const errors: FieldErrors = {}
  if (!isRequired(input.fullName)) errors.fullName = 'Full name is required.'
  if (!isRequired(input.email)) errors.email = 'Email is required.'
  else if (!isValidEmail(input.email)) errors.email = 'Enter a valid email address.'

  if (!isRequired(input.phone)) errors.phone = 'Phone number is required.'
  else if (!isValidPhone(input.phone)) errors.phone = 'Enter a valid phone number.'

  if (!isRequired(input.department)) errors.department = 'Department is required.'
  if (!isRequired(input.role)) errors.role = 'Please select a role.'

  if (opts.requirePassword && !isRequired(opts.password)) {
    errors.password = 'Password is required.'
  } else if (opts.password && opts.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

export function validateCategoryForm(input: { name: string; description: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (!isRequired(input.name)) errors.name = 'Category name is required.'
  if (!isRequired(input.description)) errors.description = 'Description is required.'
  return errors
}

export function validateResolutionForm(input: { resolution: string; resolutionNotes: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (!isRequired(input.resolution)) errors.resolution = 'Resolution summary is required.'
  if (!isRequired(input.resolutionNotes)) errors.resolutionNotes = 'Resolution notes are required.'
  else if (input.resolutionNotes.trim().length < 10)
    errors.resolutionNotes = 'Please provide at least 10 characters of detail.'
  return errors
}

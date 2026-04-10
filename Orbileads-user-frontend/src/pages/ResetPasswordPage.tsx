import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormField from '../components/FormField'
import {
  ApiError,
  getApiErrorMessage,
  getFieldError,
  requestPasswordResetLink,
  resetPassword,
} from '../lib/api'
import { isValidEmail } from '../lib/validation'

type RequestFormState = {
  email: string
}

type RequestErrors = Partial<Record<keyof RequestFormState, string>>

type ResetFormState = {
  newPassword: string
  confirmNewPassword: string
}

type ResetErrors = Partial<Record<keyof ResetFormState, string>>

const initialResetForm: ResetFormState = {
  newPassword: '',
  confirmNewPassword: '',
}

function ResetPasswordPage() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const uid = params.uid ?? searchParams.get('uid') ?? ''
  const token = params.token ?? searchParams.get('token') ?? ''
  const initialEmail = searchParams.get('email') ?? ''

  const hasResetLink = Boolean(uid && token)

  const [requestForm, setRequestForm] = useState<RequestFormState>({ email: initialEmail })
  const [requestErrors, setRequestErrors] = useState<RequestErrors>({})
  const [requestMessage, setRequestMessage] = useState('')
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false)

  const [resetForm, setResetForm] = useState<ResetFormState>(initialResetForm)
  const [resetErrors, setResetErrors] = useState<ResetErrors>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [isResetSubmitting, setIsResetSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const screenCopy = useMemo(
    () =>
      hasResetLink
        ? {
            title: 'Create a New Password',
            description: 'Enter and confirm your new password to finish resetting your account.',
          }
        : {
            title: 'Reset Password',
            description: 'We will send a password reset link to the email address you entered.',
          },
    [hasResetLink],
  )

  const handleRequestChange =
    (field: keyof RequestFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setRequestForm((current) => ({ ...current, [field]: event.target.value.replace(/\s/g, '') }))
      setRequestErrors((current) => ({ ...current, [field]: undefined }))
      setRequestMessage('')
    }

  const handleResetChange =
    (field: keyof ResetFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setResetForm((current) => ({ ...current, [field]: event.target.value }))
      setResetErrors((current) => ({ ...current, [field]: undefined }))
      setResetMessage('')
    }

  const validateRequestForm = () => {
    const nextErrors: RequestErrors = {}

    if (!requestForm.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!isValidEmail(requestForm.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setRequestErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateResetForm = () => {
    const nextErrors: ResetErrors = {}

    if (!resetForm.newPassword.trim()) {
      nextErrors.newPassword = 'New password is required.'
    } else if (resetForm.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters.'
    }

    if (!resetForm.confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = 'Please confirm your new password.'
    } else if (resetForm.confirmNewPassword !== resetForm.newPassword) {
      nextErrors.confirmNewPassword = 'Passwords do not match.'
    }

    setResetErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateRequestForm()) {
      return
    }

    setIsRequestSubmitting(true)
    setRequestMessage('')

    try {
      await requestPasswordResetLink({ email: requestForm.email.trim() })
      setRequestMessage('Reset link will be sent to your mail.')
    } catch (error) {
      if (error instanceof ApiError) {
        setRequestErrors((current) => ({
          ...current,
          email: getFieldError(error.errors, 'email') ?? current.email,
        }))
      }
      setRequestMessage(getApiErrorMessage(error, 'Unable to send reset link right now.'))
    } finally {
      setIsRequestSubmitting(false)
    }
  }

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateResetForm()) {
      return
    }

    setIsResetSubmitting(true)
    setResetMessage('')

    try {
      await resetPassword({
        uid,
        token,
        new_password: resetForm.newPassword,
        confirm_new_password: resetForm.confirmNewPassword,
      })
      setIsSuccess(true)
      setResetForm(initialResetForm)
    } catch (error) {
      if (error instanceof ApiError) {
        setResetErrors((current) => ({
          ...current,
          newPassword: getFieldError(error.errors, 'new_password') ?? current.newPassword,
          confirmNewPassword:
            getFieldError(error.errors, 'confirm_new_password') ?? current.confirmNewPassword,
        }))
      }
      setResetMessage(getApiErrorMessage(error, 'Unable to reset password right now.'))
    } finally {
      setIsResetSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <AuthCard title={screenCopy.title} description={screenCopy.description}>
          {!hasResetLink ? (
            <form className="space-y-5" onSubmit={handleRequestSubmit} noValidate>
              {requestMessage ? (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    requestMessage === 'Reset link will be sent to your mail.'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-red-200 bg-red-50 text-red-600'
                  }`}
                >
                  {requestMessage}
                </div>
              ) : null}

              <FormField
                id="reset-email"
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={requestForm.email}
                onChange={handleRequestChange('email')}
                error={requestErrors.email}
              />

              <Button type="submit" fullWidth disabled={isRequestSubmitting}>
                {isRequestSubmitting ? 'Sending Link...' : 'Reset'}
              </Button>

              <p className="text-sm text-slate-500">
                Remembered your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold !text-[#1679bd] hover:!text-[#115f95]"
                >
                  Back to Login
                </Link>
              </p>
            </form>
          ) : isSuccess ? (
            <div className="space-y-6 rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Password updated
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Your password has been reset successfully. You can return to the login page and
                  continue with your new credentials.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-brand)] px-5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(22,121,189,0.22)] transition-colors duration-150 hover:bg-[var(--color-brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <form className="space-y-5" onSubmit={handleResetSubmit} noValidate>
                {resetMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {resetMessage}
                  </div>
                ) : null}

                <FormField
                  id="reset-new-password"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={resetForm.newPassword}
                  onChange={handleResetChange('newPassword')}
                  error={resetErrors.newPassword}
                  rightAdornment={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((current) => !current)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  }
                />

                <FormField
                  id="reset-confirm-password"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  value={resetForm.confirmNewPassword}
                  onChange={handleResetChange('confirmNewPassword')}
                  error={resetErrors.confirmNewPassword}
                  rightAdornment={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  }
                />

                <Button type="submit" fullWidth disabled={isResetSubmitting}>
                  {isResetSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>

              <p className="mt-6 text-sm text-slate-500">
                Remembered your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold !text-[#1679bd] hover:!text-[#115f95]"
                >
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </AuthCard>
      </div>
    </main>
  )
}

export default ResetPasswordPage

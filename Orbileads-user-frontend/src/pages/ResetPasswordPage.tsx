import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import FormField from '../components/FormField'

type ResetFormState = {
  newPassword: string
  confirmNewPassword: string
}

type ResetErrors = Partial<Record<keyof ResetFormState, string>>

const initialForm: ResetFormState = {
  newPassword: '',
  confirmNewPassword: '',
}

function ResetPasswordPage() {
  const [form, setForm] = useState<ResetFormState>(initialForm)
  const [errors, setErrors] = useState<ResetErrors>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange =
    (field: keyof ResetFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setForm((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const validate = () => {
    const nextErrors: ResetErrors = {}

    if (!form.newPassword.trim()) {
      nextErrors.newPassword = 'New password is required.'
    } else if (form.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters.'
    }

    if (!form.confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = 'Please confirm your new password.'
    } else if (form.confirmNewPassword !== form.newPassword) {
      nextErrors.confirmNewPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      setIsSuccess(false)
      return
    }

    // Reserved for future API integration.
    console.log('Reset password payload', form)
    setIsSuccess(true)
    setForm(initialForm)
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <AuthCard
          title="Reset Password"
          description="Set a new secure password for your Orbileads account."
        >
          {isSuccess ? (
            <div className="space-y-6 rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Password updated
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Your password has been reset successfully. You can return to
                  the login page and continue with your new credentials.
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
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <FormField
                  id="reset-new-password"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={form.newPassword}
                  onChange={handleChange('newPassword')}
                  error={errors.newPassword}
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
                  value={form.confirmNewPassword}
                  onChange={handleChange('confirmNewPassword')}
                  error={errors.confirmNewPassword}
                  rightAdornment={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  }
                />

                <Button type="submit" fullWidth>
                  Reset Password
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

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import {
  authenticateWithGoogle,
  ApiError,
  buildSession,
  getApiErrorMessage,
  getFieldError,
  loginUser,
} from '../lib/api'
import { readAuthSession, saveAuthSession } from '../lib/auth'
import { requestGoogleCredential } from '../lib/googleAuth'
import { isValidEmail } from '../lib/validation'

type LoginFormState = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginFormState, string>>

const initialForm: LoginFormState = {
  email: '',
  password: '',
}

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginFormState>(initialForm)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const signupSuccessMessage =
    typeof location.state === 'object' &&
    location.state !== null &&
    'signupSuccess' in location.state &&
    typeof location.state.signupSuccess === 'string'
      ? location.state.signupSuccess
      : ''

  useEffect(() => {
    if (readAuthSession()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleChange =
    (field: keyof LoginFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'email' ? event.target.value.replace(/\s/g, '') : event.target.value

      setForm((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      setSubmitError('')
    }

  const validate = () => {
    const nextErrors: LoginErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (step === 'password' && !form.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    if (step === 'email') {
      setStep('password')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await loginUser(form)
      if (!response.data) {
        throw new Error('Login response is missing user data.')
      }

      saveAuthSession(buildSession(response.data.user, response.data.tokens))
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        const nextErrors: LoginErrors = {}
        const emailError = getFieldError(error.errors, 'email')
        const passwordError = getFieldError(error.errors, 'password')
        const detailError = getFieldError(error.errors, 'detail')

        if (emailError) {
          nextErrors.email = emailError
        }

        if (passwordError) {
          nextErrors.password = passwordError
        }

        if (Object.keys(nextErrors).length > 0) {
          setErrors((current) => ({ ...current, ...nextErrors }))
        }

        setSubmitError(detailError ?? error.message)
      } else {
        setSubmitError(
          getApiErrorMessage(error, 'Unable to login right now. Please try again.'),
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setSubmitError('')
    setIsGoogleSubmitting(true)

    try {
      const credential = await requestGoogleCredential()
      const response = await authenticateWithGoogle(credential)
      if (!response.data) {
        throw new Error('Google authentication response is missing user data.')
      }

      saveAuthSession(buildSession(response.data.user, response.data.tokens))
      navigate('/', { replace: true })
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, 'Unable to continue with Google right now. Please try again.'),
      )
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
      <section className="w-full rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.08)] lg:p-8">
        <article className="mx-auto w-full max-w-md space-y-5">
          <header className="space-y-3">
          
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Welcome back!
            </h1>
            <p className="text-base leading-7 text-slate-500">
              Use Orbileads to turn any growth idea into real results - in minutes.
            </p>

          </header>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {signupSuccessMessage && step === 'email' ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {signupSuccessMessage}
              </div>
            ) : null}
            {submitError && step === 'email' ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}

            {step === 'email' ? (
              <>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isGoogleSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-[#28395f] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.4c-.2 1.3-1.7 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.8 2.4 2.6 6.6 2.6 11.8S6.8 21.2 12 21.2c6.1 0 9.1-4.3 9.1-6.5 0-.4 0-.8-.1-1.1H12Z"
                    />
                    <path
                      fill="#34A853"
                      d="M2.6 11.8c0 1.7.4 3.3 1.3 4.7l3.8-2.9c-.3-.8-.5-1.2-.5-1.8s.2-1.4.5-1.8L3.9 7.1c-.9 1.4-1.3 3-1.3 4.7Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12 21.2c2.7 0 4.9-.9 6.5-2.4l-3.1-2.4c-.8.5-1.9.9-3.4.9-2.6 0-4.8-1.8-5.6-4.1l-3.8 2.9c1.6 3.1 4.8 5.1 9.4 5.1Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M18.5 18.8c1.8-1.7 2.6-4.2 2.6-7 0-.7-.1-1.2-.2-1.7H12v3.9h5.4c-.3 1.2-1 2.2-2 2.9l3.1 2.4Z"
                    />
                  </svg>
                  <span>{isGoogleSubmitting ? 'Connecting to Google...' : 'Login with Google'}</span>
                </button>

                <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  <span className="h-px flex-1 bg-[var(--color-border)]" />
                  <span>Or</span>
                  <span className="h-px flex-1 bg-[var(--color-border)]" />
                </p>

                <FormField
                  id="login-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                />
              </>
            ) : (
              <div className="rounded-xl border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm text-slate-700">
                {form.email}
              </div>
            )}

            {step === 'password' ? (
              <>
                {submitError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {submitError}
                  </div>
                ) : null}

                <FormField
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  rightAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-brand)] hover:bg-[var(--color-brand-muted)]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  }
                />

                <p className="flex justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm font-medium !text-[#1679bd] hover:!text-[#115f95]"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              className="h-[52px] rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] text-lg font-semibold shadow-[0_14px_30px_rgba(22,121,189,0.24)] hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
            >
              {isSubmitting ? 'Logging in...' : step === 'email' ? 'Continue' : 'Login'}
            </Button>

            {step === 'password' ? (
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setErrors((current) => ({ ...current, password: undefined }))
                }}
                className="w-full text-sm font-medium !text-[#1679bd] hover:!text-[#115f95]"
              >
                Back to email
              </button>
            ) : null}
          </form>

          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold !text-[#1679bd] hover:!text-[#115f95]"
            >
              Sign up
            </Link>
          </p>
        </article>
      </section>
    </main>
  )
}

export default LoginPage

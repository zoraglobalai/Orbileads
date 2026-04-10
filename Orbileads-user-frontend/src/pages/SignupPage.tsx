import {
  useEffect,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import {
  checkEmailAvailability,
  authenticateWithGoogle,
  ApiError,
  buildSession,
  getApiErrorMessage,
  getFieldError,
  signupUser,
} from '../lib/api'
import { readAuthSession, saveAuthSession } from '../lib/auth'
import { requestGoogleCredential } from '../lib/googleAuth'
import { isValidEmail } from '../lib/validation'

type SignupStep = 'identity' | 'password' | 'details'

type SignupFormState = {
  fullName: string
  email: string
  password: string
  country: string
  companyName: string
}

type SignupErrors = Partial<Record<keyof SignupFormState, string>>

const initialForm: SignupFormState = {
  fullName: '',
  email: '',
  password: '',
  country: '',
  companyName: '',
}

const NAME_REGEX = /^[A-Za-z\s]+$/
const MIN_PASSWORD_LENGTH = 8
const HAS_UPPERCASE_REGEX = /[A-Z]/
const HAS_LOWERCASE_REGEX = /[a-z]/
const HAS_DIGIT_REGEX = /\d/
const HAS_SYMBOL_REGEX = /[^A-Za-z\d]/

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Germany',
  'France',
  'Netherlands',
  'South Africa',
  'Japan',
  'Malaysia',
  'Saudi Arabia',
  'Qatar',
  'Sri Lanka',
]

function getFirstErrorMessage(errors: Record<string, unknown> | undefined) {
  if (!errors) {
    return undefined
  }

  for (const value of Object.values(errors)) {
    if (typeof value === 'string' && value.trim()) {
      return value
    }

    if (Array.isArray(value) && value.length > 0) {
      return String(value[0])
    }
  }

  return undefined
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 text-slate-400">
      <path
        d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 7a6 6 0 1 1 12 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 text-slate-400">
      <path
        d="M3 5.5h14v9H3z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m4 6.5 6 5 6-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 text-slate-400">
      <path
        d="M6 8V6a4 4 0 1 1 8 0v2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <rect
        x="4"
        y="8"
        width="12"
        height="9"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
        <path
          d="M2.5 10s2.5-4.5 7.5-4.5S17.5 10 17.5 10s-2.5 4.5-7.5 4.5S2.5 10 2.5 10Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="10" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
      <path
        d="M3 3 17 17"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8.8 5.7A7.7 7.7 0 0 1 10 5.5c5 0 7.5 4.5 7.5 4.5a12.6 12.6 0 0 1-2.7 3.2M5.1 7.3A12.6 12.6 0 0 0 2.5 10s2.5 4.5 7.5 4.5c.5 0 1-.04 1.5-.13"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<SignupStep>('identity')
  const [form, setForm] = useState<SignupFormState>(initialForm)
  const [errors, setErrors] = useState<SignupErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (readAuthSession()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const updateField = <K extends keyof SignupFormState>(
    field: K,
    value: SignupFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  const handleInputChange =
    (field: keyof SignupFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value

      if (field === 'fullName') {
        value = value.replace(/[^A-Za-z\s]/g, '')
      }

      if (field === 'email') {
        value = value.replace(/\s/g, '')
      }

      updateField(field, value)
    }

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateField('country', event.target.value)
  }

  const blockEmailSpace = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  const handleEmailPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    updateField('email', event.clipboardData.getData('text').replace(/\s/g, ''))
  }

  const validateIdentityStep = () => {
    const nextErrors: SignupErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    } else if (!NAME_REGEX.test(form.fullName.trim())) {
      nextErrors.fullName = 'Full name should contain letters only.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const validatePasswordStep = () => {
    const nextErrors: SignupErrors = {}

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (
      form.password.length < MIN_PASSWORD_LENGTH ||
      !HAS_UPPERCASE_REGEX.test(form.password) ||
      !HAS_LOWERCASE_REGEX.test(form.password) ||
      !HAS_DIGIT_REGEX.test(form.password) ||
      !HAS_SYMBOL_REGEX.test(form.password)
    ) {
      nextErrors.password =
        'Use at least 8 characters with uppercase, lowercase, number, and symbol.'
    }

    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const validateDetailsStep = () => {
    const nextErrors: SignupErrors = {}

    if (!form.country) {
      nextErrors.country = 'Please select your country.'
    }

    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const handleContinue = async () => {
    if (step === 'identity') {
      if (!validateIdentityStep()) {
        return
      }

      setIsCheckingEmail(true)
      try {
        await checkEmailAvailability({ email: form.email.trim() })
        setStep('password')
      } catch (error) {
        if (error instanceof ApiError) {
          const emailError = getFieldError(error.errors, 'email') ?? error.message
          setErrors((current) => ({ ...current, email: emailError }))
          setSubmitError('')
        } else {
          setSubmitError(
            getApiErrorMessage(error, 'Unable to verify the email right now. Please try again.'),
          )
        }
      } finally {
        setIsCheckingEmail(false)
      }
      return
    }

    if (step === 'password') {
      if (!validatePasswordStep()) {
        return
      }
      setStep('details')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step !== 'details') {
      handleContinue()
      return
    }

    if (!validateDetailsStep()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await signupUser({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        mobile_number: '',
        password: form.password,
        confirm_password: form.password,
        country: form.country,
        company_name: form.companyName.trim(),
        accept_terms: true,
      })
      navigate('/login', {
        replace: true,
        state: { signupSuccess: 'Account created successfully. Please login to continue.' },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        const nextErrors: SignupErrors = {}

        const fieldMap: Array<[keyof SignupErrors, string]> = [
          ['fullName', 'full_name'],
          ['email', 'email'],
          ['password', 'password'],
          ['country', 'country'],
          ['companyName', 'company_name'],
        ]

        fieldMap.forEach(([frontendField, backendField]) => {
          const message = getFieldError(error.errors, backendField)
          if (message) {
            nextErrors[frontendField] = message
          }
        })

        if (Object.keys(nextErrors).length > 0) {
          setErrors((current) => ({ ...current, ...nextErrors }))
        }

        setSubmitError(
          getFieldError(error.errors, 'detail') ??
            getFirstErrorMessage(error.errors) ??
            error.message,
        )
      } else {
        setSubmitError(
          getApiErrorMessage(error, 'Unable to create the account right now. Please try again.'),
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

  const isPasswordLengthSatisfied = form.password.length >= MIN_PASSWORD_LENGTH
  const isUppercaseSatisfied = HAS_UPPERCASE_REGEX.test(form.password)
  const isLowercaseSatisfied = HAS_LOWERCASE_REGEX.test(form.password)
  const isDigitSatisfied = HAS_DIGIT_REGEX.test(form.password)
  const isSymbolSatisfied = HAS_SYMBOL_REGEX.test(form.password)

  const passwordChecks = [
    { label: 'at least 8 characters', satisfied: isPasswordLengthSatisfied },
    { label: '1 uppercase letter', satisfied: isUppercaseSatisfied },
    { label: '1 lowercase letter', satisfied: isLowercaseSatisfied },
    { label: '1 number', satisfied: isDigitSatisfied },
    { label: '1 symbol', satisfied: isSymbolSatisfied },
  ]

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[radial-gradient(circle_at_top,#eef3f8_0%,#dde5ee_58%,#d2dbe6_100%)]">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <section className="flex w-full max-w-[620px] items-center justify-center rounded-[32px] bg-white px-6 py-8 shadow-[0_24px_64px_rgba(15,23,42,0.08)] sm:px-10 lg:px-12">
          <div className="w-full max-w-[352px] space-y-6">
            <header className="space-y-3">
              <h1 className="whitespace-nowrap text-4xl font-semibold tracking-tight text-slate-950">
                Welcome to Orbileads!
              </h1>
              <p className="text-[14px] leading-8 text-slate-500">
                Sign up to turn any growth idea into reality in minutes.
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              ) : null}

              {step === 'identity' ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isGoogleSubmitting}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-base font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f7ae0] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span>{isGoogleSubmitting ? 'Connecting to Google...' : 'Sign up with Google'}</span>
                  </button>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span>OR</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                        <UserIcon />
                      </div>
                      <input
                        id="signup-full-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Full name"
                        value={form.fullName}
                        onChange={handleInputChange('fullName')}
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-base text-slate-900 outline-none transition focus:border-[#1f7ae0] focus:ring-4 focus:ring-[#d7e9ff] ${
                          errors.fullName
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.fullName ? (
                      <p className="-mt-1 text-sm text-red-500">{errors.fullName}</p>
                    ) : null}

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                        <MailIcon />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleInputChange('email')}
                        onKeyDown={blockEmailSpace}
                        onPaste={handleEmailPaste}
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-base text-slate-900 outline-none transition focus:border-[#1f7ae0] focus:ring-4 focus:ring-[#d7e9ff] ${
                          errors.email
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.email ? (
                      <p className="-mt-1 text-sm text-red-500">{errors.email}</p>
                    ) : null}
                  </div>
                </>
              ) : null}

              {step === 'password' ? (
                <>
                  <div className="space-y-3">
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {form.fullName}
                    </div>
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {form.email}
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                        <LockIcon />
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleInputChange('password')}
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-14 text-base text-slate-900 outline-none transition focus:border-[#1f7ae0] focus:ring-4 focus:ring-[#d7e9ff] ${
                          errors.password
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute inset-y-0 right-4 flex items-center text-slate-500 transition hover:text-slate-700"
                      >
                        <EyeIcon visible={showPassword} />
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="-mt-1 text-sm text-red-500">{errors.password}</p>
                    ) : null}

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Your password must contain:
                      </p>
                      <div className="mt-2 space-y-2">
                        {passwordChecks.map((check) => (
                          <div
                            key={check.label}
                            className={`flex items-center gap-2 text-sm ${
                              check.satisfied ? 'text-emerald-600' : 'text-slate-500'
                            }`}
                          >
                            <span className="text-base leading-none">
                              {check.satisfied ? '✓' : '•'}
                            </span>
                            <span>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {step === 'details' ? (
                <>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Step 3 of 3. Add your final details to create the account.
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="signup-country"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Country / Location
                      </label>
                      <div className="relative">
                        <select
                          id="signup-country"
                          value={form.country}
                          onChange={handleCountryChange}
                          className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-base text-slate-900 outline-none transition focus:border-[#1f7ae0] focus:ring-4 focus:ring-[#d7e9ff] ${
                            errors.country
                              ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                              : 'border-slate-200'
                          }`}
                        >
                          <option value="">Select country</option>
                          {COUNTRIES.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                            <path
                              d="M5 7.5 10 12.5 15 7.5"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>
                      </div>
                      {errors.country ? (
                        <p className="text-sm text-red-500">{errors.country}</p>
                      ) : null}
                    </div>

                    <FormField
                      id="signup-company"
                      label="Company Name(optional)"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company name"
                      value={form.companyName}
                      onChange={handleInputChange('companyName')}
                      error={errors.companyName}
                    />
                  </div>
                </>
              ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting || isCheckingEmail}
                  fullWidth
                  className="mt-2 h-11 rounded-xl bg-[#1f7ae0] text-base font-semibold shadow-none hover:bg-[#186dd0]"
                >
                {step === 'details'
                  ? isSubmitting
                    ? 'Creating Account...'
                    : 'Create Account'
                  : isCheckingEmail
                    ? 'Checking...'
                    : 'Continue'}
              </Button>

              {step !== 'identity' ? (
                <button
                  type="button"
                  onClick={() =>
                    setStep((current) =>
                      current === 'details' ? 'password' : 'identity',
                    )
                  }
                  className="w-full text-sm font-medium text-[#1f7ae0] transition hover:text-[#186dd0]"
                >
                  Back
                </button>
              ) : null}
            </form>

            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold !text-[#1f7ae0] hover:!text-[#186dd0]">
                Log in
              </Link>
            </p>

            <p className="text-sm leading-6 text-slate-500">
              By signing up for an Orbileads account, you agree to our{' '}
              <a href="#" className="font-medium !text-[#1f7ae0] hover:!text-[#186dd0]">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium !text-[#1f7ae0] hover:!text-[#186dd0]">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SignupPage

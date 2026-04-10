import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApiError,
  changePassword,
  getApiErrorMessage,
  getFieldError,
} from '../../../lib/api'
import { clearAuthSession, type AuthSession } from '../../../lib/auth'

type ProfileViewProps = {
  session: AuthSession
}

function ProfileView({ session }: ProfileViewProps) {
  const navigate = useNavigate()
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [emailDraft, setEmailDraft] = useState(session.user.email)
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmNewPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
    confirmNewPassword: '',
  })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [creditLimit, setCreditLimit] = useState(0)

  useEffect(() => {
    setEmailDraft(session.user.email)
  }, [session.user.email])

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    setPasswordForm({ newPassword: '', confirmNewPassword: '' })
    setPasswordErrors({ newPassword: '', confirmNewPassword: '' })
    setPasswordMessage('')
    setShowNewPassword(false)
    setShowConfirmNewPassword(false)
  }

  const updateCreditLimit = (value: number) => {
    setCreditLimit(value)
  }

  const handlePasswordSubmit = async () => {
    const nextErrors = {
      newPassword: '',
      confirmNewPassword: '',
    }

    if (!passwordForm.newPassword.trim()) {
      nextErrors.newPassword = 'New password is required.'
    } else if (passwordForm.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters.'
    }

    if (!passwordForm.confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = 'Please confirm your new password.'
    } else if (passwordForm.confirmNewPassword !== passwordForm.newPassword) {
      nextErrors.confirmNewPassword = 'Passwords do not match.'
    }

    setPasswordErrors(nextErrors)
    setPasswordMessage('')

    if (nextErrors.newPassword || nextErrors.confirmNewPassword) {
      return
    }

    setIsPasswordSubmitting(true)

    try {
      await changePassword({
        current_password: '',
        new_password: passwordForm.newPassword,
        confirm_new_password: passwordForm.confirmNewPassword,
      })
      clearAuthSession()
      navigate('/login', {
        replace: true,
        state: { signupSuccess: 'Password changed successfully. Please login again.' },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        setPasswordErrors({
          newPassword: getFieldError(error.errors, 'new_password') ?? '',
          confirmNewPassword: getFieldError(error.errors, 'confirm_new_password') ?? '',
        })
      }

      setPasswordMessage(
        getApiErrorMessage(error, 'Unable to reset password right now. Please try again.'),
      )
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  return (
    <>
      {isEmailModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.32)] px-4">
          <div className="w-full max-w-[660px] rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between px-5 py-5">
              <h3 className="text-[15px] font-medium text-slate-900">Change email</h3>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="cursor-pointer text-2xl leading-none text-slate-500 transition hover:text-slate-800"
                aria-label="Close change email dialog"
              >
                x
              </button>
            </div>

            <div className="border-t border-slate-200 px-5 py-6">
              <label className="block space-y-2 text-sm text-slate-700">
                <span className="font-medium">
                  New email <span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(event) => setEmailDraft(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </label>

              <button
                type="button"
                className="mt-8 cursor-pointer rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
              >
                Change email
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPasswordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.32)] px-4">
          <div className="w-full max-w-[660px] rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between px-5 py-5">
              <h3 className="text-[15px] font-medium text-slate-900">Change password</h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className="cursor-pointer text-2xl leading-none text-slate-500 transition hover:text-slate-800"
                aria-label="Close change password dialog"
              >
                x
              </button>
            </div>

            <div className="border-t border-slate-200 px-5 py-6">
              {passwordMessage ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {passwordMessage}
                </div>
              ) : null}

              <div className="space-y-5">
                <label className="block space-y-2 text-sm text-slate-700">
                  <span className="font-medium">New Password</span>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({
                          ...current,
                          newPassword: event.target.value,
                        }))
                      }
                      onInput={() =>
                        setPasswordErrors((current) => ({ ...current, newPassword: '' }))
                      }
                      placeholder="Enter your new password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-20 text-[15px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-[#1679bd] hover:bg-[#e8f2fd]"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {passwordErrors.newPassword ? (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                  ) : null}
                </label>

                <label className="block space-y-2 text-sm text-slate-700">
                  <span className="font-medium">Confirm New Password</span>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={passwordForm.confirmNewPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({
                          ...current,
                          confirmNewPassword: event.target.value,
                        }))
                      }
                      onInput={() =>
                        setPasswordErrors((current) => ({
                          ...current,
                          confirmNewPassword: '',
                        }))
                      }
                      placeholder="Confirm your new password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-20 text-[15px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-[#1679bd] hover:bg-[#e8f2fd]"
                    >
                      {showConfirmNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {passwordErrors.confirmNewPassword ? (
                    <p className="text-sm text-red-500">{passwordErrors.confirmNewPassword}</p>
                  ) : null}
                </label>
              </div>

              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isPasswordSubmitting}
                className="mt-8 cursor-pointer rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
              >
                {isPasswordSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[920px] space-y-4">
        <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <h2 className="text-[24px] font-semibold tracking-tight text-slate-950">Account Info</h2>

          <label className="mt-4 block space-y-1 text-sm text-slate-700">
            <span className="font-medium">
              Full name <span className="text-red-500">*</span>
            </span>
            <input
              defaultValue={session.user.full_name}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[14px] text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="mt-3.5 block space-y-1 text-sm text-slate-700">
            <span className="font-medium">Title</span>
            <input
              placeholder="Title"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[14px] text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <div className="mt-3.5 space-y-1">
            <span className="text-sm font-medium text-slate-700">Login email</span>
            <div className="flex gap-3">
              <input
                disabled
                value={session.user.email}
                readOnly
                className="h-11 flex-1 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-[14px] text-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-[#e9edf2]"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-3.5 space-y-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <div className="flex gap-3">
              <input
                disabled
                value="********"
                readOnly
                className="h-11 flex-1 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 text-[14px] text-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-[#e9edf2]"
              >
                Edit
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <h2 className="text-[24px] font-semibold tracking-tight text-slate-950">CRM Connection</h2>
          <div className="mt-6 flex min-h-[200px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white px-6 text-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd34d] text-3xl font-light text-white">
                +
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f68b2f] text-xl font-semibold text-white">
                H
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15803d] text-xl font-semibold text-white">
                S
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb] text-xl font-semibold text-white">
                C
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-500">Your team has not connected to a CRM yet.</p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <h2 className="text-[24px] font-semibold tracking-tight text-slate-950">Restrictions</h2>
          <div className="mt-4 max-w-md space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Credit Limit</label>
            <div className="flex h-11 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-slate-400">
              <input
                type="number"
                value={creditLimit}
                onChange={(event) => updateCreditLimit(Number(event.target.value))}
                className="h-full flex-1 bg-transparent px-4 text-[14px] text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex w-11 flex-col border-l border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => updateCreditLimit(creditLimit + 1)}
                  className="flex flex-1 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Increase credit limit"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                    <path
                      d="M5.5 12 10 7.5 14.5 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => updateCreditLimit(creditLimit - 1)}
                  className="flex flex-1 items-center justify-center border-t border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Decrease credit limit"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                    <path
                      d="M5.5 8 10 12.5 14.5 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500">Leave this field blank if no limit is required</p>
          </div>
        </section>
      </div>
    </>
  )
}

export default ProfileView

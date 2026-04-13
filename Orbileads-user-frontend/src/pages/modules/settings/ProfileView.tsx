import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApiError,
  changePassword,
  getApiErrorMessage,
  getFieldError,
} from '../../../lib/api'
import { clearAuthSession, type AuthSession } from '../../../lib/auth'
import type { ProfileTab } from './types'

type ProfileViewProps = {
  session: AuthSession
  selectedTab: ProfileTab
}

function MultiFactorAuthenticationView() {
  return (
    <section className="flex min-h-[560px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative h-[170px] w-[210px]">
        <div className="absolute left-[31px] top-[71px] h-[40px] w-[49px] rounded-[10px] border border-[rgba(15,23,42,0.2)] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.05)]" />
        <div className="absolute left-[49px] top-[91px] h-[40px] w-[2px] bg-[#42c985]" />
        <div className="absolute left-[49px] top-[129px] h-[2px] w-[63px] bg-[#42c985]" />

        <div className="absolute left-[63px] top-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-[rgba(15,23,42,0.2)] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7 text-[#42c985]">
            <circle
              cx="14"
              cy="18"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
            />
            <path
              d="m19 13 7-7m-3 1h4v4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="absolute left-[32px] top-[81px] flex h-[42px] w-[30px] items-center justify-center rounded-[9px] border-2 border-[#42c985] bg-white">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-[#42c985]">
            <rect
              x="6"
              y="2.5"
              width="8"
              height="15"
              rx="2.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M8.5 14.3h3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="absolute left-[80px] top-[89px] rounded-[8px] border border-[rgba(15,23,42,0.24)] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
          <p className="text-left text-[8px] font-medium text-slate-900">Login to Orbileads</p>

          <div className="mt-2 flex h-[18px] w-[84px] items-center gap-2 rounded-[4px] border border-[rgba(15,23,42,0.28)] bg-white px-2">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-2.5 w-2.5 text-[rgba(15,23,42,0.62)]">
              <path
                d="M10 10a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm-5.2 6.2a5.2 5.2 0 0 1 10.4 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="h-2 w-[50px] rounded-full bg-slate-200" />
          </div>

          <div className="mt-2 flex h-[18px] w-[84px] items-center gap-2 rounded-[4px] border border-[rgba(15,23,42,0.28)] bg-white px-2">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-2.5 w-2.5 text-[rgba(15,23,42,0.62)]">
              <path
                d="M6.75 8V6.8a3.25 3.25 0 1 1 6.5 0V8m-7 0h7.5v7h-7.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#42c985]" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute left-[131px] top-[34px]">
          <div className="absolute -left-3 -top-4">
            <svg aria-hidden="true" viewBox="0 0 42 28" className="h-5 w-6 text-[#3f2d00]">
              <path
                d="M20 25V14a8 8 0 1 1 16 0v11"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M8 8 4 2M18 5l-1-5M30 5l2-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex h-[44px] w-[48px] items-center justify-center rounded-[12px] bg-[#ffcf47] shadow-[0_10px_20px_rgba(250,204,21,0.22)]">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-[18px] w-[18px] text-[#3f2d00]">
              <path
                d="M6.75 8V6.8a3.25 3.25 0 1 1 6.5 0V8m-7 0h7.5v7h-7.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="absolute left-[154px] top-[82px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#42c985] text-white shadow-[0_6px_14px_rgba(52,211,153,0.24)]">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-2.5 w-2.5">
            <path
              d="m5.5 10 3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="mt-8 text-[18px] font-medium text-slate-800">Get multi-factor authentication</h2>
      <p className="mt-3 max-w-[500px] text-[15px] leading-7 text-slate-500">
        Improve your account security and protect your organization&apos;s most important data
        with our multi-factor authentication.
      </p>

      <button
        type="button"
        className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
      >
        Upgrade to Basic
      </button>
    </section>
  )
}

function CustomFieldsView() {
  return (
    <section className="mx-auto max-w-[920px] pt-6">
      <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
        <h2 className="text-[15px] font-medium text-slate-800">Custom user fields</h2>
        <button
          type="button"
          className="mt-1 text-[14px] font-medium text-[#326fa8] transition hover:text-[#245784]"
        >
          Manage fields
        </button>

        <p className="mt-8 text-[14px] text-slate-600">
          Your team does not have custom user fields set up yet. You can set them up{' '}
          <button
            type="button"
            className="font-medium text-[#326fa8] transition hover:text-[#245784]"
          >
            here.
          </button>
        </p>
      </div>
    </section>
  )
}

function EmailSettingsView({ onManageMailboxes }: { onManageMailboxes: () => void }) {
  return (
    <section className="mx-auto max-w-[920px] pt-4">
      <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
        <h2 className="text-[15px] font-medium text-slate-800">Email Settings</h2>

        <button
          type="button"
          onClick={onManageMailboxes}
          className="mt-7 flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-slate-300 bg-white text-[15px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Manage Mailboxes
        </button>

        <p className="mt-4 text-[14px] text-slate-600">
          Email sending limits: 250/day (Increase your limits by upgrading to a{' '}
          <button
            type="button"
            className="font-medium text-[#326fa8] underline decoration-transparent transition hover:decoration-current"
          >
            paid plan
          </button>
          )
        </p>

        <p className="mt-4 text-[14px] text-slate-600">
          Set up email signature:{' '}
          <button
            type="button"
            onClick={onManageMailboxes}
            className="cursor-pointer font-medium text-[#326fa8] underline decoration-transparent transition hover:decoration-current"
          >
            manage email signatures under each linked Mailbox!
          </button>
        </p>

        <label className="mt-4 flex items-start gap-2.5">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1679bd]" />
          <span>
            <span className="block text-[14px] text-slate-700">Include one-click unsubscribe headers</span>
            <span className="mt-1 block text-[13px] text-slate-500">
              Recommended for organizations that send 5,000 emails or more within a 24-hour
              period.
            </span>
          </span>
        </label>

        <label className="mt-4 flex items-center gap-2.5 text-[14px] text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1679bd]" />
          <span>Enable open tracking</span>
        </label>

        <label className="mt-4 flex items-center gap-2.5 text-[14px] text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1679bd]" />
          <span>Enable click tracking</span>
        </label>

        <div className="mt-5 flex items-center gap-2.5 text-[14px] text-slate-400">
          <button
            type="button"
            className="relative h-5 w-8 rounded-full bg-slate-200"
            aria-label="Append a sequences opt-out message after my signature"
          >
            <span className="absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] leading-none shadow-sm">
              x
            </span>
          </button>
          <span className="font-medium">Append a sequences opt-out message after my signature</span>
        </div>

        <textarea
          disabled
          value="No longer interested in these messages? <%Unsubscribe%>"
          className="mt-4 min-h-[124px] w-full resize-none rounded-[10px] border border-slate-300 bg-slate-100 px-3 py-3 text-[15px] text-slate-400 outline-none"
        />

        <p className="mt-2 text-[13px] text-slate-500">
          Surround your opt-out link with brackets {'{'}&apos;&lt;%&apos;{'}'} and {'{'}&apos;%&gt;&apos;{'}'}.
        </p>
      </div>
    </section>
  )
}

function ProfileView({ session, selectedTab }: ProfileViewProps) {
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
  const [isPrivateConversationsEnabled, setIsPrivateConversationsEnabled] = useState(false)
  const [privateConversationScope, setPrivateConversationScope] = useState<'future' | 'all'>(
    'future',
  )

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

  const isMultiFactorAuthenticationTab = selectedTab === 'Multi-factor authentication'
  const isCustomFieldsTab = selectedTab === 'Custom fields'
  const isEmailSettingsTab = selectedTab === 'Email settings'
  const isConversationsTab = selectedTab === 'Conversations'

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

  const renderConversationsView = () => (
    <section className="mx-auto max-w-[920px] pt-4">
      <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.03)]">
        <h2 className="text-[15px] font-medium text-slate-800">Conversations</h2>

        <div className="mt-6">
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => setIsPrivateConversationsEnabled((current) => !current)}
              className={`relative h-6 w-8 cursor-pointer rounded-full transition ${
                isPrivateConversationsEnabled ? 'bg-[#1679bd]' : 'bg-slate-300'
              }`}
              aria-pressed={isPrivateConversationsEnabled}
              aria-label="Enable Private Conversations"
            >
              <span
                className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] leading-none shadow-sm transition ${
                  isPrivateConversationsEnabled ? 'left-[11px]' : 'left-0.5'
                }`}
              >
                {isPrivateConversationsEnabled ? '✓' : '×'}
              </span>
            </button>

            <div className="flex-1">
              <p className="text-[15px] font-medium text-slate-700">Enable Private Conversations</p>
              <p className="mt-1 max-w-[720px] text-[13px] leading-6 text-slate-500">
                Enable this setting to keep all conversations private. Only hosts, internal
                participants, and individuals with the link can access the conversation.
              </p>
            </div>
          </div>

          {isPrivateConversationsEnabled ? (
            <div className="mt-5 rounded-[14px] border border-slate-200 bg-white px-4 py-4">
              <p className="text-[15px] font-medium text-slate-700">
                Which conversations should be made private?
              </p>

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-[14px] text-slate-700">
                <input
                  type="radio"
                  name="private-conversation-scope"
                  checked={privateConversationScope === 'future'}
                  onChange={() => setPrivateConversationScope('future')}
                  className="h-4 w-4 border-slate-300 text-[#3a3430] focus:ring-[#3a3430]"
                />
                <span>Only future conversations</span>
              </label>

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-[14px] text-slate-700">
                <input
                  type="radio"
                  name="private-conversation-scope"
                  checked={privateConversationScope === 'all'}
                  onChange={() => setPrivateConversationScope('all')}
                  className="h-4 w-4 border-slate-300 text-[#3a3430] focus:ring-[#3a3430]"
                />
                <span>All past and future conversations</span>
              </label>
            </div>
          ) : null}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-[15px] font-medium text-slate-700">Revoke access to shared recordings</p>
          <p className="mt-2 text-[14px] text-slate-600">
            All individuals that you&apos;ve shared recordings with will no longer be able to
            access them.
          </p>

          <button
            type="button"
            disabled
            className="mt-3 flex h-10 w-full items-center justify-center rounded-[10px] bg-slate-100 text-[15px] font-medium text-slate-400"
          >
            Revoke access
          </button>
        </div>
      </div>
    </section>
  )

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
        {isMultiFactorAuthenticationTab ? <MultiFactorAuthenticationView /> : null}
        {isCustomFieldsTab ? <CustomFieldsView /> : null}
        {isEmailSettingsTab ? (
          <EmailSettingsView onManageMailboxes={() => navigate('/settings/mailboxes')} />
        ) : null}
        {isConversationsTab ? renderConversationsView() : null}

        {!isMultiFactorAuthenticationTab &&
        !isCustomFieldsTab &&
        !isEmailSettingsTab &&
        !isConversationsTab ? (
          <>
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
          </>
        ) : null}
      </div>
    </>
  )
}

export default ProfileView

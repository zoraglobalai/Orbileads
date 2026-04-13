import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { readAuthSession } from '../../../lib/auth'

type MailProvider = 'Google' | 'Outlook' | 'Other'

const providers: Array<{
  id: MailProvider
  name: string
  subtitle: string
  locked?: boolean
}> = [
  { id: 'Google', name: 'Google', subtitle: 'Gmail / GSuite' },
  { id: 'Outlook', name: 'Outlook', subtitle: 'Hotmail, Live, MSN' },
  { id: 'Other', name: 'Other', subtitle: 'Any provider, IMAP', locked: true },
]

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-10 w-10">
      <path
        fill="#FFC107"
        d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.2 36 24 36c-6.63 0-12-5.37-12-12S17.37 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92Z"
      />
      <path
        fill="#FF3D00"
        d="M6.31 14.69 12.88 19.5C14.66 15.09 18.98 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.24C29.14 35.09 26.68 36 24 36c-5.18 0-9.62-3.31-11.28-7.91l-6.52 5.02C9.51 39.58 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.61 20.08H42V20H24v8h11.3a12.05 12.05 0 0 1-4.08 5.56l.01-.01 6.19 5.24C36.98 39.2 44 34 44 24c0-1.34-.14-2.65-.39-3.92Z"
      />
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-10 w-10">
      <path fill="#0A5FB4" d="M24 14h24a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H24z" />
      <path fill="#1976D2" d="M12 18h22v28H12z" />
      <path
        fill="#fff"
        d="M23 32c0 5.52-3.13 10-7 10s-7-4.48-7-10 3.13-10 7-10 7 4.48 7 10Zm-9.5 0c0 3.5 1.12 6 2.5 6s2.5-2.5 2.5-6-1.12-6-2.5-6-2.5 2.5-2.5 6Z"
      />
      <path fill="#50A7F2" d="M34 22 50 26v12l-16 4z" />
      <path
        fill="#B9D8F9"
        d="M50 26 34 38V22l8 6.2L50 26Zm0 12-8-2.2L34 42V38l16-12v12Z"
      />
    </svg>
  )
}

function OtherIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-10 w-10 text-slate-500">
      <rect
        x="12"
        y="18"
        width="40"
        height="28"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="m14 21 18 15 18-15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M6.5 8V6.75a3.5 3.5 0 1 1 7 0V8M5.75 8h8.5v7.5h-8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProviderIcon({ provider }: { provider: MailProvider }) {
  if (provider === 'Google') {
    return <GoogleIcon />
  }

  if (provider === 'Outlook') {
    return <OutlookIcon />
  }

  return <OtherIcon />
}

function LinkMailboxSetupPage() {
  const session = readAuthSession()
  const navigate = useNavigate()
  const [selectedProvider, setSelectedProvider] = useState<MailProvider>('Google')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-screen bg-[#f6f8fb] text-slate-900">
      <aside className="hidden w-[250px] shrink-0 border-r border-slate-200 bg-[#f3f4f6] px-3 py-3 shadow-[inset_-1px_0_0_rgba(148,163,184,0.14)] lg:block">
        <div className="sticky top-4 space-y-3">
          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
            <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-brand-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
              Orbileads
            </span>
            <h1 className="mt-3 text-[16px] font-semibold leading-6 text-slate-950">
              Mailbox setup
            </h1>
            <p className="mt-2 text-[12px] leading-6 text-slate-500">
              Connect your inbox with the same clean workflow used across your settings area.
            </p>
          </div>

          <div className="rounded-[16px] bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_70%,#0f66a1_100%)] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              <span>Link mailbox</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-2.5 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/settings/mailboxes')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close guided mailbox setup"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4.5 w-4.5">
              <path
                d="m5 5 10 10M15 5 5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 lg:px-6 lg:py-5">
          <div className="mx-auto max-w-[860px] rounded-[22px] border border-slate-200 bg-white px-4 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:px-5 lg:px-6 lg:py-6">
            <div className="mb-5 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-[22px] font-semibold tracking-tight text-slate-950 sm:text-[25px]">
                  Let&apos;s link your mailbox
                </h2>
                <p className="mt-2.5 max-w-[560px] text-[14px] leading-7 text-slate-600">
                  Link your mailboxes with Orbileads to gain full functionality of core engagement
                  tools, like emails, sequences, conversations, meetings and more.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-slate-950">Choose your email provider</h3>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {providers.map((provider) => {
                  const isSelected = selectedProvider === provider.id

                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => !provider.locked && setSelectedProvider(provider.id)}
                      className={`relative flex min-h-[128px] flex-col items-center justify-center rounded-[14px] border px-4 py-5 text-center transition ${
                        provider.locked
                          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                          : isSelected
                            ? 'border-[#8ab8f3] bg-[linear-gradient(180deg,#ffffff_0%,#f5faff_100%)] text-slate-800 shadow-[0_12px_32px_rgba(17,87,168,0.10)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
                      }`}
                    >
                      {provider.locked ? (
                        <span className="absolute right-4 top-4 text-slate-400">
                          <LockIcon />
                        </span>
                      ) : null}

                      <ProviderIcon provider={provider.id} />
                      <span className="mt-3 text-[17px] font-medium text-slate-950">{provider.name}</span>
                      <span className="mt-1 text-[12px] text-slate-500">{provider.subtitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 rounded-[16px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] px-4 py-3.5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <h3 className="text-[16px] font-semibold text-slate-950">Orbileads Terms of Services</h3>

              <label className="mt-3 flex gap-3 rounded-[14px] border border-slate-200 bg-white px-4 py-2.5 text-[12px] leading-6 text-slate-600">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1679bd] focus:ring-[#1679bd]"
                />
                <span>
                  I agree to Orbileads Terms of Service and Privacy Policy and understand that
                  connecting my email account may be used to provide and improve Orbileads services.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => navigate('/settings/mailboxes')}
                className="rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!acceptedTerms}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${
                  acceptedTerms
                    ? 'bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <path
                    d="M8 12a2.5 2.5 0 0 1 0-3.5l2-2a2.5 2.5 0 1 1 3.5 3.5l-.8.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8a2.5 2.5 0 0 1 0 3.5l-2 2a2.5 2.5 0 1 1-3.5-3.5l.8-.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Link mailbox</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LinkMailboxSetupPage

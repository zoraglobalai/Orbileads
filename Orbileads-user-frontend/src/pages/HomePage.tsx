import { useEffect, useState } from 'react'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../lib/auth'

function HomePage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())

  useEffect(() => subscribeToAuthChanges(() => setSession(readAuthSession())), [])

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="flex w-full flex-1 items-center justify-center rounded-[32px] border border-dashed border-[var(--color-border-strong)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] px-6 py-20 text-center shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--color-brand)]">
            Orbileads
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {session ? `Welcome, ${session.user.full_name}` : 'Home page placeholder'}
          </h1>
          <p className="text-base leading-7 text-slate-500">
            {session
              ? `Your account is connected successfully with ${session.user.email}. You can now continue building the user-side experience on top of this authenticated flow.`
              : 'This space is intentionally left open for your future product content. The navigation is ready, responsive, and aligned with the authentication flow.'}
          </p>
        </div>
      </section>
    </main>
  )
}

export default HomePage

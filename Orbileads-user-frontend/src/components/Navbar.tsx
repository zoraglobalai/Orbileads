import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../lib/api'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../lib/auth'

function Navbar() {
  const navigate = useNavigate()
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => subscribeToAuthChanges(() => setSession(readAuthSession())), [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      navigate('/', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-1.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          to="/"
          className="order-1 flex h-12 items-center justify-start gap-3 overflow-visible"
          aria-label="Orbileads home"
        >
          <img
            src="/Orbileads logo.png"
            alt="Orbileads"
            className="h-24 w-auto -translate-y-[1px] object-contain sm:h-28"
          />
        </Link>

        <nav className="order-2 flex items-center gap-3 lg:justify-end">
          {session ? (
            <>
              <div className="hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-slate-600 sm:block">
                {session.user.full_name}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--color-border-strong)] bg-white px-5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-[#28395f] hover:text-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-[0_10px_24px_rgba(22,121,189,0.22)]'
                      : 'border border-[var(--color-border-strong)] bg-white text-slate-700 hover:border-[#28395f] hover:text-[var(--color-brand)]'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-[0_10px_24px_rgba(22,121,189,0.22)]'
                      : 'border border-[var(--color-border-strong)] bg-white text-slate-700 hover:border-[#28395f] hover:text-[var(--color-brand)]'
                  }`
                }
              >
                Create Account
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

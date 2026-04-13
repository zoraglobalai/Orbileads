import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../lib/api'
import type { AuthSession } from '../lib/auth'

type AppSidebarProps = {
  session: AuthSession
}

function AppSidebar({ session }: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      navigate('/', { replace: true })
    } finally {
      setIsLoggingOut(false)
      setIsProfileMenuOpen(false)
    }
  }

  const initials = session.user.full_name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sidebarItems = [
    {
      label: 'Store',
      path: '/store',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M4 7.5h12l-.9 8H4.9L4 7.5ZM6.2 7.5V6.4A3.8 3.8 0 0 1 10 2.6a3.8 3.8 0 0 1 3.8 3.8v1.1M7.2 10.3h.01M12.8 10.3h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M3.5 3.5h5v5h-5zM11.5 3.5h5v7h-5zM3.5 10.5h5v6h-5zM11.5 13.5h5v3h-5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Actors',
      path: '/actors',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M7 5 3.5 10 7 15M13 5l3.5 5-3.5 5M10.8 4 9.2 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Runs',
      path: '/runs',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M6 4.5v11l8-5.5-8-5.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Integrations',
      path: '/integrations',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M7 7h6v6H7zM10 3.5v3M10 13.5v3M3.5 10h3M13.5 10h3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
          <path d="M10 6.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm6 3.2-1.5.6a4.9 4.9 0 0 1-.4 1l.7 1.4-1.7 1.7-1.4-.7c-.3.2-.7.3-1 .4L10 16l-1.2-1.3c-.3-.1-.7-.2-1-.4l-1.4.7-1.7-1.7.7-1.4a4.9 4.9 0 0 1-.4-1L4 10l1.3-1.2c.1-.3.2-.7.4-1l-.7-1.4 1.7-1.7 1.4.7c.3-.2.7-.3 1-.4L10 4l1.2 1.3c.3.1.7.2 1 .4l1.4-.7 1.7 1.7-.7 1.4c.2.3.3.7.4 1L16 10Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <div className="w-[236px] shrink-0" aria-hidden="true" />
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[236px] flex-col border-r border-slate-200 bg-[#f3f4f6] px-2 py-2 shadow-[inset_-1px_0_0_rgba(148,163,184,0.14)]">
        <div className="px-1.5 pb-2">
          <img src="/top_logo.png" alt="Orbileads" className="h-9 w-auto object-contain" />
        </div>

        <div className="space-y-1 px-0.5">
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-left text-[15px] transition ${
                  location.pathname === item.path
                    ? 'bg-[#e3e7ec] font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(15,23,42,0.08)]'
                    : 'text-slate-800 hover:bg-[#e9edf2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(15,23,42,0.06)]'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center text-slate-600">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

        </div>

        <div className="flex-1" />

        <div className="px-0.5 pb-1.5">
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-slate-500">RAM</p>
                <p className="font-medium text-slate-700">0 MB / 8 GB</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-slate-500">Credits</p>
                <p className="font-medium text-slate-700">$0.50 / $5.00</p>
              </div>
            </div>
          </div>
        </div>

        <div ref={profileMenuRef} className="relative">
          {isProfileMenuOpen ? (
            <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>Logout</span>
                <span>{isLoggingOut ? '...' : ''}</span>
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left transition hover:bg-[#e9edf2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(15,23,42,0.06)]"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1679bd] text-[9px] font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold leading-5 text-slate-900">{session.user.full_name}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar

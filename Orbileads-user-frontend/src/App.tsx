import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from './lib/auth'
import GoogleAuthCallbackPage from './pages/GoogleAuthCallbackPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ActorsPage from './pages/modules/actors'
import DashboardPage from './pages/modules/dashboard'
import IntegrationsPage from './pages/modules/integration'
import ResetPasswordPage from './pages/ResetPasswordPage'
import RunsPage from './pages/modules/run'
import SettingsPage from './pages/modules/settings'
import SignupPage from './pages/SignupPage'

function AppShell() {
  const location = useLocation()
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())

  useEffect(() => subscribeToAuthChanges(() => setSession(readAuthSession())), [])

  const authenticatedShellRoutes = new Set([
    '/dashboard',
    '/actors',
    '/runs',
    '/integrations',
    '/settings',
  ])
  const hideNavbar = Boolean(session) && authenticatedShellRoutes.has(location.pathname)

  return (
    <div className="min-h-screen bg-[var(--color-app)] text-slate-900">
      {hideNavbar ? null : <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/runs" element={<RunsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App

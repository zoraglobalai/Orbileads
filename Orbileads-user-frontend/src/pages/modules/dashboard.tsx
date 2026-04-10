import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppSidebar from '../../components/AppSidebar'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../lib/auth'

function DashboardPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())

  useEffect(() => subscribeToAuthChanges(() => setSession(readAuthSession())), [])

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <section className="flex min-h-screen flex-1 items-start px-8 py-8">
        <p className="text-lg font-medium text-slate-700">Dashboard</p>
      </section>
    </main>
  )
}

export default DashboardPage

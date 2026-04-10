import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppSidebar from '../../components/AppSidebar'
import RunsTable from '../../components/runs/RunsTable'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../lib/auth'
import { useRunManager } from '../../hooks/useRunManager'

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="m14.5 14.5 3 3M8.75 15a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function RunsPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const [searchTerm, setSearchTerm] = useState('')
  const { getRuns } = useRunManager()

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  const runs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return getRuns().filter((run) => {
      if (!query) {
        return true
      }

      return [run.status, run.toolName, run.platformName, run.taskSummary]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [getRuns, searchTerm])

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <section className="min-h-screen flex-1 bg-white px-5 py-5 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <header className="border-b border-slate-200 pb-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[42px] font-semibold tracking-tight text-slate-950">Runs</h1>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                API
              </button>
            </div>
          </header>

          <section className="mt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-4">
                <div className="flex min-w-[248px] flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-500 lg:max-w-[420px]">
                  <SearchIcon />
                  <input
                    id="runs-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by run ID"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {runs.length} recent run{runs.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <path
                    d="M4 5.5h12l-4.7 5.2v4.1l-2.6 1.4v-5.5L4 5.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>Newest first</span>
              </div>
            </div>
          </section>

          <div className="mt-5">
            <RunsTable runs={runs} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default RunsPage

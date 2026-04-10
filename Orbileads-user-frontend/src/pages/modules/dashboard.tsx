import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppSidebar from '../../components/AppSidebar'
import RecentRunTable from '../../components/dashboard/RecentRunTable'
import RecentToolCard from '../../components/dashboard/RecentToolCard'
import PlatformIcon from '../../components/store/PlatformIcon'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../lib/auth'
import { tools } from '../../lib/data/tools'
import { getToolRoute } from '../../lib/utils/routeHelpers'
import { formatRelativeTime } from '../../lib/utils/dateFormat'
import { useRunManager } from '../../hooks/useRunManager'

function DashboardPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const navigate = useNavigate()
  const { getRuns, getSuggestedTools, getAverageResults, readRecentTools } = useRunManager()

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  const runs = getRuns()
  const recentRuns = runs.slice(0, 6)
  const recentTools = readRecentTools().slice(0, 4)
  const suggestedTools = getSuggestedTools()

  const recentToolCards = useMemo(
    () =>
      recentTools
        .map((item) => {
          const tool = tools.find((entry) => entry.id === item.toolId)
          if (!tool) {
            return null
          }

          return {
            tool,
            meta: `Viewed ${formatRelativeTime(item.viewedAt)}`,
          }
        })
        .filter((item): item is { tool: (typeof tools)[number]; meta: string } => Boolean(item)),
    [recentTools],
  )

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <section className="min-h-screen flex-1 bg-white px-5 py-5 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[42px] font-semibold tracking-tight text-slate-950">Dashboard</h1>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Create
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                <path
                  d="m5.5 7.5 4.5 4.5 4.5-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </header>

          <section className="mt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-950">Recently viewed</h2>
              </div>
              <p className="text-sm text-slate-500">{recentToolCards.length} tools</p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {recentToolCards.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-slate-300 bg-white px-6 py-10 text-sm text-slate-600 xl:col-span-4">
                  Open any tool from the Store and it will show up here for faster access.
                </div>
              ) : (
                recentToolCards.map(({ tool, meta }) => (
                  <RecentToolCard
                    key={tool.id}
                    iconKey={tool.iconKey}
                    title={tool.actorLabel}
                    subtitle={tool.platformName}
                    meta={meta}
                    buttonLabel="Open tool"
                    onOpen={() => navigate(getToolRoute(tool.platformSlug, tool.slug))}
                  />
                ))
              )}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[16px] font-semibold text-slate-950">Suggested Actors for you</h2>
              <div className="flex items-center gap-5 text-sm">
                <button type="button" className="text-slate-500 transition hover:text-slate-900">
                  Hide
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/store')}
                  className="font-medium text-slate-900 transition hover:text-[var(--color-brand)]"
                >
                  View all
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {suggestedTools.map((tool) => (
                <article
                  key={tool.id}
                  className="group overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] active:translate-y-0 active:shadow-[0_6px_16px_rgba(15,23,42,0.06)]"
                >
                  <button
                    type="button"
                    onClick={() => navigate(getToolRoute(tool.platformSlug, tool.slug))}
                    className="w-full p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition duration-200 group-hover:border-slate-300 group-hover:bg-slate-50">
                        <PlatformIcon iconKey={tool.iconKey} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-950 transition group-hover:text-slate-900">{tool.actorLabel}</h3>
                        <p className="line-clamp-1 text-sm text-slate-500">{tool.slugLabel}</p>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700">{tool.storeDescription}</p>
                  </button>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 transition duration-200 group-hover:bg-slate-100/80">
                    <span>{tool.metadata.maintainedBy ?? 'Orbileads'}</span>
                    <div className="flex items-center gap-3">
                      <span>{tool.metadata.rating}</span>
                      <span>{tool.metadata.users}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[16px] font-semibold text-slate-950">Actor runs</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/runs')}
                className="text-sm font-medium text-slate-900 transition hover:text-[var(--color-brand)]"
              >
                View all runs
              </button>
            </div>

            <div className="mt-5 flex items-center gap-6 border-b border-slate-200">
              <button
                type="button"
                className="border-b-2 border-[var(--color-brand)] pb-3 text-sm font-semibold text-[var(--color-brand)]"
              >
                Recent
              </button>
              <button type="button" className="pb-3 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                Scheduled
              </button>
            </div>

            <div className="mt-4">
              <RecentRunTable runs={recentRuns} />
            </div>
          </section>

          <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total Runs</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{runs.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Successful Runs</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {runs.filter((run) => run.status === 'Succeeded').length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Active Platforms</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {new Set(runs.map((run) => run.platformSlug)).size}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Average Results</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{getAverageResults()}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage

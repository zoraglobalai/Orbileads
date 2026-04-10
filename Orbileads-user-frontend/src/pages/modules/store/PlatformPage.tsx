import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AppSidebar from '../../../components/AppSidebar'
import PlatformIcon from '../../../components/store/PlatformIcon'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../../lib/auth'
import { platforms } from '../../../lib/data/platforms'
import { tools } from '../../../lib/data/tools'
import { getToolRoute } from '../../../lib/utils/routeHelpers'

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function PlatformPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const navigate = useNavigate()
  const { platformSlug } = useParams()

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  const platform = useMemo(
    () => platforms.find((entry) => entry.slug === platformSlug) ?? null,
    [platformSlug],
  )
  const platformTools = useMemo(
    () => tools.filter((tool) => tool.platformSlug === platformSlug),
    [platformSlug],
  )

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!platform) {
    return <Navigate to="/store" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <section className="min-h-screen flex-1 bg-[#f8fafc] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span>Store</span>
            <ChevronRightIcon />
            <span>{platform.name}</span>
          </button>

          <header className="mt-4 rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <div className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <PlatformIcon iconKey={platform.iconKey} className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[36px] font-semibold tracking-tight text-slate-950">
                      {platform.pageTitle}
                    </h1>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {platform.category}
                    </span>
                  </div>
                  <p className="mt-3 text-lg text-slate-700">{platform.pageSubtitle}</p>
                  <p className="mt-4 max-w-4xl text-[15px] leading-7 text-slate-600">{platform.pageIntro}</p>
                </div>
              </div>

              <aside className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Why this platform
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  Structured discovery for {platform.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{platform.longDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                    {platformTools.length} tools
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Ready to use
                  </span>
                </div>
              </aside>
            </div>
          </header>

          <section className="mt-8">
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight text-slate-950">Available tools</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Choose a workflow below to configure inputs, launch a run, and reflect activity across
                Dashboard, Actors, and Runs.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {platformTools.map((tool) => (
                <article
                  key={tool.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <PlatformIcon iconKey={tool.iconKey} className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {tool.platformCategory}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                    {tool.actorLabel}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{tool.platformCardDescription}</p>

                  <div className="mt-5 space-y-2">
                    {tool.platformHighlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-500">
                      <p>Supported output preview</p>
                      <p className="mt-1 text-slate-700">
                        {tool.infoTab.outputFields.slice(0, 3).join(', ')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(getToolRoute(tool.platformSlug, tool.slug))}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
                    >
                      {tool.toolRouteButtonLabel}
                      <ChevronRightIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default PlatformPage

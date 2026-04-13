import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppSidebar from '../../components/AppSidebar'
import ActorsTable from '../../components/actors/ActorsTable'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../lib/auth'
import { tools } from '../../lib/data/tools'
import { getToolRoute } from '../../lib/utils/routeHelpers'
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

function FilterIcon() {
  return (
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
  )
}

function getPricingLabel(tool: (typeof tools)[number]) {
  switch (tool.id) {
    case 'tool-google-maps-business-scraper':
      return 'from $4.00 / 1,000 scraped places'
    case 'tool-google-maps-contact-extractor':
      return 'from $4.60 / 1,000 enriched businesses'
    case 'tool-youtube-scraper':
      return 'from $3.70 / 1,000 video results'
    case 'tool-youtube-channel-discovery':
      return 'from $3.20 / 1,000 channels'
    case 'tool-linkedin-company-employee-scraper':
      return 'from $5.40 / 1,000 employee records'
    case 'tool-linkedin-profile-scraper':
      return 'from $4.90 / 1,000 profile records'
    case 'tool-instagram-profile-scraper':
      return 'from $3.90 / 1,000 profile results'
    case 'tool-instagram-comment-extractor':
      return 'from $3.40 / 1,000 comments'
    default:
      return 'Usage-based pricing'
  }
}

function ActorsPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { getActorStats } = useRunManager()

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return tools.filter((tool) => {
      if (!query) {
        return true
      }

      return [tool.actorLabel, tool.platformName, tool.storeDescription, tool.platformCategory]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [searchTerm])

  const rows = filteredTools.map((tool) => ({
    tool,
    pricingLabel: getPricingLabel(tool),
    ...getActorStats(tool.id),
  }))

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
                  <h1 className="text-[42px] font-semibold tracking-tight text-slate-950">Actors</h1>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-6 text-[15px] font-medium">
                  <button
                    type="button"
                    className="border-b-2 border-[var(--color-brand)] pb-3 text-[var(--color-brand)]"
                  >
                    Recent & Bookmarked
                  </button>
                  <button type="button" className="pb-3 text-slate-500 transition hover:text-slate-900">
                    Issues
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/store')}
                  className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
                >
                  Go to Store
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  Develop new
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  API
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
                <div className="flex min-w-[248px] flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-500 lg:max-w-[420px]">
                  <SearchIcon />
                  <input
                    id="actors-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by Actor name"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                {['Last run status', 'Bookmarked', 'Pricing model'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <FilterIcon />
                    {label}
                  </button>
                ))}
              </div>

              <p className="shrink-0 text-right text-sm font-medium text-slate-900">{rows.length} Actors</p>
            </div>
          </section>

          <div className="mt-5">
            {rows.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-white px-6 py-12 text-sm text-slate-600">
                No tools match the current search. Try a different keyword or category.
              </div>
            ) : (
              <ActorsTable
                rows={rows}
                onOpen={(tool) => navigate(getToolRoute(tool.platformSlug, tool.slug))}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ActorsPage

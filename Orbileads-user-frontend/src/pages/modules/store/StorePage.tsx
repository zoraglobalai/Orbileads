import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AppSidebar from '../../../components/AppSidebar'
import StoreActorCard from '../../../components/store/StoreActorCard'
import StorePromoBanner from '../../../components/store/StorePromoBanner'
import StoreShelf from '../../../components/store/StoreShelf'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../../lib/auth'
import { tools } from '../../../lib/data/tools'
import { getPlatformRoute, getToolRoute } from '../../../lib/utils/routeHelpers'

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

const featuredChips = ['Social media', 'AI', 'Agents', 'Lead generation', 'E-commerce', 'SEO tools', '...']

function StorePage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    return subscribeToAuthChanges(() => setSession(readAuthSession()))
  }, [])

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return tools
    }

    return tools.filter((tool) =>
      [tool.actorLabel, tool.slugLabel, tool.storeDescription, tool.platformName, tool.platformCategory]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [searchTerm])

  const googleMapsTools = filteredTools.filter((tool) => tool.platformSlug === 'google-maps')
  const youtubeTools = filteredTools.filter((tool) => tool.platformSlug === 'youtube')
  const linkedinTools = filteredTools.filter((tool) => tool.platformSlug === 'linkedin')
  const instagramTools = filteredTools.filter((tool) => tool.platformSlug === 'instagram')

  const allActors = filteredTools
  const leadGenerationTools = [...googleMapsTools, ...linkedinTools, ...youtubeTools].slice(0, 4)
  const risingStars = [...instagramTools, ...youtubeTools, ...googleMapsTools].slice(0, 4)
  const communityPicks = [...linkedinTools, ...instagramTools, ...googleMapsTools, ...youtubeTools].slice(0, 8)

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-screen bg-white text-slate-900">
      <AppSidebar session={session} />
      <section className="min-h-screen flex-1 bg-white px-5 py-5 sm:px-7 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <header>
            <h1 className="text-[46px] font-semibold tracking-tight text-slate-950">Orbileads Store</h1>

            <div className="mt-5 flex max-w-[520px] flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-500">
                <SearchIcon />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search Actors"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="button"
                className="rounded-lg bg-[var(--color-brand)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
              >
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {featuredChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {chip}
                </button>
              ))}
            </div>
          </header>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[18px] font-semibold text-slate-950">All Actors</h2>
              <button
                type="button"
                className="text-sm font-medium text-slate-900 transition hover:text-[var(--color-brand)]"
              >
                View all →
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {allActors.map((tool) => (
                <StoreActorCard
                  key={tool.id}
                  tool={tool}
                  onOpen={() => navigate(getToolRoute(tool.platformSlug, tool.slug))}
                  onOpenPlatform={() => navigate(getPlatformRoute(tool.platformSlug))}
                />
              ))}
            </div>
          </section>

          <div className="mt-10">
            <StorePromoBanner
              title="Marketing tools for teams who put the web to work"
              description="Our best picks for lead generation, location intelligence, social discovery, and creator research across the channels Orbileads supports today."
              buttonLabel="Browse Actors"
              variant="orbit"
              onBrowse={() => navigate('/actors')}
            />
          </div>

          <div className="mt-10">
            <StoreShelf
              title="Lead generation"
              tools={leadGenerationTools}
              onOpenTool={(tool) => navigate(getToolRoute(tool.platformSlug, tool.slug))}
            />
          </div>

          <div className="mt-10">
            <StorePromoBanner
              title="Platform insights, ready in minutes"
              description="Explore tools purpose-built for Google Maps, LinkedIn, YouTube, and Instagram workflows without leaving your authenticated workspace."
              buttonLabel="Browse Actors"
              variant="layers"
              onBrowse={() => navigate('/actors')}
            />
          </div>

          <div className="mt-10">
            <StoreShelf
              title="Rising stars"
              tools={risingStars}
              onOpenTool={(tool) => navigate(getToolRoute(tool.platformSlug, tool.slug))}
            />
          </div>

          <div className="mt-10">
            <StorePromoBanner
              title="Discover social and professional scraping gems"
              description="Meet the Orbileads actors you might have missed, from creator discovery and comment extraction to profile enrichment and employee mapping."
              buttonLabel="Browse Actors"
              variant="gems"
              onBrowse={() => navigate('/actors')}
            />
          </div>

          <div className="mt-10">
            <StoreShelf
              title="Popular Actors from the community"
              tools={communityPicks}
              onOpenTool={(tool) => navigate(getToolRoute(tool.platformSlug, tool.slug))}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default StorePage

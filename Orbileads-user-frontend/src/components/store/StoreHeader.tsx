type StoreHeaderProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  onBrowse: () => void
}

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

function StoreHeader({ searchTerm, onSearchChange, onBrowse }: StoreHeaderProps) {
  return (
    <header className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Orbileads Marketplace</p>
          <h1 className="mt-2 text-[42px] font-semibold tracking-tight text-slate-950">Store</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
            Choose a platform to explore lead generation tools for business discovery, outreach, and prospecting.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <label htmlFor="store-search" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Search
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-500">
              <SearchIcon />
              <input
                id="store-search"
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search platforms or tools"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={onBrowse}
              className="rounded-xl bg-[var(--color-brand)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
            >
              Browse Platforms
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default StoreHeader

type FeaturedBannerProps = {
  onBrowse: () => void
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M4 10h12M11.5 5.5 16 10l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function FeaturedBanner({ onBrowse }: FeaturedBannerProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Featured</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight text-slate-950">
            Lead generation tools built for modern prospecting
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-600">
            Explore location-based, professional, creator, and social discovery tools in one workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowse}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-brand)] bg-[var(--color-brand)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
        >
          Browse Platforms
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  )
}

export default FeaturedBanner

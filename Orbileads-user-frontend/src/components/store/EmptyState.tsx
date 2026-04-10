type EmptyStateProps = {
  onClear: () => void
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

function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <SearchIcon />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">No matching platforms found</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Try a different search term or switch categories to explore available lead tools.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
      >
        Clear filters
      </button>
    </div>
  )
}

export default EmptyState

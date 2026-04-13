type ToolCardProps = {
  name: string
}

function ToolPreviewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
      <path
        d="M10 4.2 11.5 7.6l3.7.3-2.8 2.4.9 3.7-3.3-1.9-3.3 1.9.9-3.7-2.8-2.4 3.7-.3L10 4.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function ToolCard({ name }: ToolCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
          <ToolPreviewIcon />
        </span>
        <span className="truncate text-sm font-medium text-slate-800">{name}</span>
      </div>
      <span className="shrink-0 text-[11px] font-medium text-slate-400">Included</span>
    </div>
  )
}

export default ToolCard

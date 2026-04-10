import PlatformIcon from './PlatformIcon'
import ToolCard from './ToolCard'
import type { PlatformRecord } from '../../types/platform'

type PlatformCardProps = {
  platform: PlatformRecord
  toolNames: string[]
  onExplore: () => void
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

function PlatformCard({ platform, toolNames, onExplore }: PlatformCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <PlatformIcon iconKey={platform.iconKey} className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
          {platform.category}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-[20px] font-semibold text-slate-950">{platform.name}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{platform.description}</p>
      </div>

      <div className="mt-5 space-y-2">
        {toolNames.map((toolName) => (
          <ToolCard key={toolName} name={toolName} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] font-medium">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">2 tools</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Ready to use</span>
      </div>

      <button
        type="button"
        onClick={onExplore}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-brand)] bg-[var(--color-brand)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
      >
        Explore Tools
        <ArrowRightIcon />
      </button>
    </article>
  )
}

export default PlatformCard

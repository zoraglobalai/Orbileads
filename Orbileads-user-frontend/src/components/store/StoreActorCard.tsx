import type { ToolRecord } from '../../types/tool'
import PlatformIcon from './PlatformIcon'

type StoreActorCardProps = {
  tool: ToolRecord
  onOpen: () => void
  onOpenPlatform?: () => void
}

function StoreActorCard({ tool, onOpen, onOpenPlatform }: StoreActorCardProps) {
  return (
    <article className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] active:translate-y-0 active:shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full p-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition duration-200 group-hover:border-slate-300 group-hover:bg-slate-50">
            <PlatformIcon iconKey={tool.iconKey} className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[13px] font-semibold text-slate-950 transition group-hover:text-slate-900">
              {tool.actorLabel}
            </h3>
            <p className="line-clamp-1 text-[11px] text-slate-500">{tool.slugLabel}</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-slate-600">{tool.storeDescription}</p>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 transition duration-200 group-hover:bg-slate-100/80">
        {onOpenPlatform ? (
          <button
            type="button"
            onClick={onOpenPlatform}
            className="truncate rounded-sm outline-none transition hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {tool.metadata.maintainedBy ?? tool.platformName}
          </button>
        ) : (
          <span className="truncate">{tool.metadata.maintainedBy ?? tool.platformName}</span>
        )}
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span>★ {tool.metadata.rating}</span>
          <span>⚙ {tool.metadata.users}</span>
        </div>
      </div>
    </article>
  )
}

export default StoreActorCard

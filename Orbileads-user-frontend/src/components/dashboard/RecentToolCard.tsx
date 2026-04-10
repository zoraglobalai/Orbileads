import PlatformIcon from '../store/PlatformIcon'
import type { PlatformIconKey } from '../../types/platform'

type RecentToolCardProps = {
  iconKey: PlatformIconKey
  title: string
  subtitle: string
  meta: string
  buttonLabel: string
  onOpen: () => void
}

function RecentToolCard({ iconKey, title, subtitle, meta, buttonLabel, onOpen }: RecentToolCardProps) {
  return (
    <article className="group overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] active:translate-y-0 active:shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition duration-200 group-hover:border-slate-300 group-hover:bg-slate-50">
            <PlatformIcon iconKey={iconKey} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-slate-950 transition group-hover:text-slate-900">{title}</h3>
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
            <p className="truncate text-sm text-slate-500">{meta}</p>
          </div>
        </div>

        <span className="sr-only">
        {buttonLabel}
        </span>
      </button>
    </article>
  )
}

export default RecentToolCard

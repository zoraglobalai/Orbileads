import PlatformIcon from '../store/PlatformIcon'
import type { ToolRecord } from '../../types/tool'

type ToolDetailHeaderProps = {
  tool: ToolRecord
  pricingLabel: string
  onStart: () => void
  onSave?: () => void
}

function ToolDetailHeader({ tool, pricingLabel, onStart, onSave }: ToolDetailHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-700">
              <PlatformIcon iconKey={tool.iconKey} className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[24px] font-semibold tracking-tight text-slate-950 sm:text-[30px]">
                  {tool.detailTitle}
                </h1>
                <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-[13px] text-slate-700">
                  {pricingLabel}
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="ml-1.5 h-4 w-4 text-slate-400">
                    <path
                      d="m5.5 7.5 4.5 4.5 4.5-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-700">
                  {tool.slugLabel}
                </span>
                <button
                  type="button"
                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                    <path
                      d="M7 7.5A2.5 2.5 0 0 1 9.5 5h5A2.5 2.5 0 0 1 17 7.5v5A2.5 2.5 0 0 1 14.5 15h-5A2.5 2.5 0 0 1 7 12.5v-5Zm-4 0A2.5 2.5 0 0 1 5.5 5H6"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-slate-600">
                <span>Rating {tool.metadata.rating}</span>
                <span>Saved {tool.metadata.favorites}</span>
                <span>Runs {tool.metadata.runs}</span>
                <span>Users {tool.metadata.users}</span>
                <span>Crafted by {tool.platformName}</span>
                <span>Maintained by {tool.metadata.maintainedBy ?? 'Orbileads'}</span>
                {tool.metadata.permissionsLabel ? <span>{tool.metadata.permissionsLabel}</span> : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-strong)]"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                <path d="M6 4.5v11l8-5.5-8-5.5Z" fill="currentColor" />
              </svg>
              {tool.startButtonLabel}
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              {tool.secondaryButtonLabel}
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              API
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              ...
            </button>
          </div>
        </div>

        <p className="max-w-5xl text-[15px] leading-7 text-slate-700">{tool.detailDescription}</p>
      </div>
    </header>
  )
}

export default ToolDetailHeader

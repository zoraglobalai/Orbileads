import { tools } from '../../lib/data/tools'
import { formatDateTimeLong, formatDuration } from '../../lib/utils/dateFormat'
import type { RunRecord } from '../../types/run'
import RunStatusBadge from '../runs/RunStatusBadge'
import PlatformIcon from '../store/PlatformIcon'

type RecentRunTableProps = {
  runs: RunRecord[]
}

function RecentRunTable({ runs }: RecentRunTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      {runs.length === 0 ? (
        <div className="px-6 py-12 text-sm text-slate-600">
          No runs yet. Start a tool from the Store to populate dashboard activity.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {runs.map((run) => {
            const tool = tools.find((entry) => entry.id === run.toolId)

            return (
              <div
                key={run.id}
                className="grid grid-cols-[170px_minmax(0,1fr)_90px_170px_90px] items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50/70 active:bg-slate-100/80"
              >
                <div>
                  <RunStatusBadge status={run.status} />
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                    <PlatformIcon iconKey={tool?.iconKey ?? 'google-maps'} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-slate-950">{run.toolName}</p>
                    <p className="truncate text-sm text-slate-500">
                      {`${tool?.slugLabel ?? run.toolSlug} | Pay per event`}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm font-medium text-[var(--color-brand)]">{run.resultCount}</div>
                <div className="text-sm text-slate-700">{formatDateTimeLong(run.startedAt)}</div>
                <div className="text-sm text-slate-700">{formatDuration(run.durationSeconds)}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentRunTable

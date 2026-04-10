import { tools } from '../../lib/data/tools'
import { formatDateTimeLong, formatDuration } from '../../lib/utils/dateFormat'
import type { RunRecord } from '../../types/run'
import PlatformIcon from '../store/PlatformIcon'
import RunStatusBadge from './RunStatusBadge'

type RunsTableProps = {
  runs: RunRecord[]
}

function RunsTable({ runs }: RunsTableProps) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] table-fixed">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[18%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr className="text-left text-[12px] font-medium uppercase tracking-[0.18em] text-slate-500">
              <th className="px-3 py-4 text-center">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              </th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Actor</th>
              <th className="px-4 py-4">Task</th>
              <th className="px-4 py-4 text-right">Results</th>
              <th className="px-4 py-4 text-right">Usage</th>
              <th className="px-4 py-4">Started</th>
              <th className="px-4 py-4 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {runs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-sm text-slate-600">
                  No runs yet. Start a tool from the Store to create your first mock run.
                </td>
              </tr>
            ) : (
              runs.map((run) => {
                const tool = tools.find((entry) => entry.id === run.toolId)

                return (
                  <tr className="align-top text-sm text-slate-700 transition-colors hover:bg-slate-50/70 active:bg-slate-100/80" key={run.id}>
                    <td className="px-3 py-4 text-center">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                            <path
                              d="m5 10 3 3 7-7"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>
                        <RunStatusBadge status={run.status} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                          <PlatformIcon iconKey={tool?.iconKey ?? 'google-maps'} className="h-[18px] w-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">{run.toolName}</p>
                          <p className="truncate text-sm text-slate-500">
                            {`${tool?.slugLabel ?? run.toolSlug} | Pay per event`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{run.taskSummary}</td>
                    <td className="px-4 py-4 text-right font-medium text-[var(--color-brand)]">{run.resultCount}</td>
                    <td className="px-4 py-4 text-right font-medium text-slate-800">
                      ${run.mockCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{formatDateTimeLong(run.startedAt)}</td>
                    <td className="px-4 py-4 text-right text-slate-700">{formatDuration(run.durationSeconds)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-800"
          >
            20
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
              <path
                d="m5.5 7.5 4.5 4.5 4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Page 1</span>
        </div>
      </div>
    </section>
  )
}

export default RunsTable

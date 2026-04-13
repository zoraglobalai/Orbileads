import { formatDateTimeLong, formatDuration } from '../../lib/utils/dateFormat'
import type { ToolRecord } from '../../types/tool'
import PlatformIcon from '../store/PlatformIcon'
import ActorStatusBadge from './ActorStatusBadge'

type ActorsTableProps = {
  rows: Array<{
    tool: ToolRecord
    totalRuns: number
    lastRunStarted: string | null
    lastRunStatus: string | null
    lastRunDuration: number | null
    pricingLabel: string
  }>
  onOpen?: (tool: ToolRecord) => void
}

function ActorsTable({ rows, onOpen }: ActorsTableProps) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[35%]" />
            <col className="w-[10%]" />
            <col className="w-[20%]" />
            <col className="w-[17%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr className="text-left text-[12px] font-medium text-slate-600">
              <th className="px-3 py-4 text-center">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              </th>
              <th className="px-4 py-4">
                <span className="inline-flex items-center gap-1">
                  Name
                  <span className="text-slate-900">↑↓</span>
                </span>
              </th>
              <th className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1">
                  Total runs
                  <span className="text-slate-900">↑↓</span>
                </span>
              </th>
              <th className="px-4 py-4">Pricing</th>
              <th className="px-4 py-4">
                <span className="inline-flex items-center gap-1">
                  Last run started
                  <span className="text-[var(--color-brand)]">↓</span>
                </span>
              </th>
              <th className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1">
                  Last run status
                  <span className="text-slate-900">↑↓</span>
                </span>
              </th>
              <th className="px-4 py-4 text-right">Last run duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map(({ tool, totalRuns, lastRunStarted, lastRunStatus, lastRunDuration, pricingLabel }) => (
              <tr
                key={tool.id}
                className={`align-top text-sm text-slate-700 transition-colors ${onOpen ? 'cursor-pointer hover:bg-slate-50/70 active:bg-slate-100/80' : ''}`}
                onClick={onOpen ? () => onOpen(tool) : undefined}
              >
                <td className="px-3 py-4 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                      <PlatformIcon iconKey={tool.iconKey} className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{tool.actorLabel}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
                        <span className="truncate">{tool.slugLabel.replace('orbileads/', '')}</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                            <path
                              d="M6 4.8A1.8 1.8 0 0 1 7.8 3h4.4A1.8 1.8 0 0 1 14 4.8v10.4l-4-2.5-4 2.5V4.8Z"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </svg>
                          {tool.metadata.favorites}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-medium text-[var(--color-brand)]">{totalRuns}</td>
                <td className="px-4 py-4">
                  <div className="inline-flex max-w-full items-center rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-sm text-slate-700">
                    <span className="truncate">{pricingLabel}</span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="ml-2 h-4 w-4 shrink-0 text-slate-400">
                      <path
                        d="m5.5 7.5 4.5 4.5 4.5-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {lastRunStarted ? formatDateTimeLong(lastRunStarted) : 'No activity yet'}
                </td>
                <td className="px-4 py-4 text-center">
                  <ActorStatusBadge status={lastRunStatus} />
                </td>
                <td className="px-4 py-4 text-right text-slate-700">{formatDuration(lastRunDuration)}</td>
              </tr>
            ))}
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
          <span className="text-slate-400">Go to page:</span>
          <div className="h-8 w-12 rounded-lg border border-slate-200 bg-slate-100" />
          <button type="button" className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-400">
            Go
          </button>
          <button type="button" className="rounded-lg px-2 py-1.5 text-slate-400">‹</button>
          <button type="button" className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-800">
            1
          </button>
          <button type="button" className="rounded-lg px-2 py-1.5 text-slate-400">›</button>
        </div>
      </div>
    </section>
  )
}

export default ActorsTable

import type { RunStatus } from '../../types/run'

type RunStatusBadgeProps = {
  status: RunStatus
}

function RunStatusBadge({ status }: RunStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        status === 'Succeeded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {status}
    </span>
  )
}

export default RunStatusBadge

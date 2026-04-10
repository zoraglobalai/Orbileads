type ActorStatusBadgeProps = {
  status: string | null
}

function ActorStatusBadge({ status }: ActorStatusBadgeProps) {
  if (!status) {
    return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">Available</span>
  }

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

export default ActorStatusBadge

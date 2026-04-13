type DashboardStatCardProps = {
  label: string
  value: string | number
}

function DashboardStatCard({ label, value }: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}

export default DashboardStatCard

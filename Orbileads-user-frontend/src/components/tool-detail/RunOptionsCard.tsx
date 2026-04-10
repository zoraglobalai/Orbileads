import type { ToolRunOption } from '../../types/tool'

type RunOptionsCardProps = {
  options: ToolRunOption[]
}

function RunOptionsCard({ options }: RunOptionsCardProps) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <h3 className="text-[15px] font-semibold text-slate-950">Run options</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-4">
        {options.map((option) => (
          <div key={option.label} className="text-sm">
            <p className="text-[12px] uppercase tracking-[0.12em] text-slate-500">{option.label}</p>
            <p className="mt-1 font-medium text-slate-900">{option.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RunOptionsCard

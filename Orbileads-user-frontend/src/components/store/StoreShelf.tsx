import StoreActorCard from './StoreActorCard'
import type { ToolRecord } from '../../types/tool'

type StoreShelfProps = {
  title: string
  viewAllLabel?: string
  tools: ToolRecord[]
  onOpenTool: (tool: ToolRecord) => void
}

function StoreShelf({ title, viewAllLabel = 'View all', tools, onOpenTool }: StoreShelfProps) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold text-slate-950">{title}</h2>
        <button type="button" className="text-sm font-medium text-slate-900 transition hover:text-[var(--color-brand)]">
          {viewAllLabel} →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <StoreActorCard key={`${title}-${tool.id}`} tool={tool} onOpen={() => onOpenTool(tool)} />
        ))}
      </div>
    </section>
  )
}

export default StoreShelf

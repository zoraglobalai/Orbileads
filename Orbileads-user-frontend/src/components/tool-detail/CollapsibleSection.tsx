import type { ReactNode } from 'react'

type CollapsibleSectionProps = {
  title: string
  description?: string
  isOpen: boolean
  onToggle: () => void
  children?: ReactNode
}

function CollapsibleSection({ title, description, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-slate-950">{title}</h3>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          >
            <path
              d="M7.5 4.5 13 10l-5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
      </button>
      {isOpen ? <div className="border-t border-slate-200 px-4 py-4">{children}</div> : null}
    </section>
  )
}

export default CollapsibleSection

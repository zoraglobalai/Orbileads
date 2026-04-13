type ToolTabKey = 'input' | 'information' | 'runs' | 'integrations'
type ToolViewMode = 'form' | 'json'

type ToolTabsProps = {
  activeTab: ToolTabKey
  onTabChange: (tab: ToolTabKey) => void
  viewMode: ToolViewMode
  onViewModeChange: (mode: ToolViewMode) => void
  runCount?: number
}

const tabs: Array<{ key: ToolTabKey; label: string }> = [
  { key: 'input', label: 'Input' },
  { key: 'information', label: 'Information' },
  { key: 'runs', label: 'Runs' },
  { key: 'integrations', label: 'Integrations' },
]

function ToolTabs({ activeTab, onTabChange, viewMode, onViewModeChange, runCount = 0 }: ToolTabsProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`border-b-2 pb-3 text-[15px] font-medium transition ${
              activeTab === tab.key
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            {tab.key === 'runs' ? <span className="ml-1 text-[13px]">{runCount}</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => onViewModeChange('form')}
          className={`rounded-md border px-3 py-1.5 text-sm transition ${
            viewMode === 'form'
              ? 'border-slate-300 bg-white font-medium text-slate-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]'
              : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-white hover:text-slate-900'
          }`}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('json')}
          className={`rounded-md border px-3 py-1.5 text-sm transition ${
            viewMode === 'json'
              ? 'border-slate-300 bg-white font-medium text-slate-900 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]'
              : 'border-slate-300 bg-slate-50 text-slate-500 hover:bg-white hover:text-slate-900'
          }`}
        >
          JSON
        </button>
      </div>
    </div>
  )
}

export default ToolTabs

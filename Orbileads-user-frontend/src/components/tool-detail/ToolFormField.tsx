import type { ToolFieldRecord } from '../../types/tool'

type ToolFormFieldProps = {
  field: ToolFieldRecord
  value: string | number | boolean
  error?: string
  onChange: (fieldName: string, value: string | number | boolean) => void
}

function ToolFormField({ field, value, error, onChange }: ToolFormFieldProps) {
  const commonClassName =
    'w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400'

  const labelText = (
    <span className="inline-flex items-center gap-1 text-[15px] font-medium text-slate-900">
      {field.label}
      {field.required ? <span className="text-rose-500">*</span> : null}
    </span>
  )

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
        />
        <span className="text-sm text-slate-700">{field.label}</span>
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <label className="block">{labelText}</label>
        <select
          value={typeof value === 'string' ? value : String(value ?? '')}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={commonClassName}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="block">{labelText}</label>
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <textarea
            rows={field.multipleRows ? 4 : 3}
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
            className="w-full resize-y border-0 bg-transparent px-0 py-0 text-sm text-slate-900 outline-none"
          />
          {field.addLabel || field.bulkEditLabel ? (
            <div className="mt-4 flex gap-2">
              {field.addLabel ? (
                <button
                  type="button"
                  className="rounded-md bg-[var(--color-brand)] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--color-brand-strong)]"
                >
                  + {field.addLabel}
                </button>
              ) : null}
              {field.bulkEditLabel ? (
                <button
                  type="button"
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {field.bulkEditLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block">{labelText}</label>
      <div className="relative">
        <input
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          min={field.min}
          step={field.step}
          value={typeof value === 'boolean' ? '' : value}
          placeholder={field.placeholder}
          onChange={(event) => {
            if (field.type === 'number') {
              onChange(field.name, event.target.value === '' ? '' : Number(event.target.value))
              return
            }

            onChange(field.name, event.target.value)
          }}
          className={`${commonClassName} ${field.suffix ? 'pr-16' : ''}`}
        />
        {field.suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {field.suffix}
          </span>
        ) : null}
      </div>
      {field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  )
}

export default ToolFormField

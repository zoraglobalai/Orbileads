import MultiInputField from './MultiInputField'
import ToolFormField from './ToolFormField'
import type { ToolSectionRecord } from '../../types/tool'

type ToolInputSectionProps = {
  section: ToolSectionRecord
  values: Record<string, string | number | boolean>
  errors: Record<string, string>
  onChange: (fieldName: string, value: string | number | boolean) => void
}

function ToolInputSection({ section, values, errors, onChange }: ToolInputSectionProps) {
  if (section.fields && section.fields.length > 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {section.fields.map((field) =>
          field.multipleRows ? (
            <div key={field.id} className="md:col-span-2">
              <MultiInputField
                field={field}
                value={values[field.name] ?? ''}
                error={errors[field.name]}
                onChange={onChange}
              />
            </div>
          ) : (
            <ToolFormField
              key={field.id}
              field={field}
              value={values[field.name] ?? ''}
              error={errors[field.name]}
              onChange={onChange}
            />
          ),
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {(section.contentLines ?? []).map((line) => (
        <div key={line} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {line}
        </div>
      ))}
    </div>
  )
}

export default ToolInputSection

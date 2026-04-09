import type { InputHTMLAttributes, ReactNode } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  rightAdornment?: ReactNode
}

function FormField({
  error,
  hint,
  id,
  label,
  rightAdornment,
  className = '',
  ...props
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand-muted)] ${rightAdornment ? 'pr-28' : ''} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-[var(--color-border-strong)]'} ${className}`.trim()}
          {...props}
        />
        {rightAdornment ? (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightAdornment}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default FormField

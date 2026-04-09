import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  centeredHeader?: boolean
}

function AuthCard({
  title,
  description,
  children,
  centeredHeader = false,
}: AuthCardProps) {
  return (
    <section className="w-full rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8">
      <header className={`mb-8 space-y-2 ${centeredHeader ? 'text-center' : ''}`}>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p
          className={`text-sm leading-6 text-slate-500 ${centeredHeader ? 'mx-auto max-w-md' : 'max-w-lg'}`}
        >
          {description}
        </p>
      </header>
      {children}
    </section>
  )
}

export default AuthCard

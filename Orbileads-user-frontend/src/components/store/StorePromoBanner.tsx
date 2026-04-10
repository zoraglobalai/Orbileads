type StorePromoBannerProps = {
  title: string
  description: string
  buttonLabel: string
  variant: 'orbit' | 'layers' | 'gems'
  onBrowse: () => void
}

function OrbitArtwork() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 160" className="h-32 w-full text-indigo-400">
      <circle cx="90" cy="80" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="90" cy="80" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M42 80h96M90 32v96M56 46l68 68M124 46 56 114" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="226" cy="80" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="226" cy="80" rx="20" ry="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M178 80h96M226 32v96" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function LayersArtwork() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 160" className="h-32 w-full text-indigo-400">
      <path d="M72 48 122 74 72 100 22 74 72 48Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M198 34 248 60 198 86 148 60 198 34Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M154 90 204 116 154 142 104 116 154 90Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 74v14l50 26 50-26V74M148 60v14l50 26 50-26V60M104 116v14l50 26 50-26v-14" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function GemsArtwork() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 160" className="h-32 w-full text-indigo-400">
      <path d="m118 24 44 18-64 16 20-34ZM180 76l78 18-102 54 24-72ZM104 70l32 78-76-38 44-40Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M98 58 80 110m82-68-6 106m102-54-122 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function StorePromoBanner({ title, description, buttonLabel, variant, onBrowse }: StorePromoBannerProps) {
  return (
    <section className="grid gap-6 border-y border-slate-200 bg-white px-5 py-8 lg:grid-cols-[1fr_320px] lg:items-center">
      <div className="max-w-xl">
        <h3 className="text-[20px] font-semibold tracking-tight text-indigo-950 sm:text-[28px]">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
        <button
          type="button"
          onClick={onBrowse}
          className="mt-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          {buttonLabel}
        </button>
      </div>

      <div className="justify-self-end">
        {variant === 'orbit' ? <OrbitArtwork /> : null}
        {variant === 'layers' ? <LayersArtwork /> : null}
        {variant === 'gems' ? <GemsArtwork /> : null}
      </div>
    </section>
  )
}

export default StorePromoBanner

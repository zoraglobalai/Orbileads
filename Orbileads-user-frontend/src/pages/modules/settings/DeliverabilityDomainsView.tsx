function DeliverabilityDomainsView() {
  return (
    <div className="mx-auto flex min-h-[460px] w-full max-w-[720px] flex-col items-center justify-center px-4 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute left-1 top-2 flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#8ec5ff] bg-[#eaf4ff] shadow-[0_10px_24px_rgba(102,168,255,0.18)]">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 text-[#1f74c9]">
            <path
              d="M4 8h24v16H4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="m4 9 12 10L28 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_75%,#0f66a1_100%)] text-white shadow-[0_12px_28px_rgba(22,121,189,0.28)]">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-6 w-6">
            <path
              d="M10 2.5v15M2.5 10h15M4.8 4.8l10.4 10.4M15.2 4.8 4.8 15.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1679bd_0%,#0f66a1_100%)] text-white shadow-[0_10px_20px_rgba(22,121,189,0.25)]">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
            <path
              d="M8 12a2.5 2.5 0 0 1 0-3.5l2-2a2.5 2.5 0 1 1 3.5 3.5l-.8.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8a2.5 2.5 0 0 1 0 3.5l-2 2a2.5 2.5 0 1 1-3.5-3.5l.8-.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="mt-8 max-w-[560px] text-[34px] font-medium tracking-tight text-slate-950">
        Link your domain to get started
      </h2>
      <p className="mt-4 max-w-[540px] text-[17px] leading-8 text-slate-600">
        Set up your domain to scale your outbound and do more with sequences, conversations,
        meeting, and other features.
      </p>

      <button
        type="button"
        className="mt-8 rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-6 py-3 text-base font-medium text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
      >
        Add domain
      </button>
    </div>
  )
}

export default DeliverabilityDomainsView

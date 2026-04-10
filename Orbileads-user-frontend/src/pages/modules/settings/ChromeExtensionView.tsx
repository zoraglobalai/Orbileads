function ChromeExtensionView() {
  return (
    <div className="mx-auto max-w-[980px]">
      <section className="rounded-[14px] border border-slate-200 bg-white px-6 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div className="relative flex h-18 w-18 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#7ec1ff_0%,#1679bd_70%,#0f66a1_100%)] shadow-[0_16px_30px_rgba(22,121,189,0.25)]">
              <svg aria-hidden="true" viewBox="0 0 48 48" className="h-9 w-9 text-white">
                <path
                  d="M24 9 14 31h6l4-9 4 9h6L24 9Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M27 17h8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 flex gap-1">
              <span className="h-5 w-2 rounded-full bg-[#d9ecff]" />
              <span className="h-7 w-2 rounded-full bg-[#bfdefc]" />
              <span className="h-5 w-2 rounded-full bg-[#d9ecff]" />
            </div>
          </div>

          <h2 className="mt-8 text-[28px] font-semibold tracking-tight text-slate-950">
            Find B2B contact info for free
          </h2>
          <p className="mt-3 max-w-[620px] text-[17px] leading-8 text-slate-500">
            Orbileads helps users find contact info, connect with buyers, track emails, and more
            for free.
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
          >
            <span>Get our Chrome extension</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
              <path
                d="M8 4.5h7.5V12M15.5 4.5 7 13M12.5 7.5v8H4.5v-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

export default ChromeExtensionView

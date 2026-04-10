function MailboxesView() {
  return (
    <div className="mx-auto max-w-[980px]">
      <section className="rounded-[14px] border border-slate-200 bg-white px-6 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[20px] border-2 border-[#8ec5ff] bg-[#eaf4ff] shadow-[0_14px_30px_rgba(102,168,255,0.16)]">
              <svg aria-hidden="true" viewBox="0 0 64 64" className="h-14 w-14 text-[#1f74c9]">
                <path
                  d="M10 18h44v28H10z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="m10 20 22 19 22-19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute right-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_70%,#0f66a1_100%)] text-white shadow-[0_12px_24px_rgba(22,121,189,0.24)]">
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

          <h2 className="mt-8 text-[28px] font-semibold tracking-tight text-slate-950">
            Add your mailbox to get started
          </h2>
          <p className="mt-3 max-w-[620px] text-[17px] leading-8 text-slate-500">
            Connect your mailbox to scale outreach, improve deliverability, and unlock features
            like sequences, meetings, and more.
          </p>

          <button
            type="button"
            className="mt-8 rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
          >
            Link mailbox
          </button>
        </div>
      </section>
    </div>
  )
}

export default MailboxesView

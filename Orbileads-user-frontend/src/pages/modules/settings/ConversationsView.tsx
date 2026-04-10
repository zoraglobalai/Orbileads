function ConversationsView() {
  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <section className="rounded-[16px] border border-slate-200 bg-[#f3f4f6] px-4 py-4 text-[15px] leading-7 text-slate-700">
        <div className="flex items-start gap-3">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-5 w-5 shrink-0 text-slate-600">
            <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M10 8v5M10 5.8h.01"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <p>
            The following video conferencing apps and recorded meeting settings were set by your
            company admin or are default system settings. Admins can make changes
            <button type="button" className="ml-1 text-slate-900 underline">
              here
            </button>
            .
          </p>
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <h2 className="text-[18px] font-medium text-slate-950">Video conferencing apps</h2>

        <div className="mt-6">
          <h3 className="text-[16px] font-medium text-slate-950">Record via the Olbileads Recorder</h3>
          <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-slate-600">
            Based on your auto-record settings, the recorder will join meetings with links in your
            calendar events from the enabled conferencing apps.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
                  <path
                    d="M3.5 6.5h8v7h-8zM11.5 8l5-2.5v8L11.5 11"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[16px] text-slate-900">Zoom</span>
            </div>

            <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 px-4 py-4">
              <div className="grid h-10 w-10 grid-cols-2 gap-0.5 overflow-hidden rounded-[10px]">
                <span className="bg-[#fbbc04]" />
                <span className="bg-[#34a853]" />
                <span className="bg-[#4285f4]" />
                <span className="bg-[#34a853]" />
              </div>
              <span className="text-[16px] text-slate-900">Google Meet</span>
            </div>

            <div className="flex items-center gap-4 rounded-[16px] border border-slate-200 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#635bff] text-white">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
                  <path
                    d="M3 6.5h6v7H3zM10 5h3.2a1.8 1.8 0 0 1 1.8 1.8V15H10zM15 8l2-1v7l-2-1"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-[16px] text-slate-900">Microsoft Teams</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-[18px] font-semibold text-slate-950">Record via Zoom Cloud</h3>
          <p className="mt-3 max-w-[860px] text-[14px] leading-7 text-slate-600">
            To use Zoom Cloud for cloud recording, you'll need to connect your Zoom account. This
            is available with a Zoom paid plan (Pro, Business, Business Plus, and Enterprise).
          </p>
          <div className="mt-5 max-w-[245px] rounded-[16px] border border-slate-200 px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
                  <path
                    d="M3.5 6.5h8v7h-8zM11.5 8l5-2.5v8L11.5 11"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[16px] text-slate-900">Zoom Cloud</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <h2 className="text-[18px] font-medium text-slate-950">Auto-record meetings</h2>
        <p className="mt-2 text-[14px] leading-7 text-slate-600">
          Select which meetings the Olbileads Recorder will automatically join and record. Please
          note, <span className="font-semibold text-slate-800">these settings are company-wide.</span>
        </p>

        <div className="mt-8 space-y-8">
          <div className="space-y-3">
            <h3 className="text-[16px] font-medium text-slate-950">
              Record my team's internal meetings when
            </h3>
            <label className="flex items-center gap-3 text-[14px] text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
              <span>An Olbileads recorded user is the host</span>
            </label>
            <label className="flex items-center gap-3 text-[14px] text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
              <span>An Olbileads recorded user is a participant</span>
            </label>
            <p className="text-[13px] leading-6 text-slate-500">
              Meetings with all participants from gmail.com are internal meetings.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[16px] font-medium text-slate-950">
              Record my team's external meetings when
            </h3>
            <label className="flex items-center gap-3 text-[14px] text-slate-700">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
              <span>An Olbileads recorded user is the host</span>
            </label>
            <label className="flex items-center gap-3 text-[14px] text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
              <span>An Olbileads recorded user is a participant</span>
            </label>
            <p className="text-[13px] leading-6 text-slate-500">
              Meetings with at least one participant outside of gmail.com are external meetings. If
              using the Olbileads Recorder with Zoom, the meeting's host must be present to enable
              recording. Zoom Cloud is not supported.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-[16px] border border-slate-200 bg-[#fffdf3] px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fef3c7] text-[#ca8a04]">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              <path
                d="M10 2.5a5.5 5.5 0 0 0-3.8 9.5c.7.7 1.2 1.6 1.3 2.5h5c.1-.9.6-1.8 1.3-2.5A5.5 5.5 0 0 0 10 2.5Zm-2 13h4M8.7 18h2.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[14px] leading-7 text-slate-700">
            <span className="font-medium">Tip:</span> You can invite recorder@Olbileads.io as a guest
            in your calendar event to have the recorder join the meeting.
          </p>
        </div>
      </section>
    </div>
  )
}

export default ConversationsView

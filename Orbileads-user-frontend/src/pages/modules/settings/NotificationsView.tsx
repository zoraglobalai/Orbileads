function NotificationsView() {
  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <section className="flex items-center justify-between rounded-[14px] bg-[#eaf3ff] px-6 py-4 text-[15px] text-[#245da8]">
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
            <path
              d="M10 3.5a3 3 0 0 0-3 3v1.7c0 .8-.2 1.6-.7 2.3L5.2 12h9.6l-1.1-1.5a4 4 0 0 1-.7-2.3V6.5a3 3 0 0 0-3-3Zm0 13a2.2 2.2 0 0 1-2-1.3h4a2.2 2.2 0 0 1-2 1.3Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Receive notifications directly in Slack to stay on top of Conversations activity.</p>
        </div>
        <button
          type="button"
          className="cursor-pointer text-sm font-medium text-[#245da8] transition hover:text-[#1a4f94]"
        >
          Integrate with Slack
        </button>
      </section>

      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="text-[16px] font-medium text-slate-950">System activity</h2>
        </div>
        <div className="px-4 py-5">
          <p className="max-w-[860px] text-[14px] leading-7 text-slate-600">
            Select the notifications you want to receive after a data request has been completed in
            Olbileads. Keep track of your data requests by going to{' '}
            <button
              type="button"
              className="cursor-pointer font-medium text-[#245da8] transition hover:text-[#1a4f94]"
            >
              Settings &gt; Data Request History
            </button>
            .
          </p>

          <div className="mt-6">
            <div className="grid grid-cols-[1fr_84px_84px] border-b border-slate-200 px-4 pb-3 text-[14px] font-medium text-slate-500">
              <span />
              <span className="text-center">Email</span>
              <span className="text-center">Slack</span>
            </div>

            {[
              {
                label: 'Receive a notification every time a data request is completed',
                email: true,
                slack: false,
              },
              {
                label: 'Receive a daily digest of data requests completed in a day',
                email: false,
                slack: false,
              },
              {
                label: 'Receive free data credit reminders',
                email: true,
                slack: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[1fr_84px_84px] items-center border-b border-slate-200 px-4 py-4 text-[14px] text-slate-700"
              >
                <span>{item.label}</span>
                <span className="flex justify-center">
                  <input
                    type="checkbox"
                    defaultChecked={item.email}
                    className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
                  />
                </span>
                <span className="flex justify-center">
                  <input
                    type="checkbox"
                    defaultChecked={item.slack}
                    className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="text-[16px] font-medium text-slate-950">Tasks</h2>
        </div>
        <div className="px-4 py-5">
          <div className="grid grid-cols-[1fr_84px_84px] border-b border-slate-200 px-4 pb-3 text-[14px] font-medium text-slate-500">
            <span />
            <span className="text-center">Email</span>
            <span className="text-center">Slack</span>
          </div>

          <div className="grid grid-cols-[1fr_84px_84px] items-center border-b border-slate-200 px-4 py-4 text-[14px] text-slate-700">
            <span>Receive reminders when tasks are due within a day</span>
            <span className="flex justify-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
            </span>
            <span className="flex justify-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-[#1679bd]"
              />
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotificationsView

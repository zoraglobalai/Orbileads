import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { deliverabilitySuiteItems, profileTabs } from './constants'
import ChromeExtensionView from './ChromeExtensionView'
import ConversationsView from './ConversationsView'
import DeliverabilityDomainsView from './DeliverabilityDomainsView'
import MailboxesView from './MailboxesView'
import NotificationsView from './NotificationsView'
import ProfileView from './ProfileView'
import SettingsSidebar from './SettingsSidebar'
import type { DeliverabilitySuiteItem, PersonalSettingKey } from './types'
import { readAuthSession, subscribeToAuthChanges, type AuthSession } from '../../../lib/auth'

function SettingsPage() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession())
  const [selectedPersonalSetting, setSelectedPersonalSetting] =
    useState<PersonalSettingKey>('Profile')
  const [isDeliverabilitySuiteOpen, setIsDeliverabilitySuiteOpen] = useState(false)
  const [selectedDeliverabilitySuiteItem, setSelectedDeliverabilitySuiteItem] =
    useState<DeliverabilitySuiteItem | null>(null)

  useEffect(() => subscribeToAuthChanges(() => setSession(readAuthSession())), [])

  if (!session) {
    return <Navigate to="/login" replace />
  }

  const isDeliverabilitySuiteView = selectedDeliverabilitySuiteItem !== null
  const isDomainsView = selectedDeliverabilitySuiteItem === 'Domains'
  const hideHeaderActions =
    selectedPersonalSetting === 'Mailboxes' ||
    selectedPersonalSetting === 'Notifications' ||
    selectedPersonalSetting === 'Chrome extension' ||
    selectedPersonalSetting === 'Conversations' ||
    isDeliverabilitySuiteView

  const pageTitle = isDeliverabilitySuiteView ? 'Deliverability Suite' : selectedPersonalSetting

  return (
    <main className="flex h-screen overflow-hidden bg-white text-slate-900">
      <section className="flex h-screen flex-1 overflow-hidden">
        <SettingsSidebar
          isDeliverabilitySuiteOpen={isDeliverabilitySuiteOpen}
          onToggleDeliverabilitySuite={() =>
            setIsDeliverabilitySuiteOpen((current) => !current)
          }
          selectedPersonalSetting={selectedPersonalSetting}
          onSelectPersonalSetting={(item) => {
            setSelectedPersonalSetting(item)
            setSelectedDeliverabilitySuiteItem(null)
          }}
          selectedDeliverabilitySuiteItem={selectedDeliverabilitySuiteItem}
          onSelectDeliverabilitySuiteItem={(item) => {
            setIsDeliverabilitySuiteOpen(true)
            setSelectedDeliverabilitySuiteItem(item)
          }}
        />

        <section className="flex h-screen flex-1 flex-col overflow-hidden bg-white">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div className="space-y-1.5">
              <h1 className="text-[30px] font-semibold tracking-tight text-slate-950">{pageTitle}</h1>
              {isDeliverabilitySuiteView ? (
                <div className="flex flex-wrap gap-6">
                  {deliverabilitySuiteItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedDeliverabilitySuiteItem(item)}
                      className={`relative pb-2 text-sm transition ${
                        selectedDeliverabilitySuiteItem === item
                          ? 'font-semibold text-slate-950'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item}
                      {selectedDeliverabilitySuiteItem === item ? (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : selectedPersonalSetting === 'Conversations' ? (
                <div className="flex flex-wrap gap-4">
                  <button type="button" className="relative pb-2 text-sm font-semibold text-slate-950">
                    Recording settings
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
                  </button>
                </div>
              ) : !hideHeaderActions ? (
                <div className="flex flex-wrap gap-4">
                  {profileTabs.map((tab, index) => (
                    <button
                      key={tab}
                      type="button"
                      className={`relative pb-2 text-sm transition ${
                        index === 0
                          ? 'font-semibold text-slate-950'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                      {index === 0 ? (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-slate-950" />
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {isDeliverabilitySuiteView ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
              >
                <span>Add</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <path
                    d="M6 8.5 10 12.5l4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : !hideHeaderActions ? (
              <button
                type="button"
                className="rounded-2xl bg-[linear-gradient(135deg,#66a8ff_0%,#1679bd_65%,#0f66a1_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,121,189,0.24)] transition hover:bg-[linear-gradient(135deg,#5f9ef1_0%,#126aa5_65%,#0d5a8f_100%)]"
              >
                Save
              </button>
            ) : null}
          </div>

          <div
            className={`flex-1 bg-white px-6 py-4 ${
              isDomainsView ? 'overflow-hidden' : 'overflow-y-auto'
            }`}
          >
            {selectedDeliverabilitySuiteItem === 'Domains' ? <DeliverabilityDomainsView /> : null}
            {!isDeliverabilitySuiteView && selectedPersonalSetting === 'Profile' ? (
              <ProfileView session={session} />
            ) : null}
            {!isDeliverabilitySuiteView && selectedPersonalSetting === 'Mailboxes' ? (
              <MailboxesView />
            ) : null}
            {!isDeliverabilitySuiteView && selectedPersonalSetting === 'Chrome extension' ? (
              <ChromeExtensionView />
            ) : null}
            {!isDeliverabilitySuiteView && selectedPersonalSetting === 'Conversations' ? (
              <ConversationsView />
            ) : null}
            {!isDeliverabilitySuiteView && selectedPersonalSetting === 'Notifications' ? (
              <NotificationsView />
            ) : null}
          </div>
        </section>
      </section>
    </main>
  )
}

export default SettingsPage

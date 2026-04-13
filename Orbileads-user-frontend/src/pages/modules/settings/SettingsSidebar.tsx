import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  billingAndCreditsItems,
  deliverabilitySuiteItems,
  idealCustomerProfileItems,
  personalSettingsItems,
  rulesOfEngagementItems,
  teamConversationsItems,
  teamEmailAndSequencesItems,
  usersAndTeamsItems,
  workspaceSettingsItems,
} from './constants'
import type { DeliverabilitySuiteItem, PersonalSettingKey } from './types'

type SettingsSidebarProps = {
  isDeliverabilitySuiteOpen: boolean
  onToggleDeliverabilitySuite: () => void
  selectedPersonalSetting: PersonalSettingKey
  onSelectPersonalSetting: (item: PersonalSettingKey) => void
  selectedDeliverabilitySuiteItem: DeliverabilitySuiteItem | null
  onSelectDeliverabilitySuiteItem: (item: DeliverabilitySuiteItem) => void
}

function SettingsSidebar({
  isDeliverabilitySuiteOpen,
  onToggleDeliverabilitySuite,
  selectedPersonalSetting,
  onSelectPersonalSetting,
  selectedDeliverabilitySuiteItem,
  onSelectDeliverabilitySuiteItem,
}: SettingsSidebarProps) {
  const navigate = useNavigate()
  const [isUsersAndTeamsOpen, setIsUsersAndTeamsOpen] = useState(false)
  const [isBillingAndCreditsOpen, setIsBillingAndCreditsOpen] = useState(false)
  const [isIdealCustomerProfileOpen, setIsIdealCustomerProfileOpen] = useState(false)
  const [isRulesOfEngagementOpen, setIsRulesOfEngagementOpen] = useState(false)
  const [isTeamEmailAndSequencesOpen, setIsTeamEmailAndSequencesOpen] = useState(false)
  const [isTeamConversationsOpen, setIsTeamConversationsOpen] = useState(false)
  const itemsWithoutChevron = new Set([
    'Integrations',
    'AI context center',
    'Team sharing & defaults',
    'Imports and exports',
  ])
  const workspaceSectionItems = workspaceSettingsItems.filter(
    (item) => item !== 'Objects, fields, stages' && item !== 'Imports and exports',
  )
  const dataManagementItems = ['Objects, fields, stages', 'Imports and exports']
  const isPersonalSettingsActive = selectedDeliverabilitySuiteItem === null

  return (
    <aside className="sticky top-0 flex h-screen w-[292px] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-[#f3f4f6] shadow-[inset_-1px_0_0_rgba(148,163,184,0.14)]">
      <div className="border-b border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-slate-800"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-slate-600">
            <path
              d="M12.5 4.5 7 10l5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Settings</span>
        </button>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 text-slate-400">
              <path
                d="M13.5 13.5 17 17M8.75 14.5a5.75 5.75 0 1 1 0-11.5 5.75 5.75 0 0 1 0 11.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Search settings</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Personal settings
          </p>
          <nav className="space-y-1">
            {personalSettingsItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectPersonalSetting(item)}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-[15px] leading-5 transition ${
                  isPersonalSettingsActive && item === selectedPersonalSetting
                    ? 'bg-[#e3e7ec] font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(15,23,42,0.08)]'
                    : 'text-slate-800 hover:bg-[#e9edf2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(15,23,42,0.06)]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace settings
          </p>
          <nav className="space-y-1">
            {workspaceSectionItems.map((item) => (
              <div key={item} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (item === 'Deliverability suite') {
                      onToggleDeliverabilitySuite()
                    }
                    if (item === 'Users and teams') {
                      setIsUsersAndTeamsOpen((current) => !current)
                    }
                    if (item === 'Billing and credits') {
                      setIsBillingAndCreditsOpen((current) => !current)
                    }
                    if (item === 'Ideal customer profile') {
                      setIsIdealCustomerProfileOpen((current) => !current)
                    }
                    if (item === 'Rules of engagement') {
                      setIsRulesOfEngagementOpen((current) => !current)
                    }
                    if (item === 'Team email & sequences') {
                      setIsTeamEmailAndSequencesOpen((current) => !current)
                    }
                    if (item === 'Team conversations') {
                      setIsTeamConversationsOpen((current) => !current)
                    }
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] leading-5 text-slate-800 transition hover:bg-[#e9edf2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(15,23,42,0.06)]"
                >
                  <span className="min-w-0 flex-1 pr-1 leading-5">{item}</span>
                  {!itemsWithoutChevron.has(item) ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                        (item === 'Deliverability suite' && isDeliverabilitySuiteOpen) ||
                        (item === 'Users and teams' && isUsersAndTeamsOpen) ||
                        (item === 'Billing and credits' && isBillingAndCreditsOpen) ||
                        (item === 'Ideal customer profile' && isIdealCustomerProfileOpen) ||
                        (item === 'Rules of engagement' && isRulesOfEngagementOpen) ||
                        (item === 'Team email & sequences' && isTeamEmailAndSequencesOpen) ||
                        (item === 'Team conversations' && isTeamConversationsOpen)
                          ? 'rotate-180'
                          : ''
                      }`}
                    >
                      <path
                        d="M6 8.5 10 12.5l4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>

                {item === 'Deliverability suite' && isDeliverabilitySuiteOpen ? (
                  <div className="space-y-1 pl-4">
                    {deliverabilitySuiteItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        onClick={() => onSelectDeliverabilitySuiteItem(subItem)}
                        className={`flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 transition ${
                          selectedDeliverabilitySuiteItem === subItem
                            ? 'bg-[#e3e7ec] font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(15,23,42,0.08)]'
                            : 'text-slate-700 hover:bg-[#e9edf2] hover:text-slate-900'
                        }`}
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Users and teams' && isUsersAndTeamsOpen ? (
                  <div className="space-y-1 pl-4">
                    {usersAndTeamsItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Billing and credits' && isBillingAndCreditsOpen ? (
                  <div className="space-y-1 pl-4">
                    {billingAndCreditsItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Ideal customer profile' && isIdealCustomerProfileOpen ? (
                  <div className="space-y-1 pl-4">
                    {idealCustomerProfileItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Rules of engagement' && isRulesOfEngagementOpen ? (
                  <div className="space-y-1 pl-4">
                    {rulesOfEngagementItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Team email & sequences' && isTeamEmailAndSequencesOpen ? (
                  <div className="space-y-1 pl-4">
                    {teamEmailAndSequencesItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        <span>{subItem}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {item === 'Team conversations' && isTeamConversationsOpen ? (
                  <div className="space-y-1 pl-4">
                    {teamConversationsItems.map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        className="flex w-full items-center rounded-xl px-3 py-1.5 text-left text-[13px] leading-5 text-slate-700 transition hover:bg-[#e9edf2] hover:text-slate-900"
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="pt-0.5">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Data management
            </p>
            <nav className="mt-1.5 space-y-1">
              {dataManagementItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] leading-5 text-slate-800 transition hover:bg-[#e9edf2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(15,23,42,0.06)]"
                >
                  <span className="min-w-0 flex-1 pr-1 leading-5">{item}</span>
                  {!itemsWithoutChevron.has(item) ? (
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-slate-400">
                      <path
                        d="M6 8.5 10 12.5l4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-[#e9edf2]"
        >
          <span className="text-sm leading-none">+</span>
          <span>Add Teammates</span>
        </button>
      </div>
    </aside>
  )
}

export default SettingsSidebar

import type { PersonalSettingKey, WorkspaceSettingKey } from './types'

export const personalSettingsItems: PersonalSettingKey[] = [
  'Profile',
  'Mailboxes',
  'Notifications',
  'Chrome extension',
  'Conversations',
]

export const workspaceSettingsItems: WorkspaceSettingKey[] = [
  'Deliverability suite',
  'Users and teams',
  'Billing and credits',
  'Integrations',
  'Ideal customer profile',
  'AI context center',
  'Rules of engagement',
  'Team email & sequences',
  'Team conversations',
  'Team meetings',
  'Team sharing & defaults',
  'System activity',
  'Objects, fields, stages',
  'Imports and exports',
]

export const deliverabilitySuiteItems = ['Overview', 'Domains', 'Mailboxes']
export const usersAndTeamsItems = ['Users']
export const billingAndCreditsItems = [
  'Plan overview',
  'License settings',
  'Credits & AI usage',
  'AI run usage',
]
export const idealCustomerProfileItems = [
  'Personas',
  'Buying intent',
  'Website visitors',
  'Signals',
  'Scoring',
]
export const rulesOfEngagementItems = ['Prospecting config', 'Snippets']
export const teamEmailAndSequencesItems = ['Tracking', 'Sequences']
export const teamConversationsItems = [
  'Recording configuration',
  'Team permissions',
  'Trackers',
  'Scorecards',
  'Custom field prompts',
]

export const profileTabs = [
  'General',
  'Multi-factor authentication',
  'Custom fields',
  'Email settings',
  'Conversations',
]

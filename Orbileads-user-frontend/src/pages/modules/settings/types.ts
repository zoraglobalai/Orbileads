export type PersonalSettingKey =
  | 'Profile'
  | 'Mailboxes'
  | 'Notifications'
  | 'Chrome extension'
  | 'Conversations'

export type WorkspaceSettingKey =
  | 'Deliverability suite'
  | 'Users and teams'
  | 'Billing and credits'
  | 'Integrations'
  | 'Ideal customer profile'
  | 'AI context center'
  | 'Rules of engagement'
  | 'Team email & sequences'
  | 'Team conversations'
  | 'Team meetings'
  | 'Team sharing & defaults'
  | 'System activity'
  | 'Objects, fields, stages'
  | 'Imports and exports'

export type DeliverabilitySuiteItem = 'Overview' | 'Domains' | 'Mailboxes'

export type ProfileTab =
  | 'General'
  | 'Multi-factor authentication'
  | 'Custom fields'
  | 'Email settings'
  | 'Conversations'

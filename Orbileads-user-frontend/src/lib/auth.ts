export type AuthUser = {
  id: number
  full_name: string
  email: string
  mobile_number: string
  country: string
  company_name: string
  accepted_terms: boolean
  accepted_terms_at: string | null
  date_joined: string
  updated_at: string
}

export type AuthTokens = {
  access: string
  refresh: string
}

export type AuthSession = {
  user: AuthUser
  tokens: AuthTokens
}

const AUTH_CHANGE_EVENT = 'orbileads-auth-change'
let currentAuthSession: AuthSession | null = null

function isBrowser() {
  return typeof window !== 'undefined'
}

export function readAuthSession(): AuthSession | null {
  return currentAuthSession
}

export function saveAuthSession(session: AuthSession) {
  if (!isBrowser()) {
    return
  }

  currentAuthSession = session
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return
  }

  currentAuthSession = null
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function subscribeToAuthChanges(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback)
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback)
}

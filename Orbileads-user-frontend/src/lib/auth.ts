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
const AUTH_STORAGE_KEY = 'orbileads-user-auth'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function readAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null
  }

  const rawValue = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as AuthSession
  } catch {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function saveAuthSession(session: AuthSession) {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function subscribeToAuthChanges(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback)
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback)
}

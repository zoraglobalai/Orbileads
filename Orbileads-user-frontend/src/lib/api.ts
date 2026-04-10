import {
  clearAuthSession,
  readAuthSession,
  type AuthSession,
  type AuthTokens,
  type AuthUser,
} from './auth'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, unknown>
}

export type SignupPayload = {
  full_name: string
  email: string
  mobile_number: string
  password: string
  confirm_password: string
  country: string
  company_name: string
  accept_terms: boolean
}

export type LoginPayload = {
  email: string
  password: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  uid: string
  token: string
  new_password: string
  confirm_new_password: string
}

type LoginResponse = {
  user: AuthUser
  tokens: AuthTokens
}

export class ApiError extends Error {
  errors: Record<string, unknown>

  constructor(message: string, errors: Record<string, unknown> = {}) {
    super(message)
    this.name = 'ApiError'
    this.errors = errors
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/users'

async function request<T>(path: string, options: RequestInit = {}) {
  const session = readAuthSession()
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (session?.tokens.access) {
    headers.set('Authorization', `Bearer ${session.tokens.access}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let payload: ApiEnvelope<T> | null = null

  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    payload = null
  }

  if (!response.ok || !payload?.success) {
    const message = payload?.message ?? 'Unable to complete the request.'
    const errors = payload?.errors ?? {}

    if (response.status === 401) {
      clearAuthSession()
    }

    throw new ApiError(message, errors)
  }

  return payload
}

export async function signupUser(payload: SignupPayload) {
  const response = await request<AuthUser>('/signup/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
}

export async function loginUser(payload: LoginPayload) {
  const response = await request<LoginResponse>('/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
}

export async function authenticateWithGoogle(credential: string) {
  const response = await request<LoginResponse>('/google-auth/', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  })

  return response
}

export async function requestPasswordResetLink(payload: ForgotPasswordPayload) {
  const response = await request<null>('/forgot-password/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await request<null>('/reset-password/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response
}

export async function logoutUser() {
  const session = readAuthSession()

  if (!session?.tokens.refresh) {
    clearAuthSession()
    return
  }

  try {
    await request<null>('/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: session.tokens.refresh }),
    })
  } finally {
    clearAuthSession()
  }
}

export function buildSession(user: AuthUser, tokens: AuthTokens): AuthSession {
  return { user, tokens }
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export function getFieldError(
  errors: Record<string, unknown> | undefined,
  field: string,
) {
  const value = errors?.[field]

  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && value.length > 0) {
    return String(value[0])
  }

  return undefined
}

const GOOGLE_AUTH_MESSAGE = 'orbileads-google-auth'
const GOOGLE_SCOPE = 'openid email profile'

function buildGoogleAuthUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID.')
  }

  const redirectUri = `${window.location.origin}/auth/google/callback`
  const nonce = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: GOOGLE_SCOPE,
    prompt: 'select_account',
    nonce,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function requestGoogleCredential() {
  const authUrl = buildGoogleAuthUrl()
  const popup = window.open(
    authUrl,
    'orbileads-google-auth',
    'width=520,height=640,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes',
  )

  if (!popup) {
    throw new Error('Google popup was blocked. Please allow popups and try again.')
  }

  return await new Promise<string>((resolve, reject) => {
    const cleanup = () => {
      window.removeEventListener('message', handleMessage)
      window.clearInterval(popupPoll)
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== GOOGLE_AUTH_MESSAGE) {
        return
      }

      cleanup()

      if (event.data.error) {
        reject(new Error(event.data.errorDescription || 'Google authentication was cancelled.'))
        return
      }

      if (!event.data.idToken) {
        reject(new Error('Google did not return a valid credential.'))
        return
      }

      resolve(event.data.idToken)
    }

    const popupPoll = window.setInterval(() => {
      if (popup.closed) {
        cleanup()
        reject(new Error('Google authentication was cancelled.'))
      }
    }, 500)

    window.addEventListener('message', handleMessage)
  })
}

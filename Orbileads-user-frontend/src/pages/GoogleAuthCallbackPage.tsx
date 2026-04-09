import { useEffect } from 'react'

function GoogleAuthCallbackPage() {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const idToken = hashParams.get('id_token')
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')

    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'orbileads-google-auth',
          idToken,
          error,
          errorDescription,
        },
        window.location.origin,
      )
      window.close()
    }
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-app)] px-4">
      <p className="text-sm text-slate-500">Completing Google sign-in...</p>
    </main>
  )
}

export default GoogleAuthCallbackPage

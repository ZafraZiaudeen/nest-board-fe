import { GoogleLogin } from "@react-oauth/google"
import { useAuth } from "@/components/auth/AuthProvider"
import type { AuthUser } from "@/api/auth"

/**
 * Renders Google's Sign In button. On success, exchanges the provider-issued
 * ID token with our own API (POST /auth/google). The credential is never
 * decoded or trusted client-side role and identity come from the API response.
 */
export function GoogleAuthButton({
  onSuccess,
  onError,
}: {
  onSuccess: (user: AuthUser) => void
  onError: (msg: string) => void
}) {
  const { loginWithGoogle } = useAuth()

  return (
    <GoogleLogin
      onSuccess={async ({ credential }) => {
        if (!credential) {
          onError("Google did not return a credential. Please try again.")
          return
        }
        try {
          const user = await loginWithGoogle(credential)
          onSuccess(user)
        } catch {
          onError("Google sign-in failed. Please try again.")
        }
      }}
      onError={() => onError("Google sign-in was cancelled or failed.")}
      width="100%"
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
    />
  )
}

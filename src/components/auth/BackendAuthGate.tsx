import { getAccessToken, setAccessToken } from "@/api/client"
import { useUser } from "@clerk/react"
import { useState, type ReactNode, type SubmitEvent } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { backendLogin } from "@/api/auth"

/**
 * A component that gates access to its children based on the presence of a backend authentication token.
 */
type BackendAuthGateProps = {
  children: ReactNode
}

export function BackendAuthGate({ children }: BackendAuthGateProps) {
  const { user } = useUser()
  const [token, setToken] = useState(getAccessToken())
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress ?? ""
  )
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (token) return <>{children}</>

  async function handleConnect(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { accessToken } = await backendLogin(email, password)
      setAccessToken(accessToken)
      setToken(accessToken)
    } catch {
      setError("Could not connect your booking account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border p-6">
      <p className="mb-4 text-sm text-gray-600">
        You're signed in with Clerk, but booking and favorites use a separate
        backend account. Connect it once to continue.
      </p>
      <form onSubmit={handleConnect} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Backend email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Backend password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Connecting..." : "Connect booking account"}
        </Button>
      </form>
    </div>
  )
}
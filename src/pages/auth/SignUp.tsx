import { useState, type FormEvent } from "react"
import { useNavigate, NavLink } from "react-router"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AuthUser } from "@/api/auth"
import { GoogleAuthButton } from "./GoogleAuthButton"
import heroImg from "@/assets/hero.png"

export function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  function handleGoogleSuccess(user: AuthUser) {
    navigate(user.role === "ADMIN" ? "/admin" : "/dashboard")
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await register(email, password, displayName)
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard")
    } catch {
      setError("Could not create your account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      {/* Background photo */}
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-2xl leading-none">🏠</span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            NestBoard
          </span>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-gray-900">
          Create an account
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Sign up for free and start exploring today
        </p>

        {/* Google sign-in */}
        {googleClientId && (
          <>
            <div className="mb-4">
              <GoogleAuthButton
                onSuccess={handleGoogleSuccess}
                onError={setError}
              />
            </div>
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/95 px-2 text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <Input
              id="displayName"
              type="text"
              placeholder="Jane Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <NavLink
            to="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  )
}

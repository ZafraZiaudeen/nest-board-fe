import { Navigate } from "react-router"
import type { ReactNode } from "react"
import { useAuth } from "./AuthProvider"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isSignedIn, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  const role = user?.role as string | undefined

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
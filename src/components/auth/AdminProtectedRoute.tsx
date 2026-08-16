import { useAuth } from "@/components/auth/AuthProvider"
import { Navigate, Outlet } from "react-router"

export function AdminProtectedRoute() {
  const { user, isLoading, isSignedIn } = useAuth()

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

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
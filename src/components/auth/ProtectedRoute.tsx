import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "./AuthProvider"

export function ProtectedRoute() {
  const { isLoading, isSignedIn, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
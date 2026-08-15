import { useAuth } from "@/components/auth/AuthProvider"
import { type ReactNode, useEffect } from "react"

const ADMIN_CLASS = "admin-theme"

type AdminThemeApplierProps = {
  children: ReactNode
}

export function AdminThemeApplier({ children }: AdminThemeApplierProps) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    const root = document.documentElement

    if (user?.role === "ADMIN") {
      root.classList.add(ADMIN_CLASS)
    } else {
      root.classList.remove(ADMIN_CLASS)
    }

    return () => {
      root.classList.remove(ADMIN_CLASS)
    }
  }, [user, isLoading])

  return <>{children}</>
}
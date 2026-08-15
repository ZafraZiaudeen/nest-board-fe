import { Heart, Building2, MessageCircle } from "lucide-react"
import { NavLink } from "react-router"
import { useAuth } from "@/components/auth/AuthProvider"

export type NavbarLink = {
  label: string
  to: string
}

type NavbarProps = {
  links: NavbarLink[]
}

export function Navbar({ links }: NavbarProps) {
  const { isSignedIn, user, logout } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  return (
    <div className="absolute top-0 right-0 left-0 z-50 px-4 pt-4">
      <nav
        className={`flex items-center justify-between rounded-full px-5 py-3 ${
          isAdmin ? "bg-blue-500/50" : "bg-orange-500/50"
        }`}
      >
        {/* Logo */}
        <NavLink to={isAdmin ? "/admin" : "/"}>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg tracking-wide text-white">NestBoard</span>
          </div>
        </NavLink>

        {/* Nav links */}
        {!isAdmin && (
          <div className="flex items-center gap-1">
            {links.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "text-md rounded-full px-4 py-1.5 transition-all duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-3.5">
          {!isAdmin && (
            <>
              <button className="rounded-full p-2 transition-colors hover:bg-white/10">
                <Heart className="h-5 w-5 text-white/70 hover:text-white" />
              </button>

              <button className="rounded-full p-2 transition-colors hover:bg-white/10">
                <MessageCircle className="h-5 w-5 text-white/70 hover:text-white" />
              </button>
            </>
          )}

          {!isSignedIn ? (
            <NavLink
              to="/sign-in"
              className="text-md rounded-full bg-white px-4 py-1.5 text-gray-800 transition-colors hover:bg-white/90"
            >
              Sign in
            </NavLink>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {user?.displayName?.[0]?.toUpperCase() ?? "?"}
              </span>
              Sign out
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}
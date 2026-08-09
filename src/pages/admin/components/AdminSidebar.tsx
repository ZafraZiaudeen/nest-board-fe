import { useClerk, useUser } from "@clerk/react"
import {
  Building2,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react"
import { NavLink } from "react-router"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Dashboard",  to: "/admin",            icon: LayoutDashboard, end: true  },
  { label: "Properties", to: "/admin/properties", icon: Building2,       end: false },
  { label: "Bookings",   to: "/admin/bookings",   icon: CalendarDays,    end: false },
  { label: "Settings",   to: "/admin/settings",   icon: Settings,        end: false },
] as const

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const f = firstName?.[0] ?? ""
  const l = lastName?.[0] ?? ""
  return (f + l).toUpperCase() || "U"
}

function getDisplayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null,
): string {
  if (firstName && lastName) return `${firstName} ${lastName[0]}.`
  if (firstName) return firstName
  return username ?? "User"
}

export function AdminSidebar() {
  const { user } = useUser()
  const { signOut } = useClerk()

  const initials = getInitials(user?.firstName, user?.lastName)
  const displayName = getDisplayName(user?.firstName, user?.lastName, user?.username)

  return (
    <aside className="flex h-screen w-[270px] flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-[76px] shrink-0 items-center gap-[10px] border-b border-[#F3F4F6] px-[22px]">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#DBEAFE]">
          <Home className="h-[18px] w-[18px] text-[#2563EB]" />
        </div>
        <span className="text-lg font-bold text-[#111827]">NestBoard</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2.5 pt-3.5">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="block"
          >
            {({ isActive }) => (
              <div
                className={cn(
                  "flex h-[43px] items-center gap-3 rounded-[10px] px-[14px] text-sm transition-colors",
                  isActive
                    ? "bg-[#EFF6FF] font-bold text-[#2563EB]"
                    : "font-normal text-[#6B7280] hover:bg-gray-50",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-[#2563EB]" : "text-[#9CA3AF]",
                  )}
                />
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="flex h-[65px] shrink-0 items-center gap-[10px] border-t border-[#F3F4F6] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB]">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-bold text-[#111827]">{displayName}</span>
          <span className="text-[11px] text-[#9CA3AF]">Property Owner</span>
        </div>
        <button
          onClick={() => signOut()}
          className="shrink-0 rounded p-1 text-[#D1D5DB] transition-colors hover:text-gray-500"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

import { Heart, Building2, MessageCircle, User } from "lucide-react"
import { NavLink } from "react-router"

export type NavbarLink = {
  label: string
  to: string
}

type NavbarProps = {
  links: NavbarLink[]
}

export function Navbar({ links }: NavbarProps) {
  return (
    <div className="absolute top-0 right-0 left-0 z-50 px-4 pt-4">
      <nav className="flex items-center justify-between rounded-full bg-orange-500/50 px-5 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-regular text-lg tracking-wide text-white">
            NestBoard
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "text-md font-regular rounded-full bg-primary px-4 py-1.5 text-white"
                  : "text-md font-regular px-4 py-1.5 text-white/70 transition-colors hover:text-white"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3.5">
          <Heart className="h-5 w-5 cursor-pointer text-white/70 transition-colors hover:text-white" />
          <MessageCircle className="h-5 w-5 cursor-pointer text-white/70 transition-colors hover:text-white" />
          <div className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-white/100 py-1 pr-2.5 pl-2">
            <span className="text-md font-semibold text-gray-800">JD</span>
            <User className="h-4 w-4 text-gray-800" />
          </div>
        </div>
      </nav>
    </div>
  )
}

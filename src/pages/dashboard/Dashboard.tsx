import { Link } from "react-router"
import { CalendarDays, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"
import { useMyBookings } from "@/hooks/useMyBookings"

export function Dashboard() {
  const { user } = useAuth()
  const { data: bookings, isLoading } = useMyBookings()

  const total = bookings?.length ?? 0
  const confirmed = bookings?.filter((b) => b.status === "CONFIRMED").length ?? 0
  const pending = bookings?.filter((b) => b.status === "PENDING").length ?? 0

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-28 pb-12">
      <div className="mx-auto max-w-2xl">
        {/* Welcome */}
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName || "there"}!
        </h1>
        <p className="mt-1 text-gray-500">Here's a snapshot of your activity.</p>

        {/* Stat chips */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatChip
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            label="Total Bookings"
            value={total}
            loading={isLoading}
            bg="bg-primary/5"
          />
          <StatChip
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            label="Confirmed"
            value={confirmed}
            loading={isLoading}
            bg="bg-green-50"
          />
          <StatChip
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            label="Pending"
            value={pending}
            loading={isLoading}
            bg="bg-amber-50"
          />
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/my-bookings"
            className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-900">My Bookings</p>
                <p className="text-sm text-gray-400">View and manage all your bookings</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-semibold text-gray-900">Browse Properties</p>
                <p className="text-sm text-gray-400">Find your next co-living space</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatChip({
  icon,
  label,
  value,
  loading,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: number
  loading: boolean
  bg: string
}) {
  return (
    <div className={`rounded-2xl ${bg} p-4 flex flex-col gap-2`}>
      {icon}
      {loading ? (
        <div className="h-7 w-10 animate-pulse rounded-md bg-gray-200" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

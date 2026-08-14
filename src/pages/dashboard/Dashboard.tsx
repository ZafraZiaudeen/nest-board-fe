import { fetchMyBookings } from "@/api/bookings"
import { BackendAuthGate } from "@/components/auth/BackendAuthGate"
import { useUser } from "@clerk/react"
import { useQuery } from "@tanstack/react-query"
// import { FileExclamationPoint } from "lucide-react"

export function Dashboard() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {user?.firstName || "User"}!
        </h1>

        <BackendAuthGate>
          <MyBookings />
        </BackendAuthGate>
      </div>
    </div>
  )
}

function MyBookings() {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["my-bookings"], queryFn: fetchMyBookings })

  if (isLoading) {
    return <p className="mt-6 text-gray-500">Loading your bookings...</p>
  }
  if (isError) {
    return <p className="mt-6 text-red-600">Could not load bookings.</p>
  }
  if (!bookings?.length) {
    return <p className="mt-6 text-gray-500">No bookings yet.</p>
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-xl border p-4">
          <p className="font-semibold">
            {b.property.title} - {b.roomType.name}
          </p>
          <p className="text-sm text-gray-500">
            Seat {b.seatNumber} - {b.leaseStart} to {b.leaseEnd}
          </p>
          <p className="text-sm">
            {b.status} / {b.paymentStatus}
          </p>
        </div>
      ))}
    </div>
  )
}
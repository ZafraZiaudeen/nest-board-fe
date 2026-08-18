import { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router"
import { Heart } from "lucide-react"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { RoomDetailCard } from "./components/RoomDetailCard"
import { useAuth } from "@/components/auth/AuthProvider"
import { useFavouriteIds, useToggleFavourite } from "@/hooks/useFavourites"

function getCurrentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function addMonths(yyyymm: string, n: number): string {
  const [y, m] = yyyymm.split("-").map(Number)
  const total = m - 1 + n
  return `${y + Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`
}

function monthDiff(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number)
  const [ty, tm] = to.split("-").map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

type Selection = { roomId: string; seatNumber: number }

export function RoomTypeDetails() {
  const { propertyId, roomTypeId } = useParams<{
    propertyId: string
    roomTypeId: string
  }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Lease-window state — drives the availability fetch so the seat grid
  // reflects the period the tenant actually wants to book.
  const [startMonth, setStartMonth] = useState(getCurrentMonth())
  // endMonth is the INCLUSIVE last month of the lease.
  // durationMonths = diff + 1 so "From Aug, To Oct" = 3 months (Aug, Sep, Oct).
  const [endMonth, setEndMonth] = useState(getCurrentMonth())
  const durationMonths = Math.max(1, monthDiff(startMonth, endMonth) + 1)
  const leaseWindow = { startMonth, durationMonths }

  const { data: property, isLoading, isError } = usePropertyDetail(propertyId, leaseWindow)
  const [selection, setSelection] = useState<Selection | null>(null)

  function handleStartMonthChange(value: string) {
    setStartMonth(value)
    // Clamp endMonth so it never goes before the new startMonth
    if (monthDiff(value, endMonth) < 0) setEndMonth(value)
  }

  const { isSignedIn, user } = useAuth()
  const { data: favouriteIds } = useFavouriteIds()
  const toggleMut = useToggleFavourite()
  const isUser = isSignedIn && user?.role !== "ADMIN"
  const isFavourite = favouriteIds?.has(propertyId ?? "") ?? false

  function handleHeartClick() {
    if (!isUser) {
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    if (propertyId) toggleMut.mutate(propertyId)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-gray-400">Loading rooms...</p>
      </div>
    )
  }

  const roomType = property?.roomTypes.find((rt) => rt.id === roomTypeId)

  if (isError || !property || !roomType) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 pt-20">
        <p className="text-xl font-semibold text-gray-700">Room type not found</p>
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => navigate(`/property-details/${propertyId}`)}
        >
          Back to property
        </button>
      </div>
    )
  }

  const rooms = roomType.rooms ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub-header — sits below the absolute navbar (~72px tall) */}
      <div className="sticky top-0 z-40 bg-white/80 pt-[72px] shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(`/property-details/${propertyId}`)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            aria-label="Back"
          >
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-gray-900">{roomType.name}</h1>
            <p className="truncate text-xs text-gray-400">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={isFavourite ? "Remove from saved" : "Save property"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavourite ? "fill-rose-500 text-rose-500" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        {/* Lease-window pickers — seat availability is filtered to this period */}
        <div className="mx-auto max-w-lg border-t border-gray-100 px-4 py-2.5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Check availability for your lease period
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1.5">
              <label className="text-xs text-gray-500 shrink-0">From</label>
              <input
                type="month"
                value={startMonth}
                min={getCurrentMonth()}
                onChange={(e) => handleStartMonthChange(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-1 items-center gap-1.5">
              <label className="text-xs text-gray-500 shrink-0">To</label>
              <input
                type="month"
                value={endMonth}
                min={startMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {durationMonths}mo
            </span>
          </div>
        </div>
      </div>

      {/* Room cards */}
      <div className="mx-auto max-w-lg px-4 py-5">
        {rooms.length === 0 ? (
          <p className="text-center text-sm text-gray-400">No rooms available for this type.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {rooms.map((room) => (
              <RoomDetailCard
                key={room.id}
                room={room}
                roomType={roomType}
                property={property}
                propertyId={propertyId!}
                activeSelection={selection}
                onSeatSelect={setSelection}
                leaseWindow={leaseWindow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { createBooking, confirmBooking } from "@/api/bookings"

function getCurrentMonth() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  return `${yyyy}-${mm}`
}

export function BookingConfirmation() {
  const { propertyId, roomTypeId, roomId } = useParams<{
    propertyId: string
    roomTypeId: string
    roomId: string
  }>()
  const navigate = useNavigate()
  const { data: property, isLoading } = usePropertyDetail(propertyId)

  const [startMonth, setStartMonth] = useState(getCurrentMonth())
  const [durationMonths, setDurationMonths] = useState<3 | 6>(3)
  const [error, setError] = useState<string | null>(null)

  const roomType = property?.roomTypes.find((rt) => rt.id === roomTypeId)
  const room = roomType?.rooms?.find((r) => r.id === roomId)
  const priceNum = parseFloat(roomType?.price ?? "0") || 0
  const total = priceNum * durationMonths

  const { mutate: pay, isPending } = useMutation({
    mutationFn: async () => {
      sessionStorage.setItem("bookingPropertyId", propertyId!)
      const booking = await createBooking({
        roomId: roomId!,
        seatNumber: 1,
        startMonth,
        durationMonths,
      })
      const { url } = await confirmBooking(booking.id)
      window.location.href = url
    },
    onError: () => {
      setError("Could not initiate payment. Please try again.")
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!property || !roomType || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="text-xl font-semibold text-gray-700">Booking details not found</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/property-details/${propertyId}/room-types/${roomTypeId}`
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            aria-label="Back"
          >
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Confirm Booking</h1>
        </div>

        {/* Booking summary */}
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Property</span>
              <span className="font-medium text-gray-900">{property.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room Type</span>
              <span className="font-medium text-gray-900">{roomType.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room</span>
              <span className="font-medium text-gray-900">{room.roomLabel}</span>
            </div>
          </div>
        </div>

        {/* Lease period */}
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Lease Start Month
          </label>
          <input
            type="month"
            value={startMonth}
            min={getCurrentMonth()}
            onChange={(e) => setStartMonth(e.target.value)}
            className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="mb-2 text-sm font-medium text-gray-700">Duration</p>
          <div className="grid grid-cols-2 gap-3">
            {([3, 6] as const).map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setDurationMonths(months)}
                className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                  durationMonths === months
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {months} months
              </button>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-foreground/10">
          <div className="flex justify-between text-sm text-gray-500">
            <span>LKR {priceNum.toLocaleString()} × {durationMonths} months</span>
            <span className="text-gray-400">subtotal</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary">
              LKR {total.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          className="w-full rounded-xl font-semibold"
          size="lg"
          disabled={isPending || !startMonth}
          onClick={() => {
            setError(null)
            pay()
          }}
        >
          {isPending ? "Redirecting to payment..." : `Confirm & Pay LKR ${total.toLocaleString()}`}
        </Button>

        <p className="mt-3 text-center text-xs text-gray-400">
          Full payment is required upfront for the entire lease period
        </p>
      </div>
    </div>
  )
}

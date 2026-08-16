import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { createBooking, confirmBooking } from "@/api/bookings"
import type { Room, RoomType, PropertyDetail } from "@/types/property"

type BookingConfirmModalProps = {
  open: boolean
  onClose: () => void
  room: Room
  roomType: RoomType
  property: PropertyDetail
  propertyId: string
  seatNumber: number
}

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function addMonths(yyyymm: string, n: number): string {
  const [y, m] = yyyymm.split("-").map(Number)
  const total = m - 1 + n
  const newY = y + Math.floor(total / 12)
  const newM = (total % 12) + 1
  return `${newY}-${String(newM).padStart(2, "0")}`
}

function monthDiff(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number)
  const [ty, tm] = to.split("-").map(Number)
  return (ty - fy) * 12 + (tm - fm)
}

function parseMinStay(minStay: string): number {
  const n = parseInt(minStay, 10)
  return n > 0 ? n : 3
}

// Returns true if the API error is a 409 Conflict (seat already taken)
function isSeatConflict(err: unknown): boolean {
  return err instanceof Error && err.message.includes("409")
}

export function BookingConfirmModal({
  open,
  onClose,
  room,
  roomType,
  property,
  propertyId,
  seatNumber,
}: BookingConfirmModalProps) {
  const queryClient = useQueryClient()
  const minStay = parseMinStay(property.minStay)
  const [startMonth, setStartMonth] = useState(getCurrentMonth())
  const [endMonth, setEndMonth] = useState(addMonths(getCurrentMonth(), minStay))
  const [error, setError] = useState<string | null>(null)

  const durationMonths = Math.max(minStay, monthDiff(startMonth, endMonth))
  const priceNum = Number(roomType.price.replace(/,/g, "")) || 0
  const total = priceNum * durationMonths

  function handleStartMonthChange(value: string) {
    setStartMonth(value)
    const minEnd = addMonths(value, minStay)
    if (monthDiff(value, endMonth) < minStay) {
      setEndMonth(minEnd)
    }
  }

  const { mutate: pay, isPending } = useMutation({
    mutationFn: async () => {
      sessionStorage.setItem("bookingPropertyId", propertyId)
      const booking = await createBooking({
        roomId: room.id,
        seatNumber,
        startMonth,
        durationMonths,
      })
      const { url } = await confirmBooking(booking.id)
      // Refresh the tenant's booking list so it appears in Dashboard on return
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
      // Refresh seat availability on the property so circles update
      queryClient.invalidateQueries({ queryKey: ["property-detail", propertyId] })
      window.location.href = url
    },
    onError: (err) => {
      if (isSeatConflict(err)) {
        // Another tenant grabbed this seat between selection and submission.
        // Refresh the room view so the seat shows as taken.
        queryClient.invalidateQueries({ queryKey: ["property-detail", propertyId] })
        setError(
          "This seat was just taken by someone else. Please select another seat."
        )
      } else {
        setError("Could not initiate payment. Please try again.")
      }
    },
  })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">Confirm Booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-500">
          You are about to book{" "}
          <span className="font-medium text-gray-700">Seat {seatNumber}</span> in{" "}
          <span className="font-medium text-gray-700">{room.roomLabel}</span> at{" "}
          <span className="font-medium text-gray-700">{property.title}</span>.
        </p>

        {/* Booking summary */}
        <div className="mb-4 space-y-2">
          {[
            { label: "Room", value: room.roomLabel },
            { label: "Room Type", value: roomType.name },
            { label: "Seat", value: `Seat ${seatNumber}` },
            { label: "Price", value: `LKR ${roomType.price}/month` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-bold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="my-4 border-t border-gray-100" />

        {/* Lease period */}
        <p className="mb-3 text-sm font-semibold text-gray-700">Lease Period</p>
        <div className="mb-2 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">From</label>
            <input
              type="month"
              value={startMonth}
              min={getCurrentMonth()}
              onChange={(e) => handleStartMonthChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">To</label>
            <input
              type="month"
              value={endMonth}
              min={addMonths(startMonth, minStay)}
              onChange={(e) => setEndMonth(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <p className="mb-4 text-right text-xs text-gray-400">
          Duration: <span className="font-semibold text-gray-700">{durationMonths} months</span>
          {durationMonths === minStay && (
            <span className="ml-1 text-gray-400">(min. stay)</span>
          )}
        </p>

        {/* Live price breakdown — updates as inputs change, no reload needed */}
        <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>LKR {roomType.price} × {durationMonths} months</span>
            <span className="text-xs text-gray-400">subtotal</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary">
              LKR {total.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-xl bg-red-50 px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl border-gray-200 font-semibold text-gray-700"
            size="lg"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-2xl font-semibold"
            size="lg"
            disabled={isPending || durationMonths < minStay}
            onClick={() => {
              setError(null)
              pay()
            }}
          >
            {isPending ? "Redirecting..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  )
}

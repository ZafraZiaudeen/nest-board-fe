import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { createBooking, confirmBooking } from "@/api/bookings"
import type { Room } from "@/types/property"

type BookingModalProps = {
  open: boolean
  onClose: () => void
  room: Room
  price: string
  propertyId: string
}

function getCurrentMonth() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  return `${yyyy}-${mm}`
}

export function BookingModal({ open, onClose, room, price, propertyId }: BookingModalProps) {
  const [startMonth, setStartMonth] = useState(getCurrentMonth())
  const [durationMonths, setDurationMonths] = useState<3 | 6>(3)
  const [error, setError] = useState<string | null>(null)

  const priceNum = parseFloat(price) || 0
  const total = priceNum * durationMonths

  const { mutate: book, isPending } = useMutation({
    mutationFn: async () => {
      sessionStorage.setItem("bookingPropertyId", propertyId)
      const booking = await createBooking({
        roomId: room.id,
        seatNumber: 1,
        startMonth,
        durationMonths,
      })
      const { url } = await confirmBooking(booking.id)
      window.location.href = url
    },
    onError: () => {
      setError("Could not initiate booking. Please try again.")
    },
  })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-bold text-gray-900">Book {room.roomLabel}</h2>
        <p className="mb-5 text-sm text-gray-400">Choose your lease period before paying</p>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Start Month
        </label>
        <input
          type="month"
          value={startMonth}
          min={getCurrentMonth()}
          onChange={(e) => setStartMonth(e.target.value)}
          className="mb-4 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="mb-2 text-sm font-medium text-gray-700">Duration</p>
        <div className="mb-5 grid grid-cols-2 gap-3">
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

        <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>LKR {priceNum.toLocaleString()} × {durationMonths} months</span>
            <span className="font-bold text-gray-900">LKR {total.toLocaleString()}</span>
          </div>
        </div>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <Button
          className="w-full rounded-xl font-semibold"
          size="lg"
          disabled={isPending || !startMonth}
          onClick={() => {
            setError(null)
            book()
          }}
        >
          {isPending ? "Redirecting to payment..." : "Confirm & Pay"}
        </Button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

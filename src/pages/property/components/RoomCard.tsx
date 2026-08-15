import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { RoomType } from "@/types/property"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmBooking, createBooking } from "@/api/bookings"
import { useState } from "react"

export function RoomCard({
  name,
  price,
  seatsTotal,
  seatsFree,
  hasAC,
  rooms,
}: RoomType) {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string | null>(null)

  const { mutate: book, isPending } = useMutation({
    mutationFn: async () => {
      const room = rooms?.find((r) => r.isAvailable)
      if (!room) {
        throw new Error("No available room")
      }
      const booking = await createBooking({
        roomId: room.id,
        seatNumber: 1,
        startMonth: "2026-08",
        durationMonths: 3,
      })
      const { url } = await confirmBooking(booking.id)
      window.location.href = url
    },
    onSuccess: () => {
      setMessage("Booked. Check My Bookings")
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
    onError: () => setMessage("Could not create booking."),
  })

  const fillPercentage = Math.round(
    ((seatsTotal - seatsFree) / seatsTotal) * 100
  )

  return (
    <Card className="gap-0 rounded-2xl p-4 ring-1 ring-foreground/10 transition-all">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">{name}</span>
        <Badge
          variant="outline"
          className="rounded-lg px-2.5 py-0.5 text-xs text-gray-500"
        >
          {hasAC ? "AC" : "Non-AC"}
        </Badge>
      </div>

      <p className="mt-0.5 text-sm text-gray-400">LKR {price} / seat / month</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-medium text-primary">{seatsFree} seats free</span>
        <span className="text-gray-400">{fillPercentage}% filled</span>
      </div>

      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>

      <Button
        className="mt-4 w-full cursor-pointer rounded-xl font-semibold"
        size="lg"
        disabled={isPending || seatsFree === 0}
        onClick={() => book()}
      >
        {isPending ? "Booking..." : "Book this room"}
      </Button>
      {message && <p className="mt-2 text-xs text-gray-500">{message}</p>}
    </Card>
  )
}
import { useState } from "react"
import { useNavigate, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { BookingConfirmModal } from "./BookingConfirmModal"
import { useAuth } from "@/components/auth/AuthProvider"
import type { Room, RoomType, PropertyDetail } from "@/types/property"
import type { LeaseWindow } from "@/api/properties"

type Selection = { roomId: string; seatNumber: number }

type RoomDetailCardProps = {
  room: Room
  roomType: RoomType
  property: PropertyDetail
  propertyId: string
  activeSelection: Selection | null
  onSeatSelect: (s: Selection | null) => void
  leaseWindow?: LeaseWindow
}

export function RoomDetailCard({
  room,
  roomType,
  property,
  propertyId,
  activeSelection,
  onSeatSelect,
  leaseWindow,
}: RoomDetailCardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  const perRoomSeats = Math.max(
    1,
    Math.round(roomType.seatsTotal / (roomType.rooms?.length || 1))
  )

  const selectedSeat =
    activeSelection?.roomId === room.id ? activeSelection.seatNumber : null

  // Prefer per-seat data from API; fall back to derived count (stale cache)
  const seats = room.seats ?? Array.from({ length: perRoomSeats }, (_, i) => ({
    seatNumber: i + 1,
    isOccupied: false,
    tenantInitials: null,
  }))

  const freeCount = seats.filter((s) => !s.isOccupied).length
  const occupiedSeats = seats.filter((s) => s.isOccupied)

  function handleSeatClick(seatNum: number) {
    if (!room.isAvailable) return

    // Gate: redirect unauthenticated visitors to sign-in then back here
    if (!user) {
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }

    if (selectedSeat === seatNum) {
      onSeatSelect(null)
    } else {
      onSeatSelect({ roomId: room.id, seatNumber: seatNum })
    }
  }

  function handleClose() {
    setModalOpen(false)
    onSeatSelect(null)
  }

  return (
    <>
      <div
        className={`rounded-2xl bg-white p-5 shadow-sm ring-1 transition-all ${
          selectedSeat !== null
            ? "ring-primary/40 shadow-md"
            : "ring-gray-100"
        }`}
      >
        <h3 className="mb-4 text-base font-bold text-gray-900">{room.roomLabel}</h3>

        {/* Seat circles */}
        <div className="mb-4 flex flex-wrap gap-2">
          {seats.map((seat) => {
            if (seat.isOccupied) {
              return (
                <div
                  key={seat.seatNumber}
                  title="Occupied"
                  aria-label={`Seat ${seat.seatNumber} - Occupied`}
                  className="flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-[#704F3C]"
                >
                  <span className="text-xs font-bold text-white">
                    {seat.tenantInitials ?? "??"}
                  </span>
                </div>
              )
            }

            const isSelected = selectedSeat === seat.seatNumber
            return (
              <button
                key={seat.seatNumber}
                type="button"
                disabled={!room.isAvailable}
                onClick={() => handleSeatClick(seat.seatNumber)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-110"
                    : room.isAvailable
                      ? "border-dashed border-gray-300 hover:border-primary/60 hover:bg-primary/5"
                      : "cursor-not-allowed border-dashed border-gray-200 opacity-40"
                }`}
                aria-label={`Seat ${seat.seatNumber}`}
                aria-pressed={isSelected}
              >
                <svg
                  className={`h-4 w-4 transition-colors ${isSelected ? "text-primary" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )
          })}
        </div>

        {/* Occupied tenant names */}
        {occupiedSeats.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1">
            {occupiedSeats.map((seat) => (
              <span key={seat.seatNumber} className="text-xs text-gray-400">
                Seat {seat.seatNumber}: <span className="font-medium text-gray-600">{seat.tenantInitials ?? "—"}</span>
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${freeCount > 0 ? "text-primary" : "text-gray-400"}`}>
            {freeCount > 0 ? `${freeCount} Available` : "Full"}
          </span>

          <Button
            className="rounded-2xl px-5 font-semibold"
            disabled={freeCount === 0 || selectedSeat === null}
            onClick={() => setModalOpen(true)}
          >
            Book this seat
          </Button>
        </div>

        {freeCount > 0 && selectedSeat === null && (
          <p className="mt-2 text-xs text-gray-400">Select a seat above to continue</p>
        )}
        {freeCount > 0 && selectedSeat !== null && (
          <p className="mt-2 text-xs text-primary font-medium">Seat {selectedSeat} selected</p>
        )}
      </div>

      {selectedSeat !== null && (
        <BookingConfirmModal
          open={modalOpen}
          onClose={handleClose}
          room={room}
          roomType={roomType}
          property={property}
          propertyId={propertyId}
          seatNumber={selectedSeat}
          leaseWindow={leaseWindow}
        />
      )}
    </>
  )
}

import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { RoomDetailCard } from "./components/RoomDetailCard"

type Selection = { roomId: string; seatNumber: number }

export function RoomTypeDetails() {
  const { propertyId, roomTypeId } = useParams<{
    propertyId: string
    roomTypeId: string
  }>()
  const navigate = useNavigate()
  const { data: property, isLoading, isError } = usePropertyDetail(propertyId)
  const [selection, setSelection] = useState<Selection | null>(null)

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
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-gray-900">{roomType.name}</h1>
            <p className="truncate text-xs text-gray-400">{property.title}</p>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

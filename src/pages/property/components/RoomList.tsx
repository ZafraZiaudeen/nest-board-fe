import { Card } from "@/components/ui/card"
import { RoomCard } from "./RoomCard"
import type { RoomType } from "@/types/property"

type RoomTypeListProps = {
    rooms: RoomType[]
    propertyId: string
}

export function RoomList({ rooms, propertyId }: RoomTypeListProps) {
  return (
    <Card className="gap-0 rounded-3xl p-6 shadow-sm ring-0">
      <h2 className="mb-5 text-xl font-bold text-gray-900">
        Available Room Types
      </h2>
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} {...room} propertyId={propertyId} />
        ))}
      </div>
    </Card>
  )
}

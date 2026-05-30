import { PropertyInfo } from "./components/PropertyInfo"
import { PropertySection } from "./components/PropertySection"
import type { Room } from "@/types/property"
import { RoomList } from "./components/RoomList"

const mockProperty = {
  id: "prop-detail-001",
  rating: 4.8,
  image:
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=600&fit=crop",
  title: "Green Villa Colombo",
  address: "123 Galle Road, Colombo 03",
  amenities: ["Villa", "AC", "Premium", "WiFi"],
  seatsAvailable: 4,
  minStay: "3 months",
  startingPrice: "LKR 25K",
  rooms: [
    {
      id: "room-a",
      name: "Room A",
      price: "35,000",
      seatsTotal: 4,
      seatsFree: 1,
      hasAC: true,
    },
    {
      id: "room-b",
      name: "Room B",
      price: "35,000",
      seatsTotal: 4,
      seatsFree: 2,
      hasAC: true,
    },
    {
      id: "room-c",
      name: "Room C",
      price: "25,000",
      seatsTotal: 4,
      seatsFree: 1,
      hasAC: false,
    },
  ] satisfies Room[],
}

export function PropertyDetails() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PropertySection
        image={mockProperty.image}
        rating={mockProperty.rating}
      />
      <div className="px-4 pb-12">
        <div className="relative z-10 -mt-12">
          <PropertyInfo
            title={mockProperty.title}
            address={mockProperty.address}
            amenities={mockProperty.amenities}
            seatsAvailable={mockProperty.seatsAvailable}
            minStay={mockProperty.minStay}
            startingPrice={mockProperty.startingPrice}
          />
        </div>

        <div className="mt-5">
          <RoomList rooms={mockProperty.rooms} />
        </div>
      </div>
    </div>
  )
}

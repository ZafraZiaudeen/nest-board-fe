export type Property = {
  id: string
  title: string
  description: string
  location: string
  address: string
  city: string
  latitude: number
  longitude: number
  type: "House" | "Villa" | "Apartment" | "Hotel"
  price: string
  rating: number
  image: string
  amenities: string[]
}
export type RoomType = {
  id: string
  name: string
  price: string
  pricePerMonthRaw: number
  seatCapacity: number
  seatsTotal: number
  seatsFree: number
  hasAC: boolean
  amenities: string[]
  rooms?: Room[]
}

export type PropertyDetail = {
  id: string
  title: string
  description: string
  address: string
  city: string
  latitude: number
  longitude: number
  amenities: string[]
  rating: number
  seatsAvailable: number
  minStay: string
  startingPrice: string
  image: string
  roomTypes: RoomType[]
}

export type SeatInfo = {
  seatNumber: number
  isOccupied: boolean
  tenantInitials: string | null
}

export type Room = {
  id: string
  roomLabel: string
  isAvailable: boolean
  seats?: SeatInfo[]
}
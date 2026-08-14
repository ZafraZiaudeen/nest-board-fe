export type Property = {
  id: string
  title: string
  location: string
  type: "House" | "Villa" | "Apartment" | "Hotel"
  price: string
  rating: number
  image: string
  lat: number
  lng: number
}
export type RoomType = {
  id: string
  name: string
  price: string
  seatsTotal: number
  seatsFree: number
  hasAC: boolean
  rooms?: Room[]
}

export type PropertyDetail = {
  id: string
  title: string
  address: string
  amenities: string[]
  rating: number
  seatsAvailable: number
  minStay: string
  startingPrice: string
  image: string
  roomTypes: RoomType[]
}

export type Room = {
  id: string
  roomLabel: string
  isAvailable: boolean
}
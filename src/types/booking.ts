// export type Booking = {
//   id: string
//   tenant: string
//   propertyId: string
//   property: string
//   room: string
//   seat: string
//   leasePeriod: string
//   duration: string
//   amount: string
// }

export type BookingDTO = {
  id: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED"
  paymentStatus: "PENDING" | "PAID" | "FAILED"
  seatNumber: number
  leaseStart: string
  leaseEnd: string
  durationMonths: number
  totalAmount: string
  property: { id: string; title: string; city: string }
  roomType: { id: string; name: string; price: string }
  room: { id: string; roomLabel: string }
}
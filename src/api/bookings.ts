import type { Booking } from "@/types/booking"

const BASE = "http://localhost:3001/api/bookings"

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error("Failed to fetch bookings")
  return res.json()
}

export async function createBooking(data: Omit<Booking, "id">): Promise<Booking> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create booking")
  return res.json()
}

export async function updateBooking(
  id: string,
  data: Partial<Booking>,
): Promise<Booking> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update booking")
  return res.json()
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete booking")
}

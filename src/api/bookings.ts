import type { AdminBookingDTO, BookingDTO } from "@/types/booking"
import { apiFetch } from "./client"

export async function fetchMyBookings() {
  return await apiFetch<BookingDTO[]>("/bookings/my", { auth: true })
}

export async function fetchAdminBookings() {
  return apiFetch<AdminBookingDTO[]>("/bookings/vendor", { auth: true })
}

type CreateBookingInput = {
  roomId: string
  seatNumber: number
  startMonth: string
  durationMonths: number
}

export async function createBooking(input: CreateBookingInput) {
  return apiFetch<BookingDTO>("/bookings", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  })
}


export async function confirmBooking(bookingId: string) {
  return apiFetch<{ url: string }>(`/bookings/${bookingId}/confirm`, {
    method: "POST",
    auth: true,
  })
}

export async function resumeBookingPayment(bookingId: string) {
  return apiFetch<{ url: string }>(`/bookings/${bookingId}/confirm`, {
    method: "POST",
    auth: true,
  })
}

export async function cancelBookingRequest(bookingId: string) {
  return apiFetch<void>(`/bookings/${bookingId}/cancel`, {
    method: "POST",
    auth: true,
  })
}

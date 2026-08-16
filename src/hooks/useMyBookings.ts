import { useQuery } from "@tanstack/react-query"
import { fetchMyBookings } from "@/api/bookings"

// Single source of truth for the tenant's booking list.
// Using a dedicated hook keeps the query key consistent across
// Dashboard, cache invalidation in BookingConfirmModal, and any future consumer.
export function useMyBookings() {
  return useQuery({ queryKey: ["my-bookings"], queryFn: fetchMyBookings })
}

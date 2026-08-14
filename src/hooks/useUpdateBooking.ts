// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { updateBooking } from "@/api/bookings"
// import type { Booking } from "@/types/booking"

// export function useUpdateBooking() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
//       updateBooking(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] })
//     },
//   })
// }

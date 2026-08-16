import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBooking } from "@/api/bookings"

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
  })
}

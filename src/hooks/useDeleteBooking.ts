import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBooking } from "@/api/bookings"

export function useDeleteBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })
}

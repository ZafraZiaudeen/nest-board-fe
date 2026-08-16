import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRoomType } from "@/api/admin-properties"

export function useCreateRoomType(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { name: string; pricePerMonth: number; seatCapacity: number; hasAC: boolean }) =>
      createRoomType(propertyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

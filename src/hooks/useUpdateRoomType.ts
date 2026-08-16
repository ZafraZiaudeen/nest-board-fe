import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateRoomType } from "@/api/admin-properties"

type UpdateRoomTypeArgs = {
  roomTypeId: string
  data: Partial<{
    name: string
    pricePerMonth: number
    seatCapacity: number
    hasAC: boolean
    amenities: string[]
  }>
}

export function useUpdateRoomType(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomTypeId, data }: UpdateRoomTypeArgs) =>
      updateRoomType(propertyId, roomTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

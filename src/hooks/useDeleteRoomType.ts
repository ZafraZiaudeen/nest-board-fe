import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteRoomType } from "@/api/admin-properties"

export function useDeleteRoomType(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roomTypeId: string) => deleteRoomType(propertyId, roomTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteRoom } from "@/api/admin-properties"

export function useDeleteRoom(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomTypeId, roomId }: { roomTypeId: string; roomId: string }) =>
      deleteRoom(propertyId, roomTypeId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

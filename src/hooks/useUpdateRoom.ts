import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateRoom } from "@/api/admin-properties"

export function useUpdateRoom(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      roomTypeId,
      roomId,
      roomLabel,
    }: {
      roomTypeId: string
      roomId: string
      roomLabel: string
    }) => updateRoom(propertyId, roomTypeId, roomId, { roomLabel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

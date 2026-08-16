import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRoom } from "@/api/admin-properties"

export function useCreateRoom(propertyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roomTypeId, roomLabel }: { roomTypeId: string; roomLabel: string }) =>
      createRoom(propertyId, roomTypeId, { roomLabel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
    },
  })
}

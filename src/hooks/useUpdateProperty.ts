import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProperty } from "@/api/properties"
import type { Property } from "@/types/property"

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] })
    },
  })
}

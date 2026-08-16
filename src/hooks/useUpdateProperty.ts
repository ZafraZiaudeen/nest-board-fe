import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProperty } from "@/api/admin-properties"
import type { CreatePropertyInput } from "@/api/admin-properties"

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePropertyInput> }) =>
      updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] })
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] })
    },
  })
}

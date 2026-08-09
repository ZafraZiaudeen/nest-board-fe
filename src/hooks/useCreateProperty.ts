import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProperty } from "@/api/properties"

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },
  })
}

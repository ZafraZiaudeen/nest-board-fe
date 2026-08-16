import { useQuery } from "@tanstack/react-query"
import { fetchProperties } from "@/api/admin-properties"

export function useAdminProperties() {
  return useQuery({
    queryKey: ["admin-properties"],
    queryFn: fetchProperties,
  })
}

import { useQuery } from "@tanstack/react-query"
import { fetchPropertyDetail, type LeaseWindow } from "@/api/properties"

export function usePropertyDetail(id: string | undefined, window?: LeaseWindow) {
  return useQuery({
    queryKey: ["property", id, window ?? null],
    queryFn: () => fetchPropertyDetail(id!, window),
    enabled: !!id,
  })
}
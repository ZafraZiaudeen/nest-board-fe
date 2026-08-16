import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchMyFavourites, toggleFavourite } from "@/api/properties"
import { useAuth } from "@/components/auth/AuthProvider"
import type { Property } from "@/types/property"

export const FAVOURITES_KEY = ["my-favourites"] as const

export function useFavouriteIds() {
  const { isSignedIn, user } = useAuth()
  const isUser = isSignedIn && user?.role !== "ADMIN"
  return useQuery({
    queryKey: FAVOURITES_KEY,
    queryFn: fetchMyFavourites,
    enabled: isUser,
    select: (properties) => new Set(properties.map((p) => p.id)),
  })
}

export function useSavedProperties() {
  const { isSignedIn, user } = useAuth()
  const isUser = isSignedIn && user?.role !== "ADMIN"
  return useQuery({
    queryKey: FAVOURITES_KEY,
    queryFn: fetchMyFavourites,
    enabled: isUser,
  })
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleFavourite,
    onMutate: async (propertyId) => {
      // Cancel in-flight refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: FAVOURITES_KEY })
      const previous = queryClient.getQueryData<Property[]>(FAVOURITES_KEY)

      queryClient.setQueryData<Property[]>(FAVOURITES_KEY, (old = []) => {
        const alreadySaved = old.some((p) => p.id === propertyId)
        if (alreadySaved) {
          return old.filter((p) => p.id !== propertyId)
        }
        // Optimistic add: pull the full Property from the listing cache
        const allProperties = queryClient.getQueryData<Property[]>(["properties"])
        const property = allProperties?.find((p) => p.id === propertyId)
        return property ? [...old, property] : old
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      // Roll back cache on failure
      if (context?.previous !== undefined) {
        queryClient.setQueryData(FAVOURITES_KEY, context.previous)
      }
    },
    onSettled: () => {
      // Sync with server after optimistic update settles
      queryClient.invalidateQueries({ queryKey: FAVOURITES_KEY })
    },
  })
}

import { useParams, useLocation, useNavigate } from "react-router"
import { Heart } from "lucide-react"
import { PropertySection } from "./components/PropertySection"
import { PropertyInfo } from "./components/PropertyInfo"
import { RoomList } from "./components/RoomList"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { useAuth } from "@/components/auth/AuthProvider"
import { useFavouriteIds, useToggleFavourite } from "@/hooks/useFavourites"

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: property, isLoading, isError } = usePropertyDetail(id)

  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: favouriteIds } = useFavouriteIds()
  const toggleMut = useToggleFavourite()
  const isUser = isSignedIn && user?.role !== "ADMIN"
  const isFavourite = favouriteIds?.has(id ?? "") ?? false

  function handleHeartClick() {
    if (!isUser) {
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    if (id) toggleMut.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Loading property...</p>
      </div>
    )
  }

  if (isError || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="text-xl font-semibold text-gray-700">
          Property not found
        </p>
        <p className="text-sm text-gray-400">No property matches id: {id}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <PropertySection image={property.image} rating={property.rating} />
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isFavourite ? "Remove from saved" : "Save property"}
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavourite ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="px-4 pb-12">
        <div className="relative z-10 -mt-12">
          <PropertyInfo
            title={property.title}
            description={property.description}
            address={property.address}
            amenities={property.amenities}
            seatsAvailable={property.seatsAvailable}
            minStay={property.minStay}
            startingPrice={property.startingPrice}
          />
        </div>

        <div className="mt-5">
          <RoomList rooms={property.roomTypes} propertyId={property.id} />
        </div>
      </div>
    </div>
  )
}
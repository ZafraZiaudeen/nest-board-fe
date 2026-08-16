import { Star, Heart } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import type { Property } from "@/types/property"
import { Link, useNavigate, useLocation } from "react-router"
import { useAuth } from "@/components/auth/AuthProvider"
import { useFavouriteIds, useToggleFavourite } from "@/hooks/useFavourites"

export function PropertyCard(props: Property) {
  const { isSignedIn, user } = useAuth()
  const isUser = isSignedIn && user?.role !== "ADMIN"
  const navigate = useNavigate()
  const location = useLocation()

  const { data: favouriteIds } = useFavouriteIds()
  const toggleMut = useToggleFavourite()

  // Driven entirely by the cache — onMutate updates the cache optimistically
  // so this reflects the toggle instantly with no local state needed
  const isFavourite = favouriteIds?.has(props.id) ?? false

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isUser) {
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)
      return
    }
    toggleMut.mutate(props.id)
  }

  return (
    <Link to={`/property-details/${props.id}`} className="block">
      <Card
        className="relative cursor-pointer rounded-2xl p-0 ring-0"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Background image */}
        <img
          src={props.image}
          alt={"title"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        {/* Rating badge */}
        <Badge className="absolute top-2.5 right-2.5 h-auto gap-1 border-0 bg-white/90 py-0.5 text-gray-800 backdrop-blur-sm">
          <Star className="size-3 fill-yellow-400 text-yellow-400" />
          {props.rating}
        </Badge>

        {/* Heart / save button */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isFavourite ? "Remove from saved" : "Save property"}
          className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavourite ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>

        {/* Bottom info */}
        <div className="absolute right-0 bottom-0 left-0 p-3">
          <Badge
            variant="secondary"
            className="mb-1.5 h-auto border-0 bg-white/25 text-[9px] tracking-wider text-white uppercase backdrop-blur-sm hover:bg-white/25"
          >
            {props.type}
          </Badge>
          <h3 className="text-sm leading-snug font-bold text-white">
            {props.title}
          </h3>
          <p className="mb-1.5 text-[11px] text-white/65">{props.location}</p>
          <p className="text-sm text-white">
            <span className="font-bold">{props.price}</span>
            <span className="text-[11px] text-white/60"> /Month</span>
          </p>
        </div>
      </Card>
    </Link>
  )
}
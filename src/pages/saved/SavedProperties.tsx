import { Link } from "react-router"
import { Heart } from "lucide-react"
import { useSavedProperties } from "@/hooks/useFavourites"
import { PropertyCard } from "@/components/common/PropertyCard"

export function SavedProperties() {
  const { data: properties, isLoading, isError } = useSavedProperties()

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-28 pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Properties you've hearted,easy to find when you're ready to book.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl bg-gray-200"
                style={{ aspectRatio: "1/1" }}
              />
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Could not load saved properties. Please refresh.
          </p>
        ) : properties && properties.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-gray-500">{properties.length} saved</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <Heart className="h-10 w-10 text-gray-300" />
            <p className="font-semibold text-gray-700">No saved properties yet</p>
            <p className="text-sm text-gray-400">
              Tap the heart on any listing to save it here.
            </p>
            <Link
              to="/"
              className="mt-1 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse properties
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

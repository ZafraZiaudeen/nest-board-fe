import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export function StripeCancel() {
  const navigate = useNavigate()
  const [propertyId, setPropertyId] = useState<string | null>(null)

  useEffect(() => {
    const id = sessionStorage.getItem("bookingPropertyId")
    setPropertyId(id)
    sessionStorage.removeItem("bookingPropertyId")
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-foreground/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Booking Cancelled</h1>
        <p className="mb-6 text-sm text-gray-500">
          Your payment was not completed. No charges were made.
        </p>
        <Button
          className="w-full rounded-xl font-semibold"
          size="lg"
          onClick={() =>
            navigate(propertyId ? `/property-details/${propertyId}` : "/")
          }
        >
          {propertyId ? "Back to Property" : "Browse Properties"}
        </Button>
        {propertyId && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-3 w-full rounded-xl py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            Browse all properties
          </button>
        )}
      </div>
    </div>
  )
}

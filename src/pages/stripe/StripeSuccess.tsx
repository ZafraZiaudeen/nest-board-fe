import { useEffect } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export function StripeSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.removeItem("bookingPropertyId")
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-foreground/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="mb-6 text-sm text-gray-500">
          Your booking has been confirmed. You can view it in your dashboard.
        </p>
        <Button
          className="w-full rounded-xl font-semibold"
          size="lg"
          onClick={() => navigate("/dashboard")}
        >
          View My Bookings
        </Button>
      </div>
    </div>
  )
}

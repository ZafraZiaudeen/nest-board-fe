import { useState, useEffect } from "react"
import { Link } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMyBookings } from "@/hooks/useMyBookings"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { resumeBookingPayment, cancelBookingRequest } from "@/api/bookings"
import type { BookingDTO } from "@/types/booking"

const PAYMENT_WINDOW_MS = 30 * 60 * 1000 // 30 minutes, matches backend BOOKING_EXPIRY_MS

function usePaymentCountdown(createdAt: string): string | null {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const expiresAt = new Date(createdAt).getTime() + PAYMENT_WINDOW_MS
    if (Date.now() >= expiresAt) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [createdAt])

  const remaining = Math.max(0, new Date(createdAt).getTime() + PAYMENT_WINDOW_MS - now)
  if (remaining === 0) return null

  const total = Math.floor(remaining / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type FilterTab = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED" | "EXPIRED"

const TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PENDING", label: "Pending" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "EXPIRED", label: "Expired" },
]

function formatLeaseDate(yyyyMmDd: string): string {
  const [year, month] = yyyyMmDd.split("-")
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function BookingCard({ b }: { b: BookingDTO }) {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const countdown = usePaymentCountdown(b.createdAt)

  const resume = useMutation({
    mutationFn: () => resumeBookingPayment(b.id),
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (err: unknown) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
      const msg = err instanceof Error ? err.message.toLowerCase() : ""
      if (msg.includes("taken")) {
        setActionError("This seat was booked by someone else. Please go back and select a different seat.")
      } else {
        setActionError("This booking has expired. Please start a new booking.")
      }
    },
  })

  const cancelMut = useMutation({
    mutationFn: () => cancelBookingRequest(b.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
    onError: () => {
      setActionError("Could not cancel booking. Please try again.")
    },
  })

  const busy = resume.isPending || cancelMut.isPending

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      {/* Top: property + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-gray-900">{b.property.title}</p>
          <p className="text-xs text-gray-400">{b.property.city}</p>
        </div>
        <StatusBadge status={b.status} />
      </div>

      {/* Middle grid */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        <div>
          <span className="text-xs uppercase tracking-wide text-gray-400">Room</span>
          <p className="font-medium text-gray-700">{b.room.roomLabel}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-gray-400">Room Type</span>
          <p className="font-medium text-gray-700">{b.roomType.name}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-gray-400">Seat</span>
          <p className="font-medium text-gray-700">Seat {b.seatNumber}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-gray-400">Duration</span>
          <p className="font-medium text-gray-700">
            {b.durationMonths} month{b.durationMonths !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Lease window */}
      <p className="mt-2 text-sm text-gray-500">
        {formatLeaseDate(b.leaseStart)} → {formatLeaseDate(b.leaseEnd)}
      </p>

      {/* Amount */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">Total paid</span>
        <span className="text-base font-bold text-gray-900">
          LKR {Number(b.totalAmount).toLocaleString("en-LK")}
        </span>
      </div>

      {/* Pending actions — Continue Payment or Cancel */}
      {b.status === "PENDING" && (
        <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
          {countdown !== null ? (
            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-1.5">
              <span className="text-xs text-amber-700">Payment window closes in</span>
              <span className="font-mono text-xs font-bold text-amber-800">{countdown}</span>
            </div>
          ) : (
            <p className="text-xs text-red-500">Payment window has expired</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => { setActionError(null); resume.mutate() }}
              className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60 hover:opacity-90"
            >
              {resume.isPending ? "Redirecting…" : "Continue Payment"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => { setActionError(null); cancelMut.mutate() }}
              className="flex-1 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {cancelMut.isPending ? "Cancelling…" : "Cancel Booking"}
            </button>
          </div>
          {actionError && (
            <p className="text-xs text-red-500">{actionError}</p>
          )}
        </div>
      )}
    </div>
  )
}

export function MyBookings() {
  const { data: bookings, isLoading, isError } = useMyBookings()
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL")

  const filtered =
    activeTab === "ALL"
      ? (bookings ?? [])
      : (bookings ?? []).filter((b) => b.status === activeTab)

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-28 pb-12">
      <div className="mx-auto max-w-2xl">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            All your room bookings, most recent first.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto pb-1">
          {TABS.map(({ key, label }) => {
            const count =
              key === "ALL"
                ? (bookings?.length ?? 0)
                : (bookings?.filter((b) => b.status === key).length ?? 0)
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeTab === key
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200"
                }`}
              >
                {label}
                {!isLoading && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      activeTab === key
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Could not load bookings. Please refresh.
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
            <span className="text-4xl">📋</span>
            <p className="font-semibold text-gray-700">
              {activeTab === "ALL" ? "No bookings yet" : `No ${activeTab.toLowerCase()} bookings`}
            </p>
            {activeTab === "ALL" && (
              <>
                <p className="text-sm text-gray-400">Book your first room to get started.</p>
                <Link
                  to="/"
                  className="mt-1 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Browse properties
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((b) => (
              <BookingCard key={b.id} b={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { Bell, Menu } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchAdminBookings } from "@/api/bookings"
import { cn } from "@/lib/utils"
import type { AdminBookingDTO } from "@/types/booking"

const STATUS_CLASSES: Record<AdminBookingDTO["status"], string> = {
  CONFIRMED: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  CANCELLED: "bg-red-50 text-red-600",
  EXPIRED: "bg-gray-100 text-gray-500",
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  )
}

export function AdminBookings() {
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchAdminBookings,
  })

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <header className="flex h-[66px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-7">
        <div className="flex items-center gap-3">
          <button
            className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-xl font-bold text-[#111827]">Bookings</span>
        </div>
        <div className="relative">
          <button
            className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[#F87171]" />
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-[#111827]">All Bookings</h2>
          {!isLoading && !isError && (
            <span className="rounded-full bg-[#EFF6FF] px-3 py-0.5 text-[13px] font-bold text-[#2563EB]">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isError ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load bookings. Check that the API is running.
          </p>
        ) : (
          <div className="overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    {[
                      "Booking ID",
                      "Tenant",
                      "Property",
                      "Room",
                      "Seat",
                      "Lease Period",
                      "Status",
                      "Amount (LKR)",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3.5 text-left text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-8 text-center text-[14px] text-[#9CA3AF]"
                      >
                        No bookings yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b, idx) => (
                      <tr
                        key={b.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-[12px] text-[#6B7280]">
                            {b.id.slice(0, 8)}…
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-semibold text-[#111827]">
                            {b.tenant.displayName}
                          </p>
                          <p className="text-[12px] text-[#9CA3AF]">{b.tenant.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[13px] text-[#374151]">{b.property.title}</p>
                          <p className="text-[12px] text-[#9CA3AF]">{b.property.city}</p>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#374151]">
                          {b.room.roomLabel}
                          <span className="ml-1 text-[12px] text-[#9CA3AF]">
                            ({b.roomType.name})
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#374151]">
                          #{b.seatNumber}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[13px] text-[#374151]">
                            {b.leaseStart}
                          </span>
                          <span className="mx-1 text-[#9CA3AF]">→</span>
                          <span className="text-[13px] text-[#374151]">
                            {b.leaseEnd}
                          </span>
                          <p className="text-[12px] text-[#9CA3AF]">
                            {b.durationMonths} month{b.durationMonths !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                              STATUS_CLASSES[b.status],
                            )}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-[#111827]">
                          {Number(b.totalAmount).toLocaleString("en-LK")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

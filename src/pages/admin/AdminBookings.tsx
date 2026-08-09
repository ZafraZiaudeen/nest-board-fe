import { Bell, ChevronDown, Edit2, Menu, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useBookings } from "@/hooks/useBookings"
import { useCreateBooking } from "@/hooks/useCreateBooking"
import { useUpdateBooking } from "@/hooks/useUpdateBooking"
import { useDeleteBooking } from "@/hooks/useDeleteBooking"
import type { Booking } from "@/types/booking"
import { BookingForm } from "./components/BookingForm"
import { DeleteConfirm } from "./components/DeleteConfirm"

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] font-medium text-[#374151] transition-colors hover:bg-gray-50">
      {label}
      <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
    </button>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  )
}

export function AdminBookings() {
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Booking | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)

  const { data: bookings = [], isLoading } = useBookings()
  const createMutation = useCreateBooking()
  const updateMutation = useUpdateBooking()
  const deleteMutation = useDeleteBooking()

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  function handleSave(data: Omit<Booking, "id">) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, data },
        { onSuccess: closeForm },
      )
    } else {
      createMutation.mutate(data, { onSuccess: closeForm })
    }
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

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

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[#F87171]" />
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#2563EB] px-[18px] py-2 text-[13px] font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-[15px] w-[15px]" />
            Add Booking
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Section title + count */}
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-[#111827]">All Bookings</h2>
          <span className="rounded-full bg-[#EFF6FF] px-3 py-0.5 text-[13px] font-bold text-[#2563EB]">
            {bookings.length} bookings
          </span>
        </div>

        {/* Filters */}
        <div className="mb-5 flex items-center gap-3">
          <FilterDropdown label="All Properties" />
          <FilterDropdown label="All" />
          <FilterDropdown label="Jan — Mar 2026" />
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  {[
                    "Booking ID",
                    "Tenant",
                    "Property",
                    "Room",
                    "Seat",
                    "Lease Period",
                    "Duration",
                    "Amount",
                    "Actions",
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
                      colSpan={9}
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
                          {b.id.slice(0, 6)}
                          <br />
                          {b.id.slice(6)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#111827]">
                        {b.tenant}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">
                        {b.property}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">
                        {b.room}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">
                        {b.seat}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#374151]">
                        {b.leasePeriod}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#F0F9FF] px-2.5 py-1 text-[12px] font-semibold text-[#0369A1]">
                          {b.duration}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#111827]">
                        {b.amount}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditTarget(b)}
                            className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            aria-label="Edit booking"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(b)}
                            className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete booking"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-[#F3F4F6] px-5 py-4">
            <span className="text-[13px] text-[#6B7280]">
              {bookings.length > 0
                ? `Showing 1–${bookings.length} of ${bookings.length} bookings`
                : "No bookings"}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="rounded-[8px] border border-[#E5E7EB] px-3 py-1.5 text-[13px] font-medium text-[#9CA3AF] disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#2563EB] text-[13px] font-bold text-white">
                1
              </button>
              <button
                disabled
                className="rounded-[8px] border border-[#E5E7EB] px-3 py-1.5 text-[13px] font-medium text-[#9CA3AF] disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <BookingForm
        key={editTarget?.id ?? "new"}
        open={formOpen || !!editTarget}
        initial={editTarget ?? undefined}
        onClose={closeForm}
        onSave={handleSave}
        saving={createMutation.isPending || updateMutation.isPending}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        label={deleteTarget?.tenant ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

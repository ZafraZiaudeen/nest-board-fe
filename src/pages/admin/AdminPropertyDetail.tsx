import { useUser } from "@clerk/react"
import { ArrowLeft, Bell, Edit2, Menu, Plus, Star, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useProperties } from "@/hooks/useProperties"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { useUpdateProperty } from "@/hooks/useUpdateProperty"
import { useDeleteProperty } from "@/hooks/useDeleteProperty"
import { cn } from "@/lib/utils"
import type { Property } from "@/types/property"
import { DeleteConfirm } from "./components/DeleteConfirm"
import { PropertyForm } from "./components/PropertyForm"

function typeBadgeClass(type: Property["type"]): string {
  switch (type) {
    case "Hotel":
      return "bg-orange-50 text-orange-600"
    case "Apartment":
      return "bg-violet-50 text-violet-600"
    case "Villa":
      return "bg-emerald-50 text-emerald-600"
    case "House":
      return "bg-slate-100 text-slate-600"
  }
}

export function AdminPropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: detail, isLoading } = usePropertyDetail(id)
  const { data: propertiesList } = useProperties()
  const listProperty = propertiesList?.find((p) => p.id === id)

  const updateMutation = useUpdateProperty()
  const deleteMutation = useDeleteProperty()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleSave(data: Omit<Property, "id" | "rating">) {
    if (!id) return
    updateMutation.mutate({ id, data }, { onSuccess: () => setEditOpen(false) })
  }

  function handleDelete() {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate("/admin/properties"),
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
          <span className="max-w-[300px] truncate text-xl font-bold text-[#111827]">
            {detail?.title ?? "Property"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[#F87171]" />
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2563EB] px-[18px] py-2 text-[13px] font-bold text-white transition-colors hover:bg-blue-700">
            <Plus className="h-[15px] w-[15px]" />
            Add Property
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B7280] transition-colors hover:text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        {isLoading ? (
          <div className="mt-4 animate-pulse overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white">
            <div className="h-[280px] rounded-t-[18px] bg-gray-100" />
            <div className="space-y-3 p-6">
              <div className="h-7 w-64 rounded bg-gray-100" />
              <div className="h-4 w-48 rounded bg-gray-100" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-gray-100" />
                <div className="h-6 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ) : detail ? (
          <>
            {/* Property info card */}
            <div className="mt-4 overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              {detail.image && (
                <div className="h-[280px] w-full overflow-hidden">
                  <img
                    src={detail.image}
                    alt={detail.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[22px] font-bold text-[#111827]">
                      {detail.title}
                    </h2>
                    <p className="mt-1 text-[14px] text-[#6B7280]">
                      {detail.address}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="flex items-center gap-1.5 rounded-[10px] border border-[#E5E7EB] px-4 py-2 text-[13px] font-semibold text-[#374151] transition-colors hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteOpen(true)}
                      className="flex items-center gap-1.5 rounded-[10px] border border-red-200 px-4 py-2 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-3 py-1 text-[12px] font-semibold text-orange-600">
                    <Star className="h-3.5 w-3.5" />
                    {detail.rating} rating
                  </span>
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-semibold text-[#2563EB]">
                    {detail.seatsAvailable} seats available
                  </span>
                  <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[12px] font-semibold text-[#6B7280]">
                    Min stay: {detail.minStay}
                  </span>
                  <span className="rounded-full bg-[#F0FDF4] px-3 py-1 text-[12px] font-semibold text-[#15803D]">
                    From {detail.startingPrice}
                  </span>
                  {listProperty && (
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] font-semibold",
                        typeBadgeClass(listProperty.type),
                      )}
                    >
                      {listProperty.type}
                    </span>
                  )}
                </div>

                {/* Amenities */}
                {detail.amenities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-[8px] border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-1 text-[12px] text-[#374151]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rooms table card */}
            <div className="mt-5 overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="border-b border-[#F3F4F6] px-5 py-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Rooms</h3>
                <p className="mt-0.5 text-[13px] text-[#9CA3AF]">
                  {detail.rooms.length} room
                  {detail.rooms.length !== 1 ? "s" : ""}
                </p>
              </div>

              {detail.rooms.length === 0 ? (
                <p className="px-5 py-8 text-center text-[14px] text-[#9CA3AF]">
                  No rooms added yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        {[
                          "Room",
                          "Price (LKR)",
                          "Total Seats",
                          "Free Seats",
                          "AC",
                        ].map((col) => (
                          <th
                            key={col}
                            className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.rooms.map((room, idx) => (
                        <tr
                          key={room.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                        >
                          <td className="px-5 py-3.5 text-[13px] font-semibold text-[#111827]">
                            {room.name}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-[#374151]">
                            {room.price}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-[#374151]">
                            {room.seatsTotal}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-[#374151]">
                            {room.seatsFree}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                                room.hasAC
                                  ? "bg-[#EFF6FF] text-[#2563EB]"
                                  : "bg-gray-100 text-[#6B7280]",
                              )}
                            >
                              {room.hasAC ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-[14px] text-[#9CA3AF]">
            Property not found.
          </p>
        )}
      </div>

      {/* Overlays */}
      <PropertyForm
        open={editOpen}
        initial={listProperty}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        saving={updateMutation.isPending}
      />
      <DeleteConfirm
        open={deleteOpen}
        label={detail?.title ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

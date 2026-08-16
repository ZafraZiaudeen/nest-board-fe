import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  Edit2,
  Menu,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useAdminProperties } from "@/hooks/useAdminProperties"
import { usePropertyDetail } from "@/hooks/usePropertyDetail"
import { useUpdateProperty } from "@/hooks/useUpdateProperty"
import { useDeleteProperty } from "@/hooks/useDeleteProperty"
import { useCreateRoomType } from "@/hooks/useCreateRoomType"
import { useDeleteRoomType } from "@/hooks/useDeleteRoomType"
import { useUpdateRoomType } from "@/hooks/useUpdateRoomType"
import { useCreateRoom } from "@/hooks/useCreateRoom"
import { useDeleteRoom } from "@/hooks/useDeleteRoom"
import { cn } from "@/lib/utils"
import type { Property, RoomType } from "@/types/property"
import type { CreatePropertyInput } from "@/api/admin-properties"
import { DeleteConfirm } from "./components/DeleteConfirm"
import { PropertyForm } from "./components/PropertyForm"
import { RoomTypeForm } from "./components/RoomTypeForm"

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
  const { data: propertiesList } = useAdminProperties()
  const listProperty = propertiesList?.find((p) => p.id === id)

  // Property mutations
  const updateMutation = useUpdateProperty()
  const deleteMutation = useDeleteProperty()

  // Room type mutations
  const createRtMutation = useCreateRoomType(id ?? "")
  const updateRtMutation = useUpdateRoomType(id ?? "")
  const deleteRtMutation = useDeleteRoomType(id ?? "")

  // Room mutations
  const createRoomMutation = useCreateRoom(id ?? "")
  const deleteRoomMutation = useDeleteRoom(id ?? "")

  // Property form state
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Room type form state
  const [rtFormOpen, setRtFormOpen] = useState(false)
  const [editRtTarget, setEditRtTarget] = useState<RoomType | null>(null)
  const [deleteRtTarget, setDeleteRtTarget] = useState<RoomType | null>(null)

  // Room management state
  const [expandedRtId, setExpandedRtId] = useState<string | null>(null)
  const [newRoomLabels, setNewRoomLabels] = useState<Record<string, string>>({})
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<{
    roomTypeId: string
    roomId: string
    roomLabel: string
  } | null>(null)

  function handleSaveProperty(data: CreatePropertyInput) {
    if (!id) return
    updateMutation.mutate({ id, data }, { onSuccess: () => setEditOpen(false) })
  }

  function handleDeleteProperty() {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate("/admin/properties"),
    })
  }

  function handleSaveRoomType(data: {
    name: string
    pricePerMonth: number
    seatCapacity: number
    hasAC: boolean
    amenities: string[]
  }) {
    if (editRtTarget) {
      updateRtMutation.mutate(
        { roomTypeId: editRtTarget.id, data },
        { onSuccess: () => setEditRtTarget(null) },
      )
    } else {
      createRtMutation.mutate(data, { onSuccess: () => setRtFormOpen(false) })
    }
  }

  function handleDeleteRoomType() {
    if (!deleteRtTarget || !id) return
    deleteRtMutation.mutate(deleteRtTarget.id, {
      onSuccess: () => setDeleteRtTarget(null),
    })
  }

  function handleAddRoom(roomTypeId: string) {
    const label = (newRoomLabels[roomTypeId] ?? "").trim()
    if (!label || !id) return
    createRoomMutation.mutate(
      { roomTypeId, roomLabel: label },
      {
        onSuccess: () =>
          setNewRoomLabels((prev) => ({ ...prev, [roomTypeId]: "" })),
      },
    )
  }

  function handleDeleteRoom() {
    if (!deleteRoomTarget || !id) return
    deleteRoomMutation.mutate(
      { roomTypeId: deleteRoomTarget.roomTypeId, roomId: deleteRoomTarget.roomId },
      { onSuccess: () => setDeleteRoomTarget(null) },
    )
  }

  const formInitial: Partial<CreatePropertyInput> | undefined =
    listProperty && detail
      ? {
          title: listProperty.title,
          description: listProperty.description,
          address: listProperty.address,
          city: listProperty.city,
          type: listProperty.type.toUpperCase() as CreatePropertyInput["type"],
          rating: listProperty.rating,
          imageUrl: listProperty.image,
          amenities: listProperty.amenities ?? [],
          latitude: listProperty.latitude,
          longitude: listProperty.longitude,
          minStay: detail.minStay,
        }
      : undefined

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

            {/* Room Types card */}
            <div className="mt-5 overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">
                    Room Types
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#9CA3AF]">
                    {detail.roomTypes.length} room type
                    {detail.roomTypes.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setRtFormOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Room Type
                </button>
              </div>

              {detail.roomTypes.length === 0 ? (
                <p className="px-5 py-8 text-center text-[14px] text-[#9CA3AF]">
                  No room types yet. Add one to start managing rooms.
                </p>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {detail.roomTypes.map((rt) => {
                    const isExpanded = expandedRtId === rt.id
                    const rooms = rt.rooms ?? []

                    return (
                      <div key={rt.id}>
                        {/* Room type row */}
                        <div className="flex items-center gap-3 px-5 py-3.5">
                          {/* Expand toggle */}
                          <button
                            onClick={() =>
                              setExpandedRtId(isExpanded ? null : rt.id)
                            }
                            className="shrink-0 rounded p-1 text-[#9CA3AF] transition-colors hover:bg-gray-100 hover:text-[#374151]"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>

                          {/* Room type info */}
                          <div className="flex flex-1 items-center gap-6">
                            <span className="w-44 text-[13px] font-semibold text-[#111827] truncate">
                              {rt.name}
                            </span>
                            <span className="w-28 text-[13px] text-[#374151]">
                              LKR {rt.price}
                            </span>
                            <span className="w-24 text-[13px] text-[#374151]">
                              {rooms.length} room{rooms.length !== 1 ? "s" : ""}
                            </span>
                            <span className="w-24 text-[13px] text-[#374151]">
                              {rt.seatsTotal} seats
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                                  rt.hasAC
                                    ? "bg-[#EFF6FF] text-[#2563EB]"
                                    : "bg-gray-100 text-[#6B7280]",
                                )}
                              >
                                {rt.hasAC ? "AC" : "No AC"}
                              </span>
                              {(rt.amenities ?? []).map((a) => (
                                <span
                                  key={a}
                                  className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[12px] text-[#374151]"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Edit / Delete room type */}
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              onClick={() => setEditRtTarget(rt)}
                              className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                              aria-label="Edit room type"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteRtTarget(rt)}
                              className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete room type"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded rooms sub-section */}
                        {isExpanded && (
                          <div className="border-t border-[#F9FAFB] bg-[#FAFAFA] px-8 py-4">
                            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                              Rooms
                            </p>

                            {rooms.length === 0 ? (
                              <p className="mb-3 text-[13px] text-[#9CA3AF]">
                                No rooms added yet.
                              </p>
                            ) : (
                              <div className="mb-3 flex flex-wrap gap-2">
                                {rooms.map((room) => (
                                  <div
                                    key={room.id}
                                    className="flex items-center gap-1.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-1.5"
                                  >
                                    <span className="text-[13px] font-medium text-[#374151]">
                                      {room.roomLabel}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setDeleteRoomTarget({
                                          roomTypeId: rt.id,
                                          roomId: room.id,
                                          roomLabel: room.roomLabel,
                                        })
                                      }
                                      className="rounded p-0.5 text-[#9CA3AF] transition-colors hover:text-red-500"
                                      aria-label={`Delete room ${room.roomLabel}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Inline add room */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newRoomLabels[rt.id] ?? ""}
                                onChange={(e) =>
                                  setNewRoomLabels((prev) => ({
                                    ...prev,
                                    [rt.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddRoom(rt.id)
                                }}
                                placeholder="e.g. Room A"
                                className="w-40 rounded-[8px] border border-[#E5E7EB] px-3 py-1.5 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                              />
                              <button
                                onClick={() => handleAddRoom(rt.id)}
                                disabled={
                                  !(newRoomLabels[rt.id] ?? "").trim() ||
                                  createRoomMutation.isPending
                                }
                                className="flex items-center gap-1 rounded-[8px] bg-[#2563EB] px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Room
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
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

      {/* Property overlays */}
      <PropertyForm
        open={editOpen}
        initial={formInitial}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProperty}
        saving={updateMutation.isPending}
      />
      <DeleteConfirm
        open={deleteOpen}
        label={detail?.title ?? ""}
        onConfirm={handleDeleteProperty}
        onCancel={() => setDeleteOpen(false)}
        loading={deleteMutation.isPending}
      />

      {/* Room type overlays */}
      <RoomTypeForm
        open={rtFormOpen || !!editRtTarget}
        initial={
          editRtTarget
            ? {
                name: editRtTarget.name,
                pricePerMonth: editRtTarget.pricePerMonthRaw,
                seatCapacity: editRtTarget.seatCapacity,
                hasAC: editRtTarget.hasAC,
                amenities: editRtTarget.amenities ?? [],
              }
            : undefined
        }
        onClose={() => { setRtFormOpen(false); setEditRtTarget(null) }}
        onSave={handleSaveRoomType}
        saving={createRtMutation.isPending || updateRtMutation.isPending}
      />
      <DeleteConfirm
        open={!!deleteRtTarget}
        label={deleteRtTarget?.name ?? ""}
        onConfirm={handleDeleteRoomType}
        onCancel={() => setDeleteRtTarget(null)}
        loading={deleteRtMutation.isPending}
      />

      {/* Room overlays */}
      <DeleteConfirm
        open={!!deleteRoomTarget}
        label={deleteRoomTarget?.roomLabel ?? ""}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteRoomTarget(null)}
        loading={deleteRoomMutation.isPending}
      />
    </div>
  )
}

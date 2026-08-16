import { useQueries } from "@tanstack/react-query"
import { Bell, Building2, Edit2, Menu, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router"
import { fetchPropertyDetail } from "@/api/properties"
import { useAdminProperties } from "@/hooks/useAdminProperties"
import { useCreateProperty } from "@/hooks/useCreateProperty"
import { useUpdateProperty } from "@/hooks/useUpdateProperty"
import { useDeleteProperty } from "@/hooks/useDeleteProperty"
import { cn } from "@/lib/utils"
import type { Property } from "@/types/property"
import type { CreatePropertyInput } from "@/api/admin-properties"
import { DeleteConfirm } from "./components/DeleteConfirm"
import { PropertyForm } from "./components/PropertyForm"

type Status = "Active" | "Inactive"

function getTypeIconColor(type: Property["type"]): string {
  switch (type) {
    case "Hotel":
      return "text-orange-500"
    case "Apartment":
      return "text-violet-500"
    case "Villa":
      return "text-emerald-500"
    case "House":
      return "text-slate-400"
  }
}

function getBarColor(pct: number, status: Status): string {
  if (status === "Inactive") return "#9CA3AF"
  if (pct >= 85) return "#22C55E"
  if (pct >= 60) return "#2563EB"
  return "#F59E0B"
}

type PropertyCardProps = {
  property: Property
  roomCount: number | null
  pct: number | null
  loading: boolean
  onEdit: () => void
  onDelete: () => void
}

function PropertyCard({
  property,
  roomCount,
  pct,
  loading,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const status: Status = pct !== null && pct < 50 ? "Inactive" : "Active"
  const barColor = pct !== null ? getBarColor(pct, status) : "#E5E7EB"

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      {/* Hero image */}
      <div className="relative h-[155px]">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover"
        />

        {/* Status badge */}
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              status === "Active"
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "border border-gray-200 bg-white text-[#6B7280]",
            )}
          >
            {status}
          </span>
        </div>

        {/* Type icon */}
        <div className="absolute bottom-3 left-3 flex items-center justify-center rounded-xl bg-white p-2 shadow-md">
          <Building2
            className={cn("h-6 w-6", getTypeIconColor(property.type))}
          />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-[15px] font-bold leading-snug text-[#111827]">
          {property.title}
        </h3>
        <p className="mt-1 text-[13px] text-[#9CA3AF]">{property.location}</p>
        {property.description && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#9CA3AF]">
            {property.description}
          </p>
        )}

        {/* Rooms + occupancy */}
        <div className="mt-3 flex items-center gap-2">
          {roomCount !== null ? (
            <span className="text-[13px] text-[#374151]">
              {roomCount} Rooms
            </span>
          ) : (
            <span className="inline-block h-4 w-16 animate-pulse rounded bg-gray-100" />
          )}
          {pct !== null && !loading ? (
            <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-bold text-[#2563EB]">
              {pct}% Occupied
            </span>
          ) : (
            <span className="inline-block h-5 w-24 animate-pulse rounded-full bg-gray-100" />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
          {pct !== null && !loading ? (
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          ) : (
            <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/admin/properties/${property.id}`}
            className="text-[13px] font-semibold text-[#2563EB] hover:underline"
          >
            Manage →
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
              aria-label="Edit property"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="rounded p-1.5 text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Delete property"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="h-[155px] animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

export function AdminProperties() {
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Property | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)

  const {
    data: properties,
    isLoading: propertiesLoading,
    isError,
  } = useAdminProperties()

  const createMutation = useCreateProperty()
  const updateMutation = useUpdateProperty()
  const deleteMutation = useDeleteProperty()

  const propertyIds = useMemo(
    () => properties?.map((p) => p.id) ?? [],
    [properties],
  )

  const detailQueries = useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: ["property-detail", id],
      queryFn: () => fetchPropertyDetail(id),
      enabled: propertyIds.length > 0,
      staleTime: 60_000,
    })),
  })

  const propertiesWithDetails = useMemo(() => {
    if (!properties) return []
    return properties.map((property, idx) => {
      const query = detailQueries[idx]
      const detail = query?.data
      const loading = query?.isPending || query?.isFetching || false

      if (!detail) return { property, roomCount: null, pct: null, loading }

      const roomCount = detail.roomTypes.length
      const totalSeats = detail.roomTypes.reduce((s, r) => s + r.seatsTotal, 0)
      const freeSeats = detail.roomTypes.reduce((s, r) => s + r.seatsFree, 0)
      const pct =
        totalSeats === 0
          ? 0
          : Math.round(((totalSeats - freeSeats) / totalSeats) * 100)

      return { property, roomCount, pct, loading: false }
    })
  }, [properties, detailQueries])

  function closeForm() {
    setFormOpen(false)
    setEditTarget(null)
  }

  function handleSave(data: CreatePropertyInput) {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data }, { onSuccess: closeForm })
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
          <span className="text-xl font-bold text-[#111827]">Properties</span>
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
            Add Property
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5">
        {isError ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load properties. Check that the API is running.
          </p>
        ) : propertiesLoading ? (
          <div className="grid grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {propertiesWithDetails.map(({ property, roomCount, pct, loading }) => (
              <PropertyCard
                key={property.id}
                property={property}
                roomCount={roomCount}
                pct={pct}
                loading={loading}
                onEdit={() => setEditTarget(property)}
                onDelete={() => setDeleteTarget(property)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Overlays */}
      <PropertyForm
        key={editTarget?.id ?? "new"}
        open={formOpen || !!editTarget}
        initial={
          editTarget
            ? {
                title: editTarget.title,
                description: editTarget.description,
                address: editTarget.address,
                city: editTarget.city,
                type: editTarget.type.toUpperCase() as CreatePropertyInput["type"],
                rating: editTarget.rating,
                imageUrl: editTarget.image,
                amenities: editTarget.amenities ?? [],
                latitude: editTarget.latitude,
                longitude: editTarget.longitude,
              }
            : undefined
        }
        onClose={closeForm}
        onSave={handleSave}
        saving={createMutation.isPending || updateMutation.isPending}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        label={deleteTarget?.title ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

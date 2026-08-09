import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { Property } from "@/types/property"

type PropertyFormProps = {
  open: boolean
  initial?: Partial<Property>
  onClose: () => void
  onSave: (data: Omit<Property, "id" | "rating">) => void
  saving?: boolean
}

const FIELD =
  "w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
const LABEL = "mb-1.5 block text-[13px] font-semibold text-[#374151]"

export function PropertyForm({
  open,
  initial,
  onClose,
  onSave,
  saving,
}: PropertyFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [location, setLocation] = useState(initial?.location ?? "")
  const [type, setType] = useState<Property["type"]>(
    initial?.type ?? "Apartment",
  )
  const [price, setPrice] = useState(initial?.price ?? "")
  const [image, setImage] = useState(initial?.image ?? "")

  useEffect(() => {
    setTitle(initial?.title ?? "")
    setLocation(initial?.location ?? "")
    setType(initial?.type ?? "Apartment")
    setPrice(initial?.price ?? "")
    setImage(initial?.image ?? "")
  }, [initial?.id, open])

  if (!open) return null

  const isEdit = !!initial?.id
  const canSave = title.trim() && location.trim() && price.trim()

  function handleSave() {
    if (!canSave) return
    onSave({
      title: title.trim(),
      location: location.trim(),
      type,
      price: price.trim(),
      image: image.trim(),
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={!saving ? onClose : undefined}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
          <h2 className="text-[17px] font-bold text-[#111827]">
            {isEdit ? "Edit Property" : "Add Property"}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 text-[#9CA3AF] transition-colors hover:text-gray-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label className={LABEL}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset Apartment"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Colombo 03, Sri Lanka"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Property["type"])}
              className={FIELD}
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Hotel">Hotel</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Price *</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 25K"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className={FIELD}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-[#E5E7EB] px-6 py-2.5 text-[13px] font-semibold text-[#374151] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="rounded-full bg-[#2563EB] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </>
  )
}

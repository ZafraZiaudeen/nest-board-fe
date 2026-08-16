import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreatePropertyInput } from "@/api/admin-properties"

const PROPERTY_AMENITIES = [
  "WiFi",
  "CCTV / Security",
  "Parking",
  "Swimming Pool",
  "Gym",
  "Laundry",
  "Backup Power",
  "Common Kitchen",
  "Garden / Terrace",
  "Reception",
]

type PropertyFormProps = {
  open: boolean
  initial?: Partial<CreatePropertyInput>
  onClose: () => void
  onSave: (data: CreatePropertyInput) => void
  saving?: boolean
}

const FIELD =
  "w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
const FIELD_ERR =
  "w-full rounded-[10px] border border-red-400 px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-red-400 focus:ring-2 focus:ring-red-100"
const LABEL = "mb-1.5 block text-[13px] font-semibold text-[#374151]"

export function PropertyForm({
  open,
  initial,
  onClose,
  onSave,
  saving,
}: PropertyFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [address, setAddress] = useState(initial?.address ?? "")
  const [city, setCity] = useState(initial?.city ?? "")
  const [type, setType] = useState<CreatePropertyInput["type"]>(
    initial?.type ?? "APARTMENT",
  )
  const [rating, setRating] = useState(String(initial?.rating ?? ""))
  const [latitude, setLatitude] = useState(
    initial?.latitude != null ? String(initial.latitude) : "",
  )
  const [longitude, setLongitude] = useState(
    initial?.longitude != null ? String(initial.longitude) : "",
  )
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "")
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? [])
  const [minStayMonths, setMinStayMonths] = useState(
    String(Math.max(1, parseInt(initial?.minStay ?? "1") || 1))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setTitle(initial?.title ?? "")
    setDescription(initial?.description ?? "")
    setAddress(initial?.address ?? "")
    setCity(initial?.city ?? "")
    setType(initial?.type ?? "APARTMENT")
    setRating(String(initial?.rating ?? ""))
    setLatitude(initial?.latitude != null ? String(initial.latitude) : "")
    setLongitude(initial?.longitude != null ? String(initial.longitude) : "")
    setImageUrl(initial?.imageUrl ?? "")
    setAmenities(initial?.amenities ?? [])
    setMinStayMonths(String(Math.max(1, parseInt(initial?.minStay ?? "1") || 1)))
    setErrors({})
  }, [initial?.title, open])

  if (!open) return null

  const isEdit = !!initial

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (title.trim().length < 3) errs.title = "Title must be at least 3 characters."
    if (description.trim().length < 3)
      errs.description = "Description must be at least 3 characters."
    if (address.trim().length < 3) errs.address = "Address is required."
    if (city.trim().length < 3) errs.city = "City is required."
    const r = parseFloat(rating)
    if (rating === "" || isNaN(r) || r < 0 || r > 5)
      errs.rating = "Rating must be between 0 and 5."
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    onSave({
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      type,
      rating: parseFloat(rating),
      amenities,
      latitude: latitude !== "" ? parseFloat(latitude) : 0,
      longitude: longitude !== "" ? parseFloat(longitude) : 0,
      imageUrl: imageUrl.trim(),
      minStay: (() => { const n = Math.max(1, parseInt(minStayMonths) || 1); return `${n} month${n !== 1 ? "s" : ""}` })(),
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
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })) }}
              placeholder="e.g. Sunset Apartment"
              className={errors.title ? FIELD_ERR : FIELD}
            />
            {errors.title && (
              <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>
            )}
          </div>
          <div>
            <label className={LABEL}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })) }}
              placeholder="Brief description of the property"
              rows={3}
              className={`${errors.description ? FIELD_ERR : FIELD} resize-none`}
            />
            {errors.description && (
              <p className="mt-1 text-[12px] text-red-500">{errors.description}</p>
            )}
          </div>
          <div>
            <label className={LABEL}>Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })) }}
              placeholder="e.g. 42 Galle Road"
              className={errors.address ? FIELD_ERR : FIELD}
            />
            {errors.address && (
              <p className="mt-1 text-[12px] text-red-500">{errors.address}</p>
            )}
          </div>
          <div>
            <label className={LABEL}>City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: "" })) }}
              placeholder="e.g. Colombo"
              className={errors.city ? FIELD_ERR : FIELD}
            />
            {errors.city && (
              <p className="mt-1 text-[12px] text-red-500">{errors.city}</p>
            )}
          </div>
          <div>
            <label className={LABEL}>Minimum Stay (months)</label>
            <input
              type="number"
              value={minStayMonths}
              onChange={(e) => setMinStayMonths(e.target.value)}
              placeholder="1"
              min={1}
              step={1}
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Type *</label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as CreatePropertyInput["type"])
              }
              className={FIELD}
            >
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="VILLA">Villa</option>
              <option value="HOTEL">Hotel</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Rating * (0–5)</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => { setRating(e.target.value); setErrors((p) => ({ ...p, rating: "" })) }}
              placeholder="4.5"
              min={0}
              max={5}
              step={0.1}
              className={errors.rating ? FIELD_ERR : FIELD}
            />
            {errors.rating && (
              <p className="mt-1 text-[12px] text-red-500">{errors.rating}</p>
            )}
          </div>
          <div>
            <label className={LABEL}>Amenities</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {PROPERTY_AMENITIES.map((a) => {
                const checked = amenities.includes(a)
                return (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setAmenities((prev) =>
                          checked ? prev.filter((x) => x !== a) : [...prev, a]
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#DBEAFE]"
                    />
                    <span className="text-[13px] text-[#374151]">{a}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="6.9271"
                step="any"
                className={FIELD}
              />
            </div>
            <div>
              <label className={LABEL}>Longitude</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="79.8612"
                step="any"
                className={FIELD}
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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
            disabled={saving}
            className="rounded-full bg-[#2563EB] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </>
  )
}

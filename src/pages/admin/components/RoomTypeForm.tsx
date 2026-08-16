import { X } from "lucide-react"
import { useEffect, useState } from "react"

const ROOM_AMENITIES = [
  "Hot Water / Geyser",
  "Attached Bathroom",
  "TV",
  "Balcony",
  "Study Desk",
  "Refrigerator",
  "Wardrobe",
  "Ceiling Fan",
]

type RoomTypeInput = {
  name: string
  pricePerMonth: number
  seatCapacity: number
  hasAC: boolean
  amenities: string[]
}

type RoomTypeFormProps = {
  open: boolean
  initial?: Partial<RoomTypeInput>
  onClose: () => void
  onSave: (data: RoomTypeInput) => void
  saving?: boolean
}

const FIELD =
  "w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
const FIELD_ERR =
  "w-full rounded-[10px] border border-red-400 px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-red-400 focus:ring-2 focus:ring-red-100"
const LABEL = "mb-1.5 block text-[13px] font-semibold text-[#374151]"

export function RoomTypeForm({ open, initial, onClose, onSave, saving }: RoomTypeFormProps) {
  const isEdit = !!initial

  const [name, setName] = useState(initial?.name ?? "")
  const [price, setPrice] = useState(initial?.pricePerMonth != null ? String(initial.pricePerMonth) : "")
  const [capacity, setCapacity] = useState(initial?.seatCapacity != null ? String(initial.seatCapacity) : "")
  const [hasAC, setHasAC] = useState(initial?.hasAC ?? false)
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setName(initial?.name ?? "")
    setPrice(initial?.pricePerMonth != null ? String(initial.pricePerMonth) : "")
    setCapacity(initial?.seatCapacity != null ? String(initial.seatCapacity) : "")
    setHasAC(initial?.hasAC ?? false)
    setAmenities(initial?.amenities ?? [])
    setErrors({})
  }, [initial?.name, open])

  if (!open) return null

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (name.trim().length < 2) errs.name = "Name must be at least 2 characters."
    const p = parseFloat(price)
    if (price === "" || isNaN(p) || p < 0) errs.price = "Enter a valid price (≥ 0)."
    const c = parseInt(capacity, 10)
    if (capacity === "" || isNaN(c) || c < 1) errs.capacity = "Seat capacity must be at least 1."
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
      name: name.trim(),
      pricePerMonth: parseFloat(price),
      seatCapacity: parseInt(capacity, 10),
      hasAC,
      amenities,
    })
  }

  function handleClose() {
    if (saving) return
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-[440px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
          <h2 className="text-[17px] font-bold text-[#111827]">
            {isEdit ? "Edit Room Type" : "Add Room Type"}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="rounded p-1 text-[#9CA3AF] transition-colors hover:text-gray-500 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label className={LABEL}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })) }}
              placeholder="e.g. AC Twin Sharing"
              className={errors.name ? FIELD_ERR : FIELD}
            />
            {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className={LABEL}>Price per month (LKR) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: "" })) }}
              placeholder="e.g. 20000"
              min={0}
              className={errors.price ? FIELD_ERR : FIELD}
            />
            {errors.price && <p className="mt-1 text-[12px] text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className={LABEL}>Seat capacity per room *</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => { setCapacity(e.target.value); setErrors((p) => ({ ...p, capacity: "" })) }}
              placeholder="e.g. 2"
              min={1}
              step={1}
              className={errors.capacity ? FIELD_ERR : FIELD}
            />
            {errors.capacity && <p className="mt-1 text-[12px] text-red-500">{errors.capacity}</p>}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="hasAC"
              type="checkbox"
              checked={hasAC}
              onChange={(e) => setHasAC(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#DBEAFE]"
            />
            <label htmlFor="hasAC" className="text-[13px] font-semibold text-[#374151] cursor-pointer">
              Has air conditioning (AC)
            </label>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#374151]">Additional Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {ROOM_AMENITIES.map((a) => {
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
          <button
            onClick={handleClose}
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
            {saving ? "Saving…" : isEdit ? "Save" : "Add Room Type"}
          </button>
        </div>
      </div>
    </>
  )
}

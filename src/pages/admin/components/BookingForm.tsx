import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { Booking } from "@/types/booking"

type BookingFormProps = {
  open: boolean
  initial?: Partial<Booking>
  onClose: () => void
  onSave: (data: Omit<Booking, "id">) => void
  saving?: boolean
}

const FIELD =
  "w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
const LABEL = "mb-1.5 block text-[13px] font-semibold text-[#374151]"

export function BookingForm({
  open,
  initial,
  onClose,
  onSave,
  saving,
}: BookingFormProps) {
  const [tenant, setTenant] = useState(initial?.tenant ?? "")
  const [property, setProperty] = useState(initial?.property ?? "")
  const [room, setRoom] = useState(initial?.room ?? "")
  const [seat, setSeat] = useState(initial?.seat ?? "")
  const [leasePeriod, setLeasePeriod] = useState(initial?.leasePeriod ?? "")
  const [duration, setDuration] = useState(initial?.duration ?? "")
  const [amount, setAmount] = useState(initial?.amount ?? "")

  useEffect(() => {
    setTenant(initial?.tenant ?? "")
    setProperty(initial?.property ?? "")
    setRoom(initial?.room ?? "")
    setSeat(initial?.seat ?? "")
    setLeasePeriod(initial?.leasePeriod ?? "")
    setDuration(initial?.duration ?? "")
    setAmount(initial?.amount ?? "")
  }, [initial?.id, open])

  if (!open) return null

  const isEdit = !!initial?.id
  const canSave = tenant.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave({
      tenant: tenant.trim(),
      propertyId: initial?.propertyId ?? "",
      property: property.trim(),
      room: room.trim(),
      seat: seat.trim(),
      leasePeriod: leasePeriod.trim(),
      duration: duration.trim(),
      amount: amount.trim(),
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
            {isEdit ? "Edit Booking" : "Add Booking"}
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
            <label className={LABEL}>Tenant *</label>
            <input
              type="text"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              placeholder="Full name"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Property</label>
            <input
              type="text"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              placeholder="e.g. Sunrise CL"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Room</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room A-3"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Seat</label>
            <input
              type="text"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              placeholder="e.g. S-2"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Lease Period</label>
            <input
              type="text"
              value={leasePeriod}
              onChange={(e) => setLeasePeriod(e.target.value)}
              placeholder="e.g. Jan — Mar 2026"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 months"
              className={FIELD}
            />
          </div>
          <div>
            <label className={LABEL}>Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. LKR 45,000"
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

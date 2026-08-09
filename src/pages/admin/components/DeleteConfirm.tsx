import { AlertTriangle } from "lucide-react"

type DeleteConfirmProps = {
  open: boolean
  label: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirm({
  open,
  label,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={!loading ? onCancel : undefined}
      />
      <div className="relative z-10 w-[400px] rounded-[18px] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-[17px] font-bold text-[#111827]">
            Delete &ldquo;{label}&rdquo;?
          </h3>
          <p className="mt-2 text-[13px] text-[#6B7280]">
            This action cannot be undone.
          </p>
          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-full border border-[#E5E7EB] py-2.5 text-[13px] font-semibold text-[#374151] transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-full bg-red-600 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED"

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 ring-amber-300/50",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-green-100 text-green-700 ring-green-300/50",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 ring-red-300/50",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-gray-100 text-gray-500 ring-gray-300/50",
  },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, className } = statusConfig[status] ?? statusConfig.EXPIRED
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      {label}
    </span>
  )
}

import { useAuth } from "@/components/auth/AuthProvider"
import { useQueries } from "@tanstack/react-query"
import {
  Bell,
  Building2,
  CalendarDays,
  Home,
  Menu,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { type ReactNode, useMemo } from "react"
import { fetchPropertyDetail } from "@/api/properties"
import { useProperties } from "@/hooks/useProperties"
import { cn } from "@/lib/utils"

function formatTodayLong(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date())
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}

type StatCardProps = {
  icon: ReactNode
  iconBg: string
  trend: string
  trendPositive: boolean
  value: string | number | null
  label: string
  timeframe: string
  loading?: boolean
  valueClassName?: string
}

function StatCard({
  icon,
  iconBg,
  trend,
  trendPositive,
  value,
  label,
  timeframe,
  loading,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-[18px] border border-[#F3F4F6] bg-white p-[22.8px] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
            trendPositive
              ? "bg-[#F0FDF4] text-[#16A34A]"
              : "bg-[#FFF1F2] text-[#E11D48]",
          )}
        >
          {trendPositive ? (
            <TrendingUp className="h-[11px] w-[11px]" aria-hidden />
          ) : (
            <TrendingDown className="h-[11px] w-[11px]" aria-hidden />
          )}
          {trend}
        </div>
      </div>
      <p
        className={cn(
          "mt-5 font-bold tracking-tight text-[#111827]",
          valueClassName ?? "text-[36px] leading-none",
        )}
      >
        {loading || value === null ? (
          <span className="inline-block h-9 w-20 animate-pulse rounded-md bg-gray-100" />
        ) : (
          value
        )}
      </p>
      <p className="mt-1.5 text-[13px] font-bold text-[#374151]">{label}</p>
      <p className="mt-1 text-[11px] text-[#9CA3AF]">{timeframe}</p>
    </div>
  )
}

const RECENT_BOOKINGS = [
  {
    id: "1",
    name: "Kavindra Perera",
    detail: "Sunrise CL · Room A-3 · Seat 2",
    timeAgo: "2 min ago",
  },
  {
    id: "2",
    name: "Nimesha Silva",
    detail: "Lotus CL · Room B-1 · Seat 4",
    timeAgo: "15 min ago",
  },
  {
    id: "3",
    name: "Dulaj Mendis",
    detail: "Sunrise CL · Room C-2 · Seat 1",
    timeAgo: "42 min ago",
  },
  {
    id: "4",
    name: "Sachini Rajapaksha",
    detail: "Harbor CL · Room D-5 · Seat 3",
    timeAgo: "1 hr ago",
  },
  {
    id: "5",
    name: "Tharindu Bandara",
    detail: "Maple CL · Room A-4 · Seat 5",
    timeAgo: "2 hrs ago",
  },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const displayName = user?.displayName ?? "there"

  const {
    data: properties,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useProperties()

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

  const totalProperties = properties?.length ?? null

  const roomsLoading =
    propertyIds.length > 0 &&
    detailQueries.some((q) => q.isPending || q.isFetching)

  const totalRooms =
    propertyIds.length === 0
      ? 0
      : roomsLoading
        ? null
        : detailQueries.reduce(
            (sum, q) => sum + (q.data?.rooms?.length ?? 0),
            0,
          )

  const occupancyData = useMemo(() => {
    if (!properties) return []
    return properties.map((property, idx) => {
      const detail = detailQueries[idx]?.data
      if (!detail) return { name: property.title, pct: null as number | null }
      const totalSeats = detail.rooms?.reduce((s, r) => s + r.seatsTotal, 0) ?? 0
      const freeSeats = detail.rooms?.reduce((s, r) => s + r.seatsFree, 0) ?? 0
      const pct =
        totalSeats === 0
          ? 0
          : Math.round(((totalSeats - freeSeats) / totalSeats) * 100)
      return { name: property.title, pct }
    })
  }, [properties, detailQueries])

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
          <span className="text-xl font-bold text-[#111827]">Dashboard</span>
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
          <button className="flex items-center gap-2 rounded-full bg-[#2563EB] px-[18px] py-2 text-[13px] font-bold text-white transition-colors hover:bg-blue-700">
            <Plus className="h-[15px] w-[15px]" />
            Add Property
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-[26px] font-bold leading-tight text-[#111827]">
            Good {getTimeOfDay()}, {displayName}
          </h1>
          <p className="mt-1 text-[13px] text-[#9CA3AF]">{formatTodayLong()}</p>
        </div>

        {propertiesError ? (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
            Could not load property stats. Check that the API is running.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {/* 2×2 stat cards */}
            <div className="grid grid-cols-2 gap-5">
              <StatCard
                icon={<Building2 className="h-5 w-5 text-[#0D9488]" />}
                iconBg="bg-[#F0FDFA]"
                trend="+1"
                trendPositive
                value={propertiesLoading ? null : totalProperties}
                label="Total Properties"
                timeframe="this quarter"
                loading={propertiesLoading}
              />
              <StatCard
                icon={<Home className="h-5 w-5 text-[#7C3AED]" />}
                iconBg="bg-[#FAF5FF]"
                trend="+4"
                trendPositive
                value={totalRooms}
                label="Total Rooms"
                timeframe="from last month"
                loading={propertiesLoading || roomsLoading}
              />
              <StatCard
                icon={<CalendarDays className="h-5 w-5 text-[#0D9488]" />}
                iconBg="bg-[#F0FDFA]"
                trend="+12%"
                trendPositive
                value={127}
                label="Active Bookings"
                timeframe="from last month"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5 text-[#D97706]" />}
                iconBg="bg-[#FFFBEB]"
                trend="-3%"
                trendPositive={false}
                value="LKR 1,920,000"
                label="Monthly Revenue"
                timeframe="from last month"
                valueClassName="text-[28px] leading-none"
              />
            </div>

            {/* Recent Bookings */}
            <div className="rounded-[18px] border border-[#F3F4F6] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2.5 px-[22.8px] pb-2 pt-[22.8px]">
                <span className="text-base font-bold text-[#111827]">
                  Recent Bookings
                </span>
                <div className="flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#22C55E]" />
                  <span className="text-[11px] font-bold text-[#16A34A]">
                    Live
                  </span>
                </div>
              </div>
              <ul>
                {RECENT_BOOKINGS.map((booking, idx) => (
                  <li
                    key={booking.id}
                    className={cn(
                      "flex items-center justify-between px-[22.8px] py-3",
                      idx > 0 && "border-t border-[#F9FAFB]",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#22C55E]" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-bold text-[#111827]">
                          {booking.name}
                        </span>
                        <span className="text-[11px] text-[#9CA3AF]">
                          {booking.detail}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[12px] text-[#9CA3AF]">
                      {booking.timeAgo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Occupancy by Property */}
            <div className="rounded-[18px] border border-[#F3F4F6] bg-white p-[22.8px] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h2 className="mb-[18px] text-base font-bold text-[#111827]">
                Occupancy by Property
              </h2>
              <div className="flex flex-col gap-[18px]">
                {occupancyData.map(({ name, pct }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#374151]">{name}</span>
                      <span className="text-[13px] font-bold text-[#2563EB]">
                        {pct === null ? (
                          <span className="inline-block h-4 w-8 animate-pulse rounded bg-gray-100" />
                        ) : (
                          `${pct}%`
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                      {pct !== null && (
                        <div
                          className="h-2 rounded-full bg-[#2563EB] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {occupancyData.length === 0 && !propertiesLoading && (
                  <p className="text-sm text-[#9CA3AF]">No properties found.</p>
                )}
                {propertiesLoading && (
                  <div className="flex flex-col gap-[18px]">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-100" />
                          <span className="inline-block h-4 w-8 animate-pulse rounded bg-gray-100" />
                        </div>
                        <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { updateProfile } from "@/api/auth"
import { useAuth } from "@/components/auth/AuthProvider"
import { useQueryClient } from "@tanstack/react-query"
import { Bell, Menu, Plus, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function AdminSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [fullName, setFullName] = useState(user?.displayName ?? "")
  const initialized = useRef(false)

  // Sync once when user data arrives (handles cache-miss on first mount)
  useEffect(() => {
    if (!initialized.current && user?.displayName) {
      setFullName(user.displayName)
      initialized.current = true
    }
  }, [user?.displayName])

  const [saved, setSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const updated = await updateProfile({ displayName: fullName.trim() })
      // Set form to server-confirmed value, then let query refetch in background
      setFullName(updated.displayName)
      queryClient.setQueryData(["me"], updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
          <span className="text-xl font-bold text-[#111827]">Settings</span>
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

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-[680px]">
          <div className="rounded-[18px] border border-[#F3F4F6] bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            {/* Card header */}
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                <User className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">
                  Profile
                </h2>
                <p className="mt-0.5 text-[13px] text-[#2563EB]">
                  Manage your personal information and contact details
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#374151]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#374151]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#6B7280] outline-none cursor-not-allowed"
                />
                <p className="mt-1 text-[12px] text-[#9CA3AF]">Email cannot be changed</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#2563EB] px-8 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saved ? "Saved!" : isSubmitting ? "Saving…" : "Save Changes"}
                </button>
                {error && (
                  <p className="mt-2 text-[13px] text-red-500">{error}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

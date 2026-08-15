import { useAuth } from "@/components/auth/AuthProvider"
import { Bell, Menu, Plus, User } from "lucide-react"
import { useState } from "react"

export function AdminSettings() {
  const { user } = useAuth()

  const [fullName, setFullName] = useState(user?.displayName ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [phone, setPhone] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#374151]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#2563EB] px-8 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-blue-700"
                >
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

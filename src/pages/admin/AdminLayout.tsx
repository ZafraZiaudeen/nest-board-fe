import { Outlet } from "react-router"
import { AdminSidebar } from "./components/AdminSidebar"

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#F0F2F5]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

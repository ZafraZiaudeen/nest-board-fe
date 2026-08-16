import { BrowserRouter, Outlet, Route, Routes } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Home } from "./pages/home/Home"
import { PropertyDetails } from "./pages/property/PropertyDetails"
import { Map } from "./pages/map/Map"
import { Navbar, type NavbarLink } from "./components/common/Navbar"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { SignIn } from "./pages/auth/SignIn"
import { Dashboard } from "./pages/dashboard/Dashboard"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { AdminProperties } from "./pages/admin/AdminProperties"
import { AdminPropertyDetail } from "./pages/admin/AdminPropertyDetail"
import { AdminBookings } from "./pages/admin/AdminBookings"
import { AdminSettings } from "./pages/admin/AdminSettings"
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute"
import { AdminThemeApplier } from "./components/auth/AdminThemeApplier"
import { AdminLayout } from "./pages/admin/AdminLayout"
import { SignUp } from "./pages/auth/SignUp"
import { StripeSuccess } from "./pages/stripe/StripeSuccess"
import { StripeCancel } from "./pages/stripe/StripeCancel"
import { RoomTypeDetails } from "./pages/property/RoomTypeDetails"
import { MyBookings } from "./pages/bookings/MyBookings"
import { SavedProperties } from "./pages/saved/SavedProperties"

const queryClient = new QueryClient()

const navLinks: NavbarLink[] = [
  { label: "Explore", to: "/" },
  { label: "Map View", to: "/map" },
  { label: "Dashboard", to: "/dashboard" },
]

export function AppLayout() {
  return (
    <>
      <Navbar links={navLinks} />
      <Outlet />
    </>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminThemeApplier>
          <Routes>
            {/* ── Public + tenant routes (Navbar layout) ── */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/property-details/:id" element={<PropertyDetails />} />
              <Route path="/property-details/:propertyId/room-types/:roomTypeId" element={<RoomTypeDetails />} />
              <Route path="/stripe/success" element={<StripeSuccess />} />
              <Route path="/stripe/cancel" element={<StripeCancel />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/saved" element={<SavedProperties />} />
              </Route>
            </Route>

            {/* ── Admin routes (sidebar layout, no Navbar) ── */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="properties/:id" element={<AdminPropertyDetail />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* ── Auth ── */}
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} />
        </AdminThemeApplier>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

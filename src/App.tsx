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
// import { AdminBookings } from "./pages/admin/AdminBookings"
import { AdminSettings } from "./pages/admin/AdminSettings"
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute"
import { AdminThemeApplier } from "./components/auth/AdminThemeApplier"
import { AdminLayout } from "./pages/admin/AdminLayout"
import { SignUp } from "./pages/auth/SignUp"

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
            {/* Public + user routes — with top Navbar */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/property-details/:id" element={<PropertyDetails />} />
              <Route path="/map" element={<Map />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin routes — sidebar layout, no top Navbar */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/:id" element={<AdminPropertyDetail />} />
              {/* <Route path="bookings" element={<AdminBookings />} /> */}
              <Route path="settings" element={<AdminSettings />} />
            </Route>

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

import { Outlet, NavLink } from "react-router-dom"

const navItems = [
  { name: "Properties", to: "/dashboard/properties" },
  { name: "Inquiries", to: "/dashboard/inquiries" },
  { name: "Schedule", to: "/dashboard/schedule" },
]

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-8 text-2xl font-bold text-blue-600">PopTrack</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  end={item.to === "/dashboard"}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 text-xs text-gray-400">© 2024 PopTrack</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center gap-4">
            {/* Placeholder for user info, notifications, etc. */}
            <span className="text-gray-500">Welcome, User</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

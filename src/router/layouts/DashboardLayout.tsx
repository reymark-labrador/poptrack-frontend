import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4">Sidebar</aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout

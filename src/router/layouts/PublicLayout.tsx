import { Outlet } from "react-router-dom"

const PublicLayout = () => {
  return (
    <div>
      <header className="p-4 border-b text-2xl font-bold">PopTrack</header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout

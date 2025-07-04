import { useRoutes } from "react-router-dom"
import { Suspense } from "react"
import { routes } from "./routes"

const AppRoutes = () => {
  const element = useRoutes(routes)
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
}

export default AppRoutes

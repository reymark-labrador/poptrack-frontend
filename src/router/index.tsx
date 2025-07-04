import { useRoutes } from "react-router-dom"
import { Suspense } from "react"
import { routes } from "./routes"
import Loading from "../components/Loading"

const AppRoutes = () => {
  const element = useRoutes(routes)
  return <Suspense fallback={<Loading />}>{element}</Suspense>
}

export default AppRoutes

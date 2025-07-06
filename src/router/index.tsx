import { useRoutes } from "react-router-dom"
import { Suspense } from "react"
import { routes } from "./routes"
import Loading from "../components/Loading"

const AppRoutes = () => {
  const element = useRoutes(routes)
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <Loading />
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export default AppRoutes

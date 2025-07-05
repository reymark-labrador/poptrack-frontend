import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import { propertiesRoutes } from "../features/properties/routes"

const NotFound = lazy(() => import("../pages/NotFound"))
const PropertyListPage = lazy(
  () => import("../features/dashboard/pages/PropertyListPage")
)

export const routes: RouteObject[] = [
  ...propertiesRoutes,
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "properties", element: <PropertyListPage /> },
      // Add dashboard routes here
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]

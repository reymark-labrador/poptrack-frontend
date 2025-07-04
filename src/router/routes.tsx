import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import { propertiesRoutes } from "../features/properties/routes"

const NotFound = lazy(() => import("../pages/NotFound"))

export const routes: RouteObject[] = [
  ...propertiesRoutes,
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      // Add dashboard routes here
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]

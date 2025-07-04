import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import PublicLayout from "../../router/layouts/PublicLayout"

const PropertiesPage = lazy(() => import("./pages/PropertiesPage"))

export const propertiesRoutes: RouteObject[] = [
  {
    path: "properties",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <PropertiesPage />,
      },
      // Optional nested routes here, e.g. property detail
      // { path: ':propertyId', element: <PropertyDetailPage /> },
    ],
  },
]

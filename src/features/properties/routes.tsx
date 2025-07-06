import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import PublicLayout from "../../router/layouts/PublicLayout"

const PropertiesPage = lazy(() => import("./pages/PropertiesPage"))
const PropertyDetailsPage = lazy(() => import("./pages/PropertyDetailsPage"))

export const propertiesRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <PropertiesPage />,
      },
      {
        path: "property/:propertyId",
        element: <PropertyDetailsPage />,
      },
      // Optional nested routes here, e.g. property detail
      // { path: ':propertyId', element: <PropertyDetailPage /> },
    ],
  },
]

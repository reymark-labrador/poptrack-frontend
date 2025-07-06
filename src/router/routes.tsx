import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import { propertiesRoutes } from "../features/properties/routes"

const NotFound = lazy(() => import("../pages/NotFound"))
const PropertyListPage = lazy(
  () => import("../features/dashboard/pages/PropertyListPage")
)
const CreatePropertyPage = lazy(
  () => import("../features/dashboard/pages/CreatePropertyPage")
)
const EditPropertyPage = lazy(
  () => import("../features/dashboard/pages/EditPropertyPage")
)
const InquiriesPage = lazy(
  () => import("../features/dashboard/pages/InquiriesPage")
)
const ScheduleViewingPage = lazy(
  () => import("../features/dashboard/pages/ViewingPage")
)

export const routes: RouteObject[] = [
  ...propertiesRoutes,
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "properties", element: <PropertyListPage /> },
      { path: "properties/create", element: <CreatePropertyPage /> },
      { path: "properties/:id/edit", element: <EditPropertyPage /> },
      { path: "inquiries", element: <InquiriesPage /> },
      { path: "schedule", element: <ScheduleViewingPage /> },
      // Add dashboard routes here
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]

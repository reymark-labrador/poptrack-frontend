import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardProperties } from "@/hooks/useDashboardProperties"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import DeletePropertyModal from "../components/DeletePropertyModal"
import ArchivePropertyModal from "../components/ArchivePropertyModal"
import type { IProperty } from "@/types/property"
import { PropertyFilters } from "../components/PropertyFilters"
import { PropertyPagination } from "@/components/PropertyPagination"
import { usePropertyUIStore } from "@/stores/usePropertyUIStore"
import { useURLParams } from "@/utils/urlParams"

const PropertyListPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardProperties()
  const page = usePropertyUIStore((state) => state.page)
  const setPage = usePropertyUIStore((state) => state.setPage)
  const showArchived = usePropertyUIStore((state) => state.filters.showArchived)
  const setShowArchived = usePropertyUIStore((state) => state.setShowArchived)
  const { updateURLParams, getURLParam } = useURLParams()

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    property: IProperty | null
  }>({
    isOpen: false,
    property: null,
  })

  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean
    property: IProperty | null
  }>({
    isOpen: false,
    property: null,
  })

  const properties = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  useEffect(() => {
    const urlPage = getURLParam("page")
    const urlArchived = getURLParam("archived")

    if (urlPage) {
      const pageNumber = parseInt(urlPage, 10)
      if (pageNumber !== page && pageNumber > 0) {
        setPage(pageNumber)
      }
    }

    if (urlArchived === "true" && !showArchived) {
      setShowArchived(true)
    } else if (urlArchived !== "true" && showArchived) {
      setShowArchived(false)
    }
  }, [getURLParam, setPage, page, showArchived, setShowArchived])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURLParams({ page: newPage })
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {showArchived && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-amber-600">📁</span>
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Viewing Archived Properties
              </h3>
              <p className="text-sm text-amber-700">
                These properties are hidden from public view but remain in your
                records.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Properties</h1>
          {showArchived && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
              📁 Archived Properties
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => {
              const newArchivedState = !showArchived
              setShowArchived(newArchivedState)
              updateURLParams({
                archived: newArchivedState ? "true" : null,
                page: 1, // Reset to first page when switching views
              })
            }}
          >
            {showArchived ? "Hide Archived" : "Show Archived"}
          </Button>
          <Link to="/dashboard/properties/create">
            <Button>Create Property</Button>
          </Link>
        </div>
      </div>

      <PropertyFilters />

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          <p>Error loading properties. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-lg shadow border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead>Area (sq ft)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length ? (
                properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <Link
                        to={`/property/${property._id}`}
                        className="hover:underline text-blue-600"
                      >
                        {property.title}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">
                      {property.type}
                    </TableCell>
                    <TableCell>
                      {property.location.address
                        ? `${property.location.address}, `
                        : ""}
                      {property.location.city}
                    </TableCell>
                    <TableCell className="text-green-700 font-semibold">
                      ${property.price.toLocaleString()}
                    </TableCell>
                    <TableCell>{property.bedrooms ?? "-"}</TableCell>
                    <TableCell>{property.bathrooms ?? "-"}</TableCell>
                    <TableCell>
                      {property.area?.toLocaleString() ?? "-"}
                    </TableCell>
                    <TableCell>
                      {property.isArchived ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Archived
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* <Link to={`/property/${property._id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link> */}
                        <Link to={`/dashboard/properties/${property._id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setArchiveModal({ isOpen: true, property })
                          }
                        >
                          {showArchived ? "Restore" : "Archive"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setDeleteModal({ isOpen: true, property })
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-12"
                  >
                    No properties found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <PropertyPagination
          page={page}
          pageCount={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <DeletePropertyModal
        property={deleteModal.property}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, property: null })}
        onDelete={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-properties"] })
        }}
      />

      <ArchivePropertyModal
        property={archiveModal.property}
        isOpen={archiveModal.isOpen}
        onClose={() => setArchiveModal({ isOpen: false, property: null })}
        onArchive={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-properties"] })
        }}
        isArchivedView={showArchived}
      />
    </div>
  )
}

export default PropertyListPage

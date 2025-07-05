import { useFilteredProperties } from "@/hooks/useFilteredProperties"
import { usePropertyUIStore } from "@/stores/usePropertyUIStore"

import { PropertyPagination } from "@/components/PropertyPagination"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { filtersToUrlParams } from "@/utils/filterUrlSync"
import { PropertyFilters } from "../components/PropertyFilters"

const PropertyListPage = () => {
  const { data, isLoading, error } = useFilteredProperties()
  const page = usePropertyUIStore((state) => state.page)
  const setPage = usePropertyUIStore((state) => state.setPage)
  const filters = usePropertyUIStore((state) => state.filters)
  const properties = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1
  const [, setSearchParams] = useSearchParams()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Update URL params with new page
    const params = filtersToUrlParams(filters, newPage)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Properties</h1>
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
                      <div className="flex gap-2">
                        <Link to={`/property/${property._id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        {/* Future: <Button size="sm" variant="secondary">Edit</Button> <Button size="sm" variant="destructive">Delete</Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
    </div>
  )
}

export default PropertyListPage

import { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card"
import { TablePagination } from "@/components/TablePagination"
import { PropertyFilters } from "@/components/PropertyFilters"
import InquiryButton from "@/components/InquiryButton"
import { useURLParams } from "@/utils/urlParams"

import { useFilteredProperties } from "../../../hooks/useFilteredProperties"
import { usePropertyUIStore } from "../../../stores/usePropertyUIStore"

const IMAGE_PLACEHOLDER =
  "https://placehold.co/600x400?text=No+Photo&font=roboto"

const PropertiesPage = () => {
  const { data, isLoading, error } = useFilteredProperties()
  const page = usePropertyUIStore((state) => state.page)
  const setPage = usePropertyUIStore((state) => state.setPage)
  const { updateURLParams, getURLParam } = useURLParams()

  const properties = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  useEffect(() => {
    const urlPage = getURLParam("page")
    if (urlPage) {
      const pageNumber = parseInt(urlPage, 10)
      if (pageNumber !== page && pageNumber > 0) {
        setPage(pageNumber)
      }
    }
  }, [getURLParam, setPage, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURLParams({ page: newPage })
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Find Your Next Property</h1>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.length ? (
            properties?.map((property, index) => (
              <Card
                key={index}
                className="flex flex-col h-full transition-all duration-200 hover:shadow-lg"
              >
                <Link to={`/property/${property._id}`} className="flex-1">
                  <img
                    src={IMAGE_PLACEHOLDER}
                    alt={property.title}
                    className="rounded-t-xl w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <CardHeader>
                    <CardTitle>{property.title}</CardTitle>
                    <CardDescription>
                      ${property.price.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {property.location.city}
                    </p>
                    <p className="text-sm">{property.description}</p>
                  </CardContent>
                </Link>
                <CardFooter className="flex gap-2">
                  <Link
                    to={`/property/${property._id}`}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center"
                  >
                    View Details
                  </Link>
                  <InquiryButton
                    propertyTitle={property.title}
                    propertyId={property._id}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    Inquiry
                  </InquiryButton>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No properties found.
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <TablePagination
          page={page}
          pageCount={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default PropertiesPage

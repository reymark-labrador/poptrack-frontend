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
import PropertyImageCarousel from "@/components/PropertyImageCarousel"
import { useURLParams } from "@/utils/urlParams"

import { useFilteredProperties } from "../../../hooks/useFilteredProperties"
import { usePropertyUIStore } from "../../../stores/usePropertyUIStore"

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
        <div className="space-y-6">
          {properties?.length ? (
            properties?.map((property, index) => (
              <Link
                key={index}
                to={`/property/${property._id}`}
                className="block transition-all duration-200 hover:shadow-lg"
              >
                <Card className="h-full">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                      <PropertyImageCarousel
                        images={property.images}
                        title={property.title}
                        className="w-full h-48 md:h-full"
                      />
                    </div>

                    {/* Details Section */}
                    <div className="md:w-2/3 flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {property.title}
                            </CardTitle>
                            <CardDescription className="text-base font-semibold text-primary">
                              ${property.price.toLocaleString()}
                            </CardDescription>
                          </div>
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md capitalize">
                            {property.type}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="space-y-3">
                          {/* Location */}
                          <p className="text-sm text-gray-600">
                            📍 {property.location.city}
                          </p>

                          {/* Description */}
                          <p className="text-sm text-gray-700 line-clamp-1">
                            {property.description}
                          </p>

                          {/* Property Details */}
                          <div className="flex gap-4 text-sm text-gray-600">
                            {property.bedrooms && (
                              <span className="flex items-center gap-1">
                                <span>🛏️</span>
                                <span>
                                  {property.bedrooms} bed
                                  {property.bedrooms !== 1 ? "s" : ""}
                                </span>
                              </span>
                            )}
                            {property.bathrooms && (
                              <span className="flex items-center gap-1">
                                <span>🚿</span>
                                <span>
                                  {property.bathrooms} bath
                                  {property.bathrooms !== 1 ? "s" : ""}
                                </span>
                              </span>
                            )}
                            {property.area && (
                              <span className="flex items-center gap-1">
                                <span>📐</span>
                                <span>{property.area} sq ft</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <InquiryButton
                          propertyTitle={property.title}
                          propertyId={property._id}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          Inquiry
                        </InquiryButton>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
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

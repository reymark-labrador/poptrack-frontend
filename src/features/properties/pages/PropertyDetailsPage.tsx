import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PropertyGallery } from "@/components/PropertyGallery"
import PropertyMap from "@/components/PropertyMap"
import InquiryModal, { type InquiryFormData } from "@/components/InquiryModal"
import { useProperty } from "../../../hooks/useFilteredProperties"
import { createLead } from "../api"
import { useState } from "react"
import Loading from "@/components/Loading"

const PropertyDetailsPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>()
  const { data: property, isLoading, error } = useProperty(propertyId!)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)

  const handleSubmitInquiry = async (data: InquiryFormData) => {
    try {
      if (!propertyId) {
        console.error("Property ID is required")
        return
      }

      const payload = {
        ...data,
        property: propertyId,
      }

      await createLead(payload)
      console.log("Inquiry submitted successfully")
      // You can add a success notification here if needed
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
      // You can add an error notification here if needed
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-8">
          <Loading label="Loading property details..." />
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-8 text-red-600">
          <p>Error loading property details. Please try again.</p>
          <Link
            to="/"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Link>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>
                {property.location.address && `${property.location.address}, `}
                {property.location.city}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="capitalize bg-primary/10 text-primary px-2 py-1 rounded">
                For {property.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              ${property.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {property.type === "rent" ? "per month" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      {/* Map */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property.location.latitude && property.location.longitude ? (
              <PropertyMap
                latitude={property.location.latitude}
                longitude={property.location.longitude}
                title={property.title}
                address={property.location.address}
                city={property.location.city}
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Location Information
                </h3>
                <p className="text-gray-600 mb-4">
                  {property.location.address &&
                    `${property.location.address}, `}
                  {property.location.city}
                </p>
                <p className="text-sm text-gray-500">
                  Map coordinates not available for this property
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Property Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {property.bedrooms} Bedroom
                      {property.bedrooms > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {property.bathrooms} Bathroom
                      {property.bathrooms > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {property.area.toLocaleString()} sq ft
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="capitalize">
                        {amenity.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Submit an Inquiry
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get in touch with us about this property
                </p>
                <Button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full"
                >
                  Submit Inquiry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Property Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-primary">
                  ${property.price.toLocaleString()}
                </span>
              </div>
              {property.bedrooms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">
                    {property.area.toLocaleString()} sq ft
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-right">
                  {property.location.city}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        propertyTitle={property.title}
        onSubmit={handleSubmitInquiry}
      />
    </div>
  )
}

export default PropertyDetailsPage

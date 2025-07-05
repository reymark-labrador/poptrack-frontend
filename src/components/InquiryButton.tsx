import { useState } from "react"
import { Button } from "@/components/ui/Button"
import InquiryModal, { type InquiryFormData } from "@/components/InquiryModal"
import { createLead } from "@/features/properties/api"

interface InquiryButtonProps {
  propertyTitle: string
  propertyId: string
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
  onSubmit?: (data: InquiryFormData) => void
}

const InquiryButton = ({
  propertyTitle,
  propertyId,
  variant = "default",
  size = "default",
  className = "",
  children = "Submit Inquiry",
  onSubmit,
}: InquiryButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = async (data: InquiryFormData) => {
    try {
      if (onSubmit) {
        onSubmit(data)
      } else {
        // Default behavior - call createLead API
        const payload = {
          ...data,
          property: propertyId,
        }
        await createLead(payload)
        console.log("Inquiry submitted successfully")
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </Button>

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyTitle={propertyTitle}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default InquiryButton

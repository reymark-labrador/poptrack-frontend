import { useState } from "react"
import { Mail, Phone, User, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  propertyTitle?: string
  onSubmit?: (data: InquiryFormData) => void
}

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  message: string
}

const InquiryModal = ({
  isOpen,
  onClose,
  propertyTitle,
  onSubmit,
}: InquiryModalProps) => {
  const [inquiryForm, setInquiryForm] = useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setInquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(inquiryForm)
        // Add 2 second delay before showing success screen
        // Keep loading state active during delay
        setTimeout(() => {
          setIsSubmitted(true)
          setIsSubmitting(false)
        }, 2000)
      } catch (error) {
        // Handle error if needed
        console.error("Error submitting inquiry:", error)
        setIsSubmitting(false)
      }
    }
  }

  const handleClose = () => {
    // Only allow closing if not currently submitting
    if (!isSubmitting) {
      // Reset form and submitted state when closing
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      setIsSubmitted(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && handleClose()}>
      <DialogContent
        className="max-w-md"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Submit an Inquiry</DialogTitle>
        </DialogHeader>

        {propertyTitle && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Property:</p>
            <p className="font-medium text-gray-900">{propertyTitle}</p>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inquiry Submitted Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest. We'll get back to you soon.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={inquiryForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={inquiryForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={inquiryForm.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your interest in this property..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </form>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            </DialogFooter>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to be contacted regarding
                this property inquiry.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default InquiryModal

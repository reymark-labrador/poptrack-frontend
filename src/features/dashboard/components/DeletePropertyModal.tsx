import { useState } from "react"
import { Button } from "@/components/ui/Button"
import type { IProperty } from "@/types/property"
import { deleteProperty } from "../apis/propertyApi"

interface DeletePropertyModalProps {
  property: IProperty | null
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
}

const DeletePropertyModal = ({
  property,
  isOpen,
  onClose,
  onDelete,
}: DeletePropertyModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !property) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProperty(property._id)
      onDelete()
      onClose()
    } catch (error) {
      console.error("Error deleting property:", error)
      // You could add error handling here (e.g., toast notification)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Delete Property</h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>"{property.title}"</strong>?
          This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeletePropertyModal

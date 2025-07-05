import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { archiveProperty, unarchiveProperty } from "../api"
import type { IProperty } from "@/types/property"

interface ArchivePropertyModalProps {
  property: IProperty | null
  isOpen: boolean
  onClose: () => void
  onArchive: () => void
  isArchivedView?: boolean
}

const ArchivePropertyModal = ({
  property,
  isOpen,
  onClose,
  onArchive,
  isArchivedView = false,
}: ArchivePropertyModalProps) => {
  const [isArchiving, setIsArchiving] = useState(false)

  if (!isOpen || !property) return null

  const handleArchive = async () => {
    setIsArchiving(true)
    try {
      if (isArchivedView) {
        await unarchiveProperty(property._id)
      } else {
        await archiveProperty(property._id)
      }
      onArchive()
      onClose()
    } catch (error) {
      console.error(
        `Error ${isArchivedView ? "unarchiving" : "archiving"} property:`,
        error
      )
      // You could add error handling here (e.g., toast notification)
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {isArchivedView ? "Restore Property" : "Archive Property"}
        </h2>

        <p className="text-gray-600 mb-6">
          {isArchivedView ? (
            <>
              Are you sure you want to restore{" "}
              <strong>"{property.title}"</strong>? This will make the property
              visible to the public again.
            </>
          ) : (
            <>
              Are you sure you want to archive{" "}
              <strong>"{property.title}"</strong>? This will hide the property
              from public view but keep it in your records.
            </>
          )}
        </p>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isArchiving}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleArchive}
            disabled={isArchiving}
          >
            {isArchiving
              ? isArchivedView
                ? "Restoring..."
                : "Archiving..."
              : isArchivedView
              ? "Restore"
              : "Archive"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ArchivePropertyModal

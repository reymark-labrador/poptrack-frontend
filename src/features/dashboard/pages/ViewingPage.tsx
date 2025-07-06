import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useViewings } from "@/hooks/useViewings"
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
import { useURLParams } from "@/utils/urlParams"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

import { Calendar, MapPin, User, Mail } from "lucide-react"
import { updateViewingStatus } from "../api"
import { useViewingUIStore } from "@/stores/useViewingUIStore"
import type { IViewing } from "@/types/viewing"

const ScheduleViewingPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useViewings()
  const page = useViewingUIStore((state) => state.page)
  const setPage = useViewingUIStore((state) => state.setPage)
  const status = useViewingUIStore((state) => state.filters.status)
  const setStatus = useViewingUIStore((state) => state.setStatus)
  const date = useViewingUIStore((state) => state.filters.date)
  const setDate = useViewingUIStore((state) => state.setDate)
  const { updateURLParams, getURLParam } = useURLParams()

  const [selectedViewing, setSelectedViewing] = useState<IViewing | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // New state for edit modal
  const [editModal, setEditModal] = useState<{
    open: boolean
    viewing: IViewing | null
  }>({ open: false, viewing: null })
  const [editStatus, setEditStatus] = useState<string>("")
  const [editNote, setEditNote] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  const viewings = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  useEffect(() => {
    const urlPage = getURLParam("page")
    const urlStatus = getURLParam("status")
    const urlDate = getURLParam("date")

    if (urlPage) {
      const pageNumber = parseInt(urlPage, 10)
      if (pageNumber !== page && pageNumber > 0) {
        setPage(pageNumber)
      }
    }

    if (urlStatus && urlStatus !== status) {
      setStatus(
        urlStatus as "scheduled" | "completed" | "no-show" | "cancelled" | "all"
      )
    }

    if (urlDate && urlDate !== date) {
      setDate(urlDate)
    }
  }, [getURLParam, setPage, page, status, setStatus, date, setDate])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURLParams({ page: newPage })
  }

  const handleStatusFilterChange = (newStatus: string) => {
    setStatus(
      newStatus as "scheduled" | "completed" | "no-show" | "cancelled" | "all"
    )
    updateURLParams({ status: newStatus, page: 1 })
  }

  const handleDateFilterChange = (newDate: Date | undefined) => {
    const dateString = newDate ? newDate.toISOString().split("T")[0] : null
    setDate(dateString || undefined)
    updateURLParams({ date: dateString, page: 1 })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-yellow-100 text-yellow-800",
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const handleViewDetails = (viewing: IViewing) => {
    setSelectedViewing(viewing)
    setIsDetailModalOpen(true)
  }

  const handleEditViewing = (viewing: IViewing) => {
    setEditModal({ open: true, viewing })
    setEditStatus(viewing.status)
    setEditNote(viewing.notes || "")
  }

  const handleUpdateViewing = async () => {
    if (!editModal.viewing) return

    setIsUpdating(true)
    try {
      await updateViewingStatus(
        editModal.viewing._id,
        editStatus as "scheduled" | "completed" | "no-show" | "cancelled",
        editNote
      )

      // Invalidate and refetch viewings
      queryClient.invalidateQueries({ queryKey: ["viewings"] })

      // Close modal and reset state
      setEditModal({ open: false, viewing: null })
      setEditStatus("")
      setEditNote("")
    } catch (err) {
      console.error("Error updating viewing:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Helper function to get scheduled date/time for display
  const getScheduledDateTime = (viewing: IViewing) => {
    // Combine date and time from IViewing
    if (viewing.date && viewing.time) {
      return `${viewing.date}T${viewing.time}:00.000Z`
    }
    return viewing.createdAt
  }

  // Helper function to get notes
  const getNotes = (viewing: IViewing) => {
    return viewing.notes || ""
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Scheduled Viewings</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
            {viewings.length} Total
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Add Viewing</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={status} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date:</span>
            <DatePicker
              date={date ? new Date(date) : undefined}
              onDateChange={handleDateFilterChange}
              placeholder="Filter by date"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading viewings...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          <p>Error loading viewings. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-lg shadow border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewings.length ? (
                viewings.map((viewing) => (
                  <TableRow key={viewing._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{viewing.client.name}</div>
                        <div className="text-sm text-gray-600">
                          {viewing.client.email || "No email provided"}
                          <br />
                          {viewing.client.phone || "No phone # provided"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {viewing.property && (
                        <div>
                          <div className="font-medium"></div>
                          <div className="text-sm text-gray-600">
                            <Link
                              to={`/property/${viewing.property._id}`}
                              className="hover:underline text-blue-600"
                            >
                              {viewing.property.title || ""}
                            </Link>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatDate(getScheduledDateTime(viewing))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(
                            getScheduledDateTime(viewing)
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(viewing.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(viewing)}
                        >
                          View Details
                        </Button> */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditViewing(viewing)}
                        >
                          Update Status
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No scheduled viewings
                      </p>
                      <p className="text-sm">
                        When you schedule property viewings, they'll appear
                        here.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Viewing Details</DialogTitle>
          </DialogHeader>
          {selectedViewing && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Property</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Property {selectedViewing.property.title}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Scheduled Date</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDateTime(getScheduledDateTime(selectedViewing))}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Client Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>Client {selectedViewing.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>No email provided</span>
                  </div>
                </div>
              </div>

              {getNotes(selectedViewing) && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-gray-600">{getNotes(selectedViewing)}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                {getStatusBadge(selectedViewing.status)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailModalOpen(false)
                handleEditViewing(selectedViewing!)
              }}
            >
              Edit Viewing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editModal.open}
        onOpenChange={(open) => setEditModal((s) => ({ ...s, open }))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Viewing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Internal Note
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add internal notes about this viewing..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setEditModal({ open: false, viewing: null })}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateViewing} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Viewing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScheduleViewingPage

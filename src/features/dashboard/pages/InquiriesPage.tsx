import { useEffect, useState } from "react"
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
import { useInquiries } from "@/hooks/useInquiries"
import type { ILead } from "@/types/lead"
import { DatePicker } from "@/components/ui/date-picker"
import { formatDate, truncateMessage } from "@/utils/formatters"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { scheduleInquery } from "@/features/dashboard/api"

const InquiriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { updateURLParams, getURLParam } = useURLParams()
  const [scheduleModal, setScheduleModal] = useState<{
    open: boolean
    inquiryId: string | null
  }>({ open: false, inquiryId: null })
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [isScheduling, setIsScheduling] = useState(false)

  const { data, isLoading, error } = useInquiries({
    page: currentPage,
    limit: 10,
  })

  const inquiries = data?.data ?? []
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  useEffect(() => {
    const urlPage = getURLParam("page")
    if (urlPage) {
      const pageNumber = parseInt(urlPage, 10)
      if (pageNumber !== currentPage && pageNumber > 0) {
        setCurrentPage(pageNumber)
      }
    }
  }, [getURLParam, currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateURLParams({ page: newPage })
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Inquiries</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
            {inquiries.length} Total
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading inquiries...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">
          <p>Error loading inquiries. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-lg shadow border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length ? (
                inquiries.map((inquiry: ILead) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            {inquiry.email}
                          </div>
                          {inquiry.phone && (
                            <div className="text-sm text-gray-600">
                              {inquiry.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/property/${inquiry.property._id}`}
                        className="hover:underline text-blue-600"
                      >
                        {inquiry.property.title || "Property"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inquiry.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : inquiry.status === "contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : inquiry.status === "converted"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inquiry.status.charAt(0).toUpperCase() +
                          inquiry.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {inquiry.message
                          ? truncateMessage(inquiry.message)
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(inquiry.submittedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {inquiry.status === "new" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setScheduleModal({
                                open: true,
                                inquiryId: inquiry._id,
                              })
                            }
                          >
                            Schedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No inquiries yet</p>
                      <p className="text-sm">
                        When visitors inquire about your properties, they'll
                        appear here.
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={scheduleModal.open}
        onOpenChange={(open) => setScheduleModal((s) => ({ ...s, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Inquiry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DatePicker date={scheduledDate} onDateChange={setScheduledDate} />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setScheduleModal({ open: false, inquiryId: null })}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!scheduleModal.inquiryId || !scheduledDate) return
                setIsScheduling(true)
                try {
                  await scheduleInquery(scheduleModal.inquiryId, scheduledDate!)
                  setScheduleModal({ open: false, inquiryId: null })
                  setScheduledDate(undefined)
                } finally {
                  setIsScheduling(false)
                }
              }}
              disabled={!scheduledDate || isScheduling}
            >
              {isScheduling ? "Scheduling..." : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InquiriesPage

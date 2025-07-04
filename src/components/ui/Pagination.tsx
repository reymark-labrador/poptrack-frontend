import * as React from "react"
import { Button } from "@/components/ui/Button"

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <span className="px-2 text-sm">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
      >
        Next
      </Button>
    </div>
  )
}

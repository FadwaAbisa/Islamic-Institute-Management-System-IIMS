"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GradesTablePaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalStudents: number
    studentsPerPage: number
}

export function GradesTablePagination({
    currentPage,
    totalPages,
    onPageChange,
    totalStudents,
    studentsPerPage
}: GradesTablePaginationProps) {
    const startIndex = (currentPage - 1) * studentsPerPage + 1
    const endIndex = Math.min(currentPage * studentsPerPage, totalStudents)

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex items-center justify-between px-3 py-4">
            <div className="text-sm text-gray-700">
                عرض {startIndex} إلى {endIndex} من {totalStudents} طالب
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                </Button>

                {getPageNumbers().map((page, index) => (
                    <Button
                        key={index}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={page === '...' ? 'cursor-default' : ''}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

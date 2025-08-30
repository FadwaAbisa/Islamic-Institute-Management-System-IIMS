"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ExportGradesButtonProps {
    filters: {
        subject: string
        academicYear: string
        evaluationPeriod: string
        educationLevel: string
        studySystem: string
    }
}

export function ExportGradesButton({ filters }: ExportGradesButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        if (!filters.subject || !filters.academicYear || !filters.evaluationPeriod) {
            toast({
                title: "خطأ",
                description: "يرجى اختيار المادة والعام الدراسي وفترة التقييم أولاً",
                variant: "destructive",
            })
            return
        }

        setIsExporting(true)

        try {
            const response = await fetch("/api/export-grades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: filters.subject,
                    academicYear: filters.academicYear,
                    period: filters.evaluationPeriod,
                    educationLevel: filters.educationLevel,
                    studySystem: filters.studySystem,
                }),
            })

            if (!response.ok) {
                throw new Error("فشل في تصدير البيانات")
            }

            const data = await response.json()

            // تحويل البيانات إلى CSV
            const csvContent = convertToCSV(data.data)

            // تحميل الملف
            downloadCSV(csvContent, `درجات_${filters.subject}_${filters.academicYear}_${filters.evaluationPeriod}.csv`)

            toast({
                title: "تم التصدير بنجاح",
                description: `تم تصدير درجات ${data.totalStudents} طالب`,
            })

        } catch (error) {
            console.error("Export error:", error)
            toast({
                title: "خطأ في التصدير",
                description: "حدث خطأ أثناء تصدير البيانات",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const convertToCSV = (data: any[]): string => {
        if (data.length === 0) return ""

        const headers = Object.keys(data[0])
        const csvRows = [
            headers.join(","), // رأس الجدول
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header]
                    // إذا كان القيمة تحتوي على فاصلة، نضعها بين علامتي اقتباس
                    if (typeof value === "string" && value.includes(",")) {
                        return `"${value}"`
                    }
                    return value
                }).join(",")
            )
        ]

        return csvRows.join("\n")
    }

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute("href", url)
            link.setAttribute("download", filename)
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting || !filters.subject || !filters.academicYear || !filters.evaluationPeriod}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            {isExporting ? (
                <>
                    <FileSpreadsheet className="w-4 h-4 mr-2 animate-spin" />
                    جاري التصدير...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4 mr-2" />
                    تصدير الدرجات
                </>
            )}
        </Button>
    )
}

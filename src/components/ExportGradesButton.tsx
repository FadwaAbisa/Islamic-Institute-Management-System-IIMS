"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet } from "lucide-react"
import Toast from "@/components/ui/toast"


interface ExportGradesButtonProps {
    filters: {
        subject: string | { id: number; name: string }
        academicYear: string
        evaluationPeriod: string
        educationLevel: string
        studySystem: string
    }
}

export function ExportGradesButton({ filters }: ExportGradesButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

    // استخراج اسم المادة سواء كان نصاً أو كائناً
    const getSubjectName = () => {
        if (typeof filters.subject === 'object' && filters.subject !== null) {
            return filters.subject.name
        }
        return filters.subject
    }

    const handleExport = async () => {
        const subjectName = getSubjectName()

        if (!subjectName || !filters.academicYear || !filters.evaluationPeriod) {
            setToast({
                message: "يرجى اختيار المادة والعام الدراسي وفترة التقييم أولاً",
                type: "error"
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
                    subject: subjectName,
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
            downloadCSV(csvContent, `درجات_${subjectName}_${filters.academicYear}_${filters.evaluationPeriod}.csv`)

            setToast({
                message: `تم تصدير درجات ${data.totalStudents} طالب`,
                type: "success"
            })

        } catch (error) {
            console.error("Export error:", error)
            setToast({
                message: "حدث خطأ أثناء تصدير البيانات",
                type: "error"
            })
        } finally {
            setIsExporting(false)
        }
    }

    const convertToCSV = (data: any[]) => {
        if (!data || data.length === 0) return ""

        const headers = Object.keys(data[0])
        const csvRows = [headers.join(",")]

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header]
                return `"${value || ""}"`
            })
            csvRows.push(values.join(","))
        }

        return csvRows.join("\n")
    }

    const downloadCSV = (csvContent: string, filename: string) => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", filename)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const subjectName = getSubjectName()

    return (
        <>
            <Button
                onClick={handleExport}
                disabled={isExporting || !subjectName || !filters.academicYear || !filters.evaluationPeriod}
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

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}

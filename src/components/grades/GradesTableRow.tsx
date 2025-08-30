"use client"

import type { Student } from "../../types/student"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { calculateAverage, getSubjectGradeConfig } from "@/lib/grade-constants"

interface GradesTableRowProps {
    student: Student
    visibleColumns: Record<string, boolean>
    updateStudentGrade: (studentId: string, field: keyof Student, value: any) => void
    getGradeColor: (grade: number | null) => string
    getGradeBgColor: (grade: number | null) => string
    isThirdPeriod: boolean
}

export function GradesTableRow({
    student,
    visibleColumns,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    isThirdPeriod
}: GradesTableRowProps) {
    const handleGradeChange = (field: keyof Student, value: string) => {
        const numValue = value === "" ? null : Math.min(100, Math.max(0, Number.parseFloat(value) || 0))
        updateStudentGrade(student.id, field, numValue)
    }

    const getStatusBadge = (student: Student) => {
        const config = getSubjectGradeConfig()
        const total = student.periodTotal || 0

        if (total >= config.excellent) return <Badge className="bg-green-100 text-green-800">ممتاز</Badge>
        if (total >= config.veryGood) return <Badge className="bg-blue-100 text-blue-800">جيد جداً</Badge>
        if (total >= config.good) return <Badge className="bg-yellow-100 text-yellow-800">جيد</Badge>
        if (total >= config.pass) return <Badge className="bg-orange-100 text-orange-800">مقبول</Badge>
        return <Badge className="bg-red-100 text-red-800">راسب</Badge>
    }

    return (
        <tr className="border-b hover:bg-gray-50">
            {visibleColumns.studentNumber && (
                <td className="px-3 py-2 text-center">{student.studentNumber}</td>
            )}

            {visibleColumns.studentName && (
                <td className="px-3 py-2 text-right font-medium">{student.studentName}</td>
            )}

            {visibleColumns.academicYear && (
                <td className="px-3 py-2 text-center">{student.academicYear}</td>
            )}

            {visibleColumns.studyLevel && (
                <td className="px-3 py-2 text-center">{student.studyLevel}</td>
            )}

            {visibleColumns.studyMode && (
                <td className="px-3 py-2 text-center">{student.studyMode}</td>
            )}

            {visibleColumns.specialization && (
                <td className="px-3 py-2 text-center">{student.specialization}</td>
            )}

            {visibleColumns.firstMonth && (
                <td className="px-3 py-2 text-center">
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.firstMonthGrade || ""}
                        onChange={(e) => handleGradeChange("firstMonthGrade", e.target.value)}
                        className={`w-16 text-center ${getGradeBgColor(student.firstMonthGrade)}`}
                    />
                </td>
            )}

            {visibleColumns.secondMonth && (
                <td className="px-3 py-2 text-center">
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.secondMonthGrade || ""}
                        onChange={(e) => handleGradeChange("secondMonthGrade", e.target.value)}
                        className={`w-16 text-center ${getGradeBgColor(student.secondMonthGrade)}`}
                    />
                </td>
            )}

            {visibleColumns.thirdMonth && isThirdPeriod && (
                <td className="px-3 py-2 text-center">
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.thirdMonthGrade || ""}
                        onChange={(e) => handleGradeChange("thirdMonthGrade", e.target.value)}
                        className={`w-16 text-center ${getGradeBgColor(student.thirdMonthGrade)}`}
                    />
                </td>
            )}

            {visibleColumns.average && (
                <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(calculateAverage(student))}`}>
                        {calculateAverage(student).toFixed(1)}
                    </span>
                </td>
            )}

            {visibleColumns.workTotal && (
                <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(student.workTotal)}`}>
                        {student.workTotal || 0}
                    </span>
                </td>
            )}

            {visibleColumns.finalExam && (
                <td className="px-3 py-2 text-center">
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.finalExamGrade || ""}
                        onChange={(e) => handleGradeChange("finalExamGrade", e.target.value)}
                        className={`w-16 text-center ${getGradeBgColor(student.finalExamGrade)}`}
                    />
                </td>
            )}

            {visibleColumns.periodTotal && (
                <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(student.periodTotal)}`}>
                        {student.periodTotal || 0}
                    </span>
                </td>
            )}

            {visibleColumns.status && (
                <td className="px-3 py-2 text-center">
                    {getStatusBadge(student)}
                </td>
            )}

            {visibleColumns.actions && (
                <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </td>
            )}
        </tr>
    )
}

"use client"

import type { Student } from "../../types/student"
import { GradesTableRow } from "./GradesTableRow"

interface GradesTableBodyProps {
    students: Student[]
    visibleColumns: Record<string, boolean>
    updateStudentGrade: (studentId: string, field: keyof Student, value: any) => void
    getGradeColor: (grade: number | null) => string
    getGradeBgColor: (grade: number | null) => string
    isThirdPeriod: boolean
}

export function GradesTableBody({
    students,
    visibleColumns,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    isThirdPeriod
}: GradesTableBodyProps) {
    if (students.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-3 py-8 text-center text-gray-500">
                        لا توجد بيانات طلاب
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody>
            {students.map((student) => (
                <GradesTableRow
                    key={student.id}
                    student={student}
                    visibleColumns={visibleColumns}
                    updateStudentGrade={updateStudentGrade}
                    getGradeColor={getGradeColor}
                    getGradeBgColor={getGradeBgColor}
                    isThirdPeriod={isThirdPeriod}
                />
            ))}
        </tbody>
    )
}

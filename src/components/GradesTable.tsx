"use client"

import type { Student } from "../types/student"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

interface GradesTableProps {
  students: Student[]
  updateStudentGrade: (studentId: string, field: keyof Student, value: any) => void
  getGradeColor: (grade: number | null) => string
  getGradeBgColor: (grade: number | null) => string
  isThirdPeriod: boolean
}

export function GradesTable({
  students,
  updateStudentGrade,
  getGradeColor,
  getGradeBgColor,
  isThirdPeriod,
}: GradesTableProps) {
  const handleGradeChange = (studentId: string, field: keyof Student, value: string) => {
    const numValue = value === "" ? null : Math.min(100, Math.max(0, Number.parseFloat(value) || 0))
    updateStudentGrade(studentId, field, numValue)
  }

  const isValidGrade = (grade: number | null): boolean => {
    return grade === null || (grade >= 0 && grade <= 100)
  }

  return (
    <div className="bg-lamaPurpleLight rounded-lg shadow-sm border border-lamaSkyLight overflow-hidden">
      {/* تنبيه للفترة الثالثة */}
      {isThirdPeriod && (
        <div className="bg-lamaSkyLight border-b border-lamaSky p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
            <p className="text-lamaBlack font-medium">
              <strong>ملاحظة:</strong> في الفترة الثالثة، يتم حساب المجموع كالتالي: مجموع الفترتين السابقتين + امتحان
              الفترة الثالثة
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-lamaSkyLight sticky top-0">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                رقم الطالب
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-lamaBlack border-b border-lamaSky min-w-[200px]">
                اسم الطالب
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                {isThirdPeriod ? "الفترة الأولى" : "الشهر الأول"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                {isThirdPeriod ? "الفترة الثانية" : "الشهر الثاني"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                {isThirdPeriod ? "غير مطلوب" : "الشهر الثالث"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                {isThirdPeriod ? "مجموع الفترتين" : "مجموع الأعمال"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                {isThirdPeriod ? "امتحان الفترة الثالثة" : "الامتحان النهائي"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                مجموع الفترة
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                الحالة
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.studentId} className={index % 2 === 0 ? "bg-lamaPurpleLight" : "bg-lamaPurple"}>
                <td className="px-4 py-3 text-sm text-lamaBlack border-b border-lamaSkyLight">{student.studentId}</td>
                <td className="px-4 py-3 text-sm text-lamaBlack border-b border-lamaSkyLight font-medium">
                  {student.studentName}
                </td>

                {/* درجة الشهر الأول / الفترة الأولى */}
                <td className="px-4 py-3 border-b">
                  <div className={`rounded-md p-1 ${getGradeBgColor(student.firstMonthGrade)}`}>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={student.firstMonthGrade || ""}
                      onChange={(e) => handleGradeChange(student.studentId, "firstMonthGrade", e.target.value)}
                      className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.firstMonthGrade)} ${
                        !isValidGrade(student.firstMonthGrade) ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </td>

                {/* درجة الشهر الثاني / الفترة الثانية */}
                <td className="px-4 py-3 border-b">
                  <div className={`rounded-md p-1 ${getGradeBgColor(student.secondMonthGrade)}`}>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={student.secondMonthGrade || ""}
                      onChange={(e) => handleGradeChange(student.studentId, "secondMonthGrade", e.target.value)}
                      className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.secondMonthGrade)} ${
                        !isValidGrade(student.secondMonthGrade) ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </td>

                {/* درجة الشهر الثالث */}
                <td className="px-4 py-3 border-b">
                  {isThirdPeriod ? (
                    <div className="text-center text-gray-400 text-sm">غير مطلوب</div>
                  ) : (
                    <div className={`rounded-md p-1 ${getGradeBgColor(student.thirdMonthGrade)}`}>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.thirdMonthGrade || ""}
                        onChange={(e) => handleGradeChange(student.studentId, "thirdMonthGrade", e.target.value)}
                        className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.thirdMonthGrade)} ${
                          !isValidGrade(student.thirdMonthGrade) ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="0"
                      />
                    </div>
                  )}
                </td>

                {/* مجموع الأعمال / مجموع الفترتين */}
                <td className="px-4 py-3 text-center border-b">
                  <span className={`font-semibold ${getGradeColor(student.workTotal)}`}>
                    {student.workTotal.toFixed(2)}
                  </span>
                </td>

                {/* درجة الامتحان النهائي / امتحان الفترة الثالثة */}
                <td className="px-4 py-3 border-b">
                  <div className={`rounded-md p-1 ${getGradeBgColor(student.finalExamGrade)}`}>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={student.finalExamGrade || ""}
                      onChange={(e) => handleGradeChange(student.studentId, "finalExamGrade", e.target.value)}
                      className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.finalExamGrade)} ${
                        !isValidGrade(student.finalExamGrade) ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </td>

                {/* مجموع الفترة */}
                <td className="px-4 py-3 text-center border-b">
                  <span className={`font-bold text-lg ${getGradeColor(student.periodTotal)}`}>
                    {student.periodTotal.toFixed(2)}
                  </span>
                </td>

                {/* الحالة */}
                <td className="px-4 py-3 text-center border-b">
                  <Badge variant={student.status === "مكتمل" ? "default" : "secondary"}>{student.status}</Badge>
                </td>

                {/* الإجراءات */}
                <td className="px-4 py-3 text-center border-b">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-transparent border-lamaSky text-lamaYellow hover:bg-lamaSkyLight"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-transparent border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

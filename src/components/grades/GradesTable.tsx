"use client"

import type { Student } from "../../types/student"
import { useState, useEffect } from "react"
import { calculateAverage } from "@/lib/grade-constants"
import { GradesTableHeader } from "./GradesTableHeader"
import { GradesTableBody } from "./GradesTableBody"
import { GradesTablePagination } from "./GradesTablePagination"

interface GradesTableProps {
  students: Student[]
  updateStudentGrade: (studentId: string, field: keyof Student, value: any) => void
  getGradeColor: (grade: number | null) => string
  getGradeBgColor: (grade: number | null) => string
  isThirdPeriod: boolean
  subjectName: string
}

export function GradesTable({
  students,
  updateStudentGrade,
  getGradeColor,
  getGradeBgColor,
  isThirdPeriod,
  subjectName,
}: GradesTableProps) {
  // حالة إظهار/إخفاء الأعمدة مع حفظ في localStorage
  const [visibleColumns, setVisibleColumns] = useState({
    studentNumber: true,
    studentName: true,
    academicYear: true,
    studyLevel: true,
    studyMode: true,
    specialization: true,
    firstMonth: true,
    secondMonth: true,
    thirdMonth: true,
    average: true,
    workTotal: true,
    finalExam: true,
    periodTotal: true,
    status: true,
    actions: true,
  })

  // حالة الترقيم
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 20

  // تحميل حالة الأعمدة من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedColumns = localStorage.getItem('gradesTableVisibleColumns_v4')
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns)
        setVisibleColumns(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error parsing saved columns:', error)
      }
    }
  }, [])

  // حفظ حالة الأعمدة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('gradesTableVisibleColumns_v4', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // حساب الطلاب للصفحة الحالية
  const startIndex = (currentPage - 1) * studentsPerPage
  const endIndex = startIndex + studentsPerPage
  const currentStudents = students.slice(startIndex, endIndex)
  const totalPages = Math.ceil(students.length / studentsPerPage)

  return (
    <div className="bg-white rounded-lg shadow">
      <GradesTableHeader
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        subjectName={subjectName}
        isThirdPeriod={isThirdPeriod}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.studentNumber && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطالب
                </th>
              )}
              {visibleColumns.studentName && (
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم الطالب
                </th>
              )}
              {visibleColumns.academicYear && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العام الدراسي
                </th>
              )}
              {visibleColumns.studyLevel && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المرحلة الدراسية
                </th>
              )}
              {visibleColumns.studyMode && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نظام الدراسة
                </th>
              )}
              {visibleColumns.specialization && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشعبة
                </th>
              )}
              {visibleColumns.firstMonth && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشهر الأول
                </th>
              )}
              {visibleColumns.secondMonth && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشهر الثاني
                </th>
              )}
              {visibleColumns.thirdMonth && isThirdPeriod && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشهر الثالث
                </th>
              )}
              {visibleColumns.average && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المتوسط
                </th>
              )}
              {visibleColumns.workTotal && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مجموع الأعمال
                </th>
              )}
              {visibleColumns.finalExam && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الامتحان النهائي
                </th>
              )}
              {visibleColumns.periodTotal && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مجموع الفترة
                </th>
              )}
              {visibleColumns.status && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
              )}
              {visibleColumns.actions && (
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>

          <GradesTableBody
            students={currentStudents}
            visibleColumns={visibleColumns}
            updateStudentGrade={updateStudentGrade}
            getGradeColor={getGradeColor}
            getGradeBgColor={getGradeBgColor}
            isThirdPeriod={isThirdPeriod}
          />
        </table>
      </div>

      {totalPages > 1 && (
        <GradesTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalStudents={students.length}
          studentsPerPage={studentsPerPage}
        />
      )}
    </div>
  )
}

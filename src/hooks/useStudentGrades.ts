"use client"

import { useState, useCallback, useEffect } from "react"
import type { Student, FilterOptions, SearchOptions } from "../types/student"

const initialStudents: Student[] = [
  {
    studentId: "2024001",
    studentName: "أحمد محمد علي",
    firstMonthGrade: 85,
    secondMonthGrade: 90,
    thirdMonthGrade: 88,
    workTotal: 87.67,
    finalExamGrade: 92,
    periodTotal: 89.84,
    status: "مكتمل",
  },
  {
    studentId: "2024002",
    studentName: "فاطمة أحمد حسن",
    firstMonthGrade: 78,
    secondMonthGrade: 82,
    thirdMonthGrade: null,
    workTotal: 80,
    finalExamGrade: null,
    periodTotal: 0,
    status: "غير مكتمل",
  },
  {
    studentId: "2024003",
    studentName: "محمد عبدالله سالم",
    firstMonthGrade: 95,
    secondMonthGrade: 93,
    thirdMonthGrade: 97,
    workTotal: 95,
    finalExamGrade: 96,
    periodTotal: 95.5,
    status: "مكتمل",
  },
  {
    studentId: "2024004",
    studentName: "نور الهدى محمود",
    firstMonthGrade: 45,
    secondMonthGrade: 52,
    thirdMonthGrade: 48,
    workTotal: 48.33,
    finalExamGrade: 55,
    periodTotal: 51.67,
    status: "مكتمل",
  },
  {
    studentId: "2024005",
    studentName: "عبدالرحمن خالد",
    firstMonthGrade: 88,
    secondMonthGrade: null,
    thirdMonthGrade: null,
    workTotal: 88,
    finalExamGrade: null,
    periodTotal: 0,
    status: "غير مكتمل",
  },
]

export function useStudentGrades() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(initialStudents)
  const [filters, setFilters] = useState<FilterOptions>({
    academicYear: "",
    semester: "",
    educationLevel: "",
    section: "",
    studySystem: "",
    gender: "",
    subject: "",
    teacherName: "",
    evaluationPeriod: "",
  })
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchType: "name",
    searchValue: "",
    displayFilter: "all",
  })

  // تحديد نوع الحساب بناءً على الفترة المختارة
  const isThirdPeriod = filters.evaluationPeriod === "الفترة الثالثة"

  const calculateWorkTotal = useCallback(
    (first: number | null, second: number | null, third: number | null): number => {
      if (isThirdPeriod) {
        // في الفترة الثالثة: نحسب مجموع الفترتين السابقتين
        const firstPeriodTotal = first !== null ? first : 0
        const secondPeriodTotal = second !== null ? second : 0
        return Math.round((firstPeriodTotal + secondPeriodTotal) * 100) / 100
      } else {
        // في الفترات الأخرى: نحسب متوسط الأشهر
        const grades = [first, second, third].filter((grade) => grade !== null) as number[]
        if (grades.length === 0) return 0
        return Math.round((grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 100) / 100
      }
    },
    [isThirdPeriod],
  )

  const calculatePeriodTotal = useCallback(
    (workTotal: number, finalExam: number | null): number => {
      if (finalExam === null) return 0
      if (isThirdPeriod) {
        // في الفترة الثالثة: مجموع الفترتين السابقتين + امتحان الفترة الثالثة
        return Math.round((workTotal + finalExam) * 100) / 100
      } else {
        // في الفترات الأخرى: الحساب المعتاد (40% أعمال + 60% امتحان)
        return Math.round((workTotal * 0.4 + finalExam * 0.6) * 100) / 100
      }
    },
    [isThirdPeriod],
  )

  const updateStudentGrade = useCallback(
    (studentId: string, field: keyof Student, value: any) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.studentId === studentId) {
            const updatedStudent = { ...student, [field]: value }

            if (["firstMonthGrade", "secondMonthGrade", "thirdMonthGrade"].includes(field)) {
              updatedStudent.workTotal = calculateWorkTotal(
                updatedStudent.firstMonthGrade,
                updatedStudent.secondMonthGrade,
                updatedStudent.thirdMonthGrade,
              )
              updatedStudent.periodTotal = calculatePeriodTotal(updatedStudent.workTotal, updatedStudent.finalExamGrade)
            }

            if (field === "finalExamGrade") {
              updatedStudent.periodTotal = calculatePeriodTotal(updatedStudent.workTotal, updatedStudent.finalExamGrade)
            }

            // Update status
            let isComplete = false
            if (isThirdPeriod) {
              // في الفترة الثالثة: نحتاج الفترتين السابقتين + امتحان الفترة الثالثة
              isComplete =
                updatedStudent.firstMonthGrade !== null &&
                updatedStudent.secondMonthGrade !== null &&
                updatedStudent.finalExamGrade !== null
            } else {
              // في الفترات الأخرى: نحتاج جميع الدرجات
              isComplete =
                updatedStudent.firstMonthGrade !== null &&
                updatedStudent.secondMonthGrade !== null &&
                updatedStudent.thirdMonthGrade !== null &&
                updatedStudent.finalExamGrade !== null
            }
            updatedStudent.status = isComplete ? "مكتمل" : "غير مكتمل"

            return updatedStudent
          }
          return student
        }),
      )
    },
    [calculateWorkTotal, calculatePeriodTotal, isThirdPeriod],
  )

  const filterStudents = useCallback(() => {
    let filtered = [...students]

    // تطبيق المرشحات فقط إذا كانت محددة
    if (filters.academicYear) {
      // يمكن إضافة منطق الترشيح هنا
    }

    if (searchOptions.searchValue) {
      filtered = filtered.filter((student) => {
        switch (searchOptions.searchType) {
          case "name":
            return student.studentName.includes(searchOptions.searchValue)
          case "studentId":
            return student.studentId.includes(searchOptions.searchValue)
          case "nationalId":
            return student.studentId.includes(searchOptions.searchValue) // Assuming studentId is nationalId for demo
          default:
            return true
        }
      })
    }

    switch (searchOptions.displayFilter) {
      case "complete":
        filtered = filtered.filter((student) => student.status === "مكتمل")
        break
      case "incomplete":
        filtered = filtered.filter((student) => student.status === "غير مكتمل")
        break
      default:
        break
    }

    setFilteredStudents(filtered)
  }, [students, searchOptions, filters])

  useEffect(() => {
    filterStudents()
  }, [filterStudents])

  // إعادة حساب الدرجات عند تغيير الفترة
  useEffect(() => {
    if (filters.evaluationPeriod) {
      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          const updatedStudent = { ...student }
          updatedStudent.workTotal = calculateWorkTotal(
            student.firstMonthGrade,
            student.secondMonthGrade,
            student.thirdMonthGrade,
          )
          updatedStudent.periodTotal = calculatePeriodTotal(updatedStudent.workTotal, student.finalExamGrade)

          // تحديث الحالة
          let isComplete = false
          if (isThirdPeriod) {
            isComplete =
              student.firstMonthGrade !== null && student.secondMonthGrade !== null && student.finalExamGrade !== null
          } else {
            isComplete =
              student.firstMonthGrade !== null &&
              student.secondMonthGrade !== null &&
              student.thirdMonthGrade !== null &&
              student.finalExamGrade !== null
          }
          updatedStudent.status = isComplete ? "مكتمل" : "غير مكتمل"

          return updatedStudent
        }),
      )
    }
  }, [filters.evaluationPeriod, calculateWorkTotal, calculatePeriodTotal, isThirdPeriod])

  const getGradeColor = (grade: number | null): string => {
    if (grade === null) return "text-gray-400"
    if (grade >= 85) return "text-green-600"
    if (grade >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBgColor = (grade: number | null): string => {
    if (grade === null) return "bg-gray-50"
    if (grade >= 85) return "bg-green-50"
    if (grade >= 50) return "bg-yellow-50"
    return "bg-red-50"
  }

  const stats = {
    total: students.length,
    complete: students.filter((s) => s.status === "مكتمل").length,
    incomplete: students.filter((s) => s.status === "غير مكتمل").length,
    excellent: students.filter((s) => s.periodTotal >= 85).length,
    needsAttention: students.filter((s) => s.periodTotal < 50 && s.periodTotal > 0).length,
  }

  return {
    students: filteredStudents,
    filters,
    setFilters,
    searchOptions,
    setSearchOptions,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    stats,
    isThirdPeriod,
  }
}

"use client"

import { useState, useCallback, useEffect } from "react"
import type { Student, FilterOptions, SearchOptions } from "../types/student"

const initialStudents: Student[] = []

export function useStudentGrades() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(initialStudents)
  const [filters, setFilters] = useState<FilterOptions>({
    academicYear: "",
    educationLevel: "",
    section: "",
    studySystem: "",
    subject: "",
    evaluationPeriod: "",
  })
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchType: "name",
    searchValue: "",
    displayFilter: "all",
  })

  // تحديد نوع الحساب بناءً على الفترة المختارة
  const isThirdPeriod = filters.evaluationPeriod === "الفترة الثالثة"

  const mapPeriodToServer = (label: string): string => {
    switch (label) {
      case "الفترة الأولى":
        return "FIRST"
      case "الفترة الثانية":
        return "SECOND"
      case "الفترة الثالثة":
        return "THIRD"
      default:
        return ""
    }
  }

  const fetchSubjectGrades = useCallback(async () => {
    try {
      // نجلب الطلاب حتى بدون اكتمال كل الفلاتر لإظهار الأسماء، وتكون الدرجات فارغة لحين اكتمال المعايير
      const params = new URLSearchParams({
        subject: String(filters.subject),
        period: String(filters.evaluationPeriod),
        academicYear: String(filters.academicYear),
        educationLevel: String(filters.educationLevel || ""),
        section: String(filters.section || ""),
        studySystem: String(filters.studySystem || ""),
        searchType: String(searchOptions.searchType || ""),
        searchValue: String(searchOptions.searchValue || ""),
        displayFilter: String(searchOptions.displayFilter || ""),
      })
      const res = await fetch(`/api/subject-grades?${params.toString()}`)
      if (!res.ok) {
        setStudents([])
        return
      }
      const data = await res.json()
      const rows: Student[] = (data.students || []).map((r: any) => ({
        studentId: r.studentId,
        studentName: r.studentName,
        firstMonthGrade: r.firstMonthGrade,
        secondMonthGrade: r.secondMonthGrade,
        thirdMonthGrade: r.thirdMonthGrade,
        workTotal: r.workTotal,
        finalExamGrade: r.finalExamGrade,
        periodTotal: r.periodTotal,
        status: r.status,
        _dbStudentId: r._dbStudentId,
      }))
      setStudents(rows)
    } catch (e) {
      setStudents([])
    }
  }, [filters.subject, filters.evaluationPeriod, filters.academicYear, filters.educationLevel, filters.section, filters.studySystem, searchOptions.searchType, searchOptions.searchValue, searchOptions.displayFilter])

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

  const persistSingle = useCallback(async (row: Student) => {
    if (!filters.subject || !filters.evaluationPeriod || !filters.academicYear) return
    await fetch("/api/subject-grades", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: filters.subject,
        academicYear: filters.academicYear,
        period: filters.evaluationPeriod,
        studentDbId: row._dbStudentId || row.studentId,
        month1: row.firstMonthGrade,
        month2: row.secondMonthGrade,
        month3: isThirdPeriod ? null : row.thirdMonthGrade,
        finalExam: row.finalExamGrade,
      }),
    })
  }, [filters.subject, filters.evaluationPeriod, filters.academicYear, isThirdPeriod])

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

            let isComplete = false
            if (isThirdPeriod) {
              isComplete =
                updatedStudent.firstMonthGrade !== null &&
                updatedStudent.secondMonthGrade !== null &&
                updatedStudent.finalExamGrade !== null
            } else {
              isComplete =
                updatedStudent.firstMonthGrade !== null &&
                updatedStudent.secondMonthGrade !== null &&
                updatedStudent.thirdMonthGrade !== null &&
                updatedStudent.finalExamGrade !== null
            }
            updatedStudent.status = isComplete ? "مكتمل" : "غير مكتمل"

            // حفظ فوري للسطر المحدث
            persistSingle(updatedStudent)

            return updatedStudent
          }
          return student
        }),
      )
    },
    [calculateWorkTotal, calculatePeriodTotal, isThirdPeriod, persistSingle],
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

  // جلب بيانات الدرجات من الخادم عند النقر على تطبيق أو عند تغيّر واضح
  useEffect(() => {
    // سنجلب تلقائياً عندما تتوفر المعايير الأساسية
    fetchSubjectGrades()
  }, [fetchSubjectGrades])

  // واجهة لتفعيل زر "تطبيق الفلاتر" من المكون
  const applyFilters = useCallback(() => {
    fetchSubjectGrades()
  }, [fetchSubjectGrades])

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
    applyFilters,
    searchOptions,
    setSearchOptions,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    stats,
    isThirdPeriod,
  }
}

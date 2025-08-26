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
    studySystem: "",
    subject: "",
    evaluationPeriod: "",
  })

  // إضافة console.log عند تحديث الفلاتر
  const updateFilters = (newFilters: FilterOptions) => {
    console.log("🔍 Updating filters from:", filters, "to:", newFilters)
    setFilters(newFilters)
  }

  // إضافة console.log في setFilters الأصلي
  const setFiltersWithLog = (newFilters: FilterOptions) => {
    console.log("🔍 setFilters called with:", newFilters)
    setFilters(newFilters)
  }
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchType: "name",
    searchValue: "",
    displayFilter: "all",
  })

  // حالة popup الحفظ
  const [savePopup, setSavePopup] = useState<{
    show: boolean
    message: string
    subjectName: string
  }>({
    show: false,
    message: "",
    subjectName: ""
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
    console.log("🔍 fetchSubjectGrades called with filters:", filters)

    // استخراج اسم المادة سواء كان نصاً أو كائناً
    const getSubjectName = () => {
      if (typeof filters.subject === 'object' && filters.subject !== null) {
        return filters.subject.name
      }
      return filters.subject
    }

    const subjectName = getSubjectName()

    try {
      const params = new URLSearchParams({
        subject: subjectName,
        period: String(filters.evaluationPeriod),
        academicYear: String(filters.academicYear),
        educationLevel: String(filters.educationLevel || ""),
        studySystem: String(filters.studySystem || ""),
        searchType: String(searchOptions.searchType || ""),
        searchValue: String(searchOptions.searchValue || ""),
        displayFilter: String(searchOptions.displayFilter || ""),
      })
      console.log("🔍 API params:", params.toString())
      const res = await fetch(`/api/subject-grades?${params.toString()}`)
      if (!res.ok) {
        setStudents([])
        return
      }
      const data = await res.json()
      console.log("🔍 Raw API response:", data.students)
      const rows: Student[] = (data.students || []).map((r: any) => {
        console.log("🔍 Processing student:", r)
        return {
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
          // بيانات إضافية من قاعدة البيانات
          academicYear: r.academicYear,
          studyLevel: r.studyLevel,
          studyMode: r.studyMode,
          specialization: r.specialization,
          birthday: r.birthday,
          address: r.address,
          studentPhone: r.studentPhone,
          guardianName: r.guardianName,
          guardianPhone: r.guardianPhone,
          enrollmentStatus: r.enrollmentStatus,
          studentStatus: r.studentStatus,
        }
      })
      console.log("🔍 Processed students:", rows)
      setStudents(rows)
    } catch (e) {
      setStudents([])
    }
  }, [filters.subject, filters.evaluationPeriod, filters.academicYear, filters.educationLevel, filters.studySystem, searchOptions.searchType, searchOptions.searchValue, searchOptions.displayFilter])

  const calculateWorkTotal = useCallback(
    (first: number | null, second: number | null, third: number | null): number => {
      if (isThirdPeriod) {
        // في الفترة الثالثة: month1 و month2 هما مجموع الفترتين السابقتين
        const firstPeriodTotal = first !== null ? first : 0
        const secondPeriodTotal = second !== null ? second : 0
        const total = firstPeriodTotal + secondPeriodTotal
        return total > 0 ? Math.round(total * 100) / 100 : 0
      } else {
        // في الفترات الأخرى: نحسب متوسط الأشهر الثلاثة
        const grades = [first, second, third].filter((grade) => grade !== null) as number[]
        if (grades.length === 0) return 0
        const total = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        return total > 0 ? Math.round(total * 100) / 100 : 0
      }
    },
    [isThirdPeriod],
  )

  const calculatePeriodTotal = useCallback(
    (workTotal: number, finalExam: number | null): number => {
      if (finalExam === null) return 0
      if (isThirdPeriod) {
        // في الفترة الثالثة: مجموع الفترتين السابقتين + امتحان الفترة الثالثة
        const total = workTotal + finalExam
        return total > 0 ? Math.round(total * 100) / 100 : 0
      } else {
        // في الفترات الأخرى: الحساب المعتاد (40% أعمال + 60% امتحان)
        const total = workTotal * 0.4 + finalExam * 0.6
        return total > 0 ? Math.round(total * 100) / 100 : 0
      }
    },
    [isThirdPeriod],
  )

  const persistSingle = useCallback(async (row: Student) => {
    console.log("🔍 persistSingle called with filters:", filters)
    console.log("🔍 persistSingle called with row:", row)

    if (!filters.subject || !filters.evaluationPeriod || !filters.academicYear) {
      console.log("❌ Cannot persist - missing filters:", {
        subject: filters.subject,
        evaluationPeriod: filters.evaluationPeriod,
        academicYear: filters.academicYear
      })
      return
    }

    // استخراج اسم المادة سواء كان نصاً أو كائناً
    const getSubjectName = () => {
      if (typeof filters.subject === 'object' && filters.subject !== null) {
        return filters.subject.name
      }
      return filters.subject
    }

    const subjectName = getSubjectName()

    console.log("💾 Persisting student grades:", {
      studentId: row.studentId,
      studentName: row.studentName,
      subject: subjectName,
      academicYear: filters.academicYear,
      period: filters.evaluationPeriod,
      month1: row.firstMonthGrade,
      month2: row.secondMonthGrade,
      month3: isThirdPeriod ? null : row.thirdMonthGrade, // في الفترة الثالثة: month3 = null
      finalExam: row.finalExamGrade
    })

    try {
      const response = await fetch("/api/subject-grades", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectName,
          academicYear: filters.academicYear,
          period: filters.evaluationPeriod,
          studentDbId: row._dbStudentId || row.studentId,
          month1: row.firstMonthGrade || null,
          month2: row.secondMonthGrade || null,
          month3: isThirdPeriod ? null : (row.thirdMonthGrade || null),
          finalExam: row.finalExamGrade || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Grades saved successfully:", data)
        // إظهار popup النجاح
        setSavePopup({
          show: true,
          message: data.message || "تم حفظ الدرجات بنجاح",
          subjectName: data.subjectName || subjectName
        })

        // إخفاء popup بعد 3 ثواني
        setTimeout(() => {
          setSavePopup(prev => ({ ...prev, show: false }))
        }, 3000)
      } else {
        console.error("❌ Failed to save grades:", response.status, response.statusText)
        const errorData = await response.json()
        console.error("❌ Error details:", errorData)
      }
    } catch (error) {
      console.error("❌ Error saving grade:", error)
      // إظهار popup الخطأ
      setSavePopup({
        show: true,
        message: "حدث خطأ في حفظ الدرجات",
        subjectName: subjectName
      })

      setTimeout(() => {
        setSavePopup(prev => ({ ...prev, show: false }))
      }, 3000)
    }
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

            // حفظ الدرجات تلقائياً في قاعدة البيانات
            console.log("💾 Scheduling auto-save for student:", updatedStudent.studentName)
            setTimeout(() => {
              console.log("💾 Executing auto-save for student:", updatedStudent.studentName)
              persistSingle(updatedStudent)
            }, 500) // تأخير 500ms لتجنب الطلبات المتكررة

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
  }, [students, searchOptions])

  useEffect(() => {
    filterStudents()
  }, [filterStudents])

  // جلب بيانات الدرجات من الخادم عند النقر على تطبيق أو عند تغيّر واضح
  useEffect(() => {
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
              student.firstMonthGrade !== null &&
              student.secondMonthGrade !== null &&
              student.finalExamGrade !== null
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
    setFilters: setFiltersWithLog,
    applyFilters,
    searchOptions,
    setSearchOptions,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    stats,
    isThirdPeriod,
    savePopup,
    setSavePopup,
  }
}

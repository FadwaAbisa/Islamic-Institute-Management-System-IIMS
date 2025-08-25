export interface Student {
  studentId: string
  studentName: string
  firstMonthGrade: number | null
  secondMonthGrade: number | null
  thirdMonthGrade: number | null
  workTotal: number
  finalExamGrade: number | null
  periodTotal: number
  status: "مكتمل" | "غير مكتمل"
  _dbStudentId?: string

  // بيانات إضافية من قاعدة البيانات
  academicYear?: string | null
  studyLevel?: string | null
  studyMode?: string | null
  specialization?: string | null
  sex?: string | null
  birthday?: string | null
  address?: string | null
  studentPhone?: string | null
  guardianName?: string | null
  guardianPhone?: string | null
  enrollmentStatus?: string | null
  studentStatus?: string | null
}

export interface FilterOptions {
  academicYear: string
  educationLevel: string
  studySystem: string
  subject: string
  evaluationPeriod: string
}

export interface SearchOptions {
  searchType: "name" | "studentId"
  searchValue: string
  displayFilter: "all" | "complete" | "incomplete" | "byStatus"
}

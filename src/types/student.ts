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
}

export interface FilterOptions {
  academicYear: string
  semester: string
  educationLevel: string
  section: string
  studySystem: string
  gender: string
  subject: string
  teacherName: string
  evaluationPeriod: string
}

export interface SearchOptions {
  searchType: "name" | "nationalId" | "studentId"
  searchValue: string
  displayFilter: "all" | "complete" | "incomplete" | "byStatus"
}

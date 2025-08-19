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
}

export interface FilterOptions {
  academicYear: string
  educationLevel: string
  section: string
  studySystem: string
  subject: string
  evaluationPeriod: string
}

export interface SearchOptions {
  searchType: "name" | "studentId"
  searchValue: string
  displayFilter: "all" | "complete" | "incomplete" | "byStatus"
}

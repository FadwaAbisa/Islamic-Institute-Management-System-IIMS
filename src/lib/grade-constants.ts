// ثوابت الدرجات للسنة الأولى والثانية (نظامي فقط)

export interface SubjectGradeConfig {
  name: string
  monthlyGrade: number  // درجة الشهر (أول، ثاني، ثالث)
  examGrade: number     // درجة الامتحان
}

export const FIRST_YEAR_SUBJECTS: SubjectGradeConfig[] = [
  {
    name: "القرآن وأحكامه",
    monthlyGrade: 8,
    examGrade: 8
  },
  {
    name: "السيرة",
    monthlyGrade: 12,
    examGrade: 12
  },
  {
    name: "التفسير",
    monthlyGrade: 12,
    examGrade: 12
  },
  {
    name: "علوم الحديث",
    monthlyGrade: 4,
    examGrade: 4
  },
  {
    name: "الفقه",
    monthlyGrade: 12,
    examGrade: 12
  },
  {
    name: "العقيدة",
    monthlyGrade: 12,
    examGrade: 12
  },
  {
    name: "الدراسات الأدبية",
    monthlyGrade: 8,
    examGrade: 8
  },
  {
    name: "الدراسات اللغوية",
    monthlyGrade: 8,
    examGrade: 8
  },
  {
    name: "أصول الفقه",
    monthlyGrade: 8,
    examGrade: 8
  },
  {
    name: "منهج الدعوة",
    monthlyGrade: 4,
    examGrade: 4
  },
  {
    name: "اللغة الإنجليزية",
    monthlyGrade: 8,
    examGrade: 8
  },
  {
    name: "الحاسوب",
    monthlyGrade: 8,
    examGrade: 8
  }
]

// السنة الثانية لها نفس التقسيمة
export const SECOND_YEAR_SUBJECTS: SubjectGradeConfig[] = [...FIRST_YEAR_SUBJECTS]

// دالة للحصول على توزيع الدرجات حسب المادة
export function getSubjectGradeConfig(subjectName: string, year: 'first' | 'second'): SubjectGradeConfig | null {
  const subjects = year === 'first' ? FIRST_YEAR_SUBJECTS : SECOND_YEAR_SUBJECTS
  return subjects.find(subject => subject.name === subjectName) || null
}

// دالة لحساب المتوسط
export function calculateAverage(month1: number, month2: number, month3: number): number {
  const validGrades = [month1, month2, month3].filter(grade => grade !== null && grade !== undefined && grade >= 0)
  if (validGrades.length === 0) return 0
  return validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length
}

// دالة لحساب الدرجة النهائية
export function calculateFinalGrade(average: number, examGrade: number): number {
  return average + examGrade
}

// دالة للتحقق من صحة درجة الشهر
export function validateMonthlyGrade(grade: number, maxGrade: number): boolean {
  return grade >= 0 && grade <= maxGrade
}

// دالة للتحقق من صحة درجة الامتحان
export function validateExamGrade(grade: number, maxGrade: number): boolean {
  return grade >= 0 && grade <= maxGrade
}

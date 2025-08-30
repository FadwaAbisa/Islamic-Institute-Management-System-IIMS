// Grade configuration constants and types
export interface GradeConfig {
  minScore: number;
  maxScore: number;
  grade: string;
  gpa: number;
}

export const GRADE_CONFIGURATIONS: GradeConfig[] = [
  { minScore: 90, maxScore: 100, grade: 'A+', gpa: 4.0 },
  { minScore: 85, maxScore: 89, grade: 'A', gpa: 3.7 },
  { minScore: 80, maxScore: 84, grade: 'A-', gpa: 3.3 },
  { minScore: 75, maxScore: 79, grade: 'B+', gpa: 3.0 },
  { minScore: 70, maxScore: 74, grade: 'B', gpa: 2.7 },
  { minScore: 65, maxScore: 69, grade: 'B-', gpa: 2.3 },
  { minScore: 60, maxScore: 64, grade: 'C+', gpa: 2.0 },
  { minScore: 55, maxScore: 59, grade: 'C', gpa: 1.7 },
  { minScore: 50, maxScore: 54, grade: 'C-', gpa: 1.3 },
  { minScore: 0, maxScore: 49, grade: 'F', gpa: 0.0 },
];

export function getGradeFromScore(score: number): GradeConfig | null {
  return GRADE_CONFIGURATIONS.find(
    config => score >= config.minScore && score <= config.maxScore
  ) || null;
}

export function getGPAFromScore(score: number): number {
  const gradeConfig = getGradeFromScore(score);
  return gradeConfig ? gradeConfig.gpa : 0.0;
}


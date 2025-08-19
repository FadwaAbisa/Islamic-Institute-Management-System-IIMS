-- CreateEnum
CREATE TYPE "EvaluationPeriod" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- CreateTable
CREATE TABLE "SubjectGrade" (
    "id" SERIAL NOT NULL,
    "academicYear" TEXT NOT NULL,
    "period" "EvaluationPeriod" NOT NULL,
    "month1" INTEGER,
    "month2" INTEGER,
    "month3" INTEGER,
    "workTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalExam" INTEGER,
    "periodTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "SubjectGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGrade_studentId_subjectId_academicYear_period_key" ON "SubjectGrade"("studentId", "subjectId", "academicYear", "period");

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

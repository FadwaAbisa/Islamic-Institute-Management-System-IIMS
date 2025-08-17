/*
  Warnings:

  - You are about to drop the column `branch` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parentName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parentPhone` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "branch",
DROP COLUMN "parentName",
DROP COLUMN "parentPhone",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "birthCertificate" TEXT,
ADD COLUMN     "chronicDiseases" TEXT,
ADD COLUMN     "educationForm" TEXT,
ADD COLUMN     "emergencyContactAddress" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "equivalencyDocument" TEXT,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianPhone" TEXT,
ADD COLUMN     "healthCondition" TEXT,
ADD COLUMN     "nationalIdCopy" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "otherDocuments" JSONB,
ADD COLUMN     "previousLevel" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "specialNeeds" TEXT,
ADD COLUMN     "studentPhoto" TEXT,
ALTER COLUMN "parentId" DROP NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL,
ALTER COLUMN "gradeId" DROP NOT NULL,
ALTER COLUMN "academicYear" DROP NOT NULL,
ALTER COLUMN "enrollmentStatus" DROP NOT NULL,
ALTER COLUMN "relationship" DROP NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "studentStatus" DROP NOT NULL,
ALTER COLUMN "studyLevel" DROP NOT NULL,
ALTER COLUMN "studyMode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `bloodType` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nationalId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYear` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeOfBirth` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationship` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentStatus` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyLevel` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyMode` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'DROPPED', 'SUSPENDED', 'EXPELLED', 'PAUSED');

-- CreateEnum
CREATE TYPE "StudyMode" AS ENUM ('REGULAR', 'DISTANCE');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('NEW', 'REPEATER');

-- DropIndex
DROP INDEX "Student_email_key";

-- DropIndex
DROP INDEX "Student_phone_key";

-- DropIndex
DROP INDEX "Student_username_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "bloodType",
DROP COLUMN "email",
DROP COLUMN "img",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "surname",
DROP COLUMN "username",
ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "enrollmentStatus" "EnrollmentStatus" NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "nationalId" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "parentName" TEXT NOT NULL,
ADD COLUMN     "parentPhone" TEXT,
ADD COLUMN     "placeOfBirth" TEXT NOT NULL,
ADD COLUMN     "relationship" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL,
ADD COLUMN     "studentPhone" TEXT,
ADD COLUMN     "studentStatus" "StudentStatus" NOT NULL,
ADD COLUMN     "studyLevel" TEXT NOT NULL,
ADD COLUMN     "studyMode" "StudyMode" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_nationalId_key" ON "Student"("nationalId");

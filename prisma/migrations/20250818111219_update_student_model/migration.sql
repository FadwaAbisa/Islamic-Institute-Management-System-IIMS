/*
  Warnings:

  - You are about to drop the column `sex` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "StudentStatus" ADD VALUE 'GRADUATED';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "sex";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "sex";

-- DropEnum
DROP TYPE "UserSex";

-- Migration: add_teacher_employment_fields
-- Description: إضافة الحقول الوظيفية والأكاديمية للمعلمات

-- إضافة enum EmploymentStatus
CREATE TYPE "EmploymentStatus" AS ENUM ('APPOINTMENT', 'CONTRACT', 'SECONDMENT');

-- إضافة enum MaritalStatus
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- تحديث الحقول الأساسية
ALTER TABLE "Teacher" ALTER COLUMN "fullName" SET NOT NULL;
ALTER TABLE "Teacher" ALTER COLUMN "nationalId" SET NOT NULL;
ALTER TABLE "Teacher" ALTER COLUMN "birthday" SET NOT NULL;

-- إضافة الحقول الجديدة
ALTER TABLE "Teacher" ADD COLUMN "maritalStatus" "MaritalStatus";
ALTER TABLE "Teacher" ADD COLUMN "phone1" TEXT NOT NULL;
ALTER TABLE "Teacher" ADD COLUMN "phone2" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "employmentStatus" "EmploymentStatus";
ALTER TABLE "Teacher" ADD COLUMN "appointmentDate" TIMESTAMP(3);
ALTER TABLE "Teacher" ADD COLUMN "serviceStartDate" TIMESTAMP(3);
ALTER TABLE "Teacher" ADD COLUMN "contractEndDate" TIMESTAMP(3);
ALTER TABLE "Teacher" ADD COLUMN "academicQualification" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "educationalInstitution" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "majorSpecialization" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "minorSpecialization" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "graduationYear" TEXT;

-- إضافة حقول جهة الاتصال للطوارئ
ALTER TABLE "Teacher" ADD COLUMN "emergencyContactName" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "emergencyContactRelation" TEXT;

-- إضافة حقل الصورة
ALTER TABLE "Teacher" ADD COLUMN "img" TEXT;

-- حذف الحقول القديمة
ALTER TABLE "Teacher" DROP COLUMN IF EXISTS "placeOfBirth";
ALTER TABLE "Teacher" DROP COLUMN IF EXISTS "email";
ALTER TABLE "Teacher" DROP COLUMN IF EXISTS "studyLevel";

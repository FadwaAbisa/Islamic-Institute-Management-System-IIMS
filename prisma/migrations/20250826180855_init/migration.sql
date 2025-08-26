-- CreateEnum
CREATE TYPE "EvaluationPeriod" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'DROPPED', 'SUSPENDED', 'EXPELLED', 'PAUSED', 'GRADUATED');

-- CreateEnum
CREATE TYPE "StudyMode" AS ENUM ('REGULAR', 'DISTANCE');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('NEW', 'REPEATER');

-- CreateEnum
CREATE TYPE "StudyLevel" AS ENUM ('FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'GRADUATION');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "guardianName" TEXT,
    "studentPhone" TEXT,
    "birthday" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "academicYear" TEXT,
    "studyLevel" "StudyLevel",
    "specialization" TEXT,
    "studyMode" "StudyMode",
    "enrollmentStatus" "EnrollmentStatus",
    "studentStatus" "StudentStatus",
    "relationship" TEXT,
    "guardianPhone" TEXT,
    "previousSchool" TEXT,
    "previousLevel" TEXT,
    "healthCondition" TEXT,
    "chronicDiseases" TEXT,
    "allergies" TEXT,
    "specialNeeds" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactAddress" TEXT,
    "notes" TEXT,
    "studentPhoto" TEXT,
    "nationalIdCopy" TEXT,
    "birthCertificate" TEXT,
    "educationForm" TEXT,
    "equivalencyDocument" TEXT,
    "otherDocuments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "nationalId" TEXT,
    "birthday" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "nationality" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "img" TEXT,
    "username" TEXT,
    "name" TEXT,
    "surname" TEXT,
    "bloodType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_SubjectToTeacher" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nationalId_key" ON "Student"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_nationalId_key" ON "Teacher"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_phone_key" ON "Teacher"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_username_key" ON "Teacher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGrade_studentId_subjectId_academicYear_period_key" ON "SubjectGrade"("studentId", "subjectId", "academicYear", "period");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTeacher_AB_unique" ON "_SubjectToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToTeacher_B_index" ON "_SubjectToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

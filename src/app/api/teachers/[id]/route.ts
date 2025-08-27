import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
        teacherStudyLevels: true,
      },
    })

    if (!teacher) {
      return NextResponse.json({ error: "لم يتم العثور على المعلم" }, { status: 404 })
    }

    return NextResponse.json({ teacher })
  } catch (error) {
    console.error("خطأ في جلب بيانات المعلم:", error)
    return NextResponse.json({ error: "فشل في جلب بيانات المعلم" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      fullName, nationalId, birthday, nationality, maritalStatus, address,
      phone1, phone2, emergencyContactName, emergencyContactRelation,
      employmentStatus, appointmentDate, serviceStartDate, contractEndDate,
      academicQualification, educationalInstitution, majorSpecialization,
      minorSpecialization, graduationYear, selectedSubjects, selectedStudyLevels,
    } = body || {}

    if (!fullName || !nationalId || !birthday || !phone1) {
      return NextResponse.json({ error: "الحقول الأساسية مطلوبة" }, { status: 400 })
    }

    // Check if national ID already exists for another teacher
    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        nationalId,
        id: { not: params.id },
      },
    })

    if (existingTeacher) {
      return NextResponse.json({ error: "رقم الهوية موجود مسبقاً" }, { status: 400 })
    }

    // Update teacher data
    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        fullName,
        nationalId,
        birthday: new Date(birthday),
        nationality: nationality || null,
        maritalStatus: maritalStatus || null,
        address: address || null,
        phone1,
        phone2: phone2 || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactRelation: emergencyContactRelation || null,
        employmentStatus: employmentStatus || null,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : null,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
        academicQualification: academicQualification || null,
        educationalInstitution: educationalInstitution || null,
        majorSpecialization: majorSpecialization || null,
        minorSpecialization: minorSpecialization || null,
        graduationYear: graduationYear || null,
      },
    })

    // Update teacher subjects
    if (selectedSubjects !== undefined) {
      // Delete existing teacher subjects
      await prisma.teacherSubject.deleteMany({
        where: { teacherId: params.id },
      })

      // Add new teacher subjects
      if (selectedSubjects.length > 0) {
        const teacherSubjects = selectedSubjects.map((subjectId: number) => ({
          teacherId: params.id,
          subjectId: subjectId,
        }))
        await prisma.teacherSubject.createMany({ data: teacherSubjects, skipDuplicates: true })
      }
    }

    // Update teacher study levels
    if (selectedStudyLevels !== undefined) {
      // Delete existing teacher study levels
      await prisma.teacherStudyLevel.deleteMany({
        where: { teacherId: params.id },
      })

      // Add new teacher study levels
      if (selectedStudyLevels.length > 0) {
        const teacherStudyLevels = selectedStudyLevels.map((studyLevel: string) => ({
          teacherId: params.id,
          studyLevel: studyLevel as any,
        }))
        await prisma.teacherStudyLevel.createMany({ data: teacherStudyLevels, skipDuplicates: true })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "تم تحديث بيانات المعلم بنجاح",
      teacher 
    })
  } catch (error: any) {
    console.error("خطأ في تحديث بيانات المعلم:", error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "رقم الهوية موجود مسبقاً" }, { status: 400 })
    }
    return NextResponse.json({ error: "فشل في تحديث بيانات المعلم" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete teacher subjects and study levels first (cascade should handle this)
    await prisma.teacherSubject.deleteMany({
      where: { teacherId: params.id },
    })

    await prisma.teacherStudyLevel.deleteMany({
      where: { teacherId: params.id },
    })

    // Delete the teacher
    await prisma.teacher.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      success: true, 
      message: "تم حذف المعلم بنجاح" 
    })
  } catch (error) {
    console.error("خطأ في حذف المعلم:", error)
    return NextResponse.json({ error: "فشل في حذف المعلم" }, { status: 500 })
  }
}

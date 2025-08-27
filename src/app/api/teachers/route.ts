import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      nationalId,
      birthday,
      nationality,
      maritalStatus,
      address,
      phone1,
      phone2,
      emergencyContactName,
      emergencyContactRelation,
      employmentStatus,
      appointmentDate,
      serviceStartDate,
      contractEndDate,
      academicQualification,
      educationalInstitution,
      majorSpecialization,
      minorSpecialization,
      graduationYear,
      subjects,
      studyLevels,
    } = body || {}

    // التحقق من الحقول المطلوبة
    if (!fullName || !nationalId || !birthday || !phone1) {
      return NextResponse.json({ error: "الحقول الأساسية مطلوبة" }, { status: 400 })
    }

    // إنشاء المعلم مع البيانات الأساسية
    const teacher = await prisma.teacher.create({
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

    // إضافة المواد الدراسية
    if (subjects && subjects.length > 0) {
      const teacherSubjects = subjects.map((subjectId: number) => ({
        teacherId: teacher.id,
        subjectId: subjectId,
      }))

      await prisma.teacherSubject.createMany({
        data: teacherSubjects,
        skipDuplicates: true,
      })
    }

    // إضافة المراحل الدراسية
    if (studyLevels && studyLevels.length > 0) {
      const teacherStudyLevels = studyLevels.map((studyLevel: string) => ({
        teacherId: teacher.id,
        studyLevel: studyLevel as any, // تحويل إلى enum
      }))

      await prisma.teacherStudyLevel.createMany({
        data: teacherStudyLevels,
        skipDuplicates: true,
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "تم إضافة المعلم بنجاح",
      teacherId: teacher.id 
    })
  } catch (error: any) {
    console.error("خطأ في إضافة المعلم:", error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "رقم الهوية موجود مسبقاً" }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: "فشل في إضافة المعلم" 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error("خطأ في جلب المعلمين:", error)
    return NextResponse.json({ 
      error: "فشل في جلب المعلمين" 
    }, { status: 500 })
  }
}



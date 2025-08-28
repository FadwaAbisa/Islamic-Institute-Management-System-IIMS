import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// حذف معلم
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // التحقق من وجود المعلم
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id }
    })
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'المعلم غير موجود' },
        { status: 404 }
      )
    }
    
    // حذف العلاقات أولاً (المواد والمراحل الدراسية)
    await prisma.teacherSubject.deleteMany({
      where: { teacherId: id }
    })
    
    await prisma.teacherStudyLevel.deleteMany({
      where: { teacherId: id }
    })
    
    // حذف المعلم
    await prisma.teacher.delete({
      where: { id }
    })
    
    return NextResponse.json({
      message: 'تم حذف المعلم بنجاح'
    })
    
  } catch (error) {
    console.error('خطأ في حذف المعلم:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء حذف المعلم' },
      { status: 500 }
    )
  }
}

// جلب معلم واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        TeacherSubject: {
          include: {
            Subject: true,
          },
        },
        TeacherStudyLevel: true,
      },
    })
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'المعلم غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ teacher })
    
  } catch (error) {
    console.error('خطأ في جلب المعلم:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب المعلم' },
      { status: 500 }
    )
  }
}

// تحديث معلم
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // التحقق من وجود المعلم
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id }
    })
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'المعلم غير موجود' },
        { status: 404 }
      )
    }
    
    // تحديث بيانات المعلم
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        fullName: body.fullName,
        nationalId: body.nationalId,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        nationality: body.nationality,
        maritalStatus: body.maritalStatus,
        address: body.address,
        phone1: body.phone1,
        phone2: body.phone2,
        emergencyContactName: body.emergencyContactName,
        emergencyContactRelation: body.emergencyContactRelation,
        employmentStatus: body.employmentStatus,
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : undefined,
        serviceStartDate: body.serviceStartDate ? new Date(body.serviceStartDate) : undefined,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
        academicQualification: body.academicQualification,
        educationalInstitution: body.educationalInstitution,
        majorSpecialization: body.majorSpecialization,
        minorSpecialization: body.minorSpecialization,
        graduationYear: body.graduationYear,
      },
    })
    
    return NextResponse.json({
      message: 'تم تحديث المعلم بنجاح',
      teacher: updatedTeacher
    })
    
  } catch (error) {
    console.error('خطأ في تحديث المعلم:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث المعلم' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// تحديث طالب
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // التحقق من وجود الطالب
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'الطالب غير موجود' },
        { status: 404 }
      )
    }
    
    // تحويل القيم إلى الأنواع المطلوبة
    const genderEnum = body.gender === 'ذكر' ? 'MALE' : 'FEMALE'
    const studySystemEnum = body.studySystem === 'نظامي' ? 'REGULAR' : 'DISTANCE'
    const enrollmentStatusEnum = body.registrationStatus === 'مستجد' ? 'NEW' : 'REPEATER'
    const studentStatusEnum = body.status === 'مستمر' ? 'ACTIVE' : 
                             body.status === 'منقطع' ? 'DROPPED' :
                             body.status === 'موقوف' ? 'SUSPENDED' :
                             body.status === 'مطرود' ? 'EXPELLED' : 'PAUSED'
    
    // تحديث الطالب
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        fullName: body.fullName,
        nationalId: body.nationalId,
        sex: genderEnum,
        birthday: body.birthDate ? new Date(body.birthDate) : undefined,
        placeOfBirth: body.birthPlace,
        nationality: body.nationality,
        address: body.address,
        studentPhone: body.phone,
        academicYear: body.academicYear,
        studyLevel: body.stage,
        specialization: body.section,
        studyMode: studySystemEnum,
        enrollmentStatus: enrollmentStatusEnum,
        studentStatus: studentStatusEnum,
        guardianName: body.guardianName,
        relationship: body.guardianRelation,
        guardianPhone: body.guardianPhone,
        previousSchool: body.previousSchool,
        previousLevel: body.previousLevel,
        healthCondition: body.healthStatus,
        chronicDiseases: body.chronicDiseases,
        allergies: body.allergies,
        specialNeeds: body.specialNeeds,
        emergencyContactName: body.emergencyContact,
        emergencyContactPhone: body.emergencyPhone,
        emergencyContactAddress: body.emergencyAddress,
        notes: body.skills,
      }
    })
    
    return NextResponse.json({
      message: 'تم تحديث بيانات الطالب بنجاح',
      student: updatedStudent
    })
    
  } catch (error) {
    console.error('خطأ في تحديث الطالب:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث الطالب' },
      { status: 500 }
    )
  }
}

// حذف طالب
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // التحقق من وجود الطالب
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'الطالب غير موجود' },
        { status: 404 }
      )
    }
    
    // حذف الطالب
    await prisma.student.delete({
      where: { id }
    })
    
    return NextResponse.json({
      message: 'تم حذف الطالب بنجاح'
    })
    
  } catch (error) {
    console.error('خطأ في حذف الطالب:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء حذف الطالب' },
      { status: 500 }
    )
  }
}

// جلب طالب واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        nationalId: true,
        sex: true,
        birthday: true,
        placeOfBirth: true,
        nationality: true,
        address: true,
        studentPhone: true,
        academicYear: true,
        studyLevel: true,
        specialization: true,
        studyMode: true,
        enrollmentStatus: true,
        studentStatus: true,
        guardianName: true,
        relationship: true,
        guardianPhone: true,
        previousSchool: true,
        previousLevel: true,
        healthCondition: true,
        chronicDiseases: true,
        allergies: true,
        specialNeeds: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactAddress: true,
        notes: true,
        studentPhoto: true,
        createdAt: true,
      }
    })
    
    if (!student) {
      return NextResponse.json(
        { error: 'الطالب غير موجود' },
        { status: 404 }
      )
    }
    
    // تحويل البيانات لتتناسب مع الواجهة
    const formattedStudent = {
      id: student.id,
      registrationNumber: '000001', // يمكن حسابها حسب الحاجة
      fullName: student.fullName,
      status: student.studentStatus || 'مستمر',
      academicYear: student.academicYear || 'غير محدد',
      stage: student.studyLevel || 'غير محدد',
      section: student.specialization || 'غير محدد',
      studySystem: student.studyMode === 'REGULAR' ? 'نظامي' : student.studyMode === 'DISTANCE' ? 'انتساب' : 'غير محدد',
      gender: student.sex === 'MALE' ? 'ذكر' : 'أنثى',
      photo: student.studentPhoto,
      nationalId: student.nationalId,
      birthDate: student.birthday ? student.birthday.toISOString().split('T')[0] : '',
      nationality: student.nationality,
      birthPlace: student.placeOfBirth,
      phone: student.studentPhone || '',
      address: student.address,
      guardianName: student.guardianName || '',
      guardianRelation: student.relationship || '',
      guardianPhone: student.guardianPhone || '',
      emergencyContact: student.emergencyContactName || '',
      emergencyPhone: student.emergencyContactPhone || '',
      emergencyAddress: student.emergencyContactAddress || '',
      branch: student.specialization || '',
      registrationDate: student.createdAt ? student.createdAt.toISOString().split('T')[0] : '',
      registrationStatus: student.enrollmentStatus === 'NEW' ? 'مستجد' : student.enrollmentStatus === 'REPEATER' ? 'معيد' : 'غير محدد',
      previousLevel: student.previousLevel || '',
      previousSchool: student.previousSchool || '',
      healthStatus: student.healthCondition || '',
      chronicDiseases: student.chronicDiseases || '',
      allergies: student.allergies || '',
      specialNeeds: student.specialNeeds || '',
      skills: student.notes || '',
    }
    
    return NextResponse.json(formattedStudent)
    
  } catch (error) {
    console.error('خطأ في جلب الطالب:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب الطالب' },
      { status: 500 }
    )
  }
}

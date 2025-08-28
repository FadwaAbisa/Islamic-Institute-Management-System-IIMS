import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      nationalId,
      birthday,
      maritalStatus,
      address,
      phone1,
      appointmentDate,
      serviceStartDate,
      academicQualification,
      educationalInstitution,
      majorSpecialization,
      graduationYear,
    } = body

    // التحقق من البيانات المطلوبة
    if (!fullName || !nationalId || !birthday || !phone1) {
      return NextResponse.json(
        { error: "البيانات المطلوبة غير مكتملة" },
        { status: 400 }
      )
    }

    // التحقق من عدم تكرار الرقم الوطني
    const existingStaff = await prisma.staff.findUnique({
      where: { nationalId },
    })

    if (existingStaff) {
      return NextResponse.json(
        { error: "الرقم الوطني مسجل مسبقاً" },
        { status: 400 }
      )
    }

    // إنشاء الموظف الإداري
    const staffData = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // توليد ID فريد
      fullName: fullName.trim(),
      nationalId: nationalId.trim(),
      birthday: new Date(birthday),
      maritalStatus: maritalStatus && maritalStatus !== '' ? maritalStatus : null,
      address: address?.trim() || null,
      phone1: phone1.trim(),
      appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
      serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : null,
      academicQualification: academicQualification?.trim() || null,
      educationalInstitution: educationalInstitution?.trim() || null,
      majorSpecialization: majorSpecialization?.trim() || null,
      graduationYear: graduationYear && graduationYear.trim() !== '' ? graduationYear.trim() : null,
    }

    console.log("بيانات الموظف المحضرة:", staffData)

    const staff = await prisma.staff.create({
      data: staffData,
    })

    return NextResponse.json(
      { 
        message: "تم إضافة الموظف الإداري بنجاح",
        staff 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("خطأ في إضافة الموظف الإداري:", error)
    
    // رسائل خطأ أكثر تفصيلاً
    let errorMessage = "خطأ في إضافة الموظف الإداري"
    
    if (error.code === 'P2002') {
      errorMessage = "الرقم الوطني مسجل مسبقاً"
    } else if (error.code === 'P2000') {
      errorMessage = "أحد الحقول أطول من الحد المسموح"
    } else if (error.code === 'P2001') {
      errorMessage = "فشل في البحث عن السجل المطلوب"
    } else if (error.code === 'P2003') {
      errorMessage = "فشل في إنشاء العلاقة بين الجداول"
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("خطأ في جلب الموظفين:", error)
    return NextResponse.json(
      { error: "خطأ في جلب الموظفين" },
      { status: 500 }
    )
  }
}

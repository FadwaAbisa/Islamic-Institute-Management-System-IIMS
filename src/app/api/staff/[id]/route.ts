import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// الحصول على موظف واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const staff = await prisma.staff.findUnique({
      where: { id },
    })

    if (!staff) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("خطأ في جلب بيانات الموظف:", error)
    return NextResponse.json(
      { error: "خطأ في جلب بيانات الموظف" },
      { status: 500 }
    )
  }
}

// تحديث موظف
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    // التحقق من عدم تكرار الرقم الوطني مع موظف آخر
    const existingStaff = await prisma.staff.findFirst({
      where: {
        nationalId,
        id: { not: id },
      },
    })

    if (existingStaff) {
      return NextResponse.json(
        { error: "الرقم الوطني مسجل مسبقاً لموظف آخر" },
        { status: 400 }
      )
    }

    // تحديث الموظف
    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: {
        fullName,
        nationalId,
        birthday: new Date(birthday),
        maritalStatus: maritalStatus || null,
        address: address || null,
        phone1,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : null,
        academicQualification: academicQualification || null,
        educationalInstitution: educationalInstitution || null,
        majorSpecialization: majorSpecialization || null,
        graduationYear: graduationYear || null,
      },
    })

    return NextResponse.json({
      message: "تم تحديث بيانات الموظف بنجاح",
      staff: updatedStaff,
    })
  } catch (error) {
    console.error("خطأ في تحديث بيانات الموظف:", error)
    return NextResponse.json(
      { error: "خطأ في تحديث بيانات الموظف" },
      { status: 500 }
    )
  }
}

// حذف موظف
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // التحقق من وجود الموظف
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
    })

    if (!existingStaff) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      )
    }

    // حذف الموظف
    await prisma.staff.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "تم حذف الموظف بنجاح",
    })
  } catch (error) {
    console.error("خطأ في حذف الموظف:", error)
    return NextResponse.json(
      { error: "خطأ في حذف الموظف" },
      { status: 500 }
    )
  }
}

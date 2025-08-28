import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectApiRoute } from "@/lib/routeGuard";
import { hasPermission } from "@/lib/permissions";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

// جلب الطلاب
export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth()
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studyLevel = searchParams.get("studyLevel")
    const specialization = searchParams.get("specialization")

    let whereClause: any = {
      studentStatus: "ACTIVE" // فقط الطلاب النشطين
    }

    if (studyLevel) {
      whereClause.studyLevel = studyLevel
    }

    if (specialization) {
      whereClause.specialization = specialization
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        studentPhoto: true,
        studyLevel: true,
        specialization: true,
        academicYear: true,
        studentStatus: true,
        createdAt: true
      },
      orderBy: {
        fullName: "asc"
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("خطأ في جلب الطلاب:", error)
    return NextResponse.json(
      { error: "خطأ في جلب البيانات" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول لإضافة طالب جديد" },
        { status: 401 }
      );
    }

    // الحصول على الدور من Clerk API مباشرة
    let userRole: string | undefined;
    try {
      const { clerkClient } = await import('@clerk/nextjs/server');
      const user = await clerkClient.users.getUser(userId);
      userRole = (user.publicMetadata as { role?: string })?.role;
      console.log('=== DEBUG STUDENTS API ===');
      console.log('User ID:', userId);
      console.log('Role from Clerk API:', userRole);
    } catch (apiError) {
      console.log('Could not get user from Clerk API:', apiError);
      // Fallback to session claims
      userRole = (sessionClaims?.publicMetadata as { role?: string })?.role;
      console.log('Role from session claims:', userRole);
    }

    // التحقق من الدور
    if (!userRole) {
      return NextResponse.json(
        { error: "لم يتم تحديد دور المستخدم" },
        { status: 403 }
      );
    }

    // التحقق من الأدوار المسموحة
    if (!['admin', 'staff'].includes(userRole)) {
      return NextResponse.json(
        { error: "لا تملك صلاحية لإضافة طلاب جدد" },
        { status: 403 }
      );
    }

    if (!hasPermission(userRole as any, 'manage_students')) {
      return NextResponse.json(
        { error: "لا تملك صلاحية لإضافة طلاب جدد" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // التحقق من البيانات المطلوبة الأساسية
    if (!body.fullName || !body.nationalId) {
      return NextResponse.json(
        { error: "الاسم الرباعي والرقم الوطني مطلوبان" },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود طالب بنفس الرقم الوطني
    const existingStudent = await prisma.student.findUnique({
      where: { nationalId: body.nationalId }
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "يوجد طالب بنفس الرقم الوطني" },
        { status: 409 }
      );
    }

    // إنشاء الطالب مع البيانات المتوفرة في السكيما
    const newStudent = await prisma.student.create({
      data: {
        fullName: body.fullName,
        nationalId: body.nationalId,
        birthday: body.birthDate ? new Date(body.birthDate) : new Date(),
        placeOfBirth: body.birthPlace || '',
        address: body.address || '',
        nationality: body.nationality || '',
        studentPhone: body.studentPhone || null,
        academicYear: body.academicYear || null,
        studyLevel: body.studyLevel || null,
        specialization: body.specialization || null,
        studyMode: body.studyMode || null,
        enrollmentStatus: body.enrollmentStatus || null,
        studentStatus: body.studentStatus || null,
        guardianName: body.guardianName || null,
        relationship: body.relationship || null,
        guardianPhone: body.guardianPhone || null,
        previousSchool: body.previousSchool || null,
        previousLevel: body.previousLevel || null,
        healthCondition: body.healthCondition || null,
        chronicDiseases: body.chronicDiseases || null,
        allergies: body.allergies || null,
        specialNeeds: body.specialNeeds || null,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        emergencyContactAddress: body.emergencyContactAddress || null,
        notes: body.notes || null,
        // حقول المستندات (تخزين كمسارات أو URLs)
        studentPhoto: null,
        nationalIdCopy: null,
        birthCertificate: null,
        educationForm: null,
        equivalencyDocument: null,
        otherDocuments: Prisma.JsonNull
      } as any
    });

    return NextResponse.json(
      {
        message: "تم إضافة الطالب بنجاح",
        student: newStudent
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("خطأ في إضافة الطالب:", error);
    return NextResponse.json(
      { error: "خطأ في إضافة الطالب" },
      { status: 500 }
    );
  }
}
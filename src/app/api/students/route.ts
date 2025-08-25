import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectApiRoute } from "@/lib/routeGuard";
import { hasPermission } from "@/lib/permissions";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // حماية المسار
    const guardResult = await protectApiRoute(request, {
      allowedRoles: ['admin', 'staff', 'teacher']
    });

    if (guardResult) {
      return guardResult;
    }

    // الحصول على معلومات المستخدم
    const { userId, sessionClaims } = await auth();
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;

    // التحقق من الصلاحيات
    if (!hasPermission(userRole as any, 'manage_students') && 
        !hasPermission(userRole as any, 'view_students')) {
      return NextResponse.json(
        { error: "لا تملك صلاحية للوصول لبيانات الطلاب" },
        { status: 403 }
      );
    }

    // بناء شروط البحث بناءً على دور المستخدم
    let whereCondition: any = {};

    switch (userRole) {
      case "admin":
        // المدير يرى جميع الطلاب
        break;
      case "staff":
        // الموظف الإداري يرى جميع الطلاب
        break;
      case "teacher":
        // المعلم يرى الطلاب في فصوله فقط
        if (userId) {
          const teacherClasses = await prisma.lesson.findMany({
            where: { teacherId: userId },
            select: { classId: true }
          });
          const classIds = teacherClasses.map(l => l.classId);
          if (classIds.length > 0) {
            whereCondition.classId = { in: classIds };
          }
        }
        break;
      default:
      return NextResponse.json(
          { error: "دور المستخدم غير محدد" },
          { status: 400 }
        );
    }

    // جلب الطلاب
    const students = await prisma.student.findMany({
      where: whereCondition,
      include: {
        grade: true,
        class: true,
        parent: true,
        _count: {
          select: {
            attendances: true
          }
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    return NextResponse.json(students);

  } catch (error) {
    console.error("خطأ في جلب الطلاب:", error);
    return NextResponse.json(
      { error: "خطأ في جلب بيانات الطلاب" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // حماية المسار - فقط المدير والموظف الإداري
    const guardResult = await protectApiRoute(request, {
      allowedRoles: ['admin', 'staff']
    });

    if (guardResult) {
      return guardResult;
    }

    // التحقق من الصلاحية
    const { userId, sessionClaims } = await auth();
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;

    if (!hasPermission(userRole as any, 'manage_students')) {
      return NextResponse.json(
        { error: "لا تملك صلاحية لإضافة طلاب جدد" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.fullName || !body.nationalId || !body.classId || !body.gradeId) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
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

    // التحقق من سعة الفصل
    const classInfo = await prisma.class.findUnique({
      where: { id: body.classId },
      include: { _count: { select: { students: true } } }
    });

    if (!classInfo) {
      return NextResponse.json(
        { error: "الفصل غير موجود" },
        { status: 404 }
      );
    }

    if (classInfo._count.students >= classInfo.capacity) {
      return NextResponse.json(
        { error: "الفصل ممتلئ" },
        { status: 400 }
      );
    }

    // إنشاء الطالب
    const newStudent = await prisma.student.create({
      data: {
        fullName: body.fullName,
        nationalId: body.nationalId,
        sex: body.sex,
        birthday: new Date(body.birthday),
        placeOfBirth: body.placeOfBirth,
        nationality: body.nationality,
        address: body.address,
        studentPhone: body.studentPhone,
        academicYear: body.academicYear,
        studyLevel: body.studyLevel,
        specialization: body.specialization,
        studyMode: body.studyMode,
        enrollmentStatus: body.enrollmentStatus,
        studentStatus: body.studentStatus,
        guardianName: body.guardianName,
        relationship: body.relationship,
        guardianPhone: body.guardianPhone,
        previousSchool: body.previousSchool,
        previousLevel: body.previousLevel,
        healthCondition: body.healthCondition,
        chronicDiseases: body.chronicDiseases,
        allergies: body.allergies,
        specialNeeds: body.specialNeeds,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        gradeId: body.gradeId,
        classId: body.classId,
        parentId: body.parentId
      },
      include: {
        grade: true,
        class: true,
        parent: true
      }
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
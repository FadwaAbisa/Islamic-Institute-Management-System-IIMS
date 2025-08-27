import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectApiRoute } from "@/lib/routeGuard";
import { hasPermission } from "@/lib/permissions";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول للوصول لبيانات الطلاب" },
        { status: 401 }
      );
    }

    // الحصول على الدور من Clerk API مباشرة
    let userRole: string | undefined;
    try {
      const { clerkClient } = await import('@clerk/nextjs/server');
      const user = await clerkClient.users.getUser(userId);
      userRole = (user.publicMetadata as { role?: string })?.role;
      console.log('=== DEBUG STUDENTS GET API ===');
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
        // المعلم يرى جميع الطلاب مؤقتاً (لعدم وجود نموذج Class)
        break;
      default:
        return NextResponse.json(
          { error: "دور المستخدم غير محدد" },
          { status: 400 }
        );
    }

    // الحصول على query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const academicYear = searchParams.get('academicYear');
    const studyLevel = searchParams.get('studyLevel');
    const studentStatus = searchParams.get('studentStatus');
    const enrollmentStatus = searchParams.get('enrollmentStatus');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // بناء شروط البحث
    if (search) {
      whereCondition.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
        { guardianName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (academicYear) {
      whereCondition.academicYear = academicYear;
    }

    if (studyLevel) {
      whereCondition.studyLevel = studyLevel;
    }

    if (studentStatus) {
      whereCondition.studentStatus = studentStatus;
    }

    if (enrollmentStatus) {
      whereCondition.enrollmentStatus = enrollmentStatus;
    }

    // حساب offset للصفحات
    const offset = (page - 1) * limit;

    // جلب الطلاب مع الفلاتر والصفحات
    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereCondition,
        include: {
          _count: {
            select: {
              attendances: true
            }
          }
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { fullName: 'asc' },
        skip: offset,
        take: limit,
      }),
      prisma.student.count({ where: whereCondition })
    ]);

    // حساب إجمالي الصفحات
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      students,
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit
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
        studentPhone: body.studentPhone || '',
        academicYear: body.academicYear || '',
        studyLevel: body.studyLevel || null,
        specialization: body.specialization || '',
        studyMode: body.studyMode || null,
        enrollmentStatus: body.enrollmentStatus || null,
        studentStatus: body.studentStatus || null,
        guardianName: body.guardianName || '',
        relationship: body.relationship || '',
        guardianPhone: body.guardianPhone || '',
        previousSchool: body.previousSchool || '',
        previousLevel: body.previousLevel || '',
        healthCondition: body.healthCondition || '',
        chronicDiseases: body.chronicDiseases || '',
        allergies: body.allergies || '',
        specialNeeds: body.specialNeeds || '',
        emergencyContactName: body.emergencyContactName || '',
        emergencyContactPhone: body.emergencyContactPhone || '',
        emergencyContactAddress: body.emergencyContactAddress || '',
        notes: body.notes || '',
        // حقول المستندات (تخزين كمسارات أو URLs)
        studentPhoto: null,
        nationalIdCopy: null,
        birthCertificate: null,
        educationForm: null,
        equivalencyDocument: null,
        otherDocuments: undefined
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
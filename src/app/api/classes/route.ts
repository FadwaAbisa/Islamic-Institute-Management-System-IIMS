import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studyLevel = searchParams.get("studyLevel");
    const teacherId = searchParams.get("teacherId");

    let whereCondition: any = {};

    // إضافة شرط السنة الدراسية
    if (studyLevel) {
      whereCondition.studyLevel = studyLevel;
    }

    // شروط الصلاحيات
    switch (role) {
      case "admin":
        break;
      case "teacher":
        if (teacherId) {
          whereCondition.teacherId = teacherId;
        }
        break;
      default:
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // جلب الفصول من قاعدة البيانات
    // ملاحظة: هذا مثال بسيط، يمكن تحديثه حسب هيكل قاعدة البيانات الفعلي
    const classes = await prisma.student.groupBy({
      by: ['studyLevel'],
      where: whereCondition,
      _count: {
        id: true
      }
    });

    // تحويل البيانات إلى الشكل المطلوب
    const formattedClasses = classes.map((cls, index) => ({
      id: cls.studyLevel || `class-${index}`,
      name: getClassName(cls.studyLevel || ''),
      studentCount: cls._count.id,
      studyLevel: cls.studyLevel
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error("خطأ في جلب الفصول:", error);
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
}

// دالة لتحويل السنة الدراسية إلى اسم الفصل
function getClassName(studyLevel: string): string {
  switch (studyLevel) {
    case "FIRST_YEAR":
      return "السنة الأولى";
    case "SECOND_YEAR":
      return "السنة الثانية";
    case "THIRD_YEAR":
      return "السنة الثالثة";
    case "GRADUATION":
      return "سنة التخرج";
    default:
      return studyLevel;
  }
}

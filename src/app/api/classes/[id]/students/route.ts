import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const classId = params.id;

    // جلب الطلاب في الفصل المحدد
    const students = await prisma.student.findMany({
      where: {
        studyLevel: classId, // استخدام studyLevel كمعرف للفصل
      },
      select: {
        id: true,
        fullName: true,
        studyLevel: true,
        academicYear: true,
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    // تحويل البيانات إلى الشكل المطلوب
    const formattedStudents = students.map(student => ({
      id: student.id,
      fullName: student.fullName,
      class: {
        name: getClassName(student.studyLevel || '')
      }
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error("خطأ في جلب الطلاب:", error);
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







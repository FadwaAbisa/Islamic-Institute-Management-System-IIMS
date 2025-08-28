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
    const date = searchParams.get("date");
    const classId = searchParams.get("classId");

    if (!date) {
      return NextResponse.json({ error: "التاريخ مطلوب" }, { status: 400 });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    let whereCondition: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    };

    // إضافة شرط الفصل إذا تم تحديده
    if (classId) {
      whereCondition.student = {
        studyLevel: classId
      };
    }

    // شروط الصلاحيات
    switch (role) {
      case "admin":
        break;
      case "teacher":
        whereCondition.lesson = {
          teacherId: userId
        };
        break;
      case "student":
        whereCondition.studentId = userId;
        break;
      case "parent":
        whereCondition.student = {
          ...whereCondition.student,
          parentId: userId
        };
        break;
      default:
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // جلب سجلات الحضور
    const attendanceRecords = await prisma.attendance.findMany({
      where: whereCondition,
      include: {
        student: {
          select: {
            studyLevel: true
          }
        }
      }
    });

    // حساب الإحصائيات
    const totalStudents = attendanceRecords.length;
    const present = attendanceRecords.filter(record => record.present).length;
    const absent = totalStudents - present;
    const attendanceRate = totalStudents > 0 ? (present / totalStudents) * 100 : 0;

    // حساب معدل الحضور لليوم السابق للمقارنة
    const previousDate = new Date(targetDate);
    previousDate.setDate(previousDate.getDate() - 1);
    
    const previousStartOfDay = new Date(previousDate.setHours(0, 0, 0, 0));
    const previousEndOfDay = new Date(previousDate.setHours(23, 59, 59, 999));

    const previousWhereCondition = {
      ...whereCondition,
      date: {
        gte: previousStartOfDay,
        lte: previousEndOfDay
      }
    };

    const previousRecords = await prisma.attendance.findMany({
      where: previousWhereCondition
    });

    const previousTotal = previousRecords.length;
    const previousPresent = previousRecords.filter(record => record.present).length;
    const previousRate = previousTotal > 0 ? (previousPresent / previousTotal) * 100 : 0;

    // تحديد الاتجاه
    let trend: "up" | "down" | "stable" = "stable";
    if (attendanceRate > previousRate + 5) {
      trend = "up";
    } else if (attendanceRate < previousRate - 5) {
      trend = "down";
    }

    const stats = {
      totalStudents,
      present,
      absent,
      attendanceRate,
      previousDayRate: previousRate,
      trend
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("خطأ في جلب إحصائيات الحضور:", error);
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
}



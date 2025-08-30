import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // جلب إحصائيات النجاح لكل مرحلة دراسية وفترة
    const academicStats = await prisma.subjectGrade.findMany({
      include: {
        Student: {
          select: {
            studyLevel: true,
            academicYear: true,
          },
        },
      },
    });

    // تجميع البيانات حسب المرحلة والفترة
    const statsMap = new Map();

    academicStats.forEach((grade) => {
      const studyLevel = grade.Student?.studyLevel;
      const period = grade.period;
      
      if (!studyLevel || !period) return;

      const key = `${studyLevel}-${period}`;
      
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          studyLevel,
          period,
          total: 0,
          passed: 0,
        });
      }

      const stat = statsMap.get(key);
      stat.total++;
      
      // اعتبار الطالب ناجح إذا كان مجموع الفترة أكبر من أو يساوي 50
      if (grade.periodTotal >= 50) {
        stat.passed++;
      }
    });

    // تحويل البيانات إلى تنسيق مناسب للرسم البياني
    const chartData = [
      { name: "السنة الأولى" },
      { name: "السنة الثانية" },
      { name: "السنة الثالثة" },
    ];

    // حساب معدلات النجاح لكل مرحلة وفترة
    ["FIRST_YEAR", "SECOND_YEAR", "THIRD_YEAR"].forEach((level, index) => {
      ["FIRST", "SECOND", "THIRD"].forEach((period) => {
        const key = `${level}-${period}`;
        const stat = statsMap.get(key);
        
        let successRate = 0;
        if (stat && stat.total > 0) {
          successRate = Math.round((stat.passed / stat.total) * 100);
        }

        const periodName = period === "FIRST" ? "الفترة الأولى" : 
                          period === "SECOND" ? "الفترة الثانية" : "الفترة الثالثة";
        
        chartData[index][periodName] = successRate;
      });
    });

    // إضافة إحصائيات إجمالية
    const totalStats = {
      totalStudents: new Set(academicStats.map(g => g.studentId)).size,
      totalGrades: academicStats.length,
      overallSuccessRate: 0,
    };

    const totalPassed = academicStats.filter(g => g.periodTotal >= 50).length;
    if (academicStats.length > 0) {
      totalStats.overallSuccessRate = Math.round((totalPassed / academicStats.length) * 100);
    }

    return NextResponse.json({
      chartData,
      totalStats,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error fetching academic stats:", error);
    return NextResponse.json(
      { error: "فشل في جلب الإحصائيات الأكاديمية" },
      { status: 500 }
    );
  }
}

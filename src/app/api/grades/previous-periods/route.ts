import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API للحصول على درجات الفترات السابقة للطلاب
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const studentIds = url.searchParams.get("studentIds")?.split(',') || [];
        const subjectName = url.searchParams.get("subject");
        const academicYear = url.searchParams.get("academicYear");

        console.log("🔍 طلب درجات الفترات السابقة:", { studentIds, subjectName, academicYear });

        if (!subjectName || !academicYear || studentIds.length === 0) {
            return NextResponse.json({
                error: "يجب توفير أسماء الطلاب والمادة والعام الدراسي"
            }, { status: 400 });
        }

        // البحث عن المادة
        const subject = await prisma.subject.findUnique({
            where: { name: subjectName }
        });

        if (!subject) {
            return NextResponse.json({
                error: "المادة غير موجودة"
            }, { status: 404 });
        }

        // جلب درجات الفترتين الأولى والثانية
        const previousGrades = await prisma.subjectGrade.findMany({
            where: {
                studentId: { in: studentIds },
                subjectId: subject.id,
                academicYear: academicYear,
                period: { in: ["FIRST", "SECOND"] }
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fullName: true,
                        nationalId: true
                    }
                }
            }
        });

        // تنظيم البيانات حسب الطالب
        const studentGradesMap: Record<string, {
            studentInfo: any;
            firstPeriod: any | null;
            secondPeriod: any | null;
            firstPeriodTotal: number;
            secondPeriodTotal: number;
            combinedTotal: number;
        }> = {};

        // تهيئة البيانات لجميع الطلاب
        studentIds.forEach(studentId => {
            const student = previousGrades.find(g => g.studentId === studentId)?.Student;
            if (student) {
                studentGradesMap[studentId] = {
                    studentInfo: student,
                    firstPeriod: null,
                    secondPeriod: null,
                    firstPeriodTotal: 0,
                    secondPeriodTotal: 0,
                    combinedTotal: 0
                };
            }
        });

        // ملء البيانات
        previousGrades.forEach(grade => {
            const studentData = studentGradesMap[grade.studentId];
            if (studentData) {
                const periodData = {
                    month1: grade.month1,
                    month2: grade.month2,
                    month3: grade.month3,
                    periodExam: grade.finalExam,
                    workTotal: grade.workTotal,
                    periodTotal: grade.periodTotal
                };

                if (grade.period === "FIRST") {
                    studentData.firstPeriod = periodData;
                    studentData.firstPeriodTotal = grade.periodTotal || 0;
                } else if (grade.period === "SECOND") {
                    studentData.secondPeriod = periodData;
                    studentData.secondPeriodTotal = grade.periodTotal || 0;
                }

                // حساب المجموع المركب
                studentData.combinedTotal = studentData.firstPeriodTotal + studentData.secondPeriodTotal;
            }
        });

        console.log(`✅ تم جلب درجات ${Object.keys(studentGradesMap).length} طالب`);

        return NextResponse.json({
            success: true,
            previousGrades: studentGradesMap,
            subject: subjectName,
            academicYear: academicYear
        });

    } catch (error) {
        console.error("❌ خطأ في جلب درجات الفترات السابقة:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

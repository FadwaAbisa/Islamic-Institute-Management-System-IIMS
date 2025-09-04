import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { grades } = body;

        if (!grades || !Array.isArray(grades)) {
            return NextResponse.json({ error: "بيانات الدرجات مطلوبة" }, { status: 400 });
        }

        console.log(`💾 حفظ ${grades.length} مجموعة درجات`);
        console.log("🔍 عينة من البيانات:", grades.slice(0, 2));

        const savedGrades = [];

        for (const gradeData of grades) {
            console.log(`🔍 معالجة طالب:`, gradeData);
            try {
                // البحث عن الطالب
                const student = await prisma.student.findUnique({
                    where: { id: gradeData.studentId }
                });

                if (!student) {
                    console.warn(`⚠️ الطالب غير موجود: ${gradeData.studentId}`);
                    continue;
                }

                // البحث عن المادة
                const subject = await prisma.subject.findUnique({
                    where: { name: gradeData.subjectName }
                });

                if (!subject) {
                    console.warn(`⚠️ المادة غير موجودة: ${gradeData.subjectName}`);
                    continue;
                }

                // تحويل period إلى enum
                let periodEnum: "FIRST" | "SECOND" | "THIRD";
                switch (gradeData.period) {
                    case "FIRST":
                    case "الفترة الأولى":
                        periodEnum = "FIRST";
                        break;
                    case "SECOND":
                    case "الفترة الثانية":
                        periodEnum = "SECOND";
                        break;
                    case "THIRD":
                    case "الفترة الثالثة":
                        periodEnum = "THIRD";
                        break;
                    default:
                        console.warn(`⚠️ قيمة period غير صحيحة: ${gradeData.period}`);
                        continue;
                }

                // حفظ أو تحديث الدرجات
                const savedGrade = await prisma.subjectGrade.upsert({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: gradeData.academicYear,
                            period: periodEnum
                        }
                    },
                    update: {
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        finalExam: gradeData.finalExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal,
                        percentage: gradeData.percentage,
                        grade: gradeData.grade,
                        gradeColor: gradeData.gradeColor
                    },
                    create: {
                        studentId: student.id,
                        subjectId: subject.id,
                        academicYear: gradeData.academicYear,
                        period: periodEnum,
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        finalExam: gradeData.finalExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal,
                        percentage: gradeData.percentage,
                        grade: gradeData.grade,
                        gradeColor: gradeData.gradeColor
                    }
                });

                savedGrades.push(savedGrade);
                console.log(`✅ تم حفظ درجات ${student.fullName} في ${subject.name}`);

            } catch (error) {
                console.error(`❌ خطأ في حفظ الدرجات:`, error);
                continue;
            }
        }

        return NextResponse.json({
            message: `تم حفظ ${savedGrades.length} مجموعة درجات بنجاح`,
            savedGrades: savedGrades.length
        });

    } catch (error) {
        console.error("❌ خطأ في حفظ الدرجات:", error);
        return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");
        const subjectName = searchParams.get("subjectName");
        const academicYear = searchParams.get("academicYear");
        const period = searchParams.get("period");

        if (!studentId || !subjectName || !academicYear || !period) {
            return NextResponse.json({ error: "جميع المعاملات مطلوبة" }, { status: 400 });
        }

        // البحث عن الدرجات
        const grades = await prisma.subjectGrade.findMany({
            where: {
                student: { id: studentId },
                subject: { name: subjectName },
                academicYear,
                period: period as any
            },
            include: {
                student: { select: { fullName: true } },
                subject: { select: { name: true } }
            }
        });

        return NextResponse.json({ grades });

    } catch (error) {
        console.error("❌ خطأ في جلب الدرجات:", error);
        return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
    }
}

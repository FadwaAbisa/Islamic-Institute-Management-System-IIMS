import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { defaultGradeDistributions } from "@/lib/flexible-grade-distributions";

const prisma = new PrismaClient();

// دالة التحقق من صحة الدرجة مع التقيد بنظام التوزيع المرن
function validateGradeWithFlexibleSystem(
    grade: number,
    field: 'monthly' | 'exam',
    subjectName: string,
    period: string
): { isValid: boolean; error?: string; maxGrade?: number } {
    // البحث عن التوزيع المناسب
    const distribution = defaultGradeDistributions.find(
        dist => dist.educationLevel === "السنة الأولى" && dist.studySystem === "نظامي"
    );

    if (!distribution) {
        return { isValid: false, error: "نظام التوزيع المرن غير محدد" };
    }

    const periodKey = period === "الفترة الأولى" ? "firstPeriod" : 
                     period === "الفترة الثانية" ? "secondPeriod" : "thirdPeriod";
    const periodConfig = distribution.periods[periodKey];

    if (!periodConfig) {
        return { isValid: false, error: "إعدادات الفترة غير موجودة" };
    }

    let maxGrade = 0;
    if (field === 'monthly') {
        maxGrade = periodConfig.monthlyGrade;
    } else if (field === 'exam') {
        maxGrade = periodConfig.periodExam;
    }

    // التحقق من عدم تجاوز الحد الأقصى
    if (grade > maxGrade) {
        return { 
            isValid: false, 
            error: `الدرجة لا يمكن أن تتجاوز ${maxGrade} في ${field === 'monthly' ? 'الشهر' : 'امتحان الفترة'}`,
            maxGrade 
        };
    }

    return { isValid: true, maxGrade };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { grades } = body;

        if (!grades || !Array.isArray(grades)) {
            return NextResponse.json({ error: "بيانات الدرجات مطلوبة" }, { status: 400 });
        }

        console.log(`💾 حفظ ${grades.length} مجموعة درجات`);
        console.log("🔍 عينة من البيانات:", grades.slice(0, 2));
        console.log("🔍 تفاصيل البيانات المرسلة:", JSON.stringify(grades, null, 2));

        const savedGrades = [];

        for (const gradeData of grades) {
            console.log(`🔍 معالجة طالب:`, gradeData);
            try {
                // التحقق من صحة الدرجات مع النظام المرن
                const validationErrors = [];
                
                // التحقق من درجات الأشهر
                if (gradeData.month1 !== null && gradeData.month1 !== undefined) {
                    const month1Validation = validateGradeWithFlexibleSystem(gradeData.month1, 'monthly', gradeData.subjectName, gradeData.period);
                    if (!month1Validation.isValid) {
                        validationErrors.push(`الشهر الأول: ${month1Validation.error}`);
                    }
                }
                
                if (gradeData.month2 !== null && gradeData.month2 !== undefined) {
                    const month2Validation = validateGradeWithFlexibleSystem(gradeData.month2, 'monthly', gradeData.subjectName, gradeData.period);
                    if (!month2Validation.isValid) {
                        validationErrors.push(`الشهر الثاني: ${month2Validation.error}`);
                    }
                }
                
                if (gradeData.month3 !== null && gradeData.month3 !== undefined) {
                    const month3Validation = validateGradeWithFlexibleSystem(gradeData.month3, 'monthly', gradeData.subjectName, gradeData.period);
                    if (!month3Validation.isValid) {
                        validationErrors.push(`الشهر الثالث: ${month3Validation.error}`);
                    }
                }
                
                // التحقق من درجة امتحان الفترة
                if (gradeData.periodExam !== null && gradeData.periodExam !== undefined) {
                    const examValidation = validateGradeWithFlexibleSystem(gradeData.periodExam, 'exam', gradeData.subjectName, gradeData.period);
                    if (!examValidation.isValid) {
                        validationErrors.push(`امتحان الفترة: ${examValidation.error}`);
                    }
                }
                
                // إذا كانت هناك أخطاء في التحقق، تجاهل هذه الدرجة
                if (validationErrors.length > 0) {
                    console.warn(`⚠️ تم رفض الدرجات للطالب ${gradeData.studentId}:`, validationErrors);
                    continue;
                }

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
                        finalExam: gradeData.periodExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal,
                        percentage: gradeData.percentage,
                        grade: gradeData.grade,
                        gradeColor: gradeData.gradeColor,
                        updatedAt: new Date()
                    },
                    create: {
                        studentId: student.id,
                        subjectId: subject.id,
                        academicYear: gradeData.academicYear,
                        period: periodEnum,
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        finalExam: gradeData.periodExam,
                        workTotal: gradeData.workTotal,
                        periodTotal: gradeData.periodTotal,
                        percentage: gradeData.percentage,
                        grade: gradeData.grade,
                        gradeColor: gradeData.gradeColor,
                        updatedAt: new Date()
                    }
                });

                savedGrades.push(savedGrade);
                console.log(`✅ تم حفظ درجات ${student.fullName} في ${subject.name}`);
                console.log(`🔍 تفاصيل الدرجة المحفوظة:`, {
                    studentId: savedGrade.studentId,
                    subjectId: savedGrade.subjectId,
                    academicYear: savedGrade.academicYear,
                    period: savedGrade.period,
                    month1: savedGrade.month1,
                    month2: savedGrade.month2,
                    month3: savedGrade.month3,
                    finalExam: savedGrade.finalExam,
                    periodTotal: savedGrade.periodTotal
                });
                
                // التحقق من أن البيانات محفوظة بشكل صحيح
                const verifyGrade = await prisma.subjectGrade.findUnique({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: gradeData.academicYear,
                            period: periodEnum
                        }
                    }
                });
                
                if (verifyGrade) {
                    console.log(`✅ تم التحقق من حفظ الدرجة:`, verifyGrade);
                } else {
                    console.error(`❌ فشل في التحقق من حفظ الدرجة للطالب ${student.fullName}`);
                }

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

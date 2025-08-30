import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getGradeDistribution, validateGrade, calculateTotals, getStudentRestrictions } from "@/lib/grade-distributions";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { grades, academicYear, subjectName, period } = body;

        if (!grades || !Array.isArray(grades)) {
            return NextResponse.json({ error: "بيانات الدرجات مطلوبة" }, { status: 400 });
        }

        if (!academicYear || !subjectName || !period) {
            return NextResponse.json({ error: "المعايير الأساسية مطلوبة (العام، المادة، الفترة)" }, { status: 400 });
        }

        console.log(`💾 حفظ ${grades.length} مجموعة درجات محسنة`);
        console.log("🔍 المعايير:", { academicYear, subjectName, period });

        const savedGrades = [];
        const errors = [];
        const warnings = [];

        for (const gradeData of grades) {
            try {
                console.log(`🔍 معالجة طالب:`, gradeData);

                // البحث عن الطالب مع التحقق من البيانات الأساسية
                const student = await prisma.student.findUnique({
                    where: { id: gradeData.studentId },
                    select: {
                        id: true,
                        studentNumber: true,
                        fullName: true,
                        academicYear: true,
                        studyLevel: true,
                        studyMode: true,
                        specialization: true,
                        isDiploma: true
                    }
                });

                if (!student) {
                    errors.push(`الطالب غير موجود: ${gradeData.studentId}`);
                    continue;
                }

                // التحقق من قيود الطالب
                const restrictions = getStudentRestrictions(
                    student.studyLevel || "",
                    student.studyMode || "",
                    student.isDiploma || false
                );

                if (!restrictions.canEnterGrades) {
                    errors.push(`لا يمكن إدخال درجات للطالب ${student.fullName}: ${restrictions.restrictions.join(", ")}`);
                    continue;
                }

                // التحقق من صحة الفترة للطالب
                if (!restrictions.availablePeriods.includes(period)) {
                    errors.push(`الفترة ${period} غير متاحة للطالب ${student.fullName}`);
                    continue;
                }

                // البحث عن المادة
                const subject = await prisma.subject.findUnique({
                    where: { name: subjectName }
                });

                if (!subject) {
                    errors.push(`المادة غير موجودة: ${subjectName}`);
                    continue;
                }

                // الحصول على توزيع الدرجات للمادة
                const distribution = getGradeDistribution(subjectName, student.studyLevel || "");
                if (!distribution) {
                    errors.push(`توزيع الدرجات غير متاح للمادة ${subjectName} في المرحلة ${student.studyLevel}`);
                    continue;
                }

                // التحقق من صحة الدرجات المدخلة
                const validationErrors = [];

                if (gradeData.month1 !== null && gradeData.month1 !== undefined) {
                    const validation = validateGrade(gradeData.month1, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الأول: ${validation.error}`);
                    }
                }

                if (gradeData.month2 !== null && gradeData.month2 !== undefined) {
                    const validation = validateGrade(gradeData.month2, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الثاني: ${validation.error}`);
                    }
                }

                if (gradeData.month3 !== null && gradeData.month3 !== undefined) {
                    const validation = validateGrade(gradeData.month3, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الثالث: ${validation.error}`);
                    }
                }

                if (gradeData.periodExam !== null && gradeData.periodExam !== undefined) {
                    const validation = validateGrade(gradeData.periodExam, distribution.periodExam, 'exam');
                    if (!validation.isValid) {
                        validationErrors.push(`الامتحان: ${validation.error}`);
                    }
                }

                if (validationErrors.length > 0) {
                    errors.push(`${student.fullName}: ${validationErrors.join(", ")}`);
                    continue;
                }

                // حساب المجاميع
                const totals = calculateTotals(
                    gradeData.month1,
                    gradeData.month2,
                    gradeData.month3,
                    gradeData.periodExam,
                    distribution
                );

                // تحويل period إلى enum
                let periodEnum: "FIRST" | "SECOND" | "THIRD";
                switch (period) {
                    case "الفترة الأولى":
                        periodEnum = "FIRST";
                        break;
                    case "الفترة الثانية":
                        periodEnum = "SECOND";
                        break;
                    case "الفترة الثالثة":
                        periodEnum = "THIRD";
                        break;
                    default:
                        errors.push(`فترة غير صحيحة: ${period}`);
                        continue;
                }

                // التحقق من وجود درجات سابقة
                const existingGrade = await prisma.subjectGrade.findUnique({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: academicYear,
                            period: periodEnum
                        }
                    }
                });

                if (existingGrade) {
                    warnings.push(`تم تحديث درجات الطالب ${student.fullName} بدلاً من إنشاء جديدة`);
                }

                // حفظ أو تحديث الدرجات
                const savedGrade = await prisma.subjectGrade.upsert({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: academicYear,
                            period: periodEnum
                        }
                    },
                    update: {
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        workTotal: totals.workTotal,
                        finalExam: gradeData.periodExam,
                        periodTotal: totals.periodTotal,
                        updatedAt: new Date()
                    },
                    create: {
                        studentId: student.id,
                        subjectId: subject.id,
                        academicYear: academicYear,
                        period: periodEnum,
                        month1: gradeData.month1,
                        month2: gradeData.month2,
                        month3: gradeData.month3,
                        workTotal: totals.workTotal,
                        finalExam: gradeData.periodExam,
                        periodTotal: totals.periodTotal,
                        updatedAt: new Date()
                    }
                });

                savedGrades.push(savedGrade);
                console.log(`✅ تم حفظ درجات الطالب: ${student.fullName}`);

            } catch (error) {
                console.error(`❌ خطأ في معالجة طالب:`, error);
                errors.push(`خطأ في معالجة الطالب: ${error}`);
            }
        }

        console.log(`✅ تم حفظ ${savedGrades.length} درجة بنجاح`);
        console.log(`⚠️ ${errors.length} أخطاء، ${warnings.length} تحذيرات`);

        return NextResponse.json({
            success: true,
            message: `تم حفظ ${savedGrades.length} درجة بنجاح`,
            savedCount: savedGrades.length,
            totalCount: grades.length,
            errors: errors,
            warnings: warnings,
            data: savedGrades
        });

    } catch (error) {
        console.error("❌ خطأ عام في حفظ الدرجات:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const academicYear = url.searchParams.get("academicYear");
        const educationLevel = url.searchParams.get("educationLevel");
        const studySystem = url.searchParams.get("studySystem");
        const subjectName = url.searchParams.get("subject");
        const period = url.searchParams.get("period");

        console.log("🔍 استعلام الدرجات:", { academicYear, educationLevel, studySystem, subjectName, period });

        if (!academicYear || !educationLevel || !studySystem || !subjectName) {
            return NextResponse.json({ error: "المعايير الأساسية مطلوبة" }, { status: 400 });
        }

        // تحويل المرحلة التعليمية
        let studyLevelEnum: "FIRST_YEAR" | "SECOND_YEAR" | "THIRD_YEAR" | "GRADUATION";
        switch (educationLevel) {
            case "السنة الأولى":
                studyLevelEnum = "FIRST_YEAR";
                break;
            case "السنة الثانية":
                studyLevelEnum = "SECOND_YEAR";
                break;
            case "السنة الثالثة":
                studyLevelEnum = "THIRD_YEAR";
                break;
            case "التخرج":
                studyLevelEnum = "GRADUATION";
                break;
            default:
                return NextResponse.json({ error: "مرحلة تعليمية غير صحيحة" }, { status: 400 });
        }

        // تحويل نظام الدراسة
        let studyModeEnum: "REGULAR" | "CORRESPONDENCE";
        switch (studySystem) {
            case "نظامي":
                studyModeEnum = "REGULAR";
                break;
            case "انتساب":
                studyModeEnum = "CORRESPONDENCE";
                break;
            default:
                return NextResponse.json({ error: "نظام دراسة غير صحيح" }, { status: 400 });
        }

        // البحث عن الطلاب
        const students = await prisma.student.findMany({
            where: {
                academicYear: academicYear,
                studyLevel: studyLevelEnum,
                studyMode: studyModeEnum
            },
            include: {
                SubjectGrade: {
                    where: {
                        Subject: { name: subjectName },
                        academicYear: academicYear
                    },
                    include: {
                        Subject: true
                    }
                }
            },
            orderBy: [
                { studentNumber: 'asc' },
                { fullName: 'asc' }
            ]
        });

        // تنسيق البيانات للإرسال
        const formattedStudents = students.map(student => {
            const grades: { [key: string]: any } = {};

            // تجميع الدرجات حسب الفترة
            student.SubjectGrade.forEach(grade => {
                let periodName = "";
                switch (grade.period) {
                    case "FIRST":
                        periodName = "الفترة الأولى";
                        break;
                    case "SECOND":
                        periodName = "الفترة الثانية";
                        break;
                    case "THIRD":
                        periodName = "الفترة الثالثة";
                        break;
                }

                grades[periodName] = {
                    month1: grade.month1,
                    month2: grade.month2,
                    month3: grade.month3,
                    periodExam: grade.finalExam,
                    workTotal: grade.workTotal,
                    periodTotal: grade.periodTotal
                };
            });

            return {
                id: student.id,
                studentNumber: student.studentNumber,
                studentName: student.fullName,
                academicYear: student.academicYear,
                educationLevel: educationLevel,
                studySystem: studySystem,
                specialization: student.specialization || "غير محدد",
                isDiploma: student.isDiploma || false,
                grades: grades
            };
        });

        console.log(`✅ تم العثور على ${formattedStudents.length} طالب`);

        return NextResponse.json({
            success: true,
            students: formattedStudents,
            count: formattedStudents.length,
            criteria: {
                academicYear,
                educationLevel,
                studySystem,
                subject: subjectName,
                period
            }
        });

    } catch (error) {
        console.error("❌ خطأ في استعلام الدرجات:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

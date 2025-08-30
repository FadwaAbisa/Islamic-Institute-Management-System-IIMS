import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API لحفظ درجات الفترة النهائية
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentGrades, subjectName, academicYear, educationLevel } = body;

        console.log("🔄 حفظ درجات الفترة النهائية:", {
            gradesCount: Object.keys(studentGrades).length,
            subjectName,
            academicYear,
            educationLevel
        });

        if (!studentGrades || !subjectName || !academicYear) {
            return NextResponse.json({
                error: "البيانات المطلوبة غير مكتملة"
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

        const results: any[] = [];
        const errors: string[] = [];

        for (const [studentId, gradeData] of Object.entries(studentGrades as Record<string, any>)) {
            try {
                const grades = gradeData as any;

                // التحقق من وجود الطالب
                const student = await prisma.student.findUnique({
                    where: { id: studentId }
                });

                if (!student) {
                    errors.push(`الطالب غير موجود: ${studentId}`);
                    continue;
                }

                // البحث عن درجة الفترة الثالثة الموجودة أو إنشاء جديدة
                const existingGrade = await prisma.subjectGrade.findFirst({
                    where: {
                        studentId: studentId,
                        subjectId: subject.id,
                        academicYear: academicYear,
                        period: "THIRD"
                    }
                });

                let savedGrade;

                if (existingGrade) {
                    // تحديث الدرجة الموجودة
                    savedGrade = await prisma.subjectGrade.update({
                        where: { id: existingGrade.id },
                        data: {
                            // حفظ مجاميع الفترات السابقة في الحقول المتاحة
                            month1: grades.firstPeriodTotal,
                            month2: grades.secondPeriodTotal,
                            month3: grades.thirdPeriodExam,
                            // درجة امتحان الفترة الثالثة
                            finalExam: grades.thirdPeriodExam,
                            // المجموع الكلي للفترات السابقة
                            workTotal: grades.firstPeriodTotal + grades.secondPeriodTotal,
                            // المجموع النهائي
                            periodTotal: grades.finalTotal,
                            updatedAt: new Date()
                        }
                    });
                } else {
                    // إنشاء درجة جديدة
                    savedGrade = await prisma.subjectGrade.create({
                        data: {
                            studentId: studentId,
                            subjectId: subject.id,
                            academicYear: academicYear,
                            period: "THIRD",
                            // حفظ مجاميع الفترات السابقة في الحقول المتاحة
                            month1: grades.firstPeriodTotal,
                            month2: grades.secondPeriodTotal,
                            month3: grades.thirdPeriodExam,
                            // درجة امتحان الفترة الثالثة
                            finalExam: grades.thirdPeriodExam,
                            // المجموع الكلي للفترات السابقة
                            workTotal: grades.firstPeriodTotal + grades.secondPeriodTotal,
                            // المجموع النهائي
                            periodTotal: grades.finalTotal,
                            updatedAt: new Date()
                        }
                    });
                }

                results.push({
                    studentId: studentId,
                    studentName: student.fullName,
                    saved: true,
                    gradeId: savedGrade.id
                });

            } catch (gradeError) {
                console.error(`خطأ في حفظ درجة الطالب ${studentId}:`, gradeError);
                errors.push(`خطأ في حفظ درجة الطالب: ${gradeError instanceof Error ? gradeError.message : 'خطأ غير معروف'}`);
            }
        }

        console.log(`✅ تم حفظ ${results.length} درجة بنجاح`);
        if (errors.length > 0) {
            console.log(`⚠️ ${errors.length} خطأ في الحفظ:`, errors);
        }

        return NextResponse.json({
            success: true,
            saved: results.length,
            errors: errors.length,
            results: results,
            errorMessages: errors
        });

    } catch (error) {
        console.error("❌ خطأ في حفظ درجات الفترة النهائية:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// API لجلب درجات الفترة النهائية المحفوظة
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const subjectName = url.searchParams.get("subject");
        const academicYear = url.searchParams.get("academicYear");

        if (!subjectName || !academicYear) {
            return NextResponse.json({
                error: "المادة والعام الدراسي مطلوبان"
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

        // جلب الدرجات المحفوظة
        const savedGrades = await prisma.subjectGrade.findMany({
            where: {
                subjectId: subject.id,
                academicYear: academicYear,
                period: "THIRD"
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

        console.log(`✅ تم جلب ${savedGrades.length} درجة محفوظة`);

        return NextResponse.json({
            success: true,
            grades: savedGrades,
            count: savedGrades.length
        });

    } catch (error) {
        console.error("❌ خطأ في جلب الدرجات المحفوظة:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

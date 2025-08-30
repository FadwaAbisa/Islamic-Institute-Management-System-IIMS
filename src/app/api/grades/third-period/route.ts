import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API لحفظ درجات الفترة الثالثة والنتائج النهائية
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { grades, subject, academicYear, educationLevel } = body;

        console.log("🔄 حفظ درجات الفترة الثالثة:", { 
            gradesCount: grades.length, 
            subject, 
            academicYear, 
            educationLevel 
        });

        if (!grades || !Array.isArray(grades) || grades.length === 0) {
            return NextResponse.json({ 
                error: "لا توجد درجات للحفظ" 
            }, { status: 400 });
        }

        // البحث عن المادة
        const subjectRecord = await prisma.subject.findUnique({
            where: { name: subject }
        });

        if (!subjectRecord) {
            return NextResponse.json({ 
                error: "المادة غير موجودة" 
            }, { status: 404 });
        }

        const results = [];
        const errors = [];

        for (const gradeData of grades) {
            try {
                const { studentId, finalExam, periodTotal, grade, status } = gradeData;

                // التحقق من وجود الطالب
                const student = await prisma.student.findUnique({
                    where: { id: studentId }
                });

                if (!student) {
                    errors.push(`الطالب غير موجود: ${studentId}`);
                    continue;
                }

                // البحث عن درجة الفترة الثالثة الموجودة
                const existingGrade = await prisma.subjectGrade.findFirst({
                    where: {
                        studentId: studentId,
                        subjectId: subjectRecord.id,
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
                            finalExam: finalExam,
                            periodTotal: periodTotal,
                            grade: grade,
                            status: status,
                            updatedAt: new Date()
                        }
                    });
                } else {
                    // إنشاء درجة جديدة للفترة الثالثة
                    savedGrade = await prisma.subjectGrade.create({
                        data: {
                            studentId: studentId,
                            subjectId: subjectRecord.id,
                            academicYear: academicYear,
                            period: "THIRD",
                            finalExam: finalExam,
                            periodTotal: periodTotal,
                            grade: grade,
                            status: status,
                            // الحقول الأخرى اختيارية للفترة الثالثة
                            month1: null,
                            month2: null,
                            month3: null,
                            workTotal: null
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
                console.error(`خطأ في حفظ درجة الطالب ${gradeData.studentId}:`, gradeError);
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
        console.error("❌ خطأ في حفظ درجات الفترة الثالثة:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// API لجلب درجات الفترة الثالثة المحفوظة
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const subjectName = url.searchParams.get("subject");
        const academicYear = url.searchParams.get("academicYear");
        const educationLevel = url.searchParams.get("educationLevel");
        const studySystem = url.searchParams.get("studySystem");

        console.log("🔍 جلب درجات الفترة الثالثة:", { subjectName, academicYear, educationLevel, studySystem });

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

        // تحويل المرحلة التعليمية
        let studyLevelEnum: "FIRST_YEAR" | "SECOND_YEAR" | "THIRD_YEAR" | "GRADUATION" | undefined;
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
        }

        // بناء شروط البحث للطلاب
        const studentWhere: any = {
            academicYear: academicYear
        };

        if (studyLevelEnum) {
            studentWhere.studyLevel = studyLevelEnum;
        }

        if (studySystem) {
            studentWhere.studyMode = studySystem === "نظامي" ? "REGULAR" : "DISTANCE";
        }

        // جلب درجات الفترة الثالثة
        const thirdPeriodGrades = await prisma.subjectGrade.findMany({
            where: {
                subjectId: subject.id,
                academicYear: academicYear,
                period: "THIRD",
                Student: studentWhere
            },
            include: {
                Student: {
                    select: {
                        id: true,
                        fullName: true,
                        nationalId: true,
                        studyLevel: true,
                        studyMode: true
                    }
                }
            }
        });

        console.log(`✅ تم جلب ${thirdPeriodGrades.length} درجة للفترة الثالثة`);

        return NextResponse.json({
            success: true,
            grades: thirdPeriodGrades,
            count: thirdPeriodGrades.length
        });

    } catch (error) {
        console.error("❌ خطأ في جلب درجات الفترة الثالثة:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

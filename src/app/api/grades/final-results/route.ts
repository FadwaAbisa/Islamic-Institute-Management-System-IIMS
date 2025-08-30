import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getGradeDistribution, calculateFinalResult } from "@/lib/grade-distributions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const academicYear = url.searchParams.get("academicYear");
        const educationLevel = url.searchParams.get("educationLevel");
        const studySystem = url.searchParams.get("studySystem");
        const calculateFinal = url.searchParams.get("calculateFinal");

        console.log("🔍 استعلام النتائج النهائية:", { academicYear, educationLevel, studySystem });

        if (!academicYear || !educationLevel || !studySystem) {
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

        // البحث عن الطلاب مع جميع درجاتهم
        const students = await prisma.student.findMany({
            where: {
                academicYear: academicYear,
                studyLevel: studyLevelEnum,
                studyMode: studyModeEnum
            },
            include: {
                SubjectGrade: {
                    where: {
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

        // تنسيق البيانات مع حساب النتائج النهائية
        const formattedStudents = students.map(student => {
            const subjects: { [key: string]: any } = {};

            // تجميع الدرجات حسب المادة والفترة
            student.SubjectGrade.forEach(grade => {
                const subjectName = grade.Subject.name;
                if (!subjects[subjectName]) {
                    subjects[subjectName] = {};
                }

                let periodName = "";
                switch (grade.period) {
                    case "FIRST":
                        periodName = "first";
                        break;
                    case "SECOND":
                        periodName = "second";
                        break;
                    case "THIRD":
                        periodName = "third";
                        break;
                }

                subjects[subjectName][periodName] = {
                    month1: grade.month1,
                    month2: grade.month2,
                    month3: grade.month3,
                    periodExam: grade.finalExam,
                    workTotal: grade.workTotal,
                    periodTotal: grade.periodTotal,
                    examGrade: grade.finalExam // للفترة الثالثة
                };
            });

            // حساب النتائج النهائية لكل مادة إذا طُلب ذلك
            let finalResults: { [key: string]: any } = {};
            if (calculateFinal === "true") {
                Object.keys(subjects).forEach(subjectName => {
                    const subjectGrades = subjects[subjectName];
                    const distribution = getGradeDistribution(subjectName, educationLevel);

                    if (distribution && subjectGrades.first && subjectGrades.second && subjectGrades.third) {
                        const result = calculateFinalResult(
                            subjectGrades.first.periodTotal || 0,
                            subjectGrades.second.periodTotal || 0,
                            subjectGrades.third.examGrade || 0,
                            distribution
                        );
                        finalResults[subjectName] = result;
                    }
                });
            }

            return {
                id: student.id,
                studentNumber: student.studentNumber,
                studentName: student.fullName,
                academicYear: student.academicYear,
                educationLevel: educationLevel,
                studySystem: studySystem,
                specialization: student.specialization || "غير محدد",
                isDiploma: student.isDiploma || false,
                subjects: subjects,
                finalResults: finalResults,
                periods: {
                    // تجميع الدرجات حسب الفترات للحساب العام
                    first: Object.values(subjects).reduce((acc: any, subject: any) => {
                        if (subject.first) {
                            acc.totalGrades = (acc.totalGrades || 0) + (subject.first.periodTotal || 0);
                            acc.subjectCount = (acc.subjectCount || 0) + 1;
                        }
                        return acc;
                    }, {}),
                    second: Object.values(subjects).reduce((acc: any, subject: any) => {
                        if (subject.second) {
                            acc.totalGrades = (acc.totalGrades || 0) + (subject.second.periodTotal || 0);
                            acc.subjectCount = (acc.subjectCount || 0) + 1;
                        }
                        return acc;
                    }, {}),
                    third: Object.values(subjects).reduce((acc: any, subject: any) => {
                        if (subject.third) {
                            acc.totalGrades = (acc.totalGrades || 0) + (subject.third.examGrade || 0);
                            acc.subjectCount = (acc.subjectCount || 0) + 1;
                        }
                        return acc;
                    }, {})
                }
            };
        });

        console.log(`✅ تم العثور على ${formattedStudents.length} طالب مع النتائج النهائية`);

        return NextResponse.json({
            success: true,
            students: formattedStudents,
            count: formattedStudents.length,
            criteria: {
                academicYear,
                educationLevel,
                studySystem,
                calculateFinal: calculateFinal === "true"
            },
            summary: {
                totalStudents: formattedStudents.length,
                withGrades: formattedStudents.filter(s => Object.keys(s.subjects).length > 0).length,
                withoutGrades: formattedStudents.filter(s => Object.keys(s.subjects).length === 0).length
            }
        });

    } catch (error) {
        console.error("❌ خطأ في استعلام النتائج النهائية:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { academicYear, educationLevel, studySystem, recalculate } = body;

        console.log("🔄 إعادة حساب النتائج النهائية:", { academicYear, educationLevel, studySystem });

        if (!academicYear || !educationLevel || !studySystem) {
            return NextResponse.json({ error: "المعايير الأساسية مطلوبة" }, { status: 400 });
        }

        // الحصول على جميع الطلاب والدرجات
        const studentsResponse = await GET(request);
        const studentsData = await studentsResponse.json();

        if (!studentsData.success) {
            return NextResponse.json({ error: "فشل في الحصول على بيانات الطلاب" }, { status: 400 });
        }

        const students = studentsData.students;
        const results = {
            processed: 0,
            updated: 0,
            errors: []
        };

        // معالجة كل طالب
        for (const student of students) {
            try {
                results.processed++;

                // حساب النتائج النهائية لكل مادة
                const subjectResults: { [key: string]: any } = {};
                let totalScore = 0;
                let completedSubjects = 0;

                Object.keys(student.subjects).forEach(subjectName => {
                    const subjectGrades = student.subjects[subjectName];
                    const distribution = getGradeDistribution(subjectName, educationLevel);

                    if (distribution && subjectGrades.first && subjectGrades.second && subjectGrades.third) {
                        const result = calculateFinalResult(
                            subjectGrades.first.periodTotal || 0,
                            subjectGrades.second.periodTotal || 0,
                            subjectGrades.third.examGrade || 0,
                            distribution
                        );

                        subjectResults[subjectName] = result;
                        totalScore += result.finalTotal;
                        completedSubjects++;
                    }
                });

                // حساب النتيجة العامة
                const averageScore = completedSubjects > 0 ? totalScore / completedSubjects : 0;
                const percentage = (averageScore / 100) * 100;

                let status = 'غير مكتمل';
                let letterGrade = '';

                if (completedSubjects > 0) {
                    const passedSubjects = Object.values(subjectResults).filter((r: any) => r.status === 'نجح').length;
                    status = passedSubjects === completedSubjects ? 'نجح' : 'راسب';

                    if (percentage >= 90) letterGrade = 'ممتاز';
                    else if (percentage >= 80) letterGrade = 'جيد جداً';
                    else if (percentage >= 70) letterGrade = 'جيد';
                    else if (percentage >= 60) letterGrade = 'مقبول';
                    else if (percentage >= 50) letterGrade = 'ضعيف';
                    else letterGrade = 'راسب';
                }

                // يمكن حفظ النتائج في جدول منفصل للنتائج النهائية إذا لزم الأمر
                // هنا يتم فقط إرجاع النتائج المحسوبة

                results.updated++;

            } catch (error) {
                console.error(`❌ خطأ في معالجة الطالب ${student.studentName}:`, error);
                results.errors.push(`${student.studentName}: ${error}`);
            }
        }

        console.log(`✅ تم إعادة حساب النتائج: ${results.updated}/${results.processed}`);

        return NextResponse.json({
            success: true,
            message: `تم إعادة حساب النتائج لـ ${results.updated} طالب`,
            results: results,
            criteria: {
                academicYear,
                educationLevel,
                studySystem
            }
        });

    } catch (error) {
        console.error("❌ خطأ في إعادة حساب النتائج:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في إعادة الحساب",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

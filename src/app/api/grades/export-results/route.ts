import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from 'xlsx';
import { getGradeDistribution, calculateFinalResult } from "@/lib/grade-distributions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const academicYear = url.searchParams.get("academicYear");
        const educationLevel = url.searchParams.get("educationLevel");
        const studySystem = url.searchParams.get("studySystem");
        const exportMode = url.searchParams.get("exportMode") || "all";
        const studentIds = url.searchParams.get("studentIds");

        console.log("📊 تصدير النتائج:", { academicYear, educationLevel, studySystem, exportMode });

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

        // إعداد شروط البحث
        const whereConditions: any = {
            academicYear: academicYear,
            studyLevel: studyLevelEnum,
            studyMode: studyModeEnum
        };

        // إضافة فلترة حسب معرفات الطلاب إذا وُجدت
        if (studentIds) {
            whereConditions.id = {
                in: studentIds.split(',')
            };
        }

        // البحث عن الطلاب مع جميع درجاتهم
        const students = await prisma.student.findMany({
            where: whereConditions,
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

        // إعداد المواد (للأعمدة)
        const allSubjects = [
            "القـرآن وأحكامه", "السيرة", "التفسير", "علوم الحديث",
            "الفقة", "العقيدة", "الدراسات الأدبية", "الدراسات اللغوية",
            "أصول الفقه", "منهج الدعوة", "اللغة الإنجليزية", "الحاسوب"
        ];

        // إعداد البيانات للتصدير
        const exportData: any[] = [];

        students.forEach(student => {
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
                    periodTotal: grade.periodTotal
                };
            });

            // حساب النتائج النهائية
            let totalScore = 0;
            let completedSubjects = 0;
            let passedSubjects = 0;
            const subjectResults: { [key: string]: any } = {};

            allSubjects.forEach(subjectName => {
                const subjectGrades = subjects[subjectName];
                const distribution = getGradeDistribution(subjectName, educationLevel);

                if (distribution && subjectGrades?.first && subjectGrades?.second && subjectGrades?.third) {
                    const result = calculateFinalResult(
                        subjectGrades.first.periodTotal || 0,
                        subjectGrades.second.periodTotal || 0,
                        subjectGrades.third.periodExam || 0,
                        distribution
                    );

                    subjectResults[subjectName] = result;
                    totalScore += result.finalTotal;
                    completedSubjects++;
                    if (result.status === 'نجح') passedSubjects++;
                }
            });

            // حساب النتيجة العامة
            const averageScore = completedSubjects > 0 ? totalScore / completedSubjects : 0;
            const percentage = (averageScore / 100) * 100;

            let status = 'غير مكتمل';
            let letterGrade = '';
            let gpa = 0;

            if (completedSubjects > 0) {
                status = passedSubjects === completedSubjects ? 'نجح' : 'راسب';

                if (percentage >= 90) {
                    letterGrade = 'ممتاز';
                    gpa = 4.0;
                } else if (percentage >= 80) {
                    letterGrade = 'جيد جداً';
                    gpa = 3.5;
                } else if (percentage >= 70) {
                    letterGrade = 'جيد';
                    gpa = 3.0;
                } else if (percentage >= 60) {
                    letterGrade = 'مقبول';
                    gpa = 2.5;
                } else if (percentage >= 50) {
                    letterGrade = 'ضعيف';
                    gpa = 2.0;
                } else {
                    letterGrade = 'راسب';
                    gpa = 1.0;
                }
            }

            // فلترة حسب نوع التصدير
            let includeStudent = true;
            if (exportMode === 'passed' && status !== 'نجح') includeStudent = false;
            if (exportMode === 'failed' && status !== 'راسب') includeStudent = false;

            if (includeStudent) {
                const row: any = {
                    'رقم الطالب': student.studentNumber,
                    'اسم الطالب': student.fullName,
                    'العام الدراسي': student.academicYear,
                    'المرحلة التعليمية': educationLevel,
                    'نظام الدراسة': studySystem,
                    'التخصص': student.specialization || "غير محدد",
                    'نوع الطالب': student.isDiploma ? "دبلوم" : "عادي"
                };

                // إضافة درجات المواد
                allSubjects.forEach(subjectName => {
                    const result = subjectResults[subjectName];
                    if (result) {
                        row[`${subjectName} - الدرجة النهائية`] = result.finalTotal;
                        row[`${subjectName} - التقدير`] = result.grade;
                        row[`${subjectName} - الحالة`] = result.status;
                    } else {
                        row[`${subjectName} - الدرجة النهائية`] = "غير مكتمل";
                        row[`${subjectName} - التقدير`] = "-";
                        row[`${subjectName} - الحالة`] = "غير مكتمل";
                    }
                });

                // إضافة النتيجة العامة
                row['المجموع الكلي'] = Math.round(totalScore * 10) / 10;
                row['المتوسط العام'] = Math.round(averageScore * 10) / 10;
                row['النسبة المئوية'] = Math.round(percentage * 10) / 10 + '%';
                row['التقدير العام'] = letterGrade;
                row['المعدل التراكمي'] = gpa;
                row['الحالة النهائية'] = status;
                row['عدد المواد المكتملة'] = completedSubjects;
                row['عدد المواد الناجح بها'] = passedSubjects;

                exportData.push(row);
            }
        });

        // إنشاء ملف Excel
        const workbook = XLSX.utils.book_new();

        // ورقة النتائج الرئيسية
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // تحسين عرض الأعمدة
        const columnWidths = [
            { wch: 12 }, // رقم الطالب
            { wch: 25 }, // اسم الطالب
            { wch: 15 }, // العام الدراسي
            { wch: 15 }, // المرحلة التعليمية
            { wch: 12 }, // نظام الدراسة
            { wch: 15 }, // التخصص
            { wch: 12 }, // نوع الطالب
        ];

        // إضافة عرض أعمدة المواد
        allSubjects.forEach(() => {
            columnWidths.push({ wch: 12 }); // الدرجة النهائية
            columnWidths.push({ wch: 12 }); // التقدير
            columnWidths.push({ wch: 12 }); // الحالة
        });

        // إضافة عرض أعمدة النتيجة العامة
        columnWidths.push(
            { wch: 15 }, // المجموع الكلي
            { wch: 15 }, // المتوسط العام
            { wch: 15 }, // النسبة المئوية
            { wch: 15 }, // التقدير العام
            { wch: 15 }, // المعدل التراكمي
            { wch: 15 }, // الحالة النهائية
            { wch: 18 }, // عدد المواد المكتملة
            { wch: 18 }  // عدد المواد الناجح بها
        );

        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, "النتائج النهائية");

        // إضافة ورقة الإحصائيات
        const stats = {
            'إجمالي الطلاب': exportData.length,
            'الناجحون': exportData.filter(s => s['الحالة النهائية'] === 'نجح').length,
            'الراسبون': exportData.filter(s => s['الحالة النهائية'] === 'راسب').length,
            'غير مكتمل': exportData.filter(s => s['الحالة النهائية'] === 'غير مكتمل').length,
            'المتوسط العام': exportData.length > 0 ?
                Math.round(exportData.reduce((sum, s) => sum + parseFloat(s['المتوسط العام'] || 0), 0) / exportData.length * 10) / 10 : 0
        };

        const gradeDistribution = {
            'ممتاز': exportData.filter(s => s['التقدير العام'] === 'ممتاز').length,
            'جيد جداً': exportData.filter(s => s['التقدير العام'] === 'جيد جداً').length,
            'جيد': exportData.filter(s => s['التقدير العام'] === 'جيد').length,
            'مقبول': exportData.filter(s => s['التقدير العام'] === 'مقبول').length,
            'ضعيف': exportData.filter(s => s['التقدير العام'] === 'ضعيف').length,
            'راسب': exportData.filter(s => s['التقدير العام'] === 'راسب').length
        };

        const statsData = [
            { 'الإحصائية': 'معلومات عامة', 'القيمة': '' },
            ...Object.entries(stats).map(([key, value]) => ({ 'الإحصائية': key, 'القيمة': value })),
            { 'الإحصائية': '', 'القيمة': '' },
            { 'الإحصائية': 'توزيع التقديرات', 'القيمة': '' },
            ...Object.entries(gradeDistribution).map(([key, value]) => ({ 'الإحصائية': key, 'القيمة': value }))
        ];

        const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
        statsWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(workbook, statsWorksheet, "الإحصائيات");

        // تحويل إلى buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // إعداد اسم الملف
        const fileName = `النتائج_النهائية_${academicYear}_${educationLevel}_${studySystem}_${exportMode}.xlsx`;

        console.log(`✅ تم تصدير ${exportData.length} نتيجة إلى ${fileName}`);

        // إرسال الملف
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
                'Content-Length': buffer.length.toString()
            }
        });

    } catch (error) {
        console.error("❌ خطأ في تصدير النتائج:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في تصدير النتائج",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

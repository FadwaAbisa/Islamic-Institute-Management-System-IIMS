import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from 'xlsx';
import { getGradeDistribution, validateGrade, calculateTotals, getStudentRestrictions } from "@/lib/grade-distributions";

const prisma = new PrismaClient();

interface ExcelRow {
    studentNumber: string;
    studentName: string;
    month1?: number;
    month2?: number;
    month3?: number;
    periodExam?: number;
    [key: string]: any;
}

interface ImportResult {
    success: number;
    errors: string[];
    warnings: string[];
    validationSummary: {
        totalRows: number;
        validRows: number;
        invalidRows: number;
        duplicateRows: number;
        restrictedStudents: number;
    };
}

export async function POST(request: NextRequest) {
    let workbook: XLSX.WorkBook | null = null;

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const subjectName = formData.get("subjectName") as string;
        const academicYear = formData.get("academicYear") as string;
        const educationLevel = formData.get("educationLevel") as string;
        const studySystem = formData.get("studySystem") as string;
        const period = formData.get("period") as string;

        // التحقق من المعاملات المطلوبة
        if (!file || !subjectName || !academicYear || !educationLevel || !studySystem || !period) {
            return NextResponse.json({
                success: false,
                error: "جميع المعاملات مطلوبة (الملف، المادة، العام، المرحلة، النظام، الفترة)"
            }, { status: 400 });
        }

        // التحقق من نوع الملف
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            return NextResponse.json({
                success: false,
                error: "نوع الملف يجب أن يكون Excel (.xlsx أو .xls)"
            }, { status: 400 });
        }

        console.log(`📊 استيراد Excel: ${file.name}`);
        console.log(`📋 المعايير:`, { subjectName, academicYear, educationLevel, studySystem, period });

        // قراءة ملف Excel
        const fileBuffer = await file.arrayBuffer();
        workbook = XLSX.read(fileBuffer, { type: 'array' });

        if (!workbook.SheetNames.length) {
            return NextResponse.json({
                success: false,
                error: "الملف لا يحتوي على أوراق عمل"
            }, { status: 400 });
        }

        // قراءة الورقة الأولى
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        if (!rawData.length) {
            return NextResponse.json({
                success: false,
                error: "الملف فارغ أو لا يحتوي على بيانات"
            }, { status: 400 });
        }

        console.log(`📊 تم قراءة ${rawData.length} صف من Excel`);

        // التحقق من صحة الأعمدة المطلوبة
        const requiredColumns = ['studentNumber', 'studentName', 'month1', 'month2', 'month3', 'periodExam'];
        const firstRow = rawData[0] as any;
        const availableColumns = Object.keys(firstRow);

        const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
        if (missingColumns.length > 0) {
            return NextResponse.json({
                success: false,
                error: `الأعمدة المطلوبة مفقودة: ${missingColumns.join(', ')}`,
                availableColumns,
                requiredColumns
            }, { status: 400 });
        }

        // الحصول على توزيع الدرجات للمادة
        const distribution = getGradeDistribution(subjectName, educationLevel);
        if (!distribution) {
            return NextResponse.json({
                success: false,
                error: `توزيع الدرجات غير متاح للمادة ${subjectName} في المرحلة ${educationLevel}`
            }, { status: 400 });
        }

        // البحث عن المادة في قاعدة البيانات
        const subject = await prisma.subject.findUnique({
            where: { name: subjectName }
        });

        if (!subject) {
            return NextResponse.json({
                success: false,
                error: `المادة غير موجودة: ${subjectName}`
            }, { status: 400 });
        }

        // إعداد النتائج
        const result: ImportResult = {
            success: 0,
            errors: [],
            warnings: [],
            validationSummary: {
                totalRows: rawData.length,
                validRows: 0,
                invalidRows: 0,
                duplicateRows: 0,
                restrictedStudents: 0
            }
        };

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
                return NextResponse.json({
                    success: false,
                    error: `فترة غير صحيحة: ${period}`
                }, { status: 400 });
        }

        // معالجة كل صف
        const processedStudents = new Set<string>();

        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i] as ExcelRow;
            const rowNumber = i + 2; // +2 لأن Excel يبدأ من 1 والصف الأول عناوين

            try {
                // التحقق من البيانات الأساسية
                if (!row.studentNumber || !row.studentName) {
                    result.errors.push(`الصف ${rowNumber}: رقم الطالب أو الاسم مفقود`);
                    result.validationSummary.invalidRows++;
                    continue;
                }

                // التحقق من التكرار في الملف
                const studentKey = `${row.studentNumber}_${period}`;
                if (processedStudents.has(studentKey)) {
                    result.errors.push(`الصف ${rowNumber}: الطالب ${row.studentName} مكرر في نفس الفترة`);
                    result.validationSummary.duplicateRows++;
                    continue;
                }
                processedStudents.add(studentKey);

                // البحث عن الطالب في قاعدة البيانات
                const student = await prisma.student.findFirst({
                    where: {
                        OR: [
                            { studentNumber: row.studentNumber.toString() },
                            { fullName: { contains: row.studentName } }
                        ]
                    }
                });

                if (!student) {
                    result.errors.push(`الصف ${rowNumber}: الطالب غير موجود: ${row.studentName} (${row.studentNumber})`);
                    result.validationSummary.invalidRows++;
                    continue;
                }

                // التحقق من قيود الطالب
                const restrictions = getStudentRestrictions(
                    student.studyLevel || "",
                    student.studyMode || "",
                    student.isDiploma || false
                );

                if (!restrictions.canEnterGrades) {
                    result.errors.push(`الصف ${rowNumber}: لا يمكن إدخال درجات للطالب ${student.fullName}: ${restrictions.restrictions.join(", ")}`);
                    result.validationSummary.restrictedStudents++;
                    continue;
                }

                if (!restrictions.availablePeriods.includes(period)) {
                    result.errors.push(`الصف ${rowNumber}: الفترة ${period} غير متاحة للطالب ${student.fullName}`);
                    result.validationSummary.restrictedStudents++;
                    continue;
                }

                // التحقق من صحة الدرجات
                const validationErrors = [];
                const grades = {
                    month1: row.month1 && !isNaN(row.month1) ? row.month1 : null,
                    month2: row.month2 && !isNaN(row.month2) ? row.month2 : null,
                    month3: row.month3 && !isNaN(row.month3) ? row.month3 : null,
                    periodExam: row.periodExam && !isNaN(row.periodExam) ? row.periodExam : null
                };

                // التحقق من كل درجة
                if (grades.month1 !== null) {
                    const validation = validateGrade(grades.month1, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الأول: ${validation.error}`);
                    }
                }

                if (grades.month2 !== null) {
                    const validation = validateGrade(grades.month2, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الثاني: ${validation.error}`);
                    }
                }

                if (grades.month3 !== null) {
                    const validation = validateGrade(grades.month3, distribution.monthlyGrade, 'monthly');
                    if (!validation.isValid) {
                        validationErrors.push(`الشهر الثالث: ${validation.error}`);
                    }
                }

                if (grades.periodExam !== null) {
                    const validation = validateGrade(grades.periodExam, distribution.periodExam, 'exam');
                    if (!validation.isValid) {
                        validationErrors.push(`الامتحان: ${validation.error}`);
                    }
                }

                if (validationErrors.length > 0) {
                    result.errors.push(`الصف ${rowNumber} - ${student.fullName}: ${validationErrors.join(", ")}`);
                    result.validationSummary.invalidRows++;
                    continue;
                }

                // حساب المجاميع
                const totals = calculateTotals(
                    grades.month1,
                    grades.month2,
                    grades.month3,
                    grades.periodExam,
                    distribution
                );

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
                    result.warnings.push(`الصف ${rowNumber}: تم تحديث درجات الطالب ${student.fullName} الموجودة مسبقاً`);
                }

                // حفظ أو تحديث الدرجات
                await prisma.subjectGrade.upsert({
                    where: {
                        studentId_subjectId_academicYear_period: {
                            studentId: student.id,
                            subjectId: subject.id,
                            academicYear: academicYear,
                            period: periodEnum
                        }
                    },
                    update: {
                        month1: grades.month1,
                        month2: grades.month2,
                        month3: grades.month3,
                        workTotal: totals.workTotal,
                        finalExam: grades.periodExam,
                        periodTotal: totals.periodTotal,
                        updatedAt: new Date()
                    },
                    create: {
                        studentId: student.id,
                        subjectId: subject.id,
                        academicYear: academicYear,
                        period: periodEnum,
                        month1: grades.month1,
                        month2: grades.month2,
                        month3: grades.month3,
                        workTotal: totals.workTotal,
                        finalExam: grades.periodExam,
                        periodTotal: totals.periodTotal,
                        updatedAt: new Date()
                    }
                });

                result.success++;
                result.validationSummary.validRows++;
                console.log(`✅ الصف ${rowNumber}: تم حفظ درجات ${student.fullName}`);

            } catch (error) {
                console.error(`❌ خطأ في الصف ${rowNumber}:`, error);
                result.errors.push(`الصف ${rowNumber}: خطأ في المعالجة - ${error}`);
                result.validationSummary.invalidRows++;
            }
        }

        console.log(`📊 ملخص الاستيراد:`, result.validationSummary);
        console.log(`✅ نجح: ${result.success}`);
        console.log(`❌ أخطاء: ${result.errors.length}`);
        console.log(`⚠️ تحذيرات: ${result.warnings.length}`);

        return NextResponse.json({
            success: true,
            message: `تم استيراد ${result.success} درجة من أصل ${result.validationSummary.totalRows} صف`,
            ...result,
            importSummary: {
                fileName: file.name,
                fileSize: file.size,
                processedAt: new Date().toISOString(),
                criteria: {
                    subject: subjectName,
                    academicYear,
                    educationLevel,
                    studySystem,
                    period
                }
            }
        });

    } catch (error) {
        console.error("❌ خطأ عام في استيراد Excel:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في معالجة الملف",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// دالة مساعدة للتحقق من تنسيق Excel
export async function GET(request: NextRequest) {
    try {
        // إرجاع معلومات حول التنسيق المطلوب
        const requiredFormat = {
            fileName: "grades_template.xlsx",
            requiredColumns: [
                {
                    name: "studentNumber",
                    description: "رقم الطالب",
                    example: "2024001",
                    required: true
                },
                {
                    name: "studentName",
                    description: "اسم الطالب",
                    example: "أحمد محمد علي",
                    required: true
                },
                {
                    name: "month1",
                    description: "درجة الشهر الأول",
                    example: "12",
                    required: false
                },
                {
                    name: "month2",
                    description: "درجة الشهر الثاني",
                    example: "11.5",
                    required: false
                },
                {
                    name: "month3",
                    description: "درجة الشهر الثالث",
                    example: "13",
                    required: false
                },
                {
                    name: "periodExam",
                    description: "درجة امتحان الفترة",
                    example: "15",
                    required: false
                }
            ],
            notes: [
                "جميع الدرجات اختيارية ويمكن تركها فارغة",
                "الدرجات يجب أن تكون أرقام (صحيحة أو عشرية)",
                "لا تتجاوز الحد الأقصى المحدد لكل مادة",
                "يتم حساب المجاميع تلقائياً",
                "يمكن تحديث الدرجات الموجودة مسبقاً"
            ]
        };

        return NextResponse.json({
            success: true,
            format: requiredFormat
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "خطأ في الحصول على معلومات التنسيق"
        }, { status: 500 });
    }
}

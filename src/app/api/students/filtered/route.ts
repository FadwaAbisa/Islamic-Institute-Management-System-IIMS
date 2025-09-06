import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const academicYear = url.searchParams.get("academicYear");
        const educationLevel = url.searchParams.get("educationLevel");
        const studySystem = url.searchParams.get("studySystem");
        const subject = url.searchParams.get("subject");
        const period = url.searchParams.get("period");

        console.log("🔍 استعلام الطلاب المصفين:", { academicYear, educationLevel, studySystem, subject, period });

        if (!academicYear || !educationLevel || !studySystem) {
            return NextResponse.json({ error: "المعايير الأساسية مطلوبة (العام، المرحلة، النظام)" }, { status: 400 });
        }

        // تحويل المرحلة التعليمية إلى enum
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

        // تحويل نظام الدراسة إلى enum
        let studyModeEnum: "REGULAR" | "DISTANCE";
        switch (studySystem) {
            case "نظامي":
                studyModeEnum = "REGULAR";
                break;
            case "انتساب":
                studyModeEnum = "DISTANCE";
                break;
            default:
                return NextResponse.json({ error: "نظام دراسة غير صحيح" }, { status: 400 });
        }

        // بناء شروط البحث
        const whereConditions: any = {
            academicYear: academicYear,
            studyLevel: studyLevelEnum,
            studyMode: studyModeEnum
        };

        console.log("📋 شروط البحث:", whereConditions);

        // جلب الطلاب من قاعدة البيانات
        const students = await prisma.student.findMany({
            where: whereConditions,
            orderBy: [
                { nationalId: 'asc' },
                { fullName: 'asc' }
            ],
            select: {
                id: true,
                fullName: true,
                nationalId: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true,
                studentStatus: true,
                createdAt: true
            }
        });

        console.log(`✅ تم العثور على ${students.length} طالب`);

        // تنسيق البيانات للإرسال
        const formattedStudents = students.map(student => {
            // تحويل القيم إلى النص العربي للعرض
            let educationLevelText = "";
            switch (student.studyLevel) {
                case "FIRST_YEAR":
                    educationLevelText = "السنة الأولى";
                    break;
                case "SECOND_YEAR":
                    educationLevelText = "السنة الثانية";
                    break;
                case "THIRD_YEAR":
                    educationLevelText = "السنة الثالثة";
                    break;
                case "GRADUATION":
                    educationLevelText = "التخرج";
                    break;
                default:
                    educationLevelText = "غير محدد";
            }

            let studySystemText = "";
            switch (student.studyMode) {
                case "REGULAR":
                    studySystemText = "نظامي";
                    break;
                case "DISTANCE":
                    studySystemText = "انتساب";
                    break;
                default:
                    studySystemText = "غير محدد";
            }

            // تحديد إذا كان دبلوم من التخصص أو المرحلة
            const isDiploma = student.specialization?.includes("دبلوم") || student.studyLevel === "THIRD_YEAR";

            return {
                id: student.id,
                studentNumber: student.nationalId || "غير محدد",
                studentName: student.fullName,
                academicYear: student.academicYear,
                educationLevel: educationLevelText,
                studySystem: studySystemText,
                specialization: student.specialization || "غير محدد",
                isDiploma: isDiploma,
                status: student.studentStatus || "نشط",
                grades: {} // سيتم ملؤها حسب الحاجة
            };
        });

        // إذا تم تحديد مادة، يمكن جلب الدرجات الخاصة بها
        if (subject && subject !== "all") {
            // البحث عن المادة
            const subjectRecord = await prisma.subject.findUnique({
                where: { name: subject }
            });

            if (subjectRecord) {
                // جلب الدرجات للمادة المحددة
                console.log("🔍 جلب الدرجات للمادة:", subject, "العام:", academicYear, "الفترة:", period);
                console.log("🔍 معرفات الطلاب:", students.map(s => s.id));
                
                // تحويل period إلى enum للبحث
                let periodEnum: "FIRST" | "SECOND" | "THIRD" | undefined = undefined;
                if (period && period !== "all") {
                    periodEnum = period === "الفترة الأولى" ? "FIRST" : 
                               period === "الفترة الثانية" ? "SECOND" : 
                               period === "الفترة الثالثة" ? "THIRD" : undefined;
                    console.log("🔍 periodEnum:", periodEnum);
                }
                
                const whereClause: any = {
                    subjectId: subjectRecord.id,
                    academicYear: academicYear,
                    studentId: {
                        in: students.map(s => s.id)
                    }
                };
                
                // إضافة period في البحث إذا كان محدد
                if (periodEnum) {
                    whereClause.period = periodEnum;
                }
                
                console.log("🔍 whereClause:", whereClause);
                
                const grades = await prisma.subjectGrade.findMany({
                    where: whereClause,
                    include: {
                        Student: true
                    }
                });
                
                console.log("🔍 الدرجات المستلمة من قاعدة البيانات:", grades.length, "درجة");
                console.log("🔍 تفاصيل الدرجات:", JSON.stringify(grades, null, 2));

                // إضافة الدرجات للطلاب
                formattedStudents.forEach(student => {
                    const studentGrades = grades.filter(g => g.studentId === student.id);
                    console.log(`🔍 درجات الطالب ${student.studentName} (${student.id}):`, studentGrades.length, "درجة");
                    
                    student.grades = {};

                    studentGrades.forEach(grade => {
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

                        if (periodName) {
                            const gradeData = {
                                month1: grade.month1,
                                month2: grade.month2,
                                month3: grade.month3,
                                periodExam: grade.finalExam, // finalExam في قاعدة البيانات = periodExam في الواجهة
                                workTotal: grade.workTotal,
                                periodTotal: grade.periodTotal,
                                percentage: grade.percentage,
                                grade: grade.grade,
                                gradeColor: grade.gradeColor
                            };
                            
                            student.grades[periodName] = gradeData;
                            console.log(`🔍 إضافة درجات ${periodName} للطالب ${student.studentName}:`, gradeData);
                        }
                    });
                    
                    console.log(`🔍 درجات الطالب النهائية ${student.studentName}:`, student.grades);
                });
            }
        }

        console.log("📤 إرسال البيانات:", {
            عدد_الطلاب: formattedStudents.length,
            معايير_البحث: { academicYear, educationLevel, studySystem, subject, period }
        });

        return NextResponse.json({
            success: true,
            students: formattedStudents,
            count: formattedStudents.length,
            criteria: {
                academicYear,
                educationLevel,
                studySystem,
                subject,
                period
            }
        });

    } catch (error) {
        console.error("❌ خطأ في استعلام الطلاب المصفين:", error);
        return NextResponse.json({
            success: false,
            error: "حدث خطأ في الخادم",
            details: error instanceof Error ? error.message : "خطأ غير معروف"
        }, { status: 500 });
    } finally {
        // لا نحتاج لـ disconnect مع prisma singleton
    }
}

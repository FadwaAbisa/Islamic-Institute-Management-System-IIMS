import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            type,
            academicYear,
            stage,
            studySystem,
            month
        } = body

        if (!type || !academicYear || !stage || !studySystem) {
            return NextResponse.json({
                error: "جميع الحقول مطلوبة"
            }, { status: 400 })
        }

        // جلب البيانات من قاعدة البيانات
        const students = await prisma.student.findMany({
            where: {
                academicYear,
                studyLevel: stage,
                studyMode: studySystem
            },
            include: {
                subjectGrades: {
                    where: {
                        academicYear,
                        period: type === 'monthly' ? 'FIRST' :
                            type === 'period1' ? 'FIRST' :
                                type === 'period2' ? 'SECOND' :
                                    type === 'total' ? 'THIRD' :
                                        type === 'transcript' ? 'FIRST' : 'FIRST'
                    }
                }
            },
            orderBy: {
                fullName: 'asc'
            }
        })

        if (students.length === 0) {
            return NextResponse.json({
                error: "لا توجد بيانات للطباعة"
            }, { status: 404 })
        }

        console.log(`🔍 Found ${students.length} students for ${type} report`)
        console.log(`📊 Sample student data:`, students[0])

        // إنشاء محتوى PDF
        const pdfContent = generatePDFContent(type, students, {
            academicYear,
            stage,
            studySystem,
            month
        })

        // إرجاع البيانات لإنشاء PDF في Frontend
        return NextResponse.json({
            success: true,
            data: pdfContent,
            message: "تم إنشاء البيانات بنجاح"
        })

    } catch (error) {
        console.error("❌ Error generating PDF:", error)
        return NextResponse.json({
            error: "خطأ في إنشاء PDF"
        }, { status: 500 })
    }
}

function generatePDFContent(type: string, students: any[], filters: any) {
    const title = getTitle(type, filters)
    const headers = getHeaders(type)

    const rows = students.map((student, index) => {
        const row: any = {
            number: index + 1,
            studentName: student.fullName,
            nationalId: student.nationalId || student.id,
            studyLevel: mapStudyLevelToArabic(student.studyLevel),
            studyMode: mapStudyModeToArabic(student.studyMode)
        }

        // إضافة الدرجات حسب النوع
        if (type === 'monthly') {
            row.month1 = getGrade(student, 'month1', filters.month)
            row.month2 = getGrade(student, 'month2', filters.month)
            row.month3 = getGrade(student, 'month3', filters.month)
            row.finalExam = getGrade(student, 'finalExam', filters.month)
            row.total = calculateTotal(row.month1, row.month2, row.month3, row.finalExam)
        } else if (type === 'period1' || type === 'period2') {
            row.month1 = getGrade(student, 'month1')
            row.month2 = getGrade(student, 'month2')
            row.month3 = getGrade(student, 'month3')
            row.finalExam = getGrade(student, 'finalExam')
            row.workTotal = getGrade(student, 'workTotal')
            row.periodTotal = getGrade(student, 'periodTotal')
        } else if (type === 'total') {
            row.period1Total = getGrade(student, 'period1Total')
            row.period2Total = getGrade(student, 'period2Total')
            row.finalTotal = getGrade(student, 'finalTotal')
        } else if (type === 'transcript') {
            row.month1 = getGrade(student, 'month1')
            row.month2 = getGrade(student, 'month2')
            row.month3 = getGrade(student, 'month3')
            row.finalExam = getGrade(student, 'finalExam')
            row.workTotal = getGrade(student, 'workTotal')
            row.periodTotal = getGrade(student, 'periodTotal')
            row.status = getStatus(student)
        }

        return row
    })

    return {
        title,
        headers,
        rows,
        filters: {
            ...filters,
            stage: mapStudyLevelToArabic(filters.stage),
            studySystem: mapStudyModeToArabic(filters.studySystem)
        },
        generatedAt: new Date().toLocaleString('ar-SA')
    }
}

function getTitle(type: string, filters: any): string {
    const typeNames: { [key: string]: string } = {
        monthly: `كشف درجات ${getMonthName(filters.month)}`,
        period1: 'كشف درجات الفترة الأولى',
        period2: 'كشف درجات الفترة الثانية',
        total: 'كشف مجموع الفترتين',
        transcript: 'نموذج الصحيفة الدراسية'
    }

    return `${typeNames[type]} - ${filters.academicYear} - ${filters.stage} - ${filters.studySystem}`
}

function getHeaders(type: string): string[] {
    const baseHeaders = ['الرقم', 'اسم الطالب', 'الرقم القومي', 'المرحلة', 'نظام الدراسة']

    switch (type) {
        case 'monthly':
            return [...baseHeaders, 'الشهر الأول', 'الشهر الثاني', 'الشهر الثالث', 'الامتحان النهائي', 'المجموع']
        case 'period1':
        case 'period2':
            return [...baseHeaders, 'الشهر الأول', 'الشهر الثاني', 'الشهر الثالث', 'مجموع الأعمال', 'مجموع الفترة']
        case 'total':
            return [...baseHeaders, 'مجموع الفترة الأولى', 'مجموع الفترة الثانية', 'المجموع النهائي']
        case 'transcript':
            return [...baseHeaders, 'الشهر الأول', 'الشهر الثاني', 'الشهر الثالث', 'الامتحان النهائي', 'مجموع الأعمال', 'مجموع الفترة', 'الحالة']
        default:
            return baseHeaders
    }
}

function getGrade(student: any, gradeType: string, month?: string): string {
    if (!student.subjectGrades || student.subjectGrades.length === 0) return '-'

    // جلب الدرجة من أول مادة (يمكن تطويره لاحقاً لجلب مادة محددة)
    const grade = student.subjectGrades[0]
    if (!grade) return '-'

    switch (gradeType) {
        case 'month1':
            return grade.month1?.toString() || '-'
        case 'month2':
            return grade.month2?.toString() || '-'
        case 'month3':
            return grade.month3?.toString() || '-'
        case 'finalExam':
            return grade.finalExam?.toString() || '-'
        case 'workTotal':
            return grade.workTotal?.toString() || '-'
        case 'periodTotal':
            return grade.periodTotal?.toString() || '-'
        default:
            return '-'
    }
}

function calculateTotal(m1: string, m2: string, m3: string, final: string): string {
    const month1 = parseFloat(m1) || 0
    const month2 = parseFloat(m2) || 0
    const month3 = parseFloat(m3) || 0
    const finalExam = parseFloat(final) || 0

    const total = month1 + month2 + month3 + finalExam
    return total > 0 ? total.toString() : '-'
}

function getStatus(student: any): string {
    // منطق تحديد الحالة
    return 'مكتمل' // يمكن تطويره لاحقاً
}

function getMonthName(monthId: string): string {
    const months: { [key: string]: string } = {
        '1': 'سبتمبر',
        '2': 'أكتوبر',
        '3': 'نوفمبر',
        '4': 'ديسمبر',
        '5': 'يناير',
        '6': 'فبراير',
        '7': 'مارس',
        '8': 'أبريل',
        '9': 'مايو',
        '10': 'يونيو'
    }
    return months[monthId] || 'غير محدد'
}

function mapStudyLevelToArabic(level: string): string {
    if (!level) return 'غير محدد'
    const levelMap: { [key: string]: string } = {
        '1': 'السنة الأولى',
        '2': 'السنة الثانية',
        '3': 'السنة الثالثة',
        '4': 'السنة الرابعة',
        '5': 'السنة الخامسة',
        '6': 'السنة السادسة'
    }
    return levelMap[level] || level
}

function mapStudyModeToArabic(mode: string): string {
    if (!mode) return 'غير محدد'
    const modeMap: { [key: string]: string } = {
        'REGULAR': 'نظامي',
        'DISTANCE': 'انتساب',
        'EVENING': 'مسائي',
        'WEEKEND': 'أسبوعي'
    }
    return modeMap[mode] || mode
}

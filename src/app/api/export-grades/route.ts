import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { subject, academicYear, period, educationLevel, studySystem } = body

        if (!subject || !academicYear || !period) {
            return NextResponse.json({ error: "المادة والعام الدراسي والفترة مطلوبة" }, { status: 400 })
        }

        // بناء شروط البحث
        const where: any = {}
        if (academicYear) where.academicYear = academicYear

        const mappedLevel = mapArabicLevelToValue(educationLevel)
        if (mappedLevel) where.studyLevel = mappedLevel

        const mappedMode = mapArabicStudyModeToEnum(studySystem)
        if (mappedMode) where.studyMode = mappedMode as any

        // جلب الطلاب
        const students = await prisma.student.findMany({
            where,
            orderBy: { fullName: "asc" },
            select: {
                id: true,
                fullName: true,
                nationalId: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true
            },
        })

        // جلب الدرجات
        const subjectObj = await prisma.subject.findUnique({ where: { name: subject } })
        if (!subjectObj) {
            return NextResponse.json({ error: "المادة غير موجودة" }, { status: 404 })
        }

        const periodEnum = mapArabicPeriodToEnum(period)
        if (!periodEnum) {
            return NextResponse.json({ error: "قيمة الفترة غير صحيحة" }, { status: 400 })
        }

        const grades = await (prisma as any).subjectGrade.findMany({
            where: {
                subjectId: subjectObj.id,
                academicYear,
                period: periodEnum as any
            },
            select: {
                studentId: true,
                month1: true,
                month2: true,
                month3: true,
                workTotal: true,
                finalExam: true,
                periodTotal: true,
            },
        })

        // تجميع البيانات
        const gradeByStudent: Record<string, any> = {}
        for (const g of grades) {
            gradeByStudent[g.studentId] = g
        }

        const exportData = students.map((student) => {
            const grade = gradeByStudent[student.id]
            return {
                'رقم الهوية': student.nationalId || student.id,
                'اسم الطالب': student.fullName,
                'العام الدراسي': student.academicYear || '',
                'المرحلة': mapLevelToArabic(student.studyLevel),
                'نظام الدراسة': mapModeToArabic(student.studyMode),
                'الدرجة الأولى': grade?.month1 || '',
                'الدرجة الثانية': grade?.month2 || '',
                'الدرجة الثالثة': periodEnum === "THIRD" ? '' : (grade?.month3 || ''),
                'مجموع الأعمال': grade?.workTotal || 0,
                'امتحان نهائي': grade?.finalExam || '',
                'المجموع الكلي': grade?.periodTotal || 0,
            }
        })

        return NextResponse.json({
            data: exportData,
            message: `تم تصدير درجات مقرر ${subject} بنجاح`,
            totalStudents: exportData.length
        })

    } catch (error) {
        console.error("Error exporting grades:", error)
        return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
    }
}

function mapArabicPeriodToEnum(value: string): "FIRST" | "SECOND" | "THIRD" | null {
    switch (value) {
        case "الفترة الأولى":
            return "FIRST"
        case "الفترة الثانية":
            return "SECOND"
        case "الفترة الثالثة":
            return "THIRD"
        default:
            return null
    }
}

function mapArabicStudyModeToEnum(value: string | null): "REGULAR" | "DISTANCE" | undefined {
    if (!value) return undefined
    switch (value) {
        case "نظامي":
            return "REGULAR"
        case "انتساب":
            return "DISTANCE"
        default:
            return undefined
    }
}

function mapArabicLevelToValue(value: string | null): string | undefined {
    if (!value) return undefined
    switch (value) {
        case "السنة الأولى":
            return "1"
        case "السنة الثانية":
            return "2"
        case "السنة الثالثة":
            return "3"
        case "التخرج":
            return "4"
        default:
            return undefined
    }
}

function mapLevelToArabic(level: string | null): string {
    if (!level) return ''
    switch (level) {
        case "1":
            return "السنة الأولى"
        case "2":
            return "السنة الثانية"
        case "3":
            return "السنة الثالثة"
        case "4":
            return "التخرج"
        default:
            return level
    }
}

function mapModeToArabic(mode: string | null): string {
    if (!mode) return ''
    switch (mode) {
        case "REGULAR":
            return "نظامي"
        case "DISTANCE":
            return "انتساب"
        default:
            return mode
    }
}

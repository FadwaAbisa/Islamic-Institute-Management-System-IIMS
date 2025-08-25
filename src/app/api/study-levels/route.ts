import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // جلب جميع المراحل الدراسية من قاعدة البيانات
        const studyLevels = await prisma.student.findMany({
            select: {
                studyLevel: true
            },
            distinct: ['studyLevel'],
            where: {
                studyLevel: {
                    not: null
                }
            },
            orderBy: {
                studyLevel: 'asc'
            }
        })

        // تحويل البيانات إلى الشكل المطلوب
        const formattedLevels = studyLevels.map((item, index) => ({
            id: item.studyLevel || `level-${index}`,
            name: mapStudyLevelToArabic(item.studyLevel || '')
        }))

        console.log("🔍 Study levels fetched:", formattedLevels)

        return NextResponse.json({
            studyLevels: formattedLevels,
            message: "تم جلب المراحل الدراسية بنجاح"
        })
    } catch (error) {
        console.error("❌ Error fetching study levels:", error)
        return NextResponse.json({
            error: "خطأ في جلب المراحل الدراسية",
            studyLevels: []
        }, { status: 500 })
    }
}

// دالة لتحويل المرحلة الدراسية إلى العربية
function mapStudyLevelToArabic(level: string): string {
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

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // جلب جميع أنظمة الدراسة من قاعدة البيانات
        const studyModes = await prisma.student.findMany({
            select: {
                studyMode: true
            },
            distinct: ['studyMode'],
            where: {
                studyMode: {
                    not: null
                }
            },
            orderBy: {
                studyMode: 'asc'
            }
        })

        // تحويل البيانات إلى الشكل المطلوب
        const formattedModes = studyModes.map((item, index) => ({
            id: item.studyMode || `mode-${index}`,
            name: mapStudyModeToArabic(item.studyMode || '')
        }))

        console.log("🔍 Study modes fetched:", formattedModes)

        return NextResponse.json({
            studyModes: formattedModes,
            message: "تم جلب أنظمة الدراسة بنجاح"
        })
    } catch (error) {
        console.error("❌ Error fetching study modes:", error)
        return NextResponse.json({
            error: "خطأ في جلب أنظمة الدراسة",
            studyModes: []
        }, { status: 500 })
    }
}

// دالة لتحويل نظام الدراسة إلى العربية
function mapStudyModeToArabic(mode: string): string {
    switch (mode) {
        case "REGULAR":
            return "نظامي"
        case "DISTANCE":
            return "انتساب"
        default:
            return mode
    }
}

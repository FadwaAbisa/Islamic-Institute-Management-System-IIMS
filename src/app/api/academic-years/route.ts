import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // جلب جميع الأعوام الدراسية من قاعدة البيانات
        const academicYears = await prisma.student.findMany({
            select: {
                academicYear: true
            },
            distinct: ['academicYear'],
            where: {
                academicYear: {
                    not: null
                }
            },
            orderBy: {
                academicYear: 'desc'
            }
        })

        // تحويل البيانات إلى الشكل المطلوب
        const formattedYears = academicYears.map((item, index) => ({
            id: item.academicYear || `year-${index}`,
            name: item.academicYear || 'غير محدد'
        }))

        console.log("🔍 Academic years fetched:", formattedYears)

        return NextResponse.json({
            academicYears: formattedYears,
            message: "تم جلب الأعوام الدراسية بنجاح"
        })
    } catch (error) {
        console.error("❌ Error fetching academic years:", error)
        return NextResponse.json({
            error: "خطأ في جلب الأعوام الدراسية",
            academicYears: []
        }, { status: 500 })
    }
}

// إضافة عام دراسي جديد
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { academicYear } = body

        if (!academicYear) {
            return NextResponse.json({ error: "العام الدراسي مطلوب" }, { status: 400 })
        }

        // التحقق من صحة تنسيق العام الدراسي
        const yearPattern = /^\d{4}-\d{4}$/
        if (!yearPattern.test(academicYear)) {
            return NextResponse.json({ error: "تنسيق العام الدراسي غير صحيح. يجب أن يكون: 2024-2025" }, { status: 400 })
        }

        // التحقق من أن العام الدراسي لا يوجد مسبقاً
        const existingYear = await prisma.student.findFirst({
            where: { academicYear },
        })

        if (existingYear) {
            return NextResponse.json({ error: "العام الدراسي موجود مسبقاً" }, { status: 409 })
        }

        return NextResponse.json({
            message: `تم إضافة العام الدراسي ${academicYear} بنجاح`,
            academicYear
        })
    } catch (error) {
        console.error("Error adding academic year:", error)
        return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
    }
}

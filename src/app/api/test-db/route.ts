import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        console.log("🧪 بدء اختبار قاعدة البيانات...")
        
        // اختبار الاتصال البسيط
        await prisma.$connect()
        console.log("✅ تم الاتصال بقاعدة البيانات")
        
        // جلب عدد الطلاب
        const studentCount = await prisma.student.count()
        console.log("📊 عدد الطلاب:", studentCount)
        
        // جلب عدد المواد
        const subjectCount = await prisma.subject.count()
        console.log("📚 عدد المواد:", subjectCount)
        
        // جلب عينة من الطلاب
        const sampleStudents = await prisma.student.findMany({
            take: 3,
            select: {
                id: true,
                fullName: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true
            }
        })
        console.log("👥 عينة الطلاب:", sampleStudents.length)
        
        // جلب عينة من المواد
        const sampleSubjects = await prisma.subject.findMany({
            take: 3,
            select: {
                id: true,
                name: true
            }
        })
        console.log("📖 عينة المواد:", sampleSubjects.length)

        return NextResponse.json({
            success: true,
            data: {
                studentCount,
                subjectCount,
                sampleStudents,
                sampleSubjects
            }
        })
    } catch (error) {
        console.error("❌ Error testing database:", error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "خطأ غير معروف",
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
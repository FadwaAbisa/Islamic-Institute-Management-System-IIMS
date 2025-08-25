import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // جلب جميع المواد
        const subjects = await prisma.subject.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        })

        // جلب عينة من الطلاب
        const students = await prisma.student.findMany({
            take: 3,
            select: {
                id: true,
                fullName: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true,
            }
        })

        return NextResponse.json({
            subjects,
            sampleStudents: students,
            totalSubjects: subjects.length,
            totalStudents: await prisma.student.count()
        })

    } catch (error) {
        console.error("❌ خطأ في فحص المواد:", error)
        return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
    }
}

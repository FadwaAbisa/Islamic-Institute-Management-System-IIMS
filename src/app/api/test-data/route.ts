import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // جلب عينة من الطلاب
        const students = await prisma.student.findMany({
            take: 5,
            select: {
                id: true,
                fullName: true,
                nationalId: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true,
                sex: true,
                birthday: true,
                address: true,
                studentPhone: true,
                guardianName: true,
                guardianPhone: true,
                enrollmentStatus: true,
                studentStatus: true,
            },
        })

        // جلب المواد
        const subjects = await prisma.subject.findMany({
            take: 5,
            select: {
                id: true,
                name: true,
            },
        })

        // جلب الإحصائيات
        const totalStudents = await prisma.student.count()
        const studentsWithLevel = await prisma.student.count({
            where: { studyLevel: { not: null } }
        })
        const studentsWithMode = await prisma.student.count({
            where: { studyMode: { not: null } }
        })
        const studentsWithSpecialization = await prisma.student.count({
            where: { specialization: { not: null } }
        })

        // جلب القيم الفريدة
        const uniqueLevels = await prisma.student.findMany({
            distinct: ['studyLevel'],
            select: { studyLevel: true },
            where: { studyLevel: { not: null } }
        })

        const uniqueModes = await prisma.student.findMany({
            distinct: ['studyMode'],
            select: { studyMode: true },
            where: { studyMode: { not: null } }
        })

        const uniqueSpecializations = await prisma.student.findMany({
            distinct: ['specialization'],
            select: { specialization: true },
            where: { specialization: { not: null } }
        })

        return NextResponse.json({
            success: true,
            data: {
                sampleStudents: students,
                subjects: subjects,
                statistics: {
                    totalStudents,
                    studentsWithLevel,
                    studentsWithMode,
                    studentsWithSpecialization,
                },
                uniqueValues: {
                    levels: uniqueLevels.map(s => s.studyLevel),
                    modes: uniqueModes.map(s => s.studyMode),
                    specializations: uniqueSpecializations.map(s => s.specialization),
                }
            }
        })

    } catch (error) {
        console.error("❌ Error in test-data API:", error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        )
    }
}

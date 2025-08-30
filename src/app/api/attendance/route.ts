import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// جلب سجلات الحضور
export async function GET(request: NextRequest) {
    try {
        const { userId, sessionClaims } = auth()
        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const date = searchParams.get("date")
        const classId = searchParams.get("classId")
        const subjectId = searchParams.get("subjectId")

        let whereClause: any = {}

        if (date) {
            const startDate = new Date(date)
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 1)

            whereClause.date = {
                gte: startDate,
                lt: endDate
            }
        }

        if (classId) {
            // هنا يمكن إضافة فلترة حسب الفصل إذا كان موجوداً في قاعدة البيانات
        }

        if (subjectId) {
            whereClause.lessonId = parseInt(subjectId)
        }

        const attendanceRecords = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                Student: {
                    select: {
                        id: true,
                        fullName: true,
                        studentPhoto: true,
                        studyLevel: true,
                        specialization: true
                    }
                }
            },
            orderBy: {
                date: "desc"
            }
        })

        return NextResponse.json(attendanceRecords)
    } catch (error) {
        console.error("خطأ في جلب سجلات الحضور:", error)
        return NextResponse.json(
            { error: "خطأ في جلب البيانات" },
            { status: 500 }
        )
    }
}

// إضافة سجل حضور جديد
export async function POST(request: NextRequest) {
    try {
        const { userId, sessionClaims } = auth()
        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
        }

        const body = await request.json()
        const { studentId, lessonId, present, date, notes } = body

        // التحقق من وجود سجل حضور سابق لنفس الطالب في نفس اليوم
        const existingRecord = await prisma.attendance.findFirst({
            where: {
                studentId,
                lessonId,
                date: {
                    gte: new Date(date),
                    lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
                }
            }
        })

        if (existingRecord) {
            // تحديث السجل الموجود
            const updatedRecord = await prisma.attendance.update({
                where: { id: existingRecord.id },
                data: {
                    present,
                    date: new Date(date)
                }
            })
            return NextResponse.json(updatedRecord)
        } else {
            // إنشاء سجل جديد
            const newRecord = await prisma.attendance.create({
                data: {
                    studentId,
                    lessonId,
                    present,
                    date: new Date(date)
                }
            })
            return NextResponse.json(newRecord)
        }
    } catch (error) {
        console.error("خطأ في إضافة سجل الحضور:", error)
        return NextResponse.json(
            { error: "خطأ في حفظ البيانات" },
            { status: 500 }
        )
    }
}

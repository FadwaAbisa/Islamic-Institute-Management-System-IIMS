import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, sessionClaims } = auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;

        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        if (role !== "admin" && role !== "teacher") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        const body = await request.json();
        const { attendanceRecords } = body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
        }

        // بدلاً من ربط الحضور بدرس محدد، سنسجل الحضور للفصل كاملاً في يوم معين
        // يمكننا إنشاء "درس افتراضي" أو تعديل نموذج البيانات

        // للبساطة الآن، سنجد أول درس في الفصل في اليوم المحدد
        const classId = attendanceRecords[0]?.classId;
        const day = attendanceRecords[0]?.day;

        if (!classId || !day) {
            return NextResponse.json({ error: "معرف الفصل واليوم مطلوبان" }, { status: 400 });
        }

        // البحث عن درس في هذا الفصل في هذا اليوم
        let lesson = await prisma.lesson.findFirst({
            where: {
                classId: classId,
                day: day as any
            }
        });

        // إذا لم يوجد درس، إنشاء درس افتراضي للحضور
        if (!lesson) {
            // البحث عن مادة افتراضية أو إنشاء واحدة
            let defaultSubject = await prisma.subject.findFirst({
                where: { name: "حضور عام" }
            });

            if (!defaultSubject) {
                defaultSubject = await prisma.subject.create({
                    data: { name: "حضور عام" }
                });
            }

            // إنشاء درس افتراضي للحضور
            lesson = await prisma.lesson.create({
                data: {
                    name: `حضور ${day}`,
                    day: day as any,
                    startTime: new Date(`2024-01-01T08:00:00.000Z`),
                    endTime: new Date(`2024-01-01T09:00:00.000Z`),
                    subjectId: defaultSubject.id,
                    classId: classId,
                    teacherId: userId
                }
            });
        }

        // حذف السجلات الموجودة لنفس اليوم والدرس
        await prisma.attendance.deleteMany({
            where: {
                lessonId: lesson.id,
                date: {
                    gte: new Date(attendanceRecords[0].date),
                    lt: new Date(new Date(attendanceRecords[0].date).getTime() + 24 * 60 * 60 * 1000)
                }
            }
        });

        // إدراج السجلات الجديدة
        const attendanceData = attendanceRecords.map((record: any) => ({
            studentId: record.studentId,
            lessonId: lesson.id,
            date: new Date(record.date),
            present: record.present
        }));

        await prisma.attendance.createMany({
            data: attendanceData
        });

        return NextResponse.json({
            message: "تم حفظ الحضور بنجاح",
            count: attendanceData.length
        });

    } catch (error) {
        console.error("خطأ في حفظ الحضور:", error);
        return NextResponse.json(
            { error: "خطأ في حفظ الحضور" },
            { status: 500 }
        );
    }
}






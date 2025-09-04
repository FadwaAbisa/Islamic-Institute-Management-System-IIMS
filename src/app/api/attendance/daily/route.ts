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

        // بدلاً من ربط الحضور بدرس محدد، سنسجل الحضور للمرحلة الدراسية كاملة في يوم معين
        // يمكننا إنشاء "درس افتراضي" أو تعديل نموذج البيانات

        // للبساطة الآن، سنجد أول درس في المرحلة الدراسية في اليوم المحدد
        const studyLevel = attendanceRecords[0]?.studyLevel;
        const day = attendanceRecords[0]?.day;

        if (!studyLevel || !day) {
            return NextResponse.json({ error: "المرحلة الدراسية واليوم مطلوبان" }, { status: 400 });
        }

        // البحث عن درس في هذه المرحلة الدراسية في هذا اليوم
        let lesson = await prisma.lesson.findFirst({
            where: {
                Class: {
                    students: {
                        some: {
                            studyLevel: studyLevel
                        }
                    }
                },
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

            // البحث عن فصل افتراضي أو إنشاء واحد
            let defaultClass = await prisma.class.findFirst({
                where: { name: `فصل ${studyLevel}` }
            });

            if (!defaultClass) {
                defaultClass = await prisma.class.create({
                    data: { 
                        name: `فصل ${studyLevel}`,
                        description: `فصل افتراضي للمرحلة الدراسية ${studyLevel}`
                    }
                });
            }

            // إنشاء درس افتراضي للحضور
            lesson = await prisma.lesson.create({
                data: {
                    name: `حضور ${day} - ${studyLevel}`,
                    day: day as any,
                    startTime: new Date(`2024-01-01T08:00:00.000Z`),
                    endTime: new Date(`2024-01-01T09:00:00.000Z`),
                    subjectId: defaultSubject.id,
                    classId: defaultClass.id,
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






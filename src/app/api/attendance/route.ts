import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
    try {
        const { userId, sessionClaims } = auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;

        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");
        const lessonId = searchParams.get("lessonId");
        const classId = searchParams.get("classId");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");

        let whereCondition: any = {};

        // إضافة شروط البحث
        if (studentId) whereCondition.studentId = studentId;
        if (lessonId) whereCondition.lessonId = parseInt(lessonId);
        if (classId) whereCondition.lesson = { classId: parseInt(classId) };

        if (dateFrom && dateTo) {
            whereCondition.date = {
                gte: new Date(dateFrom),
                lte: new Date(dateTo),
            };
        }

        // شروط الصلاحيات
        switch (role) {
            case "admin":
                break;
            case "teacher":
                whereCondition.lesson = {
                    ...whereCondition.lesson,
                    teacherId: userId,
                };
                break;
            case "student":
                whereCondition.studentId = userId;
                break;
            case "parent":
                whereCondition.student = {
                    parentId: userId,
                };
                break;
            default:
                return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        const attendance = await prisma.attendance.findMany({
            where: whereCondition,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        class: {
                            select: { name: true }
                        }
                    }
                },
                lesson: {
                    include: {
                        subject: {
                            select: { name: true }
                        },
                        class: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: {
                date: "desc"
            }
        });

        return NextResponse.json(attendance);
    } catch (error) {
        console.error("خطأ في جلب بيانات الحضور:", error);
        return NextResponse.json(
            { error: "خطأ في الخادم الداخلي" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, sessionClaims } = auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;

        if (!userId || (role !== "admin" && role !== "teacher")) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await request.json();
        const { attendanceRecords } = body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return NextResponse.json(
                { error: "بيانات الحضور مطلوبة" },
                { status: 400 }
            );
        }

        // التحقق من صلاحية المعلم للدرس
        if (role === "teacher") {
            const lessonId = attendanceRecords[0]?.lessonId;
            if (lessonId) {
                const lesson = await prisma.lesson.findFirst({
                    where: {
                        id: lessonId,
                        teacherId: userId
                    }
                });

                if (!lesson) {
                    return NextResponse.json(
                        { error: "غير مصرح لتسجيل الحضور لهذا الدرس" },
                        { status: 403 }
                    );
                }
            }
        }

        // حذف السجلات الموجودة لنفس التاريخ والدرس أولاً
        const firstRecord = attendanceRecords[0];
        if (firstRecord?.lessonId && firstRecord?.date) {
            await prisma.attendance.deleteMany({
                where: {
                    lessonId: firstRecord.lessonId,
                    date: {
                        gte: new Date(new Date(firstRecord.date).setHours(0, 0, 0, 0)),
                        lt: new Date(new Date(firstRecord.date).setHours(23, 59, 59, 999))
                    }
                }
            });
        }

        // إنشاء السجلات الجديدة
        const createdRecords = await prisma.attendance.createMany({
            data: attendanceRecords.map((record: any) => ({
                studentId: record.studentId,
                lessonId: record.lessonId,
                date: new Date(record.date),
                present: record.present
            }))
        });

        return NextResponse.json({
            message: "تم حفظ الحضور بنجاح",
            count: createdRecords.count
        });
    } catch (error) {
        console.error("خطأ في حفظ الحضور:", error);
        return NextResponse.json(
            { error: "خطأ في الخادم الداخلي" },
            { status: 500 }
        );
    }
}

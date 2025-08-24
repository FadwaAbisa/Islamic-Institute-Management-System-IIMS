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

        let whereCondition: any = {};

        // شروط الصلاحيات
        switch (role) {
            case "admin":
                break;
            case "teacher":
                whereCondition.teacherId = userId;
                break;
            case "student":
                // جلب الدروس للطالب من خلال الفصل
                const studentClasses = await prisma.student.findUnique({
                    where: { id: userId },
                    select: { classId: true }
                });
                if (studentClasses?.classId) {
                    whereCondition.classId = studentClasses.classId;
                }
                break;
            case "parent":
                // جلب الدروس لأطفال ولي الأمر
                const parentStudents = await prisma.student.findMany({
                    where: { parentId: userId },
                    select: { classId: true }
                });
                const classIds = parentStudents
                    .map(s => s.classId)
                    .filter(id => id !== null);
                if (classIds.length > 0) {
                    whereCondition.classId = { in: classIds };
                }
                break;
            default:
                return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        const lessons = await prisma.lesson.findMany({
            where: whereCondition,
            include: {
                subject: {
                    select: {
                        name: true
                    }
                },
                class: {
                    select: {
                        name: true
                    }
                },
                teacher: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: [
                { day: "asc" },
                { startTime: "asc" }
            ]
        });

        return NextResponse.json(lessons);
    } catch (error) {
        console.error("خطأ في جلب الدروس:", error);
        return NextResponse.json(
            { error: "خطأ في الخادم الداخلي" },
            { status: 500 }
        );
    }
}

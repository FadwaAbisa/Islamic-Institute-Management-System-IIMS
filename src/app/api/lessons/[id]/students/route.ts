import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId, sessionClaims } = auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;

        if (!userId) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const lessonId = parseInt(params.id);

        // التحقق من وجود الدرس
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                class: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!lesson) {
            return NextResponse.json(
                { error: "الدرس غير موجود" },
                { status: 404 }
            );
        }

        // التحقق من الصلاحيات
        switch (role) {
            case "admin":
                break;
            case "teacher":
                if (lesson.teacherId !== userId) {
                    return NextResponse.json(
                        { error: "غير مصرح للوصول لهذا الدرس" },
                        { status: 403 }
                    );
                }
                break;
            default:
                return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        // جلب طلاب الفصل
        const students = await prisma.student.findMany({
            where: {
                classId: lesson.class.id
            },
            select: {
                id: true,
                fullName: true,
                class: {
                    select: { name: true }
                }
            },
            orderBy: {
                fullName: "asc"
            }
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error("خطأ في جلب طلاب الدرس:", error);
        return NextResponse.json(
            { error: "خطأ في الخادم الداخلي" },
            { status: 500 }
        );
    }
}

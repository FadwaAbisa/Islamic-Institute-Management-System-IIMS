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

        const classId = parseInt(params.id);

        if (isNaN(classId)) {
            return NextResponse.json({ error: "معرف الفصل غير صحيح" }, { status: 400 });
        }

        // التحقق من صلاحية الوصول للفصل
        let whereCondition: any = { classId };

        switch (role) {
            case "admin":
                break;
            case "teacher":
                // التأكد من أن المعلم يدرس في هذا الفصل
                const teacherClass = await prisma.class.findFirst({
                    where: {
                        id: classId,
                        lessons: {
                            some: {
                                teacherId: userId
                            }
                        }
                    }
                });

                if (!teacherClass) {
                    return NextResponse.json({ error: "غير مصرح للوصول لهذا الفصل" }, { status: 403 });
                }
                break;
            default:
                return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        const students = await prisma.student.findMany({
            where: whereCondition,
            select: {
                id: true,
                fullName: true,
                class: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                fullName: 'asc'
            }
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error("خطأ في جلب طلاب الفصل:", error);
        return NextResponse.json(
            { error: "خطأ في جلب طلاب الفصل" },
            { status: 500 }
        );
    }
}







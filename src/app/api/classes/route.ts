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
                // المعلم يرى الفصول التي يدرس فيها فقط
                whereCondition.lessons = {
                    some: {
                        teacherId: userId
                    }
                };
                break;
            default:
                return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
        }

        const classes = await prisma.class.findMany({
            where: whereCondition,
            include: {
                grade: true,
                _count: {
                    select: {
                        students: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(classes);
    } catch (error) {
        console.error("خطأ في جلب الفصول:", error);
        return NextResponse.json(
            { error: "خطأ في جلب الفصول" },
            { status: 500 }
        );
    }
}

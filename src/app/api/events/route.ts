import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - جلب جميع الأحداث
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const eventType = searchParams.get("eventType");
        const status = searchParams.get("status");

        let whereClause: any = {};

        // فلترة حسب التاريخ
        if (startDate && endDate) {
            whereClause.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        // فلترة حسب نوع الحدث
        if (eventType) {
            whereClause.eventType = eventType;
        }

        // فلترة حسب الحالة
        if (status) {
            whereClause.status = status;
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            orderBy: {
                startTime: "asc",
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "فشل في جلب الأحداث" },
            { status: 500 }
        );
    }
}

// POST - إنشاء حدث جديد
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Received event data:", body);

        // التحقق من البيانات المطلوبة
        if (!body.title || !body.startTime || !body.endTime) {
            console.log("Missing required fields:", {
                title: body.title || "مفقود",
                startTime: body.startTime || "مفقود",
                endTime: body.endTime || "مفقود"
            });
            return NextResponse.json(
                {
                    error: "العنوان ووقت البداية والنهاية مطلوبة",
                    missingFields: {
                        title: !body.title,
                        startTime: !body.startTime,
                        endTime: !body.endTime
                    }
                },
                { status: 400 }
            );
        }

        // التحقق من صحة التواريخ
        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);

        if (startTime >= endTime) {
            return NextResponse.json(
                { error: "وقت البداية يجب أن يكون قبل وقت النهاية" },
                { status: 400 }
            );
        }

        const event = await prisma.event.create({
            data: {
                title: body.title,
                description: body.description || "",
                startTime,
                endTime,
                location: body.location || null,
                eventType: body.eventType || "ACADEMIC",
                priority: body.priority || "MEDIUM",
                status: body.status || "ACTIVE",
                color: body.color || null,
                isAllDay: body.isAllDay || false,
                recurrence: body.recurrence || "NONE",
                recurrenceEndDate: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : null,
                attendees: body.attendees || [],
                createdBy: body.createdBy || null,
                image: body.image || null,
                tags: body.tags || [],
                notes: body.notes || null,
            },
        });

        console.log("🎉✅ تم إنشاء الحدث بنجاح وحفظه في قاعدة البيانات! 🎉✅");
        console.log("📋 تفاصيل الحدث المحفوظ:", {
            "🆔 ID": event.id,
            "📝 العنوان": event.title,
            "📍 المكان": event.location || "غير محدد",
            "📅 تاريخ البداية": event.startTime,
            "⏰ تاريخ النهاية": event.endTime,
            "🗂️ النوع": event.eventType,
            "⭐ الأولوية": event.priority,
            "💾 وقت الحفظ": event.createdAt
        });
        console.log("🔗 رابط قاعدة البيانات: Event ID =", event.id);

        return NextResponse.json({
            success: true,
            message: "تم إنشاء الحدث بنجاح!",
            event: event
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "فشل في إنشاء الحدث" },
            { status: 500 }
        );
    }
}

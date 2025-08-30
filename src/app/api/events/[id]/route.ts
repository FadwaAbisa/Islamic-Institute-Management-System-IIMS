import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - جلب حدث محدد
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!event) {
            return NextResponse.json(
                { error: "الحدث غير موجود" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "فشل في جلب الحدث" },
            { status: 500 }
        );
    }
}

// PUT - تحديث حدث
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // التحقق من وجود الحدث
        const existingEvent = await prisma.event.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!existingEvent) {
            return NextResponse.json(
                { error: "الحدث غير موجود" },
                { status: 404 }
            );
        }

        // التحقق من صحة التواريخ إذا تم تحديثها
        if (body.startTime && body.endTime) {
            const startTime = new Date(body.startTime);
            const endTime = new Date(body.endTime);

            if (startTime >= endTime) {
                return NextResponse.json(
                    { error: "وقت البداية يجب أن يكون قبل وقت النهاية" },
                    { status: 400 }
                );
            }
        }

        const updatedEvent = await prisma.event.update({
            where: { id: parseInt(params.id) },
            data: {
                title: body.title,
                description: body.description,
                startTime: body.startTime ? new Date(body.startTime) : undefined,
                endTime: body.endTime ? new Date(body.endTime) : undefined,
                location: body.location,
                eventType: body.eventType,
                priority: body.priority,
                status: body.status,
                color: body.color,
                isAllDay: body.isAllDay,
                recurrence: body.recurrence,
                recurrenceEndDate: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : null,
                attendees: body.attendees,
                image: body.image,
                tags: body.tags,
                notes: body.notes,
            },
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "فشل في تحديث الحدث" },
            { status: 500 }
        );
    }
}

// DELETE - حذف حدث
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // التحقق من وجود الحدث
        const existingEvent = await prisma.event.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!existingEvent) {
            return NextResponse.json(
                { error: "الحدث غير موجود" },
                { status: 404 }
            );
        }

        await prisma.event.delete({
            where: { id: parseInt(params.id) },
        });

        return NextResponse.json(
            { message: "تم حذف الحدث بنجاح" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json(
            { error: "فشل في حذف الحدث" },
            { status: 500 }
        );
    }
}



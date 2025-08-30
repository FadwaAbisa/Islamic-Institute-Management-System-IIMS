import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schema للتحقق من البيانات
const createMessageSchema = z.object({
  content: z.string().min(1, "محتوى الرسالة مطلوب"),
  receiverId: z.string().min(1, "معرف المستقبل مطلوب"),
  receiverType: z.enum(["STUDENT", "TEACHER", "STAFF", "ADMIN"]),
});

// GET - جلب جميع المحادثات للمستخدم الحالي
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const url = new URL(request.url);
    const userType = url.searchParams.get("userType");
    
    if (!userType) {
      return NextResponse.json({ error: "نوع المستخدم مطلوب" }, { status: 400 });
    }

    // إرجاع بيانات تجريبية لحين تشغيل Migration
    const mockConversations = [
      {
        id: "1",
        participant1Id: userId,
        participant1Type: userType,
        participant2Id: "teacher_456", 
        participant2Type: "TEACHER",
        lastMessageAt: new Date().toISOString(),
        lastMessage: {
          content: "مرحباً، كيف يمكنني مساعدتك؟",
          createdAt: new Date().toISOString(),
          senderId: "teacher_456"
        },
        otherParticipant: {
          id: "teacher_456",
          fullName: "الأستاذ أحمد محمد",
          type: "TEACHER"
        }
      }
    ];

    return NextResponse.json(mockConversations);

    /* الكود الأصلي سيفعل بعد تشغيل Migration:
    
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            participant1Id: userId,
            participant1Type: userType as any,
          },
          {
            participant2Id: userId,
            participant2Type: userType as any,
          },
        ],
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: conversation.participant1Id,
                receiverId: conversation.participant2Id,
              },
              {
                senderId: conversation.participant2Id,
                receiverId: conversation.participant1Id,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const otherParticipantId = 
          conversation.participant1Id === userId 
            ? conversation.participant2Id 
            : conversation.participant1Id;
        
        const otherParticipantType = 
          conversation.participant1Id === userId 
            ? conversation.participant2Type 
            : conversation.participant1Type;

        let otherParticipant: any = null;
        if (otherParticipantType === "STUDENT") {
          otherParticipant = await prisma.student.findUnique({
            where: { id: otherParticipantId },
            select: { id: true, fullName: true, studentPhoto: true },
          });
        } else if (otherParticipantType === "TEACHER") {
          otherParticipant = await prisma.teacher.findUnique({
            where: { id: otherParticipantId },
            select: { id: true, fullName: true },
          });
        } else if (otherParticipantType === "STAFF") {
          otherParticipant = await prisma.staff.findUnique({
            where: { id: otherParticipantId },
            select: { id: true, fullName: true },
          });
        }

        return {
          ...conversation,
          lastMessage,
          otherParticipant: {
            ...otherParticipant,
            type: otherParticipantType,
          },
        };
      })
    );

    return NextResponse.json(conversationsWithLastMessage);
    */
    
  } catch (error) {
    console.error("خطأ في جلب المحادثات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// POST - إنشاء رسالة جديدة
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const url = new URL(request.url);
    const senderType = url.searchParams.get("senderType");

    if (!senderType) {
      return NextResponse.json({ error: "نوع المرسل مطلوب" }, { status: 400 });
    }

    // التحقق من البيانات
    const validatedData = createMessageSchema.parse(body);

    // إرجاع رسالة تجريبية لحين تشغيل Migration
    const mockMessage = {
      id: Date.now().toString(),
      content: validatedData.content,
      senderId: userId,
      senderType: senderType,
      receiverId: validatedData.receiverId,
      receiverType: validatedData.receiverType,
      createdAt: new Date().toISOString(),
      success: true
    };

    return NextResponse.json(mockMessage, { status: 201 });

    /* الكود الأصلي سيفعل بعد تشغيل Migration:
    
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: userId,
            participant1Type: senderType as any,
            participant2Id: validatedData.receiverId,
            participant2Type: validatedData.receiverType,
          },
          {
            participant1Id: validatedData.receiverId,
            participant1Type: validatedData.receiverType,
            participant2Id: userId,
            participant2Type: senderType as any,
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant1Type: senderType as any,
          participant2Id: validatedData.receiverId,
          participant2Type: validatedData.receiverType,
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        senderId: userId,
        senderType: senderType as any,
        receiverId: validatedData.receiverId,
        receiverType: validatedData.receiverType,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
    */
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: error.errors },
        { status: 400 }
      );
    }

    console.error("خطأ في إنشاء الرسالة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
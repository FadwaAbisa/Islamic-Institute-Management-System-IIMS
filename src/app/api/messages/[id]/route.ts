import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET - جلب رسائل محادثة معينة
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const conversationId = params.id;

    // إرجاع بيانات تجريبية لحين تشغيل Migration
    const mockMessages = [
      {
        id: "1",
        content: "مرحباً أستاذ، أريد استفساراً حول المنهج",
        senderId: userId,
        senderType: "STUDENT",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        readAt: null,
        sender: {
          id: userId,
          fullName: "أنت",
          type: "STUDENT"
        },
        replies: []
      },
      {
        id: "2",
        content: "أهلاً وسهلاً، ما هو استفسارك؟",
        senderId: "teacher_1",
        senderType: "TEACHER",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        readAt: new Date().toISOString(),
        sender: {
          id: "teacher_1",
          fullName: "الأستاذ أحمد محمد",
          type: "TEACHER"
        },
        replies: []
      }
    ];

    const mockConversation = {
      id: conversationId,
      participant1Id: userId,
      participant1Type: "STUDENT",
      participant2Id: "teacher_1",
      participant2Type: "TEACHER"
    };

    return NextResponse.json({
      messages: mockMessages,
      conversation: mockConversation,
      pagination: {
        page: 1,
        limit: 50,
        hasMore: false,
      },
    });

    /* الكود الأصلي سيفعل بعد تشغيل Migration:
    
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
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
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        let sender: any = null;
        if (message.senderType === "STUDENT") {
          sender = await prisma.student.findUnique({
            where: { id: message.senderId },
            select: { id: true, fullName: true, studentPhoto: true },
          });
        } else if (message.senderType === "TEACHER") {
          sender = await prisma.teacher.findUnique({
            where: { id: message.senderId },
            select: { id: true, fullName: true },
          });
        } else if (message.senderType === "STAFF") {
          sender = await prisma.staff.findUnique({
            where: { id: message.senderId },
            select: { id: true, fullName: true },
          });
        }

        const repliesWithSenders = await Promise.all(
          message.replies.map(async (reply) => {
            let replySender: any = null;
            if (reply.senderType === "STUDENT") {
              replySender = await prisma.student.findUnique({
                where: { id: reply.senderId },
                select: { id: true, fullName: true, studentPhoto: true },
              });
            } else if (reply.senderType === "TEACHER") {
              replySender = await prisma.teacher.findUnique({
                where: { id: reply.senderId },
                select: { id: true, fullName: true },
              });
            } else if (reply.senderType === "STAFF") {
              replySender = await prisma.staff.findUnique({
                where: { id: reply.senderId },
                select: { id: true, fullName: true },
              });
            }

            return {
              ...reply,
              sender: {
                ...replySender,
                type: reply.senderType,
              },
            };
          })
        );

        return {
          ...message,
          sender: {
            ...sender,
            type: message.senderType,
          },
          replies: repliesWithSenders,
        };
      })
    );

    return NextResponse.json({
      messages: messagesWithSenders,
      conversation,
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit,
      },
    });
    */
    
  } catch (error) {
    console.error("خطأ في جلب الرسائل:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// PUT - تحديث حالة قراءة الرسائل
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // إرجاع نجاح تجريبي لحين تشغيل Migration
    return NextResponse.json({ success: true });

    /* الكود الأصلي سيفعل بعد تشغيل Migration:
    
    const conversationId = params.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
    }

    await prisma.message.updateMany({
      where: {
        receiverId: userId,
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
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    await prisma.messageReply.updateMany({
      where: {
        message: {
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
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
    */
    
  } catch (error) {
    console.error("خطأ في تحديث حالة القراءة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
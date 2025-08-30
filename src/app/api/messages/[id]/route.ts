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
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    console.log(`🔍 Fetching messages for conversation: ${conversationId}`);

    // البحث عن المحادثة
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

    console.log(`✅ Found conversation: ${conversation.id}`);

    // جلب الرسائل من المحادثة
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" }, // ترتيب تصاعدي للرسائل (الأقدم أولاً)
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log(`📝 Found ${messages.length} messages`);

    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        let sender: any = null;
        
        try {
          // محاولة جلب معلومات المرسل من Clerk أولاً
          const { clerkClient } = await import("@clerk/nextjs/server");
          const clerkUser = await clerkClient.users.getUser(message.senderId).catch(() => null);
          
          if (clerkUser) {
            // استخدام بيانات Clerk
            sender = {
              id: clerkUser.id,
              fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'مستخدم مجهول',
              studentPhoto: clerkUser.imageUrl,
              avatar: clerkUser.imageUrl,
              type: message.senderType,
            };
          } else {
            // البحث في قاعدة البيانات المحلية كبديل
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
            } else if (message.senderType === "ADMIN") {
              sender = await prisma.admin.findUnique({
                where: { id: message.senderId },
                select: { id: true, username: true },
              });
              if (sender) {
                sender.fullName = sender.username;
              }
            }
            
            if (sender) {
              sender.type = message.senderType;
            }
          }
        } catch (error) {
          console.error("خطأ في جلب معلومات المرسل:", error);
          // استخدام معلومات افتراضية
          sender = {
            id: message.senderId,
            fullName: "مستخدم مجهول",
            type: message.senderType,
          };
        }

        const repliesWithSenders = await Promise.all(
          message.replies.map(async (reply) => {
            let replySender: any = null;
            
            try {
              // محاولة جلب معلومات مرسل الرد من Clerk أولاً
              const { clerkClient } = await import("@clerk/nextjs/server");
              const clerkUser = await clerkClient.users.getUser(reply.senderId).catch(() => null);
              
              if (clerkUser) {
                replySender = {
                  id: clerkUser.id,
                  fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'مستخدم مجهول',
                  studentPhoto: clerkUser.imageUrl,
                  avatar: clerkUser.imageUrl,
                  type: reply.senderType,
                };
              } else {
                // البحث في قاعدة البيانات المحلية كبديل
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
                } else if (reply.senderType === "ADMIN") {
                  replySender = await prisma.admin.findUnique({
                    where: { id: reply.senderId },
                    select: { id: true, username: true },
                  });
                  if (replySender) {
                    replySender.fullName = replySender.username;
                  }
                }
                
                if (replySender) {
                  replySender.type = reply.senderType;
                }
              }
            } catch (error) {
              console.error("خطأ في جلب معلومات مرسل الرد:", error);
              replySender = {
                id: reply.senderId,
                fullName: "مستخدم مجهول",
                type: reply.senderType,
              };
            }

            return {
              ...reply,
              sender: replySender,
            };
          })
        );

        return {
          ...message,
          sender: sender,
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

    const conversationId = params.id;

    console.log(`📖 Marking conversation ${conversationId} as read for user ${userId}`);

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

    // تحديث حالة قراءة الرسائل في هذه المحادثة
    await prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        receiverId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    // تحديث حالة قراءة الردود
    await prisma.messageReply.updateMany({
      where: {
        message: {
          conversationId: conversationId,
        },
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    console.log(`✅ Marked conversation ${conversationId} as read`);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("خطأ في تحديث حالة القراءة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
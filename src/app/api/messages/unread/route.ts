import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET - جلب الرسائل غير المقروءة الحقيقية
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

    console.log(`📊 Fetching unread messages for user ${userId} (${userType})`);

    // جلب الرسائل غير المقروءة من قاعدة البيانات
    const unreadMessages = await prisma.message.findMany({
      where: {
        receiverId: userId,
        receiverType: userType.toUpperCase() as any,
        readAt: null,
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        senderType: true,
        conversationId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📬 Found ${unreadMessages.length} unread messages`);

    // تحسين البيانات وإضافة معلومات المرسل
    const messagesWithSender = await Promise.all(
      unreadMessages.map(async (message) => {
        let senderName = "مستخدم مجهول";
        
        try {
          // محاولة جلب اسم المرسل من Clerk
          const { clerkClient } = await import("@clerk/nextjs/server");
          const clerkUser = await clerkClient.users.getUser(message.senderId).catch(() => null);
          
          if (clerkUser) {
            senderName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
                        clerkUser.username || 'مستخدم مجهول';
          }
        } catch (error) {
          console.error(`خطأ في جلب معلومات المرسل ${message.senderId}:`, error);
        }

        return {
          id: message.id,
          senderId: message.senderId,
          senderName,
          content: message.content.length > 50 
            ? message.content.substring(0, 50) + "..." 
            : message.content,
          createdAt: message.createdAt.toISOString(),
          conversationId: message.conversationId,
        };
      })
    );

    return NextResponse.json(messagesWithSender);
  } catch (error) {
    console.error("خطأ في جلب الرسائل غير المقروءة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// POST - تعيين رسائل كمقروءة في قاعدة البيانات
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, markAll } = body;

    console.log(`📖 Marking messages as read for user ${userId}`, { conversationId, markAll });

    if (markAll) {
      // تعيين جميع الرسائل كمقروءة
      await prisma.message.updateMany({
        where: {
          receiverId: userId,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
      
      console.log(`✅ Marked all messages as read for user ${userId}`);
      return NextResponse.json({ success: true, message: "تم تعيين جميع الرسائل كمقروءة" });
      
    } else if (conversationId) {
      // تعيين محادثة محددة كمقروءة
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
      
      console.log(`✅ Marked conversation ${conversationId} as read for user ${userId}`);
      return NextResponse.json({ success: true, message: "تم تعيين المحادثة كمقروءة" });
    }

    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  } catch (error) {
    console.error("خطأ في تعيين الرسائل كمقروءة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

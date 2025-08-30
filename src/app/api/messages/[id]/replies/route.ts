import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// الحصول على ردود رسالة محددة
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = parseInt(params.id);
    
    const replies = await prisma.reply.findMany({
      where: { messageId },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الردود' },
      { status: 500 }
    );
  }
}

// إضافة رد جديد
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const messageId = params.id;
    const body = await request.json();
    const url = new URL(request.url);
    const senderType = url.searchParams.get("senderType");

    if (!senderType) {
      return NextResponse.json({ error: "نوع المرسل مطلوب" }, { status: 400 });
    }

    // التحقق من البيانات
    const validatedData = createReplySchema.parse(body);

    // إرجاع رد تجريبي لحين تشغيل Migration
    const mockReply = {
      id: Date.now().toString(),
      content: validatedData.content,
      senderId: userId,
      senderType: senderType,
      messageId: messageId,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockReply, { status: 201 });

    /* الكود الأصلي سيفعل بعد تشغيل Migration:
    
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    if (!message) {
      return NextResponse.json({ error: "الرسالة غير موجودة أو غير مصرح بالوصول" }, { status: 404 });
    }

    const reply = await prisma.messageReply.create({
      data: {
        content: validatedData.content,
        senderId: userId,
        senderType: senderType as any,
        messageId: messageId,
      },
    });

    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: message.senderId,
            participant2Id: message.receiverId,
          },
          {
            participant1Id: message.receiverId,
            participant2Id: message.senderId,
          },
        ],
      },
    });

    if (conversation) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    return NextResponse.json(reply, { status: 201 });
    */
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: error.errors },
        { status: 400 }
      );
    }

    console.error("خطأ في إنشاء الرد:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
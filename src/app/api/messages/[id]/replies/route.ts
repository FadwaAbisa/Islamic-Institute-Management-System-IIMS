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
    const messageId = parseInt(params.id);
    const body = await request.json();
    const { content, replierId, replierType } = body;

    if (!content || !replierId || !replierType) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء الرد
    const reply = await prisma.reply.create({
      data: {
        content,
        messageId,
        replierId,
        replierType
      }
    });

    // تحديث حالة الرسالة إلى "تم الرد عليها"
    await prisma.message.update({
      where: { id: messageId },
      data: { status: 'REPLIED' }
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء الرد' },
      { status: 500 }
    );
  }
}

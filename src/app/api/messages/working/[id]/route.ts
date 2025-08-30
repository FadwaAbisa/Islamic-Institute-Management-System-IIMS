import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// GET - جلب رسائل محادثة معينة (تجريبي)
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

    // رسائل تجريبية
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

    return NextResponse.json({
      messages: mockMessages,
      conversation: {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "STUDENT",
        participant2Id: "teacher_1",
        participant2Type: "TEACHER"
      },
      pagination: {
        page: 1,
        limit: 50,
        hasMore: false
      }
    });
  } catch (error) {
    console.error("خطأ في جلب الرسائل:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// PUT - تحديث حالة قراءة الرسائل (تجريبي)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // محاكاة تحديث حالة القراءة
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("خطأ في تحديث حالة القراءة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

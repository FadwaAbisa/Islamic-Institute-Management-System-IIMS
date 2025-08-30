import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// بيانات تجريبية للمحادثات
const mockConversations = [
  {
    id: "1",
    participant1Id: "user_123",
    participant1Type: "STUDENT",
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

// GET - جلب المحادثات التجريبية
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // إرجاع البيانات التجريبية
    return NextResponse.json(mockConversations);
  } catch (error) {
    console.error("خطأ في جلب المحادثات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

// POST - إنشاء رسالة تجريبية
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    
    // محاكاة إنشاء رسالة
    const newMessage = {
      id: Date.now().toString(),
      content: body.content,
      senderId: userId,
      receiverId: body.receiverId,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("خطأ في إنشاء الرسالة:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

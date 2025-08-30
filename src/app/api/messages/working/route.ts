import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// GET - جلب المحادثات التجريبية
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // بيانات تجريبية للمحادثات
    const mockConversations = [
      {
        id: "1",
        participant1Id: userId,
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
      },
      {
        id: "2",
        participant1Id: userId,
        participant1Type: "STUDENT", 
        participant2Id: "staff_789",
        participant2Type: "STAFF",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        lastMessage: {
          content: "تم استلام طلبك وسيتم المراجعة قريباً",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          senderId: "staff_789"
        },
        otherParticipant: {
          id: "staff_789",
          fullName: "منسق الشؤون الطلابية",
          type: "STAFF"
        }
      }
    ];

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
      createdAt: new Date().toISOString(),
      success: true
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

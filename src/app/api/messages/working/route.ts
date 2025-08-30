import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET - جلب المحادثات التجريبية
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // تحديد نوع المستخدم
    const url = new URL(request.url);
    const userType = url.searchParams.get("userType") || "STUDENT";

    // بيانات تجريبية للمحادثات حسب نوع المستخدم
    // القواعد: طالب ↔ معلم، معلم ↔ موظف إداري، موظف إداري ↔ مدير النظام
    let mockConversations: any[] = [];

    if (userType === "STUDENT") {
      // الطالب: محادثات مع المعلمين فقط
      mockConversations = [
        {
          id: "1",
          participant1Id: userId,
          participant1Type: "STUDENT",
          participant2Id: "teacher_456", 
          participant2Type: "TEACHER",
          lastMessageAt: new Date().toISOString(),
          lastMessage: {
            content: "مرحباً، كيف يمكنني مساعدتك في المادة؟",
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
          participant2Id: "teacher_789",
          participant2Type: "TEACHER",
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          lastMessage: {
            content: "لا تنس مراجعة الدرس الأخير قبل الامتحان",
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            senderId: "teacher_789"
          },
          otherParticipant: {
            id: "teacher_789",
            fullName: "الأستاذة فاطمة علي",
            type: "TEACHER"
          }
        }
      ];
    } else if (userType === "TEACHER") {
      // المعلم: محادثات مع الطلاب والموظفين الإداريين
      mockConversations = [
        {
          id: "3",
          participant1Id: userId,
          participant1Type: "TEACHER",
          participant2Id: "student_123", 
          participant2Type: "STUDENT",
          lastMessageAt: new Date().toISOString(),
          lastMessage: {
            content: "شكراً لك أستاذ، فهمت الدرس الآن",
            createdAt: new Date().toISOString(),
            senderId: "student_123"
          },
          otherParticipant: {
            id: "student_123",
            fullName: "محمد أحمد إبراهيم",
            type: "STUDENT"
          }
        },
        {
          id: "4",
          participant1Id: userId,
          participant1Type: "TEACHER", 
          participant2Id: "staff_456",
          participant2Type: "STAFF",
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          lastMessage: {
            content: "تم إعداد جدول الامتحانات كما طلبت",
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            senderId: "staff_456"
          },
          otherParticipant: {
            id: "staff_456",
            fullName: "منسق الشؤون الطلابية",
            type: "STAFF"
          }
        }
      ];
    } else if (userType === "STAFF") {
      // الموظف الإداري: محادثات مع المعلمين ومدير النظام
      mockConversations = [
        {
          id: "5",
          participant1Id: userId,
          participant1Type: "STAFF",
          participant2Id: "teacher_321", 
          participant2Type: "TEACHER",
          lastMessageAt: new Date().toISOString(),
          lastMessage: {
            content: "أحتاج لمناقشة أداء الطلاب في هذا الفصل",
            createdAt: new Date().toISOString(),
            senderId: "teacher_321"
          },
          otherParticipant: {
            id: "teacher_321",
            fullName: "الأستاذ محمد خالد",
            type: "TEACHER"
          }
        },
        {
          id: "6",
          participant1Id: userId,
          participant1Type: "STAFF", 
          participant2Id: "admin_123",
          participant2Type: "ADMIN",
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          lastMessage: {
            content: "يمكنك المتابعة مع الخطة المقترحة",
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            senderId: "admin_123"
          },
          otherParticipant: {
            id: "admin_123",
            fullName: "مدير النظام",
            type: "ADMIN"
          }
        }
      ];
    } else if (userType === "ADMIN") {
      // مدير النظام: محادثات مع الموظفين الإداريين فقط
      mockConversations = [
        {
          id: "7",
          participant1Id: userId,
          participant1Type: "ADMIN",
          participant2Id: "staff_111", 
          participant2Type: "STAFF",
          lastMessageAt: new Date().toISOString(),
          lastMessage: {
            content: "تم إنجاز التقرير الشهري كما طلبت",
            createdAt: new Date().toISOString(),
            senderId: "staff_111"
          },
          otherParticipant: {
            id: "staff_111",
            fullName: "مسؤول الامتحانات",
            type: "STAFF"
          }
        },
        {
          id: "8",
          participant1Id: userId,
          participant1Type: "ADMIN", 
          participant2Id: "staff_222",
          participant2Type: "STAFF",
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          lastMessage: {
            content: "أحتاج موافقتك على التحديثات الجديدة",
            createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            senderId: "staff_222"
          },
          otherParticipant: {
            id: "staff_222",
            fullName: "منسق الأنشطة",
            type: "STAFF"
          }
        }
      ];
    }

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

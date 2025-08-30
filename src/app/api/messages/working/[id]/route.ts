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

    // تحديد نوع المستخدم من URL
    const url = new URL(request.url);
    const userType = url.searchParams.get("userType") || "STUDENT";

    // رسائل تجريبية حسب الدور والمحادثة
    let mockMessages: any[] = [];
    let conversation: any = {};

    if (conversationId === "1" && userType === "STUDENT") {
      // طالب يتحدث مع معلم
      mockMessages = [
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
          content: "أهلاً وسهلاً، ما هو استفسارك تحديداً؟",
          senderId: "teacher_456",
          senderType: "TEACHER",
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "teacher_456",
            fullName: "الأستاذ أحمد محمد",
            type: "TEACHER"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "STUDENT",
        participant2Id: "teacher_456",
        participant2Type: "TEACHER"
      };
    } else if (conversationId === "3" && userType === "TEACHER") {
      // معلم يتحدث مع طالب
      mockMessages = [
        {
          id: "3",
          content: "شكراً لك أستاذ، فهمت الدرس الآن",
          senderId: "student_123",
          senderType: "STUDENT",
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "student_123",
            fullName: "محمد أحمد إبراهيم",
            type: "STUDENT"
          },
          replies: []
        },
        {
          id: "4",
          content: "ممتاز! لا تتردد في السؤال إذا احتجت مساعدة",
          senderId: userId,
          senderType: "TEACHER",
          createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          readAt: null,
          sender: {
            id: userId,
            fullName: "أنت",
            type: "TEACHER"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "TEACHER",
        participant2Id: "student_123",
        participant2Type: "STUDENT"
      };
    } else if (conversationId === "4" && userType === "TEACHER") {
      // معلم يتحدث مع موظف إداري
      mockMessages = [
        {
          id: "5",
          content: "أحتاج لمناقشة جدول الامتحانات",
          senderId: userId,
          senderType: "TEACHER",
          createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          readAt: null,
          sender: {
            id: userId,
            fullName: "أنت",
            type: "TEACHER"
          },
          replies: []
        },
        {
          id: "6",
          content: "بالطبع، سأراجع الجدول وأرد عليك قريباً",
          senderId: "staff_456",
          senderType: "STAFF",
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "staff_456",
            fullName: "منسق الشؤون الطلابية",
            type: "STAFF"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "TEACHER",
        participant2Id: "staff_456",
        participant2Type: "STAFF"
      };
    } else if (conversationId === "5" && userType === "STAFF") {
      // موظف إداري يتحدث مع معلم
      mockMessages = [
        {
          id: "7",
          content: "أحتاج لمناقشة أداء الطلاب في هذا الفصل",
          senderId: "teacher_321",
          senderType: "TEACHER",
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "teacher_321",
            fullName: "الأستاذ محمد خالد",
            type: "TEACHER"
          },
          replies: []
        },
        {
          id: "8",
          content: "حسناً، يمكننا ترتيب اجتماع غداً لمناقشة التفاصيل",
          senderId: userId,
          senderType: "STAFF",
          createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          readAt: null,
          sender: {
            id: userId,
            fullName: "أنت",
            type: "STAFF"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "STAFF",
        participant2Id: "teacher_321",
        participant2Type: "TEACHER"
      };
    } else if (conversationId === "6" && userType === "STAFF") {
      // موظف إداري يتحدث مع مدير النظام
      mockMessages = [
        {
          id: "9",
          content: "تم إنجاز التقرير الشهري كما طلبت",
          senderId: userId,
          senderType: "STAFF",
          createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
          readAt: null,
          sender: {
            id: userId,
            fullName: "أنت",
            type: "STAFF"
          },
          replies: []
        },
        {
          id: "10",
          content: "شكراً لك، سأراجعه وأرد عليك بالملاحظات",
          senderId: "admin_123",
          senderType: "ADMIN",
          createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "admin_123",
            fullName: "مدير النظام",
            type: "ADMIN"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "STAFF",
        participant2Id: "admin_123",
        participant2Type: "ADMIN"
      };
    } else if (conversationId === "7" && userType === "ADMIN") {
      // مدير النظام يتحدث مع موظف إداري
      mockMessages = [
        {
          id: "11",
          content: "تم إنجاز التقرير الشهري كما طلبت",
          senderId: "staff_111",
          senderType: "STAFF",
          createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
          readAt: new Date().toISOString(),
          sender: {
            id: "staff_111",
            fullName: "مسؤول الامتحانات",
            type: "STAFF"
          },
          replies: []
        },
        {
          id: "12",
          content: "ممتاز، تقرير شامل ومفصل. استمر على هذا المستوى",
          senderId: userId,
          senderType: "ADMIN",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          readAt: null,
          sender: {
            id: userId,
            fullName: "أنت",
            type: "ADMIN"
          },
          replies: []
        }
      ];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: "ADMIN",
        participant2Id: "staff_111",
        participant2Type: "STAFF"
      };
    } else {
      // محادثة افتراضية
      mockMessages = [];
      conversation = {
        id: conversationId,
        participant1Id: userId,
        participant1Type: userType,
        participant2Id: "default_user",
        participant2Type: "STUDENT"
      };
    }

    return NextResponse.json({
      messages: mockMessages,
      conversation,
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

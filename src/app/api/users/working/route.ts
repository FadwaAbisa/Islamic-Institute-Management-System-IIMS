import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// GET - جلب قائمة المستخدمين المتاحين للمراسلة (تجريبي)
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const url = new URL(request.url);
    const userType = url.searchParams.get("userType");
    const search = url.searchParams.get("search") || "";

    if (!userType) {
      return NextResponse.json({ error: "نوع المستخدم مطلوب" }, { status: 400 });
    }

    // مستخدمون تجريبيون حسب نوع المستخدم
    let availableUsers: any[] = [];

    if (userType === "STUDENT") {
      // الطلاب يمكنهم مراسلة المعلمين فقط
      availableUsers = [
        {
          id: "teacher_1",
          fullName: "الأستاذ أحمد محمد",
          type: "TEACHER",
          avatar: null,
        },
        {
          id: "teacher_2", 
          fullName: "الأستاذة فاطمة علي",
          type: "TEACHER",
          avatar: null,
        }
      ];
    } 
    else if (userType === "TEACHER") {
      // المعلمون يمكنهم مراسلة الطلاب والموظفين
      availableUsers = [
        {
          id: "student_1",
          fullName: "محمد أحمد",
          type: "STUDENT",
          avatar: null,
        },
        {
          id: "student_2",
          fullName: "فاطمة محمد",
          type: "STUDENT", 
          avatar: null,
        },
        {
          id: "staff_1",
          fullName: "منسق الشؤون الطلابية",
          type: "STAFF",
          avatar: null,
        }
      ];
    }
    else if (userType === "STAFF") {
      // الموظفون يمكنهم مراسلة المعلمين والطلاب
      availableUsers = [
        {
          id: "teacher_1",
          fullName: "الأستاذ أحمد محمد",
          type: "TEACHER",
          avatar: null,
        },
        {
          id: "student_1", 
          fullName: "محمد أحمد",
          type: "STUDENT",
          avatar: null,
        }
      ];
    }

    // تطبيق البحث
    if (search) {
      availableUsers = availableUsers.filter(user => 
        user.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

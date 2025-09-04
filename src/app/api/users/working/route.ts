import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
    // القواعد: طالب ↔ معلم، معلم ↔ موظف إداري، موظف إداري ↔ مدير النظام
    let availableUsers: any[] = [];

    if (userType === "STUDENT") {
      // الطلاب يستطيعون الدردشة مع المعلمين فقط
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
        },
        {
          id: "teacher_3",
          fullName: "الأستاذ محمد خالد",
          type: "TEACHER", 
          avatar: null,
        }
      ];
    } 
    else if (userType === "TEACHER") {
      // المعلمون يستطيعون الدردشة مع الطلاب والموظفين الإداريين
      availableUsers = [
        {
          id: "student_1",
          fullName: "محمد أحمد إبراهيم",
          type: "STUDENT",
          avatar: null,
        },
        {
          id: "student_2",
          fullName: "فاطمة محمد علي",
          type: "STUDENT", 
          avatar: null,
        },
        {
          id: "student_3",
          fullName: "عبدالله سالم",
          type: "STUDENT",
          avatar: null,
        },
        {
          id: "staff_1",
          fullName: "منسق الشؤون الطلابية",
          type: "STAFF",
          avatar: null,
        },
        {
          id: "staff_2",
          fullName: "مسؤول الامتحانات",
          type: "STAFF",
          avatar: null,
        }
      ];
    }
    else if (userType === "STAFF") {
      // الموظفون الإداريون يستطيعون الدردشة مع المعلمين ومدير النظام
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
        },
        {
          id: "admin_1",
          fullName: "مدير النظام",
          type: "ADMIN",
          avatar: null,
        },
        {
          id: "admin_2",
          fullName: "نائب المدير",
          type: "ADMIN",
          avatar: null,
        }
      ];
    }
    else if (userType === "ADMIN") {
      // مدير النظام يستطيع الدردشة مع الموظفين الإداريين
      availableUsers = [
        {
          id: "staff_1",
          fullName: "منسق الشؤون الطلابية",
          type: "STAFF",
          avatar: null,
        },
        {
          id: "staff_2",
          fullName: "مسؤول الامتحانات",
          type: "STAFF",
          avatar: null,
        },
        {
          id: "staff_3",
          fullName: "مسؤول المكتبة",
          type: "STAFF",
          avatar: null,
        },
        {
          id: "staff_4",
          fullName: "منسق الأنشطة",
          type: "STAFF",
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

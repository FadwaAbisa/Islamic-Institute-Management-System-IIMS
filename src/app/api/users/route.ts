import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET - جلب قائمة المستخدمين المتاحين للمراسلة
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

    let availableUsers: any[] = [];

    // منطق تحديد المستخدمين المتاحين للمراسلة حسب نوع المستخدم
    // القواعد: طالب ↔ معلم، معلم ↔ موظف إداري، موظف إداري ↔ مدير النظام
    
    if (userType === "STUDENT") {
      // الطلاب يستطيعون الدردشة مع المعلمين فقط
      const teachers = await prisma.teacher.findMany({
        where: {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
          // التأكد من أن المعلم لديه بيانات كاملة
          NOT: {
            fullName: null
          }
        },
        select: {
          id: true,
          fullName: true,
        },
        take: 20,
      });

      availableUsers = teachers.map(teacher => ({
        ...teacher,
        type: "TEACHER",
        avatar: null,
      }));
    } 
    else if (userType === "TEACHER") {
      // المعلمون يستطيعون الدردشة مع الطلاب والموظفين الإداريين
      const [students, staff] = await Promise.all([
        prisma.student.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
            // فقط الطلاب النشطين
            studentStatus: {
              in: ["ACTIVE", null]
            }
          },
          select: {
            id: true,
            fullName: true,
            studentPhoto: true,
          },
          take: 10,
        }),
        prisma.staff.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            fullName: true,
          },
          take: 10,
        }),
      ]);

      availableUsers = [
        ...students.map(student => ({
          ...student,
          type: "STUDENT",
          avatar: student.studentPhoto,
        })),
        ...staff.map(staff => ({
          ...staff,
          type: "STAFF",
          avatar: null,
        })),
      ];
    } 
    else if (userType === "STAFF") {
      // الموظفون الإداريون يستطيعون الدردشة مع المعلمين ومدير النظام
      const [teachers, admins] = await Promise.all([
        prisma.teacher.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
            NOT: {
              fullName: null
            }
          },
          select: {
            id: true,
            fullName: true,
          },
          take: 15,
        }),
        prisma.admin.findMany({
          where: {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            username: true,
          },
          take: 5,
        }),
      ]);

      availableUsers = [
        ...teachers.map(teacher => ({
          ...teacher,
          type: "TEACHER",
          avatar: null,
        })),
        ...admins.map(admin => ({
          id: admin.id,
          fullName: admin.username,
          type: "ADMIN",
          avatar: null,
        })),
      ];
    } 
    else if (userType === "ADMIN") {
      // مدير النظام يستطيع الدردشة مع الموظفين الإداريين
      const staff = await prisma.staff.findMany({
        where: {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          fullName: true,
        },
        take: 20,
      });

      availableUsers = staff.map(staff => ({
        ...staff,
        type: "STAFF",
        avatar: null,
      }));
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

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
    if (userType === "STUDENT") {
      // الطلاب يمكنهم مراسلة المعلمين فقط
      const teachers = await prisma.teacher.findMany({
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

      availableUsers = teachers.map(teacher => ({
        ...teacher,
        type: "TEACHER",
        avatar: null,
      }));
    } 
    else if (userType === "TEACHER") {
      // المعلمون يمكنهم مراسلة الطلاب والموظفين الإداريين
      const [students, staff] = await Promise.all([
        prisma.student.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
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
      // الموظفون الإداريون يمكنهم مراسلة المعلمين والطلاب
      const [teachers, students] = await Promise.all([
        prisma.teacher.findMany({
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
        prisma.student.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            fullName: true,
            studentPhoto: true,
          },
          take: 10,
        }),
      ]);

      availableUsers = [
        ...teachers.map(teacher => ({
          ...teacher,
          type: "TEACHER",
          avatar: null,
        })),
        ...students.map(student => ({
          ...student,
          type: "STUDENT",
          avatar: student.studentPhoto,
        })),
      ];
    } 
    else if (userType === "ADMIN") {
      // الإدارة يمكنها مراسلة الجميع
      const [teachers, students, staff] = await Promise.all([
        prisma.teacher.findMany({
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
          take: 7,
        }),
        prisma.student.findMany({
          where: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            fullName: true,
            studentPhoto: true,
          },
          take: 7,
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
          take: 6,
        }),
      ]);

      availableUsers = [
        ...teachers.map(teacher => ({
          ...teacher,
          type: "TEACHER",
          avatar: null,
        })),
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

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error("خطأ في جلب المستخدمين:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}

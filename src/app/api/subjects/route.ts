import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

const ALLOWED_SUBJECTS = [
  "قرآن وأحكامه",
  "سيرة",
  "تفسير",
  "عقيدة",
  "فقه",
  "دراسات الأدبية",
  "دراسات اللغوية",
  "أصول الفقه",
  "منهج دعوة",
  "علوم حديث",
  "لغة إنجليزية",
  "حاسوب"
]

// جلب المواد الدراسية
export async function GET(request: NextRequest) {
  try {
    // تعليق متطلبات المصادقة مؤقتاً للاختبار
    // const { userId, sessionClaims } = auth()
    // if (!userId) {
    //   return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const academicYear = searchParams.get("academicYear")

    let whereClause: any = {}

    if (academicYear) {
      whereClause.academicYear = academicYear
    }

    const subjects = await prisma.subject.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        academicYear: true,
        TeacherSubject: {
          select: {
            Teacher: {
              select: {
                id: true,
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    // تنسيق البيانات لإزالة التداخل
    const formattedSubjects = subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      academicYear: subject.academicYear,
      teachers: subject.TeacherSubject.map(ts => ({
        id: ts.Teacher.id,
        name: ts.Teacher.fullName
      }))
    }))

    console.log("المواد المرسلة:", formattedSubjects)
    return NextResponse.json({ subjects: formattedSubjects })
  } catch (error) {
    console.error("خطأ في جلب المواد الدراسية:", error)
    return NextResponse.json(
      { error: "خطأ في جلب البيانات" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body?.name || "").trim()
    if (!name) return NextResponse.json({ error: "اسم المقرر مطلوب" }, { status: 400 })
    if (!ALLOWED_SUBJECTS.includes(name)) {
      return NextResponse.json({ error: "هذه المادة غير مسموح بها" }, { status: 400 })
    }
    const created = await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    return NextResponse.json({ subject: created }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

export async function GET() {
  try {
    // تأكيد وجود المواد المسموحة وإنشاؤها إن لزم
    await prisma.subject.createMany({
      data: ALLOWED_SUBJECTS.map((name) => ({ name })),
      skipDuplicates: true,
    })
    // إعادة فقط المواد ضمن القائمة المطلوبة
    const subjects = await prisma.subject.findMany({
      where: { name: { in: ALLOWED_SUBJECTS } },
      orderBy: { name: "asc" },
    })
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
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



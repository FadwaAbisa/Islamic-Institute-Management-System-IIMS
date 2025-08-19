import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { randomUUID } from "crypto"

function mapSex(value: string): "MALE" | "FEMALE" | null {
  if (!value) return null
  if (value === "MALE" || value === "FEMALE") return value
  if (value === "ذكر") return "MALE"
  if (value === "أنثى") return "FEMALE"
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      nationalId,
      sex,
      birthday,
      placeOfBirth,
      nationality,
      address,
      phone,
      email,
    } = body || {}

    const mappedSex = mapSex(sex)
    if (!fullName || !nationalId || !mappedSex || !birthday || !placeOfBirth || !nationality || !address) {
      return NextResponse.json({ error: "الحقول الأساسية مطلوبة" }, { status: 400 })
    }

    // تجهيز قيم متوافقة مع أعمدة سابقة محتملة
    const derivedUsername = String(nationalId)
    const first = String(fullName).trim().split(/\s+/)[0] || String(fullName).trim()
    const rest = String(fullName).trim().split(/\s+/).slice(1).join(" ") || first
    const legacyName = first
    const legacySurname = rest
    const legacyBloodType = "A+"

    // استخدام استعلام خام لضمان العمل حتى لو لم يتم تحديث عميل Prisma المحلي
    const newId = randomUUID()
    const rows = await prisma.$queryRawUnsafe<{
      id: string
      fullName: string
      nationalId: string
    }[]>(
      `INSERT INTO "Teacher" (
          "id",
          "username",
          "name",
          "surname",
          "email",
          "phone",
          "address",
          "img",
          "bloodType",
          "sex",
          "birthday",
          "fullName",
          "nationalId",
          "placeOfBirth",
          "nationality"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8, $9::"UserSex", $10::timestamp, $11, $12, $13, $14)
        RETURNING id, "fullName", "nationalId"`,
      newId,
      derivedUsername,
      legacyName,
      legacySurname,
      email || null,
      phone || null,
      address,
      legacyBloodType,
      mappedSex,
      new Date(birthday),
      fullName,
      nationalId,
      placeOfBirth,
      nationality,
    )
    const created = rows?.[0]
    return NextResponse.json({ teacher: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    const message = (error as any)?.message || "خطأ داخلي"
    if (message.includes("unique") || message.includes("duplicate key")) {
      return NextResponse.json({ error: "الرقم الوطني أو الهاتف أو البريد مستخدم مسبقاً" }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}



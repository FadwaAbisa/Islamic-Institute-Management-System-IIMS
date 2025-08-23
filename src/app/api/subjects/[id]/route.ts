import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const name = String(body?.name || "").trim()
    if (!name) return NextResponse.json({ error: "اسم المقرر مطلوب" }, { status: 400 })
    const updated = await prisma.subject.update({ where: { id: Number(params.id) }, data: { name } })
    return NextResponse.json({ subject: updated })
  } catch (error) {
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.subject.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}







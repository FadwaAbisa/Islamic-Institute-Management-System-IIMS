import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

function mapArabicPeriodToEnum(value: string): "FIRST" | "SECOND" | "THIRD" | null {
  switch (value) {
    case "الفترة الأولى":
      return "FIRST"
    case "الفترة الثانية":
      return "SECOND"
    case "الفترة الثالثة":
      return "THIRD"
    case "FIRST":
    case "SECOND":
    case "THIRD":
      return value as any
    default:
      return null
  }
}

function mapArabicStudyModeToEnum(value: string | null): "REGULAR" | "DISTANCE" | undefined {
  if (!value) return undefined
  switch (value) {
    case "نظامي":
      return "REGULAR"
    case "انتساب":
      return "DISTANCE"
    default:
      return undefined
  }
}

function mapArabicLevelToValue(value: string | null): string | undefined {
  if (!value) return undefined
  switch (value) {
    case "السنة الأولى":
      return "1"
    case "السنة الثانية":
      return "2"
    case "السنة الثالثة":
      return "3"
    case "التخرج":
      return "4"
    default:
      return undefined
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectName = searchParams.get("subject") || ""
    const academicYear = searchParams.get("academicYear") || ""
    const periodLabel = searchParams.get("period") || ""
    const educationLevel = searchParams.get("educationLevel")
    const section = searchParams.get("section")
    const studySystem = searchParams.get("studySystem")
    const searchType = searchParams.get("searchType")
    const searchValue = searchParams.get("searchValue")
    const displayFilter = searchParams.get("displayFilter")

    const periodEnum = mapArabicPeriodToEnum(periodLabel || "")
    const subject = subjectName ? await prisma.subject.findUnique({ where: { name: subjectName } }) : null

    // بناء شروط الطلاب
    const where: any = {}
    if (academicYear) where.academicYear = academicYear
    const mappedLevel = mapArabicLevelToValue(educationLevel)
    if (mappedLevel) where.studyLevel = mappedLevel
    if (section) where.specialization = section
    const mappedMode = mapArabicStudyModeToEnum(studySystem)
    if (mappedMode) where.studyMode = mappedMode as any
    if (searchValue) {
      if (searchType === "name") {
        where.fullName = { contains: searchValue, mode: "insensitive" }
      } else if (searchType === "studentId") {
        where.OR = [
          { nationalId: { contains: searchValue, mode: "insensitive" } },
          { id: { contains: searchValue, mode: "insensitive" } },
        ]
      }
    }

    // جلب الطلاب (مع خطة تراجع إذا لم توجد نتائج)
    let students = await prisma.student.findMany({
      where,
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, nationalId: true },
    })
    if (students.length === 0) {
      students = await prisma.student.findMany({
        orderBy: { fullName: "asc" },
        select: { id: true, fullName: true, nationalId: true },
      })
    }

    // جلب الدرجات (إن توفر subject & period & academicYear)
    let gradeByStudent: Record<string, any> = {}
    if (subject && periodEnum && academicYear) {
      const grades = await (prisma as any).subjectGrade.findMany({
        where: { subjectId: subject.id, academicYear, period: periodEnum as any },
        select: {
          studentId: true,
          month1: true,
          month2: true,
          month3: true,
          workTotal: true,
          finalExam: true,
          periodTotal: true,
        },
      })
      for (const g of grades) gradeByStudent[g.studentId] = g
    }

    let rows = students.map((s) => {
      const g = gradeByStudent[s.id]
      const first = g?.month1 ?? null
      const second = g?.month2 ?? null
      const third = g?.month3 ?? null
      const workTotal = g?.workTotal ?? 0
      const finalExam = g?.finalExam ?? null
      const periodTotal = g?.periodTotal ?? 0
      const isComplete =
        periodEnum === "THIRD"
          ? first !== null && second !== null && finalExam !== null
          : first !== null && second !== null && third !== null && finalExam !== null
      return {
        studentId: s.nationalId || s.id,
        studentName: s.fullName,
        firstMonthGrade: subject && periodEnum && academicYear ? first : null,
        secondMonthGrade: subject && periodEnum && academicYear ? second : null,
        thirdMonthGrade: subject && periodEnum === "THIRD" ? null : subject && periodEnum && academicYear ? third : null,
        workTotal: subject && periodEnum && academicYear ? workTotal : 0,
        finalExamGrade: subject && periodEnum && academicYear ? finalExam : null,
        periodTotal: subject && periodEnum && academicYear ? periodTotal : 0,
        status: isComplete ? "مكتمل" : "غير مكتمل",
        _dbStudentId: s.id,
      }
    })

    if (displayFilter === "complete") {
      rows = rows.filter((r) => r.status === "مكتمل")
    } else if (displayFilter === "incomplete") {
      rows = rows.filter((r) => r.status === "غير مكتمل")
    }

    return NextResponse.json({ students: rows })
  } catch (error) {
    console.error("Error fetching subject grades:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, academicYear, period, studentDbId, month1, month2, month3, finalExam } = body || {}

    if (!subject || !academicYear || !period || !studentDbId) {
      return NextResponse.json({ error: "حقول مطلوبة مفقودة" }, { status: 400 })
    }

    const periodEnum = mapArabicPeriodToEnum(period)
    if (!periodEnum) {
      return NextResponse.json({ error: "قيمة الفترة غير صحيحة" }, { status: 400 })
    }

    const subj = await prisma.subject.findUnique({ where: { name: subject } })
    if (!subj) {
      return NextResponse.json({ error: "المادة غير موجودة" }, { status: 404 })
    }

    const isThird = periodEnum === "THIRD"
    const m1 = typeof month1 === "number" ? month1 : null
    const m2 = typeof month2 === "number" ? month2 : null
    const m3 = typeof month3 === "number" ? month3 : null
    const fe = typeof finalExam === "number" ? finalExam : null

    // حساب المجاميع حسب القواعد
    let workTotal = 0
    if (isThird) {
      workTotal = (m1 || 0) + (m2 || 0)
    } else {
      const vals = [m1, m2, m3].filter((v) => v !== null) as number[]
      workTotal = vals.length ? Math.round(((vals.reduce((a, b) => a + b, 0) / vals.length) + Number.EPSILON) * 100) / 100 : 0
    }
    let periodTotal = 0
    if (fe !== null) {
      periodTotal = isThird
        ? Math.round(((workTotal + fe) + Number.EPSILON) * 100) / 100
        : Math.round(((workTotal * 0.4 + fe * 0.6) + Number.EPSILON) * 100) / 100
    }

    const upserted = await (prisma as any).subjectGrade.upsert({
      where: {
        studentId_subjectId_academicYear_period: {
          studentId: studentDbId,
          subjectId: subj.id,
          academicYear,
          period: periodEnum as any,
        },
      },
      update: {
        month1: m1,
        month2: m2,
        month3: isThird ? null : m3,
        finalExam: fe,
        workTotal,
        periodTotal,
      },
      create: {
        studentId: studentDbId,
        subjectId: subj.id,
        academicYear,
        period: periodEnum as any,
        month1: m1,
        month2: m2,
        month3: isThird ? null : m3,
        finalExam: fe,
        workTotal,
        periodTotal,
      },
      select: { month1: true, month2: true, month3: true, finalExam: true, workTotal: true, periodTotal: true },
    })

    return NextResponse.json({ grade: upserted })
  } catch (error) {
    console.error("Error updating subject grade:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}



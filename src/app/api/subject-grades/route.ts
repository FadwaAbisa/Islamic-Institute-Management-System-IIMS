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
  console.log("🔍 Mapping level:", value)

  // تحقق من القيم الفعلية في قاعدة البيانات
  switch (value) {
    case "السنة الأولى":
    case "1":
    case "FIRST":
      return "1"
    case "السنة الثانية":
    case "2":
    case "SECOND":
      return "2"
    case "السنة الثالثة":
    case "3":
    case "THIRD":
      return "3"
    case "التخرج":
    case "4":
    case "GRADUATE":
      return "4"
    default:
      console.log("🔍 Unknown level value:", value)
      return value // إرجاع القيمة كما هي للتحقق
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectName = searchParams.get("subject") || ""
    const academicYear = searchParams.get("academicYear") || ""
    const periodLabel = searchParams.get("period") || ""
    const educationLevel = searchParams.get("educationLevel")
    const studySystem = searchParams.get("studySystem")
    const searchType = searchParams.get("searchType")
    const searchValue = searchParams.get("searchValue")
    const displayFilter = searchParams.get("displayFilter")

    console.log("🔍 API Debug:", {
      subjectName,
      academicYear,
      periodLabel,
      educationLevel,
      studySystem,
      searchType,
      searchValue,
      displayFilter
    })

    const periodEnum = mapArabicPeriodToEnum(periodLabel || "")
    const subject = subjectName ? await prisma.subject.findUnique({ where: { name: subjectName } }) : null

    // بناء شروط الطلاب
    const where: any = {}

    // إضافة العام الدراسي
    if (academicYear) where.academicYear = academicYear

    // إضافة المرحلة التعليمية
    const mappedLevel = mapArabicLevelToValue(educationLevel)
    if (mappedLevel) where.studyLevel = mappedLevel

    // إضافة نظام الدراسة (نظامي/انتساب)
    const mappedMode = mapArabicStudyModeToEnum(studySystem)
    if (mappedMode) where.studyMode = mappedMode as any

    // إضافة البحث
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

    console.log("🔍 Where conditions:", where)

    // جلب الطلاب حسب المعايير المحددة فقط
    const students = await prisma.student.findMany({
      where,
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        nationalId: true,
        academicYear: true,
        studyLevel: true,
        studyMode: true,
        specialization: true,
        birthday: true,
        address: true,
        studentPhone: true,
        guardianName: true,
        guardianPhone: true,
        enrollmentStatus: true,
        studentStatus: true
      },
    })

    console.log("🔍 Found students:", students.length)

    // جلب الدرجات (إن توفر subject & period & academicYear)
    let gradeByStudent: Record<string, any> = {}
    let firstPeriodGrades: Record<string, any> = {}
    let secondPeriodGrades: Record<string, any> = {}

    if (subject && periodEnum && academicYear) {
      console.log("🔍 Fetching grades for:", { subjectId: subject.id, academicYear, period: periodEnum })

      try {
        // جلب درجات الفترة الحالية
        const grades = await prisma.subjectGrade.findMany({
          where: {
            subjectId: subject.id,
            academicYear,
            period: periodEnum
          },
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

        console.log("🔍 Found grades:", grades)
        for (const g of grades) gradeByStudent[g.studentId] = g

        // إذا كنا في الفترة الثالثة، نحتاج لجلب مجموع الفترتين السابقتين
        if (periodEnum === "THIRD") {
          console.log("🔍 Fetching first period grades for third period calculation")

          // جلب درجات الفترة الأولى
          const firstPeriodData = await prisma.subjectGrade.findMany({
            where: {
              subjectId: subject.id,
              academicYear,
              period: "FIRST"
            },
            select: {
              studentId: true,
              month1: true,
              month2: true,
              month3: true,
              workTotal: true,
            },
          })

          // جلب درجات الفترة الثانية
          const secondPeriodData = await prisma.subjectGrade.findMany({
            where: {
              subjectId: subject.id,
              academicYear,
              period: "SECOND"
            },
            select: {
              studentId: true,
              month1: true,
              month2: true,
              month3: true,
              workTotal: true,
            },
          })

          for (const g of firstPeriodData) firstPeriodGrades[g.studentId] = g
          for (const g of secondPeriodData) secondPeriodGrades[g.studentId] = g

          console.log("🔍 First period grades:", firstPeriodGrades)
          console.log("🔍 Second period grades:", secondPeriodGrades)
        }
      } catch (error) {
        console.error("❌ Error fetching grades:", error)
        gradeByStudent = {}
        firstPeriodGrades = {}
        secondPeriodGrades = {}
      }
    } else {
      console.log("⚠️ Skipping grade fetch - missing:", {
        hasSubject: !!subject,
        hasPeriod: !!periodEnum,
        hasAcademicYear: !!academicYear
      })
    }

    let rows = students.map((s) => {
      const g = gradeByStudent[s.id]
      const first = g?.month1 ?? null
      const second = g?.month2 ?? null
      const third = g?.month3 ?? null
      const workTotal = g?.workTotal ?? 0
      const finalExam = g?.finalExam ?? null
      const periodTotal = g?.periodTotal ?? 0

      let isComplete = false
      let firstPeriodTotal = 0
      let secondPeriodTotal = 0

      if (periodEnum === "THIRD") {
        // في الفترة الثالثة: نحتاج مجموع الفترتين السابقتين
        isComplete = first !== null && second !== null && finalExam !== null

        // جلب مجموع الفترة الأولى من قاعدة البيانات
        const firstPeriodData = firstPeriodGrades[s.id]
        if (firstPeriodData) {
          // حساب مجموع الفترة الأولى (متوسط الأشهر الثلاثة)
          const month1 = firstPeriodData.month1
          const month2 = firstPeriodData.month2
          const month3 = firstPeriodData.month3

          if (month1 !== null && month2 !== null && month3 !== null) {
            firstPeriodTotal = Math.round(((month1 + month2 + month3) / 3) * 100) / 100
          }
        }

        // جلب مجموع الفترة الثانية من قاعدة البيانات
        const secondPeriodData = secondPeriodGrades[s.id]
        if (secondPeriodData) {
          // حساب مجموع الفترة الثانية (متوسط الأشهر الثلاثة)
          const month1 = secondPeriodData.month1
          const month2 = secondPeriodData.month2
          const month3 = secondPeriodData.month3

          if (month1 !== null && month2 !== null && month3 !== null) {
            secondPeriodTotal = Math.round(((month1 + month2 + month3) / 3) * 100) / 100
          }
        }

        console.log("🔍 Student:", s.fullName, "First period total:", firstPeriodTotal, "Second period total:", secondPeriodTotal)
      } else {
        // في الفترات الأخرى: حساب عادي
        isComplete = first !== null && second !== null && third !== null && finalExam !== null
      }

      const row = {
        studentId: s.nationalId || s.id,
        studentName: s.fullName,
        firstMonthGrade: subject && periodEnum && academicYear ? (periodEnum === "THIRD" ? firstPeriodTotal : first) : null,
        secondMonthGrade: subject && periodEnum && academicYear ? (periodEnum === "THIRD" ? secondPeriodTotal : second) : null,
        thirdMonthGrade: periodEnum === "THIRD" ? null : (subject && periodEnum && academicYear ? third : null),
        workTotal: subject && periodEnum && academicYear ? workTotal : 0,
        finalExamGrade: subject && periodEnum && academicYear ? finalExam : null,
        periodTotal: subject && periodEnum && academicYear ? periodTotal : 0,
        status: isComplete ? "مكتمل" : "غير مكتمل",
        _dbStudentId: s.id,
        // بيانات إضافية من قاعدة البيانات
        academicYear: s.academicYear,
        studyLevel: s.studyLevel,
        studyMode: s.studyMode,
        specialization: s.specialization,
        birthday: s.birthday,
        address: s.address,
        studentPhone: s.studentPhone,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        enrollmentStatus: s.enrollmentStatus,
        studentStatus: s.studentStatus
      }

      // إضافة console.log للطالب الأول فقط لتجنب الفوضى
      if (s.id === students[0]?.id) {
        console.log("🔍 Sample student data mapping:", {
          studentId: s.id,
          studentName: s.fullName,
          gradeData: g,
          mappedData: {
            firstMonthGrade: row.firstMonthGrade,
            secondMonthGrade: row.secondMonthGrade,
            thirdMonthGrade: row.thirdMonthGrade,
            workTotal: row.workTotal,
            finalExamGrade: row.finalExamGrade,
            periodTotal: row.periodTotal
          }
        })
      }

      return row
    })

    // تطبيق فلتر العرض
    if (displayFilter === "complete") {
      rows = rows.filter((r) => r.status === "مكتمل")
    } else if (displayFilter === "incomplete") {
      rows = rows.filter((r) => r.status === "غير مكتمل")
    }

    console.log("🔍 Final rows:", rows.length)

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

    console.log("🔍 PATCH request received:", {
      subject,
      academicYear,
      period,
      studentDbId,
      month1,
      month2,
      month3,
      finalExam
    })

    if (!subject || !academicYear || !period || !studentDbId) {
      console.log("❌ Missing required fields:", { subject, academicYear, period, studentDbId })
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
    let firstPeriodTotal = 0
    let secondPeriodTotal = 0

    if (isThird) {
      // في الفترة الثالثة: month1 و month2 هما مجموع الفترتين السابقتين (غير قابل للتعديل)
      // نحن نحسب workTotal من مجموع الفترتين السابقتين + امتحان الفترة الثالثة
      // لكن month1 و month2 يجب أن يكونا مجموع الفترتين السابقتين من قاعدة البيانات

      // جلب مجموع الفترتين السابقتين من قاعدة البيانات
      const firstPeriodData = await prisma.subjectGrade.findFirst({
        where: {
          studentId: studentDbId,
          subjectId: subj.id,
          academicYear,
          period: "FIRST"
        },
        select: { month1: true, month2: true, month3: true }
      })

      const secondPeriodData = await prisma.subjectGrade.findFirst({
        where: {
          studentId: studentDbId,
          subjectId: subj.id,
          academicYear,
          period: "SECOND"
        },
        select: { month1: true, month2: true, month3: true }
      })

      // حساب مجموع الفترة الأولى
      if (firstPeriodData) {
        const { month1: m1_fp, month2: m2_fp, month3: m3_fp } = firstPeriodData
        if (m1_fp !== null && m2_fp !== null && m3_fp !== null) {
          firstPeriodTotal = Math.round(((m1_fp + m2_fp + m3_fp) / 3) * 100) / 100
        }
      }

      // حساب مجموع الفترة الثانية
      if (secondPeriodData) {
        const { month1: m1_sp, month2: m2_sp, month3: m3_sp } = secondPeriodData
        if (m1_sp !== null && m2_sp !== null && m3_sp !== null) {
          secondPeriodTotal = Math.round(((m1_sp + m2_sp + m3_sp) / 3) * 100) / 100
        }
      }

      // مجموع الفترتين السابقتين
      workTotal = firstPeriodTotal + secondPeriodTotal

      console.log("🔍 Third period calculation:", {
        firstPeriodTotal,
        secondPeriodTotal,
        workTotal,
        finalExam: fe
      })
    } else {
      // في الفترات الأخرى: نحسب متوسط الأشهر الثلاثة
      const vals = [m1, m2, m3].filter((v) => v !== null) as number[]
      workTotal = vals.length ? Math.round(((vals.reduce((a, b) => a + b, 0) / vals.length) + Number.EPSILON) * 100) / 100 : 0
    }
    let periodTotal = 0
    if (fe !== null) {
      periodTotal = isThird
        ? Math.round(((workTotal + fe) + Number.EPSILON) * 100) / 100
        : Math.round(((workTotal * 0.4 + fe * 0.6) + Number.EPSILON) * 100) / 100
    }

    console.log("🔍 Saving grades:", {
      subject,
      academicYear,
      period: periodEnum,
      studentDbId,
      month1: m1,
      month2: m2,
      month3: m3,
      finalExam: fe,
      workTotal,
      periodTotal
    })

    const upserted = await prisma.subjectGrade.upsert({
      where: {
        studentId_subjectId_academicYear_period: {
          studentId: studentDbId,
          subjectId: subj.id,
          academicYear,
          period: periodEnum,
        },
      },
      update: {
        month1: isThird ? (firstPeriodTotal || 0) : m1, // في الفترة الثالثة: مجموع الفترة الأولى
        month2: isThird ? (secondPeriodTotal || 0) : m2, // في الفترة الثالثة: مجموع الفترة الثانية
        month3: m3, // في الفترة الثالثة: null
        finalExam: fe,
        workTotal,
        periodTotal,
      },
      create: {
        studentId: studentDbId,
        subjectId: subj.id,
        academicYear,
        period: periodEnum,
        month1: isThird ? (firstPeriodTotal || 0) : m1, // في الفترة الثالثة: مجموع الفترة الأولى
        month2: isThird ? (secondPeriodTotal || 0) : m2, // في الفترة الثالثة: مجموع الفترة الثانية
        month3: m3, // في الفترة الثالثة: null
        finalExam: fe,
        workTotal,
        periodTotal,
      },
    })

    console.log("✅ Grades saved successfully:", upserted)

    return NextResponse.json({
      grade: upserted,
      message: `تم حفظ درجات مقرر ${subject} بنجاح`,
      subjectName: subject
    })
  } catch (error) {
    console.error("Error updating subject grade:", error)
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 })
  }
}



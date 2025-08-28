import { NextResponse } from "next/server";

export async function GET() {
  try {
    // قائمة السنوات الدراسية
    const studyLevels = [
      {
        id: "FIRST_YEAR",
        name: "السنة الأولى",
        description: "المرحلة الأولى من الدراسة"
      },
      {
        id: "SECOND_YEAR", 
        name: "السنة الثانية",
        description: "المرحلة الثانية من الدراسة"
      },
      {
        id: "THIRD_YEAR",
        name: "السنة الثالثة", 
        description: "المرحلة الثالثة من الدراسة"
      },
      {
        id: "GRADUATION",
        name: "سنة التخرج",
        description: "مرحلة التخرج النهائية"
      }
    ];

    return NextResponse.json(studyLevels);
  } catch (error) {
    console.error("خطأ في جلب السنوات الدراسية:", error);
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
}

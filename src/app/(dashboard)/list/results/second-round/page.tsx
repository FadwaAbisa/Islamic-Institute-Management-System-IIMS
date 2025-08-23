"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

export default function SecondRoundStudentsPage() {
  const [academicYear, setAcademicYear] = useState("")
  const [stage, setStage] = useState("")
  const [division, setDivision] = useState("")
  const [studySystem, setStudySystem] = useState("")

  const handleDisplay = () => {
    console.log("عرض تقرير طلاب الدور الثاني:", {
      academicYear,
      stage,
      division,
      studySystem,
    })
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 font-cairo flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            تقرير طلاب الدور الثاني (المستمرين فقط)
          </h1>
          <Link href="/">
            <Button
              variant="outline"
              className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white px-6 py-2 transition-colors bg-white font-tajawal"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white shadow-xl border-lamaYellowLight">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg font-tajawal bg-red-50 p-4 rounded-lg border border-red-200">
                اختر المجموعة الدراسية ثم اضغط على زر العرض للطباعة.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Academic Year */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700 font-tajawal">العام الدراسي</label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="h-14 w-full min-w-[280px] bg-gray-50 border-lamaYellowLight focus:border-lamaYellow text-base">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stage */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700 font-tajawal">المرحلة</label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger className="h-14 w-full min-w-[280px] bg-gray-50 border-lamaYellowLight focus:border-lamaYellow text-base">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-year">السنة الأولى</SelectItem>
                    <SelectItem value="second-year">السنة الثانية</SelectItem>
                    <SelectItem value="third-year">السنة الثالثة</SelectItem>
                    <SelectItem value="graduation">التخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Division */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700 font-tajawal">الشعبة</label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="h-14 w-full min-w-[280px] bg-gray-50 border-lamaYellowLight focus:border-lamaYellow text-base">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="islamic-studies">الدراسات الإسلامية</SelectItem>
                    <SelectItem value="readings">القراءات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Study System */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-gray-700 font-tajawal">نظام الدراسة</label>
                <Select value={studySystem} onValueChange={setStudySystem}>
                  <SelectTrigger className="h-14 w-full min-w-[280px] bg-gray-50 border-lamaYellowLight focus:border-lamaYellow text-base">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">نظامي</SelectItem>
                    <SelectItem value="correspondence">انتساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleDisplay}
                className="bg-lamaYellow hover:bg-lamaYellow/90 text-white px-12 py-3 text-lg font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                عرض التقرير
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

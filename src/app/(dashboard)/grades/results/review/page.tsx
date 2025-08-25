"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

interface AcademicYear {
  id: string
  name: string
}

interface StudyLevel {
  id: string
  name: string
}

interface StudyMode {
  id: string
  name: string
}

export default function ReviewPage() {
  const [academicYear, setAcademicYear] = useState("")
  const [stage, setStage] = useState("")
  const [studySystem, setStudySystem] = useState("")

  // البيانات من قاعدة البيانات
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [studyLevels, setStudyLevels] = useState<StudyLevel[]>([])
  const [studyModes, setStudyModes] = useState<StudyMode[]>([])
  const [loading, setLoading] = useState(true)

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // جلب الأعوام الدراسية
        const yearsResponse = await fetch('/api/academic-years')
        if (yearsResponse.ok) {
          const yearsData = await yearsResponse.json()
          console.log("🔍 Years API response:", yearsData)
          setAcademicYears(yearsData.academicYears || [])
        } else {
          console.error("❌ Years API failed:", yearsResponse.status)
          // Fallback data
          setAcademicYears([
            { id: "2024-2025", name: "2024-2025" },
            { id: "2025-2026", name: "2025-2026" }
          ])
        }

        // جلب المراحل الدراسية
        const levelsResponse = await fetch('/api/study-levels')
        if (levelsResponse.ok) {
          const levelsData = await levelsResponse.json()
          console.log("🔍 Levels API response:", levelsData)
          setStudyLevels(levelsData.studyLevels || [])
        } else {
          console.error("❌ Levels API failed:", levelsResponse.status)
          // Fallback data
          setStudyLevels([
            { id: "1", name: "السنة الأولى" },
            { id: "2", name: "السنة الثانية" },
            { id: "3", name: "السنة الثالثة" },
            { id: "4", name: "التخرج" }
          ])
        }

        // جلب أنظمة الدراسة
        const modesResponse = await fetch('/api/study-modes')
        if (modesResponse.ok) {
          const modesData = await modesResponse.json()
          console.log("🔍 Modes API response:", modesData)
          setStudyModes(modesData.studyModes || [])
        } else {
          console.error("❌ Modes API failed:", modesResponse.status)
          // Fallback data
          setStudyModes([
            { id: "REGULAR", name: "نظامي" },
            { id: "DISTANCE", name: "انتساب" }
          ])
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        // Fallback data in case of complete failure
        setAcademicYears([
          { id: "2024-2025", name: "2024-2025" },
          { id: "2025-2026", name: "2025-2026" }
        ])
        setStudyLevels([
          { id: "1", name: "السنة الأولى" },
          { id: "2", name: "السنة الثانية" },
          { id: "3", name: "السنة الثالثة" },
          { id: "4", name: "التخرج" }
        ])
        setStudyModes([
          { id: "REGULAR", name: "نظامي" },
          { id: "DISTANCE", name: "انتساب" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePrint = () => {
    console.log("🔍 Button clicked!")
    console.log("🔍 Current values:", { academicYear, stage, studySystem })

    if (!academicYear || !stage || !studySystem) {
      console.log("❌ Missing values - showing alert")
      alert("يرجى اختيار جميع الحقول المطلوبة")
      return
    }

    // البحث عن الأسماء العربية للقيم المختارة
    const selectedYear = academicYears.find(y => y.id === academicYear)?.name || academicYear
    const selectedStage = studyLevels.find(l => l.id === stage)?.name || stage
    const selectedSystem = studyModes.find(m => m.id === studySystem)?.name || studySystem

    // هنا يمكن إضافة منطق الطباعة
    console.log("🔍 Printing with:", { academicYear, stage, studySystem })
    console.log("🔍 Arabic names:", { selectedYear, selectedStage, selectedSystem })

    alert(`تم تحضير الطباعة للعام: ${selectedYear}، المرحلة: ${selectedStage}، النظام: ${selectedSystem}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lamaYellow mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lamaPurpleLight p-6 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 font-tajawal flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-lamaYellow" />
            طباعة كشوفات أعمال الفترة
          </h1>
          <Link href="/grades/results">
            <Button
              variant="outline"
              className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white px-6 py-2 transition-colors bg-white font-tajawal"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-lamaYellowLight shadow-lg mb-8">
          <CardContent className="p-8">
            <p className="text-gray-600 text-center mb-6 bg-lamaSkyLight p-3 rounded-lg font-tajawal">
              اختر المجموعة الدراسية المطلوبة ثم اضغط على زر التحضير للطباعة.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Academic Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">العام الدراسي</label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="- اختر -" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 text-center">({academicYears.length} خيار متاح)</p>
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">المرحلة الدراسية</label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="- اختر -" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 text-center">({studyLevels.length} خيار متاح)</p>
              </div>

              {/* Study System */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center font-tajawal">نظام الدراسة</label>
                <Select value={studySystem} onValueChange={setStudySystem}>
                  <SelectTrigger className="w-full border-lamaYellowLight focus:border-lamaYellow focus:ring-lamaYellow font-tajawal">
                    <SelectValue placeholder="- اختر -" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id}>
                        {mode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 text-center">({studyModes.length} خيار متاح)</p>
              </div>
            </div>

            {/* Debug Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">معلومات التصحيح:</h3>
              <div className="text-xs text-gray-600 text-center space-y-1">
                <p>العام الدراسي: <span className="font-mono">{academicYear ? academicYear.toString() : 'غير محدد'}</span></p>
                <p>المرحلة: <span className="font-mono">{stage ? stage.toString() : 'غير محدد'}</span></p>
                <p>نظام الدراسة: <span className="font-mono">{studySystem ? studySystem.toString() : 'غير محدد'}</span></p>
                <p>حالة الزر: <span className={`font-mono ${(!academicYear || !stage || !studySystem) ? 'text-red-500' : 'text-green-500'}`}>
                  {(!academicYear || !stage || !studySystem) ? 'معطل' : 'مفعل'}
                </span></p>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={handlePrint}
                disabled={!academicYear || !stage || !studySystem}
                className="bg-lamaYellow hover:bg-lamaYellow/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 text-lg font-medium rounded-lg transition-colors duration-200 font-tajawal"
              >
                <Search className="w-5 h-5 ml-2" />
                تحضير للطباعة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

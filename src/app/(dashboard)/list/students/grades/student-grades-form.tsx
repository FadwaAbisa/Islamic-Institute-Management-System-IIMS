"use client"

import { useStudentGrades } from "@/hooks/useStudentGrades"
import { FilterSection } from "@/components/FilterSection"
import { SearchAndControls } from "@/components/SearchAndControls"
import { GradesTable } from "@/components/GradesTable"
import { StatsSection } from "@/components/StatsSection"
import { ExportGradesButton } from "@/components/ExportGradesButton"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// تعريف توزيع الدرجات للمواد
const SUBJECTS_GRADE_DISTRIBUTION = {
  "القـرآن وأحكامه": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 },
  "السيرة": { monthly: 12, average: 12, exam: 12, twoPeriods: 24, thirdPeriod: 36 },
  "التفسير": { monthly: 12, average: 12, exam: 12, twoPeriods: 24, thirdPeriod: 36 },
  "علوم الحديث": { monthly: 4, average: 4, exam: 4, twoPeriods: 8, thirdPeriod: 12 },
  "الفقة": { monthly: 12, average: 12, exam: 12, twoPeriods: 24, thirdPeriod: 36 },
  "العقيدة": { monthly: 12, average: 12, exam: 12, twoPeriods: 24, thirdPeriod: 36 },
  "الدراسات الأدبية": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 },
  "الدراسات اللغوية": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 },
  "أصول الفقه": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 },
  "منهج الدعوة": { monthly: 4, average: 4, exam: 4, twoPeriods: 8, thirdPeriod: 12 },
  "اللغة الإنجليزية": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 },
  "الحاسوب": { monthly: 8, average: 8, exam: 8, twoPeriods: 16, thirdPeriod: 48 }
}

export default function StudentGradesForm() {
  const {
    students,
    filters,
    setFilters,
    applyFilters,
    searchOptions,
    setSearchOptions,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    stats,
    isThirdPeriod,
    savePopup,
  } = useStudentGrades()

  // إضافة تنبيه للنسخة الجديدة
  const [showNewVersionAlert, setShowNewVersionAlert] = useState(true)

  const [showGradeDistribution, setShowGradeDistribution] = useState(false)
  const [selectedSubjectGrades, setSelectedSubjectGrades] = useState<any>(null)

  // تحديث توزيع الدرجات عند اختيار المادة
  useEffect(() => {
    if (filters.subject && typeof filters.subject === 'object' && filters.subject.name) {
      const subjectName = filters.subject.name
      const grades = SUBJECTS_GRADE_DISTRIBUTION[subjectName as keyof typeof SUBJECTS_GRADE_DISTRIBUTION]
      if (grades) {
        setSelectedSubjectGrades(grades)
        setShowGradeDistribution(true)
      }
    } else if (filters.subject && typeof filters.subject === 'string') {
      const grades = SUBJECTS_GRADE_DISTRIBUTION[filters.subject as keyof typeof SUBJECTS_GRADE_DISTRIBUTION]
      if (grades) {
        setSelectedSubjectGrades(grades)
        setShowGradeDistribution(true)
      }
    } else {
      setShowGradeDistribution(false)
      setSelectedSubjectGrades(null)
    }
  }, [filters.subject])

  // الحصول على توزيع الدرجات المناسب حسب المرحلة
  const getAdjustedGrades = () => {
    if (!selectedSubjectGrades) return null

    const baseGrades = selectedSubjectGrades

    // السنة الثالثة لها توزيع مختلف
    if (filters.educationLevel === "السنة الثالثة") {
      return {
        monthly: Math.round(baseGrades.monthly * 0.75),
        average: Math.round(baseGrades.average * 0.75),
        exam: Math.round(baseGrades.exam * 0.75),
        twoPeriods: Math.round(baseGrades.twoPeriods * 0.75),
        thirdPeriod: baseGrades.thirdPeriod
      }
    }

    return baseGrades
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* تنبيه النسخة الجديدة */}
        {showNewVersionAlert && (
          <Alert className="border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-2">🎉 النسخة الجديدة متاحة الآن!</h4>
                  <p className="mb-3">
                    نظام إدارة الدرجات المتطور 2.0 بمميزات محسنة وتصميم جديد بألوان Lama
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>✨ تصميم محسن بألوان Lama الجديدة</li>
                    <li>📊 توزيعات درجات مختلفة للمراحل التعليمية</li>
                    <li>🎯 دعم كامل لجميع أنظمة الدراسة والقيود</li>
                    <li>📈 حساب النتائج النهائية تلقائياً</li>
                    <li>📋 استيراد Excel محسن مع التحقق الكامل</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href="/list/students/grades/enhanced">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        جرب النسخة الجديدة
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewVersionAlert(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    إخفاء التنبيه
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* العنوان الرئيسي */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            نظام إدخال الدرجات
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          نظام شامل لإدارة وإدخال درجات الطلاب في الفترات التقييمية المختلفة
        </p>
      </div>

      {/* قسم المرشحات */}
      <FilterSection filters={filters} setFilters={setFilters} onApply={applyFilters} />

      {/* عرض توزيع الدرجات */}
      {showGradeDistribution && selectedSubjectGrades && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              توزيع الدرجات - {typeof filters.subject === 'object' ? filters.subject.name : filters.subject}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(() => {
                const adjustedGrades = getAdjustedGrades()
                if (!adjustedGrades) return null

                return (
                  <>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{adjustedGrades.monthly}</div>
                      <div className="text-sm text-gray-600">درجة الشهر</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{adjustedGrades.average}</div>
                      <div className="text-sm text-gray-600">متوسط الأشهر</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">{adjustedGrades.exam}</div>
                      <div className="text-sm text-gray-600">درجة الامتحان</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">{adjustedGrades.twoPeriods}</div>
                      <div className="text-sm text-gray-600">الفترتين</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{adjustedGrades.thirdPeriod}</div>
                      <div className="text-sm text-gray-600">الفترة الثالثة</div>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* ملاحظات خاصة بالمرحلة */}
            {filters.educationLevel === "السنة الثالثة" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>ملاحظة:</strong> السنة الثالثة لها توزيع درجات مختلف (75% من القيم الأصلية)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* اسم المقرر المختار وأدوات التحكم */}
      {filters.subject && (
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-lamaSky text-lamaBlack shadow-sm">
            <span className="text-sm text-lamaBlackLight">المقرر المختار:</span>
            <span className="font-semibold">
              {typeof filters.subject === 'object' ? filters.subject.name : filters.subject}
            </span>
          </div>

          {/* زر التصدير */}
          <ExportGradesButton filters={filters} />
        </div>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg">
          <TabsTrigger value="grades" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            إدخال الدرجات
          </TabsTrigger>
          <TabsTrigger value="import" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            استيراد Excel
          </TabsTrigger>
        </TabsList>

        {/* تبويب إدخال الدرجات */}
        <TabsContent value="grades" className="space-y-6">
          {/* قسم البحث والتحكم */}
          <SearchAndControls searchOptions={searchOptions} setSearchOptions={setSearchOptions} />

          {/* الجدول الرئيسي */}
          <GradesTable
            students={students}
            updateStudentGrade={updateStudentGrade}
            getGradeColor={getGradeColor}
            getGradeBgColor={getGradeBgColor}
            isThirdPeriod={isThirdPeriod}
            subjectName={typeof filters.subject === 'object' ? filters.subject.name : (filters.subject || "")}
          />

          {/* قسم الإحصائيات */}
          <StatsSection stats={stats} />
        </TabsContent>

        {/* تبويب استيراد Excel */}
        <TabsContent value="import" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                استيراد درجات من ملف Excel
              </CardTitle>
              <CardDescription className="text-green-100">
                قم برفع ملف Excel يحتوي على درجات الطلاب
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">

                {/* معلومات الملف المطلوب */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    تنسيق الملف المطلوب
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• يجب أن يحتوي الملف على أعمدة: رقم الطالب، اسم الطالب، الشهر الأول، الشهر الثاني، الشهر الثالث، الامتحان</li>
                    <li>• يجب أن تكون جميع الدرجات أرقام صحيحة</li>
                    <li>• يجب أن لا تتجاوز الدرجات الحد الأقصى المسموح به</li>
                    <li>• يجب أن يكون تنسيق الملف .xlsx</li>
                  </ul>
                </div>

                {/* رفع الملف */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">اضغط لاختيار ملف Excel</h3>
                  <p className="text-gray-500">أو اسحب الملف هنا</p>
                  <Button className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                    اختيار ملف
                  </Button>
                </div>

                {/* زر الاستيراد */}
                <div className="flex justify-center">
                  <Button
                    disabled={!filters.subject}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    استيراد البيانات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* تحذيرات وملاحظات */}
      <div className="bg-lamaSkyLight border border-lamaSky rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-lamaBlack mb-2">ملاحظات مهمة:</h4>
        <ul className="text-sm text-lamaBlackLight space-y-1">
          <li>• جميع الدرجات يجب أن تكون بين 0-100</li>
          <li>• الدرجات أقل من 50 تظهر باللون الأحمر</li>
          <li>• يتم حساب المجاميع تلقائياً عند إدخال الدرجات</li>
          <li>• يتم الحفظ التلقائي عند إدخال أي درجة</li>
          <li>• طالبات الدبلوم المنتسبات لا يمكن إدخال درجات لهن</li>
          <li>• يجب تحديد جميع الفلاتر قبل إدخال الدرجات</li>
        </ul>
      </div>

      {/* Popup الحفظ */}
      {savePopup.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">{savePopup.message}</p>
              <p className="text-sm opacity-90">المقرر: {savePopup.subjectName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

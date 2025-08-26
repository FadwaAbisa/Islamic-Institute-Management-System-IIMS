"use client"

import { useStudentGrades } from "@/hooks/useStudentGrades"
import { FilterSection } from "@/components/FilterSection"
import { SearchAndControls } from "@/components/SearchAndControls"
import { GradesTable } from "@/components/GradesTable"
import { StatsSection } from "@/components/StatsSection"
import { ExportGradesButton } from "@/components/ExportGradesButton"

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

  return (
    <div className="min-h-screen bg-lamaPurple p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lamaBlack mb-2">نموذج إدخال درجات الطلاب</h1>
          <p className="text-lamaBlackLight">نظام شامل لإدارة وإدخال درجات الطلاب في الفترات التقييمية المختلفة</p>
        </div>

        {/* قسم المرشحات */}
        <FilterSection filters={filters} setFilters={setFilters} onApply={applyFilters} />

        {/* قسم البحث والتحكم */}
        <SearchAndControls searchOptions={searchOptions} setSearchOptions={setSearchOptions} />

        {/* اسم المقرر المختار وأدوات التحكم */}
        {filters.subject && (
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-lamaSky text-lamaBlack">
              <span className="text-sm text-lamaBlackLight">المقرر المختار:</span>
              <span className="font-semibold">
                {typeof filters.subject === 'object' ? filters.subject.name : filters.subject}
              </span>
            </div>

            {/* زر التصدير */}
            <ExportGradesButton filters={filters} />
          </div>
        )}

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

        {/* تحذيرات وملاحظات */}
        <div className="bg-lamaSkyLight border border-lamaSky rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-lamaBlack mb-2">ملاحظات مهمة:</h4>
          <ul className="text-sm text-lamaBlackLight space-y-1">
            <li>• جميع الدرجات يجب أن تكون بين 0-100</li>
            <li>• الدرجات أقل من 50 تظهر باللون الأحمر</li>
            <li>• يتم حساب المجاميع تلقائياً عند إدخال الدرجات</li>
            <li>• يتم الحفظ التلقائي عند إدخال أي درجة</li>
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
    </div>
  )
}

"use client"

import { useStudentGrades } from "./hooks/useStudentGrades"
import { FilterSection } from "./components/FilterSection"
import { SearchAndControls } from "./components/SearchAndControls"
import { GradesTable } from "./components/GradesTable"
import { StatsSection } from "./c"

export default function StudentGradesForm() {
  const {
    students,
    filters,
    setFilters,
    searchOptions,
    setSearchOptions,
    updateStudentGrade,
    getGradeColor,
    getGradeBgColor,
    stats,
    isThirdPeriod,
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
        <FilterSection filters={filters} setFilters={setFilters} />

        {/* قسم البحث والتحكم */}
        <SearchAndControls searchOptions={searchOptions} setSearchOptions={setSearchOptions} />

        {/* الجدول الرئيسي */}
        <GradesTable
          students={students}
          updateStudentGrade={updateStudentGrade}
          getGradeColor={getGradeColor}
          getGradeBgColor={getGradeBgColor}
          isThirdPeriod={isThirdPeriod}
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
            <li>• يتم الحفظ التلقائي كل 30 ثانية</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

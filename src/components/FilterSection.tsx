"use client"

import type { FilterOptions } from "../types/student"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"

interface FilterSectionProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  onApply?: () => void
}

export function FilterSection({ filters, setFilters, onApply }: FilterSectionProps) {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    console.log("🔍 Updating filter:", key, "to value:", value)
    const newFilters = { ...filters, [key]: value }
    console.log("🔍 New filters state:", newFilters)
    setFilters(newFilters)
  }

  // جلب المواد ديناميكياً
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([])
  // جلب الأعوام الدراسية ديناميكياً
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetch("/api/subjects")
        if (!res.ok) return
        const data = await res.json()
        setSubjects(data.subjects || [])
      } catch { }
    }

    const loadAcademicYears = async () => {
      try {
        const res = await fetch("/api/academic-years")
        if (!res.ok) return
        const data = await res.json()
        console.log("🔍 Loaded academic years:", data.academicYears)
        setAcademicYears(data.academicYears || [])
      } catch { }
    }

    loadSubjects()
    loadAcademicYears()
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg border-0 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        إعدادات الفلاتر
      </h2>

      {/* الصف الأول */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="academicYear" className="text-gray-700 font-semibold text-sm">
            العام الدراسي
          </Label>
          <Select value={filters.academicYear} onValueChange={(value: string) => updateFilter("academicYear", value)}>
            <SelectTrigger className="bg-white text-gray-800 border-gray-200 hover:border-blue-300 transition-colors shadow-sm" dir="rtl">
              <SelectValue placeholder="اختر العام الدراسي" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.name} className="text-gray-800 hover:bg-blue-50 text-right">
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="educationLevel" className="text-gray-700 font-semibold text-sm">
            المرحلة التعليمية
          </Label>
          <Select value={filters.educationLevel} onValueChange={(value: string) => updateFilter("educationLevel", value)}>
            <SelectTrigger className="bg-white text-gray-800 border-gray-200 hover:border-blue-300 transition-colors shadow-sm" dir="rtl">
              <SelectValue placeholder="اختر المرحلة التعليمية" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="السنة الأولى" className="text-gray-800 hover:bg-blue-50 text-right">السنة الأولى</SelectItem>
              <SelectItem value="السنة الثانية" className="text-gray-800 hover:bg-blue-50 text-right">السنة الثانية</SelectItem>
              <SelectItem value="السنة الثالثة" className="text-gray-800 hover:bg-blue-50 text-right">السنة الثالثة</SelectItem>
              <SelectItem value="التخرج" className="text-gray-800 hover:bg-blue-50 text-right">التخرج</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="studySystem" className="text-gray-700 font-semibold text-sm">
            نظام الدراسة
          </Label>
          <Select value={filters.studySystem} onValueChange={(value: string) => updateFilter("studySystem", value)}>
            <SelectTrigger className="bg-white text-gray-800 border-gray-200 hover:border-blue-300 transition-colors shadow-sm" dir="rtl">
              <SelectValue placeholder="اختر نظام الدراسة" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="نظامي" className="text-gray-800 hover:bg-blue-50 text-right">نظامي</SelectItem>
              <SelectItem value="انتساب" className="text-gray-800 hover:bg-blue-50 text-right">انتساب</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="subject" className="text-gray-700 font-semibold text-sm">
            المادة
          </Label>
          <Select value={typeof filters.subject === "string" ? filters.subject : (filters.subject?.name || "")} onValueChange={(value: string) => updateFilter("subject", value)}>
            <SelectTrigger className="bg-white text-gray-800 border-gray-200 hover:border-blue-300 transition-colors shadow-sm" dir="rtl">
              <SelectValue placeholder="اختر المادة" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.name} className="text-gray-800 hover:bg-blue-50 text-right">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="evaluationPeriod" className="text-gray-700 font-semibold text-sm">
            فترة التقييم
          </Label>
          <Select
            value={filters.evaluationPeriod}
            onValueChange={(value: string) => updateFilter("evaluationPeriod", value)}
            disabled={filters.studySystem === "انتساب" && filters.educationLevel !== "السنة الثالثة"}
          >
            <SelectTrigger className="bg-white text-gray-800 border-gray-200 hover:border-blue-300 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" dir="rtl">
              <SelectValue placeholder="اختر فترة التقييم" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="الفترة الأولى" className="text-gray-800 hover:bg-blue-50 text-right">
                الفترة الأولى
              </SelectItem>
              <SelectItem value="الفترة الثانية" className="text-gray-800 hover:bg-blue-50 text-right">
                الفترة الثانية
              </SelectItem>
              <SelectItem value="الفترة الثالثة" className="text-gray-800 hover:bg-blue-50 text-right">
                الفترة الثالثة
              </SelectItem>
            </SelectContent>
          </Select>
          {filters.studySystem === "انتساب" && filters.educationLevel !== "السنة الثالثة" && (
            <p className="text-xs text-orange-600 mt-1">الانتساب لا يحتوي على فترات أولى وثانية</p>
          )}
        </div>
      </div>

      {/* زر التطبيق */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onApply}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  )
}

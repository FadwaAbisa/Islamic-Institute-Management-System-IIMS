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
  const [academicYears, setAcademicYears] = useState<string[]>([])

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
    <div className="bg-lamaPurpleLight p-6 rounded-lg shadow-sm border border-lamaSkyLight mb-6">
      <h2 className="text-lg font-semibold text-lamaBlack mb-4">المرشحات</h2>

      {/* الصف الأول */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="academicYear" className="text-lamaBlack font-medium">
            العام الدراسي
          </Label>
          <Select value={filters.academicYear} onValueChange={(value) => updateFilter("academicYear", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر العام الدراسي" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              {academicYears.map((year) => (
                <SelectItem key={year} value={year} className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="educationLevel" className="text-lamaBlack font-medium">
            المرحلة التعليمية
          </Label>
          <Select value={filters.educationLevel} onValueChange={(value) => updateFilter("educationLevel", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر المرحلة التعليمية" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="السنة الأولى" className="text-lamaBlack hover:bg-lamaSkyLight text-right">السنة الأولى</SelectItem>
              <SelectItem value="السنة الثانية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">السنة الثانية</SelectItem>
              <SelectItem value="السنة الثالثة" className="text-lamaBlack hover:bg-lamaSkyLight text-right">السنة الثالثة</SelectItem>
              <SelectItem value="التخرج" className="text-lamaBlack hover:bg-lamaSkyLight text-right">التخرج</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="studySystem" className="text-lamaBlack font-medium">
            نظام الدراسة
          </Label>
          <Select value={filters.studySystem} onValueChange={(value) => updateFilter("studySystem", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر نظام الدراسة" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="نظامي" className="text-lamaBlack hover:bg-lamaSkyLight text-right">نظامي</SelectItem>
              <SelectItem value="انتساب" className="text-lamaBlack hover:bg-lamaSkyLight text-right">انتساب</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="subject" className="text-lamaBlack font-medium">
            المادة
          </Label>
          <Select value={filters.subject} onValueChange={(value) => updateFilter("subject", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر المادة" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.name} className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="evaluationPeriod" className="text-lamaBlack font-medium">
            فترة التقييم
          </Label>
          <Select value={filters.evaluationPeriod} onValueChange={(value) => updateFilter("evaluationPeriod", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر فترة التقييم" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="الفترة الأولى" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفترة الأولى
              </SelectItem>
              <SelectItem value="الفترة الثانية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفترة الثانية
              </SelectItem>
              <SelectItem value="الفترة الثالثة" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفترة الثالثة
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* زر التطبيق */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onApply}
          className="bg-lamaSky text-white hover:bg-lamaYellow transition-colors rounded-md px-8 py-3 font-medium"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  )
}

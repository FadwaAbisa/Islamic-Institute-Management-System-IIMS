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
    setFilters({ ...filters, [key]: value })
  }

  // جلب المواد ديناميكياً
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([])
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/subjects")
        if (!res.ok) return
        const data = await res.json()
        setSubjects(data.subjects || [])
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="bg-lamaPurpleLight p-6 rounded-lg shadow-sm border border-lamaSkyLight mb-6">
      <h2 className="text-lg font-semibold text-lamaBlack mb-4">المرشحات</h2>

      {/* الصف الأول */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="academicYear" className="text-lamaBlack font-medium">
            العام الدراسي
          </Label>
          <Select value={filters.academicYear} onValueChange={(value) => updateFilter("academicYear", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر العام الدراسي" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="2024-2025" className="text-lamaBlack hover:bg-lamaSkyLight text-right">2024-2025</SelectItem>
              <SelectItem value="2025-2026" className="text-lamaBlack hover:bg-lamaSkyLight text-right">2025-2026</SelectItem>
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
          <Label htmlFor="section" className="text-lamaBlack font-medium">
            الشعبة
          </Label>
          <Select value={filters.section} onValueChange={(value) => updateFilter("section", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر الشعبة" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="الدراسات الإسلامية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">الدراسات الإسلامية</SelectItem>
              <SelectItem value="القراءات" className="text-lamaBlack hover:bg-lamaSkyLight text-right">القراءات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
      </div>

      {/* الصف الثالث */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex items-end">
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-lamaSky text-white hover:bg-lamaYellow transition-colors rounded-md h-10"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>
  )
}

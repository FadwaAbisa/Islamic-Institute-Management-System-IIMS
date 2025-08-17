"use client"

import type { FilterOptions } from "../types/student"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FilterSectionProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
}

export function FilterSection({ filters, setFilters }: FilterSectionProps) {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

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
              <SelectItem value="2024-2025" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                2024-2025
              </SelectItem>
              <SelectItem value="2023-2024" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                2023-2024
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="semester" className="text-lamaBlack font-medium">
            الفصل الدراسي
          </Label>
          <Select value={filters.semester} onValueChange={(value) => updateFilter("semester", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر الفصل الدراسي" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="الفصل الأول" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفصل الأول
              </SelectItem>
              <SelectItem value="الفصل الثاني" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفصل الثاني
              </SelectItem>
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
              <SelectItem value="المرحلة الابتدائية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                المرحلة الابتدائية
              </SelectItem>
              <SelectItem value="المرحلة المتوسطة" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                المرحلة المتوسطة
              </SelectItem>
              <SelectItem value="المرحلة الثانوية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                المرحلة الثانوية
              </SelectItem>
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
              <SelectItem value="الشعبة أ" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الشعبة أ
              </SelectItem>
              <SelectItem value="الشعبة ب" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الشعبة ب
              </SelectItem>
              <SelectItem value="الشعبة ج" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الشعبة ج
              </SelectItem>
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
              <SelectItem value="نظام المقررات" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                نظام المقررات
              </SelectItem>
              <SelectItem value="النظام الفصلي" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                النظام الفصلي
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gender" className="text-lamaBlack font-medium">
            الجنس
          </Label>
          <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر الجنس" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="مختلط" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                مختلط
              </SelectItem>
              <SelectItem value="بنين" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                بنين
              </SelectItem>
              <SelectItem value="بنات" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                بنات
              </SelectItem>
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
              <SelectItem value="الرياضيات" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الرياضيات
              </SelectItem>
              <SelectItem value="الفيزياء" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الفيزياء
              </SelectItem>
              <SelectItem value="الكيمياء" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                الكيمياء
              </SelectItem>
              <SelectItem value="اللغة العربية" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                اللغة العربية
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="teacherName" className="text-lamaBlack font-medium">
            اسم المعلم
          </Label>
          <Select value={filters.teacherName} onValueChange={(value) => updateFilter("teacherName", value)}>
            <SelectTrigger className="bg-white text-lamaBlack border-lamaSky" dir="rtl">
              <SelectValue placeholder="اختر اسم المعلم" className="text-lamaBlackLight" />
            </SelectTrigger>
            <SelectContent className="bg-white" dir="rtl">
              <SelectItem value="أ. محمد أحمد" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                أ. محمد أحمد
              </SelectItem>
              <SelectItem value="أ. فاطمة علي" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                أ. فاطمة علي
              </SelectItem>
              <SelectItem value="أ. عبدالله سالم" className="text-lamaBlack hover:bg-lamaSkyLight text-right">
                أ. عبدالله سالم
              </SelectItem>
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
      </div>
    </div>
  )
}

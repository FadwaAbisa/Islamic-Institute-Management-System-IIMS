"use client"

import type { Student } from "../types/student"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface GradesTableProps {
  students: Student[]
  updateStudentGrade: (studentId: string, field: keyof Student, value: any) => void
  getGradeColor: (grade: number | null) => string
  getGradeBgColor: (grade: number | null) => string
  isThirdPeriod: boolean
  subjectName: string // إضافة اسم المادة كمعامل
}

export function GradesTable({
  students,
  updateStudentGrade,
  getGradeColor,
  getGradeBgColor,
  isThirdPeriod,
  subjectName,
}: GradesTableProps) {
  // إضافة console log لفحص البيانات
  useEffect(() => {
    console.log("🔍 GradesTable received students:", students)
    if (students.length > 0) {
      console.log("🔍 First student data:", students[0])
      console.log("🔍 Subject name:", subjectName)
      console.log("🔍 Sample grades:", {
        firstMonth: students[0].firstMonthGrade,
        secondMonth: students[0].secondMonthGrade,
        thirdMonth: students[0].thirdMonthGrade,
        finalExam: students[0].finalExamGrade,
        workTotal: students[0].workTotal,
        periodTotal: students[0].periodTotal
      })
    }
  }, [students, subjectName])
  // حالة إظهار/إخفاء الأعمدة مع حفظ في localStorage
  const [visibleColumns, setVisibleColumns] = useState({
    studentNumber: true,      // رقم الطالب
    studentName: true,        // اسم الطالب
    academicYear: true,       // العام الدراسي
    studyLevel: true,         // المرحلة الدراسية
    studyMode: true,          // نظام الدراسة
    specialization: true,     // الشعبة
    firstMonth: true,         // الشهر الأول/الفترة الأولى
    secondMonth: true,        // الشهر الثاني/الفترة الثانية
    thirdMonth: true,         // الشهر الثالث
    workTotal: true,          // مجموع الأعمال
    finalExam: true,          // الامتحان النهائي
    periodTotal: true,        // مجموع الفترة
    status: true,             // الحالة
    actions: true,            // الإجراءات
  })

  // تحميل حالة الأعمدة من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedColumns = localStorage.getItem('gradesTableVisibleColumns_v4')
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns)
        setVisibleColumns(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error parsing saved columns:', error)
      }
    }
  }, [])

  // حفظ حالة الأعمدة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('gradesTableVisibleColumns_v4', JSON.stringify(visibleColumns))
  }, [visibleColumns])

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const handleGradeChange = (studentId: string, field: keyof Student, value: string) => {
    // إذا كانت القيمة فارغة أو "-" أو "0"، اجعلها null
    if (value === "" || value === "-" || value === "0") {
      updateStudentGrade(studentId, field, null)
    } else {
      const numValue = Number.parseFloat(value)
      // تحقق من أن القيمة صحيحة وفي النطاق المطلوب
      if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
        updateStudentGrade(studentId, field, numValue)
      } else {
        // إذا كانت القيمة غير صحيحة، اجعلها null
        updateStudentGrade(studentId, field, null)
      }
    }
  }

  const handleSaveGrades = async () => {
    try {
      console.log("💾 بدء حفظ الدرجات في قاعدة البيانات...");

      // جمع جميع الدرجات من الطلاب
      const gradesData = students.map(student => ({
        studentId: student._dbStudentId, // استخدام _dbStudentId فقط
        subjectName: subjectName, // يمكن تغييرها حسب المادة المختارة
        academicYear: student.academicYear || "2024-2025",
        period: "FIRST", // يمكن تغييرها حسب الفترة المختارة
        month1: student.firstMonthGrade || null,
        month2: student.secondMonthGrade || null,
        month3: student.thirdMonthGrade || null,
        finalExam: student.finalExamGrade || null,
        workTotal: student.workTotal || 0,
        periodTotal: student.periodTotal || 0
      })).filter(grade => grade.studentId); // التأكد من وجود studentId

      // إزالة الفلتر - نحفظ جميع الطلاب حتى لو لم تكن لديهم درجات
      console.log("🔍 جميع الطلاب:", students.length);
      console.log("🔍 بيانات الدرجات:", gradesData);
      console.log("🔍 عينة من الطلاب:", students.slice(0, 2).map(s => ({
        name: s.studentName,
        _dbStudentId: s._dbStudentId,
        studentId: s.studentId,
        firstMonthGrade: s.firstMonthGrade,
        secondMonthGrade: s.secondMonthGrade,
        thirdMonthGrade: s.thirdMonthGrade,
        finalExamGrade: s.finalExamGrade
      })));

      if (gradesData.length === 0) {
        alert("لا توجد درجات لحفظها!");
        return;
      }

      console.log("🔍 عدد الطلاب المراد حفظهم:", gradesData.length);
      console.log("🔍 عينة من البيانات المرسلة:", gradesData.slice(0, 2));

      console.log(`📊 تم العثور على ${gradesData.length} مجموعة درجات`);

      // إرسال البيانات إلى API
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grades: gradesData }),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ الدرجات');
      }

      const result = await response.json();
      alert(`✅ تم حفظ ${result.savedGrades} مجموعة درجات بنجاح!`);
      console.log("🎉 تم حفظ الدرجات:", result);

    } catch (error) {
      console.error("❌ خطأ في حفظ الدرجات:", error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      alert("❌ فشل في حفظ الدرجات: " + errorMessage);
    }
  }

  const isValidGrade = (grade: number | null): boolean => {
    return grade === null || (grade >= 0 && grade <= 100)
  }

  // دوال مساعدة لتحويل البيانات
  const mapStudyLevel = (level: string | number | null | undefined): string => {
    console.log("🔍 mapStudyLevel input:", level, typeof level)
    if (level === null || level === undefined) return '-'

    // تحويل الرقم إلى نص إذا كان رقماً
    const levelStr = String(level)
    console.log("🔍 mapStudyLevel string:", levelStr)

    switch (levelStr) {
      case "1": return "السنة الأولى"
      case "2": return "السنة الثانية"
      case "3": return "السنة الثالثة"
      case "4": return "التخرج"
      default: return levelStr
    }
  }

  const mapStudyMode = (mode: string | number | null | undefined): string => {
    console.log("🔍 mapStudyMode input:", mode, typeof mode)
    if (mode === null || mode === undefined) return '-'

    // تحويل الرقم إلى نص إذا كان رقماً
    const modeStr = String(mode)
    console.log("🔍 mapStudyMode string:", modeStr)

    switch (modeStr) {
      case "REGULAR": return "نظامي"
      case "DISTANCE": return "انتساب"
      default: return modeStr
    }
  }

  return (
    <div className="bg-lamaPurpleLight rounded-lg shadow-sm border border-lamaSkyLight overflow-hidden">
      {/* تنبيه للفترة الثالثة */}
      {isThirdPeriod && (
        <div className="bg-lamaSkyLight border-b border-lamaSky p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lamaSky rounded-full"></div>
            <p className="text-lamaBlack font-medium">
              <strong>ملاحظة:</strong> في الفترة الثالثة، يتم حساب المجموع كالتالي: مجموع الفترتين السابقتين + امتحان
              الفترة الثالثة
            </p>
          </div>
        </div>
      )}

      {/* شريط الأدوات مع زر إظهار/إخفاء الأعمدة */}
      <div className="bg-white border-b border-lamaSkyLight p-3 flex justify-between items-center">
        <div className="text-sm text-lamaBlackLight">
          إجمالي الطلاب: <span className="font-semibold text-lamaBlack">{students.length}</span>
          {!subjectName && (
            <span className="mr-4 text-amber-600 font-medium">
              ⚠️ يرجى اختيار المادة أولاً لإدخال الدرجات
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {/* زر حفظ الدرجات */}
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveGrades}
            disabled={!subjectName} // تعطيل الزر إذا لم يتم اختيار المادة
            className={`gap-2 ${subjectName ? 'bg-lamaSky text-white hover:bg-lamaSkyLight' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            💾 حفظ الدرجات
          </Button>

          {/* زر إعادة تعيين الأعمدة */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const defaultColumns = {
                studentNumber: true,
                studentName: true,
                academicYear: true,
                studyLevel: true,
                studyMode: true,
                specialization: true,
                firstMonth: true,
                secondMonth: true,
                thirdMonth: true,
                workTotal: true,
                finalExam: true,
                periodTotal: true,
                status: true,
                actions: true,
              }
              setVisibleColumns(defaultColumns)
            }}
            className="gap-2"
          >
            إعادة تعيين
          </Button>

          {/* زر إظهار/إخفاء الأعمدة */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                إظهار/إخفاء الأعمدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>إعدادات الأعمدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">الرقم التسلسلي</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.studentNumber}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studentNumber: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">اسم الطالب</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.studentName}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studentName: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">العام الدراسي</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.academicYear}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, academicYear: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">المرحلة الدراسية</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.studyLevel}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studyLevel: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">نظام الدراسة</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.studyMode}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studyMode: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">الشعبة</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.specialization}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, specialization: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isThirdPeriod ? "الفترة الأولى" : "الشهر الأول"}</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.firstMonth}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, firstMonth: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isThirdPeriod ? "الفترة الثانية" : "الشهر الثاني"}</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.secondMonth}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, secondMonth: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  {!isThirdPeriod && (
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">الشهر الثالث</label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.thirdMonth}
                        onChange={(e) => setVisibleColumns((prev) => ({ ...prev, thirdMonth: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isThirdPeriod ? "مجموع الفترتين" : "مجموع الأعمال"}</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.workTotal}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, workTotal: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isThirdPeriod ? "امتحان الفترة الثالثة" : "الامتحان النهائي"}</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.finalExam}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, finalExam: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">مجموع الفترة</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.periodTotal}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, periodTotal: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">الحالة</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.status}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, status: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">الإجراءات</label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.actions}
                      onChange={(e) => setVisibleColumns((prev) => ({ ...prev, actions: e.target.checked }))}
                      className="rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setVisibleColumns({
                        studentNumber: true,
                        studentName: true,
                        academicYear: true,
                        studyLevel: true,
                        studyMode: true,
                        specialization: true,
                        firstMonth: true,
                        secondMonth: true,
                        thirdMonth: true,
                        workTotal: true,
                        finalExam: true,
                        periodTotal: true,
                        status: true,
                        actions: true,
                      })
                    }
                  >
                    إظهار الكل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setVisibleColumns({
                        studentNumber: false,
                        studentName: false,
                        academicYear: false,
                        studyLevel: false,
                        studyMode: false,
                        specialization: false,
                        firstMonth: false,
                        secondMonth: false,
                        thirdMonth: false,
                        workTotal: false,
                        finalExam: false,
                        periodTotal: false,
                        status: false,
                        actions: false,
                      })
                    }
                  >
                    إخفاء الكل
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-lamaSkyLight sticky top-0">
            <tr>
              {/* عمود الترقيم */}
              {visibleColumns.studentNumber && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky min-w-[60px]">
                  م
                </th>
              )}

              {/* عمود اسم الطالب */}
              {visibleColumns.studentName && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-lamaBlack border-b border-lamaSky min-w-[200px]">
                  اسم الطالب
                </th>
              )}

              {/* عمود العام الدراسي */}
              {visibleColumns.academicYear && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  العام الدراسي
                </th>
              )}

              {/* عمود المرحلة الدراسية */}
              {visibleColumns.studyLevel && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  المرحلة
                </th>
              )}

              {/* عمود نظام الدراسة */}
              {visibleColumns.studyMode && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  النظام
                </th>
              )}

              {/* عمود الشعبة */}
              {visibleColumns.specialization && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  الشعبة
                </th>
              )}

              {/* عمود الشهر الأول / الفترة الأولى */}
              {visibleColumns.firstMonth && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  {isThirdPeriod ? "مجموع الفترة الأولى" : "الشهر الأول"}
                </th>
              )}

              {/* عمود الشهر الثاني / الفترة الثانية */}
              {visibleColumns.secondMonth && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  {isThirdPeriod ? "مجموع الفترة الثانية" : "الشهر الثاني"}
                </th>
              )}

              {/* عمود الشهر الثالث */}
              {!isThirdPeriod && visibleColumns.thirdMonth && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  الشهر الثالث
                </th>
              )}

              {/* عمود مجموع الأعمال / مجموع الفترتين */}
              {visibleColumns.workTotal && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  {isThirdPeriod ? "مجموع الفترتين السابقتين" : "مجموع الأعمال"}
                </th>
              )}

              {/* عمود درجة الامتحان النهائي / امتحان الفترة الثالثة */}
              {visibleColumns.finalExam && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  {isThirdPeriod ? "امتحان الفترة الثالثة" : "الامتحان النهائي"}
                </th>
              )}

              {/* عمود مجموع الفترة */}
              {visibleColumns.periodTotal && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  مجموع الفترة
                </th>
              )}

              {/* عمود الحالة */}
              {visibleColumns.status && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  الحالة
                </th>
              )}

              {/* عمود الإجراءات */}
              {visibleColumns.actions && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-lamaBlack border-b border-lamaSky">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.studentId} className={index % 2 === 0 ? "bg-lamaPurpleLight" : "bg-lamaPurple"}>
                {/* عمود الترقيم */}
                {visibleColumns.studentNumber && (
                  <td className="px-4 py-3 text-center text-sm text-lamaBlack border-b border-lamaSkyLight font-bold">
                    {index + 1}
                  </td>
                )}

                {/* عمود اسم الطالب */}
                {visibleColumns.studentName && (
                  <td className="px-4 py-3 text-sm text-lamaBlack border-b border-lamaSkyLight font-medium">
                    {student.studentName}
                  </td>
                )}

                {/* عمود العام الدراسي */}
                {visibleColumns.academicYear && (
                  <td className="px-4 py-3 text-center text-sm text-lamaBlack border-b border-lamaSkyLight">
                    {(() => {
                      console.log("🔍 Rendering academicYear:", student.academicYear, "for student:", student.studentName)
                      return student.academicYear ? student.academicYear : '-'
                    })()}
                  </td>
                )}

                {/* عمود المرحلة الدراسية */}
                {visibleColumns.studyLevel && (
                  <td className="px-4 py-3 text-center text-sm text-lamaBlack border-b border-lamaSkyLight">
                    {(() => {
                      console.log("🔍 Rendering studyLevel:", student.studyLevel, "for student:", student.studentName)
                      return mapStudyLevel(student.studyLevel)
                    })()}
                  </td>
                )}

                {/* عمود نظام الدراسة */}
                {visibleColumns.studyMode && (
                  <td className="px-4 py-3 text-center text-sm text-lamaBlack border-b border-lamaSkyLight">
                    {(() => {
                      console.log("🔍 Rendering studyMode:", student.studyMode, "for student:", student.studentName)
                      return mapStudyMode(student.studyMode)
                    })()}
                  </td>
                )}

                {/* عمود الشعبة */}
                {visibleColumns.specialization && (
                  <td className="px-4 py-3 text-center text-sm text-lamaBlack border-b border-lamaSkyLight">
                    {(() => {
                      console.log("🔍 Rendering specialization:", student.specialization, "for student:", student.specialization)
                      return student.specialization ? student.specialization : '-'
                    })()}
                  </td>
                )}

                {/* درجة الشهر الأول / الفترة الأولى */}
                {visibleColumns.firstMonth && (
                  <td className="px-4 py-3 border-b">
                    {isThirdPeriod ? (
                      // في الفترة الثالثة: عرض مجموع الفترة الأولى (غير قابل للتعديل)
                      <div className="text-center">
                        <span className={`font-semibold ${getGradeColor(student.workTotal)}`}>
                          {student.workTotal.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      // في الفترات الأخرى: حقل إدخال عادي
                      <div className={`rounded-md p-1 ${getGradeBgColor(student.firstMonthGrade)}`}>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.firstMonthGrade !== null ? student.firstMonthGrade : ""}
                          onChange={(e) => handleGradeChange(student.studentId, "firstMonthGrade", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveGrades();
                            }
                          }}
                          disabled={!subjectName} // تعطيل الحقل إذا لم يتم اختيار المادة
                          className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.firstMonthGrade)} ${!isValidGrade(student.firstMonthGrade) ? "ring-2 ring-red-500" : ""
                            } ${!subjectName ? "opacity-50 cursor-not-allowed" : ""}`}
                          placeholder={subjectName ? (student.firstMonthGrade === null ? "-" : "0") : "اختر المادة أولاً"}
                        />
                      </div>
                    )}
                  </td>
                )}

                {/* درجة الشهر الثاني / الفترة الثانية */}
                {visibleColumns.secondMonth && (
                  <td className="px-4 py-3 border-b">
                    {isThirdPeriod ? (
                      // في الفترة الثالثة: عرض مجموع الفترة الثانية (غير قابل للتعديل)
                      <div className="text-center">
                        <span className={`font-semibold ${getGradeColor(student.workTotal)}`}>
                          {student.workTotal.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      // في الفترات الأخرى: حقل إدخال عادي
                      <div className={`rounded-md p-1 ${getGradeBgColor(student.secondMonthGrade)}`}>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.secondMonthGrade !== null ? student.secondMonthGrade : ""}
                          onChange={(e) => handleGradeChange(student.studentId, "secondMonthGrade", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveGrades();
                            }
                          }}
                          disabled={!subjectName} // تعطيل الحقل إذا لم يتم اختيار المادة
                          className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.secondMonthGrade)} ${!isValidGrade(student.secondMonthGrade) ? "ring-2 ring-red-500" : ""
                            } ${!subjectName ? "opacity-50 cursor-not-allowed" : ""}`}
                          placeholder={subjectName ? (student.secondMonthGrade === null ? "-" : "0") : "اختر المادة أولاً"}
                        />
                      </div>
                    )}
                  </td>
                )}

                {/* درجة الشهر الثالث */}
                {!isThirdPeriod && visibleColumns.thirdMonth && (
                  <td className="px-4 py-3 border-b">
                    <div className={`rounded-md p-1 ${getGradeBgColor(student.thirdMonthGrade)}`}>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.thirdMonthGrade !== null ? student.thirdMonthGrade : ""}
                        onChange={(e) => handleGradeChange(student.studentId, "thirdMonthGrade", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveGrades();
                          }
                        }}
                        disabled={!subjectName} // تعطيل الحقل إذا لم يتم اختيار المادة
                        className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.thirdMonthGrade)} ${!isValidGrade(student.thirdMonthGrade) ? "ring-2 ring-red-500" : ""
                          } ${!subjectName ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder={subjectName ? (student.thirdMonthGrade === null ? "-" : "0") : "اختر المادة أولاً"}
                      />
                    </div>
                  </td>
                )}

                {/* مجموع الأعمال / مجموع الفترتين */}
                {visibleColumns.workTotal && (
                  <td className="px-4 py-3 text-center border-b">
                    {isThirdPeriod ? (
                      // في الفترة الثالثة: عرض مجموع الفترتين السابقتين
                      <span className={`font-semibold ${getGradeColor(student.workTotal)}`}>
                        {student.workTotal > 0 ? student.workTotal.toFixed(2) : "-"}
                      </span>
                    ) : (
                      // في الفترات الأخرى: عرض مجموع الأعمال
                      <span className={`font-semibold ${getGradeColor(student.workTotal)} ${!subjectName ? "text-gray-400" : ""}`}>
                        {subjectName ? (student.workTotal > 0 ? student.workTotal.toFixed(2) : "-") : "--"}
                      </span>
                    )}
                  </td>
                )}

                {/* درجة الامتحان النهائي / امتحان الفترة الثالثة */}
                {visibleColumns.finalExam && (
                  <td className="px-4 py-3 border-b">
                    <div className={`rounded-md p-1 ${getGradeBgColor(student.finalExamGrade)}`}>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.finalExamGrade !== null ? student.finalExamGrade : ""}
                        onChange={(e) => handleGradeChange(student.studentId, "finalExamGrade", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveGrades();
                          }
                        }}
                        disabled={!subjectName} // تعطيل الحقل إذا لم يتم اختيار المادة
                        className={`w-20 text-center border-0 bg-transparent ${getGradeColor(student.finalExamGrade)} ${!isValidGrade(student.finalExamGrade) ? "ring-2 ring-red-500" : ""
                          } ${!subjectName ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder={subjectName ? (student.finalExamGrade === null ? "-" : "0") : "اختر المادة أولاً"}
                      />
                    </div>
                  </td>
                )}

                {/* مجموع الفترة */}
                {visibleColumns.periodTotal && (
                  <td className="px-4 py-3 text-center border-b">
                    <span className={`font-bold text-lg ${getGradeColor(student.periodTotal)} ${!subjectName ? "text-gray-400" : ""}`}>
                      {subjectName ? (student.periodTotal > 0 ? student.periodTotal.toFixed(2) : "-") : "--"}
                    </span>
                  </td>
                )}

                {/* الحالة */}
                {visibleColumns.status && (
                  <td className="px-4 py-3 text-center border-b">
                    <Badge variant={student.status === "مكتمل" ? "default" : "secondary"}>{student.status}</Badge>
                  </td>
                )}

                {/* الإجراءات */}
                {visibleColumns.actions && (
                  <td className="px-4 py-3 text-center border-b">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-transparent border-lamaSky text-lamaYellow hover:bg-lamaSkyLight"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-transparent border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

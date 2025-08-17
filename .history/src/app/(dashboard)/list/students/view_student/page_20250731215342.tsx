import prisma from "@/lib/prisma"; 

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Eye,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


// تحديث ألوان الحالات لإزالة "نشط" و إضافة "مستمر"
const statusColors = {
  مستمر: "bg-green-100 text-green-800 border-green-200",
  منقول: "bg-blue-100 text-blue-800 border-blue-200",
  منسحب: "bg-yellow-100 text-yellow-800 border-yellow-200",
  مفصول: "bg-red-100 text-red-800 border-red-200",
  متخرج: "bg-gray-100 text-gray-800 border-gray-200",
  مستجد: "bg-purple-100 text-purple-800 border-purple-200",
}

// type Student = typeof studentsData[number];

export default function StudentsDataPage() {
 
  // فلترة البيانات
  const filteredStudents = useMemo(() => {
    const filtered = studentsData.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber.includes(searchTerm) ||
        student.nationalId.includes(searchTerm)

      const matchesAcademicYear = academicYearFilter === "الكل" || student.academicYear === academicYearFilter
      const matchesStage = stageFilter === "الكل" || student.stage === stageFilter
      const matchesGender = genderFilter === "الكل" || student.gender === genderFilter
      const matchesStatus = statusFilter === "الكل" || student.status === statusFilter

      return matchesSearch && matchesAcademicYear && matchesStage && matchesGender && matchesStatus
    })

if (sortColumn) {
  filtered.sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    
    // معالجة القيم null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === "asc" ? -1 : 1;
    if (bValue == null) return sortDirection === "asc" ? 1 : -1;
    
    // الآن TypeScript يعرف أن القيم ليست null
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

    return filtered
  }, [searchTerm, academicYearFilter, stageFilter, genderFilter, statusFilter, sortColumn, sortDirection])
// حساب البيانات للصفحة الحالية
const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage
const currentStudents = filteredStudents.slice(startIndex, endIndex)

// الحل الأول: تحديد نوع string
const handleSort = (column: string) => {
  if (sortColumn === column) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  } else {
    setSortColumn(column)
    setSortDirection("asc")
  }
}

  const exportToCSV = () => {
    const headers = [
      "رقم القيد",
      "الاسم الرباعي",
      "حالة الطالب",
      "العام الدراسي",
      "المرحلة الدراسية",
      "الشعبة",
      "نظام الدراسة",
      "الجنس",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          student.registrationNumber,
          student.fullName,
          student.status,
          student.academicYear,
          student.stage,
          student.section,
          student.studySystem,
          student.gender,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "بيانات_الطلاب.csv"
    link.click()
  }

  // إضافة وظيفة الطباعة
  const printStudentDetails = (student: any) => {
    const printWindow = window.open("", "_blank")
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ملف الطالب - ${student.fullName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #B8956A;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .student-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 15px;
            border: 4px solid #D2B48C;
          }
          .student-name {
            font-size: 24px;
            font-weight: bold;
            color: #B8956A;
            margin-bottom: 5px;
          }
          .student-id {
            font-size: 16px;
            color: #666;
          }
          .section {
            margin-bottom: 25px;
            border: 1px solid #E2D5C7;
            border-radius: 8px;
            overflow: hidden;
          }
          .section-header {
            background-color: #F0E6D6;
            padding: 12px 20px;
            font-weight: bold;
            color: #B8956A;
            border-bottom: 1px solid #E2D5C7;
          }
          .section-content {
            padding: 20px;
          }
          .field-row {
            display: flex;
            margin-bottom: 15px;
            align-items: center;
          }
          .field-label {
            font-weight: bold;
            color: #B8956A;
            width: 150px;
            flex-shrink: 0;
          }
          .field-value {
            flex: 1;
            padding: 8px 12px;
            background-color: #FCFAF8;
            border: 1px solid #E2D5C7;
            border-radius: 4px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-مستمر { background-color: #dcfce7; color: #166534; }
          .status-منقول { background-color: #dbeafe; color: #1e40af; }
          .status-منسحب { background-color: #fef3c7; color: #92400e; }
          .status-متخرج { background-color: #f3f4f6; color: #374151; }
          .status-مستجد { background-color: #f3e8ff; color: #7c3aed; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${
            student.photo
              ? `<img src="${student.photo}" alt="${student.fullName}" class="student-photo">`
              : `<div class="student-photo" style="background-color: #B8956A; color: white; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold;">${student.fullName.split(" ")[0][0]}</div>`
          }
          <div class="student-name">${student.fullName}</div>
          <div class="student-id">رقم القيد: ${student.registrationNumber}</div>
        </div>

        <div class="section">
          <div class="section-header">البيانات الشخصية</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">الاسم الرباعي:</div>
              <div class="field-value">${student.fullName}</div>
            </div>
            <div class="field-row">
              <div class="field-label">رقم القيد:</div>
              <div class="field-value">${student.registrationNumber}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الرقم الوطني:</div>
              <div class="field-value">${student.nationalId}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الجنس:</div>
              <div class="field-value">${student.gender}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الجنسية:</div>
              <div class="field-value">${student.nationality}</div>
            </div>
            <div class="field-row">
              <div class="field-label">تاريخ الميلاد:</div>
              <div class="field-value">${student.birthDate}</div>
            </div>
            <div class="field-row">
              <div class="field-label">مكان الميلاد:</div>
              <div class="field-value">${student.birthPlace}</div>
            </div>
            <div class="field-row">
              <div class="field-label">رقم الهاتف:</div>
              <div class="field-value">${student.phone || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">العنوان:</div>
              <div class="field-value">${student.address}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">بيانات ولي الأمر والطوارئ</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">اسم ولي الأمر:</div>
              <div class="field-value">${student.guardianName}</div>
            </div>
            <div class="field-row">
              <div class="field-label">صلة القرابة:</div>
              <div class="field-value">${student.guardianRelation}</div>
            </div>
            <div class="field-row">
              <div class="field-label">رقم هاتف ولي الأمر:</div>
              <div class="field-value">${student.guardianPhone}</div>
            </div>
            <div class="field-row">
              <div class="field-label">جهة الاتصال للطوارئ:</div>
              <div class="field-value">${student.emergencyContact || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">هاتف الطوارئ:</div>
              <div class="field-value">${student.emergencyPhone || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">عنوان الطوارئ:</div>
              <div class="field-value">${student.emergencyAddress || "غير محدد"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">البيانات الأكاديمية</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">الفرع:</div>
              <div class="field-value">${student.branch}</div>
            </div>
            <div class="field-row">
              <div class="field-label">العام الدراسي:</div>
              <div class="field-value">${student.academicYear}</div>
            </div>
            <div class="field-row">
              <div class="field-label">المرحلة الدراسية:</div>
              <div class="field-value">${student.stage}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الشعبة:</div>
              <div class="field-value">${student.section}</div>
            </div>
            <div class="field-row">
              <div class="field-label">نظام الدراسة:</div>
              <div class="field-value">${student.studySystem}</div>
            </div>
            <div class="field-row">
              <div class="field-label">صفة القيد:</div>
              <div class="field-value"><span class="status-badge status-${student.registrationStatus}">${student.registrationStatus}</span></div>
            </div>
            <div class="field-row">
              <div class="field-label">حالة الطالب:</div>
              <div class="field-value"><span class="status-badge status-${student.status}">${student.status}</span></div>
            </div>
            <div class="field-row">
              <div class="field-label">تاريخ التسجيل:</div>
              <div class="field-value">${student.registrationDate}</div>
            </div>
            <div class="field-row">
              <div class="field-label">المدرسة السابقة:</div>
              <div class="field-value">${student.previousSchool || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">المستوى الأكاديمي السابق:</div>
              <div class="field-value">${student.previousLevel || "غير محدد"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">البيانات الصحية</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">الحالة الصحية:</div>
              <div class="field-value">${student.healthStatus || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">أمراض مزمنة:</div>
              <div class="field-value">${student.chronicDiseases || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الحساسيات:</div>
              <div class="field-value">${student.allergies || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">احتياجات خاصة:</div>
              <div class="field-value">${student.specialNeeds || "غير محدد"}</div>
            </div>
          </div>
        </div>

        ${
          student.skills
            ? `
        <div class="section">
          <div class="section-header">ملاحظات (مهارات)</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-value" style="width: 100%;">${student.skills}</div>
            </div>
          </div>
        </div>
        `
            : ""
        }

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `

    // printWindow.document.write(printContent)
    // printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lamaYellow to-lamaSky bg-clip-text text-transparent mb-3">
              إدارة بيانات الطلاب
            </h1>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lamaYellow to-lamaSky rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4">نظام شامل لإدارة ومتابعة بيانات الطلاب</p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>متصل</span>
            </div>
            <div className="text-sm text-gray-500">آخر تحديث: {new Date().toLocaleDateString("ar-SA")}</div>
          </div>
        </div>

        {/* قسم المرشحات */}
        <Card className="bg-lamaPurpleLight border-lamaSky/20">
          <CardHeader className="bg-gradient-to-r from-lamaSky/10 to-lamaYellow/5 border-b border-lamaSky/20">
            <CardTitle className="flex items-center gap-3 text-lamaYellow">
              <div className="p-2 bg-lamaYellow/10 rounded-lg">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-semibold">مرشحات البحث والتصفية</span>
                <p className="text-sm text-gray-600 font-normal mt-1">استخدم المرشحات للعثور على الطلاب بسهولة</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">العام الدراسي</label>
                <Select value={academicYearFilter} onValueChange={setAcademicYearFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر العام الدراسي" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="الكل">جميع الأعوام</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">المرحلة الدراسية</label>
                <Select value={stageFilter} onValueChange={setStageFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر المرحلة" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="الكل">جميع المراحل</SelectItem>
                    <SelectItem value="الأولى">المرحلة الأولى</SelectItem>
                    <SelectItem value="الثانية">المرحلة الثانية</SelectItem>
                    <SelectItem value="الثالثة">المرحلة الثالثة</SelectItem>
                    <SelectItem value="الرابعة">المرحلة الرابعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">الجنس</label>
                <Select value={genderFilter} onValueChange={setGenderFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="الكل">الجميع</SelectItem>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="أنثى">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">حالة الطالب</label>
                <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="الكل">جميع الحالات</SelectItem>
                    <SelectItem value="مستمر">مستمر</SelectItem>
                    <SelectItem value="مستجد">مستجد</SelectItem>
                    <SelectItem value="منقول">منقول</SelectItem>
                    <SelectItem value="منسحب">منسحب</SelectItem>
                    <SelectItem value="مفصول">مفصول</SelectItem>
                    <SelectItem value="متخرج">متخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">الإجراءات</label>
                <Button
                  onClick={() => {
                    setAcademicYearFilter("الكل")
                    setStageFilter("الكل")
                    setGenderFilter("الكل")
                    setStatusFilter("الكل")
                    setSearchTerm("")
                  }}
                  className="w-full bg-lamaYellow hover:bg-lamaYellow/90 text-white"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* شريط الأدوات */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 ml-2" />
                  إظهار/إخفاء الأعمدة
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في جميع الحقول..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 focus:ring-2 focus:ring-lamaYellow/20 focus:border-lamaYellow transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText("تم نسخ البيانات")}>
                  <Copy className="h-4 w-4 ml-2" />
                  نسخ
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <FileSpreadsheet className="h-4 w-4 ml-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  Excel
                </Button>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الجدول الرئيسي */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="relative">
                <TableHeader className="bg-gradient-to-r from-lamaSky/5 to-lamaYellow/5 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-center">#</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("registrationNumber")}
                    >
                      رقم القيد
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("fullName")}>
                      الاسم الرباعي
                    </TableHead>
                    <TableHead className="text-center">حالة الطالب</TableHead>
                    <TableHead>العام الدراسي</TableHead>
                    <TableHead>المرحلة الدراسية</TableHead>
                    <TableHead className="text-center">الشعبة</TableHead>
                    <TableHead>نظام الدراسة</TableHead>
                    <TableHead className="text-center">الجنس</TableHead>
                    <TableHead className="text-center">الصورة</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-gradient-to-r hover:from-lamaSky/5 hover:to-lamaYellow/5 transition-all duration-200 border-b border-gray-100"
                    >
                      <TableCell className="text-center font-medium">{startIndex + index + 1}</TableCell>
                      <TableCell className="font-medium">{student.registrationNumber}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusColors[student.status as keyof typeof statusColors]}>{student.status}</Badge>
                      </TableCell>
                      <TableCell>{student.academicYear}</TableCell>
                      <TableCell>{student.stage}</TableCell>
                      <TableCell className="text-center">{student.section}</TableCell>
                      <TableCell>{student.studySystem}</TableCell>
                      <TableCell className="text-center">{student.gender}</TableCell>
                      <TableCell className="text-center">
                        <Avatar className="h-10 w-10 mx-auto">
                          {student.photo ? (
                            <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.fullName} />
                          ) : (
                            <AvatarFallback className="bg-lamaYellow text-white font-bold">
                              {student.fullName.split(" ")[0][0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className="max-w-6xl max-h-[95vh] overflow-y-auto bg-lamaPurpleLight"
                            dir="rtl"
                          >
                            <DialogHeader className="border-b border-lamaSky/20 pb-6">
                              <DialogTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-6 text-right">
                                  <div className="relative">
                                    <Avatar className="h-20 w-20 border-4 border-lamaSky shadow-lg">
                                      {student.photo ? (
                                        <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.fullName} />
                                      ) : (
                                        <AvatarFallback className="bg-lamaYellow text-white text-xl font-bold">
                                          {student.fullName.split(" ")[0][0]}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                  </div>
                                  <div className="flex-1 text-right">
                                    <h3 className="text-2xl font-bold text-lamaYellow mb-1">{student.fullName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="bg-lamaSkyLight px-3 py-1 rounded-full">
                                        رقم القيد: {student.registrationNumber}
                                      </span>
                                      <Badge className={statusColors[student.status as keyof typeof statusColors]}>{student.status}</Badge>
                                      <span className="bg-lamaYellowLight px-3 py-1 rounded-full">
                                        {student.academicYear}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => printStudentDetails(student)}
                                  className="bg-lamaYellow hover:bg-lamaYellow/90 text-white no-print"
                                  size="sm"
                                >
                                  <Printer className="h-4 w-4 ml-2" />
                                  طباعة
                                </Button>
                              </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="personal" className="w-full mt-6" dir="rtl">
                              <TabsList className="grid w-full grid-cols-4 bg-lamaSkyLight" dir="rtl">
                                <TabsTrigger
                                  value="personal"
                                  className="data-[state=active]:bg-lamaYellow data-[state=active]:text-white"
                                >
                                  البيانات الشخصية
                                </TabsTrigger>
                                <TabsTrigger
                                  value="academic"
                                  className="data-[state=active]:bg-lamaYellow data-[state=active]:text-white"
                                >
                                  البيانات الأكاديمية
                                </TabsTrigger>
                                <TabsTrigger
                                  value="health"
                                  className="data-[state=active]:bg-lamaYellow data-[state=active]:text-white"
                                >
                                  البيانات الصحية
                                </TabsTrigger>
                                <TabsTrigger
                                  value="documents"
                                  className="data-[state=active]:bg-lamaYellow data-[state=active]:text-white"
                                >
                                  المستندات والملفات
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="personal" className="space-y-8 mt-6">
                                {/* المعلومات الأساسية */}
                                <Card className="bg-white border-lamaSky/20">
                                  <CardHeader className="bg-lamaSky/5">
                                    <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                      <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                      المعلومات الأساسية
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6" dir="rtl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الاسم الرباعي
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.fullName}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          رقم القيد
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium font-mono text-right">
                                            {student.registrationNumber}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الرقم الوطني
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium font-mono text-right">{student.nationalId}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          تاريخ الميلاد
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.birthDate}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الجنسية
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.nationality}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الجنس
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.gender}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          مكان الميلاد
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.birthPlace}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          رقم الهاتف
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium font-mono text-right">
                                            {student.phone || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          العنوان الكامل
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.address}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* بيانات ولي الأمر */}
                                <Card className="bg-white border-lamaSky/20">
                                  <CardHeader className="bg-lamaSky/5">
                                    <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                      <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                      بيانات ولي الأمر والطوارئ
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6" dir="rtl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          اسم ولي الأمر
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.guardianName}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          صلة القرابة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.guardianRelation}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          رقم هاتف ولي الأمر
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium font-mono text-right">{student.guardianPhone}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          جهة الاتصال للطوارئ
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">
                                            {student.emergencyContact || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          هاتف الطوارئ
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium font-mono text-right">
                                            {student.emergencyPhone || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          عنوان الطوارئ
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">
                                            {student.emergencyAddress || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="academic" className="space-y-8 mt-6" dir="rtl">
                                <Card className="bg-white border-lamaSky/20">
                                  <CardHeader className="bg-lamaSky/5">
                                    <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                      <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                      المعلومات الأكاديمية
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6" dir="rtl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الفرع الأكاديمي
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.branch}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          العام الدراسي
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.academicYear}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          المرحلة الدراسية
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.stage}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الشعبة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-center">
                                          <p className="font-medium text-xl">{student.section}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          صفة القيد
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <Badge
                                            className={
                                              statusColors[student.registrationStatus as keyof typeof statusColors] ||
                                              "bg-gray-100 text-gray-800 border-gray-200"
                                            }
                                          >
                                            {student.registrationStatus}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          نظام الدراسة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.studySystem}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          تاريخ التسجيل
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.registrationDate}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          المستوى الأكاديمي السابق
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">
                                            {student.previousLevel || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          المدرسة السابقة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">
                                            {student.previousSchool || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="health" className="space-y-8 mt-6" dir="rtl">
                                <Card className="bg-white border-lamaSky/20">
                                  <CardHeader className="bg-lamaSky/5">
                                    <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                      <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                      المعلومات الصحية
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6" dir="rtl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الحالة الصحية العامة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <div className="flex items-center gap-2 justify-end">
                                            <p className="font-medium text-right">
                                              {student.healthStatus || "غير محدد"}
                                            </p>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الأمراض المزمنة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">
                                            {student.chronicDiseases || "غير محدد"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          الحساسيات
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.allergies || "غير محدد"}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-right">
                                        <label className="text-sm font-semibold text-lamaYellow block text-right">
                                          احتياجات خاصة
                                        </label>
                                        <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                          <p className="font-medium text-right">{student.specialNeeds || "غير محدد"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="documents" className="space-y-8 mt-6" dir="rtl">
                                <Card className="bg-white border-lamaSky/20">
                                  <CardHeader className="bg-lamaSky/5">
                                    <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                      <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                      المستندات والملفات المرفقة
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-6" dir="rtl">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                      <div className="bg-lamaSkyLight p-4 rounded-lg border border-lamaSky/20 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-lamaYellow/20 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-8 h-8 text-lamaYellow"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                        </div>
                                        <h4 className="font-semibold text-lamaYellow mb-2">الشهادات الأكاديمية</h4>
                                        <p className="text-sm text-gray-600 mb-3">شهادة الثانوية العامة، كشف الدرجات</p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white bg-transparent"
                                        >
                                          رفع ملف
                                        </Button>
                                      </div>

                                      <div className="bg-lamaSkyLight p-4 rounded-lg border border-lamaSky/20 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-lamaYellow/20 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-8 h-8 text-lamaYellow"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                          </svg>
                                        </div>
                                        <h4 className="font-semibold text-lamaYellow mb-2">الوثائق الشخصية</h4>
                                        <p className="text-sm text-gray-600 mb-3">صورة البطاقة الشخصية، جواز السفر</p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white bg-transparent"
                                        >
                                          رفع ملف
                                        </Button>
                                      </div>

                                      <div className="bg-lamaSkyLight p-4 rounded-lg border border-lamaSky/20 text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-lamaYellow/20 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-8 h-8 text-lamaYellow"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                          </svg>
                                        </div>
                                        <h4 className="font-semibold text-lamaYellow mb-2">التقارير الطبية</h4>
                                        <p className="text-sm text-gray-600 mb-3">الفحص الطبي، تقارير الحساسية</p>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-lamaYellow text-lamaYellow hover:bg-lamaYellow hover:text-white bg-transparent"
                                        >
                                          رفع ملف
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="text-center py-8 border-2 border-dashed border-lamaSky/30 rounded-lg">
                                      <div className="w-24 h-24 mx-auto mb-4 bg-lamaSkyLight rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-12 h-12 text-lamaYellow"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                          />
                                        </svg>
                                      </div>
                                      <h3 className="text-lg font-semibold text-lamaYellow mb-2">
                                        اسحب الملفات هنا أو انقر للرفع
                                      </h3>
                                      <p className="text-gray-600 mb-4">
                                        يمكنك رفع ملفات PDF, DOC, DOCX, JPG, PNG (الحد الأقصى 10 ميجابايت)
                                      </p>
                                      <Button className="bg-lamaYellow hover:bg-lamaYellow/90 text-white">
                                        اختيار الملفات
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              {student.skills && (
                                <TabsContent value="skills" className="space-y-8 mt-6" dir="rtl">
                                  <Card className="bg-white border-lamaSky/20">
                                    <CardHeader className="bg-lamaSky/5">
                                      <CardTitle className="text-lamaYellow text-lg flex items-center gap-2 justify-start text-right">
                                        <div className="w-2 h-6 bg-lamaYellow rounded-full"></div>
                                        ملاحظات (مهارات)
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6" dir="rtl">
                                      <div className="p-4 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                        <p className="font-medium leading-relaxed text-right">{student.skills}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              )}
                            </Tabs>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-lamaSky/20">
                              <Button
                                variant="outline"
                                className="border-lamaSky text-lamaYellow hover:bg-lamaSkyLight bg-transparent"
                              >
                                إلغاء
                              </Button>
                              <Button className="bg-lamaYellow hover:bg-lamaYellow/90 text-white">حفظ التغييرات</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ترقيم الصفحات والإحصائيات */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                عرض {startIndex + 1} إلى {Math.min(endIndex, filteredStudents.length)} من أصل {filteredStudents.length}{" "}
                مدخل
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-lamaYellow hover:text-white transition-colors duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-lamaYellow hover:text-white transition-colors duration-200"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

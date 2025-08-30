"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
  Edit,
  Trash2,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// تعريف نوع البيانات حسب سكيما قاعدة البيانات الفعلية
interface Student {
  id: string;
  fullName: string;
  nationalId: string;
  guardianName?: string;
  studentPhone?: string;
  birthday: string;
  placeOfBirth: string;
  address: string;
  nationality: string;
  academicYear?: string;
  studyLevel?: 'FIRST_YEAR' | 'SECOND_YEAR' | 'THIRD_YEAR' | 'GRADUATION';
  specialization?: string;
  studyMode?: 'REGULAR' | 'DISTANCE';
  enrollmentStatus?: 'NEW' | 'REPEATER';
  studentStatus?: 'ACTIVE' | 'DROPPED' | 'SUSPENDED' | 'EXPELLED' | 'PAUSED' | 'GRADUATED';
  relationship?: string;
  guardianPhone?: string;
  previousSchool?: string;
  previousLevel?: string;
  healthCondition?: string;
  chronicDiseases?: string;
  allergies?: string;
  specialNeeds?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactAddress?: string;
  notes?: string;
  studentPhoto?: string;
  nationalIdCopy?: string;
  birthCertificate?: string;
  educationForm?: string;
  equivalencyDocument?: string;
  otherDocuments?: any;
  createdAt: string;
}

// تحديث ألوان الحالات حسب السكيما الجديدة
const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  graduated: "bg-blue-100 text-blue-800 border-blue-200",
  transferred: "bg-purple-100 text-purple-800 border-purple-200",
  suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
  withdrawn: "bg-red-100 text-red-800 border-red-200",
}

// ترجمة الحالات
const statusTranslations = {
  active: "نشط",
  graduated: "متخرج",
  transferred: "منقول",
  suspended: "معلق",
  withdrawn: "منسحب",
  EXPELLED: "مفصول",
  PAUSED: "متوقف مؤقتاً",
  GRADUATED: "متخرج",
}

// ترجمة المراحل الدراسية
const studyLevelTranslations = {
  FIRST_YEAR: "السنة الأولى",
  SECOND_YEAR: "السنة الثانية",
  THIRD_YEAR: "السنة الثالثة",
  GRADUATION: "سنة التخرج",
}

// ترجمة أنظمة الدراسة
const studyModeTranslations = {
  REGULAR: "نظامي",
  DISTANCE: "عن بعد",
}

// ترجمة صفة القيد
const enrollmentStatusTranslations = {
  NEW: "مستجد",
  REPEATER: "معيد",
}

export default function StudentsDataPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [academicYearFilter, setAcademicYearFilter] = useState("all")
  const [studyLevelFilter, setStudyLevelFilter] = useState("all")
  // حذف فلتر الجنس لأنه غير موجود في السكيما الجديدة
  const [statusFilter, setStatusFilter] = useState("all")
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] = useState("all")
  const [studyModeFilter, setStudyModeFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  // إضافة state جديد لإدارة الأعمدة المرئية
  const [visibleColumns, setVisibleColumns] = useState({
    index: true,
    nationalId: true,
    fullName: true,
    studentStatus: true,
    academicYear: true,
    studyLevel: true,
    specialization: true,
    studyMode: true,
    enrollmentStatus: true,
    guardianName: true,
    studentPhone: true,
    studentPhoto: true,
    actions: true,
  })

  // إضافة state جديد لإدارة نافذة التعديل
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Student>>({})

  // دالة جلب البيانات من API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      // بناء query parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      if (academicYearFilter && academicYearFilter !== "all") params.append('academicYear', academicYearFilter)
      if (studyLevelFilter && studyLevelFilter !== "all") params.append('studyLevel', studyLevelFilter)
      if (statusFilter && statusFilter !== "all") params.append('studentStatus', statusFilter)
      if (enrollmentStatusFilter && enrollmentStatusFilter !== "all") params.append('enrollmentStatus', enrollmentStatusFilter)
      if (studyModeFilter && studyModeFilter !== "all") params.append('studyMode', studyModeFilter)
      params.append('page', currentPage.toString())
      params.append('limit', itemsPerPage.toString())
      if (sortColumn) {
        params.append('sortBy', sortColumn)
        params.append('sortOrder', sortDirection)
      }

      const response = await fetch(`/api/students?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في جلب بيانات الطلاب')
      }

      const data = await response.json()

      // إذا كان API يعيد مصفوفة بسيطة
      if (Array.isArray(data)) {
        setStudents(data)
        setPagination({
          currentPage,
          totalPages: Math.ceil(data.length / itemsPerPage),
          totalItems: data.length,
          itemsPerPage
        })
      } else {
        // إذا كان API يعيد كائن مع pagination
        setStudents(data.students || data)
        setPagination({
          currentPage: data.currentPage || currentPage,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || (data.students?.length || data.length || 0),
          itemsPerPage: data.itemsPerPage || itemsPerPage
        })
      }

    } catch (err) {
      console.error('خطأ في جلب الطلاب:', err)
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, academicYearFilter, studyLevelFilter, statusFilter, enrollmentStatusFilter, studyModeFilter, currentPage, itemsPerPage, sortColumn, sortDirection])

  // جلب البيانات عند تحميل الصفحة أو تغيير الفلاتر
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // حساب البيانات للصفحة الحالية
  const currentStudents = students

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // وظيفة الحذف
  const handleDelete = async (studentId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      return
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('فشل في حذف الطالب')
      }

      // إعادة جلب البيانات
      fetchStudents()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
    }
  }

  // وظيفة التعديل
  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setEditFormData({ ...student })
  }

  // وظيفة حفظ التعديلات
  const handleSaveEdit = async () => {
    if (!editingStudent) return

    try {
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث بيانات الطالب')
      }

      // إعادة جلب البيانات
      fetchStudents()
      setEditingStudent(null)
      setEditFormData({})

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التحديث')
    }
  }

  // إضافة وظيفة تحديث البيانات
  const handleInputChange = (field: string, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const exportToCSV = () => {
    const headers = [
      "الرقم الوطني",
      "الاسم الرباعي",
      "حالة الطالب",
      "العام الدراسي",
      "المرحلة الدراسية",
      "التخصص",
      "نظام الدراسة",
    ]
    const csvContent = [
      headers.join(","),
      ...currentStudents.map((student: Student) =>
        [
          student.nationalId,
          student.fullName,
          statusTranslations[student.studentStatus as keyof typeof statusTranslations] || student.studentStatus || "غير محدد",
          student.academicYear || "غير محدد",
          studyLevelTranslations[student.studyLevel as keyof typeof studyLevelTranslations] || student.studyLevel || "غير محدد",
          student.specialization || "غير محدد",
          studyModeTranslations[student.studyMode as keyof typeof studyModeTranslations] || student.studyMode || "غير محدد",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "بيانات_الطلاب.csv"
    link.click()
  }

  // إضافة وظيفة طباعة الجدول
  const printTable = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("يرجى السماح للنوافذ المنبثقة لتتمكن من الطباعة")
      return
    }

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>قائمة الطلاب</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            margin: 20px;
            color: #333;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #B8956A;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #B8956A;
            margin-bottom: 10px;
          }
          .date {
            font-size: 14px;
            color: #666;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .table th,
          .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
            font-size: 12px;
          }
          .table th {
            background-color: #F0E6D6;
            font-weight: bold;
            color: #B8956A;
          }
          .table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
          }
          .status-مستمر { background-color: #dcfce7; color: #166534; }
          .status-منقول { background-color: #dbeafe; color: #1e40af; }
          .status-منسحب { background-color: #fef3c7; color: #92400e; }
          .status-متخرج { background-color: #f3f4f6; color: #374151; }
          .status-مستجد { background-color: #f3e8ff; color: #7c3aed; }
          @media print {
            body { 
              margin: 0; 
              font-size: 11px;
            }
            .table {
              font-size: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">قائمة الطلاب</div>
          <div class="date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")}</div>
          <div class="date">إجمالي الطلاب: ${currentStudents.length}</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              ${visibleColumns.index ? "<th>#</th>" : ""}
              ${visibleColumns.nationalId ? "<th>رقم القيد</th>" : ""}
              ${visibleColumns.fullName ? "<th>الاسم الرباعي</th>" : ""}
              ${visibleColumns.studentStatus ? "<th>حالة الطالب</th>" : ""}
              ${visibleColumns.academicYear ? "<th>العام الدراسي</th>" : ""}
              ${visibleColumns.studyLevel ? "<th>المرحلة الدراسية</th>" : ""}
              ${visibleColumns.specialization ? "<th>التخصص</th>" : ""}
              ${visibleColumns.studyMode ? "<th>نظام الدراسة</th>" : ""}
                              ${visibleColumns.studentPhoto ? "<th>صورة الطالب</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${currentStudents
        .map(
          (student: any, index: number) => `
              <tr>
                ${visibleColumns.index ? `<td>${index + 1}</td>` : ""}
                ${visibleColumns.nationalId ? `<td>${student.nationalId}</td>` : ""}
                ${visibleColumns.fullName ? `<td>${student.fullName}</td>` : ""}
                ${visibleColumns.studentStatus ? `<td><span class="status-badge status-${student.studentStatus}">${student.studentStatus}</span></td>` : ""}
                ${visibleColumns.academicYear ? `<td>${student.academicYear}</td>` : ""}
                ${visibleColumns.studyLevel ? `<td>${student.studyLevel}</td>` : ""}
                ${visibleColumns.specialization ? `<td>${student.specialization}</td>` : ""}
                ${visibleColumns.studyMode ? `<td>${student.studyMode}</td>` : ""}
                ${visibleColumns.studentPhoto ? `<td>${student.studentPhoto ? "موجود" : "غير موجود"}</td>` : ""}
              </tr>
            `,
        )
        .join("")}
          </tbody>
        </table>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
          
          window.onafterprint = function() {
            window.close();
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  // إضافة وظيفة الطباعة
  const printStudentDetails = (student: any) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("يرجى السماح للنوافذ المنبثقة لتتمكن من الطباعة")
      return
    }

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ملف الطالب - ${student.fullName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            margin: 20px;
            color: #333;
            line-height: 1.6;
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
            background-color: #B8956A;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold;
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
            page-break-inside: avoid;
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
            body { 
              margin: 0; 
              font-size: 12px;
            }
            .no-print { 
              display: none !important; 
            }
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="student-photo">
            ${student.fullName.split(" ")[0][0]}
          </div>
          <div class="student-name">${student.fullName}</div>
          <div class="student-id">رقم القيد: ${student.nationalId}</div>
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
              <div class="field-value">${student.nationalId}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الرقم الوطني:</div>
              <div class="field-value">${student.nationalId}</div>
            </div>
            <div class="field-row">
              <div class="field-label">صفة القيد:</div>
              <div class="field-value">${student.enrollmentStatus || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الجنسية:</div>
              <div class="field-value">${student.nationality}</div>
            </div>
            <div class="field-row">
              <div class="field-label">تاريخ الميلاد:</div>
              <div class="field-value">${student.birthday}</div>
            </div>
            <div class="field-row">
              <div class="field-label">مكان الميلاد:</div>
              <div class="field-value">${student.placeOfBirth}</div>
            </div>
            <div class="field-row">
              <div class="field-label">رقم الهاتف:</div>
              <div class="field-value">${student.studentPhone || "غير محدد"}</div>
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
              <div class="field-value">${student.relationship}</div>
            </div>
            <div class="field-row">
              <div class="field-label">رقم هاتف ولي الأمر:</div>
              <div class="field-value">${student.guardianPhone}</div>
            </div>
            <div class="field-row">
              <div class="field-label">جهة الاتصال للطوارئ:</div>
              <div class="field-value">${student.emergencyContactName || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">هاتف الطوارئ:</div>
              <div class="field-value">${student.emergencyContactPhone || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">عنوان الطوارئ:</div>
              <div class="field-value">${student.emergencyContactAddress || "غير محدد"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">البيانات الأكاديمية</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-label">الشعبة:</div>
              <div class="field-value">${student.specialization || "غير محدد"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">العام الدراسي:</div>
              <div class="field-value">${student.academicYear}</div>
            </div>
            <div class="field-row">
              <div class="field-label">المرحلة الدراسية:</div>
              <div class="field-value">${student.studyLevel}</div>
            </div>
            <div class="field-row">
              <div class="field-label">الشعبة:</div>
              <div class="field-value">${student.specialization}</div>
            </div>
            <div class="field-row">
              <div class="field-label">نظام الدراسة:</div>
              <div class="field-value">${student.studyMode}</div>
            </div>
            <div class="field-row">
              <div class="field-label">صفة القيد:</div>
              <div class="field-value"><span class="status-badge status-${student.enrollmentStatus}">${student.enrollmentStatus}</span></div>
            </div>
            <div class="field-row">
              <div class="field-label">حالة الطالب:</div>
              <div class="field-value"><span class="status-badge status-${student.studentStatus}">${student.studentStatus}</span></div>
            </div>
            <div class="field-row">
              <div class="field-label">تاريخ التسجيل:</div>
              <div class="field-value">${student.createdAt}</div>
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
              <div class="field-value">${student.healthCondition || "غير محدد"}</div>
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

        ${student.notes
        ? `
        <div class="section">
          <div class="section-header">ملاحظات (مهارات)</div>
          <div class="section-content">
            <div class="field-row">
              <div class="field-value" style="width: 100%;">${student.notes}</div>
            </div>
          </div>
        </div>
        `
        : ""
      }

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
          
          window.onafterprint = function() {
            window.close();
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* رسالة الخطأ */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">خطأ:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* رسالة التحميل */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
              <span>جاري تحميل البيانات...</span>
            </div>
          </div>
        )}

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
                    <SelectItem value="all">جميع الأعوام</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">المرحلة الدراسية</label>
                <Select value={studyLevelFilter} onValueChange={setStudyLevelFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر المرحلة" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="all">جميع المراحل</SelectItem>
                    <SelectItem value="السنة الأولى">السنة الأولى</SelectItem>
                    <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                    <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حذف فلتر الجنس لأنه غير موجود في السكيما الجديدة */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">حالة الطالب</label>
                <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="مستمر">مستمر</SelectItem>
                    <SelectItem value="متخرج">متخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">صفة القيد</label>
                <Select value={enrollmentStatusFilter} onValueChange={setEnrollmentStatusFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر صفة القيد" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="all">جميع الصفات</SelectItem>
                    <SelectItem value="مستجد">مستجد</SelectItem>
                    <SelectItem value="مستجدة">مستجدة</SelectItem>
                    <SelectItem value="معيدة">معيدة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">نوع الدراسة</label>
                <Select value={studyModeFilter} onValueChange={setStudyModeFilter} dir="rtl">
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaYellow">
                    <SelectValue placeholder="اختر نوع الدراسة" />
                  </SelectTrigger>
                  <SelectContent align="end" side="bottom">
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="نظامي">نظامي</SelectItem>
                    <SelectItem value="انتساب">انتساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-lamaYellow">الإجراءات</label>
                <Button
                  onClick={() => {
                    setAcademicYearFilter("all")
                    setStudyLevelFilter("all")
                    setStatusFilter("all")
                    setEnrollmentStatusFilter("all")
                    setStudyModeFilter("all")
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
                            checked={visibleColumns.index}
                            onChange={(e) => setVisibleColumns((prev) => ({ ...prev, index: e.target.checked }))}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">رقم القيد</label>
                          <input
                            type="checkbox"
                            checked={visibleColumns.nationalId}
                            onChange={(e) =>
                              setVisibleColumns((prev) => ({ ...prev, nationalId: e.target.checked }))
                            }
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">الاسم الرباعي</label>
                          <input
                            type="checkbox"
                            checked={visibleColumns.fullName}
                            onChange={(e) => setVisibleColumns((prev) => ({ ...prev, fullName: e.target.checked }))}
                            className="rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">حالة الطالب</label>
                          <input
                            type="checkbox"
                            checked={visibleColumns.studentStatus}
                            onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studentStatus: e.target.checked }))}
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
                          <label className="text-sm font-medium">التخصص</label>
                          <input
                            type="checkbox"
                            checked={visibleColumns.specialization}
                            onChange={(e) => setVisibleColumns((prev) => ({ ...prev, specialization: e.target.checked }))}
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
                          <label className="text-sm font-medium">صورة الطالب</label>
                          <input
                            type="checkbox"
                            checked={visibleColumns.studentPhoto}
                            onChange={(e) => setVisibleColumns((prev) => ({ ...prev, studentPhoto: e.target.checked }))}
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
                              index: true,
                              nationalId: true,
                              fullName: true,
                              studentStatus: true,
                              academicYear: true,
                              studyLevel: true,
                              specialization: true,
                              studyMode: true,
                              enrollmentStatus: true,
                              guardianName: true,
                              studentPhone: true,
                              studentPhoto: true,
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
                              index: false,
                              nationalId: false,
                              fullName: false,
                              studentStatus: false,
                              academicYear: false,
                              studyLevel: false,
                              specialization: false,
                              studyMode: false,
                              enrollmentStatus: false,
                              guardianName: false,
                              studentPhone: false,
                              studentPhoto: false,
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
                <Button variant="outline" size="sm" onClick={printTable}>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">عرض:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                    dir="rtl"
                  >
                    <SelectTrigger className="w-20 text-center" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" side="bottom" dir="rtl">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">عنصر</span>
                </div>
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
                    {visibleColumns.index && <TableHead className="text-right font-semibold">#</TableHead>}
                    {visibleColumns.nationalId && (
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50 text-right font-semibold"
                        onClick={() => handleSort("nationalId")}
                      >
                        رقم القيد
                      </TableHead>
                    )}
                    {visibleColumns.fullName && (
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50 text-right font-semibold"
                        onClick={() => handleSort("fullName")}
                      >
                        الاسم الرباعي
                      </TableHead>
                    )}
                    {visibleColumns.studentStatus && <TableHead className="text-right font-semibold">حالة الطالب</TableHead>}
                    {visibleColumns.academicYear && (
                      <TableHead className="text-right font-semibold">العام الدراسي</TableHead>
                    )}
                    {visibleColumns.studyLevel && (
                      <TableHead className="text-right font-semibold">المرحلة الدراسية</TableHead>
                    )}
                    {visibleColumns.specialization && <TableHead className="text-right font-semibold">التخصص</TableHead>}
                    {visibleColumns.studyMode && (
                      <TableHead className="text-right font-semibold">نظام الدراسة</TableHead>
                    )}
                    {visibleColumns.studentPhoto && <TableHead className="text-center font-semibold">صورة الطالب</TableHead>}
                    {visibleColumns.actions && <TableHead className="text-center font-semibold">الإجراءات</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-gradient-to-r hover:from-lamaSky/5 hover:to-lamaYellow/5 transition-all duration-200 border-b border-gray-100"
                    >
                      {visibleColumns.index && (
                        <TableCell className="text-right font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + index + 1}</TableCell>
                      )}
                      {visibleColumns.nationalId && (
                        <TableCell className="font-medium text-right">{student.nationalId}</TableCell>
                      )}
                      {visibleColumns.fullName && <TableCell className="text-right">{student.fullName}</TableCell>}
                      {visibleColumns.studentStatus && (
                        <TableCell className="text-right">
                          <Badge className={statusColors[student.studentStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}>{student.studentStatus}</Badge>
                        </TableCell>
                      )}
                      {visibleColumns.academicYear && (
                        <TableCell className="text-right">{student.academicYear}</TableCell>
                      )}
                      {visibleColumns.studyLevel && <TableCell className="text-right">{student.studyLevel}</TableCell>}
                      {visibleColumns.specialization && <TableCell className="text-right">{student.specialization}</TableCell>}
                      {visibleColumns.studyMode && (
                        <TableCell className="text-right">{student.studyMode}</TableCell>
                      )}
                      {visibleColumns.studentPhoto && (
                        <TableCell className="text-center">
                          <Avatar className="h-10 w-10 mx-auto">
                            {student.studentPhoto ? (
                              <AvatarImage src={student.studentPhoto || "/placeholder.svg"} alt={student.fullName} />
                            ) : (
                              <AvatarFallback className="bg-lamaYellow text-white font-bold">
                                {student.fullName.split(" ")[0][0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TableCell>
                      )}
                      {visibleColumns.actions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedStudent(student)}
                                  title="عرض التفاصيل"
                                >
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
                                          {student.studentPhoto ? (
                                            <AvatarImage
                                              src={student.studentPhoto || "/placeholder.svg"}
                                              alt={student.fullName}
                                            />
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
                                            رقم القيد: {student.nationalId}
                                          </span>
                                          <Badge className={statusColors[student.studentStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}>{student.studentStatus}</Badge>
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
                                                {student.nationalId}
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
                                              <p className="font-medium text-right">{student.birthday}</p>
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
                                              صفة القيد
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">
                                                {enrollmentStatusTranslations[student.enrollmentStatus as keyof typeof enrollmentStatusTranslations] || student.enrollmentStatus || "غير محدد"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              مكان الميلاد
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">{student.placeOfBirth}</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              رقم الهاتف
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium font-mono text-right">
                                                {student.studentPhone || "غير محدد"}
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
                                              <p className="font-medium text-right">{student.relationship}</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              رقم هاتف ولي الأمر
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium font-mono text-right">
                                                {student.guardianPhone}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              جهة الاتصال للطوارئ
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">
                                                {student.emergencyContactName || "غير محدد"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              هاتف الطوارئ
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium font-mono text-right">
                                                {student.emergencyContactPhone || "غير محدد"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              عنوان الطوارئ
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">
                                                {student.emergencyContactAddress || "غير محدد"}
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
                                              الشعبة
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">{student.specialization || "غير محدد"}</p>
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
                                              <p className="font-medium text-right">{student.studyLevel}</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الشعبة
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-center">
                                              <p className="font-medium text-xl">{student.specialization}</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              صفة القيد
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <Badge
                                                className={
                                                  statusColors[student.enrollmentStatus as keyof typeof statusColors] ||
                                                  "bg-gray-100 text-gray-800 border-gray-200"
                                                }
                                              >
                                                {student.enrollmentStatus}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              نظام الدراسة
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">{student.studyMode}</p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              تاريخ التسجيل
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">{student.createdAt}</p>
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
                                                  {student.healthCondition || "غير محدد"}
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
                                              <p className="font-medium text-right">
                                                {student.allergies || "غير محدد"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              احتياجات خاصة
                                            </label>
                                            <div className="p-3 bg-lamaPurpleLight rounded-lg border border-lamaSky/20 text-right">
                                              <p className="font-medium text-right">
                                                {student.specialNeeds || "غير محدد"}
                                              </p>
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
                                            <p className="text-sm text-gray-600 mb-3">
                                              شهادة الثانوية العامة، كشف الدرجات
                                            </p>
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
                                            <p className="text-sm text-gray-600 mb-3">
                                              صورة البطاقة الشخصية، جواز السفر
                                            </p>
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

                                  {student.notes && (
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
                                            <p className="font-medium leading-relaxed text-right">{student.notes}</p>
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
                                  <Button className="bg-lamaYellow hover:bg-lamaYellow/90 text-white">
                                    حفظ التغييرات
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* نافذة التعديل */}
                            <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
                              <DialogContent
                                className="max-w-6xl max-h-[95vh] overflow-y-auto bg-lamaPurpleLight"
                                dir="rtl"
                              >
                                <DialogHeader className="border-b border-lamaSky/20 pb-6">
                                  <DialogTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-right">
                                      <div className="relative">
                                        <Avatar className="h-20 w-20 border-4 border-lamaSky shadow-lg">
                                          {editFormData.studentPhoto ? (
                                            <AvatarImage
                                              src={editFormData.studentPhoto || "/placeholder.svg"}
                                              alt={editFormData.fullName}
                                            />
                                          ) : (
                                            <AvatarFallback className="bg-lamaYellow text-white text-xl font-bold">
                                              {editFormData.fullName?.split(" ")[0][0]}
                                            </AvatarFallback>
                                          )}
                                        </Avatar>
                                      </div>
                                      <div className="flex-1 text-right">
                                        <h3 className="text-2xl font-bold text-lamaYellow mb-1">تعديل بيانات الطالب</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                          <span className="bg-lamaSkyLight px-3 py-1 rounded-full">
                                            رقم القيد: {editFormData.nationalId}
                                          </span>
                                          <Badge className={statusColors[editFormData.studentStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}>
                                            {editFormData.studentStatus}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => setEditingStudent(null)}
                                        variant="outline"
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                        size="sm"
                                      >
                                        إلغاء
                                      </Button>
                                      <Button
                                        onClick={handleSaveEdit}
                                        className="bg-lamaYellow hover:bg-lamaYellow/90 text-white"
                                        size="sm"
                                      >
                                        حفظ التغييرات
                                      </Button>
                                    </div>
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
                                      value="guardian"
                                      className="data-[state=active]:bg-lamaYellow data-[state=active]:text-white"
                                    >
                                      بيانات ولي الأمر
                                    </TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="personal" className="space-y-8 mt-6">
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
                                              الاسم الرباعي *
                                            </label>
                                            <Input
                                              value={editFormData.fullName || ""}
                                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل الاسم الرباعي"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              رقم القيد *
                                            </label>
                                            <Input
                                              value={editFormData.nationalId || ""}
                                              onChange={(e) => handleInputChange("nationalId", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow font-mono"
                                              placeholder="أدخل رقم القيد"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الرقم الوطني *
                                            </label>
                                            <Input
                                              value={editFormData.nationalId || ""}
                                              onChange={(e) => handleInputChange("nationalId", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow font-mono"
                                              placeholder="أدخل الرقم الوطني"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              تاريخ الميلاد
                                            </label>
                                            <Input
                                              type="date"
                                              value={editFormData.birthday || ""}
                                              onChange={(e) => handleInputChange("birthday", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الجنسية
                                            </label>
                                            <Select
                                              value={editFormData.nationality || ""}
                                              onValueChange={(value) => handleInputChange("nationality", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر الجنسية" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="ليبيا">ليبيا</SelectItem>
                                                <SelectItem value="مصر">مصر</SelectItem>
                                                <SelectItem value="تونس">تونس</SelectItem>
                                                <SelectItem value="الجزائر">الجزائر</SelectItem>
                                                <SelectItem value="المغرب">المغرب</SelectItem>
                                                <SelectItem value="السودان">السودان</SelectItem>
                                                <SelectItem value="أخرى">أخرى</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* حذف حقل الجنس لأنه غير موجود في السكيما الجديدة */}

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              مكان الميلاد
                                            </label>
                                            <Input
                                              value={editFormData.placeOfBirth || ""}
                                              onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل مكان الميلاد"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              رقم الهاتف
                                            </label>
                                            <Input
                                              value={editFormData.studentPhone || ""}
                                              onChange={(e) => handleInputChange("studentPhone", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow font-mono"
                                              placeholder="أدخل رقم الهاتف"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right col-span-full">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              العنوان الكامل
                                            </label>
                                            <Input
                                              value={editFormData.address || ""}
                                              onChange={(e) => handleInputChange("address", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل العنوان الكامل"
                                            />
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
                                          {/* حذف حقل الفرع الأكاديمي لأنه غير موجود في السكيما الجديدة */}

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              العام الدراسي *
                                            </label>
                                            <Select
                                              value={editFormData.academicYear || ""}
                                              onValueChange={(value) => handleInputChange("academicYear", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر العام الدراسي" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="2024-2025">2024-2025</SelectItem>
                                                <SelectItem value="2023-2024">2023-2024</SelectItem>
                                                <SelectItem value="2022-2023">2022-2023</SelectItem>
                                                <SelectItem value="2021-2022">2021-2022</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              المرحلة الدراسية *
                                            </label>
                                            <Select
                                              value={editFormData.studyLevel || ""}
                                              onValueChange={(value) => handleInputChange("studyLevel", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر المرحلة" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="FIRST_YEAR">السنة الأولى</SelectItem>
                                                <SelectItem value="SECOND_YEAR">السنة الثانية</SelectItem>
                                                <SelectItem value="THIRD_YEAR">السنة الثالثة</SelectItem>
                                                <SelectItem value="GRADUATION">سنة التخرج</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الشعبة
                                            </label>
                                            <Input
                                              value={editFormData.specialization || ""}
                                              onChange={(e) => handleInputChange("specialization", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow text-center"
                                              placeholder="أدخل الشعبة"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              حالة الطالب *
                                            </label>
                                            <Select
                                              value={editFormData.studentStatus || ""}
                                              onValueChange={(value) => handleInputChange("studentStatus", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر الحالة" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="ACTIVE">نشط</SelectItem>
                                                <SelectItem value="SUSPENDED">معلق</SelectItem>
                                                <SelectItem value="DROPPED">منسحب</SelectItem>
                                                <SelectItem value="EXPELLED">مطرود</SelectItem>
                                                <SelectItem value="PAUSED">متوقف مؤقتاً</SelectItem>
                                                <SelectItem value="GRADUATED">متخرج</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              نظام الدراسة *
                                            </label>
                                            <Select
                                              value={editFormData.studyMode || ""}
                                              onValueChange={(value) => handleInputChange("studyMode", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر نظام الدراسة" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="REGULAR">نظامي</SelectItem>
                                                <SelectItem value="DISTANCE">عن بعد</SelectItem>

                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              صفة القيد
                                            </label>
                                            <Select
                                              value={editFormData.enrollmentStatus || ""}
                                              onValueChange={(value) => handleInputChange("enrollmentStatus", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر صفة القيد" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="مستجد">مستجد</SelectItem>
                                                <SelectItem value="مستمر">مستمر</SelectItem>
                                                <SelectItem value="معيد">معيد</SelectItem>
                                                <SelectItem value="منقول">منقول</SelectItem>
                                                <SelectItem value="منسحب">منسحب</SelectItem>
                                                <SelectItem value="متخرج">متخرج</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              تاريخ التسجيل
                                            </label>
                                            <Input
                                              type="date"
                                              value={editFormData.createdAt || ""}
                                              onChange={(e) => handleInputChange("createdAt", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              المستوى الأكاديمي السابق
                                            </label>
                                            <Input
                                              value={editFormData.previousLevel || ""}
                                              onChange={(e) => handleInputChange("previousLevel", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="مثل: الثانوية العامة"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right col-span-full">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              المدرسة السابقة
                                            </label>
                                            <Input
                                              value={editFormData.previousSchool || ""}
                                              onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل اسم المدرسة السابقة"
                                            />
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
                                            <Select
                                              value={editFormData.healthCondition || ""}
                                              onValueChange={(value) => handleInputChange("healthCondition", value)}
                                              dir="rtl"
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر الحالة الصحية" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="ممتاز">ممتاز</SelectItem>
                                                <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                                                <SelectItem value="جيد">جيد</SelectItem>
                                                <SelectItem value="مقبول">مقبول</SelectItem>
                                                <SelectItem value="يحتاج متابعة">يحتاج متابعة</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الأمراض المزمنة
                                            </label>
                                            <Input
                                              value={editFormData.chronicDiseases || ""}
                                              onChange={(e) => handleInputChange("chronicDiseases", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="مثل: السكري، الضغط، أو لا يوجد"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              الحساسيات
                                            </label>
                                            <Input
                                              value={editFormData.allergies || ""}
                                              onChange={(e) => handleInputChange("allergies", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="مثل: حساسية من البنسلين، أو لا يوجد"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              احتياجات خاصة
                                            </label>
                                            <Input
                                              value={editFormData.specialNeeds || ""}
                                              onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="مثل: نظارات، كرسي متحرك، أو لا يوجد"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right col-span-full">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              ملاحظات صحية إضافية
                                            </label>
                                            <textarea
                                              value={editFormData.notes || ""}
                                              onChange={(e) => handleInputChange("notes", e.target.value)}
                                              className="w-full p-3 text-right border border-lamaSky/30 focus:border-lamaYellow rounded-md resize-none"
                                              rows={4}
                                              placeholder="أدخل أي ملاحظات أو مهارات خاصة بالطالب..."
                                            />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent value="guardian" className="space-y-8 mt-6" dir="rtl">
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
                                              اسم ولي الأمر *
                                            </label>
                                            <Input
                                              value={editFormData.guardianName || ""}
                                              onChange={(e) => handleInputChange("guardianName", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل اسم ولي الأمر"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              صلة القرابة *
                                            </label>
                                            <Select
                                              value={editFormData.relationship || ""}
                                              onValueChange={(value) => handleInputChange("relationship", value)}
                                            >
                                              <SelectTrigger className="text-right border-lamaSky/30 focus:border-lamaYellow">
                                                <SelectValue placeholder="اختر صلة القرابة" />
                                              </SelectTrigger>
                                              <SelectContent align="end" side="bottom">
                                                <SelectItem value="الوالد">الوالد</SelectItem>
                                                <SelectItem value="الوالدة">الوالدة</SelectItem>
                                                <SelectItem value="اب">اب</SelectItem>
                                                <SelectItem value="ام">ام</SelectItem>
                                                <SelectItem value="الأخ">الأخ</SelectItem>
                                                <SelectItem value="الأخت">الأخت</SelectItem>
                                                <SelectItem value="العم">العم</SelectItem>
                                                <SelectItem value="العمة">العمة</SelectItem>
                                                <SelectItem value="الخال">الخال</SelectItem>
                                                <SelectItem value="الخالة">الخالة</SelectItem>
                                                <SelectItem value="الجد">الجد</SelectItem>
                                                <SelectItem value="الجدة">الجدة</SelectItem>
                                                <SelectItem value="أخرى">أخرى</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              رقم هاتف ولي الأمر *
                                            </label>
                                            <Input
                                              value={editFormData.guardianPhone || ""}
                                              onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow font-mono"
                                              placeholder="أدخل رقم هاتف ولي الأمر"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              جهة الاتصال للطوارئ
                                            </label>
                                            <Input
                                              value={editFormData.emergencyContactName || ""}
                                              onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل اسم جهة الاتصال للطوارئ"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              هاتف الطوارئ
                                            </label>
                                            <Input
                                              value={editFormData.emergencyContactPhone || ""}
                                              onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow font-mono"
                                              placeholder="أدخل رقم هاتف الطوارئ"
                                            />
                                          </div>

                                          <div className="space-y-2 text-right">
                                            <label className="text-sm font-semibold text-lamaYellow block text-right">
                                              عنوان الطوارئ
                                            </label>
                                            <Input
                                              value={editFormData.emergencyContactAddress || ""}
                                              onChange={(e) => handleInputChange("emergencyContactAddress", e.target.value)}
                                              className="text-right border-lamaSky/30 focus:border-lamaYellow"
                                              placeholder="أدخل عنوان الطوارئ"
                                            />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </Tabs>

                                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-lamaSky/20">
                                  <Button
                                    onClick={() => setEditingStudent(null)}
                                    variant="outline"
                                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                  >
                                    إلغاء
                                  </Button>
                                  <Button
                                    onClick={handleSaveEdit}
                                    className="bg-lamaYellow hover:bg-lamaYellow/90 text-white"
                                  >
                                    <Edit className="h-4 w-4 ml-2" />
                                    حفظ التغييرات
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="حذف الطالب"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription className="text-right">
                                    هل أنت متأكد من حذف بيانات الطالب &quot;{student.fullName}&quot;؟
                                    <br />
                                    لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex gap-2 justify-start">
                                  <AlertDialogCancel className="ml-2">إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(student.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <DropdownMenu dir="rtl">
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" title="المزيد من الخيارات">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => printStudentDetails(student)}>
                                  <Printer className="ml-2 h-4 w-4" />
                                  طباعة التفاصيل
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(student)}>
                                  <Edit className="ml-2 h-4 w-4" />
                                  تعديل البيانات
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(student.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="ml-2 h-4 w-4" />
                                  حذف الطالب
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      )}
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
                عرض {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} إلى {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} من أصل {pagination.totalItems}{" "}
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
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i
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
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
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

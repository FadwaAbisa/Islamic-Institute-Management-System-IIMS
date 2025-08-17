import prisma from "@/lib/prisma"; 

"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

type Student = {
  id: string;
  registrationNumber: string;
  fullName: string;
  status: string;
  academicYear: string;
  stage: string;
  section: string;
  studySystem: string;
  gender: string;
  photo: string | null;
  nationalId: string;
  birthDate: string;
  nationality: string;
  birthPlace: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  branch: string;
  registrationStatus: string;
  // أضف أي حقول أخرى قد تكون ناقصة هنا
  skills?: string; // مثال لحقل اختياري
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyAddress?: string;
  registrationDate?: string;
  previousLevel?: string;
  previousSchool?: string;
  healthStatus?: string;
  chronicDiseases?: string;
  allergies?: string;
  specialNeeds?: string;
};

// تحديث ألوان الحالات لإزالة "نشط" و إضافة "مستمر"
const statusColors = {
  مستمر: "bg-green-100 text-green-800 border-green-200",
  منقول: "bg-blue-100 text-blue-800 border-blue-200",
  منسحب: "bg-yellow-100 text-yellow-800 border-yellow-200",
  مفصول: "bg-red-100 text-red-800 border-red-200",
  متخرج: "bg-gray-100 text-gray-800 border-gray-200",
  مستجد: "bg-purple-100 text-purple-800 border-purple-200",
}

// تعريف الأعمدة المتاحة
const availableColumns = [
  { key: 'registrationNumber', label: 'رقم القيد', defaultVisible: true },
  { key: 'fullName', label: 'الاسم الرباعي', defaultVisible: true },
  { key: 'status', label: 'حالة الطالب', defaultVisible: true },
  { key: 'academicYear', label: 'العام الدراسي', defaultVisible: true },
  { key: 'stage', label: 'المرحلة الدراسية', defaultVisible: true },
  { key: 'section', label: 'الشعبة', defaultVisible: true },
  { key: 'studySystem', label: 'نظام الدراسة', defaultVisible: false },
  { key: 'gender', label: 'الجنس', defaultVisible: true },
  { key: 'photo', label: 'الصورة', defaultVisible: true },
  { key: 'nationalId', label: 'الرقم الوطني', defaultVisible: false },
  { key: 'birthDate', label: 'تاريخ الميلاد', defaultVisible: false },
  { key: 'nationality', label: 'الجنسية', defaultVisible: false },
  { key: 'phone', label: 'رقم الهاتف', defaultVisible: false },
  { key: 'branch', label: 'الفرع', defaultVisible: false },
];

export default function StudentsDataPage() {
  const [students, setStudents] = useState<any[]>([]); // ابدأ بمصفوفة فارغة
  const [isLoading, setIsLoading] = useState(true); // حالة للتحميل
  
  // حالة إظهار/إخفاء الأعمدة
  const [visibleColumns, setVisibleColumns] = useState<{[key: string]: boolean}>(() => {
    const initial: {[key: string]: boolean} = {};
    availableColumns.forEach(col => {
      initial[col.key] = col.defaultVisible;
    });
    return initial;
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        
        const formattedStudents: Student[] = data.map((student: any) => ({
          id: student.id,
          registrationNumber: student.id,
          fullName: student.fullName,
          status: student.studentStatus,
          academicYear: student.academicYear,
          stage: student.grade?.level?.toString() || 'غير محدد',
          section: student.class?.name || 'غير محدد',
          studySystem: student.studyMode,
          gender: student.sex === 'MALE' ? 'ذكر' : 'أنثى',
          photo: student.img || null,
          nationalId: student.nationalId,
          birthDate: new Date(student.birthday).toISOString().split('T')[0],
          nationality: student.nationality,
          birthPlace: student.placeOfBirth,
          phone: student.studentPhone || "",
          address: student.address,
          guardianName: student.parentName,
          guardianRelation: student.relationship,
          guardianPhone: student.parentPhone || "",
          branch: student.branch,
          registrationStatus: student.enrollmentStatus,
        }));

        setStudents(formattedStudents);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [academicYearFilter, setAcademicYearFilter] = useState("الكل")
  const [stageFilter, setStageFilter] = useState("الكل")
  const [genderFilter, setGenderFilter] = useState("الكل")
  const [statusFilter, setStatusFilter] = useState("الكل")
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  const filteredStudents = useMemo(() => {
    const filtered = students.filter((student) => {
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
        const aValue = a[sortColumn as keyof Student];
        const bValue = b[sortColumn as keyof Student];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === "asc" ? -1 : 1;
        if (bValue == null) return sortDirection === "asc" ? 1 : -1;
        
        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered
  }, [students, searchTerm, academicYearFilter, stageFilter, genderFilter, statusFilter, sortColumn, sortDirection])

  // حساب البيانات للصفحة الحالية
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStudents = filteredStudents.slice(startIndex, endIndex)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // وظيفة تبديل إظهار/إخفاء العمود
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // وظيفة إظهار جميع الأعمدة
  const showAllColumns = () => {
    const allVisible: {[key: string]: boolean} = {};
    availableColumns.forEach(col => {
      allVisible[col.key] = true;
    });
    setVisibleColumns(allVisible);
  };

  // وظيفة إخفاء جميع الأعمدة
  const hideAllColumns = () => {
    const allHidden: {[key: string]: boolean} = {};
    availableColumns.forEach(col => {
      allHidden[col.key] = false;
    });
    setVisibleColumns(allHidden);
  };

  // وظيفة إعادة تعيين الأعمدة للافتراضي
  const resetColumnsToDefault = () => {
    const defaultVisible: {[key: string]: boolean} = {};
    availableColumns.forEach(col => {
      defaultVisible[col.key] = col.defaultVisible;
    });
    setVisibleColumns(defaultVisible);
  };

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

  // وظيفة طباعة الجدول الكامل
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>بيانات الطلاب</title>
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
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #B8956A;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
          }
          .print-date {
            font-size: 14px;
            color: #888;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #B8956A;
          }
          tr:nth-child(even) {
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
          .status-مفصول { background-color: #fee2e2; color: #dc2626; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">بيانات الطلاب</div>
          <div class="subtitle">نظام شامل لإدارة ومتابعة بيانات الطلاب</div>
          <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")}</div>
          <div class="print-date">عدد الطلاب: ${filteredStudents.length}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              ${availableColumns.filter(col => visibleColumns[col.key]).map(col => `<th>${col.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map((student, index) => `
              <tr>
                <td>${index + 1}</td>
                ${availableColumns.filter(col => visibleColumns[col.key]).map(col => {
                  let value = student[col.key as keyof Student] || 'غير محدد';
                  if (col.key === 'status') {
                    value = `<span class="status-badge status-${student.status}">${student.status}</span>`;
                  } else if (col.key === 'photo') {
                    value = student.photo ? 'متوفرة' : 'غير متوفرة';
                  }
                  return `<td>${value}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>

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
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // إضافة وظيفة الطباعة لتفاصيل الطالب
  const printStudentDetails = (student: Student) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

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
              <div class="field-value">${student.registrationDate || "غير محدد"}</div>
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
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">جاري تحميل البيانات...</div>
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
                {/* زر إظهار/إخفاء الأعمدة */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 ml-2" />
                      إظهار/إخفاء الأعمدة
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start" dir="rtl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">إدارة الأعمدة</h4>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={showAllColumns}>
                            إظهار الكل
                          </Button>
                          <Button size="sm" variant="outline" onClick={hideAllColumns}>
                            إخفاء الكل
                          </Button>
                          <Button size="sm" variant="outline" onClick={resetColumnsToDefault}>
                            افتراضي
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                        {availableColumns.map((column) => (
                          <div key={column.key} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={column.key}
                              checked={visibleColumns[column.key]}
                              onCheckedChange={() => toggleColumnVisibility(column.key)}
                            />
                            <label
                              htmlFor={column.key}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {column.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* زر الطباعة */}
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
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))} dir="rtl">
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
                    {availableColumns.filter(col => visibleColumns[col.key]).map((column) => (
                      <TableHead
                        key={column.key}
                        className={column.key !== 'photo' ? "cursor-pointer hover:bg-gray-50" : "text-center"}
                        onClick={column.key !== 'photo' ? () => handleSort(column.key) : undefined}
                      >
                        {column.label}
                      </TableHead>
                    ))}
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
                      {availableColumns.filter(col => visibleColumns[col.key]).map((column) => (
                        <TableCell key={column.key} className={column.key === 'status' || column.key === 'photo' ? "text-center" : ""}>
                          {column.key === 'status' ? (
                            <Badge className={statusColors[student.status as keyof typeof statusColors]}>{student.status}</Badge>
                          ) : column.key === 'photo' ? (
                            <Avatar className="h-10 w-10 mx-auto">
                              {student.photo ? (
                                <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.fullName} />
                              ) : (
                                <AvatarFallback className="bg-lamaYellow text-white font-bold">
                                  {student.fullName.split(" ")[0][0]}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          ) : (
                            student[column.key as keyof Student] || 'غير محدد'
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
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
                                      <Avatar className="h-20 w-20 border-4 border-lamaYellow">
                                        {selectedStudent?.photo ? (
                                          <AvatarImage src={selectedStudent.photo} alt={selectedStudent.fullName} />
                                        ) : (
                                          <AvatarFallback className="bg-lamaYellow text-white text-2xl font-bold">
                                            {selectedStudent?.fullName.split(" ")[0][0]}
                                          </AvatarFallback>
                                        )}
                                      </Avatar>
                                    </div>
                                    <div className="text-right">
                                      <h2 className="text-2xl font-bold text-lamaYellow mb-2">{selectedStudent?.fullName}</h2>
                                      <p className="text-gray-600">رقم القيد: {selectedStudent?.registrationNumber}</p>
                                      <Badge className={statusColors[selectedStudent?.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                                        {selectedStudent?.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => selectedStudent && printStudentDetails(selectedStudent)}
                                    className="flex items-center gap-2"
                                  >
                                    <Printer className="h-4 w-4" />
                                    طباعة
                                  </Button>
                                </DialogTitle>
                              </DialogHeader>

                              {selectedStudent && (
                                <Tabs defaultValue="personal" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                                    <TabsTrigger value="guardian">ولي الأمر والطوارئ</TabsTrigger>
                                    <TabsTrigger value="academic">البيانات الأكاديمية</TabsTrigger>
                                    <TabsTrigger value="health">البيانات الصحية</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="personal" className="space-y-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lamaYellow">البيانات الشخصية</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الاسم الرباعي</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.fullName}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">رقم القيد</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.registrationNumber}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الرقم الوطني</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.nationalId}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الجنس</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.gender}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الجنسية</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.nationality}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">تاريخ الميلاد</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.birthDate}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">مكان الميلاد</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.birthPlace}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">رقم الهاتف</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.phone || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                          <label className="text-sm font-semibold text-lamaYellow">العنوان</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.address}</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent value="guardian" className="space-y-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lamaYellow">بيانات ولي الأمر والطوارئ</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">اسم ولي الأمر</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.guardianName}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">صلة القرابة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.guardianRelation}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">رقم هاتف ولي الأمر</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.guardianPhone}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">جهة الاتصال للطوارئ</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.emergencyContact || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">هاتف الطوارئ</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.emergencyPhone || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">عنوان الطوارئ</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.emergencyAddress || "غير محدد"}</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent value="academic" className="space-y-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lamaYellow">البيانات الأكاديمية</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الفرع</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.branch}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">العام الدراسي</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.academicYear}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">المرحلة الدراسية</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.stage}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الشعبة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.section}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">نظام الدراسة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.studySystem}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">صفة القيد</label>
                                          <div className="p-3 bg-white rounded-lg border">
                                            <Badge className={statusColors[selectedStudent.registrationStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                                              {selectedStudent.registrationStatus}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">حالة الطالب</label>
                                          <div className="p-3 bg-white rounded-lg border">
                                            <Badge className={statusColors[selectedStudent.status as keyof typeof statusColors]}>
                                              {selectedStudent.status}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">تاريخ التسجيل</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.registrationDate || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">المدرسة السابقة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.previousSchool || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">المستوى الأكاديمي السابق</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.previousLevel || "غير محدد"}</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent value="health" className="space-y-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lamaYellow">البيانات الصحية</CardTitle>
                                      </CardHeader>
                                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الحالة الصحية</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.healthStatus || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">أمراض مزمنة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.chronicDiseases || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">الحساسيات</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.allergies || "غير محدد"}</div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-lamaYellow">احتياجات خاصة</label>
                                          <div className="p-3 bg-white rounded-lg border">{selectedStudent.specialNeeds || "غير محدد"}</div>
                                        </div>
                                        {selectedStudent.skills && (
                                          <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-lamaYellow">ملاحظات (مهارات)</label>
                                            <div className="p-3 bg-white rounded-lg border">{selectedStudent.skills}</div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* التنقل بين الصفحات */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                عرض {startIndex + 1} إلى {Math.min(endIndex, filteredStudents.length)} من {filteredStudents.length} طالب
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "bg-lamaYellow hover:bg-lamaYellow/90" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
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




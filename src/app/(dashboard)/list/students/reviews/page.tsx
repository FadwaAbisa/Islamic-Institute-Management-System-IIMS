"use client"

import { useState, useMemo } from "react"

// تحديث بيانات الطلاب لتشمل الطالبة الجديدة وإزالة الحالات غير المرغوبة
const studentsData = [
  {
    id: 1,
    registrationNumber: "131686",
    fullName: "آية جمعة عبدالسلام فرنانة",
    status: "مستمر",
    academicYear: "2024-2025",
    stage: "السنة الثانية",
    section: "الدراسات الإسلامية",
    studySystem: "نظامي",
    gender: "أنثى",
    photo: null,
    nationalId: "220080152695",
    birthDate: "2008-10-23",
    nationality: "ليبيا",
    birthPlace: "طرابلس",
    phone: "",
    address: "الكريمية",
    guardianName: "جمعة عبد السلام فرنانة",
    guardianRelation: "اب",
    guardianPhone: "913808566",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyAddress: "",
    branch: "عثمان بن عفان",
    registrationDate: "غير محدد",
    registrationStatus: "مستجد",
    previousLevel: "",
    previousSchool: "",
    healthStatus: "",
    chronicDiseases: "",
    allergies: "",
    specialNeeds: "",
    skills: "",
  },
  {
    id: 2,
    registrationNumber: "2024002",
    fullName: "محمد عبدالله سالم حسن",
    status: "منقول",
    academicYear: "2024-2025",
    stage: "الثانية",
    section: "ب",
    studySystem: "نظامي",
    gender: "ذكر",
    photo: "/placeholder.svg?height=40&width=40",
    nationalId: "200012345678",
    birthDate: "2000-03-20",
    nationality: "ليبيا",
    birthPlace: "بنغازي",
    phone: "092-2345678",
    address: "بنغازي - منطقة الصابري",
    guardianName: "عبدالله سالم حسن",
    guardianRelation: "الوالد",
    guardianPhone: "091-8765432",
    emergencyContact: "فاطمة سالم",
    emergencyPhone: "094-1234567",
    emergencyAddress: "بنغازي - الصابري",
    branch: "الطب",
    registrationDate: "2023-09-01",
    registrationStatus: "مستمر",
    previousLevel: "الثانوية العامة",
    previousSchool: "ثانوية الصابري",
    healthStatus: "جيد",
    chronicDiseases: "لا يوجد",
    allergies: "حساسية من البنسلين",
    specialNeeds: "لا يوجد",
    skills: "برمجة، رياضيات",
  },
  {
    id: 3,
    registrationNumber: "2024003",
    fullName: "عائشة محمود إبراهيم أحمد",
    status: "مستمر",
    academicYear: "2024-2025",
    stage: "الأولى",
    section: "أ",
    studySystem: "مسائي",
    gender: "أنثى",
    photo: "/placeholder.svg?height=40&width=40",
    nationalId: "200123456789",
    birthDate: "2001-07-10",
    nationality: "ليبيا",
    birthPlace: "مصراتة",
    phone: "093-3456789",
    address: "مصراتة - منطقة الزروق",
    guardianName: "محمود إبراهيم أحمد",
    guardianRelation: "الوالد",
    guardianPhone: "094-9876543",
    emergencyContact: "زينب محمود",
    emergencyPhone: "095-2345678",
    emergencyAddress: "مصراتة - الزروق",
    branch: "الآداب",
    registrationDate: "2024-09-01",
    registrationStatus: "مستجد",
    previousLevel: "الثانوية العامة",
    previousSchool: "ثانوية الزروق",
    healthStatus: "جيد",
    chronicDiseases: "لا يوجد",
    allergies: "لا يوجد",
    specialNeeds: "لا يوجد",
    skills: "كتابة، خطابة",
  },
  {
    id: 4,
    registrationNumber: "2024004",
    fullName: "خالد سعد عمر محمد",
    status: "منسحب",
    academicYear: "2023-2024",
    stage: "الرابعة",
    section: "ج",
    studySystem: "منتسب",
    gender: "ذكر",
    photo: null,
    nationalId: "199812345678",
    birthDate: "1998-12-05",
    nationality: "ليبيا",
    birthPlace: "سبها",
    phone: "094-4567890",
    address: "سبها - منطقة المنشية",
    guardianName: "سعد عمر محمد",
    guardianRelation: "الوالد",
    guardianPhone: "095-0987654",
    emergencyContact: "أمينة سعد",
    emergencyPhone: "096-3456789",
    emergencyAddress: "سبها - المنشية",
    branch: "التجارة",
    registrationDate: "2021-09-01",
    registrationStatus: "منسحب",
    previousLevel: "الثانوية العامة",
    previousSchool: "ثانوية المنشية",
    healthStatus: "جيد",
    chronicDiseases: "السكري",
    allergies: "لا يوجد",
    specialNeeds: "لا يوجد",
    skills: "محاسبة، إدارة",
  },
  {
    id: 5,
    registrationNumber: "2024005",
    fullName: "مريم علي حسين عبدالله",
    status: "متخرج",
    academicYear: "2023-2024",
    stage: "الرابعة",
    section: "أ",
    studySystem: "نظامي",
    gender: "أنثى",
    photo: "/placeholder.svg?height=40&width=40",
    nationalId: "199712345678",
    birthDate: "1997-09-15",
    nationality: "ليبيا",
    birthPlace: "الزاوية",
    phone: "095-5678901",
    address: "الزاوية - منطقة الحرية",
    guardianName: "علي حسين عبدالله",
    guardianRelation: "الوالد",
    guardianPhone: "096-1098765",
    emergencyContact: "خديجة علي",
    emergencyPhone: "097-4567890",
    emergencyAddress: "الزاوية - الحرية",
    branch: "العلوم",
    registrationDate: "2020-09-01",
    registrationStatus: "متخرج",
    previousLevel: "الثانوية العامة",
    previousSchool: "ثانوية الحرية",
    healthStatus: "جيد",
    chronicDiseases: "لا يوجد",
    allergies: "لا يوجد",
    specialNeeds: "لا يوجد",
    skills: "بحث علمي، تحليل",
  },
]

// تحديث ألوان الحالات لإزالة "نشط" و إضافة "مستمر"
const statusColors = {
  مستمر: "bg-green-100 text-green-800 border-green-200",
  منقول: "bg-blue-100 text-blue-800 border-blue-200",
  منسحب: "bg-yellow-100 text-yellow-800 border-yellow-200",
  مفصول: "bg-red-100 text-red-800 border-red-200",
  متخرج: "bg-gray-100 text-gray-800 border-gray-200",
  مستجد: "bg-purple-100 text-purple-800 border-purple-200",
}

export default function StudentsDataPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [academicYearFilter, setAcademicYearFilter] = useState("الكل")
  const [stageFilter, setStageFilter] = useState("الكل")
  const [genderFilter, setGenderFilter] = useState("الكل")
  const [statusFilter, setStatusFilter] = useState("الكل")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [students, setStudents] = useState(studentsData)

  // إضافة state جديد لإدارة الأعمدة المرئية
  const [visibleColumns, setVisibleColumns] = useState({
    index: true,
    registrationNumber: true,
    fullName: true,
    status: true,
    academicYear: true,
    stage: true,
    section: true,
    studySystem: true,
    gender: true,
    photo: true,
    actions: true,
  })

  // إضافة state جديد لإدارة الأخطاء والتحقق من صحة البيانات
  const [editingStudent, setEditingStudent] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // إضافة وظيفة التحقق من صحة البيانات
  const validateForm = () => {
    const errors = {}

    // التحقق من الحقول المطلوبة
    if (!editFormData.fullName?.trim()) {
      errors.fullName = "الاسم الرباعي مطلوب"
    } else if (editFormData.fullName.trim().length < 3) {
      errors.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل"
    }

    if (!editFormData.registrationNumber?.trim()) {
      errors.registrationNumber = "رقم القيد مطلوب"
    } else if (!/^\d+$/.test(editFormData.registrationNumber)) {
      errors.registrationNumber = "رقم القيد يجب أن يحتوي على أرقام فقط"
    } else {
      // التحقق من عدم تكرار رقم القيد
      const existingStudent = students.find(
        (s) => s.registrationNumber === editFormData.registrationNumber && s.id !== editingStudent.id,
      )
      if (existingStudent) {
        errors.registrationNumber = "رقم القيد موجود مسبقاً"
      }
    }

    if (!editFormData.nationalId?.trim()) {
      errors.nationalId = "الرقم الوطني مطلوب"
    } else if (!/^\d{12}$/.test(editFormData.nationalId)) {
      errors.nationalId = "الرقم الوطني يجب أن يكون 12 رقماً"
    } else {
      // التحقق من عدم تكرار الرقم الوطني
      const existingStudent = students.find(
        (s) => s.nationalId === editFormData.nationalId && s.id !== editingStudent.id,
      )
      if (existingStudent) {
        errors.nationalId = "الرقم الوطني موجود مسبقاً"
      }
    }

    if (!editFormData.gender) {
      errors.gender = "الجنس مطلوب"
    }

    if (!editFormData.branch?.trim()) {
      errors.branch = "الفرع الأكاديمي مطلوب"
    }

    if (!editFormData.academicYear) {
      errors.academicYear = "العام الدراسي مطلوب"
    }

    if (!editFormData.stage) {
      errors.stage = "المرحلة الدراسية مطلوبة"
    }

    if (!editFormData.status) {
      errors.status = "حالة الطالب مطلوبة"
    }

    if (!editFormData.studySystem) {
      errors.studySystem = "نظام الدراسة مطلوب"
    }

    if (!editFormData.guardianName?.trim()) {
      errors.guardianName = "اسم ولي الأمر مطلوب"
    }

    if (!editFormData.guardianRelation) {
      errors.guardianRelation = "صلة القرابة مطلوبة"
    }

    if (!editFormData.guardianPhone?.trim()) {
      errors.guardianPhone = "رقم هاتف ولي الأمر مطلوب"
    } else if (!/^[0-9\-+\s]+$/.test(editFormData.guardianPhone)) {
      errors.guardianPhone = "رقم الهاتف غير صحيح"
    }

    // التحقق من صحة البريد الإلكتروني إذا تم إدخاله
    if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.email = "البريد الإلكتروني غير صحيح"
    }

    // التحقق من صحة تاريخ الميلاد
    if (editFormData.birthDate) {
      const birthDate = new Date(editFormData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (birthDate > today) {
        errors.birthDate = "تاريخ الميلاد لا يمكن أن يكون في المستقبل"
      } else if (age < 15 || age > 60) {
        errors.birthDate = "العمر يجب أن يكون بين 15 و 60 سنة"
      }
    }

    // التحقق من تاريخ التسجيل
    if (editFormData.registrationDate) {
      const regDate = new Date(editFormData.registrationDate)
      const today = new Date()

      if (regDate > today) {
        errors.registrationDate = "تاريخ التسجيل لا يمكن أن يكون في المستقبل"
      }
    }

    return errors
  }

  // تحديث وظيفة handleEdit
  const handleEdit = (student) => {
    setEditingStudent(student)
    setEditFormData({ ...student })
    setFormErrors({})
  }

  // تحديث وظيفة handleSaveEdit
  const handleSaveEdit = async () => {
    setIsSubmitting(true)

    const errors = validateForm()
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false)
      return
    }

    try {
      // محاكاة عملية الحفظ
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStudents((prevStudents) =>
        prevStudents.map((student) => (student.id === editingStudent.id ? { ...editFormData } : student)),
      )

      setEditingStudent(null)
      setEditFormData({})
      setFormErrors({})

      // إظهار رسالة نجاح
      alert("تم حفظ التغييرات بنجاح!")
    } catch (error) {
      alert("حدث خطأ أثناء حفظ البيانات")
    } finally {
      setIsSubmitting(false)
    }
  }

  // تحديث وظيفة handleInputChange لتشمل التحقق الفوري
  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // إزالة الخطأ عند بدء الكتابة
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }

    // التحقق الفوري لبعض الحقول
    if (field === "registrationNumber" && value) {
      if (!/^\d+$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: "رقم القيد يجب أن يحتوي على أرقام فقط",
        }))
      } else {
        const existingStudent = students.find((s) => s.registrationNumber === value && s.id !== editingStudent.id)
        if (existingStudent) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "رقم القيد موجود مسبقاً",
          }))
        }
      }
    }

    if (field === "nationalId" && value) {
      if (!/^\d{12}$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: "الرقم الوطني يجب أن يكون 12 رقماً",
        }))
      } else {
        const existingStudent = students.find((s) => s.nationalId === value && s.id !== editingStudent.id)
        if (existingStudent) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "الرقم الوطني موجود مسبقاً",
          }))
        }
      }
    }

    if (field === "guardianPhone" && value) {
      if (!/^[0-9\-+\s]+$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: "رقم الهاتف غير صحيح",
        }))
      }
    }
  }

  // إضافة مكون لعرض رسائل الخطأ
  const ErrorMessage = ({ error }) => {
    if (!error) return null
    return (
      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </div>
    )
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
      ...students.map((student) =>
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
          <div class="date">إجمالي الطلاب: ${students.length}</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              ${visibleColumns.index ? "<th>#</th>" : ""}
              ${visibleColumns.registrationNumber ? "<th>رقم القيد</th>" : ""}
              ${visibleColumns.fullName ? "<th>الاسم الرباعي</th>" : ""}
              ${visibleColumns.status ? "<th>حالة الطالب</th>" : ""}
              ${visibleColumns.academicYear ? "<th>العام الدراسي</th>" : ""}
              ${visibleColumns.stage ? "<th>المرحلة الدراسية</th>" : ""}
              ${visibleColumns.section ? "<th>الشعبة</th>" : ""}
              ${visibleColumns.studySystem ? "<th>نظام الدراسة</th>" : ""}
              ${visibleColumns.gender ? "<th>الجنس</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (student, index) => `
              <tr>
                ${visibleColumns.index ? `<td>${index + 1}</td>` : ""}
                ${visibleColumns.registrationNumber ? `<td>${student.registrationNumber}</td>` : ""}
                ${visibleColumns.fullName ? `<td>${student.fullName}</td>` : ""}
                ${visibleColumns.status ? `<td><span class="status-badge status-${student.status}">${student.status}</span></td>` : ""}
                ${visibleColumns.academicYear ? `<td>${student.academicYear}</td>` : ""}
                ${visibleColumns.stage ? `<td>${student.stage}</td>` : ""}
                ${visibleColumns.section ? `<td>${student.section}</td>` : ""}
                ${visibleColumns.studySystem ? `<td>${student.studySystem}</td>` : ""}
                ${visibleColumns.gender ? `<td>${student.gender}</td>` : ""}
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
  const printStudentDetails = (student) => {
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

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchTermLower = searchTerm.toLowerCase()
      const fullNameLower = student.fullName.toLowerCase()
      const registrationNumber = student.registrationNumber.toLowerCase()

      const academicYearMatch = academicYearFilter === "الكل" || student.academicYear === academicYearFilter
      const stageMatch = stageFilter === "الكل" || student.stage === stageFilter
      const genderMatch = genderFilter === "الكل" || student.gender === genderFilter
      const statusMatch = statusFilter === "الكل" || student.status === statusFilter
      const searchMatch =
        searchTerm === "" ||
        fullNameLower.includes(searchTermLower) ||
        registrationNumber.includes(searchTermLower) ||
        student.nationalId.includes(searchTermLower) ||
        student.branch.toLowerCase().includes(searchTermLower)

      return academicYearMatch && stageMatch && genderMatch && statusMatch && searchMatch
    })
  }, [students, searchTerm, academicYearFilter, stageFilter, genderFilter, statusFilter])

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedStudents = useMemo(() => {
    if (!sortColumn) return filteredStudents

    return [...filteredStudents].sort((a, b) => {
      const valueA = a[sortColumn]
      const valueB = b[sortColumn]

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredStudents, sortColumn, sortDirection])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStudents = useMemo(() => {
    return sortedStudents.slice(startIndex, endIndex)
  }, [sortedStudents, startIndex, endIndex])

  const totalPages = Math.ceil(students.length / itemsPerPage)

  const handleDelete = (id) => {
    setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id))
  }
}

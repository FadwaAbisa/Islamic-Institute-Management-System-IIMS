"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Filter,
  Eye,
  Edit,
  Save,
  FileText,
  Users,
  BookOpen,
  TrendingUp,
  Search,
  Calendar,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react"

// نوع البيانات للطلب
interface ReviewRequest {
  id: string
  studentName: string
  nationalId: string
  section: string
  academicYear: string
  subject: string
  currentGrade: number
  newGrade: number | null
  submissionDate: string
  status: "جديد" | "قيد المراجعة" | "تم التعديل" | "تمت المراجعة - لا يوجد تعديل" | "معلق"
  reviewerNotes: string
  reviewer: string
  lastUpdate: string
}

// بيانات تجريبية موسعة
const mockData: ReviewRequest[] = [
  {
    id: "REV2024-001",
    studentName: "فاطمة أحمد محمد",
    nationalId: "199912345678",
    section: "أ",
    academicYear: "الثالثة",
    subject: "الرياضيات",
    currentGrade: 78,
    newGrade: null,
    submissionDate: "2024-07-15",
    status: "قيد المراجعة",
    reviewerNotes: "",
    reviewer: "أ. محمد علي",
    lastUpdate: "2024-07-16",
  },
  {
    id: "REV2024-002",
    studentName: "عائشة سالم أحمد",
    nationalId: "199823456789",
    section: "ب",
    academicYear: "الثانية",
    subject: "الفيزياء",
    currentGrade: 65,
    newGrade: 72,
    submissionDate: "2024-07-14",
    status: "تم التعديل",
    reviewerNotes: "تم مراجعة الإجابة وتصحيح الدرجة",
    reviewer: "د. سارة محمد",
    lastUpdate: "2024-07-17",
  },
  {
    id: "REV2024-003",
    studentName: "مريم خالد عبدالله",
    nationalId: "199934567890",
    section: "أ",
    academicYear: "الأولى",
    subject: "الكيمياء",
    currentGrade: 85,
    newGrade: null,
    submissionDate: "2024-07-13",
    status: "تمت المراجعة - لا يوجد تعديل",
    reviewerNotes: "الدرجة صحيحة",
    reviewer: "أ. أحمد حسن",
    lastUpdate: "2024-07-18",
  },
  {
    id: "REV2024-004",
    studentName: "نور عبدالرحمن علي",
    nationalId: "199945678901",
    section: "ج",
    academicYear: "الرابعة",
    subject: "الأحياء",
    currentGrade: 92,
    newGrade: null,
    submissionDate: "2024-07-12",
    status: "جديد",
    reviewerNotes: "",
    reviewer: "",
    lastUpdate: "2024-07-12",
  },
  {
    id: "REV2024-005",
    studentName: "هدى محمود يوسف",
    nationalId: "199956789012",
    section: "ب",
    academicYear: "الثالثة",
    subject: "التاريخ",
    currentGrade: 58,
    newGrade: null,
    submissionDate: "2024-07-11",
    status: "معلق",
    reviewerNotes: "يحتاج مراجعة إضافية",
    reviewer: "د. ليلى أحمد",
    lastUpdate: "2024-07-19",
  },
  {
    id: "REV2024-006",
    studentName: "زينب محمد أحمد",
    nationalId: "199967890123",
    section: "أ",
    academicYear: "الثانية",
    subject: "الجغرافيا",
    currentGrade: 73,
    newGrade: 78,
    submissionDate: "2024-07-10",
    status: "تم التعديل",
    reviewerNotes: "تم تصحيح خطأ في التصحيح",
    reviewer: "أ. فاطمة علي",
    lastUpdate: "2024-07-20",
  },
]

// مكون بطاقة الإحصائيات المحسن
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  description,
}: {
  title: string
  value: string | number
  icon: any
  color: string
  trend?: string
  description?: string
}) {
  return (
    <Card className="bg-gradient-to-br from-lamaPurpleLight to-white border-lamaSky/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-lamaYellow/80 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
            {trend && <p className="text-xs text-lamaSky">{trend}</p>}
          </div>
          <div
            className={`p-3 rounded-full bg-gradient-to-br from-lamaSkyLight to-lamaSky/20 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
        {description && (
          <div className="pt-2 border-t border-lamaSky/10">
            <p className="text-xs text-lamaYellow/60">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// مكون حالة الطلب المحسن
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "جديد":
        return {
          color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200",
          icon: AlertCircle,
          pulse: true,
        }
      case "قيد المراجعة":
        return {
          color: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200",
          icon: Clock,
          pulse: true,
        }
      case "تم التعديل":
        return {
          color: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200",
          icon: CheckCircle,
          pulse: false,
        }
      case "تمت المراجعة - لا يوجد تعديل":
        return {
          color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200",
          icon: CheckCircle,
          pulse: false,
        }
      case "معلق":
        return {
          color: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200",
          icon: XCircle,
          pulse: true,
        }
      default:
        return {
          color: "bg-gray-500 text-white",
          icon: AlertCircle,
          pulse: false,
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      className={`${config.color} text-xs px-3 py-1 shadow-lg ${config.pulse ? "animate-pulse" : ""} flex items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

// مكون مؤشر التقدم للإحصائيات
function ProgressIndicator({
  label,
  value,
  total,
  color,
}: { label: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-lamaYellow font-medium">{label}</span>
        <span className="text-lamaSky font-semibold">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}

export default function ReviewManagementSystem() {
  const [data, setData] = useState<ReviewRequest[]>(mockData)
  const [filters, setFilters] = useState({
    searchName: "",
    searchId: "",
    academicYear: "الأولى",
    status: "جديد",
    section: "أ",
    subject: "الرياضيات",
    fromDate: "",
    toDate: "",
  })
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null)
  const [editingGrade, setEditingGrade] = useState<{ id: string; grade: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  // تصفية البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      return (
        (!filters.searchName || item.studentName.includes(filters.searchName)) &&
        (!filters.searchId || item.nationalId.includes(filters.searchId)) &&
        (!filters.academicYear || item.academicYear === filters.academicYear) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.section || item.section === filters.section) &&
        (!filters.subject || item.subject === filters.subject) &&
        (!filters.fromDate || item.submissionDate >= filters.fromDate) &&
        (!filters.toDate || item.submissionDate <= filters.toDate)
      )
    })

    // ترتيب البيانات
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ReviewRequest]
        const bValue = b[sortConfig.key as keyof ReviewRequest]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, filters, sortConfig])

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const totalStudents = new Set(data.map((item) => item.nationalId)).size
    const totalRequests = data.length
    const totalSubjects = new Set(data.map((item) => item.subject)).size
    const modifiedCount = data.filter((item) => item.status === "تم التعديل").length
    const modificationRate = totalRequests > 0 ? Math.round((modifiedCount / totalRequests) * 100) : 0

    return {
      totalStudents,
      totalRequests,
      totalSubjects,
      modificationRate,
    }
  }, [data])

  // إحصائيات حسب السنة
  const yearStats = useMemo(() => {
    const years = ["الأولى", "الثانية", "الثالثة", "الرابعة"]
    return years.map((year) => {
      const yearData = data.filter((item) => item.academicYear === year)
      return {
        year,
        studentCount: new Set(yearData.map((item) => item.nationalId)).size,
        requestCount: yearData.length,
      }
    })
  }, [data])

  // إحصائيات حسب الحالة
  const statusStats = useMemo(() => {
    const statuses = ["جديد", "قيد المراجعة", "تم التعديل", "تمت المراجعة - لا يوجد تعديل", "معلق"]
    const total = data.length
    return statuses.map((status) => {
      const count = data.filter((item) => item.status === status).length
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      return { status, count, percentage }
    })
  }, [data])

  // حفظ الدرجة الجديدة
  const saveGrade = async (id: string, newGrade: number) => {
    setIsLoading(true)
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, newGrade, status: "تم التعديل", lastUpdate: new Date().toISOString().split("T")[0] }
          : item,
      ),
    )
    setEditingGrade(null)
    setIsLoading(false)
  }

  // تحديث حالة الطلب
  const updateStatus = async (id: string, newStatus: ReviewRequest["status"]) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, lastUpdate: new Date().toISOString().split("T")[0] } : item,
      ),
    )
    setIsLoading(false)
  }

  // ترتيب الجدول
  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  // إعادة تعيين المرشحات
  const resetFilters = () => {
    setFilters({
      searchName: "",
      searchId: "",
      academicYear: "الأولى",
      status: "جديد",
      section: "أ",
      subject: "الرياضيات",
      fromDate: "",
      toDate: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white p-4 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* العنوان الرئيسي المحسن */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lamaSky/10 via-transparent to-lamaYellow/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-lamaSky/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-10 w-10 text-lamaSky" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lamaYellow to-lamaSky bg-clip-text text-transparent">
                نظام إدارة طلبات مراجعة الدرجات
              </h1>
            </div>
            <p className="text-lg text-lamaSky/80 font-medium">قسم الدراسة والامتحانات - الفترة الثالثة</p>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-lamaYellow/70">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>العام الدراسي 2024-2025</span>
              </div>
              <div className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                <span>{data.length} طلب مراجعة</span>
              </div>
            </div>
          </div>
        </div>

        {/* مرشحات البحث والتصفية المحسنة */}
        <Card className="bg-white/90 backdrop-blur-sm border-lamaSky/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-lamaSkyLight/50 to-lamaYellowLight/50">
            <CardTitle className="text-lamaYellow flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-lg">
                <Filter className="h-5 w-5" />
              </div>
              مرشحات البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* الصف الأول - البحث */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  البحث بالاسم
                </Label>
                <Input
                  placeholder="اسم الطالبة..."
                  value={filters.searchName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchName: e.target.value }))}
                  className="bg-white border-lamaSky/30 focus:border-lamaSky focus:ring-lamaSky/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  البحث بالرقم الوطني
                </Label>
                <Input
                  placeholder="الرقم الوطني..."
                  value={filters.searchId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchId: e.target.value }))}
                  className="bg-white border-lamaSky/30 focus:border-lamaSky focus:ring-lamaSky/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">السنة الدراسية</Label>
                <Select
                  value={filters.academicYear}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, academicYear: value }))}
                >
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaSky">
                    <SelectValue placeholder="جميع السنوات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الأولى">الأولى</SelectItem>
                    <SelectItem value="الثانية">الثانية</SelectItem>
                    <SelectItem value="الثالثة">الثالثة</SelectItem>
                    <SelectItem value="الرابعة">الرابعة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-lamaSky/20" />

            {/* الصف الثاني - التصفية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">حالة الطلب</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaSky">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جديد">جديد</SelectItem>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="تم التعديل">تم التعديل</SelectItem>
                    <SelectItem value="تمت المراجعة - لا يوجد تعديل">تمت المراجعة - لا يوجد تعديل</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">الشعبة</Label>
                <Select
                  value={filters.section}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, section: value }))}
                >
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaSky">
                    <SelectValue placeholder="جميع الشعب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أ">أ</SelectItem>
                    <SelectItem value="ب">ب</SelectItem>
                    <SelectItem value="ج">ج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">المادة</Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger className="bg-white border-lamaSky/30 focus:border-lamaSky">
                    <SelectValue placeholder="جميع المواد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الرياضيات">الرياضيات</SelectItem>
                    <SelectItem value="الفيزياء">الفيزياء</SelectItem>
                    <SelectItem value="الكيمياء">الكيمياء</SelectItem>
                    <SelectItem value="الأحياء">الأحياء</SelectItem>
                    <SelectItem value="التاريخ">التاريخ</SelectItem>
                    <SelectItem value="الجغرافيا">الجغرافيا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="bg-lamaSky/20" />

            {/* الصف الثالث - التاريخ والإجراءات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">من تاريخ</Label>
                <Input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                  className="bg-white border-lamaSky/30 focus:border-lamaSky"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lamaYellow font-semibold">إلى تاريخ</Label>
                <Input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                  className="bg-white border-lamaSky/30 focus:border-lamaSky"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full border-lamaSky/30 text-lamaYellow hover:bg-lamaSkyLight/20 transition-all duration-200 bg-transparent"
                >
                  <RefreshCw className="ml-2 h-4 w-4" />
                  إعادة تعيين
                </Button>
              </div>
              <div className="flex items-end">
                <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white w-full shadow-lg transition-all duration-200">
                  <Download className="ml-2 h-4 w-4" />
                  تصدير النتائج
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الإحصائيات السريعة المحسنة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي الطالبات"
            value={stats.totalStudents.toLocaleString()}
            icon={Users}
            color="text-lamaSky"
            trend="↗ +12 هذا الأسبوع"
            description="العدد الإجمالي للطالبات المسجلات"
          />
          <StatCard
            title="إجمالي الطلبات"
            value={stats.totalRequests.toLocaleString()}
            icon={FileText}
            color="text-lamaYellow"
            trend="↗ +8 طلبات جديدة"
            description="مجموع طلبات المراجعة المقدمة"
          />
          <StatCard
            title="المقررات المراجعة"
            value={stats.totalSubjects}
            icon={BookOpen}
            color="text-lamaSky"
            description="عدد المواد الدراسية المختلفة"
          />
          <StatCard
            title="معدل التعديل"
            value={`${stats.modificationRate}%`}
            icon={TrendingUp}
            color="text-lamaYellow"
            trend={stats.modificationRate > 20 ? "↗ مرتفع" : "↘ منخفض"}
            description="نسبة الطلبات التي تم تعديل درجاتها"
          />
        </div>

        {/* جدول الطلبات المستلمة المحسن */}
        <Card className="bg-white/90 backdrop-blur-sm border-lamaSky/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-lamaSkyLight/50 to-lamaYellowLight/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lamaYellow flex items-center gap-3">
                <div className="p-2 bg-white/80 rounded-lg">
                  <ClipboardList className="h-5 w-5" />
                </div>
                الطلبات المستلمة ({filteredData.length})
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-lamaSky">
                <BarChart3 className="h-4 w-4" />
                <span>
                  عرض {filteredData.length} من {data.length}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-lamaSkyLight/30 to-lamaYellowLight/30">
                  <tr className="border-b border-lamaSky/20">
                    {[
                      { key: "id", label: "رقم الطلب" },
                      { key: "studentName", label: "اسم الطالبة" },
                      { key: "nationalId", label: "الرقم الوطني" },
                      { key: "section", label: "الشعبة" },
                      { key: "academicYear", label: "السنة" },
                      { key: "subject", label: "المادة" },
                      { key: "currentGrade", label: "الدرجة الحالية" },
                      { key: "newGrade", label: "الدرجة الجديدة" },
                      { key: "submissionDate", label: "تاريخ التقديم" },
                      { key: "status", label: "الحالة" },
                      { key: "actions", label: "الإجراءات" },
                    ].map((column) => (
                      <th
                        key={column.key}
                        className="text-right p-4 text-lamaYellow font-semibold cursor-pointer hover:bg-lamaSkyLight/20 transition-colors duration-200"
                        onClick={() => column.key !== "actions" && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {sortConfig?.key === column.key && (
                            <span className="text-xs">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-lamaSky/60">
                          <ClipboardList className="h-12 w-12" />
                          <p className="text-lg font-medium">لا توجد طلبات تطابق المرشحات المحددة</p>
                          <Button
                            onClick={resetFilters}
                            variant="outline"
                            className="border-lamaSky/30 text-lamaYellow bg-transparent"
                          >
                            إعادة تعيين المرشحات
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`border-b border-lamaSky/10 hover:bg-gradient-to-r hover:from-lamaSkyLight/20 hover:to-transparent transition-all duration-200 ${
                          index % 2 === 0 ? "bg-white/50" : "bg-lamaPurpleLight/30"
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-medium text-lamaSky bg-lamaSkyLight/30 px-2 py-1 rounded-md text-center">
                            {request.id}
                          </div>
                        </td>
                        <td className="p-4 font-medium">{request.studentName}</td>
                        <td className="p-4 font-mono text-sm bg-gray-50 rounded">{request.nationalId}</td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="border-lamaSky/30 text-lamaYellow">
                            {request.section}
                          </Badge>
                        </td>
                        <td className="p-4">{request.academicYear}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-lamaYellowLight/50 text-lamaYellow">
                            {request.subject}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="font-bold text-lg bg-lamaSkyLight/30 px-3 py-1 rounded-lg">
                            {request.currentGrade}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {editingGrade?.id === request.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={editingGrade.grade}
                                onChange={(e) => setEditingGrade({ id: request.id, grade: Number(e.target.value) })}
                                className="w-20 h-10 text-center font-bold border-2 border-statusModified focus:ring-statusModified"
                              />
                              <Button
                                size="sm"
                                onClick={() => saveGrade(request.id, editingGrade.grade)}
                                disabled={isLoading}
                                className="h-10 px-3 bg-statusModified hover:bg-statusModified/80 shadow-lg"
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              {request.newGrade !== null ? (
                                <div className="font-bold text-lg text-statusModified bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                                  {request.newGrade}
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingGrade({ id: request.id, grade: request.currentGrade })}
                                  className="h-10 px-3 border-lamaSky/30 text-lamaYellow hover:bg-lamaSkyLight/20 transition-all duration-200"
                                >
                                  <Edit className="h-4 w-4 ml-1" />
                                  تعديل
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">{request.submissionDate}</td>
                        <td className="p-4">
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value as ReviewRequest["status"])}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="w-full h-10 border-0 bg-transparent">
                              <StatusBadge status={request.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="جديد">جديد</SelectItem>
                              <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                              <SelectItem value="تم التعديل">تم التعديل</SelectItem>
                              <SelectItem value="تمت المراجعة - لا يوجد تعديل">تمت المراجعة - لا يوجد تعديل</SelectItem>
                              <SelectItem value="معلق">معلق</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedRequest(request)}
                                className="h-10 px-3 border-lamaSky/30 text-lamaYellow hover:bg-lamaSkyLight/20 hover:scale-105 transition-all duration-200 shadow-md"
                              >
                                <Eye className="h-4 w-4 ml-1" />
                                عرض
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
                              <DialogHeader className="bg-gradient-to-r from-lamaSkyLight/50 to-lamaYellowLight/50 -m-6 p-6 mb-6">
                                <DialogTitle className="text-lamaYellow text-xl flex items-center gap-3">
                                  <div className="p-2 bg-white/80 rounded-lg">
                                    <Eye className="h-5 w-5" />
                                  </div>
                                  تفاصيل الطلب
                                </DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">رقم الطلب:</Label>
                                        <p className="font-bold text-lg text-lamaSky mt-1">{selectedRequest.id}</p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">اسم الطالبة:</Label>
                                        <p className="font-bold text-lg mt-1">{selectedRequest.studentName}</p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">الرقم الوطني:</Label>
                                        <p className="font-mono text-lg mt-1">{selectedRequest.nationalId}</p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">الشعبة:</Label>
                                        <p className="text-lg mt-1">{selectedRequest.section}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">السنة الدراسية:</Label>
                                        <p className="text-lg mt-1">{selectedRequest.academicYear}</p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">المادة:</Label>
                                        <p className="text-lg mt-1">{selectedRequest.subject}</p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">الدرجة الحالية:</Label>
                                        <p className="font-bold text-2xl text-lamaSky mt-1">
                                          {selectedRequest.currentGrade}
                                        </p>
                                      </div>
                                      <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                        <Label className="text-lamaYellow font-semibold text-sm">الدرجة الجديدة:</Label>
                                        <p className="font-bold text-2xl text-statusModified mt-1">
                                          {selectedRequest.newGrade || "لم يتم التعديل"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator className="bg-lamaSky/20" />

                                  <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                    <Label className="text-lamaYellow font-semibold text-sm">الحالة:</Label>
                                    <div className="mt-2">
                                      <StatusBadge status={selectedRequest.status} />
                                    </div>
                                  </div>

                                  <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                    <Label className="text-lamaYellow font-semibold text-sm">ملاحظات المراجع:</Label>
                                    <Textarea
                                      value={selectedRequest.reviewerNotes}
                                      onChange={(e) => {
                                        setSelectedRequest({ ...selectedRequest, reviewerNotes: e.target.value })
                                        setData((prev) =>
                                          prev.map((item) =>
                                            item.id === selectedRequest.id
                                              ? { ...item, reviewerNotes: e.target.value }
                                              : item,
                                          ),
                                        )
                                      }}
                                      placeholder="أضف ملاحظاتك هنا..."
                                      className="mt-2 bg-white border-lamaSky/30 focus:border-lamaSky min-h-[100px]"
                                      rows={4}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                      <Label className="text-lamaYellow font-semibold text-sm">المراجع:</Label>
                                      <p className="text-lg mt-1">{selectedRequest.reviewer || "لم يتم التحديد"}</p>
                                    </div>
                                    <div className="bg-lamaPurpleLight/50 p-4 rounded-lg">
                                      <Label className="text-lamaYellow font-semibold text-sm">آخر تحديث:</Label>
                                      <p className="text-lg mt-1">{selectedRequest.lastUpdate}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* قسم التحليلات المحسن */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* الطالبات حسب السنة */}
          <Card className="bg-white/90 backdrop-blur-sm border-lamaSky/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-lamaSkyLight/50 to-lamaYellowLight/50">
              <CardTitle className="text-lamaYellow flex items-center gap-3">
                <div className="p-2 bg-white/80 rounded-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                الطالبات حسب السنة الدراسية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-lamaYellow border-b border-lamaSky/20 pb-3">
                  <div>السنة الدراسية</div>
                  <div className="text-center">عدد الطالبات</div>
                  <div className="text-center">عدد الطلبات</div>
                </div>
                {yearStats.map((stat, index) => (
                  <div key={stat.year} className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm py-3 hover:bg-lamaSkyLight/20 rounded-lg px-2 transition-colors duration-200">
                      <div className="font-semibold flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                            index === 0
                              ? "from-blue-400 to-blue-600"
                              : index === 1
                                ? "from-green-400 to-green-600"
                                : index === 2
                                  ? "from-yellow-400 to-yellow-600"
                                  : "from-purple-400 to-purple-600"
                          }`}
                        ></div>
                        {stat.year}
                      </div>
                      <div className="text-center font-bold text-lamaSky text-lg">{stat.studentCount}</div>
                      <div className="text-center font-bold text-lamaYellow text-lg">{stat.requestCount}</div>
                    </div>
                    <ProgressIndicator
                      label={`تقدم ${stat.year}`}
                      value={stat.requestCount}
                      total={Math.max(...yearStats.map((s) => s.requestCount))}
                      color="lamaSky"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* المقررات حسب الحالة */}
          <Card className="bg-white/90 backdrop-blur-sm border-lamaSky/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-lamaSkyLight/50 to-lamaYellowLight/50">
              <CardTitle className="text-lamaYellow flex items-center gap-3">
                <div className="p-2 bg-white/80 rounded-lg">
                  <ClipboardList className="h-5 w-5" />
                </div>
                الطلبات حسب الحالة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-lamaYellow border-b border-lamaSky/20 pb-3">
                  <div>الحالة</div>
                  <div className="text-center">العدد</div>
                  <div className="text-center">النسبة</div>
                </div>
                {statusStats.map((stat) => (
                  <div key={stat.status} className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm py-3 hover:bg-lamaSkyLight/20 rounded-lg px-2 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={stat.status} />
                      </div>
                      <div className="text-center font-bold text-lamaSky text-lg">{stat.count}</div>
                      <div className="text-center font-bold text-lamaYellow text-lg">{stat.percentage}%</div>
                    </div>
                    <ProgressIndicator label={stat.status} value={stat.count} total={data.length} color="lamaYellow" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* زر طباعة التقرير المحسن */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-lamaSky/10 via-transparent to-lamaYellow/10 rounded-3xl p-8">
            <Button className="bg-gradient-to-r from-lamaSky to-lamaYellow hover:from-lamaYellow hover:to-lamaSky text-white px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
              <FileText className="ml-3 h-6 w-6" />
              طباعة التقرير الشامل
            </Button>
            <p className="text-sm text-lamaSky/70 mt-4">
              سيتم إنشاء تقرير PDF شامل يحتوي على جميع البيانات والإحصائيات
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

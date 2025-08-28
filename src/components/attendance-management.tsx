"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Filter,
    Calendar as CalendarIcon,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
    Download,
    Upload,
    AlertCircle,
    UserCheck,
    TrendingUp,
    TrendingDown,
    Home,
    ChevronLeft,
    BookOpen,
    GraduationCap,
    CalendarDays,
    FileText,
    Settings,
    Bell,
    RefreshCw,
    Save,
    X,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    FilterIcon,
    MoreHorizontal,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Printer,
    Mail,
    MessageSquare,
    Phone,
    MapPin,
    Clock3,
    CalendarRange,
    Target,
    Award,
    Star,
    Heart,
    Zap,
    Shield,
    Lock,
    Unlock,
    EyeOff,
    UserPlus,
    UserMinus,
    UserSearch,
    UserX,
    UserCheck2,
    UserCog
} from "lucide-react"

// أنواع البيانات
interface Student {
    id: string
    fullName: string
    studentPhoto?: string
    studyLevel?: string
    specialization?: string
    academicYear?: string
    studentStatus?: string
}

interface AttendanceRecord {
    id: string
    studentId: string
    date: string
    status: "حاضر" | "غائب" | "متأخر" | "إجازة"
    time: string
    notes?: string
    markedBy: string
    markedAt: string
}

interface Class {
    id: string
    name: string
    grade: string
    teacher: string
    studentCount: number
}

interface Subject {
    id: string
    name: string
    academicYear?: string
    teachers: Array<{
        id: string
        name: string
    }>
}

// بيانات تجريبية للفصول (يمكن تحديثها لاحقاً)
const mockClasses: Class[] = [
    { id: "FIRST_YEAR", name: "السنة الأولى", grade: "أولى", teacher: "أ. فاطمة أحمد", studentCount: 25 },
    { id: "SECOND_YEAR", name: "السنة الثانية", grade: "ثانية", teacher: "أ. محمد علي", studentCount: 23 },
    { id: "THIRD_YEAR", name: "السنة الثالثة", grade: "ثالثة", teacher: "أ. أحمد محمد", studentCount: 28 },
    { id: "GRADUATION", name: "سنة التخرج", grade: "تخرج", teacher: "أ. خديجة علي", studentCount: 26 }
]

export function AttendanceManagement() {
    // الحالة
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [allSubjects, setAllSubjects] = useState<Subject[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("الكل")
    const [isMarkingAttendance, setIsMarkingAttendance] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
    const [bulkStatus, setBulkStatus] = useState<"حاضر" | "غائب" | "متأخر" | "إجازة">("حاضر")
    const [loading, setLoading] = useState(false)

    // جلب الطلاب والمواد عند تحميل المكون
    useEffect(() => {
        fetchStudents()
        fetchSubjects()
    }, [])

    // جلب الطلاب من قاعدة البيانات
    const fetchStudents = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/students')
            if (response.ok) {
                const students = await response.json()
                setAllStudents(students || [])
            }
        } catch (error) {
            console.error('خطأ في جلب الطلاب:', error)
            setAllStudents([])
        } finally {
            setLoading(false)
        }
    }

    // جلب المواد من قاعدة البيانات
    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            if (response.ok) {
                const subjects = await response.json()
                setAllSubjects(subjects || [])
            }
        } catch (error) {
            console.error('خطأ في جلب المواد:', error)
            setAllSubjects([])
        }
    }

    // تحديث الطلاب عند تغيير الفصل
    useEffect(() => {
        if (selectedClass) {
            const classStudents = allStudents.filter(student =>
                student.studyLevel === selectedClass
            )
            setFilteredStudents(classStudents)
        } else {
            setFilteredStudents([])
        }
    }, [selectedClass, allStudents])

    // تحديث سجلات الحضور
    useEffect(() => {
        const records = filteredStudents.map(student => ({
            id: `${student.id}-${selectedDate.toISOString().split('T')[0]}`,
            studentId: student.id,
            date: selectedDate.toISOString().split('T')[0],
            status: "حاضر" as const,
            time: "08:00",
            notes: "",
            markedBy: "أ. المعلم",
            markedAt: new Date().toISOString()
        }))
        setAttendanceRecords(records)
    }, [filteredStudents, selectedDate])

    // تحديث حالة الحضور
    const updateAttendanceStatus = (studentId: string, status: "حاضر" | "غائب" | "متأخر" | "إجازة") => {
        setAttendanceRecords(prev =>
            prev.map(record =>
                record.studentId === studentId
                    ? { ...record, status, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }
                    : record
            )
        )
    }

    // تحديث جماعي للحضور
    const updateBulkAttendance = () => {
        setAttendanceRecords(prev =>
            prev.map(record =>
                selectedStudents.has(record.studentId)
                    ? { ...record, status: bulkStatus, time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }
                    : record
            )
        )
        setSelectedStudents(new Set())
    }

    // حفظ سجلات الحضور
    const saveAttendance = async () => {
        try {
            setLoading(true)

            // تحويل البيانات إلى التنسيق المطلوب لقاعدة البيانات
            const attendanceData = attendanceRecords.map(record => ({
                studentId: record.studentId,
                lessonId: parseInt(selectedSubject),
                present: record.status === "حاضر",
                date: record.date
            }))

            // حفظ كل سجل حضور
            for (const record of attendanceData) {
                await fetch('/api/attendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(record)
                })
            }

            console.log("تم حفظ سجلات الحضور بنجاح")
            setIsMarkingAttendance(false)

            // إعادة تحميل البيانات
            fetchStudents()
        } catch (error) {
            console.error('خطأ في حفظ الحضور:', error)
        } finally {
            setLoading(false)
        }
    }

    // تصدير البيانات
    const exportAttendance = () => {
        const data = attendanceRecords.map(record => {
            const student = filteredStudents.find(s => s.id === record.studentId)
            return {
                "اسم الطالب": student?.fullName || "",
                "المستوى": student?.studyLevel || "",
                "التاريخ": record.date,
                "الحالة": record.status,
                "الوقت": record.time,
                "الملاحظات": record.notes || ""
            }
        })

        const csv = [
            Object.keys(data[0]).join(","),
            ...data.map(row => Object.values(row).join(","))
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `attendance-${selectedDate.toISOString().split('T')[0]}.csv`
        link.click()
    }

    // إحصائيات الحضور
    const getAttendanceStats = () => {
        const total = attendanceRecords.length
        const present = attendanceRecords.filter(r => r.status === "حاضر").length
        const absent = attendanceRecords.filter(r => r.status === "غائب").length
        const late = attendanceRecords.filter(r => r.status === "متأخر").length
        const leave = attendanceRecords.filter(r => r.status === "إجازة").length

        return { total, present, absent, late, leave }
    }

    const stats = getAttendanceStats()

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-white to-lama-sky-light">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-lama-yellow via-lama-sky to-lama-yellow-light opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-16">
                    <nav className="flex items-center gap-3 text-sm text-white/90 mb-8" dir="rtl">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <Home className="h-4 w-4" />
                            <span>الرئيسية</span>
                        </div>
                        <ChevronLeft className="h-4 w-4" />
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <Users className="h-4 w-4" />
                            <span>إدارة الطلاب</span>
                        </div>
                        <ChevronLeft className="h-4 w-4" />
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 font-medium">
                            <UserCheck className="h-4 w-4" />
                            <span>إدارة الحضور والغياب</span>
                        </div>
                    </nav>

                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                                    <UserCheck className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">إدارة الحضور والغياب</h1>
                                    <p className="text-white/90 text-xl font-medium">تتبع وإدارة حضور الطلاب بشكل احترافي</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center min-w-[120px] border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <Users className="h-6 w-6 text-white mr-2" />
                                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                                </div>
                                <div className="text-white/80 text-sm font-medium">إجمالي الطلاب</div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center min-w-[120px] border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <CheckCircle className="h-6 w-6 text-green-300 mr-2" />
                                    <div className="text-3xl font-bold text-white">{stats.present}</div>
                                </div>
                                <div className="text-white/80 text-sm font-medium">حاضرون</div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 text-center min-w-[120px] border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <XCircle className="h-6 w-6 text-red-300 mr-2" />
                                    <div className="text-3xl font-bold text-white">{stats.absent}</div>
                                </div>
                                <div className="text-white/80 text-sm font-medium">غائبون</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* أدوات التحكم */}
                <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl mb-8">
                    <CardHeader className="bg-gradient-to-r from-lama-sky/20 via-lama-purple/30 to-lama-yellow-light/20 border-b border-lama-sky/20">
                        <CardTitle className="flex items-center gap-4 text-2xl text-lama-yellow">
                            <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-3 rounded-2xl shadow-lg">
                                <Settings className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">أدوات التحكم</div>
                                <div className="text-sm text-gray-600 font-normal mt-1">اختر الفصل والتاريخ والمادة</div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* اختيار الفصل */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-800">المستوى الدراسي</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                                        <SelectValue placeholder="اختر المستوى" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockClasses.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} - {cls.teacher}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* اختيار التاريخ */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-800">التاريخ</Label>
                                <Input
                                    type="date"
                                    value={selectedDate.toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
                            </div>

                            {/* اختيار المادة */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-800">المادة الدراسية</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger className="h-14 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                                        <SelectValue placeholder="اختر المادة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(allSubjects || []).map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name} - {subject.teachers[0]?.name || 'غير محدد'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* أزرار الإجراءات */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-800">الإجراءات</Label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setIsMarkingAttendance(true)}
                                        disabled={!selectedClass || !selectedSubject}
                                        className="flex-1 h-14 bg-gradient-to-r from-lama-yellow to-lama-sky hover:from-lama-yellow/90 hover:to-lama-sky/90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <UserCheck className="h-5 w-5 ml-2" />
                                        تسجيل الحضور
                                    </Button>
                                    <Button
                                        onClick={exportAttendance}
                                        disabled={attendanceRecords.length === 0}
                                        variant="outline"
                                        className="h-14 border-2 border-lama-sky/30 text-lama-sky hover:bg-lama-sky hover:text-white rounded-xl transition-all duration-300"
                                    >
                                        <DownloadIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* رسالة التحميل */}
                {loading && (
                    <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl mb-8">
                        <CardContent className="p-16 text-center">
                            <div className="bg-gradient-to-br from-lama-purple/20 to-lama-sky/20 rounded-3xl p-12">
                                <RefreshCw className="h-24 w-24 mx-auto mb-6 text-lama-yellow animate-spin" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">جاري التحميل...</h3>
                                <p className="text-gray-600 text-lg">يرجى الانتظار بينما يتم جلب البيانات</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* جدول الحضور */}
                {selectedClass && selectedSubject && !loading && (
                    <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-lama-purple/20 via-lama-sky/20 to-lama-yellow/20 border-b border-lama-sky/20">
                            <CardTitle className="flex items-center justify-between text-2xl text-lama-yellow">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-lama-yellow to-lama-sky p-3 rounded-2xl shadow-lg">
                                        <UserCheck className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">سجل الحضور</div>
                                        <div className="text-sm text-gray-600 font-normal mt-1">
                                            {mockClasses.find(c => c.id === selectedClass)?.name} - {allSubjects.find(s => s.id === selectedSubject)?.name} - {selectedDate.toLocaleDateString('ar-SA')}
                                        </div>
                                    </div>
                                </div>

                                {isMarkingAttendance && (
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={saveAttendance}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-6 py-3 transition-all duration-300"
                                        >
                                            <Save className="h-5 w-5 ml-2" />
                                            حفظ
                                        </Button>
                                        <Button
                                            onClick={() => setIsMarkingAttendance(false)}
                                            variant="outline"
                                            className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl px-6 py-3 transition-all duration-300"
                                        >
                                            <X className="h-5 w-5 ml-2" />
                                            إلغاء
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* أدوات البحث والفلترة */}
                            <div className="p-6 border-b border-lama-sky/20">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lama-yellow" />
                                        <Input
                                            placeholder="البحث في الطلاب..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pr-12 h-12 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                                        />
                                    </div>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-48 h-12 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                                            <FilterIcon className="h-5 w-5 ml-2 text-lama-yellow" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="الكل">جميع الحالات</SelectItem>
                                            <SelectItem value="حاضر">حاضر</SelectItem>
                                            <SelectItem value="غائب">غائب</SelectItem>
                                            <SelectItem value="متأخر">متأخر</SelectItem>
                                            <SelectItem value="إجازة">إجازة</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {isMarkingAttendance && (
                                        <div className="flex gap-2">
                                            <Select value={bulkStatus} onValueChange={(value: any) => setBulkStatus(value)}>
                                                <SelectTrigger className="w-32 h-12 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="حاضر">حاضر</SelectItem>
                                                    <SelectItem value="غائب">غائب</SelectItem>
                                                    <SelectItem value="متأخر">متأخر</SelectItem>
                                                    <SelectItem value="إجازة">إجازة</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                onClick={updateBulkAttendance}
                                                disabled={selectedStudents.size === 0}
                                                className="h-12 bg-lama-sky hover:bg-lama-sky/90 text-white font-bold rounded-xl px-4 transition-all duration-300"
                                            >
                                                تطبيق على المحدد
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* جدول الطلاب */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-lama-purple/30 to-lama-sky/30 hover:from-lama-purple/40 hover:to-lama-sky/40 border-b-2 border-lama-sky/20">
                                            {isMarkingAttendance && (
                                                <TableHead className="text-center font-bold text-lama-yellow text-base py-6">
                                                    <Checkbox
                                                        checked={selectedStudents.size === filteredStudents.length}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
                                                            } else {
                                                                setSelectedStudents(new Set())
                                                            }
                                                        }}
                                                        className="w-5 h-5"
                                                    />
                                                </TableHead>
                                            )}
                                            <TableHead className="text-right font-bold text-lama-yellow text-base py-6">معلومات الطالب</TableHead>
                                            <TableHead className="text-right font-bold text-lama-yellow text-base py-6">المستوى</TableHead>
                                            <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الحالة</TableHead>
                                            <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الوقت</TableHead>
                                            <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الملاحظات</TableHead>
                                            {isMarkingAttendance && (
                                                <TableHead className="text-right font-bold text-lama-yellow text-base py-6">الإجراءات</TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents
                                            .filter(student =>
                                                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                                (statusFilter === "الكل" ||
                                                    attendanceRecords.find(r => r.studentId === student.id)?.status === statusFilter)
                                            )
                                            .map((student, index) => {
                                                const attendance = attendanceRecords.find(r => r.studentId === student.id)
                                                return (
                                                    <TableRow
                                                        key={student.id}
                                                        className={`hover:bg-gradient-to-r hover:from-lama-purple/20 hover:to-lama-sky/20 transition-all duration-300 border-b border-lama-sky/10 ${index % 2 === 0 ? "bg-white/80" : "bg-lama-purple/5"
                                                            }`}
                                                    >
                                                        {isMarkingAttendance && (
                                                            <TableCell className="text-center py-6">
                                                                <Checkbox
                                                                    checked={selectedStudents.has(student.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            setSelectedStudents(prev => new Set(Array.from(prev).concat(student.id)))
                                                                        } else {
                                                                            setSelectedStudents(prev => {
                                                                                const newSet = new Set(prev)
                                                                                newSet.delete(student.id)
                                                                                return newSet
                                                                            })
                                                                        }
                                                                    }}
                                                                    className="w-5 h-5"
                                                                />
                                                            </TableCell>
                                                        )}

                                                        <TableCell className="py-6">
                                                            <div className="flex items-center gap-4">
                                                                <Image
                                                                    src={student.studentPhoto || "/noAvatar.png"}
                                                                    alt={student.fullName}
                                                                    width={48}
                                                                    height={48}
                                                                    className="h-12 w-12 rounded-full border-2 border-lama-sky/30"
                                                                />
                                                                <div>
                                                                    <p className="font-bold text-gray-800 mb-1">{student.fullName}</p>
                                                                    <p className="text-sm text-gray-600">{student.specialization || 'غير محدد'}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="py-6">
                                                            <Badge className="bg-lama-sky/20 text-lama-sky px-3 py-1 rounded-lg">
                                                                {mockClasses.find(c => c.id === student.studyLevel)?.name || student.studyLevel || 'غير محدد'}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell className="py-6">
                                                            {isMarkingAttendance ? (
                                                                <Select
                                                                    value={attendance?.status || "حاضر"}
                                                                    onValueChange={(value: any) => updateAttendanceStatus(student.id, value)}
                                                                >
                                                                    <SelectTrigger className="w-32 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-300">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="حاضر">
                                                                            <div className="flex items-center gap-2">
                                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                حاضر
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="غائب">
                                                                            <div className="flex items-center gap-2">
                                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                                                غائب
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="متأخر">
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-yellow-600" />
                                                                                متأخر
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="إجازة">
                                                                            <div className="flex items-center gap-2">
                                                                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                                                                إجازة
                                                                            </div>
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Badge
                                                                    variant={attendance?.status === "حاضر" ? "default" : "secondary"}
                                                                    className={`px-4 py-2 text-sm font-semibold rounded-xl ${attendance?.status === "حاضر"
                                                                        ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                                                        : attendance?.status === "غائب"
                                                                            ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                                                                            : attendance?.status === "متأخر"
                                                                                ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                                                                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                                                                        }`}
                                                                >
                                                                    {attendance?.status === "حاضر" ? (
                                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                                    ) : attendance?.status === "غائب" ? (
                                                                        <XCircle className="h-4 w-4 mr-1" />
                                                                    ) : attendance?.status === "متأخر" ? (
                                                                        <Clock className="h-4 w-4 mr-1" />
                                                                    ) : (
                                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    {attendance?.status}
                                                                </Badge>
                                                            )}
                                                        </TableCell>

                                                        <TableCell className="py-6">
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <Clock className="h-4 w-4 text-lama-yellow" />
                                                                {attendance?.time || "08:00"}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="py-6">
                                                            {isMarkingAttendance ? (
                                                                <Input
                                                                    placeholder="ملاحظات..."
                                                                    value={attendance?.notes || ""}
                                                                    onChange={(e) => {
                                                                        setAttendanceRecords(prev =>
                                                                            prev.map(record =>
                                                                                record.studentId === student.id
                                                                                    ? { ...record, notes: e.target.value }
                                                                                    : record
                                                                            )
                                                                        )
                                                                    }}
                                                                    className="w-32 border-2 border-lama-sky/30 focus:border-lama-yellow focus:ring-4 focus:ring-lama-yellow/20 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
                                                                />
                                                            ) : (
                                                                <span className="text-sm text-gray-600">
                                                                    {attendance?.notes || "لا توجد ملاحظات"}
                                                                </span>
                                                            )}
                                                        </TableCell>

                                                        {isMarkingAttendance && (
                                                            <TableCell className="py-6">
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => updateAttendanceStatus(student.id, "حاضر")}
                                                                        className="text-green-600 hover:text-white hover:bg-green-600 rounded-lg p-2 transition-all duration-300"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => updateAttendanceStatus(student.id, "غائب")}
                                                                        className="text-red-600 hover:text-white hover:bg-red-600 rounded-lg p-2 transition-all duration-300"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => updateAttendanceStatus(student.id, "متأخر")}
                                                                        className="text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-lg p-2 transition-all duration-300"
                                                                    >
                                                                        <Clock className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* رسالة عند عدم اختيار الفصل أو المادة */}
                {(!selectedClass || !selectedSubject) && !loading && (
                    <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-xl">
                        <CardContent className="p-16 text-center">
                            <div className="bg-gradient-to-br from-lama-purple/20 to-lama-sky/20 rounded-3xl p-12">
                                <UserCheck className="h-24 w-24 mx-auto mb-6 text-lama-yellow opacity-50" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">اختر المستوى والمادة أولاً</h3>
                                <p className="text-gray-600 text-lg mb-8">
                                    لبدء تسجيل الحضور، يرجى اختيار المستوى الدراسي والمادة والتاريخ
                                </p>
                                <div className="flex items-center justify-center gap-4 text-lama-yellow">
                                    <BookOpen className="h-6 w-6" />
                                    <span className="text-lg font-medium">اختر المستوى</span>
                                    <ChevronRight className="h-6 w-6" />
                                    <GraduationCap className="h-6 w-6" />
                                    <span className="text-lg font-medium">اختر المادة</span>
                                    <ChevronRight className="h-6 w-6" />
                                    <CalendarDays className="h-6 w-6" />
                                    <span className="text-lg font-medium">اختر التاريخ</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

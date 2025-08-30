"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Calculator,
    Upload,
    Download,
    FileSpreadsheet,
    Users,
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Filter,
    Save,
    Eye,
    Settings
} from "lucide-react"
import {
    getGradeDistribution,
    validateGrade,
    calculateTotals,
    calculateFinalResult,
    getStudentRestrictions,
    type StudyLevel,
    type StudySystem,
    type EvaluationPeriod,
    type GradeDistribution
} from "@/lib/grade-distributions"
import ThirdPeriodManagerFixed from "./ThirdPeriodManagerFixed"

interface Student {
    id: string
    studentNumber: string
    studentName: string
    academicYear: string
    educationLevel: StudyLevel
    studySystem: StudySystem
    specialization: string
    isDiploma: boolean
    grades: {
        [period: string]: {
            month1?: number | null
            month2?: number | null
            month3?: number | null
            periodExam?: number | null
            workTotal?: number
            periodTotal?: number
        }
    }
}

interface Subject {
    id: number
    name: string
}

interface AcademicYear {
    id: string
    name: string
}

export default function EnhancedGradesManager() {
    // حالات الفلاتر الأساسية
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedLevel, setSelectedLevel] = useState<StudyLevel | "">("")
    const [selectedSystem, setSelectedSystem] = useState<StudySystem | "">("")
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | "">("")

    // حالات البيانات
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])

    // حالات التحكم
    const [isFormEnabled, setIsFormEnabled] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    // حالات استيراد Excel
    const [importMode, setImportMode] = useState(false)
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [importResults, setImportResults] = useState<{
        success: number
        errors: string[]
        warnings: string[]
    } | null>(null)

    // تحميل البيانات الأولية
    useEffect(() => {
        loadInitialData()
    }, [])

    // التحقق من إمكانية تفعيل النموذج
    useEffect(() => {
        const canEnable = Boolean(
            selectedYear &&
            selectedLevel &&
            selectedSystem &&
            selectedSubject &&
            (selectedPeriod || (selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة"))
        )
        setIsFormEnabled(canEnable)

        if (canEnable) {
            validateFiltersAndLoadStudents()
        }
    }, [selectedYear, selectedLevel, selectedSystem, selectedSubject, selectedPeriod])

    const loadInitialData = async () => {
        try {
            setLoading(true)

            // تحميل المواد
            const subjectsData = await loadSubjects()
            setSubjects(subjectsData)

            // تحميل السنوات الدراسية
            const yearsRes = await fetch("/api/academic-years")
            if (yearsRes.ok) {
                const yearsData = await yearsRes.json()
                setAcademicYears(yearsData.academicYears || [])
            }
        } catch (error) {
            console.error("خطأ في تحميل البيانات:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadSubjects = async (): Promise<Subject[]> => {
        // يمكن تحميلها من API أو استخدام البيانات الثابتة
        return [
            { id: 1, name: "القـرآن وأحكامه" },
            { id: 2, name: "السيرة" },
            { id: 3, name: "التفسير" },
            { id: 4, name: "علوم الحديث" },
            { id: 5, name: "الفقة" },
            { id: 6, name: "العقيدة" },
            { id: 7, name: "الدراسات الأدبية" },
            { id: 8, name: "الدراسات اللغوية" },
            { id: 9, name: "أصول الفقه" },
            { id: 10, name: "منهج الدعوة" },
            { id: 11, name: "اللغة الإنجليزية" },
            { id: 12, name: "الحاسوب" }
        ]
    }

    const validateFiltersAndLoadStudents = async () => {
        const errors: string[] = []

        if (!selectedYear) errors.push("يجب اختيار العام الدراسي")
        if (!selectedLevel) errors.push("يجب اختيار المرحلة التعليمية")
        if (!selectedSystem) errors.push("يجب اختيار نظام الدراسة")
        if (!selectedSubject) errors.push("يجب اختيار المادة")

        // التحقق من منطق الانتساب
        if (selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة") {
            if (selectedPeriod && selectedPeriod !== "الفترة الثالثة") {
                errors.push("المنتسبات (غير الثالثة) لهن فترة ثالثة فقط")
            }
        }

        setValidationErrors(errors)

        if (errors.length === 0) {
            await loadStudents()
        }
    }

    const loadStudents = async () => {
        if (!isFormEnabled) return

        try {
            setLoading(true)
            const params = new URLSearchParams({
                academicYear: selectedYear,
                educationLevel: selectedLevel as string,
                studySystem: selectedSystem as string,
                subject: selectedSubject?.name || "",
                period: selectedPeriod as string
            })

            const res = await fetch(`/api/students/filtered?${params}`)
            if (res.ok) {
                const data = await res.json()
                console.log("✅ تم استلام البيانات:", data)
                setStudents(data.students || [])
            } else {
                console.error("❌ خطأ في الاستعلام:", res.status, await res.text())
            }
        } catch (error) {
            console.error("خطأ في تحميل الطلاب:", error)
        } finally {
            setLoading(false)
        }
    }

    const getGradeDistributionForSelected = (): GradeDistribution | null => {
        if (!selectedSubject || !selectedLevel) return null
        return getGradeDistribution(selectedSubject.name, selectedLevel as string)
    }

    const getStudentRestrictionsForSelected = (student: Student) => {
        return getStudentRestrictions(
            student.educationLevel,
            student.studySystem,
            student.isDiploma
        )
    }

    const handleGradeChange = (
        studentId: string,
        field: 'month1' | 'month2' | 'month3' | 'periodExam',
        value: string
    ) => {
        const numValue = value === "" ? null : parseFloat(value)
        const distribution = getGradeDistributionForSelected()

        if (!distribution) return

        // التحقق من صحة الدرجة
        if (numValue !== null) {
            let maxGrade: number
            switch (field) {
                case 'month1':
                case 'month2':
                case 'month3':
                    maxGrade = distribution.monthlyGrade
                    break
                case 'periodExam':
                    maxGrade = distribution.periodExam
                    break
                default:
                    return
            }

            const validation = validateGrade(numValue, maxGrade, field === 'periodExam' ? 'exam' : 'monthly')
            if (!validation.isValid) {
                alert(validation.error)
                return
            }
        }

        // تحديث الطالب
        setStudents(prev => prev.map(student => {
            if (student.id === studentId) {
                const currentPeriod = selectedPeriod as string || "الفترة الأولى"
                const updatedGrades = {
                    ...student.grades,
                    [currentPeriod]: {
                        ...student.grades[currentPeriod],
                        [field]: numValue
                    }
                }

                // إعادة حساب المجاميع
                const periodGrades = updatedGrades[currentPeriod]
                const totals = calculateTotals(
                    periodGrades.month1 || null,
                    periodGrades.month2 || null,
                    periodGrades.month3 || null,
                    periodGrades.periodExam || null,
                    distribution
                )

                updatedGrades[currentPeriod] = {
                    ...periodGrades,
                    workTotal: totals.workTotal,
                    periodTotal: totals.periodTotal
                }

                return {
                    ...student,
                    grades: updatedGrades
                }
            }
            return student
        }))
    }

    const handleSaveGrades = async () => {
        try {
            setSaveStatus('saving')

            // تحضير بيانات الحفظ
            const gradesData = students.map(student => {
                const currentPeriod = selectedPeriod as string || "الفترة الأولى"
                const periodGrades = student.grades[currentPeriod] || {}

                return {
                    studentId: student.id,
                    subjectName: selectedSubject?.name,
                    academicYear: selectedYear,
                    period: selectedPeriod,
                    month1: periodGrades.month1,
                    month2: periodGrades.month2,
                    month3: periodGrades.month3,
                    periodExam: periodGrades.periodExam,
                    workTotal: periodGrades.workTotal,
                    periodTotal: periodGrades.periodTotal
                }
            })

            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grades: gradesData })
            })

            if (response.ok) {
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 3000)
            } else {
                setSaveStatus('error')
            }
        } catch (error) {
            console.error('خطأ في حفظ الدرجات:', error)
            setSaveStatus('error')
        }
    }

    const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setExcelFile(file)
        }
    }

    const importExcelData = async () => {
        if (!excelFile || !selectedSubject) return

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("file", excelFile)
            formData.append("subjectId", selectedSubject.id.toString())
            formData.append("academicYear", selectedYear)
            formData.append("educationLevel", selectedLevel as string)
            formData.append("studySystem", selectedSystem as string)
            formData.append("period", selectedPeriod as string)

            const res = await fetch("/api/grades/import-excel", {
                method: "POST",
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                setImportResults(data)
                if (data.success > 0) {
                    await loadStudents() // إعادة تحميل البيانات
                }
            }
        } catch (error) {
            console.error("خطأ في استيراد البيانات:", error)
        } finally {
            setLoading(false)
        }
    }

    const distribution = getGradeDistributionForSelected()

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* العنوان الرئيسي */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-4 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-2xl shadow-lg">
                            <Calculator className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold gradient-text font-tajawal">
                            نظام إدارة الدرجات المتقدم
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-cairo">
                        نظام شامل ومتطور لإدارة وإدخال درجات الطلاب مع دعم جميع المراحل التعليمية وأنظمة الدراسة المختلفة
                    </p>
                </div>

                {/* بطاقة إعدادات الفلاتر */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Filter className="w-6 h-6" />
                            إعدادات الفلاتر والمعايير
                        </CardTitle>
                        <CardDescription className="text-lama-purple-light">
                            حدد المعايير المطلوبة لإدارة درجات الطلاب
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* العام الدراسي */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    العام الدراسي
                                </Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="modern-input">
                                        <SelectValue placeholder="اختر العام الدراسي" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((year) => (
                                            <SelectItem key={year.id} value={year.name}>
                                                {year.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* المرحلة التعليمية */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    المرحلة التعليمية
                                </Label>
                                <Select value={selectedLevel} onValueChange={(value: StudyLevel) => setSelectedLevel(value)}>
                                    <SelectTrigger className="modern-input">
                                        <SelectValue placeholder="اختر المرحلة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="السنة الأولى">السنة الأولى</SelectItem>
                                        <SelectItem value="السنة الثانية">السنة الثانية</SelectItem>
                                        <SelectItem value="السنة الثالثة">السنة الثالثة</SelectItem>
                                        <SelectItem value="التخرج">التخرج</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* نظام الدراسة */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    نظام الدراسة
                                </Label>
                                <Select value={selectedSystem} onValueChange={(value: StudySystem) => setSelectedSystem(value)}>
                                    <SelectTrigger className="modern-input">
                                        <SelectValue placeholder="اختر النظام" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="نظامي">نظامي</SelectItem>
                                        <SelectItem value="انتساب">انتساب</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* المادة الدراسية */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    المادة الدراسية
                                </Label>
                                <Select
                                    value={selectedSubject?.id.toString() || ""}
                                    onValueChange={(value: string) => {
                                        const subject = subjects.find(s => s.id.toString() === value)
                                        setSelectedSubject(subject || null)
                                    }}
                                >
                                    <SelectTrigger className="modern-input">
                                        <SelectValue placeholder="اختر المادة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* فترة التقييم */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-lama-yellow flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    فترة التقييم
                                </Label>
                                <Select
                                    value={selectedPeriod}
                                    onValueChange={(value: EvaluationPeriod) => setSelectedPeriod(value)}
                                    disabled={selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة"}
                                >
                                    <SelectTrigger className="modern-input">
                                        <SelectValue placeholder="اختر الفترة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="الفترة الأولى">الفترة الأولى</SelectItem>
                                        <SelectItem value="الفترة الثانية">الفترة الثانية</SelectItem>
                                        <SelectItem value="الفترة الثالثة">الفترة الثالثة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* زر تطبيق الفلاتر */}
                            <div className="flex items-end">
                                <Button
                                    onClick={validateFiltersAndLoadStudents}
                                    disabled={!selectedYear || !selectedLevel || !selectedSystem || !selectedSubject || loading}
                                    className="w-full modern-button h-12 text-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            جاري التحميل...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-5 h-5" />
                                            تطبيق الفلاتر
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* عرض أخطاء التحقق */}
                        {validationErrors.length > 0 && (
                            <Alert className="mt-6 border-red-300 bg-red-50 rounded-2xl">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* عرض توزيع الدرجات */}
                {selectedSubject && distribution && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-lama-yellow to-lama-sky text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Eye className="w-6 h-6" />
                                توزيع الدرجات - {selectedSubject.name}
                            </CardTitle>
                            <CardDescription className="text-lama-purple-light">
                                التوزيع المعتمد للمرحلة: {selectedLevel}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{distribution.monthlyGrade}</div>
                                    <div className="text-sm text-green-700 font-semibold">درجة الشهر</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{distribution.monthlyAverage}</div>
                                    <div className="text-sm text-blue-700 font-semibold">متوسط الأشهر</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{distribution.periodExam}</div>
                                    <div className="text-sm text-purple-700 font-semibold">امتحان الفترة</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 hover:shadow-lg transition-all">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{distribution.twoPeriodsTotal}</div>
                                    <div className="text-sm text-orange-700 font-semibold">مجموع فترتين</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-all">
                                    <div className="text-3xl font-bold text-red-600 mb-2">{distribution.thirdPeriodTotal}</div>
                                    <div className="text-sm text-red-700 font-semibold">الفترة الثالثة</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* أقسام إدخال الدرجات */}
                <Tabs defaultValue="manual" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-white/80 shadow-xl rounded-2xl p-2">
                        <TabsTrigger
                            value="manual"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-xl text-lg py-3"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            إدخال يدوي
                        </TabsTrigger>
                        <TabsTrigger
                            value="excel"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-xl text-lg py-3"
                        >
                            <FileSpreadsheet className="w-5 h-5 mr-2" />
                            استيراد Excel
                        </TabsTrigger>
                    </TabsList>

                    {/* محتوى الإدخال اليدوي */}
                    <TabsContent value="manual" className="space-y-6">
                        {isFormEnabled && students.length > 0 ? (
                            <Card className="modern-card">
                                <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-3 text-2xl">
                                                <Users className="w-6 h-6" />
                                                قائمة الطلاب - {students.length} طالب
                                            </CardTitle>
                                            <CardDescription className="text-lama-purple-light mt-2">
                                                المادة: {selectedSubject?.name} | الفترة: {selectedPeriod}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleSaveGrades}
                                                disabled={saveStatus === 'saving'}
                                                className="bg-white text-lama-yellow hover:bg-lama-purple-light"
                                            >
                                                {saveStatus === 'saving' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-lama-yellow border-t-transparent rounded-full animate-spin" />
                                                        جاري الحفظ...
                                                    </div>
                                                ) : saveStatus === 'saved' ? (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        تم الحفظ
                                                    </div>
                                                ) : saveStatus === 'error' ? (
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="w-5 h-5" />
                                                        خطأ في الحفظ
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Save className="w-5 h-5" />
                                                        حفظ الدرجات
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {students.map((student) => {
                                            const restrictions = getStudentRestrictionsForSelected(student)
                                            const currentPeriodGrades = student.grades[selectedPeriod as string] || {}

                                            return (
                                                <div key={student.id} className="p-6 border-2 border-lama-sky-light rounded-2xl hover:shadow-xl transition-all bg-white/50 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                                {student.studentName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-bold text-gray-800">{student.studentName}</h4>
                                                                <p className="text-lama-yellow font-semibold">رقم الطالب: {student.studentNumber}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {student.educationLevel} - {student.studySystem} - {student.specialization}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Badge variant={student.isDiploma ? "destructive" : "default"} className="text-center">
                                                                {student.isDiploma ? "دبلوم" : "عادي"}
                                                            </Badge>
                                                            <Badge variant={student.studySystem === "نظامي" ? "default" : "secondary"}>
                                                                {student.studySystem}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {!restrictions.canEnterGrades ? (
                                                        <Alert className="border-orange-300 bg-orange-50 rounded-xl">
                                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                                            <AlertDescription className="text-orange-800 font-semibold">
                                                                {restrictions.restrictions.join(" • ")}
                                                            </AlertDescription>
                                                        </Alert>
                                                    ) : (
                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                            <div>
                                                                <Label className="text-sm font-semibold text-lama-yellow mb-2 block">الشهر الأول</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={currentPeriodGrades.month1 || ""}
                                                                    onChange={(e) => handleGradeChange(student.id, 'month1', e.target.value)}
                                                                    className="modern-input text-center text-lg font-bold"
                                                                    min="0"
                                                                    max={distribution?.monthlyGrade || 100}
                                                                    step="0.1"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1 text-center">
                                                                    الحد الأقصى: {distribution?.monthlyGrade}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-semibold text-lama-yellow mb-2 block">الشهر الثاني</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={currentPeriodGrades.month2 || ""}
                                                                    onChange={(e) => handleGradeChange(student.id, 'month2', e.target.value)}
                                                                    className="modern-input text-center text-lg font-bold"
                                                                    min="0"
                                                                    max={distribution?.monthlyGrade || 100}
                                                                    step="0.1"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1 text-center">
                                                                    الحد الأقصى: {distribution?.monthlyGrade}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-semibold text-lama-yellow mb-2 block">الشهر الثالث</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={currentPeriodGrades.month3 || ""}
                                                                    onChange={(e) => handleGradeChange(student.id, 'month3', e.target.value)}
                                                                    className="modern-input text-center text-lg font-bold"
                                                                    min="0"
                                                                    max={distribution?.monthlyGrade || 100}
                                                                    step="0.1"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1 text-center">
                                                                    الحد الأقصى: {distribution?.monthlyGrade}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-semibold text-lama-yellow mb-2 block">الامتحان</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={currentPeriodGrades.periodExam || ""}
                                                                    onChange={(e) => handleGradeChange(student.id, 'periodExam', e.target.value)}
                                                                    className="modern-input text-center text-lg font-bold"
                                                                    min="0"
                                                                    max={distribution?.periodExam || 100}
                                                                    step="0.1"
                                                                />
                                                                <div className="text-xs text-gray-500 mt-1 text-center">
                                                                    الحد الأقصى: {distribution?.periodExam}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-semibold text-green-600 mb-2 block">المجموع</Label>
                                                                <div className="h-12 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center">
                                                                    <span className="text-xl font-bold text-green-700">
                                                                        {currentPeriodGrades.periodTotal?.toFixed(1) || "0.0"}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-green-600 mt-1 text-center">
                                                                    أعمال + امتحان
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : isFormEnabled ? (
                            <Card className="modern-card">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-6">
                                        <Users className="w-24 h-24 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-4">لا يوجد طلاب</h3>
                                    <p className="text-lg text-gray-500">لم يتم العثور على طلاب يطابقون المعايير المحددة</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="modern-card">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-6">
                                        <Filter className="w-24 h-24 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-4">اختر الفلاتر أولاً</h3>
                                    <p className="text-lg text-gray-500">قم بتحديد جميع المعايير المطلوبة لعرض الطلاب</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* محتوى استيراد Excel */}
                    <TabsContent value="excel" className="space-y-6">
                        <Card className="modern-card">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-3xl">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Upload className="w-6 h-6" />
                                    استيراد درجات من ملف Excel
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    قم برفع ملف Excel يحتوي على درجات الطلاب مع التحقق التلقائي من صحة البيانات
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    {/* تعليمات التنسيق */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                        <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
                                            <FileSpreadsheet className="w-5 h-5" />
                                            تنسيق الملف المطلوب
                                        </h4>
                                        <ul className="text-blue-700 space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                الأعمدة المطلوبة: رقم الطالب، اسم الطالب، الشهر الأول، الشهر الثاني، الشهر الثالث، الامتحان
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                جميع الدرجات يجب أن تكون أرقام صحيحة أو عشرية بخانة واحدة
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                عدم تجاوز الحد الأقصى المسموح لكل مادة
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                تنسيق الملف: .xlsx أو .xls
                                            </li>
                                        </ul>
                                    </div>

                                    {/* منطقة رفع الملف */}
                                    <div className="border-4 border-dashed border-lama-sky-light rounded-2xl p-12 text-center hover:border-lama-sky transition-colors bg-gradient-to-br from-white to-lama-purple-light">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleExcelUpload}
                                            className="hidden"
                                            id="excel-upload"
                                        />
                                        <label htmlFor="excel-upload" className="cursor-pointer">
                                            <div className="text-lama-sky mb-6">
                                                <FileSpreadsheet className="w-20 h-20 mx-auto" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-lama-yellow mb-4">
                                                {excelFile ? excelFile.name : "اضغط لاختيار ملف Excel"}
                                            </h3>
                                            <p className="text-lg text-gray-600">
                                                {excelFile ? "تم اختيار الملف بنجاح" : "أو اسحب الملف هنا"}
                                            </p>
                                        </label>
                                    </div>

                                    {/* زر الاستيراد */}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={importExcelData}
                                            disabled={!excelFile || !isFormEnabled || loading}
                                            className="modern-button text-xl py-4 px-8"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    جاري الاستيراد...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Upload className="w-6 h-6" />
                                                    استيراد البيانات
                                                </div>
                                            )}
                                        </Button>
                                    </div>

                                    {/* نتائج الاستيراد */}
                                    {importResults && (
                                        <div className="space-y-6">
                                            <Separator className="bg-lama-sky-light" />
                                            <h4 className="text-2xl font-bold text-lama-yellow">نتائج الاستيراد</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                                                    <div className="text-4xl font-bold text-green-600 mb-2">{importResults.success}</div>
                                                    <div className="text-lg text-green-700 font-semibold">نجح الاستيراد</div>
                                                </div>

                                                {importResults.errors.length > 0 && (
                                                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                                                        <div className="text-4xl font-bold text-red-600 mb-2">{importResults.errors.length}</div>
                                                        <div className="text-lg text-red-700 font-semibold">أخطاء</div>
                                                    </div>
                                                )}

                                                {importResults.warnings.length > 0 && (
                                                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                                                        <div className="text-4xl font-bold text-yellow-600 mb-2">{importResults.warnings.length}</div>
                                                        <div className="text-lg text-yellow-700 font-semibold">تحذيرات</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* عرض الأخطاء والتحذيرات */}
                                            {importResults.errors.length > 0 && (
                                                <Alert className="border-red-300 bg-red-50 rounded-2xl">
                                                    <XCircle className="h-6 w-6 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        <h5 className="font-bold mb-3 text-lg">الأخطاء:</h5>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {importResults.errors.map((error, index) => (
                                                                <li key={index} className="text-sm">{error}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {importResults.warnings.length > 0 && (
                                                <Alert className="border-yellow-300 bg-yellow-50 rounded-2xl">
                                                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                                    <AlertDescription className="text-yellow-800">
                                                        <h5 className="font-bold mb-3 text-lg">التحذيرات:</h5>
                                                        <ul className="list-disc list-inside space-y-2">
                                                            {importResults.warnings.map((warning, index) => (
                                                                <li key={index} className="text-sm">{warning}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* بطاقة القواعد والملاحظات */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <AlertTriangle className="w-6 h-6" />
                            القواعد والملاحظات المهمة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-orange-800 text-xl">القواعد الأساسية:</h4>
                                <ul className="text-orange-700 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>يجب تحديد جميع الفلاتر قبل إدخال الدرجات</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>لا يمكن إدخال درجات أعلى من الحد المسموح للمادة</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>طالبات الدبلوم المنتسبات لا يمكن إدخال درجات لهن</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>يتم التحقق من صحة البيانات تلقائياً</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-red-800 text-xl">القيود والتحذيرات:</h4>
                                <ul className="text-red-700 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>لا يمكن إدخال درجات لنفس الطالبة مرتين في نفس الفترة</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>يجب أن تكون جميع الدرجات أرقام صحيحة أو عشرية</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>المنتسبات (غير الثالثة) لهن فترة ثالثة فقط</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>يتم الاحتفاظ بتاريخ جميع التعديلات للمراجعة</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* عرض النظام حسب الفترة المختارة */}
                {isFormEnabled && students.length > 0 && (
                    <>
                        {selectedPeriod === "الفترة الثالثة" ? (
                            <ThirdPeriodManagerFixed
                                selectedYear={selectedYear}
                                selectedLevel={selectedLevel}
                                selectedSystem={selectedSystem}
                                selectedSubject={selectedSubject}
                                students={students}
                            />
                        ) : (
                            <Card className="modern-card">
                                <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Calculator className="w-6 h-6" />
                                        إدخال درجات {selectedPeriod}
                                    </CardTitle>
                                    <CardDescription className="text-lama-purple-light">
                                        {students.length} طالب متاح لإدخال الدرجات
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <Alert className="border-blue-300 bg-blue-50 rounded-2xl mb-6">
                                        <Calculator className="h-6 w-6 text-blue-600" />
                                        <AlertDescription className="text-blue-800">
                                            <p className="font-semibold mb-2">جاري تطوير نظام إدخال الدرجات للفترتين الأولى والثانية</p>
                                            <p>حالياً متاح فقط نظام الفترة الثالثة المتطور. باقي الفترات قيد التطوير.</p>
                                        </AlertDescription>
                                    </Alert>

                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">⚙️</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">قيد التطوير</h3>
                                        <p className="text-gray-600">نظام إدخال درجات {selectedPeriod} سيكون متاحاً قريباً</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                {/* رسالة عدم وجود طلاب */}
                {isFormEnabled && students.length === 0 && (
                    <Card className="modern-card">
                        <CardContent className="p-8 text-center">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">لا يوجد طلاب</h3>
                            <p className="text-gray-600">لا يوجد طلاب مطابقون للمعايير المحددة</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

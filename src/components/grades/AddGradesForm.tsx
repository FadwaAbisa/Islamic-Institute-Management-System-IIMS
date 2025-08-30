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

interface Subject {
    id: number
    name: string
    gradeDistribution: GradeDistribution
}

interface GradeDistribution {
    monthlyGrade: number
    monthlyAverage: number
    periodExam: number
    twoPeriodsTotal: number
    thirdPeriodTotal: number
}

interface Student {
    id: string
    studentNumber: string
    studentName: string
    academicYear: string
    educationLevel: string
    studySystem: string
    specialization: string
    isDiploma: boolean
}

export function AddGradesForm() {
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("")
    const [selectedSystem, setSelectedSystem] = useState("")
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState("")
    const [isFormEnabled, setIsFormEnabled] = useState(false)
    const [validationErrors, setValidationErrors] = useState<string[]>([])

    const [subjects, setSubjects] = useState<Subject[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([])

    const [importMode, setImportMode] = useState(false)
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [importResults, setImportResults] = useState<{
        success: number
        errors: string[]
        warnings: string[]
    } | null>(null)

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        const canEnable = Boolean(selectedYear && selectedLevel && selectedSystem && selectedSubject)
        setIsFormEnabled(canEnable)

        if (selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة") {
            setSelectedPeriod("")
        }
    }, [selectedYear, selectedLevel, selectedSystem, selectedSubject])

    const loadInitialData = async () => {
        try {
            const subjectsData = await loadSubjectsWithGrades()
            setSubjects(subjectsData)

            const yearsRes = await fetch("/api/academic-years")
            if (yearsRes.ok) {
                const yearsData = await yearsRes.json()
                setAcademicYears(yearsData.academicYears || [])
            }
        } catch (error) {
            console.error("خطأ في تحميل البيانات:", error)
        }
    }

    const loadSubjectsWithGrades = async (): Promise<Subject[]> => {
        return [
            {
                id: 1,
                name: "القـرآن وأحكامه",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            },
            {
                id: 2,
                name: "السيرة",
                gradeDistribution: {
                    monthlyGrade: 12,
                    monthlyAverage: 12,
                    periodExam: 12,
                    twoPeriodsTotal: 24,
                    thirdPeriodTotal: 36
                }
            },
            {
                id: 3,
                name: "التفسير",
                gradeDistribution: {
                    monthlyGrade: 12,
                    monthlyAverage: 12,
                    periodExam: 12,
                    twoPeriodsTotal: 24,
                    thirdPeriodTotal: 36
                }
            },
            {
                id: 4,
                name: "علوم الحديث",
                gradeDistribution: {
                    monthlyGrade: 4,
                    monthlyAverage: 4,
                    periodExam: 4,
                    twoPeriodsTotal: 8,
                    thirdPeriodTotal: 12
                }
            },
            {
                id: 5,
                name: "الفقة",
                gradeDistribution: {
                    monthlyGrade: 12,
                    monthlyAverage: 12,
                    periodExam: 12,
                    twoPeriodsTotal: 24,
                    thirdPeriodTotal: 36
                }
            },
            {
                id: 6,
                name: "العقيدة",
                gradeDistribution: {
                    monthlyGrade: 12,
                    monthlyAverage: 12,
                    periodExam: 12,
                    twoPeriodsTotal: 24,
                    thirdPeriodTotal: 36
                }
            },
            {
                id: 7,
                name: "الدراسات الأدبية",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            },
            {
                id: 8,
                name: "الدراسات اللغوية",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            },
            {
                id: 9,
                name: "أصول الفقه",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            },
            {
                id: 10,
                name: "منهج الدعوة",
                gradeDistribution: {
                    monthlyGrade: 4,
                    monthlyAverage: 4,
                    periodExam: 4,
                    twoPeriodsTotal: 8,
                    thirdPeriodTotal: 12
                }
            },
            {
                id: 11,
                name: "اللغة الإنجليزية",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            },
            {
                id: 12,
                name: "الحاسوب",
                gradeDistribution: {
                    monthlyGrade: 8,
                    monthlyAverage: 8,
                    periodExam: 8,
                    twoPeriodsTotal: 16,
                    thirdPeriodTotal: 48
                }
            }
        ]
    }

    const loadStudents = async () => {
        if (!isFormEnabled) return

        try {
            const params = new URLSearchParams({
                academicYear: selectedYear,
                educationLevel: selectedLevel,
                studySystem: selectedSystem,
                subject: selectedSubject?.id.toString() || "",
                period: selectedPeriod
            })

            const res = await fetch(`/api/students/filtered?${params}`)
            if (res.ok) {
                const data = await res.json()
                setStudents(data.students || [])
            }
        } catch (error) {
            console.error("خطأ في تحميل الطلاب:", error)
        }
    }

    const handleFilterChange = (filterType: string, value: string) => {
        switch (filterType) {
            case "year":
                setSelectedYear(value)
                break
            case "level":
                setSelectedLevel(value)
                break
            case "system":
                setSelectedSystem(value)
                break
            case "subject":
                const subject = subjects.find(s => s.id.toString() === value)
                setSelectedSubject(subject || null)
                break
            case "period":
                setSelectedPeriod(value)
                break
        }
    }

    const getGradeDistribution = () => {
        if (!selectedSubject || !selectedLevel) return null

        const baseDistribution = selectedSubject.gradeDistribution

        if (selectedLevel === "السنة الثالثة") {
            return {
                monthlyGrade: baseDistribution.monthlyGrade * 0.75,
                monthlyAverage: baseDistribution.monthlyAverage * 0.75,
                periodExam: baseDistribution.periodExam * 0.75,
                twoPeriodsTotal: baseDistribution.twoPeriodsTotal * 0.75,
                thirdPeriodTotal: baseDistribution.thirdPeriodTotal
            }
        }

        return baseDistribution
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
            const formData = new FormData()
            formData.append("file", excelFile)
            formData.append("subjectId", selectedSubject.id.toString())
            formData.append("academicYear", selectedYear)
            formData.append("educationLevel", selectedLevel)
            formData.append("studySystem", selectedSystem)
            formData.append("period", selectedPeriod)

            const res = await fetch("/api/grades/import-excel", {
                method: "POST",
                body: formData
            })

            if (res.ok) {
                const data = await res.json()
                setImportResults(data)
            }
        } catch (error) {
            console.error("خطأ في استيراد البيانات:", error)
        }
    }

    const validateForm = () => {
        const errors: string[] = []

        if (!selectedYear) errors.push("يجب اختيار العام الدراسي")
        if (!selectedLevel) errors.push("يجب اختيار المرحلة التعليمية")
        if (!selectedSystem) errors.push("يجب اختيار نظام الدراسة")
        if (!selectedSubject) errors.push("يجب اختيار المادة")

        if (selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة") {
            if (selectedPeriod) {
                errors.push("الانتساب لا يحتوي على فترات أولى وثانية")
            }
        }

        setValidationErrors(errors)
        return errors.length === 0
    }

    const applyFilters = () => {
        if (validateForm()) {
            loadStudents()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            نظام إدخال الدرجات
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        نظام شامل لإدارة وإدخال درجات الطلاب مع دعم جميع المراحل التعليمية وأنظمة الدراسة
                    </p>
                </div>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            إعدادات الفلاتر
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                            اختر المعايير المطلوبة لإدخال الدرجات
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">العام الدراسي</Label>
                                <Select value={selectedYear} onValueChange={(value: string) => handleFilterChange("year", value)}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
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

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">المرحلة التعليمية</Label>
                                <Select value={selectedLevel} onValueChange={(value: string) => handleFilterChange("level", value)}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
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

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">نظام الدراسة</Label>
                                <Select value={selectedSystem} onValueChange={(value: string) => handleFilterChange("system", value)}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                                        <SelectValue placeholder="اختر النظام" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="نظامي">نظامي</SelectItem>
                                        <SelectItem value="انتساب">انتساب</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">المادة الدراسية</Label>
                                <Select value={selectedSubject?.id.toString() || ""} onValueChange={(value: string) => handleFilterChange("subject", value)}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
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

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">فترة التقييم</Label>
                                <Select
                                    value={selectedPeriod}
                                    onValueChange={(value: string) => handleFilterChange("period", value)}
                                    disabled={selectedSystem === "انتساب" && selectedLevel !== "السنة الثالثة"}
                                >
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                                        <SelectValue placeholder="اختر الفترة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="الفترة الأولى">الفترة الأولى</SelectItem>
                                        <SelectItem value="الفترة الثانية">الفترة الثانية</SelectItem>
                                        <SelectItem value="الفترة الثالثة">الفترة الثالثة</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    onClick={applyFilters}
                                    disabled={!isFormEnabled}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    تطبيق الفلاتر
                                </Button>
                            </div>
                        </div>

                        {validationErrors.length > 0 && (
                            <Alert className="mt-4 border-red-200 bg-red-50">
                                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
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

                {selectedSubject && (
                    <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                توزيع الدرجات - {selectedSubject.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(() => {
                                    const distribution = getGradeDistribution()
                                    if (!distribution) return null

                                    return (
                                        <>
                                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-200">
                                                <div className="text-2xl font-bold text-green-600">{distribution.monthlyGrade}</div>
                                                <div className="text-sm text-gray-600">درجة الشهر</div>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-200">
                                                <div className="text-2xl font-bold text-blue-600">{distribution.monthlyAverage}</div>
                                                <div className="text-sm text-gray-600">متوسط الأشهر</div>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                                                <div className="text-2xl font-bold text-purple-600">{distribution.periodExam}</div>
                                                <div className="text-sm text-gray-600">درجة الامتحان</div>
                                            </div>
                                            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                                                <div className="text-2xl font-bold text-orange-600">{distribution.thirdPeriodTotal}</div>
                                                <div className="text-sm text-gray-600">الفترة الثالثة</div>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Tabs defaultValue="manual" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg">
                        <TabsTrigger value="manual" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            إدخال يدوي
                        </TabsTrigger>
                        <TabsTrigger value="excel" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            استيراد Excel
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-6">
                        {isFormEnabled && students.length > 0 ? (
                            <Card className="shadow-lg border-0 bg-white">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        قائمة الطلاب - {students.length} طالب
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {students.map((student) => (
                                            <div key={student.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {student.studentName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{student.studentName}</h4>
                                                            <p className="text-sm text-gray-600">رقم الطالب: {student.studentNumber}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant={student.isDiploma ? "destructive" : "default"}>
                                                        {student.isDiploma ? "دبلوم" : student.studySystem}
                                                    </Badge>
                                                </div>

                                                {student.isDiploma && selectedSystem === "انتساب" ? (
                                                    <Alert className="border-orange-200 bg-orange-50">
                                                        <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <AlertDescription className="text-orange-800">
                                                            هذه الطالبة تخضع لامتحانات وزارية، لا يسمح بإدخال درجات
                                                        </AlertDescription>
                                                    </Alert>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        <div>
                                                            <Label className="text-xs text-gray-600">الشهر الأول</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                className="text-center"
                                                                min="0"
                                                                max={getGradeDistribution()?.monthlyGrade || 100}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-600">الشهر الثاني</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                className="text-center"
                                                                min="0"
                                                                max={getGradeDistribution()?.monthlyGrade || 100}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-600">الشهر الثالث</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                className="text-center"
                                                                min="0"
                                                                max={getGradeDistribution()?.monthlyGrade || 100}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-gray-600">الامتحان</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                className="text-center"
                                                                min="0"
                                                                max={getGradeDistribution()?.periodExam || 100}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : isFormEnabled ? (
                            <Card className="shadow-lg border-0 bg-white">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد طلاب</h3>
                                    <p className="text-gray-500">لم يتم العثور على طلاب يطابقون المعايير المحددة</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="shadow-lg border-0 bg-white">
                                <CardContent className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">اختر الفلاتر أولاً</h3>
                                    <p className="text-gray-500">قم بتحديد جميع المعايير المطلوبة لعرض الطلاب</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="excel" className="space-y-6">
                        <Card className="shadow-lg border-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    استيراد درجات من ملف Excel
                                </CardTitle>
                                <CardDescription className="text-green-100">
                                    قم برفع ملف Excel يحتوي على درجات الطلاب
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            تنسيق الملف المطلوب
                                        </h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• يجب أن يحتوي الملف على أعمدة: رقم الطالب، اسم الطالب، الشهر الأول، الشهر الثاني، الشهر الثالث، الامتحان</li>
                                            <li>• يجب أن تكون جميع الدرجات أرقام صحيحة</li>
                                            <li>• يجب أن لا تتجاوز الدرجات الحد الأقصى المسموح به</li>
                                            <li>• يجب أن يكون تنسيق الملف .xlsx</li>
                                        </ul>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleExcelUpload}
                                            className="hidden"
                                            id="excel-upload"
                                        />
                                        <label htmlFor="excel-upload" className="cursor-pointer">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                {excelFile ? excelFile.name : "اضغط لاختيار ملف Excel"}
                                            </h3>
                                            <p className="text-gray-500">
                                                {excelFile ? "تم اختيار الملف بنجاح" : "أو اسحب الملف هنا"}
                                            </p>
                                        </label>
                                    </div>

                                    <div className="flex justify-center">
                                        <Button
                                            onClick={importExcelData}
                                            disabled={!excelFile || !isFormEnabled}
                                            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            استيراد البيانات
                                        </Button>
                                    </div>

                                    {importResults && (
                                        <div className="space-y-4">
                                            <Separator />
                                            <h4 className="font-semibold text-gray-800">نتائج الاستيراد</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                                    <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                                                    <div className="text-sm text-green-700">نجح الاستيراد</div>
                                                </div>

                                                {importResults.errors.length > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                        <div className="text-2xl font-bold text-red-600">{importResults.errors.length}</div>
                                                        <div className="text-sm text-red-700">أخطاء</div>
                                                    </div>
                                                )}

                                                {importResults.warnings.length > 0 && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                        <div className="text-2xl font-bold text-yellow-600">{importResults.warnings.length}</div>
                                                        <div className="text-sm text-yellow-700">تحذيرات</div>
                                                    </div>
                                                )}
                                            </div>

                                            {importResults.errors.length > 0 && (
                                                <Alert className="border-red-200 bg-red-50">
                                                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <AlertDescription className="text-red-800">
                                                        <h5 className="font-semibold mb-2">الأخطاء:</h5>
                                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                                            {importResults.errors.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {importResults.warnings.length > 0 && (
                                                <Alert className="border-yellow-200 bg-yellow-50">
                                                    <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <AlertDescription className="text-yellow-800">
                                                        <h5 className="font-semibold mb-2">التحذيرات:</h5>
                                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                                            {importResults.warnings.map((warning, index) => (
                                                                <li key={index}>{warning}</li>
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

                <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-red-50">
                    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            ملاحظات مهمة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-orange-800">القواعد الأساسية:</h4>
                                <ul className="text-sm text-orange-700 space-y-1">
                                    <li>• يجب تحديد جميع الفلاتر قبل إدخال الدرجات</li>
                                    <li>• لا يمكن إدخال درجات أعلى من الحد المسموح</li>
                                    <li>• طالبات الدبلوم المنتسبات لا يمكن إدخال درجات لهن</li>
                                    <li>• يتم التحقق من صحة البيانات تلقائياً</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-red-800">القيود:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• لا يمكن إدخال درجات لنفس الطالبة مرتين</li>
                                    <li>• يجب أن تكون جميع الدرجات أرقام صحيحة</li>
                                    <li>• لا يمكن تعديل الدرجات بعد الحفظ النهائي</li>
                                    <li>• يتم الاحتفاظ بتاريخ جميع التعديلات</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

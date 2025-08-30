"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Calculator,
    Trophy,
    TrendingUp,
    Download,
    FileText,
    CheckCircle2,
    XCircle,
    AlertTriangle
} from "lucide-react"
import {
    getGradeDistribution,
    calculateFinalResult,
    type StudyLevel,
    type StudySystem
} from "@/lib/grade-distributions"

interface StudentFinalResult {
    id: string
    studentNumber: string
    studentName: string
    academicYear: string
    educationLevel: StudyLevel
    studySystem: StudySystem
    specialization: string
    isDiploma: boolean
    periods: {
        first?: {
            workTotal: number
            periodTotal: number
        }
        second?: {
            workTotal: number
            periodTotal: number
        }
        third?: {
            examGrade: number
        }
    }
    finalResult: {
        totalGrade: number
        percentage: number
        letterGrade: string
        status: 'نجح' | 'راسب' | 'غير مكتمل'
        gpa: number
    }
    subjectResults: {
        [subjectName: string]: {
            finalTotal: number
            grade: string
            status: string
        }
    }
}

interface Subject {
    id: number
    name: string
}

export default function FinalResultsCalculator() {
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedLevel, setSelectedLevel] = useState<StudyLevel | "">("")
    const [selectedSystem, setSelectedSystem] = useState<StudySystem | "">("")
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

    const [students, setStudents] = useState<StudentFinalResult[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([])

    const [loading, setLoading] = useState(false)
    const [calculating, setCalculating] = useState(false)
    const [exportMode, setExportMode] = useState<'all' | 'passed' | 'failed'>('all')

    // إحصائيات عامة
    const [statistics, setStatistics] = useState({
        totalStudents: 0,
        passedStudents: 0,
        failedStudents: 0,
        incompleteStudents: 0,
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
        gradeDistribution: {
            excellent: 0,
            veryGood: 0,
            good: 0,
            acceptable: 0,
            weak: 0,
            failed: 0
        }
    })

    useEffect(() => {
        loadInitialData()
    }, [])

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

    const calculateResults = async () => {
        if (!selectedYear || !selectedLevel || !selectedSystem) {
            alert("يجب اختيار جميع المعايير")
            return
        }

        try {
            setCalculating(true)

            // استعلام درجات جميع المواد للطلاب
            const params = new URLSearchParams({
                academicYear: selectedYear,
                educationLevel: selectedLevel as string,
                studySystem: selectedSystem as string,
                calculateFinal: "true"
            })

            const res = await fetch(`/api/grades/final-results?${params}`)
            if (!res.ok) {
                throw new Error("فشل في الحصول على النتائج")
            }

            const data = await res.json()
            if (!data.success) {
                throw new Error(data.error || "خطأ في البيانات")
            }

            // معالجة النتائج وحساب الإحصائيات
            const results = data.students.map((student: any) => processStudentResult(student))
            setStudents(results)

            // حساب الإحصائيات
            calculateStatistics(results)

        } catch (error) {
            console.error("خطأ في حساب النتائج:", error)
            alert("حدث خطأ في حساب النتائج")
        } finally {
            setCalculating(false)
        }
    }

    const processStudentResult = (studentData: any): StudentFinalResult => {
        const subjectResults: { [key: string]: any } = {}
        let totalScore = 0
        let completedSubjects = 0
        let passedSubjects = 0

        // معالجة نتائج كل مادة
        Object.keys(studentData.subjects || {}).forEach(subjectName => {
            const subjectGrades = studentData.subjects[subjectName]
            const distribution = getGradeDistribution(subjectName, studentData.educationLevel)

            if (distribution && subjectGrades) {
                const firstPeriod = subjectGrades.first?.periodTotal || 0
                const secondPeriod = subjectGrades.second?.periodTotal || 0
                const thirdPeriod = subjectGrades.third?.examGrade || 0

                const result = calculateFinalResult(
                    firstPeriod,
                    secondPeriod,
                    thirdPeriod,
                    distribution
                )

                subjectResults[subjectName] = result

                if (result.status === 'نجح' || result.status === 'راسب') {
                    totalScore += result.finalTotal
                    completedSubjects++
                    if (result.status === 'نجح') passedSubjects++
                }
            }
        })

        // حساب النتيجة النهائية العامة
        const averageScore = completedSubjects > 0 ? totalScore / completedSubjects : 0
        const percentage = (averageScore / 100) * 100

        let letterGrade = ''
        let status: 'نجح' | 'راسب' | 'غير مكتمل' = 'غير مكتمل'
        let gpa = 0

        if (completedSubjects > 0) {
            if (percentage >= 90) {
                letterGrade = 'ممتاز'
                status = passedSubjects === completedSubjects ? 'نجح' : 'راسب'
                gpa = 4.0
            } else if (percentage >= 80) {
                letterGrade = 'جيد جداً'
                status = passedSubjects === completedSubjects ? 'نجح' : 'راسب'
                gpa = 3.5
            } else if (percentage >= 70) {
                letterGrade = 'جيد'
                status = passedSubjects === completedSubjects ? 'نجح' : 'راسب'
                gpa = 3.0
            } else if (percentage >= 60) {
                letterGrade = 'مقبول'
                status = passedSubjects === completedSubjects ? 'نجح' : 'راسب'
                gpa = 2.5
            } else if (percentage >= 50) {
                letterGrade = 'ضعيف'
                status = 'راسب'
                gpa = 2.0
            } else {
                letterGrade = 'راسب'
                status = 'راسب'
                gpa = 1.0
            }
        }

        return {
            id: studentData.id,
            studentNumber: studentData.studentNumber,
            studentName: studentData.studentName,
            academicYear: studentData.academicYear,
            educationLevel: studentData.educationLevel,
            studySystem: studentData.studySystem,
            specialization: studentData.specialization,
            isDiploma: studentData.isDiploma,
            periods: studentData.periods || {},
            finalResult: {
                totalGrade: Math.round(averageScore * 10) / 10,
                percentage: Math.round(percentage * 10) / 10,
                letterGrade,
                status,
                gpa
            },
            subjectResults
        }
    }

    const calculateStatistics = (results: StudentFinalResult[]) => {
        const totalStudents = results.length
        const passedStudents = results.filter(s => s.finalResult.status === 'نجح').length
        const failedStudents = results.filter(s => s.finalResult.status === 'راسب').length
        const incompleteStudents = results.filter(s => s.finalResult.status === 'غير مكتمل').length

        const validGrades = results
            .filter(s => s.finalResult.status !== 'غير مكتمل')
            .map(s => s.finalResult.percentage)

        const averageGrade = validGrades.length > 0
            ? validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length
            : 0

        const highestGrade = validGrades.length > 0 ? Math.max(...validGrades) : 0
        const lowestGrade = validGrades.length > 0 ? Math.min(...validGrades) : 0

        // توزيع الدرجات
        const gradeDistribution = {
            excellent: results.filter(s => s.finalResult.percentage >= 90).length,
            veryGood: results.filter(s => s.finalResult.percentage >= 80 && s.finalResult.percentage < 90).length,
            good: results.filter(s => s.finalResult.percentage >= 70 && s.finalResult.percentage < 80).length,
            acceptable: results.filter(s => s.finalResult.percentage >= 60 && s.finalResult.percentage < 70).length,
            weak: results.filter(s => s.finalResult.percentage >= 50 && s.finalResult.percentage < 60).length,
            failed: results.filter(s => s.finalResult.percentage < 50).length
        }

        setStatistics({
            totalStudents,
            passedStudents,
            failedStudents,
            incompleteStudents,
            averageGrade: Math.round(averageGrade * 10) / 10,
            highestGrade: Math.round(highestGrade * 10) / 10,
            lowestGrade: Math.round(lowestGrade * 10) / 10,
            gradeDistribution
        })
    }

    const exportResults = async () => {
        try {
            let filteredStudents = students

            switch (exportMode) {
                case 'passed':
                    filteredStudents = students.filter(s => s.finalResult.status === 'نجح')
                    break
                case 'failed':
                    filteredStudents = students.filter(s => s.finalResult.status === 'راسب')
                    break
                default:
                    filteredStudents = students
            }

            const params = new URLSearchParams({
                academicYear: selectedYear,
                educationLevel: selectedLevel as string,
                studySystem: selectedSystem as string,
                exportMode,
                studentIds: filteredStudents.map(s => s.id).join(',')
            })

            const res = await fetch(`/api/grades/export-results?${params}`)
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `النتائج_النهائية_${selectedYear}_${selectedLevel}_${selectedSystem}.xlsx`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            console.error("خطأ في تصدير النتائج:", error)
            alert("حدث خطأ في تصدير النتائج")
        }
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'نجح': return 'bg-green-500'
            case 'راسب': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getGradeBadgeColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-purple-500'
        if (percentage >= 80) return 'bg-blue-500'
        if (percentage >= 70) return 'bg-green-500'
        if (percentage >= 60) return 'bg-yellow-500'
        if (percentage >= 50) return 'bg-orange-500'
        return 'bg-red-500'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* العنوان الرئيسي */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-4 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-2xl shadow-lg">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold gradient-text font-tajawal">
                            حاسبة النتائج النهائية
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-cairo">
                        نظام حساب وعرض النتائج النهائية للطلاب مع الإحصائيات والتقارير الشاملة
                    </p>
                </div>

                {/* بطاقة المعايير */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Calculator className="w-6 h-6" />
                            معايير حساب النتائج
                        </CardTitle>
                        <CardDescription className="text-lama-purple-light">
                            حدد المعايير لحساب النتائج النهائية
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="text-lg font-semibold text-lama-yellow">العام الدراسي</label>
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

                            <div className="space-y-3">
                                <label className="text-lg font-semibold text-lama-yellow">المرحلة التعليمية</label>
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

                            <div className="space-y-3">
                                <label className="text-lg font-semibold text-lama-yellow">نظام الدراسة</label>
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
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={calculateResults}
                                disabled={!selectedYear || !selectedLevel || !selectedSystem || calculating}
                                className="modern-button text-xl py-4 px-8"
                            >
                                {calculating ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        جاري الحساب...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Calculator className="w-6 h-6" />
                                        حساب النتائج النهائية
                                    </div>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* الإحصائيات العامة */}
                {students.length > 0 && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <TrendingUp className="w-6 h-6" />
                                الإحصائيات العامة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{statistics.totalStudents}</div>
                                    <div className="text-sm text-blue-700 font-semibold">إجمالي الطلاب</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200">
                                    <div className="text-4xl font-bold text-green-600 mb-2">{statistics.passedStudents}</div>
                                    <div className="text-sm text-green-700 font-semibold">ناجح</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-200">
                                    <div className="text-4xl font-bold text-red-600 mb-2">{statistics.failedStudents}</div>
                                    <div className="text-sm text-red-700 font-semibold">راسب</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                                    <div className="text-4xl font-bold text-gray-600 mb-2">{statistics.incompleteStudents}</div>
                                    <div className="text-sm text-gray-700 font-semibold">غير مكتمل</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{statistics.averageGrade}%</div>
                                    <div className="text-sm text-purple-700 font-semibold">المتوسط العام</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-200">
                                    <div className="text-3xl font-bold text-yellow-600 mb-2">{statistics.highestGrade}%</div>
                                    <div className="text-sm text-yellow-700 font-semibold">أعلى درجة</div>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{statistics.lowestGrade}%</div>
                                    <div className="text-sm text-orange-700 font-semibold">أقل درجة</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* توزيع التقديرات */}
                {students.length > 0 && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Trophy className="w-6 h-6" />
                                توزيع التقديرات
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                                    <span className="font-semibold text-purple-800">ممتاز</span>
                                    <Badge className="bg-purple-500 text-white">{statistics.gradeDistribution.excellent}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                                    <span className="font-semibold text-blue-800">جيد جداً</span>
                                    <Badge className="bg-blue-500 text-white">{statistics.gradeDistribution.veryGood}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                                    <span className="font-semibold text-green-800">جيد</span>
                                    <Badge className="bg-green-500 text-white">{statistics.gradeDistribution.good}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                                    <span className="font-semibold text-yellow-800">مقبول</span>
                                    <Badge className="bg-yellow-500 text-white">{statistics.gradeDistribution.acceptable}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                                    <span className="font-semibold text-orange-800">ضعيف</span>
                                    <Badge className="bg-orange-500 text-white">{statistics.gradeDistribution.weak}</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border-2 border-red-200">
                                    <span className="font-semibold text-red-800">راسب</span>
                                    <Badge className="bg-red-500 text-white">{statistics.gradeDistribution.failed}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* أدوات التصدير */}
                {students.length > 0 && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Download className="w-6 h-6" />
                                تصدير النتائج
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex items-center gap-6">
                                <Select value={exportMode} onValueChange={(value: 'all' | 'passed' | 'failed') => setExportMode(value)}>
                                    <SelectTrigger className="modern-input w-64">
                                        <SelectValue placeholder="اختر نوع التصدير" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الطلاب</SelectItem>
                                        <SelectItem value="passed">الناجحون فقط</SelectItem>
                                        <SelectItem value="failed">الراسبون فقط</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button onClick={exportResults} className="modern-button flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    تصدير إلى Excel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* قائمة النتائج */}
                {students.length > 0 && (
                    <Card className="modern-card">
                        <CardHeader className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <FileText className="w-6 h-6" />
                                النتائج النهائية - {students.length} طالب
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                {students.map((student) => (
                                    <div key={student.id} className="p-6 border-2 border-lama-sky-light rounded-2xl hover:shadow-xl transition-all bg-white/50 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">
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
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-lama-yellow mb-2">
                                                    {student.finalResult.percentage}%
                                                </div>
                                                <Badge className={`${getGradeBadgeColor(student.finalResult.percentage)} text-white text-lg px-4 py-2`}>
                                                    {student.finalResult.letterGrade}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h5 className="font-bold text-lama-yellow mb-3">معلومات النتيجة:</h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>الدرجة الكلية:</span>
                                                        <span className="font-bold">{student.finalResult.totalGrade}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>النسبة المئوية:</span>
                                                        <span className="font-bold">{student.finalResult.percentage}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>المعدل التراكمي:</span>
                                                        <span className="font-bold">{student.finalResult.gpa}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>الحالة:</span>
                                                        <Badge className={`${getStatusBadgeColor(student.finalResult.status)} text-white`}>
                                                            {student.finalResult.status === 'نجح' ? (
                                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            ) : student.finalResult.status === 'راسب' ? (
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                            ) : (
                                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                            )}
                                                            {student.finalResult.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="font-bold text-lama-yellow mb-3">نتائج المواد:</h5>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {Object.entries(student.subjectResults).map(([subject, result]) => (
                                                        <div key={subject} className="flex justify-between text-sm">
                                                            <span className="truncate">{subject}:</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">{result.finalTotal}</span>
                                                                <Badge
                                                                    size="sm"
                                                                    className={`${result.status === 'نجح' ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                                                >
                                                                    {result.grade}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* شريط التقدم */}
                                        <div className="mt-4">
                                            <Progress
                                                value={student.finalResult.percentage}
                                                className="h-3 bg-gray-200"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* رسالة عدم وجود نتائج */}
                {!loading && !calculating && students.length === 0 && selectedYear && selectedLevel && selectedSystem && (
                    <Card className="modern-card">
                        <CardContent className="p-12 text-center">
                            <div className="text-gray-400 mb-6">
                                <Trophy className="w-24 h-24 mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-600 mb-4">لا توجد نتائج</h3>
                            <p className="text-lg text-gray-500">اضغط على &quot;حساب النتائج النهائية&quot; لعرض النتائج</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

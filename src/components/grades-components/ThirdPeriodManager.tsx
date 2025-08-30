"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
    Calculator, 
    Save, 
    Lock, 
    TrendingUp, 
    Award, 
    AlertCircle,
    CheckCircle,
    Users
} from "lucide-react"
import { getGradeDistribution, calculateFinalResult, validateGrade } from "@/lib/grade-distributions"

interface StudentPreviousGrades {
    studentInfo: {
        id: string
        fullName: string
        nationalId: string
    }
    firstPeriod: any | null
    secondPeriod: any | null
    firstPeriodTotal: number
    secondPeriodTotal: number
    combinedTotal: number
}

interface ThirdPeriodGrade {
    studentId: string
    thirdExam: number | null
    finalTotal: number
    grade: string
    status: 'نجح' | 'راسب' | 'غير مكتمل'
    percentage: number
}

interface ThirdPeriodManagerProps {
    selectedYear: string
    selectedLevel: string
    selectedSystem: string
    selectedSubject: { id: number; name: string } | null
    students: any[]
}

export default function ThirdPeriodManager({
    selectedYear,
    selectedLevel,
    selectedSystem,
    selectedSubject,
    students
}: ThirdPeriodManagerProps) {
    const [previousGrades, setPreviousGrades] = useState<Record<string, StudentPreviousGrades>>({})
    const [thirdPeriodGrades, setThirdPeriodGrades] = useState<Record<string, ThirdPeriodGrade>>({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // الحصول على توزيع الدرجات للمادة المحددة
    const distribution = selectedSubject ? getGradeDistribution(selectedSubject.name, selectedLevel) : null

    // تحميل درجات الفترات السابقة
    const loadPreviousGrades = async () => {
        if (!selectedSubject || students.length === 0) return

        try {
            setLoading(true)
            const studentIds = students.map(s => s.id).join(',')
            
            const response = await fetch(`/api/grades/previous-periods?studentIds=${studentIds}&subject=${selectedSubject.name}&academicYear=${selectedYear}`)
            
            if (response.ok) {
                const data = await response.json()
                setPreviousGrades(data.previousGrades || {})
                
                // تهيئة درجات الفترة الثالثة
                const initialThirdGrades: Record<string, ThirdPeriodGrade> = {}
                students.forEach(student => {
                    const prevGrade = data.previousGrades[student.id]
                    if (prevGrade) {
                        initialThirdGrades[student.id] = {
                            studentId: student.id,
                            thirdExam: null,
                            finalTotal: prevGrade.combinedTotal,
                            grade: 'غير مكتمل',
                            status: 'غير مكتمل',
                            percentage: 0
                        }
                    }
                })
                setThirdPeriodGrades(initialThirdGrades)
            }
        } catch (error) {
            console.error("خطأ في تحميل درجات الفترات السابقة:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPreviousGrades()
    }, [selectedSubject, students])

    // التعامل مع تغيير درجة امتحان الفترة الثالثة
    const handleThirdExamChange = (studentId: string, value: string) => {
        const numValue = parseFloat(value) || 0
        const maxGrade = distribution?.thirdPeriodTotal || 0

        // التحقق من صحة الدرجة
        const validation = validateGrade(numValue, maxGrade, 'exam')
        
        if (!validation.isValid) {
            setErrors(prev => ({ ...prev, [studentId]: validation.error || '' }))
            return
        } else {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[studentId]
                return newErrors
            })
        }

        // حساب النتيجة النهائية
        const prevGrade = previousGrades[studentId]
        if (prevGrade && distribution) {
            const finalResult = calculateFinalResult(
                prevGrade.firstPeriodTotal,
                prevGrade.secondPeriodTotal,
                numValue,
                distribution
            )

            const totalPossible = distribution.twoPeriodsTotal * 2 + distribution.thirdPeriodTotal
            const percentage = (finalResult.finalTotal / totalPossible) * 100

            setThirdPeriodGrades(prev => ({
                ...prev,
                [studentId]: {
                    studentId,
                    thirdExam: numValue,
                    finalTotal: finalResult.finalTotal,
                    grade: finalResult.grade,
                    status: finalResult.status,
                    percentage: Math.round(percentage * 10) / 10
                }
            }))
        }
    }

    // حفظ درجات الفترة الثالثة
    const saveThirdPeriodGrades = async () => {
        if (!selectedSubject || !distribution) return

        try {
            setSaving(true)
            
            const gradesToSave = Object.values(thirdPeriodGrades)
                .filter(grade => grade.thirdExam !== null)
                .map(grade => ({
                    studentId: grade.studentId,
                    subjectId: selectedSubject.id,
                    academicYear: selectedYear,
                    period: "THIRD",
                    finalExam: grade.thirdExam,
                    periodTotal: grade.finalTotal,
                    grade: grade.grade,
                    status: grade.status
                }))

            const response = await fetch('/api/grades/third-period', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grades: gradesToSave,
                    subject: selectedSubject.name,
                    academicYear: selectedYear,
                    educationLevel: selectedLevel
                })
            })

            if (response.ok) {
                alert('تم حفظ درجات الفترة الثالثة بنجاح!')
            } else {
                const errorData = await response.json()
                alert(`خطأ: ${errorData.error}`)
            }
        } catch (error) {
            console.error("خطأ في حفظ الدرجات:", error)
            alert('حدث خطأ أثناء حفظ الدرجات')
        } finally {
            setSaving(false)
        }
    }

    // حساب الإحصائيات
    const stats = {
        totalStudents: students.length,
        completedGrades: Object.values(thirdPeriodGrades).filter(g => g.thirdExam !== null).length,
        passedStudents: Object.values(thirdPeriodGrades).filter(g => g.status === 'نجح').length,
        failedStudents: Object.values(thirdPeriodGrades).filter(g => g.status === 'راسب').length
    }

    if (!distribution) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    يرجى اختيار المادة أولاً لعرض نظام الفترة الثالثة
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* الرأس */}
            <Card className="modern-card">
                <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Calculator className="w-6 h-6" />
                        الفترة الثالثة - النتائج النهائية
                    </CardTitle>
                    <div className="text-lama-purple-light">
                        <p className="text-lg font-semibold">المجموع النهائي = درجات الفترة الأولى + درجات الفترة الثانية + درجات الفترة الثالثة</p>
                        <p className="text-sm mt-2">• درجات الفترات السابقة محفوظة ولا يمكن تعديلها من هنا</p>
                        <p className="text-sm">• فقط درجة الفترة الثالثة قابلة للإدخال والتعديل</p>
                    </div>
                </CardHeader>
            </Card>

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="modern-card text-center p-4">
                    <Users className="w-8 h-8 text-lama-sky mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                    <div className="text-sm text-gray-600">إجمالي الطلاب</div>
                </Card>
                <Card className="modern-card text-center p-4">
                    <CheckCircle className="w-8 h-8 text-lama-yellow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stats.completedGrades}</div>
                    <div className="text-sm text-gray-600">درجات مكتملة</div>
                </Card>
                <Card className="modern-card text-center p-4">
                    <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stats.passedStudents}</div>
                    <div className="text-sm text-gray-600">ناجحين</div>
                </Card>
                <Card className="modern-card text-center p-4">
                    <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{stats.failedStudents}</div>
                    <div className="text-sm text-gray-600">راسبين</div>
                </Card>
            </div>

            {/* معلومات التوزيع */}
            <Card className="modern-card">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <AlertCircle className="w-6 h-6 text-lama-yellow" />
                        <div>
                            <span className="font-bold text-xl text-gray-800">مادة: {selectedSubject?.name}</span>
                            <p className="text-gray-600 text-sm">نظام الفترة الثالثة - المجموع النهائي</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-blue-800">الفترة الأولى</span>
                            </div>
                            <p className="text-blue-700 text-sm">درجات محفوظة من نظام الفترة الأولى</p>
                            <p className="text-blue-600 text-xs mt-1">لا يمكن التعديل من هنا</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-800">الفترة الثانية</span>
                            </div>
                            <p className="text-green-700 text-sm">درجات محفوظة من نظام الفترة الثانية</p>
                            <p className="text-green-600 text-xs mt-1">لا يمكن التعديل من هنا</p>
                        </div>
                        
                        <div className="bg-lama-sky-light p-4 rounded-2xl border-2 border-lama-sky">
                            <div className="flex items-center gap-3 mb-2">
                                <Calculator className="w-5 h-5 text-lama-sky" />
                                <span className="font-bold text-lama-sky">الفترة الثالثة</span>
                            </div>
                            <p className="text-gray-700 text-sm">درجة الامتحان النهائي: <span className="font-bold">من {distribution.thirdPeriodTotal}</span></p>
                            <p className="text-lama-sky text-xs mt-1">قابل للإدخال والتعديل</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* جدول الدرجات */}
            <Card className="modern-card">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-center font-bold">اسم الطالب</TableHead>
                                    <TableHead className="text-center font-bold">الرقم الوطني</TableHead>
                                                                                <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Lock className="w-4 h-4 text-gray-500" />
                                            درجات الفترة الأولى
                                        </div>
                                        <div className="text-xs text-gray-500">(محفوظة من الفترة الأولى)</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Lock className="w-4 h-4 text-gray-500" />
                                            درجات الفترة الثانية
                                        </div>
                                        <div className="text-xs text-gray-500">(محفوظة من الفترة الثانية)</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Calculator className="w-4 h-4 text-lama-sky" />
                                            درجات الفترة الثالثة
                                        </div>
                                        <div className="text-xs text-gray-500">/{distribution.thirdPeriodTotal}</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">المجموع الكلي</TableHead>
                                    <TableHead className="text-center font-bold">النسبة المئوية</TableHead>
                                    <TableHead className="text-center font-bold">التقدير</TableHead>
                                    <TableHead className="text-center font-bold">النتيجة النهائية</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => {
                                    const prevGrade = previousGrades[student.id]
                                    const thirdGrade = thirdPeriodGrades[student.id]
                                    const error = errors[student.id]

                                    if (!prevGrade) {
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell className="text-center">{student.studentName}</TableCell>
                                                <TableCell className="text-center">{student.studentNumber}</TableCell>
                                                <TableCell colSpan={7} className="text-center text-red-500">
                                                    لا توجد درجات للفترات السابقة
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }

                                    return (
                                        <TableRow key={student.id} className="hover:bg-gray-50">
                                            <TableCell className="text-center font-medium">
                                                {student.studentName}
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-gray-600">
                                                {student.studentNumber}
                                            </TableCell>
                                            {/* درجات الفترة الأولى (محفوظة ومحمية) */}
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-3 h-3 text-gray-400" />
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">
                                                        {prevGrade.firstPeriodTotal}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>
                                            </TableCell>
                                            
                                            {/* درجات الفترة الثانية (محفوظة ومحمية) */}
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-3 h-3 text-gray-400" />
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                                                        {prevGrade.secondPeriodTotal}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>
                                            </TableCell>
                                            
                                            {/* درجات الفترة الثالثة (قابلة للإدخال) */}
                                            <TableCell className="text-center">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Calculator className="w-3 h-3 text-lama-sky" />
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            min="0"
                                                            max={distribution.thirdPeriodTotal}
                                                            step="0.5"
                                                            value={thirdGrade?.thirdExam || ''}
                                                            onChange={(e) => handleThirdExamChange(student.id, e.target.value)}
                                                            className="w-20 mx-auto text-center font-bold"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    {error && (
                                                        <div className="text-xs text-red-500">{error}</div>
                                                    )}
                                                    <div className="text-xs text-gray-500">من {distribution.thirdPeriodTotal}</div>
                                                </div>
                                            </TableCell>
                                            
                                            {/* المجموع الكلي */}
                                            <TableCell className="text-center">
                                                <Badge 
                                                    variant={thirdGrade?.finalTotal ? "default" : "outline"}
                                                    className="font-bold text-lg bg-lama-yellow text-white"
                                                >
                                                    {thirdGrade?.finalTotal || prevGrade.combinedTotal}
                                                </Badge>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {prevGrade.firstPeriodTotal} + {prevGrade.secondPeriodTotal} + {thirdGrade?.thirdExam || 0}
                                                </div>
                                            </TableCell>
                                            
                                            {/* النسبة المئوية */}
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-bold">
                                                    {thirdGrade?.percentage || 0}%
                                                </Badge>
                                            </TableCell>
                                            
                                            {/* التقدير */}
                                            <TableCell className="text-center">
                                                <Badge 
                                                    variant={thirdGrade?.status === 'نجح' ? "default" : "destructive"}
                                                    className="font-bold"
                                                >
                                                    {thirdGrade?.grade || 'غير مكتمل'}
                                                </Badge>
                                            </TableCell>
                                            
                                            {/* النتيجة النهائية */}
                                            <TableCell className="text-center">
                                                <Badge 
                                                    variant={thirdGrade?.status === 'نجح' ? "default" : "destructive"}
                                                    className="font-bold"
                                                >
                                                    {thirdGrade?.status || 'غير مكتمل'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* أزرار الحفظ */}
            <div className="flex justify-end gap-4">
                <Button
                    onClick={saveThirdPeriodGrades}
                    disabled={saving || loading || Object.keys(errors).length > 0}
                    className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'جاري الحفظ...' : 'حفظ النتائج النهائية'}
                </Button>
            </div>
        </div>
    )
}


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
    Users,
    AlertCircle
} from "lucide-react"

interface ThirdPeriodManagerFixedProps {
    selectedYear: string
    selectedLevel: string
    selectedSystem: string
    selectedSubject: { id: number; name: string } | null
    students: any[]
}

interface StudentGrades {
    firstPeriodTotal: number;
    secondPeriodTotal: number;
    thirdPeriodExam: number | null;
    finalTotal: number;
    percentage: number;
    grade: string;
    status: 'نجح' | 'راسب' | 'غير مكتمل';
    isThirdYear?: boolean;
}

export default function ThirdPeriodManagerFixed({
    selectedYear,
    selectedLevel,
    selectedSystem,
    selectedSubject,
    students
}: ThirdPeriodManagerFixedProps) {
    const [studentGrades, setStudentGrades] = useState<Record<string, StudentGrades>>({})
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // تحميل البيانات السابقة
    useEffect(() => {
        if (students.length > 0) {
            loadPreviousPeriods()
        }
    }, [students])

    const loadPreviousPeriods = async () => {
        try {
            setLoading(true)

            // التحقق من وجود المادة المختارة
            if (!selectedSubject) {
                console.error('لم يتم اختيار مادة')
                return
            }

            // جلب البيانات الحقيقية من API
            const response = await fetch(`/api/grades/previous-periods?` + new URLSearchParams({
                academicYear: selectedYear,
                subject: selectedSubject.name,
                studentIds: students.map(s => s.id).join(',')
            }))

            if (!response.ok) {
                throw new Error('فشل في جلب البيانات')
            }

            const data = await response.json()
            console.log('📊 بيانات الفترات السابقة:', data)

            // تحويل البيانات لصيغة مناسبة للعرض
            const gradesData: Record<string, StudentGrades> = {}

            students.forEach((student) => {
                const studentData = data.previousGrades?.[student.id]

                // للطلاب من غير السنة الثالثة: نأخذ مجاميع الفترات السابقة
                // لطلاب السنة الثالثة: يدخلون الشهور كما هو معتاد
                const isThirdYearStudent = student.educationLevel === "السنة الثالثة" || student.educationLevel === "THIRD_YEAR"

                gradesData[student.id] = {
                    firstPeriodTotal: studentData?.firstPeriodTotal || 0,
                    secondPeriodTotal: studentData?.secondPeriodTotal || 0,
                    thirdPeriodExam: null, // للإدخال من المستخدم
                    finalTotal: (studentData?.firstPeriodTotal || 0) + (studentData?.secondPeriodTotal || 0),
                    percentage: 0,
                    grade: "",
                    status: 'غير مكتمل',
                    isThirdYear: isThirdYearStudent
                }
            })

            setStudentGrades(gradesData)
        } catch (error) {
            console.error("خطأ في تحميل البيانات:", error)
        } finally {
            setLoading(false)
        }
    }

    // التعامل مع إدخال درجة الفترة الثالثة
    const handleThirdPeriodInput = (studentId: string, value: string) => {
        const numValue = parseFloat(value) || 0
        const maxGrade = 48 // الحد الأقصى لامتحان الفترة الثالثة

        // التحقق من صحة الدرجة
        if (numValue < 0) {
            setErrors(prev => ({ ...prev, [studentId]: "الدرجة لا يمكن أن تكون سالبة" }))
            return
        }

        if (numValue > maxGrade) {
            setErrors(prev => ({ ...prev, [studentId]: `الدرجة لا يمكن أن تتجاوز ${maxGrade}` }))
            return
        }

        // مسح الخطأ
        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[studentId]
            return newErrors
        })

        // تحديث الدرجات
        setStudentGrades(prev => {
            const currentGrades = prev[studentId]
            if (!currentGrades) return prev

            const finalTotal = currentGrades.firstPeriodTotal + currentGrades.secondPeriodTotal + numValue
            const maxPossible = 100 // إجمالي الدرجات الممكنة
            const percentage = Math.round((finalTotal / maxPossible) * 100 * 10) / 10

            // تحديد التقدير
            let grade = 'غير مكتمل'
            let status: 'نجح' | 'راسب' | 'غير مكتمل' = 'غير مكتمل'

            if (numValue > 0) {
                if (percentage >= 90) {
                    grade = 'ممتاز'
                    status = 'نجح'
                } else if (percentage >= 80) {
                    grade = 'جيد جداً'
                    status = 'نجح'
                } else if (percentage >= 70) {
                    grade = 'جيد'
                    status = 'نجح'
                } else if (percentage >= 60) {
                    grade = 'مقبول'
                    status = 'نجح'
                } else {
                    grade = 'راسب'
                    status = 'راسب'
                }
            }

            return {
                ...prev,
                [studentId]: {
                    ...currentGrades,
                    thirdPeriodExam: numValue,
                    finalTotal: finalTotal,
                    percentage: percentage,
                    grade: grade,
                    status: status
                }
            }
        })
    }

    // حفظ الدرجات
    const saveGrades = async () => {
        try {
            setLoading(true)

            const response = await fetch('/api/grades/final-period-fixed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentGrades: studentGrades,
                    subjectName: selectedSubject?.name,
                    academicYear: selectedYear,
                    educationLevel: selectedLevel
                })
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert(`تم حفظ ${result.saved} درجة بنجاح في قاعدة البيانات!`)
                if (result.errors > 0) {
                    console.warn("أخطاء:", result.errorMessages)
                }
            } else {
                throw new Error(result.error || 'خطأ في الحفظ')
            }
        } catch (error) {
            console.error("خطأ في حفظ الدرجات:", error)
            alert("حدث خطأ أثناء حفظ الدرجات: " + (error instanceof Error ? error.message : 'خطأ غير معروف'))
        } finally {
            setLoading(false)
        }
    }

    if (!selectedSubject) {
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
            {/* رأس النظام */}
            <Card className="modern-card">
                <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Calculator className="w-6 h-6" />
                        الفترة الثالثة - النتائج النهائية
                    </CardTitle>
                    <div className="text-lama-purple-light">
                        <p className="text-lg font-semibold">المجموع النهائي = مجموع الفترة الأولى + مجموع الفترة الثانية + امتحان الفترة الثالثة</p>
                        <p className="text-sm mt-2">• لجميع الطلاب: مجاميع الفترتين الأولى والثانية محفوظة ولا يمكن تعديلها</p>
                        <p className="text-sm">• فقط درجة امتحان الفترة الثالثة قابلة للإدخال (الحد الأقصى: 48 درجة)</p>
                        <p className="text-sm">• النظام يحسب النتيجة النهائية والنسبة المئوية تلقائياً</p>
                    </div>
                </CardHeader>
            </Card>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="modern-card text-center p-4">
                    <Users className="w-8 h-8 text-lama-sky mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{students.length}</div>
                    <div className="text-sm text-gray-600">إجمالي الطلاب</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <Calculator className="w-8 h-8 text-lama-yellow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">
                        {Object.values(studentGrades).filter(g => g.thirdPeriodExam !== null).length}
                    </div>
                    <div className="text-sm text-gray-600">درجات مدخلة</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✓</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {Object.values(studentGrades).filter(g => g.status === 'نجح').length}
                    </div>
                    <div className="text-sm text-gray-600">ناجحين</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✗</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {Object.values(studentGrades).filter(g => g.status === 'راسب').length}
                    </div>
                    <div className="text-sm text-gray-600">راسبين</div>
                </Card>
            </div>

            {/* الجدول الرئيسي */}
            <Card className="modern-card">
                <CardHeader className="bg-gradient-to-l from-lama-yellow to-lama-sky text-white rounded-t-3xl">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Calculator className="w-5 h-5" />
                        جدول النتائج النهائية - {selectedSubject?.name || 'غير محدد'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-center font-bold">النتيجة</TableHead>
                                    <TableHead className="text-center font-bold">التقدير</TableHead>
                                    <TableHead className="text-center font-bold">النسبة %</TableHead>
                                    <TableHead className="text-center font-bold">المجموع النهائي</TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Calculator className="w-4 h-4 text-lama-sky" />
                                            <span>امتحان الفترة الثالثة</span>
                                        </div>
                                        <div className="text-xs text-gray-500">(للإدخال - من 48)</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Lock className="w-4 h-4 text-green-600" />
                                            <span>مجموع الفترة الثانية</span>
                                        </div>
                                        <div className="text-xs text-gray-500">(محفوظ من النظام)</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Lock className="w-4 h-4 text-blue-600" />
                                            <span>مجموع الفترة الأولى</span>
                                        </div>
                                        <div className="text-xs text-gray-500">(محفوظ من النظام)</div>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">الطالب</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => {
                                    const grades = studentGrades[student.id]
                                    const error = errors[student.id]

                                    return (
                                        <TableRow key={student.id} className="hover:bg-gray-50">
                                            {/* النتيجة النهائية */}
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={grades?.status === 'نجح' ? "default" : "destructive"}
                                                    className="font-bold"
                                                >
                                                    {grades?.status || 'غير مكتمل'}
                                                </Badge>
                                            </TableCell>

                                            {/* التقدير */}
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={grades?.status === 'نجح' ? "default" : "destructive"}
                                                    className="font-bold"
                                                >
                                                    {grades?.grade || 'غير مكتمل'}
                                                </Badge>
                                            </TableCell>

                                            {/* النسبة المئوية */}
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-bold">
                                                    {grades?.percentage || 0}%
                                                </Badge>
                                            </TableCell>

                                            {/* المجموع النهائي */}
                                            <TableCell className="text-center">
                                                <Badge className="font-bold text-lg bg-lama-yellow text-white">
                                                    {grades?.finalTotal || 0}
                                                </Badge>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {grades?.firstPeriodTotal || 0} + {grades?.secondPeriodTotal || 0} + {grades?.thirdPeriodExam || 0}
                                                </div>
                                            </TableCell>

                                            {/* درجة الفترة الثالثة (للإدخال) */}
                                            <TableCell className="text-center">
                                                <div className="space-y-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        max="48"
                                                        step="0.5"
                                                        value={grades?.thirdPeriodExam || ''}
                                                        onChange={(e) => handleThirdPeriodInput(student.id, e.target.value)}
                                                        className="w-20 mx-auto text-center font-bold"
                                                        disabled={loading}
                                                    />
                                                    {error && (
                                                        <div className="text-xs text-red-500">{error}</div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* مجموع الفترة الثانية (محفوظ) */}
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-3 h-3 text-green-500" />
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                                                        {grades?.secondPeriodTotal || 0}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>
                                            </TableCell>

                                            {/* مجموع الفترة الأولى (محفوظ) */}
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Lock className="w-3 h-3 text-blue-500" />
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">
                                                        {grades?.firstPeriodTotal || 0}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>
                                            </TableCell>

                                            {/* اسم الطالب */}
                                            <TableCell className="text-center">
                                                <div>
                                                    <div className="font-semibold">{student.studentName}</div>
                                                    <div className="text-xs text-gray-500">{student.studentNumber}</div>
                                                </div>
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
                    onClick={saveGrades}
                    disabled={loading}
                    className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white px-8 py-3"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}
                </Button>
            </div>
        </div>
    )
}

<Card className="modern-card">

    <CardContent className="p-8 text-center">

        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />

        <h3 className="text-xl font-bold text-gray-800 mb-2">مطلوب اختيار المادة</h3>

        <p className="text-gray-600">يرجى اختيار المادة الدراسية من الفلاتر أعلاه لعرض نظام الفترة الثالثة</p>

    </CardContent>

</Card>

        )

    }



return (

    <div className="space-y-6" dir="rtl">

        {/* رأس النظام */}

        <Card className="modern-card">

            <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">

                <CardTitle className="flex items-center gap-3 text-2xl">

                    <Calculator className="w-6 h-6" />

                    الفترة الثالثة - النتائج النهائية

                </CardTitle>

                <div className="text-lama-purple-light">

                    <p className="text-lg font-semibold">المجموع النهائي = مجموع الفترة الأولى + مجموع الفترة الثانية + درجة الفترة الثالثة</p>

                    <p className="text-sm mt-2">• المجاميع السابقة محفوظة ولا يمكن تعديلها من هنا</p>

                    <p className="text-sm">• فقط درجة امتحان الفترة الثالثة قابلة للإدخال</p>

                </div>

            </CardHeader>

        </Card>



        {/* إحصائيات سريعة */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Card className="modern-card text-center p-4">

                <Users className="w-8 h-8 text-lama-sky mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">{students.length}</div>

                <div className="text-sm text-gray-600">إجمالي الطلاب</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <Calculator className="w-8 h-8 text-lama-yellow mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.thirdPeriodExam !== null).length}

                </div>

                <div className="text-sm text-gray-600">درجات مدخلة</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✓</div>

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.status === 'نجح').length}

                </div>

                <div className="text-sm text-gray-600">ناجحين</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✗</div>

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.status === 'راسب').length}

                </div>

                <div className="text-sm text-gray-600">راسبين</div>

            </Card>

        </div>



        {/* الجدول الرئيسي */}

        <Card className="modern-card">

            <CardHeader className="bg-gradient-to-l from-lama-yellow to-lama-sky text-white rounded-t-3xl">

                <CardTitle className="flex items-center gap-3 text-xl">

                    <Calculator className="w-5 h-5" />

                    جدول النتائج النهائية - {selectedSubject?.name || 'غير محدد'}

                </CardTitle>

            </CardHeader>

            <CardContent className="p-0">

                <div className="overflow-x-auto">

                    <Table>

                        <TableHeader>

                            <TableRow className="bg-gray-50">

                                <TableHead className="text-center font-bold">الطالب</TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Lock className="w-4 h-4 text-blue-600" />

                                        <span>مجموع الفترة الأولى</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(محفوظ من النظام)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Lock className="w-4 h-4 text-green-600" />

                                        <span>مجموع الفترة الثانية</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(محفوظ من النظام)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Calculator className="w-4 h-4 text-lama-sky" />

                                        <span>درجة الفترة الثالثة</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(للإدخال - من 48)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">المجموع النهائي</TableHead>

                                <TableHead className="text-center font-bold">النسبة %</TableHead>

                                <TableHead className="text-center font-bold">التقدير</TableHead>

                                <TableHead className="text-center font-bold">النتيجة</TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {students.map((student) => {

                                const grades = studentGrades[student.id]

                                const error = errors[student.id]



                                return (

                                    <TableRow key={student.id} className="hover:bg-gray-50">

                                        {/* اسم الطالب */}

                                        <TableCell className="text-center">

                                            <div>

                                                <div className="font-semibold">{student.studentName}</div>

                                                <div className="text-xs text-gray-500">{student.studentNumber}</div>

                                            </div>

                                        </TableCell>



                                        {/* مجموع الفترة الأولى (محفوظ) */}

                                        <TableCell className="text-center">

                                            <div className="flex items-center justify-center gap-2">

                                                <Lock className="w-3 h-3 text-blue-500" />

                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">

                                                    {grades?.firstPeriodTotal || 0}

                                                </Badge>

                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>

                                        </TableCell>



                                        {/* مجموع الفترة الثانية (محفوظ) */}

                                        <TableCell className="text-center">

                                            <div className="flex items-center justify-center gap-2">

                                                <Lock className="w-3 h-3 text-green-500" />

                                                <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">

                                                    {grades?.secondPeriodTotal || 0}

                                                </Badge>

                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>

                                        </TableCell>



                                        {/* درجة الفترة الثالثة (للإدخال) */}

                                        <TableCell className="text-center">

                                            <div className="space-y-2">

                                                <Input

                                                    type="number"

                                                    placeholder="0"

                                                    min="0"

                                                    max="48"

                                                    step="0.5"

                                                    value={grades?.thirdPeriodExam || ''}

                                                    onChange={(e) => handleThirdPeriodInput(student.id, e.target.value)}

                                                    className="w-20 mx-auto text-center font-bold"

                                                    disabled={loading}

                                                />

                                                {error && (

                                                    <div className="text-xs text-red-500">{error}</div>

                                                )}

                                            </div>

                                        </TableCell>



                                        {/* المجموع النهائي */}

                                        <TableCell className="text-center">

                                            <Badge className="font-bold text-lg bg-lama-yellow text-white">

                                                {grades?.finalTotal || 0}

                                            </Badge>

                                            <div className="text-xs text-gray-500 mt-1">

                                                {grades?.firstPeriodTotal || 0} + {grades?.secondPeriodTotal || 0} + {grades?.thirdPeriodExam || 0}

                                            </div>

                                        </TableCell>



                                        {/* النسبة المئوية */}

                                        <TableCell className="text-center">

                                            <Badge variant="outline" className="font-bold">

                                                {grades?.percentage || 0}%

                                            </Badge>

                                        </TableCell>



                                        {/* التقدير */}

                                        <TableCell className="text-center">

                                            <Badge

                                                variant={grades?.status === 'نجح' ? "default" : "destructive"}

                                                className="font-bold"

                                            >

                                                {grades?.grade || 'غير مكتمل'}

                                            </Badge>

                                        </TableCell>



                                        {/* النتيجة النهائية */}

                                        <TableCell className="text-center">

                                            <Badge

                                                variant={grades?.status === 'نجح' ? "default" : "destructive"}

                                                className="font-bold"

                                            >

                                                {grades?.status || 'غير مكتمل'}

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

                onClick={saveGrades}

                disabled={loading}

                className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white px-8 py-3"

            >

                <Save className="w-4 h-4 mr-2" />

                {loading ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}

            </Button>

        </div>

    </div>

)

}



<Card className="modern-card">

    <CardContent className="p-8 text-center">

        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />

        <h3 className="text-xl font-bold text-gray-800 mb-2">مطلوب اختيار المادة</h3>

        <p className="text-gray-600">يرجى اختيار المادة الدراسية من الفلاتر أعلاه لعرض نظام الفترة الثالثة</p>

    </CardContent>

</Card>

        )

    }



return (

    <div className="space-y-6" dir="rtl">

        {/* رأس النظام */}

        <Card className="modern-card">

            <CardHeader className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white rounded-t-3xl">

                <CardTitle className="flex items-center gap-3 text-2xl">

                    <Calculator className="w-6 h-6" />

                    الفترة الثالثة - النتائج النهائية

                </CardTitle>

                <div className="text-lama-purple-light">

                    <p className="text-lg font-semibold">المجموع النهائي = مجموع الفترة الأولى + مجموع الفترة الثانية + درجة الفترة الثالثة</p>

                    <p className="text-sm mt-2">• المجاميع السابقة محفوظة ولا يمكن تعديلها من هنا</p>

                    <p className="text-sm">• فقط درجة امتحان الفترة الثالثة قابلة للإدخال</p>

                </div>

            </CardHeader>

        </Card>



        {/* إحصائيات سريعة */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <Card className="modern-card text-center p-4">

                <Users className="w-8 h-8 text-lama-sky mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">{students.length}</div>

                <div className="text-sm text-gray-600">إجمالي الطلاب</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <Calculator className="w-8 h-8 text-lama-yellow mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.thirdPeriodExam !== null).length}

                </div>

                <div className="text-sm text-gray-600">درجات مدخلة</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✓</div>

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.status === 'نجح').length}

                </div>

                <div className="text-sm text-gray-600">ناجحين</div>

            </Card>



            <Card className="modern-card text-center p-4">

                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">✗</div>

                <div className="text-2xl font-bold text-gray-800">

                    {Object.values(studentGrades).filter(g => g.status === 'راسب').length}

                </div>

                <div className="text-sm text-gray-600">راسبين</div>

            </Card>

        </div>



        {/* الجدول الرئيسي */}

        <Card className="modern-card">

            <CardHeader className="bg-gradient-to-l from-lama-yellow to-lama-sky text-white rounded-t-3xl">

                <CardTitle className="flex items-center gap-3 text-xl">

                    <Calculator className="w-5 h-5" />

                    جدول النتائج النهائية - {selectedSubject?.name || 'غير محدد'}

                </CardTitle>

            </CardHeader>

            <CardContent className="p-0">

                <div className="overflow-x-auto">

                    <Table>

                        <TableHeader>

                            <TableRow className="bg-gray-50">

                                <TableHead className="text-center font-bold">الطالب</TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Lock className="w-4 h-4 text-blue-600" />

                                        <span>مجموع الفترة الأولى</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(محفوظ من النظام)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Lock className="w-4 h-4 text-green-600" />

                                        <span>مجموع الفترة الثانية</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(محفوظ من النظام)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">

                                    <div className="flex items-center justify-center gap-2">

                                        <Calculator className="w-4 h-4 text-lama-sky" />

                                        <span>درجة الفترة الثالثة</span>

                                    </div>

                                    <div className="text-xs text-gray-500">(للإدخال - من 48)</div>

                                </TableHead>

                                <TableHead className="text-center font-bold">المجموع النهائي</TableHead>

                                <TableHead className="text-center font-bold">النسبة %</TableHead>

                                <TableHead className="text-center font-bold">التقدير</TableHead>

                                <TableHead className="text-center font-bold">النتيجة</TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {students.map((student) => {

                                const grades = studentGrades[student.id]

                                const error = errors[student.id]



                                return (

                                    <TableRow key={student.id} className="hover:bg-gray-50">

                                        {/* اسم الطالب */}

                                        <TableCell className="text-center">

                                            <div>

                                                <div className="font-semibold">{student.studentName}</div>

                                                <div className="text-xs text-gray-500">{student.studentNumber}</div>

                                            </div>

                                        </TableCell>



                                        {/* مجموع الفترة الأولى (محفوظ) */}

                                        <TableCell className="text-center">

                                            <div className="flex items-center justify-center gap-2">

                                                <Lock className="w-3 h-3 text-blue-500" />

                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">

                                                    {grades?.firstPeriodTotal || 0}

                                                </Badge>

                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>

                                        </TableCell>



                                        {/* مجموع الفترة الثانية (محفوظ) */}

                                        <TableCell className="text-center">

                                            <div className="flex items-center justify-center gap-2">

                                                <Lock className="w-3 h-3 text-green-500" />

                                                <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">

                                                    {grades?.secondPeriodTotal || 0}

                                                </Badge>

                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">لا يمكن التعديل</div>

                                        </TableCell>



                                        {/* درجة الفترة الثالثة (للإدخال) */}

                                        <TableCell className="text-center">

                                            <div className="space-y-2">

                                                <Input

                                                    type="number"

                                                    placeholder="0"

                                                    min="0"

                                                    max="48"

                                                    step="0.5"

                                                    value={grades?.thirdPeriodExam || ''}

                                                    onChange={(e) => handleThirdPeriodInput(student.id, e.target.value)}

                                                    className="w-20 mx-auto text-center font-bold"

                                                    disabled={loading}

                                                />

                                                {error && (

                                                    <div className="text-xs text-red-500">{error}</div>

                                                )}

                                            </div>

                                        </TableCell>



                                        {/* المجموع النهائي */}

                                        <TableCell className="text-center">

                                            <Badge className="font-bold text-lg bg-lama-yellow text-white">

                                                {grades?.finalTotal || 0}

                                            </Badge>

                                            <div className="text-xs text-gray-500 mt-1">

                                                {grades?.firstPeriodTotal || 0} + {grades?.secondPeriodTotal || 0} + {grades?.thirdPeriodExam || 0}

                                            </div>

                                        </TableCell>



                                        {/* النسبة المئوية */}

                                        <TableCell className="text-center">

                                            <Badge variant="outline" className="font-bold">

                                                {grades?.percentage || 0}%

                                            </Badge>

                                        </TableCell>



                                        {/* التقدير */}

                                        <TableCell className="text-center">

                                            <Badge

                                                variant={grades?.status === 'نجح' ? "default" : "destructive"}

                                                className="font-bold"

                                            >

                                                {grades?.grade || 'غير مكتمل'}

                                            </Badge>

                                        </TableCell>



                                        {/* النتيجة النهائية */}

                                        <TableCell className="text-center">

                                            <Badge

                                                variant={grades?.status === 'نجح' ? "default" : "destructive"}

                                                className="font-bold"

                                            >

                                                {grades?.status || 'غير مكتمل'}

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

                onClick={saveGrades}

                disabled={loading}

                className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white px-8 py-3"

            >

                <Save className="w-4 h-4 mr-2" />

                {loading ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}

            </Button>

        </div>

    </div>

)

}



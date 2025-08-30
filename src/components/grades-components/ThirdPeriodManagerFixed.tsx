'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, Calculator, Users, Trophy, TrendingUp, FileDown, CheckCircle, XCircle } from 'lucide-react'


interface Student {
    id: string
    fullName: string
    studentId: string
    studyLevel: string
    studyMode: string
    finalGrades?: {
        firstPeriodTotal?: number
        secondPeriodTotal?: number
        thirdPeriodExam?: number
        finalTotal?: number
    }
}

interface Subject {
    id: string
    name: string
    studyLevel: string
}

interface ThirdPeriodManagerFixedProps {
    selectedSubject?: string
    selectedLevel?: string
    selectedMode?: string
}

const ThirdPeriodManagerFixed: React.FC<ThirdPeriodManagerFixedProps> = ({
    selectedSubject,
    selectedLevel,
    selectedMode
}) => {
    const [students, setStudents] = useState<Student[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(false)
    const [grades, setGrades] = useState<Record<string, number>>({})

    // جلب البيانات
    useEffect(() => {
        if (selectedSubject && selectedLevel && selectedMode) {
            fetchStudents()
            fetchSubjects()
        }
    }, [selectedSubject, selectedLevel, selectedMode])

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/students/filtered?studyLevel=${selectedLevel}&studyMode=${selectedMode}`)
            const data = await response.json()
            setStudents(data)
        } catch (error) {
            console.error('خطأ في جلب بيانات الطلاب')
        } finally {
            setLoading(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            const data = await response.json()
            setSubjects(data)
        } catch (error) {
            console.error('خطأ في جلب بيانات المواد')
        }
    }

    // حفظ الدرجات
    const handleSaveGrades = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/grades/third-period', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectId: selectedSubject,
                    grades
                })
            })

            if (response.ok) {
                console.log('تم حفظ الدرجات بنجاح')
            } else {
                console.error('خطأ في حفظ الدرجات')
            }
        } catch (error) {
            console.error('خطأ في حفظ الدرجات')
        } finally {
            setLoading(false)
        }
    }

    // حساب الإحصائيات
    const stats = useMemo(() => {
        const passedStudents = students.filter(s =>
            (s.finalGrades?.finalTotal || 0) >= 50
        ).length

        const averageGrade = students.length > 0
            ? students.reduce((sum, s) => sum + (s.finalGrades?.finalTotal || 0), 0) / students.length
            : 0

        return {
            total: students.length,
            passed: passedStudents,
            failed: students.length - passedStudents,
            average: averageGrade.toFixed(1)
        }
    }, [students])

    if (!selectedSubject || !selectedLevel || !selectedMode) {
        return (
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
                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                    <div className="text-sm text-gray-600">إجمالي الطلاب</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                    <div className="text-sm text-gray-600">ناجح</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-sm text-gray-600">راسب</div>
                </Card>

                <Card className="modern-card text-center p-4">
                    <TrendingUp className="w-8 h-8 text-lama-yellow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-lama-yellow">{stats.average}</div>
                    <div className="text-sm text-gray-600">المعدل العام</div>
                </Card>
            </div>

            {/* جدول الطلاب والدرجات */}
            <Card className="modern-card">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>دفتر درجات الفترة الثالثة</span>
                        <Button onClick={handleSaveGrades} disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-right p-3 font-semibold">الرقم</th>
                                    <th className="text-right p-3 font-semibold">اسم الطالب</th>
                                    <th className="text-center p-3 font-semibold">الفترة الأولى</th>
                                    <th className="text-center p-3 font-semibold">الفترة الثانية</th>
                                    <th className="text-center p-3 font-semibold">امتحان الفترة الثالثة</th>
                                    <th className="text-center p-3 font-semibold">المجموع النهائي</th>
                                    <th className="text-center p-3 font-semibold">النتيجة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => {
                                    const firstPeriod = student.finalGrades?.firstPeriodTotal || 0
                                    const secondPeriod = student.finalGrades?.secondPeriodTotal || 0
                                    const thirdPeriod = grades[student.id] || student.finalGrades?.thirdPeriodExam || 0
                                    const finalTotal = firstPeriod + secondPeriod + thirdPeriod
                                    const passed = finalTotal >= 50

                                    return (
                                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3 font-medium">{student.fullName}</td>
                                            <td className="p-3 text-center">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {firstPeriod}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    {secondPeriod}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={grades[student.id] || ''}
                                                    onChange={(e) => setGrades(prev => ({
                                                        ...prev,
                                                        [student.id]: Number(e.target.value)
                                                    }))}
                                                    className="w-20 text-center"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-3 py-1 rounded font-bold ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {finalTotal}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-3 py-1 rounded font-bold text-white ${passed ? 'bg-green-500' : 'bg-red-500'
                                                    }`}>
                                                    {passed ? 'ناجح' : 'راسب'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    تصدير النتائج
                </Button>
                <Button
                    onClick={handleSaveGrades}
                    disabled={loading}
                    className="bg-gradient-to-r from-lama-sky to-lama-yellow text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'جاري الحفظ...' : 'حفظ جميع الدرجات'}
                </Button>
            </div>
        </div>
    )
}

export default ThirdPeriodManagerFixed
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TestData {
    sampleStudents: any[]
    subjects: any[]
    statistics: {
        totalStudents: number
        studentsWithLevel: number
        studentsWithMode: number
        studentsWithSpecialization: number
    }
    uniqueValues: {
        levels: string[]
        modes: string[]
        specializations: string[]
    }
}

export default function TestDataPage() {
    const [data, setData] = useState<TestData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTestData = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/test-data')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            if (result.success) {
                setData(result.data)
            } else {
                setError(result.error || 'Unknown error')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">جاري تحميل البيانات...</h1>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">خطأ في تحميل البيانات</h1>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                    <Button onClick={fetchTestData} className="bg-blue-500 hover:bg-blue-600">
                        إعادة المحاولة
                    </Button>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">لا توجد بيانات</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">فحص البيانات في قاعدة البيانات</h1>

                {/* الإحصائيات */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>الإحصائيات العامة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{data.statistics.totalStudents}</div>
                                <div className="text-sm text-gray-600">إجمالي الطلاب</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{data.statistics.studentsWithLevel}</div>
                                <div className="text-sm text-gray-600">لديهم مرحلة دراسية</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{data.statistics.studentsWithMode}</div>
                                <div className="text-sm text-gray-600">لديهم نظام دراسة</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{data.statistics.studentsWithSpecialization}</div>
                                <div className="text-sm text-gray-600">لديهم شعبة</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* القيم الفريدة */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>القيم الفريدة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">المراحل الدراسية:</h3>
                                <ul className="space-y-1">
                                    {data.uniqueValues.levels.map((level, index) => (
                                        <li key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {level || 'غير محدد'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">أنظمة الدراسة:</h3>
                                <ul className="space-y-1">
                                    {data.uniqueValues.modes.map((mode, index) => (
                                        <li key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {mode || 'غير محدد'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">الشعب:</h3>
                                <ul className="space-y-1">
                                    {data.uniqueValues.specializations.map((spec, index) => (
                                        <li key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {spec || 'غير محدد'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* عينة من الطلاب */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>عينة من الطلاب (5 طلاب)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.sampleStudents.map((student, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-white">
                                    <h4 className="font-semibold mb-2">{student.fullName}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">الرقم الوطني:</span> {student.nationalId}
                                        </div>
                                        <div>
                                            <span className="font-medium">العام الدراسي:</span> {student.academicYear || 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">المرحلة:</span> {student.studyLevel || 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">النظام:</span> {student.studyMode || 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">الشعبة:</span> {student.specialization || 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">الجنس:</span> {student.sex || 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">تاريخ الميلاد:</span> {student.birthday ? new Date(student.birthday).toLocaleDateString('ar-SA') : 'غير محدد'}
                                        </div>
                                        <div>
                                            <span className="font-medium">العنوان:</span> {student.address || 'غير محدد'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* المواد */}
                <Card>
                    <CardHeader>
                        <CardTitle>المواد المتاحة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.subjects.map((subject, index) => (
                                <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                                    <div className="font-semibold">{subject.name}</div>
                                    <div className="text-sm text-gray-600">ID: {subject.id}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Button onClick={fetchTestData} className="bg-green-500 hover:bg-green-600">
                        تحديث البيانات
                    </Button>
                </div>
            </div>
        </div>
    )
}

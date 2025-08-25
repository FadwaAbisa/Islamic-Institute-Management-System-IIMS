"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAPIPage() {
    const [result, setResult] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const testGradesAPI = async () => {
        try {
            setLoading(true)
            setResult("جاري الاختبار...")

            // اختبار بيانات وهمية
            const testData = {
                grades: [
                    {
                        studentId: "test-student-id",
                        subjectName: "القرآن الكريم وعلومه",
                        academicYear: "2024-2025",
                        period: "FIRST",
                        month1: 85,
                        month2: 90,
                        month3: 88,
                        finalExam: 92,
                        workTotal: 87.67,
                        periodTotal: 90.2
                    }
                ]
            }

            console.log("🧪 إرسال بيانات اختبار:", testData)

            const response = await fetch('/api/grades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            })

            console.log("🧪 استجابة API:", response.status, response.statusText)

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`خطأ في API: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            setResult(`✅ نجح الاختبار! النتيجة: ${JSON.stringify(result, null, 2)}`)
            console.log("🧪 نتيجة الاختبار:", result)

        } catch (error) {
            console.error("🧪 خطأ في الاختبار:", error)
            setResult(`❌ فشل الاختبار: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
        } finally {
            setLoading(false)
        }
    }

    const testSubjectGradesAPI = async () => {
        try {
            setLoading(true)
            setResult("جاري اختبار subject-grades API...")

            const response = await fetch('/api/subject-grades?subject=القرآن الكريم وعلومه&academicYear=2024-2025&evaluationPeriod=FIRST&educationLevel=all&studySystem=all&displayFilter=all&searchType=all&searchValue=')

            console.log("🧪 استجابة subject-grades API:", response.status, response.statusText)

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`خطأ في subject-grades API: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            setResult(`✅ نجح اختبار subject-grades! عدد الطلاب: ${result.students?.length || 0}`)
            console.log("🧪 نتيجة subject-grades:", result)

        } catch (error) {
            console.error("🧪 خطأ في اختبار subject-grades:", error)
            setResult(`❌ فشل اختبار subject-grades: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
        } finally {
            setLoading(false)
        }
    }

    const checkSubjects = async () => {
        try {
            setLoading(true)
            setResult("جاري فحص المواد...")

            const response = await fetch('/api/check-subjects')

            if (!response.ok) {
                throw new Error(`خطأ في API: ${response.status}`)
            }

            const result = await response.json()
            setResult(`🔍 المواد الموجودة:\n${result.subjects.map((s: any) => `- ${s.name} (ID: ${s.id})`).join('\n')}\n\nإجمالي المواد: ${result.totalSubjects}\nإجمالي الطلاب: ${result.totalStudents}`)
            console.log("🔍 المواد:", result)

        } catch (error) {
            console.error("🔍 خطأ في فحص المواد:", error)
            setResult(`❌ فشل فحص المواد: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">اختبار API</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>اختبار Grades API</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={testGradesAPI}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "جاري الاختبار..." : "اختبار /api/grades"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>اختبار Subject Grades API</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={testSubjectGradesAPI}
                            disabled={loading}
                            className="w-full"
                            variant="outline"
                        >
                            {loading ? "جاري الاختبار..." : "اختبار /api/subject-grades"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>فحص المواد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={checkSubjects}
                            disabled={loading}
                            className="w-full"
                            variant="secondary"
                        >
                            {loading ? "جاري الفحص..." : "فحص المواد في قاعدة البيانات"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>نتيجة الاختبار</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {result || "لم يتم إجراء أي اختبار بعد"}
                    </pre>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-600">
                <p>افتح Developer Tools (F12) لرؤية console logs</p>
            </div>
        </div>
    )
}

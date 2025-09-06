"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Calculator, FileText, Award } from 'lucide-react';

interface Student {
    id: string;
    studentName: string;
    nationalId: string;
    academicYear: string;
    studyLevel: string;
    studyMode: string;
    grades: {
        [period: string]: {
            month1?: number;
            month2?: number;
            month3?: number;
            periodExam?: number;
            workTotal?: number;
            periodTotal?: number;
            percentage?: number;
            grade?: string;
            gradeColor?: string;
        };
    };
}

interface ResultsData {
    student: Student;
    period: string;
    firstPeriodTotal: number;
    secondPeriodTotal: number;
    thirdPeriodTotal: number;
    finalTotal: number;
    percentage: number;
    grade: string;
    gradeColor: string;
}

export default function ResultsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [results, setResults] = useState<ResultsData[]>([]);
    const [loading, setLoading] = useState(false);
    
    // الفلاتر
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [educationLevel, setEducationLevel] = useState('السنة الأولى');
    const [studySystem, setStudySystem] = useState('نظامي');
    const [period, setPeriod] = useState('الفترة الأولى');

    // قوائم الفلاتر
    const academicYears = ['2024-2025', '2023-2024', '2022-2023'];
    const educationLevels = ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة'];
    const studySystems = ['نظامي', 'انتساب'];
    const periods = ['الفترة الأولى', 'الفترة الثانية', 'الفترة الثالثة'];

    // دالة حساب النتائج النهائية حسب الفترة المحددة
    const calculateResults = (students: Student[]): ResultsData[] => {
        return students.map(student => {
            // جلب درجات جميع الفترات
            const firstPeriodGrades = student.grades["الفترة الأولى"];
            const secondPeriodGrades = student.grades["الفترة الثانية"];
            const thirdPeriodGrades = student.grades["الفترة الثالثة"];
            
            // حساب مجموع كل فترة
            let firstPeriodTotal = 0;
            let secondPeriodTotal = 0;
            let thirdPeriodTotal = 0;
            
            if (firstPeriodGrades) {
                firstPeriodTotal = firstPeriodGrades.periodTotal || 0;
            }
            
            if (secondPeriodGrades) {
                secondPeriodTotal = secondPeriodGrades.periodTotal || 0;
            }
            
            if (thirdPeriodGrades) {
                // الفترة الثالثة: مجموع الفترتين السابقتين + امتحان الفترة الثالثة
                const thirdPeriodExam = thirdPeriodGrades.periodExam || 0;
                thirdPeriodTotal = firstPeriodTotal + secondPeriodTotal + thirdPeriodExam;
            }
            
            // حساب المجموع النهائي حسب الفترة المحددة
            let finalTotal = 0;
            let percentage = 0;
            
            if (period === 'الفترة الأولى') {
                finalTotal = firstPeriodTotal;
                percentage = (finalTotal / 100) * 100;
            } else if (period === 'الفترة الثانية') {
                finalTotal = secondPeriodTotal;
                percentage = (finalTotal / 100) * 100;
            } else if (period === 'الفترة الثالثة') {
                finalTotal = thirdPeriodTotal;
                percentage = (finalTotal / 100) * 100;
            } else {
                // جميع الفترات
                finalTotal = firstPeriodTotal + secondPeriodTotal + thirdPeriodTotal;
                percentage = (finalTotal / 100) * 100;
            }
            
            // تحديد التقدير
            let grade = 'راسب';
            let gradeColor = 'text-red-600';
            
            if (percentage >= 95) {
                grade = 'ممتاز';
                gradeColor = 'text-green-600';
            } else if (percentage >= 85) {
                grade = 'جيد جداً';
                gradeColor = 'text-blue-600';
            } else if (percentage >= 75) {
                grade = 'جيد';
                gradeColor = 'text-yellow-600';
            } else if (percentage >= 65) {
                grade = 'مقبول';
                gradeColor = 'text-orange-600';
            } else if (percentage >= 50) {
                grade = 'ضعيف';
                gradeColor = 'text-red-500';
            }

            return {
                student,
                period: period,
                firstPeriodTotal: firstPeriodTotal,
                secondPeriodTotal: secondPeriodTotal,
                thirdPeriodTotal: thirdPeriodTotal,
                finalTotal: finalTotal,
                percentage: Math.round(percentage * 100) / 100,
                grade,
                gradeColor
            };
        });
    };

    // دالة جلب الطلاب
    const loadStudents = async () => {
        setLoading(true);
        try {
            // جلب الطلاب حسب الفترة المحددة (بدون المادة الدراسية)
            const params = new URLSearchParams({
                academicYear,
                educationLevel,
                studySystem,
                period: period // استخدام الفترة المحددة في الفلتر
            });

            const response = await fetch(`/api/students/filtered?${params}`);
            const data = await response.json();
            
            if (data.students) {
                setStudents(data.students);
                const calculatedResults = calculateResults(data.students);
                setResults(calculatedResults);
            }
        } catch (error) {
            console.error('خطأ في جلب البيانات:', error);
        } finally {
            setLoading(false);
        }
    };

    // جلب البيانات عند تغيير الفلاتر
    useEffect(() => {
        loadStudents();
    }, [academicYear, educationLevel, studySystem, period]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* العنوان */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-lama-yellow">
                    النتائج النهائية - {period}
                </h1>
                <p className="text-gray-600">عرض وتقييم نتائج الطلاب في جميع المواد حسب الفترة المحددة</p>
            </div>

            {/* الفلاتر */}
            <Card className="bg-gradient-to-r from-lama-sky/10 to-lama-yellow/10 border-lama-sky">
                <CardHeader>
                    <CardTitle className="text-lama-sky flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        فلاتر البحث
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* العام الدراسي */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-lama-yellow">العام الدراسي</Label>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger className="border-lama-yellow focus:border-lama-sky">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* المرحلة التعليمية */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-lama-yellow">المرحلة التعليمية</Label>
                            <Select value={educationLevel} onValueChange={setEducationLevel}>
                                <SelectTrigger className="border-lama-yellow focus:border-lama-sky">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {educationLevels.map(level => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* نظام الدراسة */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-lama-yellow">نظام الدراسة</Label>
                            <Select value={studySystem} onValueChange={setStudySystem}>
                                <SelectTrigger className="border-lama-yellow focus:border-lama-sky">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {studySystems.map(system => (
                                        <SelectItem key={system} value={system}>{system}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* الفترة */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-lama-yellow">الفترة</Label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="border-lama-yellow focus:border-lama-sky">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="الفترة الأولى">الفترة الأولى</SelectItem>
                                    <SelectItem value="الفترة الثانية">الفترة الثانية</SelectItem>
                                    <SelectItem value="الفترة الثالثة">الفترة الثالثة</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button 
                            onClick={loadStudents}
                            disabled={loading}
                            className="bg-lama-sky hover:bg-lama-sky/90 text-white px-8 py-2 rounded-xl"
                        >
                            {loading ? 'جاري التحميل...' : 'تحديث النتائج'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* النتائج */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lama-sky flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        النتائج المحسوبة
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lama-sky mx-auto"></div>
                            <p className="mt-4 text-gray-600">جاري تحميل النتائج...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">لا توجد نتائج للعرض</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* ملخص تفصيلي للفترة المحددة */}
                            <div className="bg-gradient-to-r from-lama-sky/10 to-lama-yellow/10 p-6 rounded-xl border border-lama-sky/20">
                                <h3 className="text-xl font-bold text-lama-sky mb-4 text-center">ملخص تفصيلي - {period}</h3>
                                {period === 'الفترة الثالثة' && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                        <div className="text-sm text-orange-800 text-center">
                                            <strong>ملاحظة:</strong> الفترة الثالثة = مجموع الفترتين الأولى والثانية + امتحان الفترة الثالثة
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <div className={`bg-white p-4 rounded-lg border ${
                                        period === 'الفترة الأولى' ? 'border-blue-200' :
                                        period === 'الفترة الثانية' ? 'border-green-200' :
                                        'border-orange-200'
                                    }`}>
                                        <h4 className={`text-lg font-semibold mb-3 text-center ${
                                            period === 'الفترة الأولى' ? 'text-blue-600' :
                                            period === 'الفترة الثانية' ? 'text-green-600' :
                                            'text-orange-600'
                                        }`}>
                                            {period}
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">متوسط المجموع:</span>
                                                <span className={`font-bold ${
                                                    period === 'الفترة الأولى' ? 'text-blue-600' :
                                                    period === 'الفترة الثانية' ? 'text-green-600' :
                                                    'text-orange-600'
                                                }`}>
                                                    {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.finalTotal, 0) / results.length) : 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">أعلى درجة:</span>
                                                <span className="font-bold text-green-600">
                                                    {results.length > 0 ? Math.max(...results.map(r => r.finalTotal)) : 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">أقل درجة:</span>
                                                <span className="font-bold text-red-600">
                                                    {results.length > 0 ? Math.min(...results.map(r => r.finalTotal)) : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* إحصائيات سريعة */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                                    <div className="text-sm text-blue-800">إجمالي الطلاب</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {results.filter(r => r.grade !== 'راسب' && r.grade !== 'غير محدد').length}
                                    </div>
                                    <div className="text-sm text-green-800">ناجحون</div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {results.filter(r => r.grade === 'راسب').length}
                                    </div>
                                    <div className="text-sm text-red-800">راسبون</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0}%
                                    </div>
                                    <div className="text-sm text-yellow-800">متوسط النسبة</div>
                                </div>
                            </div>

                            {/* جدول النتائج */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-lama-sky/10">
                                            <th className="border border-lama-sky/20 p-3 text-right font-semibold text-lama-sky">اسم الطالب</th>
                                            <th className="border border-lama-sky/20 p-3 text-center font-semibold text-lama-sky">المجموع النهائي</th>
                                            <th className="border border-lama-sky/20 p-3 text-center font-semibold text-lama-sky">النسبة النهائية</th>
                                            <th className="border border-lama-sky/20 p-3 text-center font-semibold text-lama-sky">التقدير النهائي</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result, index) => (
                                            <tr key={result.student.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="border border-lama-sky/20 p-3 text-right font-medium">
                                                    {result.student.studentName}
                                                </td>
                                                <td className="border border-lama-sky/20 p-3 text-center">
                                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 font-bold">
                                                        {result.finalTotal}
                                                    </Badge>
                                                </td>
                                                <td className="border border-lama-sky/20 p-3 text-center">
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                                        {result.percentage}%
                                                    </Badge>
                                                </td>
                                                <td className="border border-lama-sky/20 p-3 text-center">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`font-bold ${result.gradeColor}`}
                                                    >
                                                        <Award className="w-4 h-4 mr-1" />
                                                        {result.grade}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* قسم التفصيل مع المادة الدراسية */}
                            <div className="bg-gradient-to-r from-lama-purple/10 to-lama-sky/10 p-6 rounded-xl border border-lama-purple/20">
                                <h3 className="text-xl font-bold text-lama-purple mb-4 text-center">التفصيل حسب المادة الدراسية</h3>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <div className="text-sm text-blue-800 text-center">
                                        <strong>ملاحظة:</strong> هذا القسم يعرض تفصيل درجات الطلاب في كل مادة دراسية حسب الفترة المحددة
                                    </div>
                                </div>
                                <div className="text-center py-8">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">سيتم إضافة التفصيل حسب المادة الدراسية قريباً</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

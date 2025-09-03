"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Calculator,
    Users,
    Trophy,
    FileSpreadsheet,
    BookOpen,
    TrendingUp,
    Settings,
    BarChart3,
    PieChart,
    ArrowRight
} from "lucide-react"
import EnhancedGradesManager from "@/components/grades-components/EnhancedGradesManager"
import FinalResultsCalculator from "@/components/grades-components/FinalResultsCalculator"

export default function EnhancedGradesPage() {
    const [activeTab, setActiveTab] = useState("grades-management")

    const features = [
        {
            icon: Calculator,
            title: "إدخال الدرجات المتقدم",
            description: "نظام إدخال درجات شامل مع التحقق التلقائي والتوزيعات المختلفة للمراحل",
            color: "from-lama-sky to-lama-yellow"
        },
        {
            icon: FileSpreadsheet,
            title: "استيراد Excel المحسن",
            description: "استيراد الدرجات من ملفات Excel مع التحقق الكامل من صحة البيانات",
            color: "from-lama-yellow to-lama-sky"
        },
        {
            icon: Trophy,
            title: "حساب النتائج النهائية",
            description: "حساب النتائج النهائية تلقائياً مع الإحصائيات والتقارير التفصيلية",
            color: "from-lama-sky to-lama-yellow"
        },
        {
            icon: BarChart3,
            title: "التقارير والإحصائيات",
            description: "تقارير شاملة وإحصائيات مفصلة عن أداء الطلاب والتوزيعات",
            color: "from-lama-yellow to-lama-sky"
        },
        {
            icon: Settings,
            title: "إدارة الأنظمة",
            description: "دعم جميع أنظمة الدراسة (نظامي/انتساب) مع القيود المناسبة",
            color: "from-lama-sky to-lama-yellow"
        },
        {
            icon: BookOpen,
            title: "توزيع الدرجات الذكي",
            description: "توزيعات مختلفة للدرجات حسب المرحلة والمادة ونظام الدراسة",
            color: "from-lama-yellow to-lama-sky"
        }
    ]

    const stats = [
        { label: "المواد الدراسية", value: "12", icon: BookOpen, color: "text-lama-yellow" },
        { label: "أنظمة الدراسة", value: "2", icon: Settings, color: "text-lama-yellow" },
        { label: "المراحل التعليمية", value: "4", icon: Users, color: "text-lama-yellow" },
        { label: "فترات التقييم", value: "3", icon: Calculator, color: "text-lama-yellow" }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light" dir="rtl">

            {/* Header الجديد */}
            <div className="bg-gradient-to-l from-lama-sky to-lama-yellow text-white" dir="rtl">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Calculator className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold font-tajawal mb-2">
                                    نظام إدارة الدرجات المتطور
                                </h1>
                                <p className="text-xl text-white/90 font-cairo">
                                    نظام شامل ومتقدم لإدارة درجات المعهد الإسلامي
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Badge className="bg-white/20 text-white text-lg px-4 py-2 backdrop-blur-sm">
                                النسخة المحدثة 2.0
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-8">

                {/* الإحصائيات السريعة */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="modern-card hover:scale-105 transition-transform">
                            <CardContent className="p-6 text-center">
                                <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* المميزات الرئيسية */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-l from-lama-yellow to-lama-sky text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <TrendingUp className="w-6 h-6" />
                            المميزات الرئيسية للنظام
                        </CardTitle>
                        <CardDescription className="text-white/90">
                            نظام متكامل يدعم جميع متطلبات إدارة الدرجات في المعهد
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <div className="p-6 rounded-2xl border-2 border-gray-200 hover:border-lama-sky transition-all hover:shadow-xl bg-white/50 backdrop-blur-sm">
                                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* نظام التبويبات الرئيسي */}
                <Card className="modern-card">
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="flex w-full bg-white/80 shadow-xl rounded-t-3xl p-2" dir="rtl">
                                <TabsTrigger
                                    value="grades-management"
                                    className="flex-1 data-[state=active]:bg-gradient-to-l data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-2xl text-lg py-4 font-semibold transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <Calculator className="w-6 h-6" />
                                        إدارة الدرجات
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="final-results"
                                    className="flex-1 data-[state=active]:bg-gradient-to-l data-[state=active]:from-lama-sky data-[state=active]:to-lama-yellow data-[state=active]:text-white rounded-2xl text-lg py-4 font-semibold transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <Trophy className="w-6 h-6" />
                                        النتائج النهائية
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="grades-management" className="mt-0">
                                <EnhancedGradesManager />
                            </TabsContent>

                            <TabsContent value="final-results" className="mt-0">
                                <FinalResultsCalculator />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* معلومات النظام */}
                <Card className="modern-card">
                    <CardHeader className="bg-gradient-to-l from-lama-yellow to-lama-sky text-white rounded-t-3xl">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <BookOpen className="w-6 h-6" />
                            معلومات مهمة عن النظام
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-lama-yellow text-xl mb-4">النظام يدعم:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-yellow rounded-full"></div>
                                        <span>جميع المراحل التعليمية (الأولى، الثانية، الثالثة، التخرج)</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-yellow rounded-full"></div>
                                        <span>أنظمة الدراسة المختلفة (نظامي، انتساب)</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-yellow rounded-full"></div>
                                        <span>توزيعات درجات مختلفة للسنة الثالثة</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-yellow rounded-full"></div>
                                        <span>قيود خاصة لطالبات الدبلوم المنتسبات</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-yellow rounded-full"></div>
                                        <span>حساب النتائج النهائية تلقائياً</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-lama-yellow text-xl mb-4">المميزات الجديدة:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-sky rounded-full"></div>
                                        <span>تصميم محدث بألوان Lama الجديدة</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-sky rounded-full"></div>
                                        <span>واجهة مستخدم محسنة وسهلة الاستخدام</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-sky rounded-full"></div>
                                        <span>التحقق التلقائي من صحة البيانات</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-sky rounded-full"></div>
                                        <span>استيراد Excel محسن مع تقارير مفصلة</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-lama-sky rounded-full"></div>
                                        <span>إحصائيات وتقارير شاملة</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span className="font-tajawal">المعهد المتوسط للدراسات الإسلامية - عثمان بن عفان</span>
                        <ArrowRight className="w-5 h-5" />
                        <span className="font-cairo">نظام إدارة الدرجات المتطور</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        © 2024 جميع الحقوق محفوظة - النسخة 2.0
                    </div>
                </div>
            </div>
        </div>
    )
}

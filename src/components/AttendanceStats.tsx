"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
    CalendarIcon, 
    Users, 
    UserCheck, 
    UserX, 
    TrendingUp, 
    TrendingDown,
    Download,
    Filter,
    BarChart3,
    PieChart,
    Activity,
    Clock,
    Target,
    Award,
    AlertCircle
} from "lucide-react";


interface AttendanceStatsProps {
    classId?: string;
}

interface Stats {
    totalStudents: number;
    present: number;
    absent: number;
    attendanceRate: number;
    previousDayRate: number;
    trend: "up" | "down" | "stable";
}

const AttendanceStats = ({ classId }: AttendanceStatsProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [stats, setStats] = useState<Stats>({
        totalStudents: 0,
        present: 0,
        absent: 0,
        attendanceRate: 0,
        previousDayRate: 0,
        trend: "stable",
    });
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // جلب الإحصائيات
    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedDate) return;

            setLoading(true);
            try {
                const params = new URLSearchParams({
                    date: selectedDate.toISOString(),
                });

                if (classId) {
                    params.append("classId", classId);
                }

                const response = await fetch(`/api/attendance/stats?${params}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("خطأ في جلب الإحصائيات:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedDate, classId]);

    // حساب الاتجاه
    const getTrendIcon = () => {
        if (stats.trend === "up") {
            return <TrendingUp className="w-5 h-5 text-green-600" />;
        } else if (stats.trend === "down") {
            return <TrendingDown className="w-5 h-5 text-red-600" />;
        }
        return <div className="w-5 h-5 text-lama-dark-gray">─</div>;
    };

    const getTrendText = () => {
        if (stats.trend === "up") {
            return "تحسن";
        } else if (stats.trend === "down") {
            return "تراجع";
        }
        return "مستقر";
    };

    const getTrendColor = () => {
        if (stats.trend === "up") {
            return "text-green-600";
        } else if (stats.trend === "down") {
            return "text-red-600";
        }
        return "text-lama-dark-gray";
    };

    // دالة تصدير التقرير
    const handleExportReport = async () => {
        setExporting(true);
        try {
            // محاكاة عملية التصدير
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // إنشاء محتوى التقرير
            const reportContent = `
تقرير إحصائيات الحضور
التاريخ: ${selectedDate.toLocaleDateString('ar-SA')}

إجمالي الطلاب: ${stats.totalStudents}
الطلاب الحاضرون: ${stats.present} (${((stats.present / stats.totalStudents) * 100).toFixed(1)}%)
الطلاب الغائبون: ${stats.absent} (${((stats.absent / stats.totalStudents) * 100).toFixed(1)}%)
معدل الحضور: ${stats.attendanceRate.toFixed(1)}%
معدل اليوم السابق: ${stats.previousDayRate.toFixed(1)}%
الاتجاه: ${getTrendText()}
            `;
            
            // إنشاء ملف وتحميله
            const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `attendance-report-${selectedDate.toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('خطأ في تصدير التقرير:', error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-lama-sky/20 hover:shadow-xl transition-all duration-300 animate-pulse-slow">
                        <BarChart3 className="w-6 h-6 text-lama-yellow" />
                        <h1 className="text-2xl font-bold text-lama-black font-tajawal">إحصائيات الحضور</h1>
                        <Activity className="w-5 h-5 text-lama-sky" />
                    </div>
                    <p className="text-lama-dark-gray font-medium">مراقبة ومتابعة معدلات الحضور اليومية</p>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-lama-sky/20 hover:shadow-xl transition-all duration-300">
                        <Filter className="w-5 h-5 text-lama-yellow" />
                <Popover>
                    <PopoverTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2 bg-lama-purple-light hover:bg-lama-purple border-lama-sky text-lama-black font-medium"
                                >
                            <CalendarIcon className="w-4 h-4" />
                            <span>{selectedDate.toLocaleDateString('ar-SA')}</span>
                                </Button>
                    </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border-lama-sky">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

                    <Button 
                        variant="outline" 
                        className="bg-lama-sky hover:bg-lama-yellow text-white border-lama-yellow font-medium disabled:opacity-50"
                        onClick={handleExportReport}
                        disabled={exporting || loading}
                    >
                        {exporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                                جاري التصدير...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 ml-2" />
                                تصدير التقرير
                            </>
                        )}
                    </Button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-lama-sky-light border-t-lama-yellow mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-lama-yellow animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-lama-dark-gray font-medium">جاري تحميل الإحصائيات...</p>
                </div>
            ) : (
                    <>
                        {/* Main Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                                                {/* إجمالي الطلاب */}
                            <Card className="bg-white/90 backdrop-blur-sm border-lama-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium text-lama-black font-tajawal">إجمالي الطلاب</CardTitle>
                                    <div className="p-2 bg-lama-sky-light rounded-full group-hover:bg-lama-sky transition-colors duration-300">
                                        <Users className="h-5 w-5 text-lama-yellow group-hover:text-white transition-colors duration-300" />
                                    </div>
                        </CardHeader>
                        <CardContent>
                                    <div className="text-3xl font-bold text-lama-black mb-1">{stats.totalStudents}</div>
                                    <p className="text-sm text-lama-dark-gray font-medium">طالب مسجل</p>
                                    <div className="mt-3 w-full bg-lama-purple-light rounded-full h-2 overflow-hidden">
                                        <div className="bg-lama-sky h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: "100%" }}></div>
                                    </div>
                        </CardContent>
                    </Card>

                                                {/* الطلاب الحاضرون */}
                            <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium text-lama-black font-tajawal">الحاضرون</CardTitle>
                                    <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-600 transition-colors duration-300">
                                        <UserCheck className="h-5 w-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                        </CardHeader>
                        <CardContent>
                                    <div className="text-3xl font-bold text-green-600 mb-1">{stats.present}</div>
                                    <p className="text-sm text-lama-dark-gray font-medium">
                                        {stats.totalStudents > 0 ? `${((stats.present / stats.totalStudents) * 100).toFixed(1)}% من الإجمالي` : "0%"}
                                    </p>
                                    <div className="mt-3 w-full bg-green-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${stats.totalStudents > 0 ? (stats.present / stats.totalStudents) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                        </CardContent>
                    </Card>

                                                {/* الطلاب الغائبون */}
                            <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium text-lama-black font-tajawal">الغائبون</CardTitle>
                                    <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-600 transition-colors duration-300">
                                        <UserX className="h-5 w-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                        </CardHeader>
                        <CardContent>
                                    <div className="text-3xl font-bold text-red-600 mb-1">{stats.absent}</div>
                                    <p className="text-sm text-lama-dark-gray font-medium">
                                        {stats.totalStudents > 0 ? `${((stats.absent / stats.totalStudents) * 100).toFixed(1)}% من الإجمالي` : "0%"}
                                    </p>
                                    <div className="mt-3 w-full bg-red-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${stats.totalStudents > 0 ? (stats.absent / stats.totalStudents) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                        </CardContent>
                    </Card>

                                                {/* معدل الحضور */}
                            <Card className="bg-white/90 backdrop-blur-sm border-lama-yellow/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium text-lama-black font-tajawal">معدل الحضور</CardTitle>
                                                                        <div className="p-2 bg-lama-yellow-light rounded-full group-hover:bg-lama-yellow transition-colors duration-300">
                                        <div className="group-hover:text-white transition-colors duration-300">
                                            {getTrendIcon()}
                                        </div>
                                    </div>
                        </CardHeader>
                        <CardContent>
                                    <div className="text-3xl font-bold text-lama-yellow mb-1">{stats.attendanceRate.toFixed(1)}%</div>
                                    <div className="flex items-center gap-2">
                                        <Badge 
                                            variant="outline" 
                                            className={`text-xs font-medium ${
                                                stats.trend === "up" ? "bg-green-100 text-green-700 border-green-300" :
                                                stats.trend === "down" ? "bg-red-100 text-red-700 border-red-300" :
                                                "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                            {getTrendText()}
                                        </Badge>
                                        <span className="text-xs text-lama-dark-gray">من اليوم السابق</span>
                                    </div>
                                    <div className="mt-3 w-full bg-lama-purple-light rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-lama-yellow h-2 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${stats.attendanceRate}%` }}
                                        ></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        {stats.totalStudents > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                                {/* Attendance Rate Chart */}
                                <Card className="bg-white/90 backdrop-blur-sm border-lama-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-lama-sky-light rounded-full hover:bg-lama-sky transition-colors duration-300">
                                                <BarChart3 className="h-5 w-5 text-lama-yellow hover:text-white transition-colors duration-300" />
                                            </div>
                                            <CardTitle className="text-lg font-bold text-lama-black font-tajawal">معدل الحضور اليومي</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative">
                                            <div className="w-full bg-lama-purple-light rounded-full h-6 overflow-hidden shadow-inner">
                                                <div
                                                    className="bg-gradient-to-r from-lama-sky to-lama-yellow h-6 rounded-full transition-all duration-1000 ease-out relative shadow-lg"
                                                    style={{ width: `${stats.attendanceRate}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm text-lama-dark-gray mt-2 font-medium">
                                                <span>0%</span>
                                                <span className="text-lama-yellow font-bold">{stats.attendanceRate.toFixed(1)}%</span>
                                                <span>100%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-lama-sky/20">
                                            <div className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                                                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                                                <div className="text-sm text-lama-dark-gray font-medium">حاضر</div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300">
                                                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                                                <div className="text-sm text-lama-dark-gray font-medium">غائب</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Performance Insights */}
                                <Card className="bg-white/90 backdrop-blur-sm border-lama-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-lama-yellow-light rounded-full hover:bg-lama-yellow transition-colors duration-300">
                                                <Target className="h-5 w-5 text-lama-yellow hover:text-white transition-colors duration-300" />
                                            </div>
                                            <CardTitle className="text-lg font-bold text-lama-black font-tajawal">تحليل الأداء</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-lama-purple-light rounded-lg hover:bg-lama-purple transition-colors duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-lama-sky" />
                                                    <span className="text-sm font-medium text-lama-black">معدل اليوم السابق</span>
                                                </div>
                                                <span className="text-sm font-bold text-lama-dark-gray">{stats.previousDayRate.toFixed(1)}%</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-3 bg-lama-sky-light rounded-lg hover:bg-lama-sky transition-colors duration-300">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-lama-yellow" />
                                                    <span className="text-sm font-medium text-lama-black">التغيير</span>
                                                </div>
                                                <span className={`text-sm font-bold ${
                                                    stats.trend === "up" ? "text-green-600" :
                                                    stats.trend === "down" ? "text-red-600" :
                                                    "text-lama-dark-gray"
                                                }`}>
                                                    {stats.trend === "up" ? "+" : stats.trend === "down" ? "-" : ""}
                                                    {Math.abs(stats.attendanceRate - stats.previousDayRate).toFixed(1)}%
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between p-3 bg-lama-yellow-light rounded-lg hover:bg-lama-yellow transition-colors duration-300">
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-lama-yellow" />
                                                    <span className="text-sm font-medium text-lama-black">التقييم</span>
                                                </div>
                                                <Badge 
                                                    variant="outline"
                                                    className={`text-xs font-medium ${
                                                        stats.attendanceRate >= 90 ? "bg-green-100 text-green-700 border-green-300" :
                                                        stats.attendanceRate >= 75 ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                                                        "bg-red-100 text-red-700 border-red-300"
                                                    }`}
                                                >
                                                    {stats.attendanceRate >= 90 ? "ممتاز" :
                                                     stats.attendanceRate >= 75 ? "جيد" : "يحتاج تحسين"}
                                                </Badge>
                                            </div>
                                        </div>
                        </CardContent>
                    </Card>
                </div>
            )}

                        {/* Summary Section */}
                        <Card className="bg-gradient-to-r from-lama-sky-light to-lama-purple-light border-lama-sky/30 shadow-xl animate-fade-in hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="text-center space-y-4">
                                                                        <div className="flex items-center justify-center gap-3">
                                        <AlertCircle className="h-6 w-6 text-lama-yellow animate-pulse" />
                                        <h3 className="text-xl font-bold text-lama-black font-tajawal">ملخص اليوم</h3>
                                    </div>
                                    <p className="text-lama-dark-gray font-medium max-w-2xl mx-auto leading-relaxed p-4 bg-white/50 rounded-lg backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                                        {stats.attendanceRate >= 90 ? 
                                            "معدل حضور ممتاز! الطلاب يظهرون التزاماً عالياً بالحضور." :
                                            stats.attendanceRate >= 75 ?
                                            "معدل حضور جيد، مع إمكانية للتحسين." :
                                            "يُنصح بمراجعة أسباب الغياب واتخاذ الإجراءات المناسبة."
                                        }
                                    </p>
                        </div>
                    </CardContent>
                </Card>
                    </>
            )}
            </div>
        </div>
    );
};

export default AttendanceStats;

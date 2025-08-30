"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Users, UserCheck, UserX, TrendingUp, TrendingDown } from "lucide-react";


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
            return <TrendingDown className="w-5 h-4 text-red-600" />;
        }
        return <div className="w-5 h-5 text-gray-400">─</div>;
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
        return "text-gray-600";
    };

    return (
        <div className="space-y-6">
            {/* اختيار التاريخ */}
            <div className="flex justify-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{selectedDate.toLocaleDateString('ar-SA')}</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* الإحصائيات */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">جاري تحميل الإحصائيات...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* إجمالي الطلاب */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalStudents}</div>
                            <p className="text-xs text-muted-foreground">طالب</p>
                        </CardContent>
                    </Card>

                    {/* الطلاب الحاضرون */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">الحاضرون</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalStudents > 0 ? `${((stats.present / stats.totalStudents) * 100).toFixed(1)}%` : "0%"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* الطلاب الغائبون */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">الغائبون</CardTitle>
                            <UserX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.totalStudents > 0 ? `${((stats.absent / stats.totalStudents) * 100).toFixed(1)}%` : "0%"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* معدل الحضور */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">معدل الحضور</CardTitle>
                            {getTrendIcon()}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</div>
                            <p className={`text-xs ${getTrendColor()}`}>
                                {getTrendText()} من اليوم السابق
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* رسم بياني بسيط */}
            {stats.totalStudents > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">معدل الحضور</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${stats.attendanceRate}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>0%</span>
                            <span>{stats.attendanceRate.toFixed(1)}%</span>
                            <span>100%</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AttendanceStats;

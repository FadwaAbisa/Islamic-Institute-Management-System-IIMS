import { Suspense } from "react";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import AttendanceStats from "@/components/AttendanceStats";
import { auth } from "@clerk/nextjs/server";

const AttendanceStatsPage = () => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">إحصائيات الحضور والغياب</h1>
                <div className="text-sm text-gray-500">
                    العام الدراسي 2024-2025
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="mb-8">
                <Suspense fallback="جاري التحميل...">
                    <AttendanceStats />
                </Suspense>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* الرسم البياني الأسبوعي */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">إحصائيات أسبوعية</h2>
                    <div className="h-[300px]">
                        <Suspense fallback="جاري التحميل...">
                            <AttendanceChartContainer />
                        </Suspense>
                    </div>
                </div>

                {/* إحصائيات إضافية */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">تفاصيل إضافية</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span>أعلى نسبة حضور</span>
                            <span className="font-bold text-green-600">95%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span>متوسط الحضور</span>
                            <span className="font-bold text-blue-600">87%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span>أقل نسبة حضور</span>
                            <span className="font-bold text-red-600">72%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ملاحظات */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">ملاحظات هامة:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• يتم تحديث البيانات كل 15 دقيقة</li>
                    <li>• النسب المعروضة تشمل جميع الحصص المسجلة</li>
                    <li>• يمكن تصدير التقارير من قسم الإعدادات</li>
                </ul>
            </div>
        </div>
    );
};

export default AttendanceStatsPage;

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const AttendanceStats = async () => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    // حساب إحصائيات مختلفة حسب الدور
    let whereCondition: any = {};

    switch (role) {
        case "admin":
            break;
        case "teacher":
            whereCondition.lesson = {
                teacherId: currentUserId!,
            };
            break;
        case "student":
            whereCondition.studentId = currentUserId!;
            break;
        case "parent":
            whereCondition.student = {
                parentId: currentUserId!,
            };
            break;
    }

    // إحصائيات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await prisma.attendance.groupBy({
        by: ["present"],
        where: {
            ...whereCondition,
            date: {
                gte: today,
                lt: tomorrow,
            },
        },
        _count: {
            id: true,
        },
    });

    // إحصائيات هذا الأسبوع
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysSinceMonday);

    const weekStats = await prisma.attendance.groupBy({
        by: ["present"],
        where: {
            ...whereCondition,
            date: {
                gte: startOfWeek,
            },
        },
        _count: {
            id: true,
        },
    });

    // إحصائيات هذا الشهر
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthStats = await prisma.attendance.groupBy({
        by: ["present"],
        where: {
            ...whereCondition,
            date: {
                gte: startOfMonth,
            },
        },
        _count: {
            id: true,
        },
    });

    // حساب النسب
    const calculateStats = (stats: any[]) => {
        const present = stats.find((s) => s.present === true)?._count.id || 0;
        const absent = stats.find((s) => s.present === false)?._count.id || 0;
        const total = present + absent;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";
        return { present, absent, total, percentage };
    };

    const todayData = calculateStats(todayStats);
    const weekData = calculateStats(weekStats);
    const monthData = calculateStats(monthStats);

    const StatCard = ({
        title,
        data,
        bgColor,
        iconColor
    }: {
        title: string;
        data: any;
        bgColor: string;
        iconColor: string;
    }) => (
        <div className={`${bgColor} rounded-2xl p-4 min-h-[100px]`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col h-full">
                    <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600 w-fit">
                        {title}
                    </span>
                    <h1 className="text-2xl font-semibold my-4">{data.percentage}%</h1>
                    <h2 className="capitalize text-sm font-medium text-gray-500">
                        {data.present} حاضر من أصل {data.total}
                    </h2>
                </div>
                <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center`}>
                    📊
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
                title="اليوم"
                data={todayData}
                bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
                iconColor="bg-blue-500"
            />
            <StatCard
                title="هذا الأسبوع"
                data={weekData}
                bgColor="bg-gradient-to-r from-green-50 to-green-100"
                iconColor="bg-green-500"
            />
            <StatCard
                title="هذا الشهر"
                data={monthData}
                bgColor="bg-gradient-to-r from-purple-50 to-purple-100"
                iconColor="bg-purple-500"
            />
        </div>
    );
};

export default AttendanceStats;

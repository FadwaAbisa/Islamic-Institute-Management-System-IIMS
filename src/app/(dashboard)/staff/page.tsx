"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import RoleGuard from "@/components/RoleGuard";
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  Calendar, 
  BarChart3, 
  BookOpen,
  Bell,
  TrendingUp
} from "lucide-react";

interface DashboardCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  href: string;
  description: string;
}

const StaffDashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAttendance: 0,
    totalEvents: 0
  });

  useEffect(() => {
    if (isLoaded && user) {
      // تحميل الإحصائيات (يمكن استبدالها بطلبات API حقيقية)
      loadDashboardStats();
    }
  }, [isLoaded, user]);

  const loadDashboardStats = async () => {
    try {
      // هنا يمكن إضافة طلبات API لجلب الإحصائيات الحقيقية
      // للآن سنستخدم بيانات تجريبية
      setStats({
        totalStudents: 245,
        totalClasses: 12,
        totalAttendance: 89,
        totalEvents: 8
      });
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "إجمالي الطلاب",
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "bg-blue-500",
      href: "/list/students",
      description: "عدد الطلاب المسجلين في النظام"
    },
    {
      title: "إجمالي الفصول",
      value: stats.totalClasses.toString(),
      icon: GraduationCap,
      color: "bg-green-500",
      href: "/list/classes",
      description: "عدد الفصول الدراسية"
    },
    {
      title: "نسبة الحضور",
      value: `${stats.totalAttendance}%`,
      icon: ClipboardCheck,
      color: "bg-yellow-500",
      href: "/list/attendance",
      description: "متوسط نسبة الحضور اليومي"
    },
    {
      title: "الأحداث القادمة",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: "bg-purple-500",
      href: "/list/events",
      description: "عدد الأحداث المدرسية القادمة"
    }
  ];

  const quickActions = [
    {
      title: "إضافة طالب جديد",
      description: "تسجيل طالب جديد في النظام",
      icon: Users,
      href: "/list/students/add",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    {
      title: "تسجيل الحضور",
      description: "تسجيل حضور وغياب الطلاب",
      icon: ClipboardCheck,
      href: "/list/attendance/mark",
      color: "bg-green-50 text-green-600 hover:bg-green-100"
    },
    {
      title: "إضافة درجات",
      description: "إدخال درجات الطلاب",
      icon: BarChart3,
      href: "/grades/add-grades",
      color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
    },
    {
      title: "إدارة الأحداث",
      description: "إنشاء وإدارة الأحداث المدرسية",
      icon: Calendar,
      href: "/list/events",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100"
    }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الموظف الإداري</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(card.href)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* الإجراءات السريعة */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border border-gray-200 cursor-pointer transition-all hover:scale-105 ${action.color}`}
                onClick={() => router.push(action.href)}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <action.icon className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* آخر الأنشطة */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">آخر الأنشطة</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">تم تسجيل حضور 45 طالب في الفصل 1أ</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">تم إضافة طالب جديد: أحمد محمد</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">تم تحديث درجات الفصل 2ب</span>
              </div>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الطلاب الجدد هذا الشهر</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">متوسط الحضور</span>
                <span className="font-semibold text-green-600">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الأحداث هذا الأسبوع</span>
                <span className="font-semibold text-purple-600">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
};

export default StaffDashboard;


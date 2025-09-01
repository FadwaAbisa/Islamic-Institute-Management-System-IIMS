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
  TrendingUp,
  Plus,
  Eye,
  Settings,
  Activity,
  Clock,
  Award,
  Star,
  Target,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface DashboardCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
  href: string;
  description: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

interface Activity {
  type: 'success' | 'warning' | 'info';
  message: string;
  time: string;
  icon: any;
}

interface StaffStats {
  totalStudents: number;
  attendancePercentage: number;
  upcomingEvents: number;
  recentActivities: {
    lastAttendance: {
      studentName: string;
      date: string;
    } | null;
    lastStudentAdded: {
      studentName: string;
      date: string;
    } | null;
  };
}

const StaffDashboard = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<StaffStats>({
    totalStudents: 0,
    attendancePercentage: 0,
    upcomingEvents: 0,
    recentActivities: {
      lastAttendance: null,
      lastStudentAdded: null
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadDashboardStats();
    }
  }, [isLoaded, user]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('خطأ في جلب الإحصائيات');
      }
    } catch (error) {
      console.error('خطأ في تحميل الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "إجمالي الطلاب",
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "text-lama-sky",
      bgColor: "bg-gradient-to-br from-lama-sky to-lama-sky-light",
      href: "/list/students",
      description: "عدد الطلاب المسجلين في النظام",
      trend: "up",
      trendValue: "+12"
    },
    {
      title: "نسبة الحضور",
      value: `${stats.attendancePercentage}%`,
      icon: ClipboardCheck,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-500 to-green-400",
      href: "/list/attendance",
      description: "متوسط نسبة الحضور اليومي",
      trend: "up",
      trendValue: "+5%"
    },
    {
      title: "الأحداث القادمة",
      value: stats.upcomingEvents.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-400",
      href: "/list/events",
      description: "عدد الأحداث المدرسية القادمة",
      trend: "down",
      trendValue: "-1"
    }
  ];

  const quickActions = [
    {
      title: "إضافة طالب جديد",
      description: "تسجيل طالب جديد في النظام",
      icon: Plus,
      href: "/list/students/add",
      color: "from-lama-sky to-lama-sky-light",
      textColor: "text-lama-sky"
    },
    {
      title: "تسجيل الحضور",
      description: "تسجيل حضور وغياب الطلاب",
      icon: ClipboardCheck,
      href: "/list/attendance/mark",
      color: "from-green-500 to-green-400",
      textColor: "text-green-600"
    },
    {
      title: "إضافة درجات",
      description: "إدخال درجات الطلاب",
      icon: BarChart3,
      href: "/grades/add-grades",
      color: "from-lama-yellow to-lama-yellow-light",
      textColor: "text-lama-yellow"
    },
    {
      title: "إدارة الأحداث",
      description: "إنشاء وإدارة الأحداث المدرسية",
      icon: Calendar,
      href: "/list/events",
      color: "from-purple-500 to-purple-400",
      textColor: "text-purple-600"
    }
  ];

  const getRecentActivities = (): Activity[] => {
    const activities: Activity[] = [];
    
    if (stats.recentActivities.lastAttendance) {
      activities.push({
        type: "success",
        message: `تم تسجيل حضور طالب في الفصل`,
        time: "منذ 5 دقائق",
        icon: CheckCircle
      });
    }
    
    if (stats.recentActivities.lastStudentAdded) {
      const date = new Date(stats.recentActivities.lastStudentAdded.date);
      const timeAgo = getTimeAgo(date);
      activities.push({
        type: "info",
        message: `تم إضافة طالب جديد: ${stats.recentActivities.lastStudentAdded.studentName}`,
        time: timeAgo,
        icon: Info
      });
    }
    
    // إضافة أنشطة افتراضية إذا لم تكن هناك أنشطة حقيقية
    if (activities.length === 0) {
      activities.push(
        {
          type: "success",
          message: "تم تسجيل حضور 45 طالب في الفصل 1أ",
          time: "منذ 5 دقائق",
          icon: CheckCircle
        },
        {
          type: "warning",
          message: "تم تحديث درجات الفصل 2ب",
          time: "منذ ساعة",
          icon: AlertCircle
        }
      );
    }
    
    return activities;
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      return `منذ ${diffInDays} يوم`;
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lama-purple-light to-lama-purple flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lama-sky border-t-lama-yellow rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lama-yellow text-lg font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['staff', 'admin']}>
      <div className="min-h-screen bg-gradient-to-br from-lama-purple-light to-lama-purple">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-lama-sky/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-lama-sky to-lama-yellow rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="mr-6">
                  <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الموظف الإداري</h1>
                  <p className="text-lg text-lama-sky font-medium">مرحباً {user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button className="w-12 h-12 bg-gradient-to-br from-lama-purple to-lama-purple-light rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Bell className="w-6 h-6 text-lama-yellow" />
                  </button>
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-lama-sky to-lama-yellow rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-lama-sky/20 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                onClick={() => router.push(card.href)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${card.trend === 'up' ? 'rotate-0' : 'rotate-180'}`} />
                      {card.trendValue}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* الإجراءات السريعة */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-lama-sky/20 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-lama-sky to-lama-yellow rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">الإجراءات السريعة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-lama-purple-light to-white rounded-xl border border-lama-sky/20 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* آخر الأنشطة */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-lama-sky/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-lama-sky to-lama-yellow rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">آخر الأنشطة</h2>
              </div>
              <div className="space-y-4">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-lama-purple-light/50 rounded-xl border border-lama-sky/20">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'success' ? 'bg-green-100' :
                      activity.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <activity.icon className={`w-4 h-4 ${
                        activity.type === 'success' ? 'text-green-600' :
                        activity.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 mb-1">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-lama-sky/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-lama-sky to-lama-yellow rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">إحصائيات سريعة</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-lama-purple-light to-white rounded-xl border border-lama-sky/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">إجمالي الطلاب</span>
                  </div>
                  <span className="text-xl font-bold text-lama-sky">{stats.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-lama-purple-light to-white rounded-xl border border-lama-sky/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">نسبة الحضور اليوم</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{stats.attendancePercentage}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-lama-purple-light to-white rounded-xl border border-lama-sky/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">الأحداث القادمة</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">{stats.upcomingEvents}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-lama-purple-light to-white rounded-xl border border-lama-sky/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-lama-yellow/20 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-lama-yellow" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">آخر تحديث</span>
                  </div>
                  <span className="text-sm font-bold text-lama-yellow">الآن</span>
                </div>
              </div>
            </div>
          </div>

          {/* رسالة ترحيب إضافية */}
          <div className="mt-8 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-2xl shadow-xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">مرحباً بك في نظام البيان</h3>
              <Star className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/90 text-lg">نظام إدارة المعهد الإسلامي - نساعدك في إدارة شؤون الطلاب والمعلمين بكفاءة عالية</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default StaffDashboard;


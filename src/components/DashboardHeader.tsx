"use client";

import { MessageSquare, Bell, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// مكون عداد الرسائل
function MessageCounter() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.publicMetadata?.role) return;
      
      try {
        const response = await fetch(`/api/messages/unread?userType=${user.publicMetadata.role}`);
        if (response.ok) {
          const messages = await response.json();
          setUnreadCount(messages.length);
        }
      } catch (error) {
        console.error('خطأ في جلب عدد الرسائل غير المقروءة:', error);
      }
    };

    fetchUnreadCount();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.publicMetadata?.role]);

  return unreadCount > 0 ? (
    <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-semibold shadow-lg border-2 border-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  ) : null;
}

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>

      {/* مجموعة الأزرار */}
      <div className="flex items-center gap-3">
        {/* زر الرسائل */}
        <Link href="/list/messages/working" className="relative">
          <button className="relative p-3 rounded-xl bg-gradient-to-br from-lama-purple to-lama-purple-light hover:from-lama-sky-light hover:to-lama-purple transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <MessageSquare className="w-5 h-5 text-lama-yellow group-hover:text-lama-sky transition-colors duration-300" />
            <MessageCounter />
          </button>
        </Link>

        {/* زر الإشعارات */}
        <Link href="/list/announcements" className="relative">
          <button className="relative p-3 rounded-xl bg-gradient-to-br from-lama-purple to-lama-purple-light hover:from-lama-sky-light hover:to-lama-purple transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <Bell className="w-5 h-5 text-lama-yellow group-hover:text-lama-sky transition-colors duration-300" />
            {/* نقطة التنبيه */}
            <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg border-2 border-white animate-pulse"></span>
          </button>
        </Link>

        {/* زر الملف الشخصي */}
        <Link href="/profile" className="relative">
          <button className="relative p-3 rounded-xl bg-gradient-to-br from-lama-purple to-lama-purple-light hover:from-lama-sky-light hover:to-lama-purple transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <User className="w-5 h-5 text-lama-yellow group-hover:text-lama-sky transition-colors duration-300" />
          </button>
        </Link>

        {/* خط فاصل */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-lama-sky to-transparent opacity-50"></div>

        {/* زر العودة للرئيسية (واجهة الموقع) */}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-lama-sky to-lama-yellow text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageCircle, Bell } from "lucide-react";

interface MessageNotificationsProps {
  userType: string;
  onUnreadCountChange?: (count: number) => void;
}

const MessageNotifications = ({ userType, onUnreadCountChange }: MessageNotificationsProps) => {
  const { user } = useUser();
  const userId = user?.id;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId || !userType) return;

      try {
        const response = await fetch(`/api/messages?userType=${userType}`);
        if (response.ok) {
          const conversations = await response.json();
          
          // حساب عدد الرسائل غير المقروءة
          let count = 0;
          conversations.forEach((conv: any) => {
            if (conv.lastMessage && 
                conv.lastMessage.senderId !== userId && 
                !conv.lastMessage.readAt) {
              count++;
            }
          });
          
          setUnreadCount(count);
          onUnreadCountChange?.(count);
        }
      } catch (error) {
        console.error("خطأ في جلب عدد الرسائل غير المقروءة:", error);
      }
    };

    fetchUnreadCount();

    // تحديث العدد كل دقيقة
    const interval = setInterval(fetchUnreadCount, 60000);

    return () => clearInterval(interval);
  }, [userId, userType, onUnreadCountChange]);

  if (unreadCount === 0) return null;

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-white">
        {unreadCount > 99 ? "99+" : unreadCount}
      </div>
    </div>
  );
};

export default MessageNotifications;

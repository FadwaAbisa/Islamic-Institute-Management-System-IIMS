"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';

interface UnreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  conversationId: string;
}

interface MessagesContextType {
  unreadMessages: UnreadMessage[];
  unreadCount: number;
  addUnreadMessage: (message: UnreadMessage) => void;
  markAsRead: (conversationId: string) => void;
  markAllAsRead: () => void;
  fetchUnreadMessages: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب الرسائل غير المقروءة من API
  const fetchUnreadMessages = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // تحديد نوع المستخدم من Clerk
      const userType = user?.publicMetadata?.role || localStorage.getItem("userRole") || "STUDENT";
      console.log(`📊 Fetching unread messages for user: ${user.id} (${userType})`);
      
      const response = await fetch(`/api/messages/unread?userType=${userType.toString().toUpperCase()}`);
      if (!response.ok) {
        throw new Error('فشل في جلب الرسائل غير المقروءة');
      }
      const data = await response.json();
      console.log(`📬 Found ${data.length} unread messages from API:`, data);
      setUnreadMessages(data);
    } catch (err) {
      console.error("خطأ في جلب الرسائل غير المقروءة:", err);
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // جلب الرسائل عند تحميل المكون أو تغيير المستخدم
  useEffect(() => {
    if (user) {
      fetchUnreadMessages();
      
      // إعداد تحديث دوري كل 30 ثانية
      const interval = setInterval(fetchUnreadMessages, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user?.id, user?.publicMetadata?.role]);

  // إضافة رسالة غير مقروءة جديدة
  const addUnreadMessage = (message: UnreadMessage) => {
    setUnreadMessages(prev => {
      // تجنب التكرار
      const exists = prev.some(msg => msg.id === message.id);
      if (exists) return prev;
      
      return [message, ...prev];
    });
  };

  // تعيين محادثة كمقروءة
  const markAsRead = (conversationId: string) => {
    setUnreadMessages(prev => 
      prev.filter(msg => msg.conversationId !== conversationId)
    );
  };

  // تعيين جميع الرسائل كمقروءة
  const markAllAsRead = () => {
    setUnreadMessages([]);
  };

  // حساب العدد الإجمالي للرسائل غير المقروءة
  const unreadCount = unreadMessages.length;
  console.log(`🔢 Current unread count: ${unreadCount}`, unreadMessages);

  const value: MessagesContextType = {
    unreadMessages,
    unreadCount,
    addUnreadMessage,
    markAsRead,
    markAllAsRead,
    fetchUnreadMessages,
    loading,
    error
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}

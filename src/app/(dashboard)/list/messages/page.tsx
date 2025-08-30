"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Search, Plus, MessageCircle, Clock, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NewMessageForm from "@/components/NewMessageForm";

interface Conversation {
  id: string;
  lastMessageAt: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  otherParticipant: {
    id: string;
    fullName: string;
    studentPhoto?: string;
    type: string;
  };
}

interface User {
  id: string;
  fullName: string;
  type: string;
  avatar?: string;
}

const MessagesPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [userType, setUserType] = useState<string>("STUDENT");

  // تحديد نوع المستخدم الحالي من Clerk
  useEffect(() => {
    const determineUserType = () => {
      try {
        if (user?.publicMetadata?.role) {
          const role = (user.publicMetadata.role as string).toUpperCase();
          console.log(`👤 User role from Clerk: ${role}`);
          setUserType(role);
        } else {
          // استخدام localStorage كبديل
          const role = localStorage.getItem("userRole") || "STUDENT";
          console.log(`💾 User role from localStorage: ${role}`);
          setUserType(role.toUpperCase());
        }
      } catch (error) {
        console.error("خطأ في تحديد نوع المستخدم:", error);
        setUserType("STUDENT"); // افتراضي
      }
    };

    determineUserType();
  }, [user?.publicMetadata?.role]);

  // جلب المحادثات
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId || !userType) return;

      try {
        const response = await fetch(`/api/messages?userType=${userType}`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("خطأ في جلب المحادثات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId, userType]);

  // إعادة جلب المحادثات بعد إرسال رسالة جديدة
  const handleMessageSent = () => {
    fetchConversations();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("ar-SA", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      STUDENT: "طالب",
      TEACHER: "معلم",
      STAFF: "موظف",
      ADMIN: "إدارة",
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lamaPurple">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lamaYellow mx-auto mb-4"></div>
          <p className="text-lamaSky font-medium">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-lamaSkyLight">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-lamaSky to-lamaYellow p-3 rounded-xl shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">الرسائل</h1>
                <p className="text-gray-600">
                  {userType === "STUDENT" && "تواصل مع المعلمين"}
                  {userType === "TEACHER" && "تواصل مع الطلاب والموظفين الإداريين"} 
                  {userType === "STAFF" && "تواصل مع المعلمين ومدير النظام"}
                  {userType === "ADMIN" && "تواصل مع الموظفين الإداريين"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewMessage(true)}
              className="bg-gradient-to-r from-lamaYellow to-lamaSky text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              رسالة جديدة
            </button>
          </div>
        </div>

        {/* المحادثات */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-lamaSkyLight">
          {conversations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-lamaSkyLight p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-lamaSky" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد محادثات بعد</h3>
              <p className="text-gray-500 mb-6">ابدأ محادثة جديدة للتواصل</p>
              <button
                onClick={() => setShowNewMessage(true)}
                className="bg-gradient-to-r from-lamaYellow to-lamaSky text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                إنشاء محادثة جديدة
              </button>
            </div>
          ) : (
            <div className="divide-y divide-lamaSkyLight">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/list/messages/${conversation.id}`}
                  className="block p-6 hover:bg-lamaPurpleLight/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {conversation.otherParticipant.studentPhoto ? (
                        <Image
                          src={conversation.otherParticipant.studentPhoto}
                          alt={conversation.otherParticipant.fullName}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-lamaSkyLight group-hover:ring-lamaSky transition-all duration-300"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center ring-2 ring-lamaSkyLight group-hover:ring-lamaSky transition-all duration-300">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {conversation.otherParticipant.fullName}
                        </h3>
                        <span className="text-xs text-gray-500 bg-lamaSkyLight px-2 py-1 rounded-full">
                          {getUserTypeLabel(conversation.otherParticipant.type)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-1">
                        {conversation.lastMessage?.content || "لا توجد رسائل"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {conversation.lastMessage?.createdAt && formatTime(conversation.lastMessage.createdAt)}
                      </div>
                    </div>

                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-lamaSky transition-colors duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* نموذج الرسالة الجديدة */}
      <NewMessageForm
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        userType={userType}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default MessagesPage;

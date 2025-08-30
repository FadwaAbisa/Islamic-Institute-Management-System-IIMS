"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Search, Plus, MessageCircle, Clock, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

interface AvailableUser {
  id: string;
  fullName: string;
  type: string;
  avatar?: string;
}

const MessagesWorkingPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<string>("STUDENT");

  // تحديد نوع المستخدم الحالي
  useEffect(() => {
    const determineUserType = async () => {
      try {
        // يمكن تحسين هذا المنطق حسب نظام الأدوار في المشروع
        const role = localStorage.getItem("userRole") || "STUDENT";
        setUserType(role.toUpperCase());
      } catch (error) {
        console.error("خطأ في تحديد نوع المستخدم:", error);
      }
    };

    determineUserType();
  }, []);

  // جلب المحادثات
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId || !userType) return;

      try {
        const response = await fetch(`/api/messages/working?userType=${userType}`);
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

  // جلب المستخدمين المتاحين للمراسلة
  const fetchAvailableUsers = async (search: string = "") => {
    try {
      const response = await fetch(`/api/users/working?userType=${userType}&search=${search}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      }
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error);
    }
  };

  useEffect(() => {
    if (showNewMessage) {
      fetchAvailableUsers(searchTerm);
    }
  }, [showNewMessage, searchTerm, userType]);

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
                <p className="text-gray-600">تواصل مع المعلمين والموظفين</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                  النسخة التجريبية ✨
                </span>
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
                  href={`/list/messages/working/${conversation.id}`}
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

      {/* Modal للرسالة الجديدة */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-lamaSky to-lamaYellow p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">رسالة جديدة</h2>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* البحث */}
              <div className="relative mb-6">
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن شخص..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border border-lamaSkyLight rounded-xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30"
                />
              </div>

              {/* قائمة المستخدمين */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableUsers.map((user) => (
                  <Link
                    key={user.id}
                    href={`/list/messages/working/new?receiverId=${user.id}&receiverType=${user.type}&receiverName=${encodeURIComponent(user.fullName)}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-lamaPurpleLight/50 transition-all duration-300"
                    onClick={() => setShowNewMessage(false)}
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.fullName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{user.fullName}</h4>
                      <p className="text-sm text-gray-500">{getUserTypeLabel(user.type)}</p>
                    </div>
                  </Link>
                ))}
                {availableUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد نتائج</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesWorkingPage;

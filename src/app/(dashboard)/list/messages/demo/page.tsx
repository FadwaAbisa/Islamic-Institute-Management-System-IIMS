"use client";

import { useState } from "react";
import { Search, Plus, MessageCircle, Clock, User, ChevronLeft, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

const MessagesDemoPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);

  // بيانات تجريبية
  const conversations = [
    {
      id: "1",
      otherParticipant: {
        id: "teacher_1",
        fullName: "الأستاذ أحمد محمد",
        type: "TEACHER"
      },
      lastMessage: {
        content: "مرحباً، كيف يمكنني مساعدتك؟",
        createdAt: new Date().toISOString(),
        senderId: "teacher_1"
      }
    },
    {
      id: "2", 
      otherParticipant: {
        id: "staff_1",
        fullName: "منسق الشؤون الطلابية",
        type: "STAFF"
      },
      lastMessage: {
        content: "تم استلام طلبك وسيتم المراجعة قريباً",
        createdAt: new Date().toISOString(),
        senderId: "staff_1"
      }
    }
  ];

  const messages = [
    {
      id: "1",
      content: "مرحباً أستاذ، أريد استفساراً حول المنهج",
      senderId: "student_1",
      senderType: "STUDENT",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      sender: { fullName: "أنت", type: "STUDENT" }
    },
    {
      id: "2", 
      content: "أهلاً وسهلاً، ما هو استفسارك؟",
      senderId: "teacher_1",
      senderType: "TEACHER", 
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      sender: { fullName: "الأستاذ أحمد محمد", type: "TEACHER" }
    }
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
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

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    // محاكاة إرسال الرسالة
    alert("تم إرسال الرسالة: " + newMessage);
    setNewMessage("");
  };

  if (selectedConversation) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-lamaSkyLight p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-lamaPurpleLight rounded-xl transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-lamaSky" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">الأستاذ أحمد محمد</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">معلم</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">متصل</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderType === "STUDENT";
            return (
              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
                  {!isOwn && (
                    <div className="w-8 h-8 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`${isOwn ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white" : "bg-white/80 text-gray-800"} rounded-2xl px-4 py-3 shadow-sm border border-lamaSkyLight`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`flex items-center gap-2 mt-2 ${isOwn ? "justify-end" : ""}`}>
                      <Clock className={`w-3 h-3 ${isOwn ? "text-white/70" : "text-gray-400"}`} />
                      <span className={`text-xs ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="bg-white/90 backdrop-blur-sm border-t border-lamaSkyLight p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-3 border border-lamaSkyLight rounded-2xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30 resize-none min-h-[48px]"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                newMessage.trim()
                  ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white shadow-lg"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
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
                <h1 className="text-2xl font-bold text-gray-800">الرسائل (إصدار تجريبي)</h1>
                <p className="text-gray-600">تواصل مع المعلمين والموظفين</p>
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

        {/* Conversations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-lamaSkyLight">
          <div className="divide-y divide-lamaSkyLight">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full block p-6 hover:bg-lamaPurpleLight/50 transition-all duration-300 group text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center ring-2 ring-lamaSkyLight group-hover:ring-lamaSky transition-all duration-300">
                      <User className="w-7 h-7 text-white" />
                    </div>
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
                      {conversation.lastMessage.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(conversation.lastMessage.createdAt)}
                    </div>
                  </div>

                  <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-lamaSky transition-colors duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-lamaSky to-lamaYellow p-6 text-white rounded-t-2xl">
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
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">هذه النسخة التجريبية!</p>
              <p className="text-sm text-gray-500">سيتم تفعيل هذه الميزة بعد تشغيل قاعدة البيانات</p>
              <button
                onClick={() => setShowNewMessage(false)}
                className="mt-4 bg-lamaSky text-white px-6 py-2 rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesDemoPage;

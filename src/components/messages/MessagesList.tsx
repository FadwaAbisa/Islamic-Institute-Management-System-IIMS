"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { MessageCircle, User, Clock, Search, X } from "lucide-react";
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

interface MessagesListProps {
  isOpen: boolean;
  onClose: () => void;
  userType: string;
}

const MessagesList = ({ isOpen, onClose, userType }: MessagesListProps) => {
  const { userId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId || !userType || !isOpen) return;

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
  }, [userId, userType, isOpen]);

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-lamaSky to-lamaYellow p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-lg font-bold">الرسائل</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-lamaSkyLight">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في المحادثات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-lamaSkyLight rounded-xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lamaSky"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-lamaSkyLight p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-lamaSky" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? "لا توجد نتائج" : "لا توجد محادثات"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm ? "جرب البحث بكلمات أخرى" : "ابدأ محادثة جديدة للتواصل"}
              </p>
              {!searchTerm && (
                <Link
                  href="/list/messages"
                  onClick={onClose}
                  className="inline-block mt-4 bg-gradient-to-r from-lamaYellow to-lamaSky text-white px-4 py-2 rounded-xl text-sm hover:shadow-lg transition-all duration-300"
                >
                  إنشاء محادثة جديدة
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-lamaSkyLight">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/list/messages/${conversation.id}`}
                  onClick={onClose}
                  className="block p-4 hover:bg-lamaPurpleLight/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {conversation.otherParticipant.studentPhoto ? (
                        <Image
                          src={conversation.otherParticipant.studentPhoto}
                          alt={conversation.otherParticipant.fullName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 truncate text-sm">
                          {conversation.otherParticipant.fullName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage?.createdAt && formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs truncate mb-1">
                        {conversation.lastMessage?.content || "لا توجد رسائل"}
                      </p>
                      <span className="text-xs text-gray-400 bg-lamaSkyLight px-2 py-0.5 rounded-full">
                        {getUserTypeLabel(conversation.otherParticipant.type)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-lamaSkyLight">
          <Link
            href="/list/messages"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-lamaYellow to-lamaSky text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            عرض جميع الرسائل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessagesList;

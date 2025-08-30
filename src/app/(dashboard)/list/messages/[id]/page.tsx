"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Send, 
  User, 
  Clock, 
  Check, 
  CheckCheck,
  Smile,
  Paperclip
} from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: string;
  createdAt: string;
  readAt?: string;
  sender: {
    id: string;
    fullName: string;
    studentPhoto?: string;
    type: string;
  };
  replies: MessageReply[];
}

interface MessageReply {
  id: string;
  content: string;
  senderId: string;
  senderType: string;
  createdAt: string;
  readAt?: string;
  sender: {
    id: string;
    fullName: string;
    studentPhoto?: string;
    type: string;
  };
}

interface Conversation {
  id: string;
  participant1Id: string;
  participant1Type: string;
  participant2Id: string;
  participant2Type: string;
}

const ConversationPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userType, setUserType] = useState<string>("STUDENT");
  const [otherParticipant, setOtherParticipant] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // تحديد نوع المستخدم الحالي
  useEffect(() => {
    const determineUserType = async () => {
      try {
        const role = localStorage.getItem("userRole") || "STUDENT";
        setUserType(role.toUpperCase());
      } catch (error) {
        console.error("خطأ في تحديد نوع المستخدم:", error);
      }
    };

    determineUserType();
  }, []);

  // جلب الرسائل والمحادثة
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !userId) return;

      try {
        const response = await fetch(`/api/messages/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages.reverse());
          setConversation(data.conversation);
          
          // تحديد المشارك الآخر
          const otherParticipantId = 
            data.conversation.participant1Id === userId 
              ? data.conversation.participant2Id 
              : data.conversation.participant1Id;
          
          const otherParticipantType = 
            data.conversation.participant1Id === userId 
              ? data.conversation.participant2Type 
              : data.conversation.participant1Type;

          // جلب معلومات المشارك الآخر
          await fetchParticipantInfo(otherParticipantId, otherParticipantType);
          
          // تحديث حالة القراءة
          await markAsRead();
        } else {
          router.push("/list/messages");
        }
      } catch (error) {
        console.error("خطأ في جلب الرسائل:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, userId, router]);

  // جلب معلومات المشارك الآخر
  const fetchParticipantInfo = async (participantId: string, participantType: string) => {
    try {
      let endpoint = "";
      if (participantType === "STUDENT") endpoint = `/api/students/${participantId}`;
      else if (participantType === "TEACHER") endpoint = `/api/teachers/${participantId}`;
      else if (participantType === "STAFF") endpoint = `/api/staff/${participantId}`;

      if (endpoint) {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setOtherParticipant({
            ...data,
            type: participantType
          });
        }
      }
    } catch (error) {
      console.error("خطأ في جلب معلومات المشارك:", error);
    }
  };

  // تحديث حالة القراءة
  const markAsRead = async () => {
    try {
      await fetch(`/api/messages/${conversationId}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("خطأ في تحديث حالة القراءة:", error);
    }
  };

  // إرسال رسالة جديدة
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || sending) return;

    setSending(true);
    try {
      const receiverId = 
        conversation.participant1Id === userId 
          ? conversation.participant2Id 
          : conversation.participant1Id;
      
      const receiverType = 
        conversation.participant1Id === userId 
          ? conversation.participant2Type 
          : conversation.participant1Type;

      const response = await fetch(`/api/messages?senderType=${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId,
          receiverType,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // إعادة جلب الرسائل
        const messagesResponse = await fetch(`/api/messages/${conversationId}`);
        if (messagesResponse.ok) {
          const data = await messagesResponse.json();
          setMessages(data.messages.reverse());
        }
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
    } finally {
      setSending(false);
    }
  };

  // التمرير إلى أسفل عند إضافة رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // التعامل مع Enter للإرسال
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "اليوم";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "أمس";
    } else {
      return date.toLocaleDateString("ar-SA", {
        day: "2-digit",
        month: "long",
      });
    }
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
          <p className="text-lamaSky font-medium">جاري تحميل المحادثة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-lamaSkyLight p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-lamaPurpleLight rounded-xl transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-lamaSky" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            {otherParticipant?.studentPhoto ? (
              <Image
                src={otherParticipant.studentPhoto}
                alt={otherParticipant?.fullName || ""}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-lamaSkyLight"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}

            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {otherParticipant?.fullName || "جاري التحميل..."}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {otherParticipant && getUserTypeLabel(otherParticipant.type)}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">متصل</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-lamaSkyLight p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-lamaSky" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ابدأ المحادثة</h3>
            <p className="text-gray-500">اكتب أول رسالة لبدء المحادثة</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === userId;
              const showDate = index === 0 || 
                formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

              return (
                <div key={message.id}>
                  {/* Date Separator */}
                  {showDate && (
                    <div className="text-center my-6">
                      <span className="bg-white/80 text-gray-500 text-sm px-4 py-2 rounded-full shadow-sm">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  {/* Message */}
                  <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[70%] ${isOwn ? "flex-row-reverse" : ""}`}>
                      {/* Avatar */}
                      {!isOwn && (
                        <div className="flex-shrink-0">
                          {message.sender.studentPhoto ? (
                            <Image
                              src={message.sender.studentPhoto}
                              alt={message.sender.fullName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`${isOwn ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white" : "bg-white/80 backdrop-blur-sm text-gray-800"} rounded-2xl px-4 py-3 shadow-sm border border-lamaSkyLight`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div className={`flex items-center gap-2 mt-2 ${isOwn ? "justify-end" : ""}`}>
                          <div className="flex items-center gap-1">
                            <Clock className={`w-3 h-3 ${isOwn ? "text-white/70" : "text-gray-400"}`} />
                            <span className={`text-xs ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                          {isOwn && (
                            <div className="text-white/70">
                              {message.readAt ? (
                                <CheckCheck className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-lamaSkyLight p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-4 py-3 pr-12 border border-lamaSkyLight rounded-2xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30 resize-none min-h-[48px] max-h-32"
              rows={1}
              style={{
                height: "auto",
                minHeight: "48px"
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
            <button className="absolute left-3 bottom-3 text-gray-400 hover:text-lamaSky transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              newMessage.trim() && !sending
                ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;

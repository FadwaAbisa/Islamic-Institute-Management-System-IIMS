"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Send, User, Smile } from "lucide-react";
import Image from "next/image";

const NewMessagePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const receiverId = searchParams.get("receiverId");
  const receiverType = searchParams.get("receiverType");
  const receiverName = searchParams.get("receiverName");
  
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userType, setUserType] = useState<string>("STUDENT");
  const [receiverInfo, setReceiverInfo] = useState<any>(null);
  
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

  // جلب معلومات المستقبل
  useEffect(() => {
    if (receiverId && receiverType) {
      setReceiverInfo({
        id: receiverId,
        fullName: decodeURIComponent(receiverName || ""),
        type: receiverType,
      });
    }
  }, [receiverId, receiverType, receiverName]);

  // إرسال الرسالة
  const sendMessage = async () => {
    if (!message.trim() || !receiverId || !receiverType || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/messages?senderType=${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.trim(),
          receiverId,
          receiverType,
        }),
      });

      if (response.ok) {
        // البحث عن المحادثة وتوجيه المستخدم إليها
        const conversationsResponse = await fetch(`/api/messages?userType=${userType}`);
        if (conversationsResponse.ok) {
          const conversations = await conversationsResponse.json();
          const conversation = conversations.find((conv: any) => 
            conv.otherParticipant.id === receiverId
          );
          
          if (conversation) {
            router.push(`/list/messages/${conversation.id}`);
          } else {
            router.push("/list/messages");
          }
        }
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
    } finally {
      setSending(false);
    }
  };

  // التعامل مع Enter للإرسال
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  if (!receiverId || !receiverType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lamaPurple">
        <div className="text-center">
          <p className="text-red-600 font-medium">خطأ: معلومات المستقبل غير صحيحة</p>
          <button
            onClick={() => router.push("/list/messages")}
            className="mt-4 bg-lamaSky text-white px-6 py-2 rounded-xl"
          >
            العودة للرسائل
          </button>
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
            <div className="w-12 h-12 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>

            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {receiverInfo?.fullName}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {receiverInfo && getUserTypeLabel(receiverInfo.type)}
                </span>
                <span className="text-xs bg-lamaSkyLight text-lamaSky px-2 py-1 rounded-full">
                  رسالة جديدة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            بدء محادثة جديدة
          </h3>
          <p className="text-gray-600">
            مع {receiverInfo?.fullName}
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-lamaSkyLight shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اكتب رسالتك الأولى:
            </label>
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="مرحباً، كيف يمكنني مساعدتك؟"
              className="w-full px-4 py-3 border border-lamaSkyLight rounded-xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30 resize-none min-h-[120px]"
              rows={4}
            />
            
            <div className="flex items-center justify-between mt-4">
              <button className="text-gray-400 hover:text-lamaSky transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium ${
                  message.trim() && !sending
                    ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessagePage;

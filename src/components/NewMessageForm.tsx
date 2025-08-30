"use client";

import { useState, useEffect } from "react";
import { Search, Send, X } from "lucide-react";
import Image from "next/image";

interface AvailableUser {
  id: string;
  fullName: string;
  type: string;
  avatar?: string;
  username?: string;
}

interface NewMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  userType: string;
  onMessageSent: () => void;
}

const NewMessageForm = ({ isOpen, onClose, userType, onMessageSent }: NewMessageFormProps) => {
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AvailableUser | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // جلب المستخدمين المتاحين
  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen, searchTerm, userType]);

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/clerk?userType=${userType}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      }
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error);
    } finally {
      setLoading(false);
    }
  };

  // إرسال الرسالة
  const sendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    try {
      setSending(true);
      const response = await fetch(`/api/messages?senderType=${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.trim(),
          receiverId: selectedUser.id,
          receiverType: selectedUser.type,
        }),
      });

      if (response.ok) {
        // إعادة تعيين النموذج
        setSelectedUser(null);
        setMessage("");
        onMessageSent();
        onClose();
      } else {
        const error = await response.json();
        alert(`خطأ: ${error.error}`);
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      alert("حدث خطأ في إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      STUDENT: "طالب",
      TEACHER: "معلم",
      STAFF: "موظف إداري",
      ADMIN: "مدير النظام",
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-lamaSky to-lamaYellow p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">رسالة جديدة</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedUser ? (
            // مرحلة اختيار المستخدم
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">اختر المستقبل</h3>
              
              {/* البحث */}
              <div className="relative mb-4">
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
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lamaSky mx-auto"></div>
                    <p className="text-gray-500 mt-2">جاري البحث...</p>
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>لا توجد نتائج</p>
                    <p className="text-sm mt-1">تأكد من وجود بيانات في قاعدة البيانات</p>
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-lamaPurpleLight/50 transition-all duration-300 text-left"
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
                          <span className="text-white font-medium">
                            {user.fullName?.charAt(0) || "؟"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{user.fullName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{getUserTypeLabel(user.type)}</span>
                          {user.username && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-xs">@{user.username}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            // مرحلة كتابة الرسالة
            <>
              <div className="flex items-center gap-3 mb-4 p-3 bg-lamaPurpleLight/30 rounded-xl">
                {selectedUser.avatar ? (
                  <Image
                    src={selectedUser.avatar}
                    alt={selectedUser.fullName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-lamaSky to-lamaYellow rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {selectedUser.fullName?.charAt(0) || "؟"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{selectedUser.fullName}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{getUserTypeLabel(selectedUser.type)}</span>
                    {selectedUser.username && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-xs">@{selectedUser.username}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* كتابة الرسالة */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محتوى الرسالة
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={4}
                    className="w-full px-4 py-3 border border-lamaSkyLight rounded-xl focus:outline-none focus:ring-2 focus:ring-lamaSky bg-lamaPurpleLight/30 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    الرجوع
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || sending}
                    className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      message.trim() && !sending
                        ? "bg-gradient-to-r from-lamaYellow to-lamaSky text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        إرسال
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewMessageForm;

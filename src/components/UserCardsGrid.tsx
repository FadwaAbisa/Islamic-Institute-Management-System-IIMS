import UserCard from "./UserCard";
import { Suspense } from "react";

// مكون Loading للكروت
const UserCardSkeleton = () => (
  <div className="rounded-2xl p-6 flex-1 min-w-[180px] bg-gray-100 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
    </div>
    <div className="mb-3">
      <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
      <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
    </div>
    <div className="w-20 h-4 bg-gray-200 rounded"></div>
  </div>
);

// مكون الشبكة مع تحسينات
const UserCardsGrid = async () => {
  const userTypes = [
    { type: "admin", label: "المسؤولين", priority: 1 },
    { type: "teacher", label: "المعلمين", priority: 2 },
    { type: "student", label: "الطلاب", priority: 3 },
    { type: "parent", label: "أولياء الأمور", priority: 4 },
  ] as const;

  return (
    <div className="w-full" dir="rtl">
      {/* العنوان والإحصائيات العامة */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-6 bg-[#D2B48C] rounded-full"></div>
            إحصائيات المستخدمين
          </h2>
          <div className="text-sm text-gray-500 bg-[#F7F3EE] px-3 py-1 rounded-full">
            تحديث مستمر
          </div>
        </div>
      </div>

      {/* الكروت في تخطيط responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {userTypes.map(({ type, label, priority }) => (
          <Suspense key={type} fallback={<UserCardSkeleton />}>
            <div 
              className="transform transition-all duration-300 hover:scale-105"
              style={{ 
                animationDelay: `${priority * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              <UserCard type={type as any} />
            </div>
          </Suspense>
        ))}
      </div>

      {/* إحصائيات سريعة إضافية */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-[#B8956A]">100%</div>
          <div className="text-sm text-gray-600">نسبة النشاط</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-[#D2B48C]">24/7</div>
          <div className="text-sm text-gray-600">المتابعة المستمرة</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-[#B8956A]">99.9%</div>
          <div className="text-sm text-gray-600">معدل الاستقرار</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <div className="text-2xl font-bold text-[#D2B48C]">+15%</div>
          <div className="text-sm text-gray-600">نمو شهري</div>
        </div>
      </div>

      {/* CSS للرسوم المتحركة */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* تحسينات للموبايل */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }

        /* تأثيرات hover إضافية */
        .transform:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
};

// مكون wrapper مع معالجة الأخطاء
const UserCardsGridWithErrorBoundary = () => {
  return (
    <div className="w-full">
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <UserCardsGrid />
      </Suspense>
    </div>
  );
};

export default UserCardsGridWithErrorBoundary;
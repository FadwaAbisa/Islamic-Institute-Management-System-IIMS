"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RoleDebugPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [localStorageRole, setLocalStorageRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageRole(localStorage.getItem('userRole'));
    }
  }, []);

  const handleSetRole = (role: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
      setLocalStorageRole(role);
    }
  };

  const handleClearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      setLocalStorageRole(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">المستخدم غير مسجل دخول</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">تشخيص الأدوار والصلاحيات</h1>
        
        {/* معلومات المستخدم */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات المستخدم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">الاسم الأول</label>
              <p className="text-lg text-gray-900">{user.firstName || 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">الاسم الأخير</label>
              <p className="text-lg text-gray-900">{user.lastName || 'غير محدد'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">معرف المستخدم</label>
              <p className="text-sm text-gray-700 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
              <p className="text-sm text-gray-700">{user.primaryEmailAddress?.emailAddress || 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* معلومات الأدوار */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الأدوار</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-blue-600">الدور في Clerk publicMetadata</label>
              <p className="text-lg font-mono text-blue-900">
                {user.publicMetadata?.role ? 
                  `"${user.publicMetadata.role}"` : 
                  <span className="text-red-500">غير محدد</span>
                }
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <label className="block text-sm font-medium text-green-600">الدور في localStorage</label>
              <p className="text-lg font-mono text-green-900">
                {localStorageRole ? 
                  `"${localStorageRole}"` : 
                  <span className="text-red-500">غير محدد</span>
                }
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <label className="block text-sm font-medium text-yellow-600">الدور النهائي المستخدم</label>
              <p className="text-lg font-mono text-yellow-900">
                &quot;{String(user.publicMetadata?.role || localStorageRole || 'student')}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* أدوات التحكم */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">أدوات التحكم</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">تعيين دور في localStorage</label>
              <div className="flex flex-wrap gap-2">
                {['admin', 'staff', 'teacher', 'student', 'parent'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleSetRole(role)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      localStorageRole === role
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <button
                onClick={handleClearLocalStorage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                مسح localStorage
              </button>
            </div>
          </div>
        </div>

        {/* اختبار الصفحات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">اختبار الوصول للصفحات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/staff')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold text-blue-600">صفحة الموظفين</h3>
              <p className="text-sm text-gray-600">يتطلب: staff, admin</p>
            </button>
            
            <button
              onClick={() => router.push('/teacher')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold text-green-600">صفحة المعلمين</h3>
              <p className="text-sm text-gray-600">يتطلب: teacher, admin</p>
            </button>
            
            <button
              onClick={() => router.push('/student')}
              className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold text-yellow-600">صفحة الطلاب</h3>
              <p className="text-sm text-gray-600">يتطلب: student, admin</p>
            </button>
            
            <button
              onClick={() => router.push('/admin')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold text-purple-600">صفحة المدير</h3>
              <p className="text-sm text-gray-600">يتطلب: admin</p>
            </button>
          </div>
        </div>

        {/* العودة للخلف */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleDebugPage;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import { AlertCircle, ArrowRight } from "lucide-react";

const RoleSetupPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    required: "",
    current: "",
    message: ""
  });

  useEffect(() => {
    const error = searchParams.get('error');
    const required = searchParams.get('required');
    const current = searchParams.get('current');

    if (error === 'insufficient_permissions') {
      setShowError(true);
      setErrorDetails({
        required: required || '',
        current: current || 'غير محدد',
        message: required ? `تحتاج لدور: ${required}` : 'ليس لديك صلاحيات كافية'
      });
    }
  }, [searchParams]);

  const handleRoleSelect = (role: string) => {
    console.log('تم اختيار الدور:', role);
    setShowError(false);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lamaPurple via-lamaPurpleLight to-white">
      {/* رسالة الخطأ */}
      {showError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-400 ml-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">خطأ في الصلاحيات</h3>
              <p className="text-red-700 mt-1">
                {errorDetails.message}
              </p>
              <div className="mt-2 text-sm text-red-600">
                <p>الدور الحالي: <span className="font-semibold">{errorDetails.current}</span></p>
                {errorDetails.required && (
                  <p>الأدوار المطلوبة: <span className="font-semibold">{errorDetails.required}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* زر العودة */}
      <div className="p-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة
        </button>
      </div>

      {/* منتقي الدور */}
      <div className="px-4 pb-8">
        <RoleSelector onRoleSelect={handleRoleSelect} />
      </div>
    </div>
  );
};

export default RoleSetupPage;

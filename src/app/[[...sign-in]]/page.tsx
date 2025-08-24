"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role;
      const redirectUrl = searchParams.get('redirect_url');

      if (role) {
        setIsLoading(true);
        setTimeout(() => {
          // إذا كان هناك مسار إعادة توجيه، استخدمه، وإلا استخدم المسار الافتراضي
          const targetUrl = redirectUrl || `/${role}`;
          router.replace(targetUrl);
        }, 500);
      }
    }
  }, [isLoaded, isSignedIn, user, router, searchParams]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="text-amber-700 font-medium">جاري تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-amber-100/50 relative overflow-hidden">
              {/* Card header decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400"></div>
              
          {/* Header */}
              <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  مرحباً بك
                </h1>
            <p className="text-gray-600 text-sm">
              سجل دخولك للوصول إلى نظام إدارة المدرسة
                </p>
              </div>

          {/* Clerk SignIn Component */}
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-amber-200 hover:bg-amber-50",
                formFieldInput: "border-gray-200 rounded-xl focus:ring-amber-400 focus:border-transparent",
                footerAction: "hidden"
              }
            }}
            redirectUrl={`/${user?.publicMetadata?.role || 'student'}`}
          />

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    نظام إدارة المدارس الذكي
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default LoginPage;
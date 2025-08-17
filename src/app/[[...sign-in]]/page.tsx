"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock, BookOpen } from "lucide-react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role;
      if (role) {
        setIsLoading(true);
        setTimeout(() => {
          router.replace(`/${role}`);
        }, 500);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

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
        <SignIn.Root>
          <SignIn.Step name="start">
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-amber-100/50 relative overflow-hidden">
              {/* Card header decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400"></div>
              
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  مرحباً بك
                </h1>
                <p className="text-gray-500 text-sm">
                  قم بتسجيل الدخول للوصول إلى حسابك
                </p>
              </div>

              <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4 border border-red-200" />

              <div className="space-y-6">
                {/* Username Field */}
                <Clerk.Field name="identifier" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    اسم المستخدم
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type="text"
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="أدخل اسم المستخدم"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <Clerk.FieldError className="text-xs text-red-500 flex items-center gap-1 mt-1" />
                </Clerk.Field>

                {/* Password Field */}
                <Clerk.Field name="password" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    كلمة المرور
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 pr-12 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="أدخل كلمة المرور"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <Clerk.FieldError className="text-xs text-red-500 flex items-center gap-1 mt-1" />
                </Clerk.Field>

                {/* Submit Button */}
                <SignIn.Action
                  submit
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  <span className="flex items-center justify-center gap-2">
                    تسجيل الدخول
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin hidden group-disabled:block"></div>
                  </span>
                </SignIn.Action>
              </div>

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
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default LoginPage;
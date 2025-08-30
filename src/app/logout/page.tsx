"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut, Shield, UserCheck } from "lucide-react";

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCFAF8] via-[#F7F3EE] to-[#F0E6D6] p-4">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2D5C7]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D2B48C] to-[#B8956A] p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">تسجيل الخروج</h1>
            <p className="text-[#FCFAF8] text-sm">هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#F0E6D6] rounded-full flex items-center justify-center">
                <UserCheck className="w-10 h-10 text-[#B8956A]" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                سيتم تسجيل خروجك من النظام. تأكد من حفظ أي عمل قيد التنفيذ قبل المتابعة.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <SignOutButton>
                <button className="w-full bg-gradient-to-r from-[#B8956A] to-[#D2B48C] hover:from-[#A0855A] hover:to-[#C2A47C] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group">
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  تسجيل الخروج
                </button>
              </SignOutButton>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full bg-[#F7F3EE] hover:bg-[#F0E6D6] text-[#B8956A] font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-[#E2D5C7] hover:border-[#D2B48C] flex items-center justify-center gap-2"
              >
                إلغاء
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-6 pt-4 border-t border-[#E2D5C7]">
              <p className="text-xs text-center text-gray-500">
                شكراً لاستخدامك نظام إدارة المعهد الإسلامي
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#D2B48C]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#B8956A]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#F0E6D6]/50 rounded-full blur-lg"></div>
      </div>
    </div>
  );
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, AlertTriangle, Award, ClipboardCheck, BarChart3 } from "lucide-react"
import Link from "next/link"

// Custom CSS for enhanced animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-3000 {
    animation-delay: 3s;
  }
`

export default function ResultsPage() {
  return (
    <>
      <style jsx>{customStyles}</style>
                    <div className="h-screen bg-gradient-to-br from-lamaPurpleLight via-purple-50 to-lamaSkyLight p-6 font-tajawal overflow-hidden flex flex-col justify-center items-center" dir="rtl">
        <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-lamaYellow/20 to-lamaSky/20 rounded-full blur-3xl transform scale-150"></div>
            
            {/* Main Title */}
            <h1 className="relative text-5xl font-bold text-gray-800 mb-4 font-cairo bg-gradient-to-r from-gray-800 via-lamaYellow to-lamaSky bg-clip-text text-transparent">
              صفحة الدرجات الرئيسية
            </h1>
            
            {/* Subtitle with enhanced styling */}
            <p className="relative text-xl text-gray-600 font-tajawal bg-white/80 backdrop-blur-sm rounded-full px-8 py-3 inline-block shadow-lg border border-white/20">
              اختر المهمة التي تريد تنفيذها من القائمة أدناه
            </p>
          </div>
        </div>

        {/* Reports Section */}
        <div>
          <div className="flex items-center justify-center gap-4 mb-12">
            {/* Enhanced Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-lamaYellow/30 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-lamaYellow to-lamaSky p-4 rounded-full shadow-2xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Enhanced Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-lamaYellow via-lamaSky to-purple-600 bg-clip-text text-transparent font-tajawal">
                التقارير
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-lamaYellow to-lamaSky rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {/* Review List */}
            <Link href="/grades/results/review">
              <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl hover:scale-105 hover:-translate-y-3 transition-all duration-500 cursor-pointer group overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-lamaSky via-lamaYellow to-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-lamaSky/30 to-lamaYellow/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-lamaSky via-lamaYellow to-purple-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <ClipboardCheck className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Text */}
                  <h3 className="font-bold text-gray-800 mb-3 text-lg font-tajawal group-hover:text-lamaSky transition-colors duration-300">
                    كشف المراجعة
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-tajawal group-hover:text-gray-700 transition-colors duration-300">
                    كشوفات المراجعة والتدقيق
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lamaSky to-lamaYellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            </Link>

            {/* Top Students */}
            <Link href="/grades/results/top-students">
              <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl hover:scale-105 hover:-translate-y-3 transition-all duration-500 cursor-pointer group overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-lamaYellow via-orange-400 to-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-lamaYellow/30 to-orange-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-lamaYellow via-orange-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <Award className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Text */}
                  <h3 className="font-bold text-gray-800 mb-3 text-lg font-tajawal group-hover:text-lamaYellow transition-colors duration-300">
                    كشف الأوائل
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-tajawal group-hover:text-gray-700 transition-colors duration-300">
                    قائمة الطلاب المتفوقين والأوائل
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lamaYellow to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            </Link>

            {/* Second Round Students */}
            <Link href="/grades/results/second-round">
              <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl hover:scale-105 hover:-translate-y-3 transition-all duration-500 cursor-pointer group overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <AlertTriangle className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Text */}
                  <h3 className="font-bold text-gray-800 mb-3 text-lg font-tajawal group-hover:text-red-500 transition-colors duration-300">
                    طلاب الدور الثاني
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-tajawal group-hover:text-gray-700 transition-colors duration-300">
                    قائمة الطلاب المؤجلين للدور الثاني
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            </Link>

            {/* Approved Transcripts */}
            <Link href="/grades/results/approved-transcripts">
              <Card className="bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl hover:scale-105 hover:-translate-y-3 transition-all duration-500 cursor-pointer group overflow-hidden relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-[2px] bg-white rounded-lg"></div>
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <FileText className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Enhanced Text */}
                  <h3 className="font-bold text-gray-800 mb-3 text-lg font-tajawal group-hover:text-green-600 transition-colors duration-300">
                    الكشوفات المعتمدة
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-tajawal group-hover:text-gray-700 transition-colors duration-300">
                    عرض وطباعة الكشوفات المعتمدة
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* Enhanced Footer Section */}
          <div className="mt-16 text-center">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute left-1/4 top-0 w-2 h-2 bg-lamaYellow rounded-full animate-pulse"></div>
              <div className="absolute right-1/4 top-0 w-2 h-2 bg-lamaSky rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute left-1/3 bottom-0 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-2000"></div>
              <div className="absolute right-1/3 bottom-0 w-2 h-2 bg-orange-400 rounded-full animate-pulse animation-delay-3000"></div>
              
              {/* Footer Text */}
              <p className="text-gray-500 text-sm font-tajawal bg-white/60 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
                نظام إدارة الدرجات المتقدم - جميع الحقوق محفوظة © 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

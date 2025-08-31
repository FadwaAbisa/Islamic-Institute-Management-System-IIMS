"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const RegisterPage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #FCFAF8 0%, #F7F3EE 25%, #F0E6D6 75%, #E2D5C7 100%)'
            }}>

            {/* خلفية متحركة */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#D2B48C' }}></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#B8956A', animationDelay: '2s' }}></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#F0E6D6', animationDelay: '4s' }}></div>
            </div>

            <Navbar />

            {/* المحتوى الرئيسي */}
            <main className="relative z-10 pt-32 pb-20">
                <div className="max-w-6xl mx-auto px-4">
                    
                    {/* الشعار والعنوان */}
                    <div className="text-center mb-16">
                        {/* الشعار */}
                        <div className="w-32 h-32 mx-auto mb-8 relative">
                            <div className="w-full h-full flex items-center justify-center rounded-2xl shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                {/* شعار إسلامي - كتاب مفتوح مع زخرفة */}
                                <svg className="w-20 h-20 text-white" viewBox="0 0 100 100" fill="currentColor">
                                    {/* الزخرفة الإسلامية في الأعلى */}
                                    <g transform="translate(50,15)">
                                        <path d="M0,-5 L8,3 L4,8 L0,5 L-4,8 L-8,3 Z" fill="currentColor"/>
                                        <path d="M0,0 L6,6 L3,9 L0,7 L-3,9 L-6,6 Z" fill="currentColor"/>
                                        <path d="M0,5 L4,9 L2,11 L0,10 L-2,11 L-4,9 Z" fill="currentColor"/>
                                    </g>
                                    
                                    {/* الكتاب المفتوح */}
                                    <g transform="translate(50,45)">
                                        {/* الصفحة اليسرى */}
                                        <path d="M-25,0 Q-25,-10 -15,-10 L-2,-10 L-2,25 L-15,25 Q-25,25 -25,15 Z" fill="currentColor"/>
                                        {/* الصفحة اليمنى */}
                                        <path d="M25,0 Q25,-10 15,-10 L2,-10 L2,25 L15,25 Q25,25 25,15 Z" fill="currentColor"/>
                                        {/* خطوط النص */}
                                        <g fill="white" opacity="0.7">
                                            <rect x="-20" y="-5" width="15" height="1.5"/>
                                            <rect x="-20" y="-1" width="12" height="1.5"/>
                                            <rect x="-20" y="3" width="18" height="1.5"/>
                                            <rect x="-20" y="7" width="10" height="1.5"/>
                                            
                                            <rect x="5" y="-5" width="15" height="1.5"/>
                                            <rect x="8" y="-1" width="12" height="1.5"/>
                                            <rect x="2" y="3" width="18" height="1.5"/>
                                            <rect x="10" y="7" width="10" height="1.5"/>
                                        </g>
                                    </g>
                                    
                                    {/* خطوط زخرفية في الأسفل */}
                                    <g transform="translate(50,75)" stroke="currentColor" strokeWidth="2" fill="none">
                                        <path d="M-20,0 Q-15,5 -10,0 Q-5,5 0,0 Q5,5 10,0 Q15,5 20,0"/>
                                        <path d="M-15,5 Q-10,8 -5,5 Q0,8 5,5 Q10,8 15,5"/>
                                    </g>
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-5xl font-bold mb-4" style={{ color: '#371E13' }}>
                            البوابة الإلكترونية لتسجيل الطلاب
                        </h1>
                        <div className="w-32 h-1 rounded-full mx-auto"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                    </div>

                    {/* بطاقات الخدمات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        
                        {/* متابعة حالة الطلب */}
                        <Link href="/academic/register/track" className="group">
                            <div className="relative p-8 rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
                                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                                }}>
                                
                                {/* تأثيرات الخلفية */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                {/* الأيقونة */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white text-center mb-3">
                                    متابعة حالة الطلب
                                </h3>
                                
                                {/* دوائر زخرفية */}
                                <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full"></div>
                            </div>
                        </Link>

                        {/* تسجيل طالب معادلة للسنوات الأخرى */}
                        <Link href="/academic/register/transfer" className="group">
                            <div className="relative p-8 rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'linear-gradient(135deg, #475569, #334155)',
                                    boxShadow: '0 10px 30px rgba(71, 85, 105, 0.3)'
                                }}>
                                
                                {/* تأثيرات الخلفية */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                {/* الأيقونة */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white text-center mb-2">
                                    تسجيل طالب معادلة
                                </h3>
                                <p className="text-white/80 text-center text-sm">
                                    للسنوات الأخرى
                                </p>
                                
                                {/* دوائر زخرفية */}
                                <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full"></div>
                            </div>
                        </Link>

                        {/* تسجيل طالب جديد للسنة الأولى */}
                        <Link href="/academic/register/new" className="group">
                            <div className="relative p-8 rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'linear-gradient(135deg, #D97706, #92400E)',
                                    boxShadow: '0 10px 30px rgba(217, 119, 6, 0.3)'
                                }}>
                                
                                {/* تأثيرات الخلفية */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                {/* الأيقونة */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white text-center mb-2">
                                    تسجيل طالب جديد
                                </h3>
                                <p className="text-white/80 text-center text-sm">
                                    للسنة الأولى
                                </p>
                                
                                {/* دوائر زخرفية */}
                                <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full"></div>
                            </div>
                        </Link>
                    </div>

                    {/* بطاقات الأدلة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* دليل قبول الطلاب للمعادلة */}
                        <Link href="/academic/register/guide-transfer" className="group">
                            <div className="relative p-8 rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'linear-gradient(135deg, #0891B2, #0E7490)',
                                    boxShadow: '0 10px 30px rgba(8, 145, 178, 0.3)'
                                }}>
                                
                                {/* تأثيرات الخلفية */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                {/* الأيقونة */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white text-center mb-4">
                                    دليل قبول الطلاب للمعادلة
                                </h3>
                                <p className="text-white/80 text-center">
                                    للاطلاع قبل التسجيل
                                </p>
                                
                                {/* رمز PDF */}
                                <div className="absolute top-4 right-4">
                                    <span className="text-white/60 text-xs font-bold bg-white/20 px-2 py-1 rounded">PDF</span>
                                </div>
                                
                                {/* دوائر زخرفية */}
                                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full"></div>
                            </div>
                        </Link>

                        {/* دليل قبول الطلاب للسنة الأولى */}
                        <Link href="/academic/register/guide-new" className="group">
                            <div className="relative p-8 rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                                style={{ 
                                    background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)'
                                }}>
                                
                                {/* تأثيرات الخلفية */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                
                                {/* الأيقونة */}
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white text-center mb-4">
                                    دليل قبول الطلاب للسنة الأولى
                                </h3>
                                <p className="text-white/80 text-center">
                                    للاطلاع قبل التسجيل
                                </p>
                                
                                {/* رمز PDF */}
                                <div className="absolute top-4 right-4">
                                    <span className="text-white/60 text-xs font-bold bg-white/20 px-2 py-1 rounded">PDF</span>
                                </div>
                                
                                {/* دوائر زخرفية */}
                                <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full"></div>
                            </div>
                        </Link>
                    </div>

                    {/* ملاحظة مهمة */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="flex items-start gap-4 p-6 rounded-2xl"
                            style={{ backgroundColor: 'rgba(210, 180, 140, 0.1)', border: '1px solid rgba(210, 180, 140, 0.3)' }}>
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 mt-0.5" style={{ color: '#B8956A' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2" style={{ color: '#371E13' }}>ملاحظة مهمة:</h4>
                                <p className="text-sm leading-relaxed" style={{ color: '#371E13' }}>
                                    يرجى قراءة دليل القبول المناسب لحالتك قبل البدء في عملية التسجيل. تأكد من توفر جميع المستندات المطلوبة وفقاً للشروط المحددة في الدليل لضمان نجاح عملية التسجيل.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* عناصر زخرفية */}
            <div className="fixed top-1/4 right-8 w-16 h-16 border-2 rounded-full animate-spin opacity-10 z-0"
                style={{
                    borderColor: 'rgba(210, 180, 140, 0.5)',
                    animationDuration: '15s'
                }}></div>
            <div className="fixed bottom-1/3 left-8 w-12 h-12 border-2 rounded-full animate-spin opacity-10 z-0"
                style={{
                    borderColor: 'rgba(184, 149, 106, 0.6)',
                    animationDuration: '20s',
                    animationDirection: 'reverse'
                }}></div>
        </div>
    );
};

export default RegisterPage;

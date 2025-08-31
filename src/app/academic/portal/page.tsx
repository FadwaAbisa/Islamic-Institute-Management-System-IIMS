"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const AcademicPortalPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const subjects = [
        "القرآن وأحكام التجويد",
        "السيرة، وتاريخ الدولة الأموية والعباسية", 
        "التفسير",
        "علوم الحديث",
        "الفقه",
        "العقيدة الإسلامية",
        "الدراسات الأدبية",
        "الدراسات اللغوية",
        "أصول الفقه",
        "منهج الدعوة",
        "اللغة الإنجليزية",
        "الحاسوب"
    ];

    const requirements = [
        { icon: "🎓", title: "الشهادة الإعدادية", description: "شهادة إتمام المرحلة الإعدادية" },
        { icon: "🆔", title: "صورة الهوية", description: "صورة من بطاقة الهوية الشخصية" },
        { icon: "📋", title: "شهادة حسن السيرة", description: "من الجهات المختصة" },
        { icon: "✅", title: "اجتياز الامتحان التمهيدي", description: "امتحان قبول للمعهد" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-lama-purple-light via-lama-sky-light to-lama-yellow-light">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-lama-purple/20 to-lama-sky/20"></div>
                
                {/* عناصر ديكورية */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-lama-yellow/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-lama-sky/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#371E13' }}>
                            البوابة العلمية
                        </h1>
                        <div className="w-32 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-lama-sky to-lama-yellow"></div>
                        <p className="text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#371E13' }}>
                            تعرف على برنامج الدراسات الإسلامية المتميز، والذي يهدف إلى إعداد طلاب متخصصين في العلوم الشرعية والإسلامية
                        </p>
                    </div>
                </div>
            </section>

            {/* الشعب الدراسية */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#371E13' }}>
                        الشعب الدراسية
                    </h2>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* الدراسات الإسلامية */}
                        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-lama-sky/20 h-full">
                                <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#371E13' }}>
                                    الدراسات الإسلامية
                                </h3>
                                <div className="space-y-4 text-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-sky"></span>
                                        <span style={{ color: '#371E13' }}>مدة الدراسة: <strong>3 سنوات</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-yellow"></span>
                                        <span style={{ color: '#371E13' }}>درجة التخرج: <strong>الدرجة السادسة</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-sky"></span>
                                        <span style={{ color: '#371E13' }}>الفروع: <strong>56 فرعًا في مختلف مدن ليبيا</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-yellow"></span>
                                        <span style={{ color: '#371E13' }}>للبنين والبنات</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* القراءات القرآنية */}
                        <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-lama-sky/20 h-full">
                                <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#371E13' }}>
                                    القراءات القرآنية
                                </h3>
                                <div className="space-y-4 text-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-sky"></span>
                                        <span style={{ color: '#371E13' }}>مدة الدراسة: <strong>4 سنوات</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-yellow"></span>
                                        <span style={{ color: '#371E13' }}>درجة التخرج: <strong>الدرجة السادسة + علاوة</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-sky"></span>
                                        <span style={{ color: '#371E13' }}>الفروع: <strong>4 فروع في مختلف المدن</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full bg-lama-yellow"></span>
                                        <span style={{ color: '#371E13' }}>للبنين والبنات</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* مواعيد الدراسة والامتحانات */}
            <section className="py-16 bg-white/50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#371E13' }}>
                        المواعيد والجدولة
                    </h2>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* مواعيد الدراسة */}
                        <div className="bg-gradient-to-br from-lama-purple to-lama-purple-light rounded-3xl p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">مواعيد الدراسة</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-white text-lg font-medium">الأحد إلى الخميس</p>
                                    <p className="text-white/80">8:00 ص - 1:00 م</p>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-white text-lg font-medium">عدد الحصص اليومية</p>
                                    <p className="text-white/80">5-6 حصص يوميًا</p>
                                </div>
                            </div>
                        </div>

                        {/* مواعيد الامتحانات */}
                        <div className="bg-gradient-to-br from-lama-sky to-lama-yellow rounded-3xl p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">مواعيد الامتحانات</h3>
                            </div>
                            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm text-center">
                                <p className="text-white text-xl font-medium mb-2">نهاية كل فصل دراسي</p>
                                <p className="text-white/80">امتحانات شاملة للمقررات الدراسية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* متطلبات التسجيل */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#371E13' }}>
                        متطلبات التسجيل
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {requirements.map((req, index) => (
                            <div 
                                key={index}
                                className={`transform transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-lama-sky/20">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">{req.icon}</div>
                                        <h3 className="text-xl font-bold mb-3" style={{ color: '#371E13' }}>
                                            {req.title}
                                        </h3>
                                        <p className="text-gray-600">{req.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* المقررات الدراسية */}
            <section className="py-16 bg-white/50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#371E13' }}>
                        المقررات الدراسية
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject, index) => (
                            <div 
                                key={index}
                                className={`transform transition-all duration-700 delay-${index * 50} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            >
                                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-lama-sky hover:border-lama-yellow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lama-sky to-lama-yellow flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg font-medium" style={{ color: '#371E13' }}>
                                            {subject}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* دعوة للعمل */}
            <section className="py-16 bg-gradient-to-r from-lama-sky to-lama-yellow">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        ابدأ رحلتك التعليمية معنا
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        انضم إلى المعهد المتوسط للدراسات الإسلامية واحصل على تعليم إسلامي متميز
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/academic/register"
                            className="px-8 py-4 bg-white text-lama-sky font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            سجل الآن
                        </Link>
                        <Link 
                            href="/#contact"
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-lama-sky transition-all duration-300"
                        >
                            تواصل معنا
                        </Link>
                    </div>
                </div>
            </section>

            {/* فوتر تواصل معنا */}
            <footer className="bg-gradient-to-br from-lama-purple to-lama-sky text-white py-16">
                <div className="container mx-auto px-6">
                    {/* العنوان الرئيسي */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#371E13' }}>
                            تواصل معنا
                        </h2>
                        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-lama-yellow to-lama-sky rounded-full"></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* للاستفسار */}
                        <div className="text-center lg:text-right">
                            <h3 className="text-xl font-bold mb-6" style={{ color: '#371E13' }}>
                                للاستفسار (اتصل بـ)
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span style={{ color: '#371E13' }} className="font-medium">218-92-1448222+</span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span style={{ color: '#371E13' }} className="font-medium">218-91-1448222+</span>
                                </div>
                            </div>
                        </div>

                        {/* تفاصيل الموقع */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-6" style={{ color: '#371E13' }}>
                                تفاصيل الموقع
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start justify-center gap-3">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                    <span style={{ color: '#371E13' }} className="font-medium leading-relaxed">
                                        جزيرة سوق الثلاثاء بالقرب من مركز العزل، طرابلس، ليبيا
                                    </span>
                                </div>
                            </div>

                            {/* الخريطة */}
                            <div className="mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.7!2d13.1813!3d32.8872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDUzJzE0LjAiTiAxM8KwMTAnNTIuNyJF!5e0!3m2!1sen!2sly!4v1234567890123"
                                        width="100%" 
                                        height="200" 
                                        style={{ border: 0, borderRadius: '8px' }}
                                        allowFullScreen
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="موقع المعهد المتوسط للدراسات الإسلامية"
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        {/* تابعنا على */}
                        <div className="text-center lg:text-left">
                            <h3 className="text-xl font-bold mb-6" style={{ color: '#371E13' }}>
                                تابعنا على:
                            </h3>
                            <div className="flex gap-4 justify-center lg:justify-start">
                                {/* فيسبوك */}
                                <a href="https://www.facebook.com/fadwa.abisa" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#7F5539]/20 flex items-center justify-center hover:scale-110 hover:bg-[#7F5539]/10 transition-all duration-300 cursor-pointer">
                                    <svg className="w-5 h-5" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                
                                {/* تيليجرام */}
                                <a href="https://t.me/Fadwa_Abisa?fbclid=IwY2xjawMhaF1leHRuA2FlbQIxMABicmlkETF6V1hFUTFQZ0J6UHdHQlIzAR7JI93sd8jOZzqJp4hK9_6UNL7UK0DWwFNdymcZyMYXawqD2laon5vf4poQIA_aem_s5jcKbUxobpQS2DcaQaObA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#7F5539]/20 flex items-center justify-center hover:scale-110 hover:bg-[#7F5539]/10 transition-all duration-300 cursor-pointer">
                                    <svg className="w-5 h-5" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                </a>
                                
                                {/* يوتيوب */}
                                <a href="https://www.youtube.com/@your_youtube_channel" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#7F5539]/20 flex items-center justify-center hover:scale-110 hover:bg-[#7F5539]/10 transition-all duration-300 cursor-pointer">
                                    <svg className="w-5 h-5" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                            </div>

                            {/* معلومات إضافية */}
                            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                <h4 className="font-bold mb-2" style={{ color: '#371E13' }}>ساعات العمل</h4>
                                <p style={{ color: '#371E13' }} className="text-sm">الأحد - الخميس: 8:00 ص - 1:00 م</p>
                                <p style={{ color: '#371E13' }} className="text-sm">السبت: 9:00 ص - 12:00 م</p>
                            </div>
                        </div>
                    </div>

                    {/* خط الفصل وحقوق النشر */}
                    <div className="border-t border-white/20 mt-12 pt-8 text-center">
                        <p style={{ color: '#371E13' }} className="text-sm">
                            جميع الحقوق محفوظة © 2024 المعهد المتوسط للدراسات الإسلامية
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AcademicPortalPage;

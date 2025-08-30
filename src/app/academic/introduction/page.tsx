"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const AcademicIntroductionPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(210, 180, 140, 0.6) 0%, transparent 50%)`,
                        backgroundSize: '80px 80px'
                    }}
                ></div>

                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full animate-ping opacity-30"
                        style={{
                            backgroundColor: i % 3 === 0 ? '#D2B48C' : i % 3 === 1 ? '#B8956A' : '#F0E6D6',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* النافبار */}
            <Navbar />

            {/* المحتوى الرئيسي */}
            <main className="relative z-10 pt-24">
                <div className="container mx-auto px-6 py-12">

                    {/* العنوان الرئيسي */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6 leading-tight"
                            style={{
                                background: 'linear-gradient(135deg, #B8956A, #D2B48C)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                            البوابة العلمية للمعهد المتوسط للدراسات الإسلامية
                        </h1>

                        <div className="w-32 h-1 rounded-full mx-auto mb-8"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>

                        <p className="text-xl text-lama-yellow max-w-4xl mx-auto leading-relaxed">
                            منصتك الرقمية الشاملة للوصول إلى جميع الخدمات الأكاديمية والتعليمية بسهولة ويسر
                        </p>
                    </div>

                    {/* مقدمة عن البوابة */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                                {/* النص */}
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-lama-yellow mb-6">ما هي البوابة العلمية؟</h2>

                                    <div className="space-y-4 text-lama-sky leading-relaxed">
                                        <p>
                                            البوابة العلمية هي نظام إلكتروني متطور يهدف إلى توفير بيئة تعليمية رقمية شاملة
                                            لجميع طلاب وأعضاء هيئة التدريس في المعهد المتوسط للدراسات الإسلامية.
                                        </p>

                                        <p>
                                            تجمع البوابة جميع الخدمات الأكاديمية في مكان واحد، من التسجيل للمقررات وحتى
                                            متابعة الدرجات والتواصل مع الأساتذة، مما يسهل العملية التعليمية ويجعلها أكثر
                                            فعالية وتنظيماً.
                                        </p>

                                        <p>
                                            كما تتيح البوابة الوصول إلى المكتبة الرقمية والموارد التعليمية المتنوعة،
                                            بالإضافة إلى منصات التعلم الإلكتروني والفصول الافتراضية.
                                        </p>
                                    </div>
                                </div>

                                {/* الصورة التوضيحية */}
                                <div className="relative">
                                    <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-lama-sky/20 to-lama-yellow/20"></div>
                                        <div className="w-full h-full flex items-center justify-center text-6xl"
                                            style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)' }}>
                                            🌐
                                        </div>
                                    </div>

                                    {/* عناصر زخرفية */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-lama-sky animate-bounce"></div>
                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-lama-yellow animate-bounce" style={{ animationDelay: '1s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* خدمات البوابة */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">خدمات البوابة العلمية</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'التسجيل الأكاديمي',
                                    description: 'تسجيل المقررات الدراسية وإدارة الجدول الأكاديمي بسهولة',
                                    icon: '📝',
                                    features: ['تسجيل المقررات', 'عرض الجدول الدراسي', 'طلب إضافة/حذف', 'متابعة الحالة الأكاديمية']
                                },
                                {
                                    title: 'نظام الدرجات',
                                    description: 'متابعة الدرجات والنتائج الأكاديمية لجميع المقررات',
                                    icon: '📊',
                                    features: ['عرض الدرجات', 'حساب المعدلات', 'كشوف النتائج', 'التقارير الأكاديمية']
                                },
                                {
                                    title: 'المكتبة الرقمية',
                                    description: 'الوصول إلى آلاف المراجع والكتب الإلكترونية المتخصصة',
                                    icon: '📚',
                                    features: ['البحث في المصادر', 'تحميل الكتب', 'قواعد البيانات', 'المجلات العلمية']
                                },
                                {
                                    title: 'التعلم الإلكتروني',
                                    description: 'منصة التعلم الإلكتروني والفصول الافتراضية',
                                    icon: '💻',
                                    features: ['الفصول الافتراضية', 'الواجبات الإلكترونية', 'المحاضرات المسجلة', 'المناقشات التفاعلية']
                                },
                                {
                                    title: 'التواصل الأكاديمي',
                                    description: 'التواصل مع أعضاء هيئة التدريس والزملاء',
                                    icon: '💬',
                                    features: ['رسائل الأساتذة', 'منتديات النقاش', 'الإشعارات الأكاديمية', 'ساعات المكتب']
                                },
                                {
                                    title: 'الخدمات الطلابية',
                                    description: 'جميع الخدمات الإدارية والطلابية في مكان واحد',
                                    icon: '🎓',
                                    features: ['طلب الوثائق', 'الشؤون المالية', 'الأنشطة الطلابية', 'الدعم التقني']
                                }
                            ].map((service, index) => (
                                <div key={index} className="modern-card p-6 group cursor-pointer">
                                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <span className="text-2xl text-white">{service.icon}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-lama-yellow mb-3 text-center">{service.title}</h3>
                                    <p className="text-lama-sky leading-relaxed mb-4 text-center">{service.description}</p>

                                    <div className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-lama-sky flex-shrink-0"></span>
                                                <span className="text-lama-sky text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* مميزات البوابة */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">مميزات البوابة العلمية</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'سهولة الاستخدام',
                                    description: 'واجهة مستخدم بديهية وسهلة التنقل مصممة خصيصاً للطلاب والأساتذة',
                                    icon: '👆',
                                    highlights: ['تصميم بديهي', 'تنقل سهل', 'دعم عربي كامل']
                                },
                                {
                                    title: 'الأمان والحماية',
                                    description: 'نظام أمان متقدم لحماية بياناتك الأكاديمية والشخصية',
                                    icon: '🔒',
                                    highlights: ['تشفير البيانات', 'مصادقة ثنائية', 'نسخ احتياطية']
                                },
                                {
                                    title: 'الوصول من أي مكان',
                                    description: 'إمكانية الوصول للبوابة من أي جهاز وفي أي وقت ومن أي مكان',
                                    icon: '🌍',
                                    highlights: ['متوافق مع الجوال', 'عمل بلا انترنت', 'تطبيق محمول']
                                },
                                {
                                    title: 'التحديث المستمر',
                                    description: 'تطوير وتحديث مستمر للخدمات والمميزات حسب احتياجات المستخدمين',
                                    icon: '🔄',
                                    highlights: ['تحديثات دورية', 'ميزات جديدة', 'تحسين الأداء']
                                }
                            ].map((feature, index) => (
                                <div key={index} className="modern-card p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-lama-yellow mb-4">{feature.title}</h3>
                                            <p className="text-lama-sky leading-relaxed mb-6">{feature.description}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {feature.highlights.map((highlight, idx) => (
                                                    <span key={idx} className="px-3 py-1 rounded-full text-sm font-medium"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))',
                                                            color: '#B8956A'
                                                        }}>
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* كيفية الوصول */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-lama-yellow mb-4">كيفية الوصول للبوابة</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        step: '1',
                                        title: 'التسجيل',
                                        description: 'قم بالتسجيل في البوابة باستخدام الرقم الجامعي وكلمة المرور'
                                    },
                                    {
                                        step: '2',
                                        title: 'تفعيل الحساب',
                                        description: 'فعل حسابك من خلال البريد الإلكتروني أو رقم الهاتف المحمول'
                                    },
                                    {
                                        step: '3',
                                        title: 'البدء',
                                        description: 'ابدأ في استخدام جميع خدمات البوابة والاستفادة من مميزاتها'
                                    }
                                ].map((step, index) => (
                                    <div key={index} className="text-center p-6 rounded-2xl"
                                        style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.4), rgba(226, 213, 199, 0.2))' }}>
                                        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            {step.step}
                                        </div>

                                        <h3 className="text-lg font-bold text-lama-yellow mb-3">{step.title}</h3>
                                        <p className="text-lama-sky text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* دعوة للعمل */}
                    <div className="max-w-4xl mx-auto">
                        <div className="modern-card p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-3xl text-white">🚀</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">ابدأ رحلتك التعليمية معنا</h2>

                            <p className="text-lg text-lama-sky leading-relaxed mb-8">
                                انضم إلى آلاف الطلاب الذين يستفيدون من البوابة العلمية، واستمتع بتجربة تعليمية متميزة
                                ومتطورة تجمع بين التقنية الحديثة والمنهج الإسلامي الأصيل.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/academic/register">
                                    <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        التسجيل في البوابة
                                    </button>
                                </Link>

                                <Link href="/academic/programs">
                                    <button className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                                        style={{
                                            borderColor: '#D2B48C',
                                            color: '#B8956A'
                                        }}>
                                        تصفح البرامج
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AcademicIntroductionPage;

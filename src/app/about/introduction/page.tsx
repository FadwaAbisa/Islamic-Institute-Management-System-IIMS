"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const IntroductionPage = () => {
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
                            التعريف بالمعهد المتوسط للدراسات الإسلامية
                        </h1>

                        <div className="w-32 h-1 rounded-full mx-auto mb-8"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>

                        <p className="text-xl text-lama-yellow max-w-4xl mx-auto leading-relaxed">
                            يُعد المعهد المتوسط للدراسات الإسلامية منارة علمية تجمع بين الأصالة والمعاصرة في تقديم التعليم الإسلامي المتميز
                        </p>
                    </div>

                    {/* بطاقة التعريف الرئيسية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                                {/* النص */}
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold text-lama-yellow mb-6">نبذة عن المعهد</h2>

                                    <div className="space-y-4 text-lama-sky leading-relaxed">
                                        <p>
                                            تأسس المعهد المتوسط للدراسات الإسلامية عام 1985م بهدف إعداد جيل من الطلاب والطالبات
                                            المتخصصين في العلوم الإسلامية والعربية، ويقع المعهد في موقع استراتيجي بمدينة طرطوس بليبيا.
                                        </p>

                                        <p>
                                            يتميز المعهد بمناهجه المتطورة التي تجمع بين التراث الإسلامي الأصيل والمناهج التعليمية الحديثة،
                                            مما يضمن إعداد خريجين قادرين على مواجهة تحديات العصر مع المحافظة على الهوية الإسلامية.
                                        </p>

                                        <p>
                                            كما يفخر المعهد بهيئة تدريسية متميزة من أساتذة وعلماء مختصين، بالإضافة إلى بنية تحتية
                                            متقدمة تشمل مكتبة ضخمة ومختبرات حديثة وقاعات دراسية مجهزة بأحدث التقنيات التعليمية.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-8">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                            style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' }}>
                                            <span className="text-lg">📅</span>
                                            <span className="text-lama-yellow font-medium">تأسس عام 1985م</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                            style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' }}>
                                            <span className="text-lg">📍</span>
                                            <span className="text-lama-yellow font-medium">طرطوس، ليبيا</span>
                                        </div>

                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                            style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' }}>
                                            <span className="text-lg">🎓</span>
                                            <span className="text-lama-yellow font-medium">دراسات إسلامية متخصصة</span>
                                        </div>
                                    </div>
                                </div>

                                {/* الصورة */}
                                <div className="relative">
                                    <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-lama-sky/20 to-lama-yellow/20"></div>
                                        <div className="w-full h-full flex items-center justify-center text-6xl"
                                            style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)' }}>
                                            🕌
                                        </div>
                                    </div>

                                    {/* عناصر زخرفية */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-lama-sky animate-bounce"></div>
                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-lama-yellow animate-bounce" style={{ animationDelay: '1s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* الأقسام والتخصصات */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">الأقسام والتخصصات</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'القرآن الكريم وعلومه',
                                    description: 'تخصص في تحفيظ القرآن الكريم وتعليم علوم التجويد والتفسير',
                                    icon: '📖'
                                },
                                {
                                    title: 'الحديث الشريف',
                                    description: 'دراسة السنة النبوية وعلوم الحديث والفقه الإسلامي',
                                    icon: '📚'
                                },
                                {
                                    title: 'اللغة العربية وآدابها',
                                    description: 'تعليم قواعد اللغة العربية والأدب والبلاغة والنحو',
                                    icon: '✍️'
                                },
                                {
                                    title: 'التاريخ الإسلامي',
                                    description: 'دراسة تاريخ الإسلام والحضارة الإسلامية عبر العصور',
                                    icon: '🏛️'
                                },
                                {
                                    title: 'الدعوة والخطابة',
                                    description: 'إعداد الدعاة والخطباء وفنون الخطابة والتواصل',
                                    icon: '🎤'
                                },
                                {
                                    title: 'الفقه والأصول',
                                    description: 'دراسة الفقه الإسلامي وأصول الفقه والقضايا المعاصرة',
                                    icon: '⚖️'
                                }
                            ].map((department, index) => (
                                <div key={index} className="modern-card p-6 text-center group cursor-pointer">
                                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <span className="text-2xl">{department.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-lama-yellow mb-3">{department.title}</h3>
                                    <p className="text-lama-sky leading-relaxed">{department.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* الإنجازات والأرقام */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-lama-yellow mb-4">إنجازاتنا بالأرقام</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { number: '6540', label: 'طالب وطالبة', icon: '🎓' },
                                    { number: '872', label: 'خريج', icon: '📜' },
                                    { number: '60', label: 'عضو هيئة تدريس', icon: '👨‍🏫' },
                                    { number: '40', label: 'عاماً من التميز', icon: '🏆' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-4xl mb-2">{stat.icon}</div>
                                        <div className="text-3xl font-bold text-lama-yellow mb-1">{stat.number}</div>
                                        <div className="text-lama-sky font-medium">{stat.label}</div>
                                    </div>
                                ))}
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

export default IntroductionPage;

"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

const GoalsPage = () => {
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

    const mainGoals = [
        {
            title: 'إعداد العلماء والدعاة',
            description: 'تخريج جيل من العلماء والدعاة المتخصصين في العلوم الإسلامية والقادرين على نشر الدعوة الإسلامية بالحكمة والموعظة الحسنة.',
            icon: '👨‍🎓',
            details: [
                'تعليم علوم القرآن والحديث',
                'إعداد الخطباء والوعاظ',
                'تدريس علوم الدعوة والبلاغة',
                'تطوير مهارات التواصل والإقناع'
            ]
        },
        {
            title: 'الحفاظ على التراث الإسلامي',
            description: 'صون التراث الإسلامي وعلومه من الضياع والتحريف، ونقله للأجيال القادمة بطريقة علمية منهجية.',
            icon: '📜',
            details: [
                'حفظ وتحقيق المخطوطات',
                'دراسة التراث الإسلامي',
                'تدريس التاريخ الإسلامي',
                'توثيق العلوم الشرعية'
            ]
        },
        {
            title: 'التعليم المتميز والمعاصر',
            description: 'تقديم تعليم إسلامي متميز يجمع بين الأصالة والمعاصرة، ويستخدم أحدث الطرق والوسائل التعليمية.',
            icon: '💻',
            details: [
                'استخدام التقنيات الحديثة',
                'تطوير المناهج التعليمية',
                'التعلم الإلكتروني',
                'ورش العمل والتدريب'
            ]
        },
        {
            title: 'البحث العلمي والتأليف',
            description: 'تشجيع البحث العلمي في مختلف فروع العلوم الإسلامية، وإنتاج دراسات وبحوث تخدم الأمة الإسلامية.',
            icon: '📚',
            details: [
                'البحوث الأكاديمية المتخصصة',
                'المؤتمرات العلمية',
                'النشر الأكاديمي',
                'التعاون البحثي الدولي'
            ]
        },
        {
            title: 'خدمة المجتمع المحلي',
            description: 'تقديم خدمات تعليمية وثقافية ودينية للمجتمع المحلي، والمساهمة في حل المشكلات الاجتماعية.',
            icon: '🤝',
            details: [
                'الدورات التدريبية العامة',
                'الاستشارات الشرعية',
                'البرامج المجتمعية',
                'الأنشطة الخيرية'
            ]
        },
        {
            title: 'التواصل مع العالم الإسلامي',
            description: 'بناء جسور التواصل مع المؤسسات التعليمية والثقافية في العالم الإسلامي لتبادل الخبرات والتجارب.',
            icon: '🌍',
            details: [
                'الشراكات الدولية',
                'برامج التبادل الطلابي',
                'المؤتمرات الدولية',
                'الاتفاقيات الأكاديمية'
            ]
        }
    ];

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
                            أهداف المعهد المتوسط للدراسات الإسلامية
                        </h1>

                        <div className="w-32 h-1 rounded-full mx-auto mb-8"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>

                        <p className="text-xl text-lama-yellow max-w-4xl mx-auto leading-relaxed">
                            نحدد أهدافنا بوضوح لنضمن تحقيق رسالتنا في إعداد جيل متميز من العلماء والدعاة والمتخصصين
                        </p>
                    </div>

                    {/* مقدمة عن الأهداف */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="modern-card p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-3xl text-white">🎯</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">نحو تحقيق أهدافنا النبيلة</h2>

                            <p className="text-lg text-lama-sky leading-relaxed">
                                يسعى المعهد المتوسط للدراسات الإسلامية إلى تحقيق مجموعة من الأهداف النبيلة التي تهدف إلى
                                إعداد جيل متميز من المتخصصين في العلوم الإسلامية، والمساهمة في خدمة المجتمع والأمة الإسلامية
                                من خلال التعليم والبحث العلمي والدعوة إلى الله بالحكمة والموعظة الحسنة.
                            </p>
                        </div>
                    </div>

                    {/* الأهداف الرئيسية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">أهدافنا الرئيسية</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {mainGoals.map((goal, index) => (
                                <div key={index} className="modern-card p-8 group cursor-pointer">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="text-2xl">{goal.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-lama-yellow mb-4">{goal.title}</h3>
                                            <p className="text-lama-sky leading-relaxed mb-6">{goal.description}</p>

                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-lama-yellow text-sm mb-3">المجالات التفصيلية:</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {goal.details.map((detail, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-lama-sky flex-shrink-0"></span>
                                                            <span className="text-lama-sky text-sm">{detail}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* الأهداف قصيرة المدى */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">أهدافنا قصيرة المدى</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'تطوير المناهج',
                                    description: 'تحديث وتطوير المناهج الدراسية لتواكب متطلبات العصر',
                                    icon: '📖',
                                    timeline: 'السنة الأولى'
                                },
                                {
                                    title: 'تدريب المعلمين',
                                    description: 'إقامة دورات تدريبية متخصصة لأعضاء هيئة التدريس',
                                    icon: '👨‍🏫',
                                    timeline: 'كل فصل دراسي'
                                },
                                {
                                    title: 'تحسين البنية التحتية',
                                    description: 'تطوير المرافق والقاعات والمختبرات التعليمية',
                                    icon: '🏗️',
                                    timeline: 'السنتان القادمتان'
                                },
                                {
                                    title: 'برامج تبادل',
                                    description: 'إنشاء برامج تبادل طلابي مع معاهد أخرى',
                                    icon: '🔄',
                                    timeline: 'خلال 18 شهر'
                                },
                                {
                                    title: 'المكتبة الرقمية',
                                    description: 'تطوير مكتبة رقمية شاملة للطلاب والباحثين',
                                    icon: '💾',
                                    timeline: 'العام القادم'
                                },
                                {
                                    title: 'برامج مجتمعية',
                                    description: 'تفعيل دور المعهد في خدمة المجتمع المحلي',
                                    icon: '🏘️',
                                    timeline: 'مستمر'
                                }
                            ].map((goal, index) => (
                                <div key={index} className="modern-card p-6 text-center">
                                    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <span className="text-xl text-white">{goal.icon}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-lama-yellow mb-3">{goal.title}</h3>
                                    <p className="text-lama-sky text-sm leading-relaxed mb-4">{goal.description}</p>

                                    <div className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))',
                                            color: '#B8956A'
                                        }}>
                                        {goal.timeline}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* الأهداف طويلة المدى */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-lama-yellow mb-4">أهدافنا طويلة المدى</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="space-y-8">
                                {[
                                    {
                                        year: '2025-2030',
                                        title: 'التوسع الأكاديمي',
                                        description: 'إضافة برامج دراسات عليا وتخصصات جديدة في العلوم الإسلامية'
                                    },
                                    {
                                        year: '2030-2035',
                                        title: 'الاعتماد الدولي',
                                        description: 'الحصول على الاعتماد من المنظمات الأكاديمية الدولية المتخصصة'
                                    },
                                    {
                                        year: '2035-2040',
                                        title: 'المركز الإقليمي',
                                        description: 'أن نصبح مركزاً إقليمياً رائداً في الدراسات الإسلامية والعربية'
                                    }
                                ].map((goal, index) => (
                                    <div key={index} className="flex items-start gap-6 p-6 rounded-2xl"
                                        style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.4), rgba(226, 213, 199, 0.2))' }}>
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="text-white font-bold text-sm">{goal.year.split('-')[0]}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-lama-yellow mb-2">{goal.title}</h3>
                                            <p className="text-lama-sky leading-relaxed">{goal.description}</p>
                                            <span className="text-xs text-lama-sky/70 font-medium">{goal.year}</span>
                                        </div>
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
                                <span className="text-3xl text-white">🤲</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">كن جزءاً من تحقيق أهدافنا</h2>

                            <p className="text-lg text-lama-sky leading-relaxed mb-8">
                                ندعوك للانضمام إلينا في رحلتنا نحو تحقيق هذه الأهداف النبيلة، سواءً كطالب طموح أو كشريك
                                في التطوير أو كداعم لرسالتنا التعليمية والدعوية.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    سجل معنا الآن
                                </button>

                                <button className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                                    style={{
                                        borderColor: '#D2B48C',
                                        color: '#B8956A'
                                    }}>
                                    تواصل معنا
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default GoalsPage;

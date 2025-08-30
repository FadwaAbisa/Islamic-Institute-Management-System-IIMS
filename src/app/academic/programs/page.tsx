"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const ProgramsPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

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

    const programs = [
        {
            id: 1,
            title: 'الدبلوم المتوسط في القرآن الكريم وعلومه',
            duration: 'سنتان دراسيتان',
            credits: '72 ساعة معتمدة',
            description: 'برنامج متخصص في تحفيظ القرآن الكريم وتعليم علوم التجويد والقراءات والتفسير',
            icon: '📖',
            subjects: [
                'حفظ القرآن الكريم',
                'علم التجويد',
                'علم القراءات',
                'أسباب النزول',
                'علوم القرآن',
                'التفسير الموضوعي'
            ],
            careers: ['معلم قرآن كريم', 'مقرئ', 'محفظ قرآن', 'باحث في علوم القرآن'],
            requirements: ['حفظ 10 أجزاء على الأقل', 'اجتياز امتحان القبول', 'المقابلة الشخصية']
        },
        {
            id: 2,
            title: 'الدبلوم المتوسط في الحديث النبوي الشريف',
            duration: 'سنتان دراسيتان',
            credits: '70 ساعة معتمدة',
            description: 'برنامج يركز على دراسة السنة النبوية وعلوم الحديث والفقه الاستنباطي',
            icon: '📚',
            subjects: [
                'علوم الحديث',
                'صحيح البخاري',
                'صحيح مسلم',
                'السنن الأربعة',
                'مصطلح الحديث',
                'الفقه الاستنباطي'
            ],
            careers: ['معلم حديث', 'باحث في السنة', 'مختص في الفقه', 'مدرس علوم شرعية'],
            requirements: ['الثانوية العامة', 'اجتياز امتحان القبول', 'حفظ 500 حديث على الأقل']
        },
        {
            id: 3,
            title: 'الدبلوم المتوسط في اللغة العربية وآدابها',
            duration: 'سنتان دراسيتان',
            credits: '68 ساعة معتمدة',
            description: 'برنامج شامل لتعليم قواعد اللغة العربية والأدب العربي والبلاغة',
            icon: '✍️',
            subjects: [
                'النحو والصرف',
                'البلاغة العربية',
                'الأدب العربي',
                'العروض والقافية',
                'فقه اللغة',
                'الشعر والنثر'
            ],
            careers: ['معلم لغة عربية', 'أديب', 'كاتب', 'مدقق لغوي', 'مترجم'],
            requirements: ['الثانوية العامة', 'إتقان قواعد اللغة العربية', 'اجتياز امتحان الكفاءة اللغوية']
        },
        {
            id: 4,
            title: 'الدبلوم المتوسط في التاريخ والحضارة الإسلامية',
            duration: 'سنتان دراسيتان',
            credits: '66 ساعة معتمدة',
            description: 'دراسة شاملة لتاريخ الإسلام والحضارة الإسلامية عبر العصور المختلفة',
            icon: '🏛️',
            subjects: [
                'التاريخ الإسلامي',
                'الحضارة الإسلامية',
                'السيرة النبوية',
                'تاريخ الخلفاء',
                'الدول الإسلامية',
                'المدن الإسلامية'
            ],
            careers: ['معلم تاريخ', 'باحث تاريخي', 'مرشد سياحي', 'كاتب تراثي'],
            requirements: ['الثانوية العامة', 'شغف بالتاريخ', 'اجتياز امتحان القبول']
        },
        {
            id: 5,
            title: 'الدبلوم المتوسط في الدعوة والخطابة',
            duration: 'سنتان دراسيتان',
            credits: '64 ساعة معتمدة',
            description: 'إعداد الدعاة والخطباء المتميزين في فنون الخطابة والتواصل',
            icon: '🎤',
            subjects: [
                'أصول الدعوة',
                'فن الخطابة',
                'التواصل الفعال',
                'إعداد الخطب',
                'وسائل الدعوة',
                'الدعوة المعاصرة'
            ],
            careers: ['خطيب مسجد', 'داعية', 'مدرب تطوير ذاتي', 'إعلامي ديني'],
            requirements: ['الثانوية العامة', 'مهارات التواصل', 'اجتياز المقابلة الشخصية']
        },
        {
            id: 6,
            title: 'الدبلوم المتوسط في الفقه الإسلامي وأصوله',
            duration: 'سنتان دراسيتان',
            credits: '74 ساعة معتمدة',
            description: 'دراسة معمقة للفقه الإسلامي وأصوله مع التطبيق على القضايا المعاصرة',
            icon: '⚖️',
            subjects: [
                'أصول الفقه',
                'الفقه المقارن',
                'فقه العبادات',
                'فقه المعاملات',
                'فقه الأسرة',
                'النوازل المعاصرة'
            ],
            careers: ['مفتي', 'قاضي شرعي', 'مستشار شرعي', 'باحث فقهي'],
            requirements: ['الثانوية العامة', 'معرفة أساسية بالعلوم الشرعية', 'اجتياز امتحان القبول']
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
                            البرامج الدراسية في المعهد
                        </h1>

                        <div className="w-32 h-1 rounded-full mx-auto mb-8"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>

                        <p className="text-xl text-lama-yellow max-w-4xl mx-auto leading-relaxed">
                            اكتشف برامجنا الأكاديمية المتنوعة المصممة لإعداد جيل متميز من المتخصصين في العلوم الإسلامية
                        </p>
                    </div>

                    {/* نظرة عامة على البرامج */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="modern-card p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-3xl text-white">🎓</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">برامج دبلوم متوسط متخصصة</h2>

                            <p className="text-lg text-lama-sky leading-relaxed mb-8">
                                يقدم المعهد المتوسط للدراسات الإسلامية مجموعة متنوعة من البرامج الأكاديمية المتخصصة
                                في مختلف فروع العلوم الإسلامية والعربية، مصممة لتلبية احتياجات سوق العمل والمجتمع.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">6️⃣</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">برامج متنوعة</h3>
                                    <p className="text-lama-sky text-sm">ستة برامج أكاديمية متخصصة</p>
                                </div>

                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">📅</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">سنتان دراسيتان</h3>
                                    <p className="text-lama-sky text-sm">مدة الدراسة لجميع البرامج</p>
                                </div>

                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">🏆</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">معتمدة رسمياً</h3>
                                    <p className="text-lama-sky text-sm">شهادات معترف بها محلياً</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* البرامج الدراسية */}
                    <div className="max-w-7xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">البرامج المتاحة</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {programs.map((program, index) => (
                                <div key={program.id} className="modern-card p-8 group cursor-pointer">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="text-2xl text-white">{program.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-lama-yellow mb-2">{program.title}</h3>
                                            <p className="text-lama-sky leading-relaxed mb-4">{program.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))',
                                                        color: '#B8956A'
                                                    }}>
                                                    {program.duration}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))',
                                                        color: '#B8956A'
                                                    }}>
                                                    {program.credits}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                                        className="w-full px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                        style={{
                                            background: selectedProgram === program.id
                                                ? 'linear-gradient(135deg, #D2B48C, #B8956A)'
                                                : 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))',
                                            color: selectedProgram === program.id ? 'white' : '#B8956A'
                                        }}
                                    >
                                        {selectedProgram === program.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                                    </button>

                                    {/* التفاصيل المنسدلة */}
                                    {selectedProgram === program.id && (
                                        <div className="mt-6 pt-6 border-t border-lama-sky/20 space-y-6">
                                            {/* المقررات الدراسية */}
                                            <div>
                                                <h4 className="font-bold text-lama-yellow mb-3">المقررات الدراسية:</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {program.subjects.map((subject, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-lama-sky flex-shrink-0"></span>
                                                            <span className="text-lama-sky text-sm">{subject}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* فرص العمل */}
                                            <div>
                                                <h4 className="font-bold text-lama-yellow mb-3">فرص العمل:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {program.careers.map((career, idx) => (
                                                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium"
                                                            style={{
                                                                background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.3), rgba(184, 149, 106, 0.3))',
                                                                color: '#B8956A'
                                                            }}>
                                                            {career}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* شروط القبول */}
                                            <div>
                                                <h4 className="font-bold text-lama-yellow mb-3">شروط القبول:</h4>
                                                <div className="space-y-2">
                                                    {program.requirements.map((requirement, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-lama-yellow flex-shrink-0"></span>
                                                            <span className="text-lama-sky text-sm">{requirement}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* زر التسجيل */}
                                            <div className="pt-4">
                                                <Link href="/academic/register">
                                                    <button className="w-full px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                        التسجيل في هذا البرنامج
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* شروط القبول العامة */}
                            <div className="modern-card p-8">
                                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <span className="text-2xl text-white">📋</span>
                                </div>

                                <h3 className="text-2xl font-bold text-lama-yellow mb-6 text-center">شروط القبول العامة</h3>

                                <div className="space-y-4">
                                    {[
                                        'شهادة الثانوية العامة أو ما يعادلها',
                                        'اجتياز امتحان القبول في التخصص المطلوب',
                                        'المقابلة الشخصية مع لجنة القبول',
                                        'تقديم الوثائق المطلوبة كاملة',
                                        'دفع رسوم التسجيل والقبول',
                                        'الالتزام بلوائح وقوانين المعهد'
                                    ].map((requirement, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                {index + 1}
                                            </span>
                                            <span className="text-lama-sky">{requirement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* الوثائق المطلوبة */}
                            <div className="modern-card p-8">
                                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <span className="text-2xl text-white">📄</span>
                                </div>

                                <h3 className="text-2xl font-bold text-lama-yellow mb-6 text-center">الوثائق المطلوبة</h3>

                                <div className="space-y-4">
                                    {[
                                        'أصل شهادة الثانوية العامة + صورة',
                                        'كشف درجات الثانوية العامة',
                                        'صورة شخصية حديثة (4×6)',
                                        'صورة من بطاقة الهوية الوطنية',
                                        'شهادة طبية تفيد خلو الطالب من الأمراض',
                                        'شهادة حسن سير وسلوك',
                                        'إيصال دفع رسوم التسجيل'
                                    ].map((document, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-lama-sky flex-shrink-0"></span>
                                            <span className="text-lama-sky text-sm">{document}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* دعوة للعمل */}
                    <div className="max-w-4xl mx-auto">
                        <div className="modern-card p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-3xl text-white">🎯</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">ابدأ رحلتك الأكاديمية</h2>

                            <p className="text-lg text-lama-sky leading-relaxed mb-8">
                                اختر البرنامج الذي يناسب ميولك وطموحاتك المهنية، وانضم إلى عائلة المعهد المتوسط
                                للدراسات الإسلامية لتكون جزءاً من مستقبل مشرق في خدمة الإسلام والمجتمع.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/academic/register">
                                    <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        التسجيل الآن
                                    </button>
                                </Link>

                                <Link href="/contact">
                                    <button className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                                        style={{
                                            borderColor: '#D2B48C',
                                            color: '#B8956A'
                                        }}>
                                        استفسار أكثر
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

export default ProgramsPage;

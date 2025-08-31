"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const IntroductionPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const toggleAccordion = (accordionId: string) => {
        if (openAccordion === accordionId) {
            // إذا كان الأكورديون مفتوح، أغلقه
            setOpenAccordion(null);
        } else {
            // إذا كان مغلق أو كان أكورديون آخر مفتوح، افتح هذا وأغلق الآخرين
            setOpenAccordion(accordionId);
        }
    };

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

                        <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{ color: '#371E13' }}>
                            يُعد المعهد المتوسط للدراسات الإسلامية منارة علمية تجمع بين الأصالة والمعاصرة في تقديم التعليم الإسلامي المتميز
                        </p>
                    </div>

                    {/* بطاقة التعريف الرئيسية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                                {/* النص */}
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#371E13' }}>نبذة عن المعهد</h2>

                                    <div className="space-y-4 leading-relaxed" style={{ color: '#371E13' }}>
                                        <p>
                                            المعهد المتوسط للدراسات الإسلامية هو مؤسسة تعليمية تهدف إلى تقديم تعليم شرعي متين ومؤصل للفئة المتوسطة، 
                                            ضمن بيئة أكاديمية محفزة وملتزمة بثوابت الشريعة الإسلامية. نسعى في المعهد إلى إعداد طلاب متميزين ومؤصلين، 
                                            قادرين على فهم العلوم الشرعية وتأصيلها، والتفاعل مع التحديات المعاصرة برؤية متزنة.
                                        </p>
                                    </div>


                                </div>

                                {/* الصورة */}
                                <div className="relative">
                                    <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="/FrontEnd_img/5.jpg"
                                            alt="المعهد المتوسط للدراسات الإسلامية"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-lama-sky/10 to-lama-yellow/10"></div>
                                    </div>

                                    {/* عناصر زخرفية */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-lama-sky animate-bounce"></div>
                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-lama-yellow animate-bounce" style={{ animationDelay: '1s' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* الرؤية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-12 text-center">
                            <div className="mb-8">
                                {/* أيقونة العين فوق العنوان */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>الرؤية</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="relative">
                                {/* النص الرئيسي */}
                                <div className="max-w-4xl mx-auto">
                                    <p className="text-2xl leading-relaxed font-medium" style={{ color: '#371E13' }}>
                                        الريادة العلمية الأكاديمية في مجال التأصيل والتعليم الشرعي للمرحلة المتوسطة.
                                    </p>
                                </div>

                                {/* عناصر زخرفية */}
                                <div className="absolute top-0 left-1/4 w-4 h-4 rounded-full bg-lama-sky animate-pulse opacity-60"></div>
                                <div className="absolute top-10 right-1/4 w-3 h-3 rounded-full bg-lama-yellow animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute bottom-0 left-1/3 w-2 h-2 rounded-full bg-lama-sky animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
                                <div className="absolute bottom-10 right-1/3 w-3 h-3 rounded-full bg-lama-yellow animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* الرسالة */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-12 text-center">
                            <div className="mb-8">
                                {/* أيقونة الرسالة فوق العنوان */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                    </svg>
                                </div>
                                
                                <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>الرسالة</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="relative">
                                {/* النص الرئيسي */}
                                <div className="max-w-4xl mx-auto">
                                    <p className="text-2xl leading-relaxed font-medium" style={{ color: '#371E13' }}>
                                        توفير تعليم شرعي مخصص لطلاب المرحلة المتوسطة، ضمن بيئة تعليمية ملتزمة بالتأصيل والتحصيل، 
                                        قائمة على الأسس الشرعية والأكاديمية، مع توظيف التقنيات الحديثة.
                                    </p>
                                </div>

                                {/* عناصر زخرفية */}
                                <div className="absolute top-0 left-1/4 w-4 h-4 rounded-full bg-lama-sky animate-pulse opacity-60"></div>
                                <div className="absolute top-10 right-1/4 w-3 h-3 rounded-full bg-lama-yellow animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute bottom-0 left-1/3 w-2 h-2 rounded-full bg-lama-sky animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
                                <div className="absolute bottom-10 right-1/3 w-3 h-3 rounded-full bg-lama-yellow animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* القيم */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-12">
                            <div className="text-center mb-12">
                                {/* أيقونة القيم فوق العنوان */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>القيم</h2>
                                <div className="w-24 h-1 rounded-full mx-auto mb-8"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                                
                                <p className="text-xl leading-relaxed max-w-4xl mx-auto" style={{ color: '#371E13' }}>
                                    يقوم المعهد على قيم عظيمة مستوحاة من الكتاب والسنة، حيث أنهما يصيغان منهاج حياة لكل مسلم:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* الإحسان */}
                                <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' }}>
                                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#371E13' }}>الإحسان</h3>
                                    <p className="text-lg leading-relaxed" style={{ color: '#371E13' }}>
                                        [إنَّ الله كتب الإحسان على كُلِّ شيءٍ]
                                    </p>
                                    <p className="text-sm mt-2 opacity-70" style={{ color: '#371E13' }}>
                                        رواه مسلم
                                    </p>
                                </div>

                                {/* الإتقان */}
                                <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' }}>
                                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#371E13' }}>الإتقان</h3>
                                    <p className="text-lg leading-relaxed" style={{ color: '#371E13' }}>
                                        [إنَّ الله تعالى يُحِبُّ إذا عمل أحدكم عملاً أن يتقنه]
                                    </p>
                                    <p className="text-sm mt-2 opacity-70" style={{ color: '#371E13' }}>
                                        صحيح الجامع
                                    </p>
                                </div>

                                {/* التعاون */}
                                <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' }}>
                                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                            <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#371E13' }}>التعاون</h3>
                                    <p className="text-lg leading-relaxed" style={{ color: '#371E13' }}>
                                        {`{وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى}`}
                                    </p>
                                    <p className="text-sm mt-2 opacity-70" style={{ color: '#371E13' }}>
                                        من سورة المائدة
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* أهداف المعهد */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-12">
                            <div className="text-center mb-12">
                                                        {/* أيقونة الأهداف فوق العنوان */}
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 3a1 1 0 011-1h1v16a1 1 0 11-2 0V3z"/>
                                <path d="M6 4c2 0 3-1 5-1s3 1 5 1v6c-2 0-3 1-5 1s-3-1-5-1V4z"/>
                            </svg>
                        </div>
                                
                                <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>أهداف المعهد</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="space-y-6">
                                {/* تطوير العملية التعليمية */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                                                <button
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                onClick={() => toggleAccordion('goal1')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>تطوير العملية التعليمية</h3>
                                </div>
                                <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal1' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal1' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>تحسين العمليات المتعلقة بالجانب التعليمي، بوضع أدلة إرشادية، ولوائح مقننة.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إعداد مناهج ومقررات تعليمية شرعية ملائمة.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>استخدام الأساليب التعليمية الأصيلة والنموذجية.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>العمل على إحياء مبادرة التعليم العتيق، عبر إقامة الحلق العلمية بالمساجد.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                                                {/* السمو بطلاب المعهد */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal2')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>السمو بطلاب المعهد</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal2' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal2' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>تأهيل الطلاب للدراسة في المعهد، وتهيئتهم للدراسة وفق مسارات مخصصة.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إطلاق البرامج التربوية والأنشطة المتممة والمصاحبة للعملية التعليمية.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إعداد آلية ونظم لتقييم السلوك والتحصيل العلمي، والعمل على تحديثها.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* دعم الرعاية التربوية */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button 
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal3')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>دعم الرعاية التربوية</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal3' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal3' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>الإشراف المباشر على الأداء التعليمي والتربوي للمعلمين بالتعاون مع الموجهين.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>تطوير مكاتب الخدمة الاجتماعية والنفسية بالفروع.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* تأهيل الكوادر العاملة */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button 
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal4')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>تأهيل الكوادر العاملة</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal4' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal4' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>الرفع من الكفاءة المهنية، وتطوير القدرات.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إقامة ورش العمل والندوات التي تعزز الخبرات التربوية والتعليمية.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>التقويم المستمر، وإعداد آليات للمتابعة والإشراف المناسبة.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* الاستفادة من التقنية */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button 
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal5')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>الاستفادة من التقنية</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal5' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal5' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إنشاء منصة تعليمية وتوفير محتوى رقمي، وآلية مخصصة لكافة مراحل الدراسة.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إعداد آلية تقنية متكاملة لعمليات الاختبارات، والامتحانات، والرصد، والنتائج.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* تعزيز انتشار الفروع */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button 
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal6')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>تعزيز انتشار الفروع</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal6' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal6' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إعادة هيكلة الفروع وفق رؤية علمية منهجية أكاديمية.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>وضع معايير لإنشاء ورعاية ودعم فروع المعهد.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* بناء شراكات استراتيجية */}
                                <div className="border border-lama-sky/20 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.05), rgba(184, 149, 106, 0.05))' }}>
                                    <button 
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-lama-sky/10 transition-all duration-300"
                                        onClick={() => toggleAccordion('goal7')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold" style={{ color: '#371E13' }}>بناء شراكات استراتيجية</h3>
                                        </div>
                                        <svg className={`w-6 h-6 transition-transform duration-300 ${openAccordion === 'goal7' ? 'rotate-180' : ''}`} style={{ color: '#371E13' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ${openAccordion === 'goal7' ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="p-6 pt-0">
                                            <ul className="space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>إطلاق الملتقيات العلمية السنوية، ودعوة الخبراء والمختصين.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-lama-sky mt-2 flex-shrink-0"></span>
                                                    <span style={{ color: '#371E13' }}>تبادل الزيارات بين المؤسسات التعليمية، والتعاون في المجالات المشتركة.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* فروع المعهد */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-12">
                            <div className="text-center mb-12">
                                {/* أيقونة الفروع فوق العنوان */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                
                                <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>فروع المعهد</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                {/* قائمة اختيار الفرع */}
                                <div className="mb-8">
                                    <select 
                                        className="w-full p-4 rounded-xl border-2 text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4"
                                        style={{ 
                                            borderColor: '#D2B48C',
                                            color: '#371E13',
                                            backgroundColor: '#FCFAF8',
                                            focusRingColor: 'rgba(210, 180, 140, 0.3)'
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>اختر فرعًا</option>
                                        <option value="ابو-بكر-الصديق">أبو بكر الصديق</option>
                                        <option value="ابو-ذر-الغفاري">أبو ذر الغفاري</option>
                                        <option value="أبي-بن-كعب">أبي بن كعب</option>
                                        <option value="اسد-بن-الفرات">أسد بن الفرات</option>
                                        <option value="اسماء-بنت-ابي-بكر">أسماء بنت أبي بكر</option>
                                        <option value="اسماء-بنت-عميس">أسماء بنت عميس</option>
                                        <option value="اسماء-بنت-يزيد">أسماء بنت يزيد</option>
                                        <option value="ام-الدرداء">أم الدرداء</option>
                                        <option value="ام-سلمة">أم سلمة</option>
                                        <option value="انس-بن-مالك">أنس بن مالك</option>
                                        <option value="ابن-ابي-زمنين">ابن أبي زمنين</option>
                                        <option value="ابن-ابي-زيد-القيرواني">ابن أبي زيد القيرواني</option>
                                        <option value="ابن-القيم">ابن القيم</option>
                                        <option value="ابن-شهاب-الزهري">ابن شهاب الزهري</option>
                                        <option value="ابن-عبدالبر">ابن عبدالبر</option>
                                        <option value="الابرار">الأبرار</option>
                                        <option value="الامام-احمد-بن-حنبل">الإمام أحمد بن حنبل</option>
                                        <option value="الامام-اشهب">الإمام أشهب</option>
                                        <option value="الامام-البخاري">الإمام البخاري</option>
                                        <option value="الامام-الشاطبي">الإمام الشاطبي</option>
                                        <option value="الامام-سحنون">الإمام سحنون</option>
                                        <option value="الامام-قالون">الإمام قالون</option>
                                        <option value="الامام-مالك">الإمام مالك</option>
                                        <option value="الامام-مسلم">الإمام مسلم</option>
                                        <option value="الامام-نافع">الإمام نافع</option>
                                        <option value="الادارة-الرئيسة-tripoli">الإدارة الرئيسة - tripoli</option>
                                        <option value="الرئيسي">الرئيسي</option>
                                        <option value="السبعة">السبعة</option>
                                        <option value="الفضيل-بن-عياض">الفضيل بن عياض</option>
                                        <option value="تماظر-بنت-الاصبغ">تماظر بنت الأصبغ</option>
                                        <option value="جرير-بن-عبدالله-البجلي">جرير بن عبدالله البجلي</option>
                                        <option value="جويرية-بنت-الحارث">جويرية بنت الحارث</option>
                                        <option value="خالد-ابن-الوليد-طرابلس">خالد ابن الوليد - طرابلس</option>
                                        <option value="خديجة-بنت-خويلد">خديجة بنت خويلد</option>
                                        <option value="ذو-النورين">ذو النورين</option>
                                        <option value="رقية-بنت-محمد">رقية بنت محمد</option>
                                        <option value="ريحانة-بنت-زيد">ريحانة بنت زيد</option>
                                        <option value="زيد-بن-حارثة-مصراتة">زيد بن حارثة - مصراتة</option>
                                        <option value="سعيد-بن-جبير">سعيد بن جبير</option>
                                        <option value="عائشة-ام-المؤمنين">عائشة أم المؤمنين</option>
                                        <option value="عائشة-بنت-عبدالمطلب">عائشة بنت عبدالمطلب</option>
                                        <option value="عبدالحميد-بن-باديس">عبدالحميد بن باديس</option>
                                        <option value="عبدالله-بن-عباس">عبدالله بن عباس</option>
                                        <option value="عبدالله-بن-وهب">عبدالله بن وهب</option>
                                        <option value="عثمان-بن-عفان">عثمان بن عفان</option>
                                        <option value="عقبة-بن-عمرو-البدري">عقبة بن عمرو البدري</option>
                                        <option value="عمر-بن-الخطاب">عمر بن الخطاب</option>
                                        <option value="عمر-بن-عبدالعزيز">عمر بن عبدالعزيز</option>
                                        <option value="فاطمة-بنت-محمد">فاطمة بنت محمد</option>
                                        <option value="فصل-ام-القرى-مصراتة">فصل أم القرى - مصراتة</option>
                                        <option value="فصل-عائشة-بنت-يزيد-طرابلس">فصل عائشة بنت يزيد - طرابلس</option>
                                        <option value="لميس-بنت-عمرو-الانصاري">لميس بنت عمرو الأنصاري</option>
                                        <option value="مصطفى-حمادي">مصطفى حمادي</option>
                                        <option value="معاوية-بن-ابي-سفيان-الخمس">معاوية بن أبي سفيان - الخمس</option>
                                        <option value="ميمونة-بنت-الحارث">ميمونة بنت الحارث</option>
                                        <option value="نسيبة-بنت-كعب">نسيبة بنت كعب</option>
                                        <option value="هالة-بنت-خويلد">هالة بنت خويلد</option>
                                        <option value="وادي-عتبة">وادي عتبة</option>
                                        <option value="يحيى-بن-يحيى-الليثي">يحيى بن يحيى الليثي</option>
                                    </select>
                                </div>

                                {/* ملاحظة */}
                                <div className="flex items-start gap-3 p-4 rounded-xl" 
                                    style={{ backgroundColor: 'rgba(210, 180, 140, 0.1)' }}>
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#B8956A' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                    </svg>
                                    <p className="text-sm" style={{ color: '#371E13' }}>
                                        <strong>ملاحظة:</strong> يمكنك الانتقال إلى صفحة بيانات الفرع مباشرة عن طريق اختيار الفرع من القائمة أعلاه.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* فوتر تواصل معنا */}
                    <footer id="contact" className="py-20 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #371E13, #2d1610)' }}>
                        
                        {/* خلفية زخرفية */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-32 h-32 rounded-full"
                                style={{ background: 'radial-gradient(circle, #D2B48C, transparent)' }}></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
                                style={{ background: 'radial-gradient(circle, #B8956A, transparent)' }}></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full"
                                style={{ background: 'radial-gradient(circle, #F0E6D6, transparent)' }}></div>
                        </div>

                        <div className="relative z-10 max-w-6xl mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4 text-white">تواصل معنا</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-12">
                                {/* للاستفسار */}
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-white">للاستفسار (اتصل بـ)</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                            </svg>
                                            <span className="text-gray-300">+218-92-1448222</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                            </svg>
                                            <span className="text-gray-300">+218-91-1448222</span>
                                        </div>
                                    </div>
                                </div>

                                {/* تفاصيل الموقع */}
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-white">تفاصيل الموقع</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-gray-300">جزيرة سوق الثلاثاء بالقرب من مركز العزل، طرابلس، ليبيا</span>
                                        </div>
                                        <div className="mt-6">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.844!2d13.1913!3d32.8872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDUzJzE0LjAiTiAxM8KwMTEnMjguNyJF!5e0!3m2!1sen!2sly!4v1620000000000!5m2!1sen!2sly"
                                                width="100%"
                                                height="192"
                                                style={{ border: 0, borderRadius: '12px' }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade">
                                            </iframe>
                                        </div>
                                    </div>
                                </div>

                                {/* تابعنا على */}
                                <div>
                                    <h3 className="text-xl font-bold mb-6 text-white">تابعنا على:</h3>
                                    <div className="flex gap-4">
                                        <a href="https://www.facebook.com/fadwa.abisa" target="_blank" rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </a>
                                        <a href="https://t.me/Fadwa_Abisa?fbclid=IwY2xjawMhaF1leHRuA2FlbQIxMABicmlkETF6V1hFUTFQZ0J6UHdHQlIzAR7JI93sd8jOZzqJp4hK9_6UNL7UK0DWwFNdymcZyMYXawqD2laon5vf4poQIA_aem_s5jcKbUxobpQS2DcaQaObA" target="_blank" rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                            </svg>
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* خط فاصل */}
                            <div className="border-t border-gray-600 mt-12 pt-8 text-center">
                                <p className="text-gray-400">
                                    © 2024 المعهد المتوسط للدراسات الإسلامية. جميع الحقوق محفوظة.
                                </p>
                            </div>
                        </div>
                    </footer>

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

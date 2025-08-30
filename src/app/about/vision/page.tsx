"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

const VisionPage = () => {
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
                            رؤية المعهد المتوسط للدراسات الإسلامية
                        </h1>

                        <div className="w-32 h-1 rounded-full mx-auto mb-8"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>

                        <p className="text-xl text-lama-yellow max-w-4xl mx-auto leading-relaxed">
                            نسعى لأن نكون منارة علمية رائدة في العالم الإسلامي لتخريج جيل متميز من الدعاة والعلماء والمفكرين
                        </p>
                    </div>

                    {/* بطاقة الرؤية الرئيسية */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="modern-card p-12 text-center">
                            <div className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-4xl text-white">🎯</span>
                            </div>

                            <h2 className="text-4xl font-bold text-lama-yellow mb-6">رؤيتنا</h2>

                            <p className="text-xl text-lama-sky leading-relaxed mb-8">
                                &quot;أن نصبح المعهد الرائد في المنطقة في تقديم التعليم الإسلامي المتميز الذي يجمع بين الأصالة والمعاصرة،
                                ونكون منارة علمية تخرج جيلاً من العلماء والدعاة والمفكرين القادرين على مواجهة تحديات العصر
                                مع الحفاظ على الهوية الإسلامية والقيم الأخلاقية الرفيعة.&quot;
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">⭐</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">التميز</h3>
                                    <p className="text-lama-sky text-sm">في التعليم والبحث العلمي</p>
                                </div>

                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">🌟</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">الريادة</h3>
                                    <p className="text-lama-sky text-sm">في المنطقة والعالم الإسلامي</p>
                                </div>

                                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                                    <span className="text-2xl mb-2 block">🎓</span>
                                    <h3 className="font-bold text-lama-yellow mb-2">التخريج</h3>
                                    <p className="text-lama-sky text-sm">لعلماء وقادة المستقبل</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* محاور الرؤية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">محاور رؤيتنا</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'التعليم المتميز',
                                    description: 'تقديم برامج تعليمية متطورة تجمع بين التراث الإسلامي الأصيل والمناهج الحديثة، مع استخدام أحدث التقنيات التعليمية لضمان جودة التعلم.',
                                    icon: '📚',
                                    highlights: ['مناهج متطورة', 'تقنيات حديثة', 'جودة التعلم']
                                },
                                {
                                    title: 'البحث العلمي',
                                    description: 'تشجيع البحث العلمي في مختلف فروع العلوم الإسلامية والعربية، وإجراء دراسات معمقة تخدم المجتمع والأمة الإسلامية.',
                                    icon: '🔬',
                                    highlights: ['دراسات معمقة', 'بحوث متخصصة', 'خدمة المجتمع']
                                },
                                {
                                    title: 'التطوير المستمر',
                                    description: 'السعي المستمر لتطوير البرامج الأكاديمية والخدمات التعليمية، ومواكبة التطورات العلمية والتقنية في مجال التعليم.',
                                    icon: '📈',
                                    highlights: ['تطوير البرامج', 'مواكبة التطورات', 'التحسين المستمر']
                                },
                                {
                                    title: 'الشراكة المجتمعية',
                                    description: 'بناء شراكات فعالة مع المؤسسات التعليمية والثقافية محلياً وإقليمياً، وتقديم خدمات تعليمية وثقافية للمجتمع.',
                                    icon: '🤝',
                                    highlights: ['شراكات فعالة', 'خدمة المجتمع', 'التواصل الثقافي']
                                }
                            ].map((pillar, index) => (
                                <div key={index} className="modern-card p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="text-2xl text-white">{pillar.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-lama-yellow mb-4">{pillar.title}</h3>
                                            <p className="text-lama-sky leading-relaxed mb-6">{pillar.description}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {pillar.highlights.map((highlight, idx) => (
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

                    {/* القيم الأساسية */}
                    <div className="max-w-6xl mx-auto mb-16">
                        <div className="modern-card p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold text-lama-yellow mb-4">قيمنا الأساسية</h2>
                                <div className="w-24 h-1 rounded-full mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { value: 'الأصالة', description: 'التمسك بالمبادئ والقيم الإسلامية الأصيلة', icon: '🕌' },
                                    { value: 'التميز', description: 'السعي للوصول إلى أعلى معايير الجودة والإتقان', icon: '⭐' },
                                    { value: 'الابتكار', description: 'استخدام أحدث الطرق والتقنيات في التعليم', icon: '💡' },
                                    { value: 'النزاهة', description: 'الالتزام بأعلى معايير الشفافية والمصداقية', icon: '⚖️' }
                                ].map((value, index) => (
                                    <div key={index} className="text-center p-6 rounded-2xl"
                                        style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.4), rgba(226, 213, 199, 0.2))' }}>
                                        <div className="text-4xl mb-4">{value.icon}</div>
                                        <h3 className="text-xl font-bold text-lama-yellow mb-3">{value.value}</h3>
                                        <p className="text-lama-sky text-sm leading-relaxed">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* التطلعات المستقبلية */}
                    <div className="max-w-4xl mx-auto">
                        <div className="modern-card p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-3xl text-white">🚀</span>
                            </div>

                            <h2 className="text-3xl font-bold text-lama-yellow mb-6">تطلعاتنا للمستقبل</h2>

                            <p className="text-lg text-lama-sky leading-relaxed mb-8">
                                نتطلع إلى أن نصبح من أبرز المعاهد الإسلامية في العالم، وأن نساهم في بناء جيل متعلم وواعٍ
                                قادر على قيادة الأمة كالتقدم والازدهار، مع المحافظة على هويتها الإسلامية وقيمها الأصيلة.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                    انضم إلينا
                                </button>

                                <button className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                                    style={{
                                        borderColor: '#D2B48C',
                                        color: '#B8956A'
                                    }}>
                                    تعرف على برامجنا
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default VisionPage;

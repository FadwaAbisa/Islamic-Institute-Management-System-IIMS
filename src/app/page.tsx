"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const HomePage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { isSignedIn, user } = useUser();
    const router = useRouter();

    // تتبع حركة الماوس
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

    // جلب الإحصائيات من API
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch('/api/statistics');
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    // إعادة توجيه المستخدمين المسجلين
    useEffect(() => {
        if (isSignedIn && user) {
            const role = user.publicMetadata?.role;
            if (role) {
                router.push(`/${role}`);
            }
        }
    }, [isSignedIn, user, router]);

    // بناء بيانات الإحصائيات من البيانات المجلبة
    const stats = statistics ? [
        {
            title: 'معلم',
            count: statistics.teachers?.toString() || '0',
            icon: '/icons/teacher.png',
            color: 'bg-gradient-to-r from-lama-sky to-lama-yellow'
        },
        {
            title: 'موظف',
            count: statistics.staff?.toString() || '0',
            icon: '/icons/staff.png',
            color: 'bg-gradient-to-r from-lama-yellow to-lama-sky'
        },
        {
            title: 'طالب',
            count: statistics.students?.toString() || '0',
            icon: '/icons/student.png',
            color: 'bg-gradient-to-r from-lama-sky-light to-lama-purple'
        }
    ] : [
        {
            title: 'معلم',
            count: '...',
            icon: '/icons/teacher.png',
            color: 'bg-gradient-to-r from-lama-sky to-lama-yellow'
        },
        {
            title: 'موظف',
            count: '...',
            icon: '/icons/staff.png',
            color: 'bg-gradient-to-r from-lama-yellow to-lama-sky'
        },
        {
            title: 'طالب',
            count: '...',
            icon: '/icons/student.png',
            color: 'bg-gradient-to-r from-lama-sky-light to-lama-purple'
        }
    ];

    // أخبار وإعلانات حديثة (مثال)
    const news = [
        {
            id: 1,
            title: 'بدء موقع قروح المعهد المتوسط للدراسات الإسلامية على خرائط Google',
            category: 'إعلان عام',
            date: '2025-08-15',
            excerpt: 'تعلن إدارة المعهد عن...',
            image: '/announcement.png'
        },
        {
            id: 2,
            title: 'اللجان الامتحانية لطلبة الدور الثاني',
            category: 'امتحانات',
            date: '2025-08-14',
            excerpt: 'تعلن إدارة المعهد...',
            image: '/exam.png'
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #FCFAF8 0%, #F7F3EE 25%, #F0E6D6 75%, #E2D5C7 100%)'
            }}>

            {/* خلفية متحركة */}
            <div className="absolute inset-0">
                {/* دوائر متحركة */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#D2B48C' }}></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#B8956A', animationDelay: '2s' }}></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#F0E6D6', animationDelay: '4s' }}></div>

                {/* نمط تفاعلي */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(210, 180, 140, 0.6) 0%, transparent 50%)`,
                        backgroundSize: '80px 80px'
                    }}
                ></div>

                {/* جسيمات عائمة */}
                {[...Array(25)].map((_, i) => (
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

            {/* شريط التنقل */}
            <Navbar />

            {/* المحتوى الرئيسي */}
            <main className="relative z-10 pt-20">
                {/* القسم الرئيسي */}
                <section id="home" className="relative">
                    {/* Hero Section مع الصورة */}
                    <div className="relative min-h-screen flex items-center">
                        {/* الخلفية المتحركة */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-lama-purple/20 via-lama-sky-light/30 to-lama-yellow-light/20"></div>
                            <div className="absolute top-20 right-10 w-72 h-72 bg-lama-sky/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-20 left-10 w-96 h-96 bg-lama-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        </div>

                        <div className="container mx-auto px-6 relative z-10">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* المحتوى النصي */}
                                <div className="text-center lg:text-right space-y-8">
                                    <div className="relative">
                                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
                                            style={{
                                                background: 'linear-gradient(135deg, #B8956A, #D2B48C)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}>
                                            المعهد المتوسط
                                            <br />
                                            للدراسات الإسلامية
                                        </h1>

                                        {/* زخرفة متحركة */}
                                        <div className="absolute -bottom-2 right-0 lg:right-auto lg:left-0 w-32 h-1 rounded-full animate-pulse"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                                    </div>

                                    <p className="text-xl text-lama-yellow leading-relaxed max-w-2xl">
                                        نحن نقدم تعليماً إسلامياً متميزاً يجمع بين الأصالة والمعاصرة، ويهدف إلى بناء جيل قادر على مواجهة تحديات المستقبل مع الاحتفاظ على هويته الإسلامية
                                    </p>

                                    {/* الأزرار */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <button className="group px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            <span className="relative z-10">تعرف أكثر</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </button>

                                        <button className="px-8 py-4 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                                            style={{ borderColor: '#D2B48C', color: '#B8956A' }}>
                                            التقديم الدراسي
                                        </button>
                                    </div>

                                    {/* إحصائيات سريعة */}
                                    <div className="grid grid-cols-3 gap-6 mt-12">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-lama-yellow">
                                                {statistics?.students || '...'}
                                            </div>
                                            <div className="text-sm text-lama-sky">طالب</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-lama-yellow">
                                                {statistics?.teachers || '...'}
                                            </div>
                                            <div className="text-sm text-lama-sky">معلم</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-lama-yellow">
                                                {statistics?.staff || '...'}
                                            </div>
                                            <div className="text-sm text-lama-sky">موظف</div>
                                        </div>
                                    </div>
                                </div>

                                {/* الصورة الرئيسية */}
                                <div className="relative">
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <Image
                                            src="/images/institute-main.svg"
                                            alt="المعهد المتوسط للدراسات الإسلامية"
                                            width={600}
                                            height={400}
                                            className="w-full h-auto object-cover"
                                            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                                        />

                                        {/* تأثير التراكب */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                                        {/* شارة */}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-lama-yellow">
                                            معتمد رسمياً
                                        </div>
                                    </div>

                                    {/* عناصر ديكورية */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-lama-sky/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-lama-yellow/20 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* مؤشر التمرير */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <div className="w-6 h-10 border-2 border-lama-yellow rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-lama-yellow rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* قسم رسالة الترحيب المحسن */}
                <section className="py-20 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* النص */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-lama-sky-light/50 rounded-full text-lama-yellow font-medium text-sm">
                                    ✨ مرحباً بكم
                                </div>

                                <h2 className="text-4xl font-bold text-lama-yellow mb-6">
                                    رسالة ترحيبية
                                </h2>

                                <p className="text-lama-sky leading-relaxed text-lg">
                                    مرحباً بكم في المعهد المتوسط للدراسات الإسلامية، حيث نسعى لتقديم تعليم إسلامي متميز يجمع بين الأصالة والمعاصرة. يهدف إلى بناء جيل قادر على مواجهة تحديات المستقبل مع الاحتفاظ على هويته الإسلامية.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)', color: '#B8956A' }}>
                                        📞 اتصل بنا
                                    </button>

                                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)', color: '#B8956A' }}>
                                        📚 التقديم الدراسي
                                    </button>

                                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)', color: '#B8956A' }}>
                                        📝 التسجيل
                                    </button>
                                </div>
                            </div>

                            {/* مجموعة الصور */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src="/images/students-studying.svg"
                                                alt="طلاب يدرسون"
                                                width={300}
                                                height={200}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>

                                        <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src="/images/library.svg"
                                                alt="مكتبة المعهد"
                                                width={300}
                                                height={250}
                                                className="w-full h-56 object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-8">
                                        <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src="/images/classroom.svg"
                                                alt="قاعة دراسية"
                                                width={300}
                                                height={250}
                                                className="w-full h-56 object-cover"
                                            />
                                        </div>

                                        <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src="/images/graduation.svg"
                                                alt="حفل التخرج"
                                                width={300}
                                                height={200}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* تأثير الخلفية */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-lama-sky/5 to-lama-yellow/5 rounded-3xl -z-10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* قسم الإحصائيات المطور */}
                <section className="py-20 relative overflow-hidden">
                    {/* خلفية متدرجة */}
                    <div className="absolute inset-0 bg-gradient-to-r from-lama-purple-light via-white to-lama-sky-light opacity-50"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-lama-yellow font-medium text-sm mb-4">
                                📊 إحصائيات المعهد
                            </div>
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">نحن في أرقام</h2>
                            <p className="text-lama-sky text-lg max-w-2xl mx-auto">
                                نفخر بما حققناه من إنجازات تعكس التزامنا بتقديم تعليم إسلامي متميز
                            </p>
                            <div className="w-24 h-1 rounded-full mx-auto mt-6"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="relative group">
                                    {/* البطاقة الرئيسية */}
                                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl border border-lama-sky/20 group-hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2">
                                        {/* الأيقونة مع تأثير الهالة */}
                                        <div className="relative mx-auto mb-6">
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${stat.color} group-hover:scale-110 transition-all duration-500 relative z-10`}>
                                                <Image
                                                    src={stat.icon}
                                                    alt={stat.title}
                                                    width={48}
                                                    height={48}
                                                    className="filter brightness-0 invert"
                                                />
                                            </div>
                                            {/* هالة متحركة */}
                                            <div className={`absolute inset-0 w-24 h-24 rounded-full ${stat.color} opacity-20 animate-ping group-hover:opacity-40 transition-opacity duration-500`}></div>
                                        </div>

                                        {/* العدد مع تأثير العدد المتحرك */}
                                        <div className="mb-4">
                                            <h3 className="text-5xl font-bold text-lama-yellow mb-2 transition-all duration-300 group-hover:text-lama-sky">
                                                {stat.count}
                                            </h3>
                                            <div className="h-1 w-16 mx-auto rounded-full"
                                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                                        </div>

                                        <p className="text-lama-sky font-bold text-xl">{stat.title}</p>

                                        {/* شريط التقدم */}
                                        <div className="mt-4 h-2 bg-lama-sky-light/30 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    background: 'linear-gradient(135deg, #D2B48C, #B8956A)',
                                                    width: `${Math.min(100, parseInt(stat.count.replace('...', '50')) || 50)}%`
                                                }}></div>
                                        </div>
                                    </div>

                                    {/* تأثير الخلفية المتحركة */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-lama-sky/5 to-lama-yellow/5 transform rotate-3 group-hover:rotate-1 transition-transform duration-500 -z-10"></div>
                                </div>
                            ))}
                        </div>

                        {/* إحصائيات إضافية */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-lama-yellow">
                                    {statistics?.subjects || '...'}
                                </div>
                                <div className="text-sm text-lama-sky">مادة دراسية</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-lama-yellow">
                                    {statistics?.events || '...'}
                                </div>
                                <div className="text-sm text-lama-sky">حدث ونشاط</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-lama-yellow">
                                    {statistics?.announcements || '...'}
                                </div>
                                <div className="text-sm text-lama-sky">إعلان</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-lama-yellow">25+</div>
                                <div className="text-sm text-lama-sky">سنة خبرة</div>
                            </div>
                        </div>
                    </div>

                    {/* عناصر ديكورية */}
                    <div className="absolute top-10 right-20 w-20 h-20 bg-lama-yellow/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-20 w-16 h-16 bg-lama-sky/10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                </section>

                {/* معرض الصور */}
                <section className="py-20 bg-gradient-to-b from-lama-purple-light to-white relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-lama-yellow font-medium text-sm mb-4">
                                📸 معرض الصور
                            </div>
                            <h2 className="text-4xl font-bold text-lama-yellow mb-4">لحظات من حياة المعهد</h2>
                            <p className="text-lama-sky text-lg max-w-2xl mx-auto">
                                استكشف الحياة اليومية في معهدنا من خلال مجموعة مختارة من الصور التي تُظهر أنشطتنا التعليمية والثقافية
                            </p>
                            <div className="w-24 h-1 rounded-full mx-auto mt-6"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        {/* شبكة الصور */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* صورة كبيرة */}
                            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                                <div className="relative group rounded-3xl overflow-hidden shadow-2xl h-96 lg:h-full">
                                    <Image
                                        src="/images/main-building.svg"
                                        alt="المبنى الرئيسي للمعهد"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-4 right-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-lg font-bold mb-1">المبنى الرئيسي</h3>
                                        <p className="text-sm text-gray-200">قلب المعهد النابض</p>
                                    </div>
                                </div>
                            </div>

                            {/* صور صغيرة */}
                            <div className="space-y-6">
                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-44">
                                    <Image
                                        src="/images/study-hall.svg"
                                        alt="قاعة المطالعة"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">قاعة المطالعة</p>
                                    </div>
                                </div>

                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-44">
                                    <Image
                                        src="/images/computer-lab.svg"
                                        alt="مختبر الحاسوب"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">مختبر الحاسوب</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-44">
                                    <Image
                                        src="/images/mosque.svg"
                                        alt="مسجد المعهد"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">مسجد المعهد</p>
                                    </div>
                                </div>

                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-44">
                                    <Image
                                        src="/images/activities.svg"
                                        alt="الأنشطة الطلابية"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">الأنشطة الطلابية</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* زر عرض المزيد */}
                        <div className="text-center mt-12">
                            <button className="group px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="relative z-10">عرض جميع الصور</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>
                        </div>
                    </div>

                    {/* عناصر ديكورية */}
                    <div className="absolute top-20 right-10 w-32 h-32 bg-lama-yellow/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 left-10 w-40 h-40 bg-lama-sky/10 rounded-full blur-3xl"></div>
                </section>

                {/* قسم الأخبار والإعلانات */}
                <section id="news" className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-lama-yellow mb-4">آخر الأخبار والإعلانات</h2>
                        <div className="w-24 h-1 rounded-full mx-auto"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {news.map((item) => (
                            <div key={item.id} className="modern-card overflow-hidden group cursor-pointer">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-lama-sky"></div>
                                        <span className="text-sm text-lama-sky font-medium">{item.date}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-lama-yellow mb-3 group-hover:text-lama-sky transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-lama-sky leading-relaxed mb-4">
                                        {item.excerpt}
                                    </p>

                                    <button className="text-lama-yellow hover:text-lama-sky font-medium transition-colors">
                                        اقرأ المزيد ←
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="group px-10 py-4 rounded-2xl font-bold text-white shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-3xl relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #D2B48C, #B8956A)'
                            }}>
                            <span className="relative z-10">عرض جميع الأخبار</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </div>
                </section>

                {/* قسم "لا توجد أحداث قادمة" */}
                <section className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="modern-card p-12 text-center">
                            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)' }}>
                                <span className="text-4xl">📅</span>
                            </div>

                            <h3 className="text-3xl font-bold text-lama-yellow mb-4">لا توجد أحداث قادمة حالياً</h3>
                            <p className="text-lama-sky text-lg leading-relaxed">
                                يرجى متابعة هذه الصفحة لمعرفة آخر الفعاليات والأنشطة في المعهد
                            </p>
                        </div>
                    </div>
                </section>

                {/* قسم ملاحظاتك تهمنا */}
                <section className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="modern-card p-12 text-center">
                            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                <span className="text-4xl text-white">💬</span>
                            </div>

                            <h3 className="text-3xl font-bold text-lama-yellow mb-4">ملاحظاتك تهمنا</h3>
                            <p className="text-lama-sky text-lg leading-relaxed mb-8">
                                نرحب بملاحظاتكم ومقترحاتكم لتحسين خدماتنا، يمكنكم تقديم ملاحظاتكم وسنقوم بمعالجتها في أقل فريق متخصص
                            </p>

                            <button className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #D2B48C, #B8956A)'
                                }}>
                                ← تقديم ملاحظاتك
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* الفوتر */}
            <footer className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-lama-sky/20 mt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* للاستثمار */}
                        <div>
                            <h4 className="font-bold text-lama-yellow text-lg mb-4">للاستثمار</h4>
                            <p className="text-lama-sky mb-4">جعزة سوق ايدادقال بالقرب من مركز أطنون طرطوس ليبيا</p>
                            <div className="space-y-2">
                                <p className="text-lama-sky flex items-center gap-2">
                                    <span>📞</span>
                                    <span>+218-92-1448222</span>
                                </p>
                                <p className="text-lama-sky flex items-center gap-2">
                                    <span>📞</span>
                                    <span>+218-91-1448222</span>
                                </p>
                            </div>
                        </div>

                        {/* تفاصيل الموقع */}
                        <div>
                            <h4 className="font-bold text-lama-yellow text-lg mb-4">تفاصيل الموقع</h4>
                            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                                <span className="text-lama-sky">خريطة الموقع</span>
                            </div>
                        </div>

                        {/* مواقع التواصل */}
                        <div>
                            <h4 className="font-bold text-lama-yellow text-lg mb-4">مواقع التواصل</h4>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-lama-sky flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <span>📘</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-lama-sky flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <span>📷</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-lama-sky flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <span>🐦</span>
                                </div>
                            </div>
                            <p className="text-lama-sky mt-4">تابعنا على:</p>
                        </div>

                        {/* الأحداث القادمة */}
                        <div>
                            <h4 className="font-bold text-lama-yellow text-lg mb-4">📅 الأحداث القادمة</h4>
                            <div className="space-y-3">
                                <div className="text-center p-4 rounded-lg"
                                    style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)' }}>
                                    <p className="text-lama-yellow font-medium">لا توجد أحداث قادمة حالياً</p>
                                    <p className="text-lama-sky text-sm mt-1">يرجى متابعة هذه الصفحة لمعرفة آخر الفعاليات والأنشطة في المعهد</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* خط الفصل */}
                    <div className="border-t border-lama-sky/20 mt-12 pt-8 text-center">
                        <p className="text-lama-sky">
                            © 2025 المعهد المتوسط للدراسات الإسلامية • جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </footer>

            {/* عناصر زخرفية إضافية */}
            <div className="fixed top-8 right-8 w-16 h-16 border-2 rounded-full animate-spin opacity-10 z-0"
                style={{
                    borderColor: 'rgba(210, 180, 140, 0.5)',
                    animationDuration: '15s'
                }}></div>
            <div className="fixed bottom-8 left-8 w-12 h-12 border-2 rounded-full animate-spin opacity-10 z-0"
                style={{
                    borderColor: 'rgba(184, 149, 106, 0.6)',
                    animationDuration: '20s',
                    animationDirection: 'reverse'
                }}></div>
        </div>
    );
};

export default HomePage;


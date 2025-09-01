"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const HomePage = () => {
    // إضافة الحركات المخصصة
    const customStyles = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            50% { transform: translateY(-5px) rotate(0deg); }
            75% { transform: translateY(-15px) rotate(-1deg); }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(100%) skewX(-15deg); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(210, 180, 140, 0.3); }
            50% { box-shadow: 0 0 40px rgba(210, 180, 140, 0.6), 0 0 60px rgba(210, 180, 140, 0.4); }
        }
    `;
    
    // إضافة الستايل إلى الصفحة
    if (typeof document !== 'undefined') {
        const existingStyle = document.getElementById('custom-button-styles');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'custom-button-styles';
            style.textContent = customStyles;
            document.head.appendChild(style);
        }
    }
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Statistics data:', data); // للتشخيص
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setError(null);
                }
                
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('فشل في الاتصال بالخادم');
                // في حالة الخطأ، استخدم بيانات افتراضية
                setStatistics({
                    students: 0,
                    teachers: 0,
                    staff: 0,
                    subjects: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    // جلب الإعلانات من API
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/announcements');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Announcements data:', data); // للتشخيص
                
                // فلترة الإعلانات النشطة فقط وأخذ آخر إعلانين
                const activeAnnouncements = data
                    .filter((announcement: any) => announcement.status === 'نشط')
                    .slice(0, 2); // أخذ آخر إعلانين فقط
                
                setAnnouncements(activeAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
                // في حالة الخطأ، استخدم بيانات افتراضية
                setAnnouncements([]);
            } finally {
                setAnnouncementsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // جلب الأحداث من API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // جلب الأحداث النشطة فقط والقادمة
                const now = new Date().toISOString();
                const response = await fetch(`/api/events?status=ACTIVE&startDate=${now}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Events data:', data); // للتشخيص
                
                // فلترة الأحداث القادمة فقط (من اليوم وما بعده)
                const upcomingEvents = data
                    .filter((event: any) => {
                        const eventDate = new Date(event.startTime);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // بداية اليوم
                        return eventDate >= today && event.status === 'ACTIVE';
                    })
                    .slice(0, 3); // أخذ أول 3 أحداث فقط
                
                setEvents(upcomingEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                // في حالة الخطأ، استخدم قائمة فارغة
                setEvents([]);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // إعادة توجيه المستخدمين المسجلين (معطل للسماح بزيارة الصفحة الرئيسية)
    // useEffect(() => {
    //     if (isSignedIn && user) {
    //         const role = user.publicMetadata?.role;
    //         if (role) {
    //             router.push(`/${role}`);
    //         }
    //     }
    // }, [isSignedIn, user, router]);

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

    // دالة لتنسيق التاريخ
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // دالة لاقتطاع النص
    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // دالة لتنسيق تاريخ ووقت الحدث
    const formatEventDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return { dateStr, timeStr };
    };

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
                                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: '#371E13' }}>
                                            المعهد المتوسط
                                            <br />
                                            للدراسات الإسلامية
                                        </h1>

                                        {/* زخرفة متحركة */}
                                        <div className="absolute -bottom-2 right-0 lg:right-auto lg:left-0 w-32 h-1 rounded-full animate-pulse"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                                    </div>

                                    <p className="text-xl leading-relaxed max-w-2xl" style={{ color: '#371E13' }}>
                                    مؤسسة تعليمية تهدف إلى تقديم تعليم شرعي متين ومؤصل للفئة المتوسطة، ضمن بيئة أكاديمية محفزة وملتزمة بثوابت الشريعة الإسلامية. نسعى في المعهد إلى إعداد طلاب متميزين ومؤصلين، قادرين على فهم العلوم الشرعية وتأصيلها، والتفاعل مع التحديات المعاصرة برؤية متزنة.
                                    </p>

                                    {/* الأزرار */}
                                    <div className="flex justify-center lg:justify-start">
                                        <Link href="/about/introduction" className="group relative px-10 py-5 rounded-2xl font-bold text-white shadow-2xl transition-all duration-700 transform hover:scale-110 hover:shadow-3xl overflow-hidden hover:animate-none focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-lama-yellow/50 hover:ring-4 hover:ring-lama-sky/40"
                                            style={{ 
                                                background: 'linear-gradient(135deg, #D2B48C, #B8956A)',
                                                animation: 'float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate',
                                                boxShadow: '0 10px 30px rgba(210, 180, 140, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                                            }}>
                                            
                                            {/* الخلفية المتحركة */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            
                                            {/* حلقات متحركة */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-lama-sky to-lama-yellow rounded-2xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                                            
                                            {/* حلقة خارجية متحركة */}
                                            <div className="absolute -inset-2 bg-gradient-to-r from-lama-sky via-transparent to-lama-yellow rounded-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 animate-spin" style={{ animationDuration: '8s' }}></div>
                                            
                                            {/* شعاع ضوئي */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 delay-200"></div>
                                            
                                            {/* موجة متحركة */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-2000" style={{ animationDelay: '0.5s' }}></div>
                                            </div>
                                            
                                            {/* النص */}
                                            <span className="relative z-20 flex items-center gap-2 group-hover:tracking-wider transition-all duration-300 group-hover:text-shadow-lg">
                                                <span className="transform group-hover:scale-105 transition-transform duration-300">تعرف أكثر</span>
                                                <svg className="w-5 h-5 transform group-hover:-translate-x-2 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                            
                                            {/* تأثير الجسيمات */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                                                <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                                                <div className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                                            </div>
                                        </Link>
                                    </div>


                                </div>

                                {/* الشعار الحر بدون مربع */}
                                <div className="relative flex items-center justify-center min-h-[400px]">
                                    {/* الشعار الرئيسي */}
                                    <div className="relative w-96 h-96 z-10">
                                        <div 
                                            className="w-full h-full bg-center bg-no-repeat bg-contain"
                                            style={{
                                                backgroundImage: `url('/FrontEnd_img/homelogo.png')`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* عناصر ديكورية في الخلفية */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* عناصر ديكورية متناثرة */}
                                        <div className="absolute top-16 right-16 w-4 h-4 bg-lama-yellow/60 rounded-full shadow-lg animate-ping"></div>
                                        <div className="absolute top-24 right-32 w-2 h-2 bg-lama-sky/60 rounded-full shadow-md animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        <div className="absolute bottom-20 left-16 w-3 h-3 bg-gradient-to-r from-lama-yellow/60 to-lama-sky/60 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '2s' }}></div>
                                        <div className="absolute bottom-32 left-32 w-2 h-2 bg-lama-purple/60 rounded-full shadow-sm animate-ping" style={{ animationDelay: '3s' }}></div>
                                        <div className="absolute top-32 left-20 w-3 h-3 bg-lama-yellow/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
                                        <div className="absolute bottom-24 right-24 w-2 h-2 bg-lama-sky/50 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>

                                        {/* خطوط إشعاعية خفيفة */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
                                            {[...Array(6)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-px h-16 bg-gradient-to-t from-lama-sky/10 to-transparent origin-bottom animate-pulse"
                                                    style={{
                                                        transform: `rotate(${i * 60}deg)`,
                                                        top: '50%',
                                                        left: '50%',
                                                        transformOrigin: '0 80px',
                                                        animationDelay: `${i * 0.8}s`,
                                                        animationDuration: '4s'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>

                                        {/* نمط خلفي خفيف */}
                                        <div className="absolute inset-0 opacity-5">
                                            <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <pattern id="backgroundPattern" patternUnits="userSpaceOnUse" width="30" height="30">
                                                        <circle cx="15" cy="15" r="1" fill="#D2B48C" opacity="0.3"/>
                                                    </pattern>
                                                </defs>
                                                <rect width="100%" height="100%" fill="url(#backgroundPattern)" />
                                            </svg>
                                        </div>
                                    </div>
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

                {/* قسم رسالة الترحيب ة */}
                <section className="py-20 relative overflow-hidden bg-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            {/* الحاوية الرئيسية */}
                            <div className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                                {/* خلفية ديكورية خفيفة */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
                                
                                <div className="relative z-10 text-center space-y-8">
                                    {/* العنوان */}
                                    <h2 className="text-4xl font-bold mb-6" style={{ color: '#371E13' }}>
                                        رسالة ترحيبية
                                    </h2>

                                    {/* النص الرئيسي */}
                                    <p className="leading-relaxed text-lg max-w-3xl mx-auto" style={{ color: '#371E13' }}>
                                    مرحبًا بكم في المعهد المتوسط للدراسات الإسلامية، حيث نسعى لتقديم تعليم إسلامي متميز يجمع بين الأصالة والمعاصرة. نهدف إلى تخريج جيل قادر على مواجهة تحديات العصر مع الحفاظ على هويته الإسلامية.


                                    </p>

                                    {/* الأزرار */}
                                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                                                                         <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg bg-white border-2"
                                             style={{ borderColor: '#D2B48C', color: '#371E13' }}>
                                             التسجيل
                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                 <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                             </svg>
                                         </button>
                                        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg bg-white border-2"
                                            style={{ borderColor: '#D2B48C', color: '#371E13' }}>
                                            التقويم الدراسي
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg bg-white border-2"
                                            style={{ borderColor: '#D2B48C', color: '#371E13' }}>
                                            اتصل بنا
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* عناصر ديكورية */}
                                <div className="absolute top-6 right-6 w-3 h-3 bg-lama-yellow/30 rounded-full"></div>
                                <div className="absolute bottom-6 left-6 w-4 h-4 bg-lama-sky/30 rounded-full"></div>
                                <div className="absolute top-1/2 left-6 w-2 h-2 bg-lama-purple/30 rounded-full"></div>
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
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#371E13' }}>إحصائيات المعهد</h2>
                            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#371E13' }}>
                                نفخر بما حققناه من إنجازات تعكس التزامنا بتقديم تعليم إسلامي متميز
                            </p>
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg max-w-md mx-auto">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}
                            <div className="w-24 h-1 rounded-full mx-auto mt-6"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        {/* بطاقات الإحصائيات المحسنة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* بطاقة الطلاب - تصميم احترافي */}
                            <div className="group relative perspective-1000">
                                {/* خلفية متدرجة ناعمة */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D2B48C]/20 via-[#B8956A]/10 to-[#F0E6D6]/15 rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                                
                                {/* البطاقة الرئيسية */}
                                <div className="relative bg-gradient-to-br from-[#FCFAF8] to-[#F0E6D6]/90 backdrop-blur-sm rounded-[2rem] p-8 border border-[#D2B48C]/30 shadow-[0_20px_40px_-12px_rgba(210,180,140,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(210,180,140,0.25)] transition-all duration-700 transform group-hover:scale-105 overflow-hidden">
                                    
                                    {/* نمط هندسي فاخر في الخلفية */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="students-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                                                    <path d="M10 0l10 10-10 10L0 10z" fill="url(#students-gradient)" opacity="0.3"/>
                                                </pattern>
                                                <linearGradient id="students-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#D2B48C"/>
                                                    <stop offset="100%" stopColor="#B8956A"/>
                                                </linearGradient>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#students-pattern)"/>
                                        </svg>
                                    </div>

                                    {/* الأيقونة المحسنة */}
                                    <div className="relative mb-8 flex justify-center">
                                        <div className="relative group/icon">
                                            {/* هالة ناعمة */}
                                            <div className="absolute inset-0 w-18 h-18 rounded-full bg-gradient-to-r from-[#D2B48C] to-[#B8956A] blur-lg opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
                                            
                                            {/* الأيقونة الرئيسية */}
                                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#D2B48C] to-[#B8956A] flex items-center justify-center shadow-lg group-hover/icon:shadow-xl transition-all duration-700 transform group-hover/icon:scale-110">
                                                <Image
                                                    src="/FrontEnd_img/الطلاب.png"
                                                    alt="أيقونة الطلاب"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain filter brightness-0 invert drop-shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* العدد والتسمية */}
                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#B8956A] to-[#D2B48C] bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500" style={{ fontFamily: 'system-ui' }}>
                                                {loading ? (
                                                    <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 rounded h-12 w-16 mx-auto"></div>
                                                ) : (
                                                    statistics?.students || '0'
                                                )}
                                            </h3>
                                            {/* خط تحت الرقم */}
                                            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#B8956A] to-[#D2B48C] shadow-lg transform group-hover:scale-x-125 transition-transform duration-500"></div>
                                        </div>
                                        <p className="text-xl font-bold tracking-wide" style={{ color: '#371E13' }}>طالب</p>
                                    </div>

                                    {/* شريط التقدم المحسن */}
                                    <div className="mt-6 relative">
                                        <div className="h-2 bg-[#F0E6D6] rounded-full shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#B8956A] to-[#D2B48C] rounded-full shadow-sm transform origin-left group-hover:scale-x-105 transition-transform duration-1000" style={{ width: '85%' }}></div>
                                        </div>
                                        <div className="absolute -top-1 right-4 w-4 h-4 bg-white rounded-full shadow-md border-2 border-[#B8956A] animate-pulse"></div>
                                    </div>

                                    {/* عناصر ديكورية */}
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-[#D2B48C] rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#B8956A] rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* بطاقة المعلمين - تصميم مميز */}
                            <div className="group relative perspective-1000">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#B8956A]/20 via-[#E2D5C7]/10 to-[#F0E6D6]/15 rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                                
                                <div className="relative bg-gradient-to-br from-[#FCFAF8] to-[#F0E6D6]/90 backdrop-blur-sm rounded-[2rem] p-8 border border-[#B8956A]/30 shadow-[0_20px_40px_-12px_rgba(184,149,106,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(184,149,106,0.25)] transition-all duration-700 transform group-hover:scale-105 overflow-hidden">
                                    
                                    {/* نمط هندسي فاخر في الخلفية */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="teachers-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                                                    <path d="M10 0l10 10-10 10L0 10z" fill="url(#teachers-gradient)" opacity="0.3"/>
                                                </pattern>
                                                <linearGradient id="teachers-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#B8956A"/>
                                                    <stop offset="100%" stopColor="#E2D5C7"/>
                                                </linearGradient>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#teachers-pattern)"/>
                                        </svg>
                                    </div>

                                    <div className="relative mb-8 flex justify-center">
                                        <div className="relative group/icon">
                                            <div className="absolute inset-0 w-18 h-18 rounded-full bg-gradient-to-r from-[#B8956A] to-[#E2D5C7] blur-lg opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
                                            
                                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#B8956A] to-[#E2D5C7] flex items-center justify-center shadow-lg group-hover/icon:shadow-xl transition-all duration-700 transform group-hover/icon:scale-110">
                                                <Image
                                                    src="/FrontEnd_img/المعلمين.png"
                                                    alt="أيقونة المعلمين"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain filter brightness-0 invert drop-shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#B8956A] to-[#E2D5C7] bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                {loading ? (
                                                    <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 rounded h-12 w-16 mx-auto"></div>
                                                ) : (
                                                    statistics?.teachers || '0'
                                                )}
                                            </h3>
                                            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#B8956A] to-[#E2D5C7] shadow-lg transform group-hover:scale-x-125 transition-transform duration-500"></div>
                                        </div>
                                        <p className="text-xl font-bold tracking-wide" style={{ color: '#371E13' }}>معلم</p>
                                    </div>

                                    <div className="mt-6 relative">
                                        <div className="h-2 bg-[#F0E6D6] rounded-full shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#B8956A] to-[#E2D5C7] rounded-full shadow-sm transform origin-left group-hover:scale-x-105 transition-transform duration-1000" style={{ width: '70%' }}></div>
                                        </div>
                                        <div className="absolute -top-1 right-6 w-4 h-4 bg-white rounded-full shadow-md border-2 border-[#B8956A] animate-pulse"></div>
                                    </div>

                                    <div className="absolute top-4 left-4 w-2 h-2 bg-[#E2D5C7] rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#B8956A] rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* بطاقة الموظفين */}
                            <div className="group relative perspective-1000">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#F0E6D6]/20 via-[#D2B48C]/10 to-[#B8956A]/15 rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                                
                                <div className="relative bg-gradient-to-br from-[#FCFAF8] to-[#F0E6D6]/90 backdrop-blur-sm rounded-[2rem] p-8 border border-[#D2B48C]/30 shadow-[0_20px_40px_-12px_rgba(240,230,214,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(240,230,214,0.25)] transition-all duration-700 transform group-hover:scale-105 overflow-hidden">
                                    
                                    {/* نمط هندسي فاخر في الخلفية */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="staff-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                                                    <path d="M10 0l10 10-10 10L0 10z" fill="url(#staff-gradient)" opacity="0.3"/>
                                                </pattern>
                                                <linearGradient id="staff-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#F0E6D6"/>
                                                    <stop offset="100%" stopColor="#D2B48C"/>
                                                </linearGradient>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#staff-pattern)"/>
                                        </svg>
                                    </div>

                                    {/* الأيقونة المحسنة */}
                                    <div className="relative mb-8 flex justify-center">
                                        <div className="relative group/icon">
                                            <div className="absolute inset-0 w-18 h-18 rounded-full bg-gradient-to-r from-[#F0E6D6] to-[#D2B48C] blur-lg opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
                                            
                                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#F0E6D6] to-[#D2B48C] flex items-center justify-center shadow-lg group-hover/icon:shadow-xl transition-all duration-700 transform group-hover/icon:scale-110">
                                                <Image
                                                    src="/FrontEnd_img/الموظفين.png"
                                                    alt="أيقونة الموظفين"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain filter brightness-0 invert drop-shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#F0E6D6] to-[#D2B48C] bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                {loading ? (
                                                    <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 rounded h-12 w-16 mx-auto"></div>
                                                ) : (
                                                    statistics?.staff || '0'
                                                )}
                                            </h3>
                                            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#F0E6D6] to-[#D2B48C] shadow-lg transform group-hover:scale-x-125 transition-transform duration-500"></div>
                                        </div>
                                        <p className="text-xl font-bold tracking-wide" style={{ color: '#371E13' }}>موظف</p>
                                    </div>

                                    <div className="mt-6 relative">
                                        <div className="h-2 bg-[#F0E6D6] rounded-full shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#F0E6D6] to-[#D2B48C] rounded-full shadow-sm transform origin-left group-hover:scale-x-105 transition-transform duration-1000" style={{ width: '60%' }}></div>
                                        </div>
                                        <div className="absolute -top-1 right-6 w-4 h-4 bg-white rounded-full shadow-md border-2 border-[#D2B48C] animate-pulse"></div>
                                    </div>

                                    <div className="absolute top-4 left-4 w-2 h-2 bg-[#F0E6D6] rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#D2B48C] rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* بطاقة المواد الدراسية */}
                            <div className="group relative perspective-1000">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E2D5C7]/20 via-[#F0E6D6]/10 to-[#B8956A]/15 rounded-[2rem] blur-sm opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
                                
                                <div className="relative bg-gradient-to-br from-[#FCFAF8] to-[#F0E6D6]/90 backdrop-blur-sm rounded-[2rem] p-8 border border-[#E2D5C7]/30 shadow-[0_20px_40px_-12px_rgba(226,213,199,0.15)] hover:shadow-[0_25px_50px_-12px_rgba(226,213,199,0.25)] transition-all duration-700 transform group-hover:scale-105 overflow-hidden">
                                    
                                    {/* نمط هندسي فاخر في الخلفية */}
                                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="subjects-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                                                    <path d="M10 0l10 10-10 10L0 10z" fill="url(#subjects-gradient)" opacity="0.3"/>
                                                </pattern>
                                                <linearGradient id="subjects-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#E2D5C7"/>
                                                    <stop offset="100%" stopColor="#B8956A"/>
                                                </linearGradient>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#subjects-pattern)"/>
                                        </svg>
                                    </div>

                                    {/* الأيقونة المحسنة */}
                                    <div className="relative mb-8 flex justify-center">
                                        <div className="relative group/icon">
                                            <div className="absolute inset-0 w-18 h-18 rounded-full bg-gradient-to-r from-[#E2D5C7] to-[#B8956A] blur-lg opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
                                            
                                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#E2D5C7] to-[#B8956A] flex items-center justify-center shadow-lg group-hover/icon:shadow-xl transition-all duration-700 transform group-hover/icon:scale-110">
                                                <Image
                                                    src="/FrontEnd_img/المواد الدراسية.png"
                                                    alt="أيقونة المواد الدراسية"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain filter brightness-0 invert drop-shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <div className="relative">
                                            <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#E2D5C7] to-[#B8956A] bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                {loading ? (
                                                    <div className="animate-pulse bg-gradient-to-r from-gray-300 to-gray-400 rounded h-12 w-16 mx-auto"></div>
                                                ) : (
                                                    statistics?.subjects || '0'
                                                )}
                                            </h3>
                                            <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-[#E2D5C7] to-[#B8956A] shadow-lg transform group-hover:scale-x-125 transition-transform duration-500"></div>
                                        </div>
                                        <p className="text-xl font-bold tracking-wide" style={{ color: '#371E13' }}>مادة دراسية</p>
                                    </div>

                                    <div className="mt-6 relative">
                                        <div className="h-2 bg-[#F0E6D6] rounded-full shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#E2D5C7] to-[#B8956A] rounded-full shadow-sm transform origin-left group-hover:scale-x-105 transition-transform duration-1000" style={{ width: '75%' }}></div>
                                        </div>
                                        <div className="absolute -top-1 right-4 w-4 h-4 bg-white rounded-full shadow-md border-2 border-[#B8956A] animate-pulse"></div>
                                    </div>

                                    <div className="absolute top-4 left-4 w-2 h-2 bg-[#E2D5C7] rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-[#B8956A] rounded-full animate-ping"></div>
                                </div>
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
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#371E13' }}>لحظات من مسيرة المعهد</h2>
                            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#371E13' }}>
                                مجموعة مختارة من الصور التي تُظهر أنشطتنا التعليمية والثقافية
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
                                        src="/FrontEnd_img/المبنى.jpg"
                                        alt="المبنى الرئيسي للمعهد المتوسط للدراسات الإسلامية"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-4 right-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <h3 className="text-lg font-bold mb-1">المبنى الرئيسي</h3>
                                        <p className="text-sm text-gray-200">المعهد المتوسط للدراسات الإسلامية</p>
                                    </div>
                                </div>
                            </div>

                            {/* صور صغيرة */}
                            <div className="space-y-6">
                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-56">
                                    <Image
                                        src="/FrontEnd_img/المقاعد.jpg"
                                        alt="قاعة المطالعة - المعهد المتوسط للدراسات الإسلامية"
                                        fill
                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">قاعة المطالعة</p>
                                    </div>
                                </div>

                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-56">
                                    <Image
                                        src="/FrontEnd_img/دورات تدريبية.jpg"
                                        alt="دورات تدريبية - المعهد المتوسط للدراسات الإسلامية"
                                        fill
                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">دورات تدريبية</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-56">
                                    <Image
                                        src="/FrontEnd_img/مسجد.jpg"
                                        alt="مسجد المعهد المتوسط للدراسات الإسلامية"
                                        fill
                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-2 right-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">مسجد المعهد</p>
                                    </div>
                                </div>

                                <div className="relative group rounded-2xl overflow-hidden shadow-xl h-56">
                                    <Image
                                        src="/FrontEnd_img/الانشطة الطلابية.jpg"
                                        alt="الأنشطة الطلابية - المعهد المتوسط للدراسات الإسلامية"
                                        fill
                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority
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
                        <h2 className="text-4xl font-bold mb-4" style={{ color: '#371E13' }}>آخر الأخبار والإعلانات</h2>
                        <div className="w-24 h-1 rounded-full mx-auto"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {announcementsLoading ? (
                            // شاشة التحميل
                            [...Array(2)].map((_, index) => (
                                <div key={index} className="modern-card overflow-hidden animate-pulse">
                                    <div className="bg-gray-300 h-48"></div>
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-300 rounded mb-3 w-1/3"></div>
                                        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))
                        ) : announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div key={announcement.id} className="modern-card overflow-hidden group cursor-pointer">
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#F7F3EE] to-[#F0E6D6] flex items-center justify-center">
                                        {announcement.image ? (
                                    <Image
                                                src={announcement.image}
                                                alt={announcement.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                        ) : (
                                            <div className="text-6xl text-[#B8956A] opacity-50">
                                                📢
                                            </div>
                                        )}
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                إعلان
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-lama-sky"></div>
                                            <span className="text-sm font-medium" style={{ color: '#371E13' }}>
                                                {formatDate(announcement.createdAt)}
                                            </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 transition-colors" style={{ color: '#371E13' }}>
                                            {announcement.title}
                                    </h3>

                                    <p className="leading-relaxed mb-4" style={{ color: '#371E13' }}>
                                            {truncateText(announcement.description)}
                                    </p>

                                    <button className="font-medium transition-colors" style={{ color: '#371E13' }}>
                                        اقرأ المزيد ←
                                    </button>
                                </div>
                            </div>
                            ))
                        ) : (
                            // عرض رسالة عدم وجود إعلانات
                            <div className="col-span-1 lg:col-span-2 text-center py-12">
                                <div className="text-6xl text-[#B8956A] opacity-50 mb-4">📢</div>
                                <h3 className="text-2xl font-bold mb-2" style={{ color: '#371E13' }}>لا توجد إعلانات حالياً</h3>
                                <p className="text-lg" style={{ color: '#B8956A' }}>ستظهر الإعلانات الجديدة هنا عند إضافتها</p>
                            </div>
                        )}
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

                {/* قسم الأحداث القادمة */}
                <section className="py-20 bg-gradient-to-b from-lama-purple-light to-white relative overflow-hidden">
                    <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4" style={{ color: '#371E13' }}>الأحداث القادمة</h2>
                            <div className="w-24 h-1 rounded-full mx-auto"
                                style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                        </div>

                        {eventsLoading ? (
                            // شاشة التحميل
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="modern-card p-6 animate-pulse">
                                        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-4 w-full"></div>
                                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => {
                                    const { dateStr, timeStr } = formatEventDateTime(event.startTime);
                                    return (
                                        <div key={event.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                                                    📅
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{ background: 'linear-gradient(135deg, #B8956A, #D2B48C)' }}>
                                                    {event.eventType === 'ACADEMIC' ? 'أكاديمي' : 
                                                     event.eventType === 'CULTURAL' ? 'ثقافي' : 
                                                     event.eventType === 'SOCIAL' ? 'اجتماعي' : 'عام'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 group-hover:text-[#B8956A] transition-colors" 
                                                style={{ color: '#371E13' }}>
                                                {event.title}
                                            </h3>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B8956A' }}>
                                                    <span>📅</span>
                                                    <span>{dateStr}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm" style={{ color: '#B8956A' }}>
                                                    <span>⏰</span>
                                                    <span>{timeStr}</span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-2 text-sm" style={{ color: '#B8956A' }}>
                                                        <span>📍</span>
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {event.description && (
                                                <p className="text-sm leading-relaxed mb-4" style={{ color: '#371E13' }}>
                                                    {truncateText(event.description, 80)}
                                                </p>
                                            )}

                                            <button className="text-sm font-medium transition-colors hover:underline" 
                                                style={{ color: '#B8956A' }}>
                                                التفاصيل ←
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // عرض رسالة عدم وجود أحداث
                        <div className="modern-card p-12 text-center">
                            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #F0E6D6, #E2D5C7)' }}>
                                <span className="text-4xl">📅</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4" style={{ color: '#371E13' }}>لا توجد أحداث قادمة حالياً</h3>
                            <p className="text-lg leading-relaxed" style={{ color: '#371E13' }}>
                                يرجى متابعة هذه الصفحة لمعرفة آخر الفعاليات والأنشطة في المعهد
                            </p>
                            </div>
                        )}
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

                            <h3 className="text-3xl font-bold mb-4" style={{ color: '#371E13' }}>ملاحظاتك تهمنا</h3>
                            <p className="text-lg leading-relaxed mb-8" style={{ color: '#371E13' }}>
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
            <footer id="contact" className="relative z-10 bg-white/90 backdrop-blur-xl border-t border-lama-sky/20 mt-20">
                <div className="container mx-auto px-6 py-12">
                    {/* عنوان الفوتر */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: '#371E13' }}>تواصل معنا</h2>
                        <div className="w-20 h-1 rounded-full mx-auto"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* للاستفسار (اتصل بـ) */}
                        <div>
                            <h4 className="font-bold text-lg mb-4" style={{ color: '#371E13' }}>للاستفسار (اتصل بـ)</h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2" style={{ color: '#371E13' }}>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                    <span>218-92-1448222+</span>
                                </p>
                                <p className="flex items-center gap-2" style={{ color: '#371E13' }}>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                    <span>218-91-1448222+</span>
                                </p>
                            </div>
                        </div>

                        {/* تفاصيل الموقع */}
                        <div>
                            <h4 className="font-bold text-lg mb-4" style={{ color: '#371E13' }}>تفاصيل الموقع</h4>
                            <p className="mb-4 leading-relaxed flex items-start gap-2" style={{ color: '#371E13' }}>
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="#7F5539" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <span>جزيرة سوق الثلاثاء بالقرب من مركز العزل، طرابلس، ليبيا</span>
                            </p>
                            <div className="rounded-lg h-48 overflow-hidden border border-[#7F5539]/20 group">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13350.234567890!2d13.1861111!3d32.8925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z2YXYsdmD2LIg2KfZhNi52LLZhCAtINi32LHYp9io2YTYsyDYjCDZhNmK2KjZitin!5e0!3m2!1sar!2sly!4v1647123456789!5m2!1sar!2sly"
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true}
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="موقع المعهد المتوسط للدراسات الإسلامية - طرابلس، ليبيا"
                                    className="group-hover:scale-105 transition-transform duration-300"
                                ></iframe>
                            </div>
                        </div>

                        {/* مواقع التواصل */}
                        <div>
                            <h4 className="font-bold text-lg mb-4" style={{ color: '#371E13' }}>مواقع التواصل</h4>
                            <p className="mb-4" style={{ color: '#371E13' }}>تابعنا على:</p>
                            <div className="flex gap-4">
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
                        </div>
                    </div>

                    {/* خط الفصل */}
                    <div className="border-t border-lama-sky/20 mt-12 pt-8 text-center">
                        <p style={{ color: '#371E13' }}>
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


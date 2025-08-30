"use client";

import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            console.log('=== DEBUG INFO ===');
            console.log('User object:', user);
            console.log('Public metadata:', user?.publicMetadata);
            console.log('User ID:', user?.id);

            const role = user?.publicMetadata?.role;
            console.log('Extracted role:', role);

            if (role) {
                console.log('Role found, redirecting...');
                setIsLoading(true);
                setTimeout(() => {
                    const redirectUrl = searchParams.get('redirect_url');
                    const targetUrl = redirectUrl || `/${role}`;
                    console.log('Redirecting to:', targetUrl);
                    router.replace(targetUrl);
                }, 500);
            } else {
                console.log('❌ NO ROLE FOUND!');
                console.log('This means the user has no role in publicMetadata');
            }
        }
    }, [isLoaded, isSignedIn, user, router, searchParams]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #FCFAF8 0%, #F7F3EE 25%, #F0E6D6 75%, #E2D5C7 100%)'
                }}>

                {/* Background Animation */}
                <div className="absolute inset-0">
                    {/* Animated Orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
                        style={{ backgroundColor: '#D2B48C' }}></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
                        style={{ backgroundColor: '#B8956A', animationDelay: '2s' }}></div>
                    <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
                        style={{ backgroundColor: '#F0E6D6', animationDelay: '4s' }}></div>

                    {/* Floating Particles */}
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-ping opacity-40"
                            style={{
                                backgroundColor: i % 2 === 0 ? '#D2B48C' : '#B8956A',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Loading Content */}
                <div className="relative z-10 text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-transparent rounded-full animate-spin mx-auto"
                            style={{
                                borderTopColor: '#D2B48C',
                                borderRightColor: '#B8956A'
                            }}></div>
                        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-spin mx-auto"
                            style={{
                                borderBottomColor: '#F0E6D6',
                                borderLeftColor: '#E2D5C7',
                                animationDirection: 'reverse',
                                animationDuration: '2s'
                            }}></div>
                        <div className="absolute inset-2 w-20 h-20 border-2 border-transparent rounded-full animate-spin mx-auto"
                            style={{
                                borderTopColor: '#B8956A',
                                borderRightColor: '#D2B48C',
                                animationDuration: '1.5s'
                            }}></div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold mb-2 animate-pulse" style={{ color: '#B8956A' }}>
                            جاري تسجيل الدخول...
                        </h2>
                        <p style={{ color: '#D2B48C' }}>يرجى الانتظار قليلاً، نحن نتحقق من هويتك</p>

                        <div className="flex justify-center gap-2 mt-6">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 rounded-full animate-bounce"
                                    style={{
                                        backgroundColor: '#D2B48C',
                                        animationDelay: `${i * 0.2}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #FCFAF8 0%, #F7F3EE 25%, #F0E6D6 75%, #E2D5C7 100%)'
            }}>

            {/* Dynamic Background Effects */}
            <div className="absolute inset-0">
                {/* Animated Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#D2B48C' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#B8956A', animationDelay: '2s' }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
                    style={{ backgroundColor: '#F0E6D6', animationDelay: '4s' }}></div>

                {/* Interactive Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(210, 180, 140, 0.4) 0%, transparent 50%)`,
                        backgroundSize: '80px 80px'
                    }}
                ></div>

                {/* Islamic Geometric Pattern */}
                <div className="absolute inset-0 opacity-8">
                    <div className="absolute top-20 right-20 w-32 h-32 border-2 rotate-45 animate-pulse"
                        style={{ borderColor: '#D2B48C' }}></div>
                    <div className="absolute top-20 right-20 w-32 h-32 border-2 rotate-45"
                        style={{ borderColor: '#D2B48C', transform: 'rotate(45deg) scale(0.7)' }}></div>
                    <div className="absolute bottom-20 left-20 w-32 h-32 border-2 rotate-45 animate-pulse"
                        style={{ borderColor: '#B8956A' }}></div>
                    <div className="absolute bottom-20 left-20 w-32 h-32 border-2 rotate-45"
                        style={{ borderColor: '#B8956A', transform: 'rotate(45deg) scale(0.7)' }}></div>
                </div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-ping opacity-30"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#D2B48C' : '#B8956A',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#B8956A',
                    border: '1px solid rgba(210, 180, 140, 0.3)'
                }}
            >
                <span>🏠</span>
                <span className="hidden sm:inline">العودة للرئيسية</span>
            </Link>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-lg mx-auto p-4">
                {/* Main Glass Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full relative overflow-hidden group hover:bg-white/85 transition-all duration-500"
                    style={{
                        border: '1px solid rgba(210, 180, 140, 0.3)',
                        boxShadow: '0 25px 50px -12px rgba(184, 149, 106, 0.25)'
                    }}>

                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2), rgba(240, 230, 214, 0.2))' }}></div>

                    {/* Card Background Patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-40"
                        style={{ background: 'linear-gradient(135deg, #F0E6D6, #D2B48C)' }}></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 opacity-40"
                        style={{ background: 'linear-gradient(135deg, #E2D5C7, #F0E6D6)' }}></div>

                    {/* App Icon and Header */}
                    <div className="text-center mb-6 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300 p-2 relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>

                            {/* Rotating Ring around Logo */}
                            <div className="absolute inset-0 border-2 rounded-3xl animate-spin opacity-50"
                                style={{
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    animationDuration: '4s'
                                }}></div>

                            {/* Logo Container */}
                            <div className="w-full h-full relative rounded-2xl overflow-hidden z-10 bg-white/90">
                                <Image
                                    src="/icons/logo.png"
                                    alt="البيان"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #B8956A, #D2B48C)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                أهلاً وسهلاً بعودتك
                            </h1>
                            <p style={{ color: '#B8956A' }}>قم بتسجيل الدخول للوصول إلى حسابك في النظام</p>
                        </div>
                    </div>

                    {/* Clerk SignIn Component with Enhanced Styling */}
                    <div className="w-full relative z-10">
                        <SignIn
                            appearance={{
                                elements: {
                                    // Primary Button (Login Button)
                                    formButtonPrimary: `
                    background: linear-gradient(135deg, #D2B48C, #B8956A) !important;
                    color: white !important;
                    font-weight: 700 !important;
                    padding: 16px 24px !important;
                    border-radius: 16px !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 10px 25px -5px rgba(184, 149, 106, 0.4) !important;
                    border: none !important;
                    width: 100% !important;
                    transform: scale(1) !important;
                    position: relative !important;
                    overflow: hidden !important;
                  `,

                                    // Input Fields
                                    formFieldInput: `
                    width: 100% !important;
                    border: 2px solid rgba(240, 230, 214, 0.6) !important;
                    border-radius: 16px !important;
                    padding: 16px !important;
                    text-align: right !important;
                    background: rgba(255, 255, 255, 0.7) !important;
                    backdrop-filter: blur(10px) !important;
                    transition: all 0.3s ease !important;
                    color: #B8956A !important;
                    font-size: 16px !important;
                  `,

                                    // Labels
                                    formFieldLabel: `
                    display: block !important;
                    color: #B8956A !important;
                    font-weight: 600 !important;
                    margin-bottom: 8px !important;
                    text-align: right !important;
                    font-size: 14px !important;
                  `,

                                    // Card Container
                                    card: `
                    box-shadow: none !important;
                    background: transparent !important;
                    border: none !important;
                  `,

                                    // Hide default headers
                                    headerTitle: "display: none !important;",
                                    headerSubtitle: "display: none !important;",

                                    // Social buttons
                                    socialButtonsBlockButton: `
                    background: rgba(240, 230, 214, 0.6) !important;
                    color: #B8956A !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    border-radius: 12px !important;
                    transition: all 0.3s ease !important;
                    border: 1px solid rgba(210, 180, 140, 0.3) !important;
                    width: 100% !important;
                    margin-bottom: 8px !important;
                  `,

                                    // Divider
                                    dividerLine: `
                    background: linear-gradient(to right, transparent, rgba(210, 180, 140, 0.5), transparent) !important;
                    height: 1px !important;
                  `,
                                    dividerText: `
                    color: #D2B48C !important;
                    font-weight: 500 !important;
                    background: rgba(255, 255, 255, 0.8) !important;
                    padding: 0 16px !important;
                  `,

                                    // Footer links
                                    footerActionLink: `
                    color: #D2B48C !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                    text-decoration: none !important;
                  `,
                                    footerAction: "text-align: center !important;",

                                    // Error messages
                                    formFieldError: `
                    color: #ef4444 !important;
                    font-size: 12px !important;
                    text-align: right !important;
                    margin-top: 4px !important;
                  `,

                                    // Input focus states
                                    "formFieldInput:focus": `
                    border-color: #D2B48C !important;
                    box-shadow: 0 0 0 3px rgba(210, 180, 140, 0.2) !important;
                  `,

                                    // Button hover states
                                    "formButtonPrimary:hover": `
                    background: linear-gradient(135deg, #B8956A, #D2B48C) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 15px 35px -5px rgba(184, 149, 106, 0.5) !important;
                  `,

                                    "socialButtonsBlockButton:hover": `
                    background: rgba(240, 230, 214, 0.8) !important;
                    transform: translateY(-1px) !important;
                  `,

                                    "footerActionLink:hover": `
                    color: #B8956A !important;
                  `
                                }
                            }}
                        />
                    </div>

                    {/* Enhanced Footer */}
                    <div className="mt-6 pt-4 relative z-10"
                        style={{ borderTop: '1px solid rgba(240, 230, 214, 0.6)' }}>
                        <div className="text-center space-y-4">
                            <p className="text-base font-medium" style={{ color: '#B8956A' }}>
                                نظام إدارة المعهد المتوسط للدراسات الإسلامية
                            </p>

                            {/* Status Indicators */}
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ backgroundColor: '#D2B48C' }}></div>
                                    <span className="text-xs font-medium" style={{ color: '#B8956A' }}>متصل</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ backgroundColor: '#B8956A', animationDelay: '0.5s' }}></div>
                                    <span className="text-xs font-medium" style={{ color: '#B8956A' }}>آمن</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full animate-pulse"
                                        style={{ backgroundColor: '#F0E6D6', animationDelay: '1s' }}></div>
                                    <span className="text-xs font-medium" style={{ color: '#B8956A' }}>محدث</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Additional Info Card */}
                <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center relative overflow-hidden group"
                    style={{ border: '1px solid rgba(240, 230, 214, 0.5)' }}>

                    {/* Card hover effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' }}></div>

                    <div className="relative z-10">
                        <p className="text-sm font-medium" style={{ color: '#B8956A' }}>
                            <span className="inline-flex items-center gap-2 mx-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B8956A' }}></span>
                                أمان عالي
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="inline-flex items-center gap-2 mx-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D2B48C' }}></span>
                                سهولة الاستخدام
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="inline-flex items-center gap-2 mx-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F0E6D6' }}></span>
                                دعم فني 24/7
                            </span>
                        </p>
                    </div>
                </div>

                {/* Version and Copyright */}
                <div className="mt-4 text-center">
                    <p className="text-xs" style={{ color: 'rgba(184, 149, 106, 0.6)' }}>
                        النسخة 2.0.1 • © 2025 المعهد المتوسط للدراسات الإسلامية • جميع الحقوق محفوظة
                    </p>
                </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-8 right-8 w-24 h-24 border-2 rounded-full animate-spin opacity-20"
                style={{
                    borderColor: 'rgba(210, 180, 140, 0.4)',
                    animationDuration: '12s'
                }}></div>
            <div className="absolute bottom-8 left-8 w-20 h-20 border-2 rounded-full animate-spin opacity-20"
                style={{
                    borderColor: 'rgba(184, 149, 106, 0.5)',
                    animationDuration: '15s',
                    animationDirection: 'reverse'
                }}></div>

            {/* Additional floating elements */}
            <div className="absolute top-1/4 left-8 w-6 h-6 rounded-full animate-bounce opacity-30"
                style={{
                    backgroundColor: '#D2B48C',
                    animationDelay: '1s',
                    animationDuration: '3s'
                }}></div>
            <div className="absolute bottom-1/3 right-12 w-4 h-4 rounded-full animate-bounce opacity-30"
                style={{
                    backgroundColor: '#B8956A',
                    animationDelay: '2s',
                    animationDuration: '2.5s'
                }}></div>
        </div>
    );
};

export default LoginPage;

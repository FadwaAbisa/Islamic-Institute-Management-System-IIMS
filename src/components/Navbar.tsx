"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('/');

  const { isSignedIn, user } = useUser();
  const router = useRouter();
  
  // الحصول على pathname بشكل آمن
  useEffect(() => {
    try {
      const currentPathname = window.location.pathname;
      setPathname(currentPathname);
      
      // مراقبة تغيير الصفحة
      const handleRouteChange = () => {
        setPathname(window.location.pathname);
      };
      
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    } catch (error) {
      console.warn('Error getting pathname:', error);
    }
  }, []);



  // مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // حالة القوائم المنسدلة
  const [dropdownStates, setDropdownStates] = useState({
    aboutInstitute: false,
    academicPortal: false
  });

  // عناصر القائمة الرئيسية
  const navItems = [
    { name: 'الرئيسية', href: '/' },
    {
      name: 'عن المعهد',
      href: '#',
      dropdown: 'aboutInstitute',
      submenu: [
        { name: 'التعريف بالمعهد', href: '/about/introduction' },
        { name: 'رؤية المعهد', href: '/about/vision' },
        { name: 'أهداف المعهد', href: '/about/goals' }
      ]
    },
    {
      name: 'البوابة العلمية',
      href: '#',
      dropdown: 'academicPortal',
      submenu: [
        { name: 'التعريف بالبوابة العلمية', href: '/academic/portal' },
        { name: 'البرامج الدراسية', href: '/academic/programs' },
        { name: 'التقويم الدراسي', href: '/academic/calendar' },
        { name: 'التسجيل بالمعهد', href: '/academic/register' }
      ]
    },
    { name: 'اللوائح والنظم', href: '/regulations' },
    { name: 'المركز الإعلامي', href: '/media-center' },
    { name: 'تواصل معنا', href: '/contact' },
    { name: 'تسجيل الدخول', href: '/login', isLoginButton: true }
  ];

  // إدارة القوائم المنسدلة
  const toggleDropdown = (dropdownName: string) => {
    setDropdownStates(prev => {
      // إذا كانت القائمة المطلوبة مفتوحة، أغلقها
      if (prev[dropdownName as keyof typeof prev]) {
        return {
          ...prev,
          [dropdownName]: false
        };
      }
      
      // إذا كانت القائمة المطلوبة مغلقة، أغلق جميع القوائم الأخرى وافتح هذه
      return {
        aboutInstitute: dropdownName === 'aboutInstitute',
        academicPortal: dropdownName === 'academicPortal'
      };
    });
  };

  const closeAllDropdowns = () => {
    setDropdownStates({
      aboutInstitute: false,
      academicPortal: false
    });
  };

  // التعامل مع تسجيل الخروج
  const handleLogout = () => {
    router.push('/logout');
  };

  // التعامل مع تسجيل الدخول
  const handleLogin = () => {
    if (pathname === '/') {
      router.push('/login');
    } else {
      router.push(`/login?redirect_url=${encodeURIComponent(pathname)}`);
    }
  };

  // التوجه للداشبورد حسب الدور
  const handleDashboard = () => {
    const role = user?.publicMetadata?.role;
    if (role) {
      router.push(`/${role}`);
    }
  };

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-lama-sky/20'
      : 'bg-white/90 backdrop-blur-xl border-b border-lama-sky/10'
      }`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-3 lg:py-4">

          {/* الشعار */}
          <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
            <div className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-110 p-1 ${isScrolled ? 'w-10 h-10 lg:w-12 lg:h-12' : 'w-12 h-12 lg:w-14 lg:h-14'
              }`}
              style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>

              {/* حلقة دوارة حول الشعار */}
              <div className="absolute inset-0 border-2 rounded-2xl animate-spin opacity-30 group-hover:opacity-60 transition-opacity"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  animationDuration: '6s'
                }}></div>

              <div className="w-full h-full relative rounded-xl overflow-hidden z-10 bg-white/90">
                <Image
                  src="/icons/logo.png"
                  alt="شعار المعهد"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className={`font-bold transition-all duration-300 ${isScrolled ? 'text-base lg:text-lg' : 'text-lg lg:text-xl'
                }`} style={{ color: '#371E13' }}>
                المعهد المتوسط للدراسات الإسلامية
              </h1>
            </div>
          </Link>

          {/* قائمة التنقل الرئيسية - للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.filter(item => !item.isLoginButton).map((item) => (
              <div key={item.name} className="relative dropdown-container">
                {item.submenu ? (
                  // عنصر مع قائمة منسدلة
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(item.dropdown!)}
                      className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                      style={{
                        background: dropdownStates[item.dropdown as keyof typeof dropdownStates]
                          ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))'
                          : 'transparent'
                      }}
                    >
                      <span style={{ color: '#371E13' }} className="hover:text-lama-sky transition-colors font-medium text-sm">
                        {item.name}
                      </span>
                      <svg
                        className={`w-4 h-4 text-lama-yellow transition-transform duration-300 ${dropdownStates[item.dropdown as keyof typeof dropdownStates] ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* القائمة المنسدلة */}
                    {dropdownStates[item.dropdown as keyof typeof dropdownStates] && (
                      <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(210, 180, 140, 0.3)'
                        }}
                      >
                        {item.submenu.map((subItem, index) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={closeAllDropdowns}
                            className="flex items-center gap-3 px-4 py-3 text-lama-yellow hover:text-lama-sky transition-all duration-300 hover:scale-105"
                            style={{
                              borderBottom: index < item.submenu!.length - 1 ? '1px solid rgba(210, 180, 140, 0.2)' : 'none',
                              background: pathname === subItem.href ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' : 'transparent'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full bg-lama-sky"></span>
                            <span className="font-medium text-sm">{subItem.name}</span>
                          </Link>
                        ))}

                        {/* زر التسجيل في الأسفل للبوابة العلمية */}
                        {item.dropdown === 'academicPortal' && (
                          <div className="p-4 border-t border-lama-sky/20">
                            <Link
                              href="/academic/register"
                              onClick={closeAllDropdowns}
                              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                              style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                            >
                              <span>📝</span>
                              <span>التسجيل بالمعهد</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // عنصر عادي بدون قائمة منسدلة
                  <Link
                    href={item.href}
                    onClick={closeAllDropdowns}
                    className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: pathname === item.href ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' : 'transparent'
                    }}
                  >
                    <span style={{ color: '#371E13' }} className="hover:text-lama-sky transition-colors font-medium text-sm">
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* قسم الوقت والأزرار */}
          <div className="flex items-center gap-3 lg:gap-4">

            {/* أيقونة البحث */}
            <button className="p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:bg-lama-sky/10">
              <svg className="w-6 h-6 text-lama-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>



            {/* أزرار التحكم */}
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                {/* معلومات المستخدم */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="صورة المستخدم"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {user?.firstName?.charAt(0) || 'م'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-lama-yellow">
                      {user?.firstName || 'مستخدم'}
                    </div>
                    <div className="text-xs text-lama-sky">
                      {user?.publicMetadata?.role as string || 'ضيف'}
                    </div>
                  </div>
                </div>

                {/* زر الداشبورد */}
                <button
                  onClick={handleDashboard}
                  className="px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                >
                  الداشبورد
                </button>

                {/* زر تسجيل الخروج */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                  style={{
                    borderColor: '#D2B48C',
                    color: '#B8956A'
                  }}
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* زر تسجيل الدخول */}
                <button
                  onClick={handleLogin}
                  className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                >
                  تسجيل الدخول
                </button>
              </div>
            )}

            {/* زر القائمة المحمولة */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110"
              style={{ background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' }}
            >
              <div className="flex flex-col gap-1">
                <div className={`w-6 h-0.5 bg-lama-yellow transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}></div>
                <div className={`w-6 h-0.5 bg-lama-yellow transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                  }`}></div>
                <div className={`w-6 h-0.5 bg-lama-yellow transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* القائمة المحمولة */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen pb-4' : 'max-h-0'
          }`}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 mt-2"
            style={{ border: '1px solid rgba(210, 180, 140, 0.3)' }}>

            {/* عناصر القائمة */}
            <div className="space-y-2 mb-4">
              {navItems.filter(item => !item.isLoginButton).map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    // عنصر مع قائمة منسدلة
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.dropdown!)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                        style={{
                          background: dropdownStates[item.dropdown as keyof typeof dropdownStates]
                            ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))'
                            : 'transparent'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span style={{ color: '#371E13' }} className="font-medium">{item.name}</span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-lama-yellow transition-transform duration-300 ${dropdownStates[item.dropdown as keyof typeof dropdownStates] ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* القائمة الفرعية */}
                      {dropdownStates[item.dropdown as keyof typeof dropdownStates] && (
                        <div className="mt-2 mr-8 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                closeAllDropdowns();
                              }}
                              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                              style={{
                                background: pathname === subItem.href ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(184, 149, 106, 0.1))' : 'transparent'
                              }}
                            >
                              <span className="w-2 h-2 rounded-full bg-lama-sky"></span>
                              <span className="text-lama-yellow font-medium text-sm">{subItem.name}</span>
                            </Link>
                          ))}

                          {/* زر التسجيل للبوابة العلمية */}
                          {item.dropdown === 'academicPortal' && (
                            <Link
                              href="/academic/register"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                closeAllDropdowns();
                              }}
                              className="flex items-center justify-center gap-2 mx-4 mt-3 px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
                              style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                            >
                              <span>📝</span>
                              <span className="text-sm">التسجيل بالمعهد</span>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // عنصر عادي
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        closeAllDropdowns();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                      style={{
                        background: pathname === item.href ? 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(184, 149, 106, 0.2))' : 'transparent'
                      }}
                    >
                      <span style={{ color: '#371E13' }} className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>



            {/* معلومات المستخدم في القائمة المحمولة */}
            {isSignedIn && (
              <div className="md:hidden flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(240, 230, 214, 0.6), rgba(226, 213, 199, 0.4))' }}>
                <div className="w-12 h-12 rounded-full overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}>
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="صورة المستخدم"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                      {user?.firstName?.charAt(0) || 'م'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-lama-yellow">
                    {user?.firstName || 'مستخدم'}
                  </div>
                  <div className="text-sm text-lama-sky">
                    {(user?.publicMetadata?.role as string) || 'ضيف'}
                  </div>
                </div>
              </div>
            )}

            {/* أزرار الإجراءات في القائمة المحمولة */}
            <div className="space-y-2">
              {isSignedIn ? (
                <>
                  <button
                    onClick={() => {
                      handleDashboard();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                  >
                    الانتقال للداشبورد
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl font-semibold border-2 bg-white/80 backdrop-blur-sm transition-all duration-300"
                    style={{
                      borderColor: '#D2B48C',
                      color: '#B8956A'
                    }}
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #D2B48C, #B8956A)' }}
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مؤثر الوهج */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-50"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(210, 180, 140, 0.5), transparent)'
        }}></div>
    </nav>
  );
};

export default Navbar;